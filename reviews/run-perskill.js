#!/usr/bin/env node
'use strict';

/**
 * Per-skill deep adversarial pass. Each selected skill is reviewed by each
 * model in depth. Default selection = weakest-by-rubric + the router + a few
 * high-traffic skills.
 * Usage: EVAL_RUN=run1 node reviews/run-perskill.js
 *   override skills:  SKILLS="thinking-a,thinking-b" ...
 *   override models:  MODELS="deepseek-v4-pro" ...
 */

const fs = require('fs');
const path = require('path');
const { readSkill } = require('../evals/lib/skills');
const { droidJsonAsync, maxEffortFor } = require('../evals/lib/droid');
const { mapPool } = require('../evals/lib/io');

const DEFAULT_MODELS = ['gpt-5.5-pro', 'gemini-3.1-pro-preview', 'deepseek-v4-pro'];
const CONC = parseInt(process.env.CONC || '3', 10);

// Default selection: a fixed high-value set if rubric results aren't available.
const FALLBACK = [
  'thinking-debiasing', 'thinking-first-principles', 'thinking-model-router',
  'thinking-systems', 'thinking-bayesian', 'thinking-occams-razor',
  'thinking-kepner-tregoe', 'thinking-effectuation', 'thinking-triz',
];

function pickSkills() {
  if (process.env.SKILLS) return process.env.SKILLS.split(',').map(s => s.trim());
  // try to read tier1 rubric to pick the weakest 6 + router + 2 high-traffic
  try {
    const run = process.env.EVAL_RUN || 'latest';
    const t1 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'evals', 'results', run, 'tier1-rubric.json'), 'utf8'));
    const weakest = (t1.results || []).filter(r => r.ok).sort((a, b) => a.avg - b.avg).slice(0, 6).map(r => r.skill);
    const set = new Set([...weakest, 'thinking-model-router', 'thinking-first-principles', 'thinking-systems']);
    return [...set];
  } catch (_) { return FALLBACK; }
}

const SCHEMA = `Return ONLY this JSON (no prose):
{
  "skill": "<name>",
  "reviewer_model": "<your model>",
  "is_faithful": true,
  "fidelity_problems": ["<misstatement or distortion of the source model, if any>"],
  "would_mislead_agent": false,
  "mislead_scenario": "<concrete case where following this skill makes an AI agent's answer WORSE>",
  "missing_boundaries": ["<when this skill should NOT be used but the file doesn't say>"],
  "weakest_part": "<the single weakest section/claim>",
  "highest_leverage_fix": "<one change that would most improve real reasoning lift>",
  "verdict": "keep|sharpen|merge|cut"
}`;

function prompt(skill) {
  return `You are adversarially reviewing ONE Claude Code thinking skill that gets injected into an AI agent's context. Find where it is wrong, where it would MISLEAD the agent, and where it lacks boundaries. Be specific and skeptical.\n\n=== SKILL: ${skill.name} ===\n${skill.content}\n=== END ===\n\n${SCHEMA}`;
}

async function main() {
  const models = (process.env.MODELS ? process.env.MODELS.split(',') : DEFAULT_MODELS).map(s => s.trim());
  const skills = pickSkills();
  const jobs = [];
  for (const sk of skills) for (const m of models) jobs.push({ skill: sk, model: m });
  console.log(`Per-skill review: ${skills.length} skills × ${models.length} models = ${jobs.length} calls, conc=${CONC}`);
  console.log(`  skills: ${skills.join(', ')}`);

  let done = 0;
  await mapPool(jobs, CONC, async (job) => {
    const skill = readSkill(job.skill);
    const r = await droidJsonAsync({ model: job.model, prompt: prompt(skill), timeoutMs: 600000 });
    done++;
    const outFile = path.join(__dirname, 'per-skill', `${job.skill}__${job.model.replace(/[^a-z0-9.-]/gi, '_')}.json`);
    if (!r.ok) { fs.writeFileSync(outFile, JSON.stringify({ ...job, ok: false, error: r.error }, null, 2)); console.log(`  [${done}/${jobs.length}] ${job.skill} / ${job.model}: FAILED`); return; }
    fs.writeFileSync(outFile, JSON.stringify({ ...job, ok: true, ...r.json }, null, 2));
    console.log(`  [${done}/${jobs.length}] ${job.skill} / ${job.model}: ${r.json.verdict || '?'}${r.json.would_mislead_agent ? ' ⚠MISLEAD' : ''}`);
  });
  console.log('done.');
}

main();
