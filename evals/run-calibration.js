#!/usr/bin/env node
'use strict';

/**
 * Calibration Runner — placebo/baseline-only difficulty profiler.
 *
 * Runs candidate items through the model WITHOUT any skill guide (empty/baseline
 * condition) to measure per-item difficulty. Keeps only items whose baseline
 * accuracy falls in the 40–70% band; flags ceiling (1.0) and floor (0.0) items
 * as out-of-band. No paired skill arm — this is a pure difficulty profiler.
 *
 * Usage:
 *   EVAL_RUN=smoke LIMIT=4 node evals/run-calibration.js <dataset.jsonl> [--solver-model=claude-sonnet-4-6] [--solver-effort=high]
 *
 * Env:
 *   LIMIT                — slice first N items for smoke tests (deterministic order)
 *   K_TRIALS             — baseline solver runs per item for fractional difficulty (default: 3)
 *   EVAL_RUN             — run id for output directory (default: 'calibration')
 *   SOLVER_MODEL         — model for solving (default: claude-sonnet-4-6)
 *   SOLVER_EFFORT        — reasoning effort (default: model max)
 *   CONC                 — concurrency (default: 4)
 */

const fs = require('fs');
const path = require('path');
const { droidJsonAsync, maxEffortFor } = require('./lib/droid');
const { runDir, writeJson, mapPool } = require('./lib/io');

// ---- CLI ----
const args = process.argv.slice(2);
const datasetPath = args.find(a => !a.startsWith('--'));
const solverModelArg = args.find(a => a.startsWith('--solver-model='));
const solverEffortArg = args.find(a => a.startsWith('--solver-effort='));

if (!datasetPath) {
  console.error('Usage: node evals/run-calibration.js <dataset.jsonl> [--solver-model=MODEL] [--solver-effort=EFFORT]');
  process.exit(1);
}

const DATASET = path.resolve(datasetPath);
const SOLVER_MODEL = solverModelArg ? solverModelArg.split('=')[1] : 'claude-sonnet-4-6';
const SOLVER_EFFORT = solverEffortArg ? solverEffortArg.split('=')[1] : maxEffortFor(SOLVER_MODEL);
const K_TRIALS = parseInt(process.env.K_TRIALS || '3', 10);
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : null;
const CONC = parseInt(process.env.CONC || '4', 10);
const EVAL_RUN = process.env.EVAL_RUN || 'calibration';

function loadDataset(file) {
  const text = fs.readFileSync(file, 'utf8');
  return text.trim().split('\n').map((line, i) => {
    try { return JSON.parse(line); } catch (e) {
      throw new Error(`Invalid JSONL at line ${i + 1}: ${e.message}`);
    }
  });
}

function judgeBinary(prediction, label) {
  if (typeof prediction !== 'boolean') return null;
  return prediction === label;
}

function buildCalibrationPrompt(problemText, decisionInstruction) {
  return `${decisionInstruction}\n\nProblem:\n${problemText}\n\nReturn ONLY valid JSON: {"answer": true/false}`;
}

async function runCalibration() {
  const items = loadDataset(DATASET);
  const limitedItems = LIMIT ? items.slice(0, LIMIT) : items;
  const datasetName = path.basename(DATASET, path.extname(DATASET));

  console.log(`╔══════════════════════════════════════════════════════════════════╗`);
  console.log(`║  CALIBRATION RUN — placebo/baseline only (no skill arm)        ║`);
  console.log(`║  dataset: ${datasetName.padEnd(55)} ║`);
  console.log(`║  items: ${String(limitedItems.length).padStart(3)} / ${String(items.length).padEnd(3)} (LIMIT=${LIMIT || 'all'})`.padEnd(61) + '║');
  console.log(`║  trials/item: ${String(K_TRIALS).padEnd(50)}║`);
  console.log(`║  solver: ${SOLVER_MODEL} (${SOLVER_EFFORT})`.padEnd(61) + '║');
  console.log(`║  concurrency: ${String(CONC).padEnd(50)}║`);
  console.log(`║  run id: ${EVAL_RUN.padEnd(54)}║`);
  console.log(`╚══════════════════════════════════════════════════════════════════╝`);

  // Build a flat list of all trials (item × k), each with an itemIndex for aggregation
  const trials = [];
  for (let i = 0; i < limitedItems.length; i++) {
    for (let t = 0; t < K_TRIALS; t++) {
      trials.push({ itemIndex: i, trialIndex: t, item: limitedItems[i] });
    }
  }

  const trialResults = await mapPool(trials, CONC, async ({ itemIndex, item }) => {
    const prompt = buildCalibrationPrompt(item.prompt, item.decision_instruction);
    const r = await droidJsonAsync({ model: SOLVER_MODEL, prompt, effort: SOLVER_EFFORT });

    let correct = null;
    let prediction = null;
    let rawText = '';

    if (r.ok && r.json) {
      rawText = JSON.stringify(r.json);
      // Expect JSON response with a boolean field matching the label type
      // Try common boolean fields
      const json = r.json;
      if (typeof json.answer === 'boolean') prediction = json.answer;
      else if (typeof json.decision === 'boolean') prediction = json.decision;
      else if (typeof json.label === 'boolean') prediction = json.label;
      else if (typeof json.result === 'boolean') prediction = json.result;
      else if (typeof json.yes === 'boolean') prediction = json.yes;
      else if (typeof json.classification === 'boolean') prediction = json.classification;

      if (prediction !== null && item.label !== undefined) {
        correct = judgeBinary(prediction, item.label);
      }
    }

    return {
      id: item.id,
      itemIndex,
      prompt: item.prompt,
      label: item.label,
      prediction,
      correct,
      raw: rawText,
      ok: r.ok,
      error: r.error,
      usage: r.usage,
      durationMs: r.durationMs,
    };
  });

  // Aggregate per-item: group trials by itemIndex, compute fractional difficulty = successes / attempted
  const perItemMap = new Map();
  for (const t of trialResults) {
    if (!perItemMap.has(t.itemIndex)) {
      perItemMap.set(t.itemIndex, { id: t.id, label: t.label, predictions: [], corrects: [], trials: [] });
    }
    const entry = perItemMap.get(t.itemIndex);
    entry.trials.push(t);
    if (t.prediction !== null) {
      entry.predictions.push(t.prediction);
      entry.corrects.push(t.correct);
    }
  }

  const perItem = [];
  for (const [itemIndex, entry] of perItemMap) {
    const attempted = entry.corrects.length;
    const successes = entry.corrects.filter(c => c === true).length;
    // Fractional difficulty: successes / attempted (0 if no attempts, null if 0 < difficulty < 1)
    const baseline = attempted > 0 ? successes / attempted : null;
    perItem.push({
      id: entry.id,
      itemIndex,
      label: entry.label,
      trials: K_TRIALS,
      attempted,
      successes,
      failures: attempted - successes,
      baseline: attempted > 0 ? +baseline.toFixed(4) : null,
      predictions: entry.predictions,
    });
  }

  // Overall baseline accuracy across all trials
  const totalAttempted = perItem.reduce((s, i) => s + i.attempted, 0);
  const totalCorrect = perItem.reduce((s, i) => s + i.successes, 0);
  const baselineAccuracy = totalAttempted > 0 ? totalCorrect / totalAttempted : null;

  // Band classification (fractional difficulty from k>1 trials)
  const inBand = [];
  const ceiling = [];
  const floor = [];
  const otherOutOfBand = [];

  for (const item of perItem) {
    if (item.baseline === null) {
      otherOutOfBand.push({ ...item, band: 'unattempted' });
    } else if (item.baseline >= 0.40 && item.baseline <= 0.70) {
      inBand.push({ ...item, band: 'in-band', kept: true });
    } else if (item.baseline >= 0.999) { // ceiling: difficulty ≈ 1.0 (all trials correct)
      ceiling.push({ ...item, band: 'ceiling', kept: false });
    } else if (item.baseline <= 0.001) { // floor: difficulty ≈ 0.0 (no trials correct)
      floor.push({ ...item, band: 'floor', kept: false });
    } else {
      otherOutOfBand.push({ ...item, band: 'out-of-band', kept: false });
    }
  }

  const kept = inBand.map(i => i.id);
  const outOfBand = [...ceiling, ...floor, ...otherOutOfBand].map(i => ({ id: i.id, band: i.band, baseline: i.baseline }));

  const out = {
    tier: 'calibration',
    dataset: datasetName,
    run_id: EVAL_RUN,
    solver_model: SOLVER_MODEL,
    solver_effort: SOLVER_EFFORT,
    k_trials: K_TRIALS,
    limit: LIMIT || limitedItems.length,
    total_items: items.length,
    total_trials: trialResults.length,
    attempted_trials: totalAttempted,
    baseline_accuracy: baselineAccuracy ? +baselineAccuracy.toFixed(3) : null,
    calibration_band: [0.40, 0.70],
    summary: {
      in_band: inBand.length,
      ceiling: ceiling.length,
      floor: floor.length,
      other_out_of_band: otherOutOfBand.length,
      unattempted: perItem.filter(i => i.attempted === 0).length,
    },
    kept_item_ids: kept,
    out_of_band: outOfBand,
    items: perItem,
    raw_results: trialResults,
  };

  const outputDir = runDir();
  const outputFile = path.join(outputDir, `calibration-${datasetName}-${EVAL_RUN}.json`);
  writeJson(outputFile, out);

  console.log(`\n  k trials/item: ${K_TRIALS}`);
  console.log(`  baseline accuracy: ${baselineAccuracy ? (baselineAccuracy * 100).toFixed(1) + '%' : 'N/A'} (${totalCorrect}/${totalAttempted} trials)`);
  console.log(`  calibration band: [0.40, 0.70]`);
  console.log(`  kept (in-band): ${inBand.length}`);
  console.log(`  ceiling (≈1.0): ${ceiling.length}`);
  console.log(`  floor (≈0.0): ${floor.length}`);
  console.log(`  other out-of-band: ${otherOutOfBand.length}`);
  console.log(`  -> ${outputFile}`);

  return out;
}

runCalibration().catch(err => {
  console.error('Calibration run failed:', err);
  process.exit(1);
});
