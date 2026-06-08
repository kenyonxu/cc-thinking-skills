'use strict';

const fs = require('fs');
const path = require('path');

const RESULTS_ROOT = path.join(__dirname, '..', 'results');

/** Shared run directory. Set EVAL_RUN to group tiers into one folder. */
function runDir() {
  const id = process.env.EVAL_RUN || 'latest';
  const dir = path.join(RESULTS_ROOT, id);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

function readJsonIfExists(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_) { return null; }
}

/** Map a thunk over items with a bounded concurrency pool. */
async function mapPool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      try { results[i] = await fn(items[i], i); }
      catch (e) { results[i] = { __error: String(e && e.message || e) }; }
    }
  }
  const workers = [];
  for (let w = 0; w < Math.min(limit, items.length); w++) workers.push(worker());
  await Promise.all(workers);
  return results;
}

/** spawnSync-based droid is blocking; wrap so the pool can interleave timers. */
function deferred(fn) {
  return () => new Promise((resolve) => { setImmediate(() => resolve(fn())); });
}

module.exports = { RESULTS_ROOT, runDir, writeJson, readJsonIfExists, mapPool, deferred };
