'use strict';

/**
 * Central experiment ledger (SQLite). EVERY experiment — registered, running,
 * evaluated, merged, or discarded — gets a row with a unique id, so nothing is
 * lost regardless of whether its worktree is merged into main.
 *
 * DB lives on main at evals/db/experiments.db and is written from the main repo
 * (never from a worktree), so it is the single source of truth across all runs.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const DB = path.join(REPO_ROOT, 'evals', 'db', 'experiments.db');
const EVAL_DB = path.join(REPO_ROOT, 'evals', 'db', 'evals.db');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS experiment(
  id TEXT PRIMARY KEY,
  hypothesis TEXT, title TEXT, description TEXT,
  intervention TEXT, scope_skills TEXT, dataset TEXT,
  branch TEXT, worktree TEXT, commit_hash TEXT,
  status TEXT,
  baseline_win_rate REAL, result_win_rate REAL, lift_pp REAL, n_problems INT,
  merge_recommended INT,
  created_at TEXT, updated_at TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS experiment_result(
  experiment_id TEXT, skill TEXT,
  baseline_win_rate REAL, result_win_rate REAL, lift REAL, n INT,
  PRIMARY KEY(experiment_id, skill)
);`;

function sqlExec(database, sql) {
  const r = spawnSync('sqlite3', [database], { input: sql, encoding: 'utf8' });
  if (r.status !== 0) throw new Error('sqlite3: ' + (r.stderr || r.error));
  return r.stdout;
}
function sqlQuery(database, q) {
  const r = spawnSync('sqlite3', ['-json', database, q], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error('sqlite3: ' + (r.stderr || r.error));
  return r.stdout && r.stdout.trim() ? JSON.parse(r.stdout) : [];
}
const q = v => v === null || v === undefined ? 'NULL' : (typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);

function init() { sqlExec(DB, SCHEMA); }

function genId(hypothesis) {
  const suffix = crypto.randomBytes(3).toString('hex');
  return `exp-${hypothesis.toLowerCase()}-${suffix}`;
}

function nowISO() { return new Date().toISOString(); }

function register(exp) {
  init();
  const t = nowISO();
  sqlExec(DB, `INSERT OR REPLACE INTO experiment
    (id,hypothesis,title,description,intervention,scope_skills,dataset,branch,worktree,commit_hash,status,baseline_win_rate,result_win_rate,lift_pp,n_problems,merge_recommended,created_at,updated_at,notes)
    VALUES (${q(exp.id)},${q(exp.hypothesis)},${q(exp.title)},${q(exp.description)},${q(exp.intervention)},${q((exp.skills||[]).join(','))},${q(exp.dataset||'behavioral')},${q(exp.branch)},${q(exp.worktree)},${q(exp.commit_hash)},${q(exp.status||'registered')},${q(exp.baseline_win_rate)},${q(exp.result_win_rate)},${q(exp.lift_pp)},${q(exp.n_problems)},${q(exp.merge_recommended?1:0)},${q(t)},${q(t)},${q(exp.notes)});`);
}

function update(id, fields) {
  const sets = Object.entries(fields).map(([k, v]) => `${k}=${q(v)}`).concat([`updated_at=${q(nowISO())}`]).join(', ');
  sqlExec(DB, `UPDATE experiment SET ${sets} WHERE id=${q(id)};`);
}

function recordSkill(id, skill, baseline, result, n) {
  sqlExec(DB, `INSERT OR REPLACE INTO experiment_result VALUES (${q(id)},${q(skill)},${q(baseline)},${q(result)},${q(result - baseline)},${q(n)});`);
}

/** Baseline per-skill win-rate from the main eval run (evals.db tier3 variant='main'). */
function baselineWinRates(skills) {
  if (!fs.existsSync(EVAL_DB)) return {};
  const rows = sqlQuery(EVAL_DB, `SELECT skill, win_rate FROM tier3 WHERE variant='main' AND skill IN (${skills.map(s => q('thinking-' + s.replace(/^thinking-/, ''))).join(',')});`);
  return Object.fromEntries(rows.map(r => [r.skill.replace(/^thinking-/, ''), r.win_rate]));
}

function all() { init(); return sqlQuery(DB, 'SELECT * FROM experiment ORDER BY created_at;'); }

module.exports = { DB, EVAL_DB, REPO_ROOT, init, genId, register, update, recordSkill, baselineWinRates, all, sqlQuery, sqlExec };
