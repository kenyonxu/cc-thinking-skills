#!/usr/bin/env node
'use strict';

/**
 * Build a self-contained HTML dashboard from the SQLite eval DB.
 * The DB is the source of truth; this script queries it via the `sqlite3 -json`
 * CLI and injects the data into dashboard.template.html. No npm deps, no server,
 * no external resources — the output opens straight in a browser.
 *
 * Usage: node evals/db/build-dashboard.js   ->  evals/dashboard.html
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const DB = path.join(__dirname, 'evals.db');
const EXPDB = path.join(__dirname, 'experiments.db');
const TEMPLATE = path.join(__dirname, 'dashboard.template.html');
const OUT = path.join(__dirname, '..', 'dashboard.html');

function q(sql, database = DB) {
  const r = spawnSync('sqlite3', ['-json', database, sql], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (r.status !== 0) { console.error('SQL error:', r.stderr, '\n', sql); process.exit(1); }
  const out = (r.stdout || '').trim();
  return out ? JSON.parse(out) : [];
}
const one = sql => q(sql)[0] || {};
const parse = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };

function build() {
  const run = one('SELECT * FROM run LIMIT 1');

  const t0 = one('SELECT round(avg(strict_pct)) strict, round(avg(loose_pct)) loose FROM tier0');
  const t1 = one('SELECT round(avg(avg),2) avg, sum(would_mislead) ml FROM tier1');
  const t2 = one('SELECT round(100.0*avg(correct)) lenient, round(100.0*avg(correct_strict)) strict FROM tier2_case');
  const t3 = one("SELECT round(avg(win_rate),3) mean, sum(verdict='proven') proven, count(*) total FROM tier3 WHERE variant='main'");

  const dims = one('SELECT avg(fidelity) fidelity, avg(applicability) applicability, avg(actionability) actionability, avg(discrimination) discrimination, avg(discoverability) discoverability FROM tier1');

  const scorecard = q(`
    SELECT s.name, replace(s.name,'thinking-','') short, s.category, s.is_meta,
           t0.strict_pct strict, t0.loose_pct loose,
           t1.avg rubric, t1.fidelity, t1.applicability, t1.actionability, t1.discrimination, t1.discoverability,
           t1.weakest, t1.would_mislead mislead,
           t3.win_rate, t3.lift, t3.verdict, t3.vocab_only
    FROM skill s
    LEFT JOIN tier0 t0 ON t0.skill=s.name
    LEFT JOIN tier1 t1 ON t1.skill=s.name
    LEFT JOIN tier3 t3 ON t3.skill=s.name AND t3.variant='main'`);

  const tier2 = {
    lenient: t2.lenient, strict: t2.strict,
    by_type: q('SELECT type, count(*) total, sum(correct) correct, round(1.0*sum(correct)/count(*),3) acc FROM tier2_case GROUP BY type'),
    discrimination_errors: q('SELECT case_id, expected, chosen FROM tier2_case WHERE correct=1 AND correct_strict=0'),
    misroutes: q('SELECT case_id, type, expected, chosen FROM tier2_case WHERE correct=0'),
  };

  const trigger = q("SELECT skill, max(CASE WHEN pair='skill:placebo' THEN win_rate END) sp, max(CASE WHEN pair='skill:trigger' THEN win_rate END) st FROM tier3_pair WHERE variant='trigger' GROUP BY skill ORDER BY st");
  const haiku = q("SELECT h.skill, h.win_rate haiku_wr, m.win_rate sonnet_wr FROM tier3 h LEFT JOIN tier3 m ON m.skill=h.skill AND m.variant='main' WHERE h.variant='haiku' ORDER BY h.skill");

  const holistic = q('SELECT * FROM review_holistic').map(m => ({
    model: m.model, overall: m.overall_take, contrarian: m.contrarian,
    eval_would_catch: !!m.eval_would_catch, router: m.router_critique,
    weakest: parse(m.weakest_json, []), merges: parse(m.merges_json, []),
    missing: parse(m.missing_json, []), improvements: parse(m.improvements_json, []),
    eval_flaws: parse(m.eval_flaws_json, []),
  }));

  const ps = q('SELECT skill, model, verdict, would_mislead mislead FROM review_perskill');
  const perskill_models = [...new Set(ps.map(p => p.model))].sort();
  const perskill_skills = [...new Set(ps.map(p => p.skill))].sort();
  const perskill_cells = {};
  for (const p of ps) perskill_cells[p.skill + '|' + p.model] = { verdict: p.verdict, mislead: !!p.mislead };

  const experiments = fs.existsSync(EXPDB)
    ? q('SELECT id,hypothesis,title,intervention,scope_skills,status,baseline_win_rate,result_win_rate,lift_pp,n_problems,merge_recommended,branch,notes FROM experiment ORDER BY (status="planned"), hypothesis', EXPDB)
    : [];

  return {
    run, experiments,
    headline: {
      tier0_strict: t0.strict, tier0_loose: t0.loose,
      tier1_avg: t1.avg, tier1_mislead: t1.ml,
      tier2_lenient: t2.lenient, tier2_strict: t2.strict,
      tier3_mean: t3.mean, tier3_proven: t3.proven, tier3_total: t3.total,
    },
    dims, scorecard, tier2, trigger, haiku, holistic,
    perskill_models, perskill_skills, perskill_cells,
  };
}

function main() {
  if (!fs.existsSync(DB)) { console.error('No DB. Run: node evals/db/build-db.js'); process.exit(1); }
  const data = build();
  const tmpl = fs.readFileSync(TEMPLATE, 'utf8');
  const html = tmpl.replace('__DATA__', JSON.stringify(data));
  fs.writeFileSync(OUT, html);
  const kb = Math.round(fs.statSync(OUT).size / 1024);
  console.log(`Dashboard -> ${OUT} (${kb} KB, self-contained)`);
  console.log(`  ${data.scorecard.length} skills · ${data.holistic.length} holistic reviews · ${data.perskill_skills.length}×${data.perskill_models.length} per-skill matrix`);
}

main();
