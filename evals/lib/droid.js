'use strict';

/**
 * Thin wrapper around the `droid exec` CLI (Factory.ai Droid, v0.137.x).
 *
 * Why droid and not `claude -p`: the headless `claude -p` subprocess does not
 * inherit this machine's interactive OAuth and fails with a 401. `droid` has
 * provider API keys configured in ~/.factory/config.json, so it can drive
 * Claude, GPT, Gemini and DeepSeek models uniformly. We therefore route ALL
 * model calls (solvers, judges, adversarial reviewers) through this one
 * authenticated CLI.
 *
 * `droid exec ... --output-format json` prints a single JSON object whose
 * `.result` field holds the model's textual answer plus a `.usage` block.
 */

const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Highest reasoning effort actually supported per model (literal "max" is not
// valid for GPT/Gemini). See plan / `droid` model listing.
const MAX_EFFORT = {
  'gpt-5.5-pro': 'xhigh',
  'gemini-3.1-pro-preview': 'high',
  'deepseek-v4-pro': 'max',
  'claude-opus-4-8': 'max',
  'claude-sonnet-4-6': 'high',
  'claude-haiku-4-5-20251001': 'high',
};

function maxEffortFor(model) {
  return MAX_EFFORT[model] || 'high';
}

// --- Harness isolation -------------------------------------------------------
// The Factory session injects ~/.factory/AGENTS.md and a ~150-skill catalog (incl.
// the thinking skills) into every solver. We CANNOT remove that passive context
// without a Factory API key (the WorkOS session is keyring-bound and home-override
// breaks auth). What we CAN and MUST do: disable every tool so the solver cannot
// INVOKE another skill or READ the repo (the active confound), run from a neutral
// cwd (no project AGENTS.md/files), and instruct it to ignore the passive context.
// The residual catalog is identical across all conditions, so it cannot bias a
// skill-vs-placebo delta or a capability slope. Set EVAL_NO_ISOLATE=1 to opt out.
const ISOLATION_DISABLED_TOOLS = ['Read', 'LS', 'Execute', 'Grep', 'Glob', 'WebSearch', 'TodoWrite', 'FetchUrl', 'Skill', 'Edit', 'Create', 'Task', 'ToolSearch', 'GenerateDroid', 'ProposeMission', 'StartMissionRun', 'DismissHandoffItems', 'EndFeatureRun', 'ExitSpecMode'];
const ISOLATION_PROMPT = 'You are answering a SELF-CONTAINED task. Ignore any "Available skills" list, AGENTS.md, "Agent Guidelines", personal/calendar/email instructions, plugins, custom droids, or external tools in your context — they are irrelevant here. Do not invoke skills or read files. Reason using ONLY the content of this message.';
const ISOLATE = process.env.EVAL_NO_ISOLATE !== '1';

function buildArgs(model, effort, promptFile) {
  const args = ['exec', '-m', model, '-r', effort, '-f', promptFile, '--output-format', 'json'];
  if (ISOLATE) args.push('--disabled-tools', ISOLATION_DISABLED_TOOLS.join(' '), '--append-system-prompt', ISOLATION_PROMPT);
  return args;
}
function spawnOpts(extra) { return { encoding: 'utf8', cwd: os.tmpdir(), ...extra }; } // neutral cwd: no project AGENTS.md/files

let tmpCounter = 0;
function writeTempPrompt(prompt) {
  // Avoid Date.now()/Math.random() (unavailable in some sandboxes elsewhere;
  // harmless here but keep deterministic): use pid + counter.
  const name = `droid-prompt-${process.pid}-${tmpCounter++}.txt`;
  const p = path.join(os.tmpdir(), name);
  fs.writeFileSync(p, prompt, 'utf8');
  return p;
}

/**
 * Run a single droid exec call.
 * @param {object} opts
 * @param {string} opts.model            droid model id
 * @param {string} [opts.effort]         reasoning effort; defaults to model max
 * @param {string} opts.prompt           the prompt text (written to a temp file)
 * @param {number} [opts.timeoutMs]      default 600000 (10 min)
 * @returns {{ok:boolean, text:string, usage:object|null, durationMs:number|null, error:string|null, raw:string}}
 */
function droidExec(opts) {
  const { model, prompt } = opts;
  const effort = opts.effort || maxEffortFor(model);
  const timeoutMs = opts.timeoutMs || 600000;
  if (!model) throw new Error('droidExec: model required');
  if (!prompt) throw new Error('droidExec: prompt required');

  const promptFile = writeTempPrompt(prompt);
  const args = buildArgs(model, effort, promptFile);

  let res;
  try {
    res = spawnSync('droid', args, spawnOpts({ timeout: timeoutMs, maxBuffer: 64 * 1024 * 1024 }));
  } finally {
    try { fs.unlinkSync(promptFile); } catch (_) { /* ignore */ }
  }

  const raw = (res.stdout || '') + (res.stderr ? `\n[stderr] ${res.stderr}` : '');

  if (res.error) {
    return { ok: false, text: '', usage: null, durationMs: null, error: String(res.error.message || res.error), raw };
  }
  if (res.status !== 0) {
    return { ok: false, text: '', usage: null, durationMs: null, error: `exit ${res.status}`, raw };
  }

  // droid prints one JSON object on stdout. Find the last line that parses.
  const parsed = parseDroidStdout(res.stdout || '');
  if (!parsed) {
    return { ok: false, text: '', usage: null, durationMs: null, error: 'could not parse droid json', raw };
  }
  return {
    ok: parsed.is_error ? false : true,
    text: typeof parsed.result === 'string' ? parsed.result : JSON.stringify(parsed.result),
    usage: parsed.usage || null,
    durationMs: parsed.duration_ms || null,
    error: parsed.is_error ? (parsed.result || 'is_error') : null,
    raw,
  };
}

/** Async variant using spawn (non-blocking) for real concurrency. */
function droidExecAsync(opts) {
  return new Promise((resolve) => {
    const { model, prompt } = opts;
    const effort = opts.effort || maxEffortFor(model);
    const timeoutMs = opts.timeoutMs || 600000;
    if (!model || !prompt) {
      return resolve({ ok: false, text: '', usage: null, durationMs: null, error: 'model and prompt required', raw: '' });
    }
    const promptFile = writeTempPrompt(prompt);
    const args = buildArgs(model, effort, promptFile);
    const child = spawn('droid', args, spawnOpts());
    let stdout = '', stderr = '', done = false;
    const timer = setTimeout(() => { if (!done) { done = true; child.kill('SIGKILL'); finish('timeout'); } }, timeoutMs);
    child.stdout.on('data', d => { stdout += d; });
    child.stderr.on('data', d => { stderr += d; });
    child.on('error', e => finish(String(e.message || e)));
    child.on('close', () => finish(null));
    function finish(errOverride) {
      if (done && errOverride !== 'timeout') return;
      done = true;
      clearTimeout(timer);
      try { fs.unlinkSync(promptFile); } catch (_) { /* ignore */ }
      const raw = stdout + (stderr ? `\n[stderr] ${stderr}` : '');
      if (errOverride) return resolve({ ok: false, text: '', usage: null, durationMs: null, error: errOverride, raw });
      const parsed = parseDroidStdout(stdout);
      if (!parsed) return resolve({ ok: false, text: '', usage: null, durationMs: null, error: 'parse error', raw });
      resolve({
        ok: parsed.is_error ? false : true,
        text: typeof parsed.result === 'string' ? parsed.result : JSON.stringify(parsed.result),
        usage: parsed.usage || null,
        durationMs: parsed.duration_ms || null,
        error: parsed.is_error ? (parsed.result || 'is_error') : null,
        raw,
      });
    }
  });
}

async function droidJsonAsync(opts) {
  let last = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const r = await droidExecAsync(opts);
    last = r;
    if (!r.ok) continue;
    const json = extractJson(r.text);
    if (json !== null) return { ok: true, json, usage: r.usage, durationMs: r.durationMs, raw: r.text, error: null };
  }
  return { ok: false, json: null, usage: last && last.usage, durationMs: last && last.durationMs, raw: last && (last.text || last.raw), error: (last && last.error) || 'no json' };
}

function parseDroidStdout(stdout) {
  const lines = stdout.split('\n').map(l => l.trim()).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const obj = JSON.parse(lines[i]);
      if (obj && typeof obj === 'object' && ('result' in obj || 'type' in obj)) return obj;
    } catch (_) { /* keep scanning */ }
  }
  // last resort: try the whole thing
  try { return JSON.parse(stdout); } catch (_) { return null; }
}

/**
 * Extract a JSON value from arbitrary model text (handles ```json fences and
 * leading/trailing prose). Returns null if nothing parses.
 */
function extractJson(text) {
  if (!text) return null;
  // strip code fences
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidates = [];
  if (fence) candidates.push(fence[1]);
  candidates.push(text);
  for (const c of candidates) {
    const trimmed = c.trim();
    try { return JSON.parse(trimmed); } catch (_) { /* try substring */ }
    // find first balanced { } or [ ]
    const start = trimmed.search(/[{[]/);
    if (start === -1) continue;
    const open = trimmed[start];
    const close = open === '{' ? '}' : ']';
    let depth = 0, end = -1, inStr = false, esc = false;
    for (let i = start; i < trimmed.length; i++) {
      const ch = trimmed[i];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === '\\') esc = true;
        else if (ch === '"') inStr = false;
      } else {
        if (ch === '"') inStr = true;
        else if (ch === open) depth++;
        else if (ch === close) { depth--; if (depth === 0) { end = i; break; } }
      }
    }
    if (end !== -1) {
      try { return JSON.parse(trimmed.slice(start, end + 1)); } catch (_) { /* fallthrough */ }
    }
  }
  return null;
}

/** Run a droid call and parse its result as JSON, with one retry. */
function droidJson(opts) {
  let last = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const r = droidExec(opts);
    last = r;
    if (!r.ok) continue;
    const json = extractJson(r.text);
    if (json !== null) return { ok: true, json, usage: r.usage, durationMs: r.durationMs, raw: r.text, error: null };
  }
  return { ok: false, json: null, usage: last && last.usage, durationMs: last && last.durationMs, raw: last && (last.text || last.raw), error: (last && last.error) || 'no json' };
}

module.exports = { droidExec, droidJson, droidExecAsync, droidJsonAsync, extractJson, maxEffortFor, MAX_EFFORT };
