#!/usr/bin/env node
'use strict';

/**
 * Replication Runner — enforces primary sample AND fresh replication sample.
 *
 * Guardrail: REFUSES to mark ELEVATE when replication is missing (exits non-zero
 * or emits a non-ELEVATE verdict like REPLICATION-MISSING / DIRECTIONAL-NOT-REPLICATED).
 * Yields ELEVATE only when BOTH a primary pass (>=5pp, passes paired test) AND a
 * same-direction replication pass are present; opposite-direction/failed replication
 * yields DIRECTIONAL-NOT-REPLICATED.
 *
 * Exposes a pure verdict() function so the guardrail is unit-testable offline.
 *
 * Usage:
 *   node evals/run-replication.js <primary-results.json> --replication=<replication-results.json>
 *   EVAL_RUN=smoke LIMIT=4 node evals/run-replication.js primary.jsonl --replication=replication.jsonl
 *
 * The runner accepts either:
 * - Pretty-JSON result files from objective runners (with delta_pp, mcnemar_p, significant, n)
 * - JSONL result files from paired experiments (with delta_pp, p_value, direction fields)
 * - Direct object input to verdict() for unit testing
 */

const fs = require('fs');
const path = require('path');
const { mcnemarMidp, pairedDiff } = require('./lib/stats');

/** Verdict taxonomy (must match architecture.md) */
const VERDICT = {
  ELEVATE: 'ELEVATE',
  DIRECTIONAL_NOT_REPLICATED: 'DIRECTIONAL-NOT-REPLICATED',
  NO_LIFT: 'NO-LIFT',
  QUARANTINE_REDIRECT: 'QUARANTINE-REDIRECT',
  CEILING_NEEDS_HARDER_DATA: 'CEILING-NEEDS-HARDER-DATA',
  REPLICATION_MISSING: 'REPLICATION-MISSING',
};

/**
 * Pure verdict function — no side effects, no I/O, unit-testable.
 *
 * Accepts flexible input format:
 * - delta_pp: number (required) — percentage point difference
 * - p or p_value: number (required) — p-value from paired test
 * - direction: 1|-1 (optional, inferred from delta_pp sign if missing)
 * - n: number (optional) — sample size
 *
 * @param {Object} input
 * @param {Object|null} input.primary - Primary sample result (required for ELEVATE)
 * @param {Object|null} input.replication - Fresh replication sample (required for ELEVATE)
 * @returns {string} One of VERDICT values
 */
function verdict({ primary = null, replication = null }) {
  // Guardrail: NO replication sample provided → cannot ELEVATE
  if (!replication) {
    return VERDICT.REPLICATION_MISSING;
  }

  // Normalize inputs to handle both p/p_value and infer direction
  const normPrimary = normalizeSample(primary);
  const normReplication = normalizeSample(replication);

  // Primary must exist and pass (>=5pp AND passes paired test p < 0.05)
  if (!normPrimary || !passesThreshold(normPrimary)) {
    return VERDICT.NO_LIFT;
  }

  // Replication must pass
  if (!passesThreshold(normReplication)) {
    return VERDICT.DIRECTIONAL_NOT_REPLICATED;
  }

  // Check direction consistency (sign of delta_pp)
  if (Math.sign(normPrimary.delta_pp) !== Math.sign(normReplication.delta_pp)) {
    return VERDICT.DIRECTIONAL_NOT_REPLICATED;
  }

  // Both pass and same direction → ELEVATE
  return VERDICT.ELEVATE;
}

/** Normalize sample object to internal format */
function normalizeSample(s) {
  if (!s) return null;
  const pValue = s.p_value ?? s.p;
  if (typeof pValue !== 'number') return null;
  if (typeof s.delta_pp !== 'number') return null;
  return {
    delta_pp: s.delta_pp,
    p_value: pValue,
    direction: (s.direction === 1 || s.direction === -1) ? s.direction : Math.sign(s.delta_pp) || 1,
    n: s.n,
  };
}

/**
 * Check if sample meets the ELEVATE threshold:
 * - delta_pp >= 5 (at least 5 percentage points POSITIVE lift — NEVER use Math.abs;
 *   a replicated negative delta must NOT qualify for ELEVATE)
 * - p_value < 0.05 (passes paired statistical test)
 */
function passesThreshold(s) {
  return s != null &&
    typeof s.delta_pp === 'number' &&
    s.delta_pp >= 5 &&           // POSITIVE lift only — NO Math.abs
    typeof s.p_value === 'number' &&
    s.p_value < 0.05;
}

/**
 * Parse a result file, accepting both pretty-JSON (objective-runner schema
 * with delta_pp / mcnemar_p / significant) and JSONL (one object per line).
 *
 * Pretty-JSON schema (objective runners like run-swe.js):
 *   { delta_pp, mcnemar_p, significant, n, ... }
 *
 * JSONL schema (paired experiment runners):
 *   { delta_pp, p_value, direction, n, ... } per line
 *
 * Returns normalized { delta_pp, p_value, n } or null if unparseable/empty.
 */
function parseResultsFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').trim();

  // Try pretty-JSON first (single object with delta_pp / mcnemar_p / significant)
  try {
    const obj = JSON.parse(text);
    if (typeof obj === 'object' && obj !== null && typeof obj.delta_pp === 'number') {
      const p_value = obj.mcnemar_p ?? obj.p_value ?? null;
      if (p_value !== null) {
        return {
          delta_pp: obj.delta_pp,
          p_value,
          n: obj.n ?? null,
        };
      }
    }
  } catch (e) {
    // Not valid JSON — fall through to JSONL
  }

  // Try JSONL (one JSON object per line)
  const lines = text.split('\n').filter(l => l.trim());
  const results = lines.map((line, i) => {
    try { return JSON.parse(line); } catch (e) {
      throw new Error(`Invalid JSONL at line ${i + 1}: ${e.message}`);
    }
  });

  if (results.length === 0) return null;

  // Aggregate: use mean delta_pp, combined p-value via paired stats
  // For simplicity, take the first result's paired test result
  // (in practice, this would aggregate across items)
  const first = results[0];
  return {
    delta_pp: first.delta_pp ?? 0,
    p_value: first.p_value ?? first.mcnemar_p ?? 1,
    n: first.n ?? results.length,
  };
}

/** CLI entry point */
async function main() {
  const args = process.argv.slice(2);
  const primaryPath = args.find(a => !a.startsWith('--'));
  const replicationPath = args.find(a => a.startsWith('--replication='))?.split('=')[1];

  if (!primaryPath) {
    console.error('Usage: node evals/run-replication.js <primary-results.json> [--replication=<replication-results.json>]');
    console.error('  Accepts pretty-JSON (delta_pp/mcnemar_p/significant) or JSONL');
    process.exit(1);
  }

  const primary = parseResultsFile(path.resolve(primaryPath));
  const replication = replicationPath ? parseResultsFile(path.resolve(replicationPath)) : null;

  const v = verdict({ primary, replication });
  console.log(`VERDICT: ${v}`);

  // Exit non-zero for non-ELEVATE verdicts (guardrail enforcement)
  if (v !== VERDICT.ELEVATE) {
    process.exit(1);
  }
}

module.exports = { verdict, VERDICT, parseResultsFile, passesThreshold, normalizeSample };

if (require.main === module) {
  main().catch(e => { console.error(e); process.exit(1); });
}
