#!/usr/bin/env node
'use strict';

/**
 * Collate the raw adversarial reviews into a structured digest for synthesis:
 *  - how many models flagged each skill weak / what verdicts the per-skill pass gave
 *  - all eval-design critiques, side by side
 *  - every model's "most contrarian idea" (the raw material for unique-ideas)
 *  - merge/redundancy proposals and their agreement count
 * Writes reviews/digest.json. The narrative synthesis (consensus vs unique vs
 * disagreement) is authored by hand from this digest.
 */

const fs = require('fs');
const path = require('path');

function loadDir(dir) {
  try { return fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => ({ f, ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) })); }
  catch (_) { return []; }
}

function norm(s) { return String(s || '').toLowerCase().replace(/^thinking-/, ''); }

function main() {
  const holistic = loadDir(path.join(__dirname, 'holistic')).filter(r => r.ok);
  const perskill = loadDir(path.join(__dirname, 'per-skill')).filter(r => r.ok);

  // weak-skill mentions across holistic reviews
  const weakCount = {};
  for (const h of holistic) for (const w of (h.weakest_skills || [])) {
    const k = norm(w.skill); if (!k) continue;
    weakCount[k] = weakCount[k] || { count: 0, models: [], reasons: [] };
    weakCount[k].count++; weakCount[k].models.push(h.reviewer_model || h.model); weakCount[k].reasons.push(w.why);
  }

  // redundancy/merge proposals
  const merges = [];
  for (const h of holistic) for (const m of (h.redundant_or_should_merge || [])) merges.push({ model: h.reviewer_model || h.model, skills: (m.skills || []).map(norm), why: m.why });

  // per-skill verdicts
  const verdicts = {};
  for (const p of perskill) {
    const k = norm(p.skill);
    verdicts[k] = verdicts[k] || { verdicts: [], mislead: [], boundaries: [], fixes: [] };
    verdicts[k].verdicts.push({ model: p.model, verdict: p.verdict });
    if (p.would_mislead_agent) verdicts[k].mislead.push({ model: p.model, scenario: p.mislead_scenario });
    for (const b of (p.missing_boundaries || [])) verdicts[k].boundaries.push(b);
    if (p.highest_leverage_fix) verdicts[k].fixes.push({ model: p.model, fix: p.highest_leverage_fix });
  }

  const digest = {
    holistic_models: holistic.map(h => h.reviewer_model || h.model),
    weak_skill_consensus: Object.entries(weakCount).sort((a, b) => b[1].count - a[1].count).map(([k, v]) => ({ skill: 'thinking-' + k, models: v.count, who: v.models, reasons: v.reasons })),
    eval_design_critiques: holistic.map(h => ({ model: h.reviewer_model || h.model, would_catch_bad_skill: h.eval_design_critique && h.eval_design_critique.would_catch_a_bad_skill, flaws: (h.eval_design_critique || {}).biggest_flaws, fixes: (h.eval_design_critique || {}).concrete_fixes })),
    router_critiques: holistic.map(h => ({ model: h.reviewer_model || h.model, critique: h.router_critique })),
    merge_proposals: merges,
    missing_models: holistic.flatMap(h => (h.missing_use_cases_or_models || []).map(x => ({ model: h.reviewer_model || h.model, item: x }))),
    contrarian_ideas: holistic.map(h => ({ model: h.reviewer_model || h.model, idea: h.most_contrarian_idea })),
    top_improvements: holistic.flatMap(h => (h.top_improvements || []).map(t => ({ model: h.reviewer_model || h.model, ...t }))),
    per_skill_verdicts: verdicts,
  };

  const file = path.join(__dirname, 'digest.json');
  fs.writeFileSync(file, JSON.stringify(digest, null, 2));
  console.log(`digest -> ${file}`);
  console.log(`  holistic reviews: ${holistic.length}  per-skill reviews: ${perskill.length}`);
  console.log(`  weak-skill consensus (>=2 models): ${digest.weak_skill_consensus.filter(s => s.models >= 2).map(s => s.skill).join(', ') || 'none yet'}`);
}

main();
