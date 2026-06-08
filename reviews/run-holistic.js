#!/usr/bin/env node
'use strict';

/**
 * Holistic adversarial review: each model reviews the whole packet.
 * Usage: node reviews/run-holistic.js [model ...]   (default: all three)
 */

const fs = require('fs');
const path = require('path');
const { droidJsonAsync, maxEffortFor } = require('../evals/lib/droid');

const DEFAULT_MODELS = ['gpt-5.5-pro', 'gemini-3.1-pro-preview', 'deepseek-v4-pro'];
const PACKET = fs.readFileSync(path.join(__dirname, 'packet.md'), 'utf8');

const SCHEMA = `Return ONLY this JSON (no prose):
{
  "reviewer_model": "<your model>",
  "overall_take": "<2-4 sentences: is this collection actually valuable to an AI agent? where does it fall short?>",
  "weakest_skills": [{"skill": "thinking-...", "why": "<specific>"}],
  "redundant_or_should_merge": [{"skills": ["thinking-a","thinking-b"], "why": ""}],
  "missing_use_cases_or_models": ["<a mental model or scenario the collection lacks>"],
  "eval_design_critique": {
    "would_catch_a_bad_skill": true,
    "biggest_flaws": ["<flaw in the Tier 0-3 methodology>"],
    "concrete_fixes": ["<how to harden the evals>"]
  },
  "router_critique": "<is thinking-model-router the right design? what breaks at scale?>",
  "top_improvements": [{"idea": "", "impact": "high|med|low", "effort": "high|med|low"}],
  "most_contrarian_idea": "<your strongest NON-obvious take that the other reviewers probably won't say>"
}`;

function prompt() {
  return `${PACKET}\n\n## YOUR TASK\nProduce a rigorous, adversarial review. Prioritize substance over politeness. Challenge our own evaluation in section E where you disagree.\n\n${SCHEMA}`;
}

async function reviewOne(model) {
  process.stdout.write(`  ${model} (${maxEffortFor(model)}) ... `);
  const r = await droidJsonAsync({ model, prompt: prompt(), timeoutMs: 900000 });
  const outFile = path.join(__dirname, 'holistic', `${model.replace(/[^a-z0-9.-]/gi, '_')}.json`);
  if (!r.ok) {
    fs.writeFileSync(outFile, JSON.stringify({ model, ok: false, error: r.error, raw: r.raw }, null, 2));
    console.log(`FAILED (${r.error})`);
    return { model, ok: false };
  }
  fs.writeFileSync(outFile, JSON.stringify({ model, ok: true, ...r.json }, null, 2));
  const w = (r.json.weakest_skills || []).length, imp = (r.json.top_improvements || []).length;
  console.log(`ok (${w} weak, ${imp} improvements) -> ${path.basename(outFile)}`);
  return { model, ok: true };
}

async function main() {
  const models = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_MODELS;
  console.log(`Holistic adversarial review: ${models.join(', ')}`);
  // sequential to keep provider load gentle and logs readable
  for (const m of models) await reviewOne(m);
  console.log('done.');
}

main();
