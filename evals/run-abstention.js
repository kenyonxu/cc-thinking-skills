#!/usr/bin/env node
'use strict';

/**
 * Abstention-mode eval (objective, judge-bias-free) — for circle-of-competence.
 *
 * SelfAware-style data: each item is either ANSWERABLE (has a real answer) or
 * UNANSWERABLE (no one can know — open scientific questions, undecidable, future
 * unknowns). A well-calibrated agent should ANSWER the answerable ones and
 * ABSTAIN ("this is unanswerable / I cannot know") on the unanswerable ones.
 *
 * For each item the SOLVER responds twice IN THE SAME RUN — WITH the skill guide
 * injected vs WITH a length-matched placebo — and we score whether its
 * answer/abstain decision matched the ground-truth `answerable` flag. Paired
 * McNemar on per-item correctness, plus a confusion breakdown so we can see
 * WHICH direction the skill moves (does it cut over-confident answers on
 * unanswerable items without sandbagging the answerable ones?).
 *
 * Reads mode=abstention items from evals/datasets/external/*.jsonl
 *   { prompt, answerable: bool, skill_fit: ['circle-of-competence'] }
 *
 * Usage: EVAL_RUN=run1 FORCE_SKILL=circle-of-competence node evals/run-abstention.js [selfaware]
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
const FORCE_SKILL = process.env.FORCE_SKILL || 'circle-of-competence';
const EXT = path.join(__dirname, 'datasets', 'external');
const SKILLS_DIR = path.join(__dirname, '..', 'skills');

function loadItems(tags) {
  const out = [];
  for (const t of tags) {
    const f = path.join(EXT, `${t}.jsonl`);
    if (!fs.existsSync(f)) continue;
    for (const line of fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean)) {
      const o = JSON.parse(line);
      if (o.mode === 'abstention' && typeof o.answerable === 'boolean' && o.prompt) out.push(o);
    }
  }
  return process.env.LIMIT ? out.slice(0, parseInt(process.env.LIMIT, 10)) : out;
}

function skillContent(short) {
  const f = path.join(SKILLS_DIR, 'thinking-' + short.replace(/^thinking-/, ''), 'SKILL.md');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
}

const INSTR = `\n\nIf this question has a knowable, factual answer, answer it. If it is fundamentally unanswerable (no one can know — e.g. an open scientific question, an undecidable matter, a private/unknowable fact, or a future event), say so instead of guessing. End your response with exactly: ANSWER: <your answer, OR the single word UNANSWERABLE>`;

function withSkillPrompt(item, skillMd) {
  return `Use the following thinking-skill guide to reason about the question. Apply it substantively.\n\n=== THINKING SKILL ===\n${skillMd}\n=== END SKILL ===\n\n${item.prompt}${INSTR}`;
}
function placeboPrompt(item, skillMd) {
  return `Some general notes:\n\n${neutralFiller(wordCount(skillMd))}\n\n${item.prompt}${INSTR}`;
}

/** decision: true = abstained (declared unanswerable), false = attempted an answer */
function abstained(text) {
  const m = text.match(/ANSWER:\s*(.+)$/is);
  const tail = (m ? m[1] : text).trim();
  // explicit marker, or strong abstention language in the answer slot
  if (/^unanswerable\b/i.test(tail)) return true;
  if (/\bunanswerable\b/i.test(tail) && tail.length < 60) return true;
  if (/\b(cannot|can'?t|impossible to|no one can|not knowable|unknowable|no way to know)\b/i.test(tail) && tail.length < 80) return true;
  return false;
}
/** correct = abstained on unanswerable, answered on answerable */
function isCorrect(item, text) {
  const ab = abstained(text);
  return item.answerable ? !ab : ab;
}

async function runItem(item, skillMd) {
  const [w, p] = await Promise.all([
    droidExecAsync({ model: SOLVER, effort: SOLVER_EFFORT, prompt: withSkillPrompt(item, skillMd) }),
    droidExecAsync({ model: SOLVER, effort: SOLVER_EFFORT, prompt: placeboPrompt(item, skillMd) }),
  ]);
  if (!w.ok || !p.ok) return null;
  return {
    answerable: item.answerable,
    skill_correct: isCorrect(item, w.text), placebo_correct: isCorrect(item, p.text),
    skill_abstained: abstained(w.text), placebo_abstained: abstained(p.text),
  };
}

async function main() {
  const tags = process.argv.slice(2).length ? process.argv.slice(2) : ['selfaware'];
  const skillMd = skillContent(FORCE_SKILL);
  if (!skillMd) { console.error('no skill content for', FORCE_SKILL); process.exit(1); }
  const items = loadItems(tags);
  console.log(`Abstention eval: ${items.length} items [${tags.join(', ')}], skill=${FORCE_SKILL}, solver=${SOLVER}(${SOLVER_EFFORT}), isolation ${process.env.EVAL_NO_ISOLATE === '1' ? 'OFF' : 'ON'}`);
  if (!items.length) { console.log('  no abstention candidates found — ingest selfaware first.'); return; }

  let done = 0;
  const r = (await mapPool(items, CONC, async it => { const x = await runItem(it, skillMd); done++; if (done % 10 === 0) console.log(`  ${done}/${items.length}`); return x; })).filter(Boolean);

  const N = r.length;
  const SC = r.filter(x => x.skill_correct).length, PC = r.filter(x => x.placebo_correct).length;
  const b = r.filter(x => x.skill_correct && !x.placebo_correct).length;
  const c = r.filter(x => !x.skill_correct && x.placebo_correct).length;
  // split accuracy: abstention rate on each ground-truth class (the calibration signal)
  const unans = r.filter(x => !x.answerable), ans = r.filter(x => x.answerable);
  const out = {
    mode: 'abstention', skill: FORCE_SKILL, solver: SOLVER, n: N,
    acc_with_skill: +(SC / N).toFixed(3), acc_with_skill_ci: wilson(SC, N).map(x => +x.toFixed(3)),
    acc_placebo: +(PC / N).toFixed(3), acc_placebo_ci: wilson(PC, N).map(x => +x.toFixed(3)),
    delta_pp: +(((SC - PC) / N) * 100).toFixed(1),
    mcnemar_p: +mcnemar(b, c).toFixed(3), significant: mcnemar(b, c) < 0.05, discordant: b + c,
    calibration: {
      n_unanswerable: unans.length,
      abstain_on_unanswerable_skill: +(unans.filter(x => x.skill_abstained).length / (unans.length || 1)).toFixed(3),
      abstain_on_unanswerable_placebo: +(unans.filter(x => x.placebo_abstained).length / (unans.length || 1)).toFixed(3),
      n_answerable: ans.length,
      abstain_on_answerable_skill: +(ans.filter(x => x.skill_abstained).length / (ans.length || 1)).toFixed(3),
      abstain_on_answerable_placebo: +(ans.filter(x => x.placebo_abstained).length / (ans.length || 1)).toFixed(3),
    },
  };
  const file = process.env.OUTFILE || path.join(runDir(), `abstention-${FORCE_SKILL}.json`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  writeJson(file, out);
  console.log(`\n  accuracy WITH skill ${(out.acc_with_skill * 100).toFixed(0)}% CI[${(out.acc_with_skill_ci[0] * 100).toFixed(0)},${(out.acc_with_skill_ci[1] * 100).toFixed(0)}]  vs placebo ${(out.acc_placebo * 100).toFixed(0)}%  Δ${out.delta_pp >= 0 ? '+' : ''}${out.delta_pp}pp  McNemar p=${out.mcnemar_p}${out.significant ? ' SIG' : ''}`);
  console.log(`  abstain-on-unanswerable: skill ${(out.calibration.abstain_on_unanswerable_skill * 100).toFixed(0)}% vs placebo ${(out.calibration.abstain_on_unanswerable_placebo * 100).toFixed(0)}%  |  false-abstain-on-answerable: skill ${(out.calibration.abstain_on_answerable_skill * 100).toFixed(0)}% vs placebo ${(out.calibration.abstain_on_answerable_placebo * 100).toFixed(0)}%`);
  console.log(`  -> ${file}`);
}
main();
