#!/usr/bin/env node
'use strict';

/**
 * Correctness-mode eval (objective, judge-bias-free). For each ground-truth item
 * the SOLVER answers twice IN THE SAME RUN — WITH the most-relevant skill injected
 * vs WITH a length-matched placebo — and we score the answer against ground truth.
 * Paired McNemar test per skill + overall. This dodges the LLM-judge format bias
 * because the outcome is correct/incorrect, not a preference.
 *
 * Reads correctness candidates from evals/datasets/external/*.jsonl (mode=correctness,
 * with answer_idx (MCQ) or answer (yes/no) + skill_fit tags).
 *
 * Usage: EVAL_RUN=run1 SOLVER_MODEL=claude-sonnet-4-6 node evals/run-correctness.js [medical legal]
 */

const fs = require('fs');
const path = require('path');
const { droidExecAsync } = require('./lib/droid');
const { runDir, writeJson, mapPool } = require('./lib/io');
const { neutralFiller, wordCount } = require('./lib/conditions');
const { mcnemar, wilson } = require('./lib/stats');

const SOLVER = process.env.SOLVER_MODEL || 'claude-sonnet-4-6';
const SOLVER_EFFORT = process.env.SOLVER_EFFORT || 'medium';
const CONC = parseInt(process.env.CONC || '4', 10);
const EXT = path.join(__dirname, 'datasets', 'external');
const SKILLS_DIR = path.join(__dirname, '..', 'skills');

function loadItems(tags) {
  const out = [];
  for (const t of tags) {
    const f = path.join(EXT, `${t}.jsonl`);
    if (!fs.existsSync(f)) continue;
    for (const line of fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean)) {
      const o = JSON.parse(line);
      if (o.mode === 'correctness' && (o.answer_idx || o.answer)) out.push(o);
    }
  }
  return process.env.LIMIT ? out.slice(0, parseInt(process.env.LIMIT, 10)) : out;
}

function skillContent(short) {
  const f = path.join(SKILLS_DIR, 'thinking-' + short.replace(/^thinking-/, ''), 'SKILL.md');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
}
function pickSkill(item) {
  if (process.env.FORCE_SKILL) { const f = process.env.FORCE_SKILL.replace(/^thinking-/, ''); return skillContent(f) ? f : null; }
  for (const s of (item.skill_fit || [])) if (skillContent(s)) return s.replace(/^thinking-/, '');
  return null;
}

function answerInstruction(item) {
  return item.answer_idx ? `\n\nEnd your response with exactly: ANSWER: <letter A-E>` : `\n\nEnd your response with exactly: ANSWER: <Yes or No>`;
}
function withSkillPrompt(item, skillMd) {
  return `Use the following thinking-skill guide to reason about the problem. Apply it substantively.\n\n=== THINKING SKILL ===\n${skillMd}\n=== END SKILL ===\n\n${item.prompt}${answerInstruction(item)}`;
}
function placeboPrompt(item, skillMd) {
  return `Some general notes:\n\n${neutralFiller(wordCount(skillMd))}\n\n${item.prompt}${answerInstruction(item)}`;
}
function extract(item, text) {
  if (item.answer_idx) { const m = text.match(/ANSWER:\s*([A-E])/i) || text.match(/\b([A-E])\b\s*\.?\s*$/); return m ? m[1].toUpperCase() : null; }
  const m = text.match(/ANSWER:\s*(yes|no)/i) || text.match(/\b(yes|no)\b\s*\.?\s*$/i); return m ? m[1].toLowerCase() : null;
}
function isCorrect(item, extracted) {
  if (extracted == null) return false;
  return item.answer_idx ? extracted === String(item.answer_idx).toUpperCase()
    : extracted === String(item.answer || '').trim().toLowerCase();
}

async function runItem(item) {
  const skill = pickSkill(item);
  if (!skill) return null;
  const skillMd = skillContent(skill);
  const [w, p] = await Promise.all([
    droidExecAsync({ model: SOLVER, effort: SOLVER_EFFORT, prompt: withSkillPrompt(item, skillMd) }),
    droidExecAsync({ model: SOLVER, effort: SOLVER_EFFORT, prompt: placeboPrompt(item, skillMd) }),
  ]);
  if (!w.ok || !p.ok) return { id: item.id, skill, ok: false };
  const cw = isCorrect(item, extract(item, w.text)), cp = isCorrect(item, extract(item, p.text));
  return { id: item.id, skill, ok: true, skill_correct: cw, placebo_correct: cp };
}

async function main() {
  const tags = process.argv.slice(2).length ? process.argv.slice(2) : ['medical', 'legal'];
  const items = loadItems(tags);
  console.log(`Correctness eval: ${items.length} items from [${tags.join(', ')}], solver=${SOLVER}(${SOLVER_EFFORT}), conc=${CONC}, isolation ${process.env.EVAL_NO_ISOLATE === '1' ? 'OFF' : 'ON'}`);
  if (!items.length) { console.log('  no correctness candidates found — run the bulk ingest first.'); return; }

  let done = 0;
  const results = (await mapPool(items, CONC, async it => { const r = await runItem(it); done++; if (done % 10 === 0) console.log(`  ${done}/${items.length}`); return r; })).filter(r => r && r.ok);

  // per-skill + overall paired stats
  const bySkill = {};
  for (const r of results) {
    const s = bySkill[r.skill] = bySkill[r.skill] || { n: 0, sc: 0, pc: 0, b: 0, c: 0 };
    s.n++; if (r.skill_correct) s.sc++; if (r.placebo_correct) s.pc++;
    if (r.skill_correct && !r.placebo_correct) s.b++;
    if (!r.skill_correct && r.placebo_correct) s.c++;
  }
  const skills = Object.entries(bySkill).map(([skill, s]) => ({
    skill, n: s.n, acc_with: +(s.sc / s.n).toFixed(3), acc_placebo: +(s.pc / s.n).toFixed(3),
    delta_pp: +(((s.sc - s.pc) / s.n) * 100).toFixed(1), discordant: s.b + s.c, mcnemar_p: +mcnemar(s.b, s.c).toFixed(3),
  })).sort((a, b) => b.delta_pp - a.delta_pp);

  const N = results.length, SC = results.filter(r => r.skill_correct).length, PC = results.filter(r => r.placebo_correct).length;
  const B = results.filter(r => r.skill_correct && !r.placebo_correct).length;
  const C = results.filter(r => !r.skill_correct && r.placebo_correct).length;
  const ciW = wilson(SC, N), ciP = wilson(PC, N);
  const out = {
    mode: 'correctness', solver: SOLVER, n: N,
    acc_with_skill: +(SC / N).toFixed(3), acc_with_skill_ci: ciW.map(x => +x.toFixed(3)),
    acc_placebo: +(PC / N).toFixed(3), acc_placebo_ci: ciP.map(x => +x.toFixed(3)),
    delta_pp: +(((SC - PC) / N) * 100).toFixed(1),
    mcnemar_p: +mcnemar(B, C).toFixed(3), significant: mcnemar(B, C) < 0.05,
    discordant: B + C, by_skill: skills,
  };
  const file = process.env.OUTFILE || path.join(runDir(), 'correctness.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  writeJson(file, out);
  console.log(`\n  accuracy WITH skill: ${(out.acc_with_skill * 100).toFixed(0)}%  vs placebo ${(out.acc_placebo * 100).toFixed(0)}%  (Δ ${out.delta_pp >= 0 ? '+' : ''}${out.delta_pp}pp)`);
  console.log(`  McNemar p=${out.mcnemar_p} (${out.significant ? 'SIGNIFICANT' : 'not sig'}); discordant pairs=${out.discordant}`);
  console.log(`  -> ${file}`);
}

main();
