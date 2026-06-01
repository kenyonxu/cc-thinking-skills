#!/usr/bin/env node
'use strict';

/**
 * Tier 0 — Structural lint (free, deterministic, no API cost).
 *
 * Reproduces the existing scripts/validate-skills.js 18-point "strict" score,
 * AND computes a "loosened" substance-aware score that recognizes real content
 * the strict regexes miss (e.g. a fenced template block, an examples section,
 * an anti-patterns paragraph). The gap between the two quantifies how much the
 * current quality number is measuring headers rather than substance — the
 * `thinking-debiasing` 72% false-negative is the motivating case.
 */

const { loadAllSkills } = require('./lib/skills');
const { runDir, writeJson } = require('./lib/io');
const path = require('path');

// ---- strict checks (copied from scripts/validate-skills.js) ----
const STRICT_SECTIONS = [
  { name: 'YAML Frontmatter', p: /^---\n[\s\S]*?name:[\s\S]*?description:[\s\S]*?---/m },
  { name: 'Overview', p: /^## Overview/m },
  { name: 'Core Principle', p: /\*\*Core Principle:\*\*/m },
  { name: 'When to Use', p: /^## When to Use/m },
  { name: 'Decision Flow', p: /```[\s\S]*?→[\s\S]*?```/m },
  { name: 'Process/Steps', p: /^### Step \d|^## The .* Process|^## .*Process$/m },
  { name: 'Examples', p: /^## .*Example|Example:|```markdown[\s\S]*?##/m },
  { name: 'Template', p: /^## .*Template|Template:/m },
  { name: 'Verification Checklist', p: /^## Verification Checklist/m },
  { name: 'Key Questions', p: /^## Key Questions/m },
  { name: 'Wisdom/Attribution', p: /Wisdom|".*"/m },
];
const STRICT_QUALITY = [
  { name: 'Description Length', f: c => (c.match(/description:\s*(.+)/) || [, ''])[1].length <= 200 },
  { name: 'Multiple Examples', f: c => ((c.match(/Example[s]?:/gi) || []).length + (c.match(/```markdown[\s\S]*?##/g) || []).length) >= 2 },
  { name: 'Tables', f: c => (c.match(/\|.*\|.*\|/g) || []).length >= 3 },
  { name: 'Checklists', f: c => (c.match(/- \[ \]/g) || []).length >= 3 },
  { name: 'Code Blocks', f: c => (c.match(/```/g) || []).length / 2 >= 3 },
  { name: 'Word Count', f: c => { const w = c.split(/\s+/).length; return w >= 500 && w <= 3000; } },
  { name: 'Anti-patterns', f: c => /anti-pattern|failure mode|common mistake|when not to|don't use/i.test(c) },
];

function strictScore(content) {
  let score = 0, max = 0;
  const missing = [];
  for (const s of STRICT_SECTIONS) { max++; if (s.p.test(content)) score++; else missing.push(s.name); }
  for (const q of STRICT_QUALITY) { max++; if (q.f(content)) score++; else missing.push(q.name); }
  return { score, max, pct: Math.round((score / max) * 100), missing };
}

// ---- loosened, substance-aware checks ----
function looseScore(content) {
  const checks = {
    has_frontmatter: /^---\n[\s\S]*?name:[\s\S]*?description:[\s\S]*?---/m.test(content),
    has_overview: /^## (Overview|Summary|What)/im.test(content),
    has_core_idea: /\*\*Core Principle/i.test(content) || /^## (Core|The Principle|The Idea)/im.test(content),
    has_when_to_use: /^## When to (Use|Apply)/im.test(content),
    // any fenced block OR a fill-in template (e.g. a markdown block with [brackets])
    has_template: /^## .*Template/im.test(content) || /```[\s\S]*?\[[^\]]+\][\s\S]*?```/m.test(content),
    // examples: a section OR >=2 worked code blocks
    has_examples: /^#{2,3} .*Example/im.test(content) || (content.match(/```/g) || []).length / 2 >= 2,
    has_verification: /^## Verification|^## Checklist|- \[ \]/im.test(content),
    has_key_questions: /^## (Key Questions|Questions)/im.test(content) || /\?\s*$/m.test(content),
    // boundaries: when-not, failure modes, pitfalls, OR a comparison table
    has_boundaries: /anti-pattern|failure mode|common (mistake|pitfall)|when not to|don't use|pitfall|trap/i.test(content),
    has_attribution: /".{10,}"|—\s*\w|\bper\b|attributed|coined|developed by/i.test(content),
    desc_ok: (content.match(/description:\s*(.+)/) || [, ''])[1].length <= 200,
    word_ok: (() => { const w = content.split(/\s+/).length; return w >= 400 && w <= 3500; })(),
  };
  const vals = Object.values(checks);
  const score = vals.filter(Boolean).length;
  return { score, max: vals.length, pct: Math.round((score / vals.length) * 100), checks };
}

function main() {
  const skills = loadAllSkills();
  const rows = skills.map(s => {
    const strict = strictScore(s.content);
    const loose = looseScore(s.content);
    return {
      name: s.name,
      descLen: s.description.length,
      strict_pct: strict.pct,
      loose_pct: loose.pct,
      gap: loose.pct - strict.pct,
      strict_missing: strict.missing,
      words: s.content.split(/\s+/).length,
    };
  });
  rows.sort((a, b) => b.gap - a.gap);

  const overallStrict = Math.round(rows.reduce((a, r) => a + r.strict_pct, 0) / rows.length);
  const overallLoose = Math.round(rows.reduce((a, r) => a + r.loose_pct, 0) / rows.length);

  const out = {
    tier: 0,
    overall_strict_pct: overallStrict,
    overall_loose_pct: overallLoose,
    false_negatives: rows.filter(r => r.gap >= 15).map(r => ({ name: r.name, strict: r.strict_pct, loose: r.loose_pct })),
    over_length_descriptions: rows.filter(r => r.descLen > 200).map(r => ({ name: r.name, len: r.descLen })),
    rows,
  };
  const file = path.join(runDir(), 'tier0-structural.json');
  writeJson(file, out);
  console.log(`Tier 0 — structural lint`);
  console.log(`  strict overall:  ${overallStrict}%`);
  console.log(`  loosened overall: ${overallLoose}%`);
  console.log(`  biggest false-negatives (strict undercounts substance):`);
  for (const r of out.false_negatives.slice(0, 8)) console.log(`    ${r.name}: strict ${r.strict}% vs loose ${r.loose}%`);
  console.log(`  over-length descriptions (>200): ${out.over_length_descriptions.map(d => `${d.name}(${d.len})`).join(', ') || 'none'}`);
  console.log(`  -> ${file}`);
}

main();
