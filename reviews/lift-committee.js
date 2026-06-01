#!/usr/bin/env node
'use strict';

/**
 * Adversarial committee: generate + cross-examine hypotheses for a >=10pp lift
 * in mean behavioral win-rate. Round 1 = independent proposals; Round 2 = each
 * model adversarially attacks the others' hypotheses and ranks survivors.
 *
 * Usage: node reviews/lift-committee.js   ->  reviews/committee/*.json
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { droidJsonAsync, maxEffortFor } = require('../evals/lib/droid');

const MODELS = ['gpt-5.5-pro', 'gemini-3.1-pro-preview', 'deepseek-v4-pro'];
const OUT = path.join(__dirname, 'committee');
fs.mkdirSync(OUT, { recursive: true });
const DB = path.join(__dirname, '..', 'evals', 'db', 'evals.db');
function sql(q) { const r = spawnSync('sqlite3', ['-json', DB, q], { encoding: 'utf8' }); return r.stdout && r.stdout.trim() ? JSON.parse(r.stdout) : []; }
const list = a => a.map(x => x.skill.replace('thinking-', '')).join(', ');

function context() {
  const proven = sql("SELECT skill FROM tier3 WHERE variant='main' AND verdict='proven' ORDER BY win_rate DESC");
  const regress = sql("SELECT skill FROM tier3 WHERE variant='main' AND verdict='regresses' ORDER BY win_rate");
  const trig = sql("SELECT skill, max(CASE WHEN pair='skill:placebo' THEN win_rate END) sp, max(CASE WHEN pair='skill:trigger' THEN win_rate END) st FROM tier3_pair WHERE variant='trigger' GROUP BY skill");
  return `# CONTEXT — Thinking-skills behavioral eval (you are improving this)

A Claude Code plugin ships 39 "thinking skills" (mental-model markdown files) auto-injected into an AI agent. We measured whether each skill makes a frontier solver (claude-sonnet-4-6) reason better, vs a SAME-LENGTH neutral placebo (length-controlled), judged blind/pairwise by gemini.

## Current results
- Mean behavioral win-rate (skill vs placebo): **56.5%** (60 wins / 46 losses / 2 ties, n=108; 3 problems each across 36 skills).
- PROVEN (beat placebo): ${list(proven)}.
- REGRESSES (placebo >= skill): ${list(regress)}.
- Tier 1 rubric dimension means: fidelity 4.95, applicability 4.33, actionability 4.00, **discrimination 3.38 (weakest — boundaries/when-NOT-to-use)**, discoverability 4.41.
- 6 skills flagged "would mislead an agent" (human-context leakage: "gather the team", "project to age 80", fabricate exact probabilities).
- Trigger-vs-instruction probe (does the full SKILL.md beat a 2-sentence trigger?): full guide wins for PROCEDURAL skills (bayesian, debiasing, pre-mortem, opportunity-cost); ties/loses for CONCEPTUAL skills the model already knows (first-principles, theory-of-constraints). Mean skill-vs-trigger = 50%.
- Adversarial consensus: skills are HUMAN artifacts ported to agents; missing boundaries; 5 overlap clusters; verbose files may be net-negative.

## Statistical reality (already computed — design your tests around this)
- The 56.5% aggregate is NOT significantly > 50% (Wilson 95% CI [47.1%, 65.6%]; sign-test p=0.21).
- At n=3/skill, even a 3/3 (100%) skill has p=0.25 — no per-skill verdict is valid.
- Power to detect a true 10pp aggregate lift (60% vs 50%) at n=106 ≈ 54%.
- To detect a 10pp aggregate lift at 80% power: ~194 decisive comparisons. Two-arm 56%→66%: ~373/arm; paired same-problem design: ~194.
- A concentrated per-skill move of 30pp needs ~20 problems/skill; 47pp needs ~8.

## The goal
A set of falsifiable hypotheses for interventions on the skills/harness that would produce a **>=10 percentage-point lift in mean behavioral win-rate** (56.5% -> >=66.5%).`;
}

const R1_SCHEMA = `Return ONLY JSON:
{
 "model":"<you>",
 "hypotheses":[{
   "id":"H1",
   "intervention":"<the concrete change to the skills/harness>",
   "mechanism":"<why this should move the win-rate, tied to the data above>",
   "predicted_lift_pp": 0,
   "scope":"aggregate|subset|per-skill",
   "confidence_0_1": 0.0,
   "test_design":"<how to measure it, accounting for the stated power limits>",
   "why_it_might_fail":"<the strongest reason this is a mirage>"
 }],
 "sample_size_view":"<your independent estimate of N needed to validate a 10pp lift, and whether 108 is enough>",
 "single_highest_ev_bet":"<the one intervention you'd run first>"
}`;

const R2_SCHEMA = `Return ONLY JSON:
{
 "model":"<you>",
 "critiques":[{"hypothesis":"<short id/desc>","by_model":"<whose>","verdict":"strong|weak|confounded|theater|untestable","why":"<specific>"}],
 "ranked_top3":["<hypothesis desc, best first>"],
 "most_likely_mirage":"<the hypothesis most likely to show fake lift (e.g. judge bias, length, teaching-to-the-test) and why>",
 "missing_hypothesis":"<a high-EV intervention NONE of the proposals mentioned>"
}`;

async function round1() {
  const ctx = context();
  console.log('Round 1 — independent proposals');
  const results = await Promise.all(MODELS.map(async model => {
    const r = await droidJsonAsync({ model, prompt: `${ctx}\n\n## YOUR TASK\nPropose 4-6 falsifiable hypotheses for achieving a >=10pp lift. Be concrete and quantitative; ground every mechanism in the data. Prefer interventions testable with a realistic dataset.\n\n${R1_SCHEMA}`, timeoutMs: 900000 });
    const file = path.join(OUT, `round1-${model}.json`);
    fs.writeFileSync(file, JSON.stringify(r.ok ? { model, ...r.json } : { model, ok: false, error: r.error, raw: r.raw }, null, 2));
    console.log(`  ${model} (${maxEffortFor(model)}): ${r.ok ? (r.json.hypotheses || []).length + ' hypotheses' : 'FAILED ' + r.error}`);
    return r.ok ? { model, ...r.json } : null;
  }));
  return results.filter(Boolean);
}

async function round2(r1) {
  console.log('Round 2 — adversarial cross-examination');
  // pooled hypotheses text (compact)
  const pool = r1.map(m => `### Proposed by ${m.model}\n` + (m.hypotheses || []).map(h => `- [${h.id}] (${h.scope}, +${h.predicted_lift_pp}pp, conf ${h.confidence_0_1}) ${h.intervention} — MECH: ${h.mechanism}`).join('\n')).join('\n\n');
  const ctx = context();
  await Promise.all(MODELS.map(async model => {
    const others = r1.filter(m => m.model !== model);
    const prompt = `${ctx}\n\n## ALL COMMITTEE HYPOTHESES (including your own — attack all of them)\n${pool}\n\n## YOUR TASK\nYou are the skeptic. Attack these hypotheses: which would NOT actually move the win-rate, which are confounded (length, judge bias, teaching-to-the-test), which are framework-theater, which are untestable at realistic N. Then rank the 3 most likely to deliver a real, measurable >=10pp lift, name the one most likely to be a MIRAGE, and add one high-EV intervention nobody proposed.\n\n${R2_SCHEMA}`;
    const r = await droidJsonAsync({ model, prompt, timeoutMs: 900000 });
    const file = path.join(OUT, `round2-${model}.json`);
    fs.writeFileSync(file, JSON.stringify(r.ok ? { model, ...r.json } : { model, ok: false, error: r.error, raw: r.raw }, null, 2));
    console.log(`  ${model}: ${r.ok ? (r.json.critiques || []).length + ' critiques' : 'FAILED ' + r.error}`);
  }));
}

async function main() {
  const r1 = await round1();
  if (!r1.length) { console.error('round 1 produced nothing'); process.exit(1); }
  await round2(r1);
  console.log('done.');
}
main();
