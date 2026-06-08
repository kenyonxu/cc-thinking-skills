#!/usr/bin/env node
'use strict';

/**
 * Merge tier 0-3 results in the run dir into a single scorecard.md, ranked with
 * behavioral lift as the headline metric.
 * Usage: EVAL_RUN=run1 node evals/aggregate-scorecard.js
 */

const path = require('path');
const fs = require('fs');
const { runDir, readJsonIfExists } = require('./lib/io');

function main() {
  const dir = runDir();
  const t0 = readJsonIfExists(path.join(dir, 'tier0-structural.json'));
  const t1 = readJsonIfExists(path.join(dir, 'tier1-rubric.json'));
  const t2 = readJsonIfExists(path.join(dir, 'tier2-routing.json'));
  const t3 = readJsonIfExists(path.join(dir, 'tier3-behavioral.json'));

  const skills = new Map();
  const ensure = n => { if (!skills.has(n)) skills.set(n, { skill: n }); return skills.get(n); };

  if (t0) for (const r of t0.rows) Object.assign(ensure(r.name), { strict: r.strict_pct, loose: r.loose_pct, descLen: r.descLen });
  if (t1) for (const r of (t1.results || [])) if (r.ok) Object.assign(ensure(r.skill), { rubric: +Number(r.avg).toFixed(2), weakest: r.weakest_dimension, mislead: !!r.would_mislead });
  if (t3) for (const r of (t3.skills || [])) { const hp = (r.pairs && r.pairs[t3.headline_pair]) || {}; Object.assign(ensure(r.skill), { winRate: r.win_rate, lift: r.lift, verdict: r.verdict, vocabOnly: hp.vocab_only || 0 }); }

  const rows = [...skills.values()];
  rows.sort((a, b) => (a.winRate ?? 1) - (b.winRate ?? 1) || (a.rubric ?? 5) - (b.rubric ?? 5));

  const L = [];
  L.push(`# Thinking Skills — Eval Scorecard`);
  L.push(``);
  L.push(`Run: \`${process.env.EVAL_RUN || 'latest'}\``);
  L.push(``);
  L.push(`## Headline numbers`);
  if (t0) L.push(`- **Tier 0 structural:** strict ${t0.overall_strict_pct}% vs substance-aware ${t0.overall_loose_pct}% (the strict number undercounts content-rich skills).`);
  if (t1) L.push(`- **Tier 1 rubric (${t1.judge}):** mean ${t1.overall_avg.toFixed(2)}/5; ${t1.would_mislead.length} skills flagged as potentially misleading.`);
  if (t2) L.push(`- **Tier 2 routing (${t2.router}):** lenient ${(t2.accuracy_lenient * 100).toFixed(0)}% / strict-unique ${(t2.accuracy_strict * 100).toFixed(0)}%; ` + Object.entries(t2.by_type).map(([k, v]) => `${k} ${(v.acc * 100).toFixed(0)}%`).join(', ') + `.`);
  if (t3) L.push(`- **Tier 3 behavioral (length-controlled, headline pair ${t3.headline_pair}; solver ${t3.solver} / judge ${t3.judge}):** mean win-rate ${(t3.mean_win_rate * 100).toFixed(0)}%; proven ${t3.proven.length}/${t3.n_skills}.`);
  L.push(``);
  L.push(`## Per-skill (sorted by behavioral win-rate, weakest first)`);
  L.push(``);
  L.push(`| Skill | Behavioral win-rate | Lift | Verdict | Rubric /5 | Weakest dim | Structural strict→loose |`);
  L.push(`|---|---|---|---|---|---|---|`);
  for (const r of rows) {
    L.push(`| ${r.skill} | ${r.winRate != null ? (r.winRate * 100).toFixed(0) + '%' : '—'} | ${r.lift ?? '—'} | ${r.verdict || '—'} | ${r.rubric ?? '—'} | ${r.weakest || '—'} | ${r.strict != null ? r.strict + '→' + r.loose : '—'} |`);
  }
  L.push(``);
  if (t3) {
    L.push(`## Unproven / regressing (behavioral lift ≤ 0)`);
    for (const u of t3.unproven) L.push(`- **${u.skill}** — win-rate ${(u.win_rate * 100).toFixed(0)}%, ${u.verdict}`);
    L.push(``);
  }
  if (t1 && t1.would_mislead.length) {
    L.push(`## Flagged as potentially misleading (Tier 1)`);
    for (const m of t1.would_mislead) L.push(`- **${m.skill}** — ${m.note}`);
    L.push(``);
  }
  if (t0) {
    L.push(`## Over-length descriptions (>200 chars — hurts auto-invocation)`);
    for (const d of t0.over_length_descriptions) L.push(`- ${d.name}: ${d.len}`);
    L.push(``);
  }

  const file = path.join(dir, 'scorecard.md');
  fs.writeFileSync(file, L.join('\n'));
  console.log(`scorecard -> ${file}`);
}

main();
