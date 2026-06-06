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
 *   EVAL_RUN=smoke LIMIT=4 node evals/run-calibration.js <dataset.jsonl> [--solver-model=claude-sonnet-4-6] [--solver-effort=high] [--batch] [--batch-size=5] [--label-field=answer]
 *
 * Env:
 *   LIMIT                — slice first N items for smoke tests (deterministic order)
 *   K_TRIALS             — baseline solver runs per item for fractional difficulty (default: 5)
 *   EVAL_RUN             — run id for output directory (default: 'calibration')
 *   SOLVER_MODEL         — model for solving (default: claude-sonnet-4-6)
 *   SOLVER_EFFORT        — reasoning effort (default: model max)
 *   CONC                 — concurrency (default: 4)
 *
 * Batch mode (--batch):
 *   Processes items in small batches with incremental progress-saving to a
 *   partial-results file. If API timeouts interrupt the run, completed batches
 *   are preserved and can be resumed.
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
const labelFieldArg = args.find(a => a.startsWith('--label-field='));
const batchSizeArg = args.find(a => a.startsWith('--batch-size='));
const BATCH_MODE = args.includes('--batch');

if (!datasetPath) {
  console.error('Usage: node evals/run-calibration.js <dataset.jsonl> [--solver-model=MODEL] [--solver-effort=EFFORT] [--batch] [--batch-size=N] [--label-field=FIELD]');
  process.exit(1);
}

const DATASET = path.resolve(datasetPath);
const SOLVER_MODEL = solverModelArg ? solverModelArg.split('=')[1] : 'claude-sonnet-4-6';
const SOLVER_EFFORT = solverEffortArg ? solverEffortArg.split('=')[1] : maxEffortFor(SOLVER_MODEL);
const LABEL_FIELD = labelFieldArg ? labelFieldArg.split('=')[1] : null;
const K_TRIALS = parseInt(process.env.K_TRIALS || '5', 10);
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : null;
const CONC = parseInt(process.env.CONC || '4', 10);
const EVAL_RUN = process.env.EVAL_RUN || 'calibration';
const BATCH_SIZE = batchSizeArg ? parseInt(batchSizeArg.split('=')[1], 10) : 5;

function loadDataset(file) {
  const text = fs.readFileSync(file, 'utf8');
  return text.trim().split('\n').map((line, i) => {
    try { return JSON.parse(line); } catch (e) {
      throw new Error(`Invalid JSONL at line ${i + 1}: ${e.message}`);
    }
  });
}

// ---- Label normalization ----
// Pools use different field names for the ground-truth label.
// When --label-field is set, use that field exclusively.
function normalizeLabel(item) {
  if (LABEL_FIELD) {
    const raw = item[LABEL_FIELD];
    if (raw === undefined || raw === null) return null;
    // Detect type from content
    if (typeof raw === 'boolean') return { raw, type: 'boolean', field: LABEL_FIELD };
    if (Array.isArray(raw)) return { raw, type: 'filepath', field: LABEL_FIELD };
    const s = String(raw);
    if (/^[A-Ea-e]$/.test(s.trim())) return { raw: s.trim(), type: 'choice', field: LABEL_FIELD };
    if (/^(yes|no)$/i.test(s.trim())) return { raw: s.trim(), type: 'yesno', field: LABEL_FIELD };
    return { raw: s.trim(), type: 'string', field: LABEL_FIELD };
  }
  // Priority: label (boolean) > answer (Yes/No string) > answer_idx (A-E string) > gold_files (string list)
  if (item.label !== undefined && item.label !== null) return { raw: item.label, type: typeof item.label === 'boolean' ? 'boolean' : 'string', field: 'label' };
  if (item.answer !== undefined && item.answer !== null) return { raw: item.answer, type: 'yesno', field: 'answer' };
  if (item.answer_idx !== undefined && item.answer_idx !== null) return { raw: item.answer_idx, type: 'choice', field: 'answer_idx' };
  if (item.gold_files !== undefined && item.gold_files !== null) return { raw: item.gold_files, type: 'filepath', field: 'gold_files' };
  return null; // no label — judge-only or distractor without ground truth
}

// ---- Prediction parsing ----
// The model returns JSON. We also handle "ANSWER: <value>" text format
// which some decision instructions request.
const ANSWER_LINE_RE = /\bANSWER\s*:\s*(.+)$/im;

function parsePrediction(json, rawText) {
  if (!json) {
    // Try to extract ANSWER: pattern from raw text
    if (rawText) {
      const m = rawText.match(ANSWER_LINE_RE);
      if (m) return { value: m[1].trim(), type: 'string', ok: true };
    }
    return { value: null, ok: false };
  }

  // Boolean fields (answer, decision, label, result, yes, classification, answerable)
  for (const key of ['answer', 'decision', 'label', 'result', 'yes', 'classification', 'answerable']) {
    if (typeof json[key] === 'boolean') return { value: json[key], type: 'boolean', ok: true };
  }

  // String fields — answer (Yes/No), answer_idx (A-E), file/result (file path)
  for (const key of ['answer', 'answer_idx', 'result', 'file', 'files', 'path']) {
    if (typeof json[key] === 'string' && json[key].trim().length > 0) {
      return { value: json[key].trim(), type: 'string', ok: true };
    }
  }

  // Array fields — gold_files, files
  for (const key of ['gold_files', 'files', 'answer']) {
    if (Array.isArray(json[key]) && json[key].length > 0) {
      return { value: json[key], type: 'array', ok: true };
    }
  }

  // Fallback: try ANSWER: pattern on the stringified JSON
  const str = JSON.stringify(json);
  const m = str.match(ANSWER_LINE_RE);
  if (m) return { value: m[1].trim(), type: 'string', ok: true };

  // Fallback: try ANSWER: pattern in the raw text (model may have returned JSON
  // wrapper around a text answer, or the raw text may contain the answer line
  // that wasn't captured by JSON field iteration).
  if (rawText) {
    const rm = rawText.match(ANSWER_LINE_RE);
    if (rm) return { value: rm[1].trim(), type: 'string', ok: true };
  }

  return { value: null, ok: false };
}

// ---- Judgment ----
// Compares prediction to expected label, handling different formats.
function judgePrediction(predParsed, normLabel) {
  if (!predParsed.ok || !normLabel) return null;

  if (normLabel.type === 'boolean') {
    // Compare boolean prediction to boolean label.
    // Handle both boolean values and Yes/No string values.
    if (predParsed.type === 'boolean') return predParsed.value === normLabel.raw;
    if (predParsed.type === 'string') {
      const s = predParsed.value.toLowerCase();
      if (s === 'yes' || s === 'true') return normLabel.raw === true;
      if (s === 'no' || s === 'false') return normLabel.raw === false;
      return null;
    }
    return null;
  }

  if (normLabel.type === 'yesno') {
    // Compare prediction to "Yes"/"No" label
    const predBool = predParsed.type === 'boolean' ? predParsed.value :
      (typeof predParsed.value === 'string' && predParsed.value.toLowerCase() === 'yes' ? true :
       typeof predParsed.value === 'string' && predParsed.value.toLowerCase() === 'no' ? false : null);
    if (predBool === null) return null;
    const labelBool = normLabel.raw.toLowerCase() === 'yes';
    return predBool === labelBool;
  }

  if (normLabel.type === 'choice') {
    // Compare prediction string (e.g. "A") to answer_idx (e.g. "A")
    if (predParsed.type === 'string') {
      return predParsed.value.toUpperCase() === normLabel.raw.toUpperCase();
    }
    // Also support boolean-keyed answer: {"A": true, "B": false, ...}
    if (predParsed.type === 'boolean' && normLabel.raw.toUpperCase() === 'A') {
      // Must check all possible choice letters
      return null; // ambiguous without knowing the full choice set
    }
    return null;
  }

  if (normLabel.type === 'filepath') {
    // Compare predicted file path to gold_files list
    const goldFiles = Array.isArray(normLabel.raw) ? normLabel.raw : [normLabel.raw];
    if (predParsed.type === 'string') {
      return goldFiles.some(gf => {
        const normPred = predParsed.value.replace(/^\/+/, '').replace(/\\/g, '/');
        const normGold = String(gf).replace(/^\/+/, '').replace(/\\/g, '/');
        return normPred === normGold || normPred.endsWith(normGold) || normGold.endsWith(normPred);
      });
    }
    if (predParsed.type === 'array') {
      const predFiles = predParsed.value.map(f => String(f).replace(/^\/+/, '').replace(/\\/g, '/'));
      return goldFiles.some(gf => {
        const normGold = String(gf).replace(/^\/+/, '').replace(/\\/g, '/');
        return predFiles.some(pf => pf === normGold || pf.endsWith(normGold) || normGold.endsWith(pf));
      });
    }
    return null;
  }

  return null;
}

// ---- Prompt truncation ----
// Long code-context prompts (e.g., SWE-bench) can cause API timeouts.
// Truncate the middle of the prompt to keep it within a reasonable length
// while preserving the beginning (issue description) and end (code snippets).
const MAX_PROMPT_LEN = 1600;

function truncatePrompt(prompt, maxLen = MAX_PROMPT_LEN) {
  if (!prompt || prompt.length <= maxLen) return prompt;
  const keepStart = Math.floor(maxLen * 0.45); // preserve ~45% at the start
  const keepEnd = Math.floor(maxLen * 0.45);   // preserve ~45% at the end
  const start = prompt.slice(0, keepStart);
  const end = prompt.slice(prompt.length - keepEnd);
  const omitted = prompt.length - keepStart - keepEnd;
  // Find a clean break point for the start section
  const lastNewline = start.lastIndexOf('\n');
  const cleanStart = lastNewline > keepStart * 0.7 ? start.slice(0, lastNewline) : start;
  const firstNewline = end.indexOf('\n');
  const cleanEnd = firstNewline > 0 && firstNewline < keepEnd * 0.3 ? end.slice(firstNewline + 1) : end;
  return `${cleanStart}\n\n[...truncated ${omitted} chars...]\n\n${cleanEnd}`;
}

function buildCalibrationPrompt(problemText, decisionInstruction) {
  // Strip the ANSWER: format instruction from the problem text since we add our
  // own format instruction. Conflicting format signals (ANSWER: vs JSON) cause
  // the model to follow the embedded text instruction and return non-JSON text
  // that droidJsonAsync cannot parse.
  let cleanProblem = problemText;
  // Remove trailing "End with exactly: ANSWER: ..." from the problem text
  // (SWE-bench items embed the decision instruction inside the prompt field).
  cleanProblem = cleanProblem.replace(/\n*\s*End\s+with\s+exactly\s*:\s*ANSWER\s*:.+\s*$/im, '');

  // Construct a single, unambiguous instruction.
  // Use a descriptive key name, not a literal placeholder like "<path/to/file.ext>"
  // which the model may return verbatim.
  let instruction = decisionInstruction;
  // If the original instruction references ANSWER:, generalize it for JSON.
  const answerMatch = instruction.match(/End\s+with\s+exactly\s*:\s*ANSWER\s*:\s*(.+)/i);
  if (answerMatch) {
    // Replace only the "End with exactly: ANSWER: <placeholder>" part with a clean
    // JSON instruction. Keep the substantive question text.
    instruction = instruction.replace(/\s*End\s+with\s+exactly\s*:\s*ANSWER\s*:.+\s*$/i, '');
    instruction += '\n\nReturn ONLY valid JSON. Use the key "answer" for your file path. Example: {"answer": "path/to/file.ext"}';
  }

  // Check if the instruction already has JSON guidance (avoid duplication).
  const hasJsonInstruction = /return\s+only\s+valid\s+json/i.test(instruction) ||
    /\{"\w+":/i.test(instruction);

  if (hasJsonInstruction) {
    return `${instruction}\n\nProblem:\n${cleanProblem}`;
  }
  return `${instruction}\n\nProblem:\n${cleanProblem}\n\nReturn ONLY valid JSON with your answer.`;
}

// ---- Shared trial processing ----
async function processItemTrial(item, itemIndex) {
  const normLabel = normalizeLabel(item);
  const rawPrompt = buildCalibrationPrompt(item.prompt, item.decision_instruction);

  // For filepath items (SWE-bench fault localization), skip truncation:
  // MAX_PROMPT_LEN=1600 strips the code context needed to localize bugs.
  const isFilepathItem = normLabel && normLabel.type === 'filepath';
  const prompt = isFilepathItem ? rawPrompt : truncatePrompt(rawPrompt);

  const r = await droidJsonAsync({ model: SOLVER_MODEL, prompt, effort: SOLVER_EFFORT });

  let correct = null;
  let prediction = null;
  let predType = null;
  // droidJsonAsync returns {raw: text} not {text: text} — use r.raw
  const rawText = r.raw || '';

  if (r.ok) {
    const parsed = parsePrediction(r.json, rawText);
    predType = parsed.type;
    prediction = parsed.value;

    if (parsed.ok && normLabel) {
      const result = judgePrediction(parsed, normLabel);
      correct = result;
    }
  } else {
    // JSON parsing failed — the model likely returned text with ANSWER: format.
    // Try to extract the answer from the raw text using the ANSWER_LINE_RE pattern.
    if (rawText) {
      const parsed = parsePrediction(null, rawText);
      predType = parsed.type;
      prediction = parsed.value;

      if (parsed.ok && normLabel) {
        const result = judgePrediction(parsed, normLabel);
        correct = result;
      }
    }
  }

  return {
    id: item.id,
    itemIndex,
    itemType: item.type || null,
    target: item.target,
    labelRaw: normLabel ? normLabel.raw : null,
    labelField: normLabel ? normLabel.field : null,
    labelType: normLabel ? normLabel.type : null,
    prediction,
    predType,
    correct,
    raw: rawText,
    ok: r.ok || (prediction !== null), // mark as ok if we managed to extract a prediction
    error: r.error,
    usage: r.usage,
    durationMs: r.durationMs,
  };
}

// ---- Aggregate trial results into per-item stats ----
function aggregatePerItem(trialResults, kTrials) {
  const perItemMap = new Map();
  for (const t of trialResults) {
    if (!perItemMap.has(t.itemIndex)) {
      perItemMap.set(t.itemIndex, {
        id: t.id,
        itemType: t.itemType,
        target: t.target,
        labelRaw: t.labelRaw,
        labelField: t.labelField,
        labelType: t.labelType,
        predictions: [],
        corrects: [],
        trials: []
      });
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
    const baseline = attempted > 0 ? successes / attempted : null;
    perItem.push({
      id: entry.id,
      itemIndex,
      itemType: entry.itemType,
      target: entry.target,
      labelField: entry.labelField,
      labelType: entry.labelType,
      labelRaw: entry.labelRaw,
      trials: kTrials,
      attempted,
      successes,
      failures: attempted - successes,
      baseline: attempted > 0 ? +baseline.toFixed(4) : null,
      predictions: entry.predictions,
    });
  }
  // Sort by itemIndex to maintain deterministic order
  perItem.sort((a, b) => a.itemIndex - b.itemIndex);
  return perItem;
}

// ---- Band classification ----
function classifyBands(perItem) {
  const inBand = [];
  const ceiling = [];
  const floor = [];
  const otherOutOfBand = [];

  for (const item of perItem) {
    if (item.baseline === null) {
      otherOutOfBand.push({ ...item, band: 'unattempted' });
    } else if (item.baseline >= 0.40 && item.baseline <= 0.70) {
      inBand.push({ ...item, band: 'in-band', kept: true });
    } else if (item.baseline >= 0.999) {
      ceiling.push({ ...item, band: 'ceiling', kept: false });
    } else if (item.baseline <= 0.001) {
      floor.push({ ...item, band: 'floor', kept: false });
    } else {
      otherOutOfBand.push({ ...item, band: 'out-of-band', kept: false });
    }
  }
  return { inBand, ceiling, floor, otherOutOfBand };
}

// ---- Build final output object ----
function buildOutput(datasetName, totalItems, limitedItems, trialResults, perItem) {
  const totalAttempted = perItem.reduce((s, i) => s + i.attempted, 0);
  const totalCorrect = perItem.reduce((s, i) => s + i.successes, 0);
  const baselineAccuracy = totalAttempted > 0 ? totalCorrect / totalAttempted : null;
  const { inBand, ceiling, floor, otherOutOfBand } = classifyBands(perItem);
  const kept = inBand.map(i => i.id);
  const outOfBand = [...ceiling, ...floor, ...otherOutOfBand].map(i => ({ id: i.id, band: i.band, baseline: i.baseline }));

  return {
    tier: 'calibration',
    dataset: datasetName,
    run_id: EVAL_RUN,
    solver_model: SOLVER_MODEL,
    solver_effort: SOLVER_EFFORT,
    k_trials: K_TRIALS,
    limit: LIMIT || limitedItems.length,
    total_items: totalItems,
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
}

function logSummary(out, outputFile) {
  console.log(`\n  k trials/item: ${K_TRIALS}`);
  console.log(`  baseline accuracy: ${out.baseline_accuracy ? (out.baseline_accuracy * 100).toFixed(1) + '%' : 'N/A'} (${out.summary.in_band + out.summary.ceiling + out.summary.floor + out.summary.other_out_of_band} items)`);
  console.log(`  calibration band: [0.40, 0.70]`);
  console.log(`  kept (in-band): ${out.summary.in_band}`);
  console.log(`  ceiling (≈1.0): ${out.summary.ceiling}`);
  console.log(`  floor (≈0.0): ${out.summary.floor}`);
  console.log(`  other out-of-band: ${out.summary.other_out_of_band}`);
  console.log(`  -> ${outputFile}`);
}

async function runCalibration() {
  const items = loadDataset(DATASET);
  const limitedItems = LIMIT ? items.slice(0, LIMIT) : items;
  const datasetName = path.basename(DATASET, path.extname(DATASET));
  const outputDir = runDir();

  console.log(`╔══════════════════════════════════════════════════════════════════╗`);
  console.log(`║  CALIBRATION RUN — placebo/baseline only (no skill arm)        ║`);
  console.log(`║  dataset: ${datasetName.padEnd(55)} ║`);
  console.log(`║  items: ${String(limitedItems.length).padStart(3)} / ${String(items.length).padEnd(3)} (LIMIT=${LIMIT || 'all'})`.padEnd(61) + '║');
  console.log(`║  trials/item: ${String(K_TRIALS).padEnd(50)}║`);
  console.log(`║  solver: ${SOLVER_MODEL} (${SOLVER_EFFORT})`.padEnd(61) + '║');
  console.log(`║  concurrency: ${String(CONC).padEnd(50)}║`);
  console.log(`║  run id: ${EVAL_RUN.padEnd(54)}║`);
  if (BATCH_MODE) {
    console.log(`║  batch mode: ${`YES (size=${BATCH_SIZE})`.padEnd(50)}║`);
  }
  if (LABEL_FIELD) {
    console.log(`║  label field: ${LABEL_FIELD.padEnd(50)}║`);
  }
  console.log(`╚══════════════════════════════════════════════════════════════════╝`);

  const allTrialResults = [];

  if (BATCH_MODE) {
    // --- Batch mode: process items in small batches, saving partial results ---
    const partialFile = path.join(outputDir, `calibration-${datasetName}-${EVAL_RUN}-partial.json`);
    const numBatches = Math.ceil(limitedItems.length / BATCH_SIZE);

    for (let batchIdx = 0; batchIdx < numBatches; batchIdx++) {
      const start = batchIdx * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, limitedItems.length);
      const batchItems = limitedItems.slice(start, end);

      console.log(`\n  [batch ${batchIdx + 1}/${numBatches}] items ${start}–${end - 1} (${batchItems.length} items)`);

      // Build trials for this batch
      const batchTrials = [];
      for (let i = 0; i < batchItems.length; i++) {
        const itemIndex = start + i;
        for (let t = 0; t < K_TRIALS; t++) {
          batchTrials.push({ itemIndex, trialIndex: t, item: batchItems[i] });
        }
      }

      const batchResults = await mapPool(batchTrials, CONC, async ({ itemIndex, item }) => {
        return processItemTrial(item, itemIndex);
      });

      allTrialResults.push(...batchResults);

      // Save incremental partial results
      const partialPerItem = aggregatePerItem(allTrialResults, K_TRIALS);
      const partialOut = buildOutput(datasetName, items.length, limitedItems, allTrialResults, partialPerItem);
      writeJson(partialFile, partialOut);

      const batchSuccesses = batchResults.filter(r => r.correct === true).length;
      const batchAttempted = batchResults.filter(r => r.prediction !== null).length;
      console.log(`  [batch ${batchIdx + 1}/${numBatches}] complete — ${batchSuccesses}/${batchAttempted} correct. Partial saved to ${partialFile}`);
    }
  } else {
    // --- Standard mode: process all items at once ---
    const trials = [];
    for (let i = 0; i < limitedItems.length; i++) {
      for (let t = 0; t < K_TRIALS; t++) {
        trials.push({ itemIndex: i, trialIndex: t, item: limitedItems[i] });
      }
    }

    allTrialResults.push(...await mapPool(trials, CONC, async ({ itemIndex, item }) => {
      return processItemTrial(item, itemIndex);
    }));
  }

  // Final aggregation and output
  const perItem = aggregatePerItem(allTrialResults, K_TRIALS);
  const out = buildOutput(datasetName, items.length, limitedItems, allTrialResults, perItem);

  const outputFile = path.join(outputDir, `calibration-${datasetName}-${EVAL_RUN}.json`);
  writeJson(outputFile, out);

  logSummary(out, outputFile);
  return out;
}

runCalibration().catch(err => {
  console.error('Calibration run failed:', err);
  process.exit(1);
});
