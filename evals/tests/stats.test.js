'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { scoreDistractor, pairedDiff, mcnemarFull, mcnemarMidp, summarize } = require('../lib/stats.js');

test('distractor scoring: fixed fixture computes correct FPR/FNR/net_utility', () => {
  // Fixture: 3 target (2 hit, 1 miss), 3 off-target (1 wrongly fires, 2 correctly silent)
  // target items: 2 TP, 1 FN
  // off-target items: 1 FP, 2 TN
  const items = [
    { target: true,  fired: true  }, // TP
    { target: true,  fired: true  }, // TP
    { target: true,  fired: false }, // FN
    { target: false, fired: true  }, // FP
    { target: false, fired: false }, // TN
    { target: false, fired: false }, // TN
  ];
  const result = scoreDistractor(items);
  // FNR = FN / (TP + FN) = 1/3 ≈ 0.333
  // FPR = FP / (FP + TN) = 1/3 ≈ 0.333
  // net_utility = (TP - FP) / N = (2 - 1) / 6 = 1/6 ≈ 0.166667
  assert.ok(Math.abs(result.fnr - 1/3) < 1e-3, `FNR should be 1/3, got ${result.fnr}`);
  assert.ok(Math.abs(result.fpr - 1/3) < 1e-3, `FPR should be 1/3, got ${result.fpr}`);
  assert.ok(Math.abs(result.net_utility - 1/6) < 1e-3, `net_utility should be 1/6, got ${result.net_utility}`);
  assert.strictEqual(result.tp, 2);
  assert.strictEqual(result.fn, 1);
  assert.strictEqual(result.fp, 1);
  assert.strictEqual(result.tn, 2);
  assert.strictEqual(result.n_target, 3);
  assert.strictEqual(result.n_offtarget, 3);
  assert.strictEqual(result.n_total, 6);
});

test('distractor scoring: empty array returns zeros', () => {
  const result = scoreDistractor([]);
  assert.strictEqual(result.fpr, 0);
  assert.strictEqual(result.fnr, 0);
  assert.strictEqual(result.net_utility, 0);
  assert.strictEqual(result.n_total, 0);
});

test('distractor scoring: all target items fire correctly', () => {
  const items = [
    { target: true, fired: true },
    { target: true, fired: true },
  ];
  const result = scoreDistractor(items);
  assert.strictEqual(result.fnr, 0);
  assert.strictEqual(result.fpr, 0); // no off-target items
  assert.strictEqual(result.net_utility, 1); // TP=2, FP=0, N=2 => (2-0)/2 = 1
});

test('distractor scoring: all off-target items fire incorrectly', () => {
  const items = [
    { target: false, fired: true },
    { target: false, fired: true },
  ];
  const result = scoreDistractor(items);
  assert.strictEqual(result.fpr, 1);
  assert.strictEqual(result.fnr, 0); // no target items
  assert.strictEqual(result.net_utility, -1); // TP=0, FP=2, N=2 => (0-2)/2 = -1
});

test('pairedDiff: mean_diff is exact on documented fixture', () => {
  const treatment = [1, 1, 0, 1, 0];
  const control = [0, 1, 0, 0, 0];
  const result = pairedDiff(treatment, control);
  assert.ok(Math.abs(result.mean_diff - 0.4) < 1e-6, `mean_diff should be 0.4, got ${result.mean_diff}`);
  assert.ok(Array.isArray(result.ci95) && result.ci95.length === 2);
  assert.ok(typeof result.correlation === 'number');
});

test('mcnemarMidp: mid-p < continuity-corrected on (8,2)', () => {
  const result = mcnemarFull(8, 2);
  assert.ok(result.midP < result.continuityCorrected, `midP ${result.midP} should be < continuityCorrected ${result.continuityCorrected}`);
});

test('summarize: preserves all five legacy fields', () => {
  const s = summarize(7, 3, 0);
  const required = ['win_rate', 'ci95', 'p_value', 'significant', 'powered'];
  for (const k of required) {
    assert.ok(k in s, `summarize() missing legacy field: ${k}`);
  }
  assert.strictEqual(s.wins, 7);
  assert.strictEqual(s.losses, 3);
  assert.strictEqual(s.ties, 0);
  assert.strictEqual(s.n, 10);
  assert.strictEqual(s.decisive, 10);
});

test('mcnemarFull: exposes validation-compatible alias fields cc and midp', () => {
  const result = mcnemarFull(8, 2);
  // Aliases must be present
  assert.ok('cc' in result, 'mcnemarFull must expose cc alias');
  assert.ok('midp' in result, 'mcnemarFull must expose midp alias');
  // Aliases match the canonical fields
  assert.strictEqual(result.cc, result.continuityCorrected, 'cc alias must equal continuityCorrected');
  assert.strictEqual(result.midp, result.midP, 'midp alias must equal midP');
  // Original fields still present
  assert.ok('continuityCorrected' in result, 'continuityCorrected must remain');
  assert.ok('midP' in result, 'midP must remain');
  // midp < cc for (8,2)
  assert.ok(result.midp < result.cc, `midp ${result.midp} should be < cc ${result.cc}`);
});

test('mcnemarFull: legacy mcnemar scalar unchanged on (8,2) ~0.114', () => {
  const { mcnemar } = require('../lib/stats.js');
  const p = mcnemar(8, 2);
  assert.ok(Math.abs(p - 0.114) < 0.003, `legacy mcnemar(8,2) should be ~0.114, got ${p}`);
});

