#!/usr/bin/env node
'use strict';

/**
 * SWE-bench fault-file localization (native-domain debugging, objective, isolated).
 * Given a real GitHub issue, the solver names the file to fix; scored against the
 * gold patch's modified file(s). Tests whether a debugging skill (scientific-method,
 * five-whys, systems, occams) improves fault localization vs a length-matched placebo.
 * Paired McNemar + Wilson CI. No repo checkout / test execution required.
 *
 * Usage: EVAL_RUN=run1 FORCE_SKILL=scientific-method node evals/run-swe.js
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
const FORCE_SKILL = process.env.FORCE_SKILL;
const FILE = path.join(__dirname, 'datasets', 'external', 'swebench.jsonl');
const SKILLS_DIR = path.join(__dirname, '..', 'skills');

function loadItems() {
  let L = fs.readFileSync(FILE, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  return process.env.LIMIT ? L.slice(0, parseInt(process.env.LIMIT, 10)) : L;
}
function skillContent(s) { return fs.readFileSync(path.join(SKILLS_DIR, 'thinking-' + s.replace(/^thinking-/, ''), 'SKILL.md'), 'utf8'); }

function locatedCorrectly(item, text) {
  // Correct if a gold file path or its (distinctive) basename appears in the response.
  // Normalize paths (handle backslashes, leading slashes) for consistency with
  // run-calibration.js judgePrediction filepath handling.
  const normText = text.replace(/\\/g, '/');
  for (const g of item.gold_files) {
    const normGold = String(g).replace(/\\/g, '/');
    // Exact path match (normalized)
    if (normText.includes(normGold)) return true;
    // Also try without leading slash
    const stripped = normGold.replace(/^\/+/, '');
    if (stripped !== normGold && normText.includes(stripped)) return true;
    // Basename fallback (for responses that only mention the file name)
    const base = normGold.split('/').pop();
    if (base && !/^(__init__|utils|index|main|app|setup)\.\w+$/.test(base) && new RegExp('\\b' + base.replace('.', '\\.') + '\\b').test(normText)) return true;
  }
  return false;
}

async function runItem(item, skillMd) {
  const tail = `\n\nThink carefully and answer.`;
  const skillP = `Use the following thinking-skill guide to reason about the bug. Apply it substantively.\n\n=== THINKING SKILL ===\n${skillMd}\n=== END SKILL ===\n\n${item.prompt}${tail}`;
  const placeboP = `Some general notes:\n\n${neutralFiller(wordCount(skillMd))}\n\n${item.prompt}${tail}`;
  const [s, p] = await Promise.all([
    droidExecAsync({ model: SOLVER, effort: SOLVER_EFFORT, prompt: skillP }),
    droidExecAsync({ model: SOLVER, effort: SOLVER_EFFORT, prompt: placeboP }),
  ]);
  if (!s.ok || !p.ok) return null;
  return { skill_correct: locatedCorrectly(item, s.text), placebo_correct: locatedCorrectly(item, p.text) };
}

async function main() {
  if (!FORCE_SKILL) { console.error('set FORCE_SKILL'); process.exit(1); }
  const skillMd = skillContent(FORCE_SKILL);
  const items = loadItems();
  console.log(`SWE-bench localization: ${items.length} issues, skill=${FORCE_SKILL}, solver=${SOLVER}(${SOLVER_EFFORT}), isolation ${process.env.EVAL_NO_ISOLATE === '1' ? 'OFF' : 'ON'}`);
  let done = 0;
  const r = (await mapPool(items, CONC, async it => { const x = await runItem(it, skillMd); done++; if (done % 10 === 0) console.log(`  ${done}/${items.length}`); return x; })).filter(Boolean);

  const SC = r.filter(x => x.skill_correct).length, PC = r.filter(x => x.placebo_correct).length, N = r.length;
  const b = r.filter(x => x.skill_correct && !x.placebo_correct).length, c = r.filter(x => !x.skill_correct && x.placebo_correct).length;
  const out = {
    mode: 'swe-localize', skill: FORCE_SKILL, solver: SOLVER, n: N,
    acc_with_skill: +(SC / N).toFixed(3), acc_with_skill_ci: wilson(SC, N).map(x => +x.toFixed(3)),
    acc_placebo: +(PC / N).toFixed(3), acc_placebo_ci: wilson(PC, N).map(x => +x.toFixed(3)),
    delta_pp: +(((SC - PC) / N) * 100).toFixed(1), mcnemar_p: +mcnemar(b, c).toFixed(3), significant: mcnemar(b, c) < 0.05, discordant: b + c,
  };
  const file = process.env.OUTFILE || path.join(runDir(), `swe-${FORCE_SKILL}.json`);
  fs.mkdirSync(path.dirname(file), { recursive: true }); writeJson(file, out);
  console.log(`\n  localize WITH skill ${(out.acc_with_skill * 100).toFixed(0)}% CI[${(out.acc_with_skill_ci[0] * 100).toFixed(0)},${(out.acc_with_skill_ci[1] * 100).toFixed(0)}]  vs placebo ${(out.acc_placebo * 100).toFixed(0)}% CI[${(out.acc_placebo_ci[0] * 100).toFixed(0)},${(out.acc_placebo_ci[1] * 100).toFixed(0)}]  Δ${out.delta_pp >= 0 ? '+' : ''}${out.delta_pp}pp  McNemar p=${out.mcnemar_p}${out.significant ? ' SIG' : ''}`);
  console.log(`  -> ${file}`);
}
main();
