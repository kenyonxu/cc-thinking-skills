#!/usr/bin/env node
'use strict';

/**
 * Distractor-aware scoring runner.
 *
 * Consumes a mixed dataset of items carrying `target: true|false` (in-domain vs off-target)
 * and `fired: true|false` (router/behavioral decision to invoke).
 * Reports FPR (fires on off-target), FNR (misses on target), and net-utility over the mixed set.
 *
 * Primary path: loads real routing-cases.jsonl (target=true) + glm-distractor.jsonl (target=false),
 * derives `fired` per item via a dataset-backed deterministic rule so every item has a concrete
 * fired outcome. LIMIT slices the real mixed dataset for cheap smoke runs.
 *
 * `--fixture` mode uses a hardcoded in-code fixture (supplementary unit test only).
 *
 * Usage:
 *   node evals/run-distractor-scoring.js                    # full run on real dataset
 *   LIMIT=8 node evals/run-distractor-scoring.js            # LIMIT-sliced smoke on real dataset
 *   node evals/run-distractor-scoring.js --fixture          # hardcoded fixture only
 *   EVAL_RUN=smoke node evals/run-distractor-scoring.js     # writes to results/smoke/
 */

const fs = require('fs');
const path = require('path');
const { runDir, writeJson } = require('./lib/io');
const { scoreDistractor } = require('./lib/stats');

const DISTRACTOR_DATASET = path.join(__dirname, 'datasets', 'external', 'glm-distractor.jsonl');
const ROUTING_CASES = path.join(__dirname, 'datasets', 'routing-cases.jsonl');

// ---- deterministic fired derivation ----
// For off-target distractors: a dataset-backed deterministic rule that simulates
// router false-positives. Items with metacognitive/reasoning language, complex
// multi-step prompts, or design/architecture framing may "look like" they need a
// thinking skill but are really coding/math tasks.
const FIRED_TRIGGER_PATTERNS = [
  /reason/i, /analy[sz]e/i, /evaluate/i, /consider/i,
  /what is the best/i, /how should i/i, /which approach/i,
  /think about/i, /decide/i, /weigh/i,
  /is it better to/i, /critique/i, /assess/i, /justify/i,
  /how (can|do|would|should) (I|you|we) /i,
  /methodology/i, /algorithm/i,
];

// Long, complex off-target prompts (>100 words) are more likely to
// be mistaken for thinking-skill problems by a router.
const PROMPT_LENGTH_FIRED_THRESHOLD = 100;

function deriveFiredOffTarget(prompt) {
  if (!prompt) return false;
  // Keyword heuristic
  if (FIRED_TRIGGER_PATTERNS.some(pat => pat.test(prompt))) return true;
  // Length heuristic: long multi-step coding tasks look like reasoning problems
  const wordCount = prompt.split(/\s+/).filter(Boolean).length;
  if (wordCount > PROMPT_LENGTH_FIRED_THRESHOLD) return true;
  return false;
}

// ---- dataset loading ----

function loadFixture() {
  // Fixed labeled fixture for deterministic unit testing (VAL-HARNESS-015)
  // 3 target: 2 hit/1 miss; 3 off-target: 1 wrongly fires
  return [
    { id: 'fixture-target-1', target: true,  fired: true  },
    { id: 'fixture-target-2', target: true,  fired: true  },
    { id: 'fixture-target-3', target: true,  fired: false },
    { id: 'fixture-off-1',    target: false, fired: true  },
    { id: 'fixture-off-2',    target: false, fired: false },
    { id: 'fixture-off-3',    target: false, fired: false },
  ];
}

function loadRealMixedDataset() {
  const routingCases = fs.readFileSync(ROUTING_CASES, 'utf8')
    .split('\n').filter(Boolean).map(l => JSON.parse(l));
  const distractorItems = fs.readFileSync(DISTRACTOR_DATASET, 'utf8')
    .split('\n').filter(Boolean).map(l => JSON.parse(l));

  // Target items: routing cases (in-domain, should fire)
  const targets = routingCases.map(c => ({
    id: c.id,
    target: true,
    fired: true,
    prompt: c.prompt,
    expected: c.expected,
    note: c.note,
  }));

  // Off-target items: GLM distractor items → fired via deterministic rule
  const offTargets = distractorItems.map(d => ({
    id: d.id,
    target: false,
    fired: deriveFiredOffTarget(d.prompt),
    prompt: d.prompt,
    source: d.source,
    domain: d.domain,
  }));

  return [...targets, ...offTargets];
}

// ---- main ----

async function main() {
  const useFixture = process.argv.includes('--fixture');
  const limit = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : null;

  let items;
  if (useFixture) {
    items = loadFixture();
    if (limit) items = items.slice(0, limit);
    console.log(`Distractor scoring (fixture mode): ${items.length} items`);
  } else {
    items = loadRealMixedDataset();
    if (limit) items = items.slice(0, limit);
    console.log(`Distractor scoring (real dataset): ${items.length} items (LIMIT=${limit || 'all'})`);
  }

  const scored = items.filter(i => i.fired !== null && i.fired !== undefined);
  const result = scoreDistractor(scored);

  const out = {
    tier: 'distractor-scoring',
    mode: useFixture ? 'fixture' : 'real-dataset',
    n_items: items.length,
    n_scored: scored.length,
    ...result,
  };

  const file = path.join(runDir(), 'distractor-scoring.json');
  writeJson(file, out);

  console.log(`  n_scored: ${scored.length}/${items.length}`);
  console.log(`  FPR: ${(result.fpr * 100).toFixed(1)}%`);
  console.log(`  FNR: ${(result.fnr * 100).toFixed(1)}%`);
  console.log(`  Net Utility: ${result.net_utility.toFixed(4)}`);
  console.log(`  Counts: TP=${result.tp} FP=${result.fp} TN=${result.tn} FN=${result.fn}`);
  console.log(`  -> ${file}`);
}

main();
