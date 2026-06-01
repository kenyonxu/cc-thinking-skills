#!/usr/bin/env node
'use strict';

/**
 * Tier 1 — LLM-graded reasoning-quality rubric.
 *
 * A judge model reads each SKILL.md and scores its *content* (not headers) on
 * fidelity / applicability / actionability / discrimination / discoverability.
 * This is the substance signal the structural lint cannot produce.
 *
 * Usage: EVAL_RUN=run1 JUDGE_MODEL=gemini-3.1-pro-preview node evals/run-rubric.js [skill ...]
 */

const fs = require('fs');
const path = require('path');
const { loadAllSkills, readSkill } = require('./lib/skills');
const { droidJsonAsync, maxEffortFor } = require('./lib/droid');
const { runDir, writeJson, mapPool } = require('./lib/io');

const RUBRIC = fs.readFileSync(path.join(__dirname, 'rubrics', 'reasoning-quality.md'), 'utf8');
const JUDGE = process.env.JUDGE_MODEL || 'gemini-3.1-pro-preview';
const CONC = parseInt(process.env.CONC || '4', 10);

function buildPrompt(skill) {
  return `You are grading a Claude Code thinking skill against the rubric below.\n\n` +
    `=== RUBRIC ===\n${RUBRIC}\n\n` +
    `=== SKILL FILE: ${skill.name} ===\n${skill.content}\n\n` +
    `=== END SKILL ===\n\n` +
    `Return ONLY the JSON object specified in the rubric, with "skill" set to "${skill.name}". No prose.`;
}

async function main() {
  const argv = process.argv.slice(2);
  const skills = argv.length ? argv.map(readSkill) : loadAllSkills();
  console.log(`Tier 1 — rubric grading ${skills.length} skills with judge=${JUDGE} (${maxEffortFor(JUDGE)}), conc=${CONC}`);

  let n = 0;
  const results = await mapPool(skills, CONC, async (skill) => {
    const r = await droidJsonAsync({ model: JUDGE, prompt: buildPrompt(skill) });
    n++;
    if (!r.ok) { console.log(`  [${n}/${skills.length}] ${skill.name}: FAILED (${r.error})`); return { skill: skill.name, ok: false, error: r.error, raw: r.raw }; }
    const s = r.json.scores || {};
    const avg = ['fidelity','applicability','actionability','discrimination','discoverability']
      .map(k => Number(s[k]) || 0).reduce((a, b) => a + b, 0) / 5;
    console.log(`  [${n}/${skills.length}] ${skill.name}: avg ${avg.toFixed(2)}/5  weakest=${r.json.weakest_dimension || '?'}${r.json.would_mislead ? '  ⚠ MISLEAD' : ''}`);
    return { skill: skill.name, ok: true, judge: JUDGE, ...r.json, avg };
  });

  const ok = results.filter(r => r.ok);
  ok.sort((a, b) => a.avg - b.avg);
  const out = {
    tier: 1, judge: JUDGE, effort: maxEffortFor(JUDGE),
    n: results.length, n_ok: ok.length,
    overall_avg: ok.length ? (ok.reduce((a, r) => a + r.avg, 0) / ok.length) : 0,
    would_mislead: ok.filter(r => r.would_mislead).map(r => ({ skill: r.skill, note: r.mislead_note })),
    weakest: ok.slice(0, 10).map(r => ({ skill: r.skill, avg: Number(r.avg.toFixed(2)), weakest_dimension: r.weakest_dimension, top_fix: r.top_fix })),
    results,
  };
  const file = path.join(runDir(), 'tier1-rubric.json');
  writeJson(file, out);
  console.log(`\n  overall avg: ${out.overall_avg.toFixed(2)}/5   misleading flags: ${out.would_mislead.length}`);
  console.log(`  -> ${file}`);
}

main();
