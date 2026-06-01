#!/usr/bin/env node
'use strict';

/**
 * Stream candidate problems from HuggingFace datasets into our eval schema,
 * via the datasets-server /rows API (no bulk download — pages offset/length).
 * Writes to evals/datasets/external/<tag>.jsonl (a SEGREGATED, attributed corpus;
 * several sources are non-commercial — do NOT ship verbatim in the MIT package).
 *
 * Usage:
 *   node evals/datasets/ingest-hf.js financial 20 [offset] [--classify]
 *   node evals/datasets/ingest-hf.js medical 12 --classify
 *   CLASSIFY=1 node evals/datasets/ingest-hf.js glm-distractor 30
 *
 * --classify (or CLASSIFY=1) runs a batched droid pass tagging each candidate
 * {eval_worthy, mode, skill_fit, domain, single_answer} and drops non-eval-worthy.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { droidJsonAsync } = require('../lib/droid');
const { leafSkills } = require('../lib/skills');

const OUT_DIR = path.join(__dirname, 'external');
fs.mkdirSync(OUT_DIR, { recursive: true });
const CLASSIFY = process.env.CLASSIFY === '1' || process.argv.includes('--classify');
const CLASSIFIER_MODEL = process.env.CLASSIFIER_MODEL || 'deepseek-v4-pro';

const SOURCES = {
  financial: {
    dataset: 'Jackrong/financial-economics-reasoning', config: 'default', split: 'train',
    mode: 'pairwise', license: 'Apache-2.0 (research/non-commercial)',
    map: r => (r.language && r.language !== 'en') ? null : { prompt: r.problem },
  },
  medical: {
    dataset: 'medreason/llm-medical-reasoning-steps-benchmark', config: 'default', split: 'test',
    mode: 'correctness', license: 'CC BY-NC 4.0',
    map: r => r.task_type === 'multi_choice' ? {
      prompt: r.question + '\n\nOptions:\n' + (r.answer_options || []).map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join('\n'),
      answer_idx: r.answer_idx, answer: r.answer, key_points: r.answer_key_points, specialty: r.specialty,
    } : null,
  },
  legal: {
    dataset: 'nguha/legalbench', config: 'consumer_contracts_qa', split: 'test',
    mode: 'correctness', license: 'CC-BY-4.0 (per-task varies)',
    map: r => ({ prompt: 'Contract:\n' + r.contract + '\n\nQuestion: ' + r.question, answer: r.answer }),
  },
  'glm-distractor': {
    dataset: 'Jackrong/GLM-5.1-Reasoning-1M-Cleaned', config: 'main', split: 'train',
    mode: 'distractor', license: 'Apache-2.0 (GLM-5.1 distilled)',
    map: r => { const p = r.input || ''; return (p.length > 20 && p.length < 1200) ? { prompt: p } : null; },
  },
  // --- verified per-skill datasets (Phase 3) ---
  diversevul: { // red-team: does attacker-mindset improve vuln detection? objective Yes/No.
    dataset: 'claudios/DiverseVul', config: 'default', split: 'test',
    mode: 'correctness', license: 'MIT/research',
    map: r => (r.func && r.func.length > 40 && r.func.length < 2200) ? {
      prompt: 'Is the following C/C++ function vulnerable to a security issue (memory safety, injection, auth bypass, etc.)? Answer Yes or No.\n\n```c\n' + r.func + '\n```',
      answer: r.target === 1 ? 'Yes' : 'No', skill_fit: ['red-team'], cwe: r.cwe,
    } : null,
  },
  selfaware: { // circle-of-competence: abstention routing (downloaded for the routing runner)
    dataset: 'OkayestProgrammer/selfAware', config: 'default', split: 'train',
    mode: 'abstention', license: 'CC-BY-SA-4.0',
    map: r => ({ prompt: r.question, answerable: r.answerable, skill_fit: ['circle-of-competence'] }),
  },
  fermi: { // fermi-estimation: numeric order-of-magnitude ground truth
    dataset: 'jeggers/fermi', config: 'real', split: 'test',
    mode: 'numeric', license: 'CC-BY-4.0',
    map: r => { const n = parseFloat(String(r.answer).replace(/[, ]/g, '')); return (r.question && isFinite(n) && n !== 0) ? {
      prompt: r.question + "\n\nEstimate the quantity. End with exactly: ANSWER: <a single number, scientific notation OK>",
      answer_num: n, skill_fit: ['fermi-estimation'],
    } : null; },
  },
  forecasting: { // probabilistic/bayesian: binary resolved outcome (NOTE: 2023 items predate model cutoff → leakage; filter by date for a clean run)
    dataset: 'YuehHanChen/forecasting', config: 'default', split: 'test',
    mode: 'binary-prob', license: 'Apache-2.0',
    map: r => (r.is_resolved === true && r.question_type === 'binary' && (r.resolution === 0 || r.resolution === 1)) ? {
      prompt: 'Background: ' + String(r.background || '').slice(0, 700) + '\n\nQuestion: ' + r.question + '\n\nResolution: ' + String(r.resolution_criteria || '').slice(0, 250) + "\n\nGive the probability the answer is YES. End with exactly: ANSWER: <number between 0 and 1>",
      answer_bin: r.resolution, resolve_date: r.date_resolve_at, skill_fit: ['probabilistic'],
    } : null,
  },
  swebench: { // native-domain debugging: fault-file localization from a real GitHub issue
    dataset: 'princeton-nlp/SWE-bench_Lite', config: 'default', split: 'test',
    mode: 'swe-localize', license: 'MIT',
    map: r => {
      const files = [...new Set([...String(r.patch || '').matchAll(/diff --git a\/\S+ b\/(\S+)/g)].map(m => m[1]).filter(f => !/(test|tests)\//i.test(f) && /\.(py|js|ts|java|go|rb|c|cpp|h)$/.test(f)))];
      if (!files.length || !r.problem_statement) return null;
      return {
        prompt: 'Repository: ' + r.repo + '\n\nGitHub issue:\n' + String(r.problem_statement).slice(0, 2500) +
          '\n\nWhich single source file in this repository most likely needs to be modified to fix this issue? Reason about the symptom and where it originates, then give the repository-relative path. End with exactly: ANSWER: <path/to/file.ext>',
        gold_files: files, repo: r.repo, skill_fit: ['scientific-method', 'systems', 'five-whys-plus'],
      };
    },
  },
  strategyqa: { // second-order proxy: implicit multi-hop yes/no
    dataset: 'voidful/StrategyQA', config: 'default', split: 'train',
    mode: 'correctness', license: 'CC (Wikipedia-derived)',
    map: r => (r.question && typeof r.answer === 'boolean') ? {
      prompt: r.question + '\n\nAnswer Yes or No.', answer: r.answer ? 'Yes' : 'No', skill_fit: ['second-order'],
    } : null,
  },
};

function fetchRows(ds, config, split, offset, length) {
  const enc = ds.replace(/\//g, '%2F');
  const url = `https://datasets-server.huggingface.co/rows?dataset=${enc}&config=${config}&split=${split}&offset=${offset}&length=${length}`;
  const r = spawnSync('curl', ['-s', '--max-time', '40', url], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error('curl failed: ' + r.stderr);
  return (JSON.parse(r.stdout).rows || []).map(x => x.row);
}

const SKILL_NAMES = leafSkills().map(s => s.name.replace('thinking-', ''));

async function classifyBatch(cands) {
  const items = cands.map((c, i) => `[${i}] ${c.prompt.slice(0, 500).replace(/\s+/g, ' ')}`).join('\n\n');
  const prompt = `You triage candidate problems for a "thinking skills" (mental models) eval that tests whether injecting a mental-model guide makes an AI agent reason better.

Skills available: ${SKILL_NAMES.join(', ')}.

For each item decide:
- eval_worthy: true unless it is pure factual RECALL/summarization or trivial lookup with no reasoning/decision content.
- mode: "pairwise" (open decision/analysis, quality-of-reasoning differs), "correctness" (single verifiable answer that better reasoning would get right), or "distractor" (routine task where NO thinking skill should fire — code a function, fact lookup, simple arithmetic).
- skill_fit: up to 3 skill short-names whose mental model would most help (or [] for distractors).
- domain: short tag (software, finance, medical, legal, science, general, ...).
- single_answer: true if there is one objectively correct answer.

ITEMS:
${items}

Return ONLY JSON: {"tags":[{"i":0,"eval_worthy":true,"mode":"pairwise","skill_fit":["second-order"],"domain":"finance","single_answer":false}, ...]} with one entry per item index.`;
  const r = await droidJsonAsync({ model: CLASSIFIER_MODEL, prompt, timeoutMs: 600000 });
  if (!r.ok || !r.json || !Array.isArray(r.json.tags)) return null;
  return r.json.tags;
}

async function classifyAll(out) {
  const BATCH = 8;
  for (let i = 0; i < out.length; i += BATCH) {
    const slice = out.slice(i, i + BATCH);
    const tags = await classifyBatch(slice);
    if (!tags) { console.log(`  classify batch ${i}-${i + slice.length} FAILED — leaving untagged`); continue; }
    for (const t of tags) if (slice[t.i]) Object.assign(slice[t.i], {
      eval_worthy: t.eval_worthy, classified_mode: t.mode, skill_fit: t.skill_fit, domain: t.domain, single_answer: t.single_answer,
    });
    console.log(`  classified ${i + slice.length}/${out.length}`);
  }
}

async function main() {
  const tag = process.argv[2];
  const count = parseInt(process.argv[3] || '20', 10);
  let offset = parseInt(process.argv[4] || '0', 10);
  const src = SOURCES[tag];
  if (!src) { console.error('unknown source. options:', Object.keys(SOURCES).join(', ')); process.exit(1); }

  const out = [];
  let pulled = 0;
  while (out.length < count && pulled < count * 6) {
    const batch = fetchRows(src.dataset, src.config, src.split, offset, Math.min(100, count * 2));
    if (!batch.length) break;
    for (const row of batch) {
      pulled++;
      const mapped = src.map(row);
      if (!mapped || !mapped.prompt) continue;
      out.push({ id: `${tag}-${offset + out.length}`, source: src.dataset, mode: src.mode, license: src.license, ...mapped });
      if (out.length >= count) break;
    }
    offset += batch.length;
  }

  let kept = out;
  if (CLASSIFY) {
    console.log(`Classifying ${out.length} candidates with ${CLASSIFIER_MODEL}…`);
    await classifyAll(out);
    // track-aware: distractors WANT routine/low-skill items; reasoning tracks drop recall.
    if (src.mode === 'distractor') kept = out.filter(o => o.classified_mode === 'distractor');
    else kept = out.filter(o => o.eval_worthy !== false && o.classified_mode !== 'distractor');
    console.log(`  kept ${kept.length}/${out.length} (${src.mode === 'distractor' ? 'classified distractor' : 'eval-worthy reasoning'})`);
  }

  const file = path.join(OUT_DIR, `${tag}.jsonl`);
  fs.writeFileSync(file, kept.map(o => JSON.stringify(o)).join('\n') + '\n');
  console.log(`Ingested ${kept.length} candidates from ${src.dataset} (${src.mode}, ${src.license})`);
  console.log(`  -> ${file}`);
}

main();
