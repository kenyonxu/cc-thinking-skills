#!/usr/bin/env node
'use strict';

/**
 * Assemble reviews/packet.md — the shared context handed to each adversarial
 * reviewer model. Reproducible: regenerate any time the inputs change.
 */

const fs = require('fs');
const path = require('path');
const { REPO_ROOT, loadAllSkills, readSkill } = require('../evals/lib/skills');

const FULL_SKILLS = [
  'thinking-debiasing', 'thinking-first-principles', 'thinking-second-order',
  'thinking-systems', 'thinking-model-router', 'thinking-five-whys-plus',
];

function tryRead(p) { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return '(not found)'; } }

function main() {
  const skills = loadAllSkills();
  const L = [];
  L.push(`# Review Packet — cc-thinking-skills`);
  L.push(``);
  L.push(`You are one of three independent frontier models performing an ADVERSARIAL review of a Claude Code plugin that ships 39 "thinking skills" (mental models) for an AI coding/decision agent. Your job is to find what is weak, wrong, redundant, or missing — and to attack the eval methodology itself. Be specific and skeptical; do not flatter.`);
  L.push(``);
  L.push(`## A. Project README`);
  L.push('```markdown'); L.push(tryRead(path.join(REPO_ROOT, 'README.md')).trim()); L.push('```');
  L.push(``);
  L.push(`## B. Existing quality framework`);
  L.push('```markdown'); L.push(tryRead(path.join(REPO_ROOT, 'scripts', 'QUALITY_FRAMEWORK.md')).trim()); L.push('```');
  L.push(``);
  L.push(`## C. Full skill catalog (name: description)`);
  for (const s of skills) L.push(`- **${s.name}**: ${s.description}`);
  L.push(``);
  L.push(`## D. Six full skill files (exemplars + weak cases)`);
  for (const n of FULL_SKILLS) {
    L.push(`### ${n}`);
    L.push('```markdown'); L.push(readSkill(n).content.trim()); L.push('```');
    L.push(``);
  }
  L.push(`## E. Our own deep evaluation (for you to challenge)`);
  L.push('```markdown'); L.push(tryRead(path.join(REPO_ROOT, 'analysis', 'EVALUATION.md')).trim()); L.push('```');
  L.push(``);
  L.push(`## F. Use-case research`);
  L.push('```markdown'); L.push(tryRead(path.join(REPO_ROOT, 'analysis', 'USE-CASES.md')).trim()); L.push('```');
  L.push(``);
  L.push(`## G. The eval harness design (Tiers 0-3) — critique this`);
  L.push(`- **Tier 0 structural lint** (free): header/format conformance + a substance-aware re-score.`);
  L.push(`- **Tier 1 reasoning-quality rubric**: a judge model scores each SKILL.md on fidelity / applicability / actionability / discrimination / discoverability (1-5) and flags "would mislead an agent".`);
  L.push(`- **Tier 2 routing accuracy**: given a natural prompt + all 39 descriptions, does a Claude-class model pick the right skill, and correctly pick NONE on routine requests (negatives)? 71 cases (39 positive / 16 negative / 16 ambiguous).`);
  L.push(`- **Tier 3 behavioral A/B lift** (headline): Claude (claude-sonnet-4-6) solves 108 realistic jargon-free problems WITH vs WITHOUT each skill injected; a cross-family judge (gemini-3.1-pro-preview) does a blind, order-randomized pairwise comparison. Solver≠judge family to limit self-preference. A skill that can't beat baseline is flagged "unproven".`);
  L.push(`- Behavioral problems never name the framework; each targets a specific failure mode a naive solver falls into.`);
  L.push(``);

  const file = path.join(__dirname, 'packet.md');
  fs.writeFileSync(file, L.join('\n'));
  const kb = Math.round(fs.statSync(file).size / 1024);
  console.log(`packet -> ${file} (${kb} KB)`);
}

main();
