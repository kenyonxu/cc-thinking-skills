'use strict';

/** Significance helpers shared by all eval runners. No deps. */

function erf(x) {
  const s = x < 0 ? -1 : 1; x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
}
const normCdf = z => 0.5 * (1 + erf(z / Math.SQRT2));

/** Log gamma function (Lanczos approximation) for exact binomial / mid-p calculations. */
function lgamma(x) {
  const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  x -= 1; let a = c[0]; const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Exact log binomial coefficient: ln(C(n,k)) = lgamma(n+1) - lgamma(k+1) - lgamma(n-k+1). */
function lnBinom(n, k) {
  if (k < 0 || k > n) return -Infinity;
  return lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);
}

/** Exact two-sided binomial p-value vs p=0.5 (sum of probabilities <= observed). */
function binomExactTwoSided(k, n) {
  const logPmf = i => lnBinom(n, i) - n * Math.LN2;
  const target = logPmf(k);
  let p = 0;
  for (let i = 0; i <= n; i++) if (logPmf(i) <= target + 1e-12) p += Math.exp(logPmf(i));
  return Math.min(1, p);
}

/** Mid-p McNemar: exact two-sided p minus half the probability of the observed outcome(s). */
function mcnemarMidp(b, c) {
  const n = b + c;
  if (n === 0) return 1;
  const k = Math.max(b, c);
  const logPmf = i => lnBinom(n, i) - n * Math.LN2;
  const logPobs = logPmf(k);
  let exact = 0;
  for (let i = 0; i <= n; i++) {
    const lp = logPmf(i);
    if (lp <= logPobs + 1e-12) exact += Math.exp(lp);
  }
  // mid-p = exact - 0.5 * P(observed outcome(s))
  // Observed outcomes are k and n-k (if distinct)
  const pObs = Math.exp(logPobs);
  const pOther = (k !== n - k) ? Math.exp(logPmf(n - k)) : 0;
  const midp = exact - 0.5 * (pObs + pOther);
  return Math.min(1, midp);
}

/** Returns both continuity-corrected McNemar (legacy scalar) AND mid-p. */
function mcnemarFull(b, c) {
  const n = b + c;
  if (n === 0) return { continuityCorrected: 1, midP: 1 };
  const chi = Math.pow(Math.abs(b - c) - 1, 2) / n;
  const continuityCorrected = Math.min(1, 2 * (1 - normCdf(Math.sqrt(chi))));
  const midP = mcnemarMidp(b, c);
  return { continuityCorrected, midP };
}

/** Wilson score interval for a binomial proportion. */
function wilson(k, n, z = 1.959964) {
  if (n === 0) return [0, 1];
  const p = k / n, d = 1 + z * z / n;
  const c = p + z * z / (2 * n), h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
  return [(c - h) / d, (c + h) / d];
}

/** Two-sided sign test (normal approx + continuity correction) for k successes of n vs p=0.5. */
function signTest(k, n) {
  if (n === 0) return 1;
  const z = (Math.abs(k - n / 2) - 0.5) / (0.5 * Math.sqrt(n));
  return Math.min(1, 2 * (1 - normCdf(z)));
}

/** McNemar test for paired binary outcomes: b = treatment-only successes, c = control-only successes. */
function mcnemar(b, c) {
  const n = b + c;
  if (n === 0) return 1;
  const chi = Math.pow(Math.abs(b - c) - 1, 2) / n; // continuity-corrected
  // p from chi-square(1) = 2*(1-Phi(sqrt(chi)))
  return Math.min(1, 2 * (1 - normCdf(Math.sqrt(chi))));
}

/**
 * Paired difference statistics for paired binary/continuous arrays.
 * Returns { mean_diff, ci95: [lo, hi], correlation }.
 * Uses normal approximation CI for mean difference (paired t-like with z=1.96).
 * Correlation is Pearson's r between treatment and control.
 */
function pairedDiff(treatment, control) {
  if (!treatment || !control || treatment.length !== control.length || treatment.length === 0) {
    return { mean_diff: 0, ci95: [0, 0], correlation: 1 };
  }
  const n = treatment.length;
  const diffs = treatment.map((t, i) => t - control[i]);
  const meanDiff = diffs.reduce((a, b) => a + b, 0) / n;
  // Standard error of mean difference
  const varDiff = diffs.reduce((s, d) => s + (d - meanDiff) ** 2, 0) / (n - 1 || 1);
  const se = Math.sqrt(varDiff / n);
  const z = 1.959964; // 95% CI
  const ci = [meanDiff - z * se, meanDiff + z * se];
  // Pearson correlation between treatment and control
  const meanT = treatment.reduce((a, b) => a + b, 0) / n;
  const meanC = control.reduce((a, b) => a + b, 0) / n;
  let cov = 0, varT = 0, varC = 0;
  for (let i = 0; i < n; i++) {
    const dt = treatment[i] - meanT;
    const dc = control[i] - meanC;
    cov += dt * dc;
    varT += dt * dt;
    varC += dc * dc;
  }
  const correlation = (varT > 0 && varC > 0) ? cov / Math.sqrt(varT * varC) : 1;
  return { mean_diff: meanDiff, ci95: ci, correlation };
}

/** Summarize a win/loss/tie count into win-rate, CI, p-value, and a powered flag. */
function summarize(wins, losses, ties = 0) {
  const decisive = wins + losses;
  const n = decisive + ties;
  const winRate = n ? (wins + 0.5 * ties) / n : 0;
  const ci = wilson(wins, decisive || 1);
  const p = signTest(wins, decisive);
  return {
    wins, losses, ties, n, decisive,
    win_rate: +winRate.toFixed(3),
    ci95: [+ci[0].toFixed(3), +ci[1].toFixed(3)],
    p_value: +p.toFixed(3),
    significant: p < 0.05,
    powered: ci[0] > 0.5 || ci[1] < 0.5, // CI excludes the null
  };
}

/**
 * Distractor-aware scoring for routing/behavioral items carrying a `target` boolean flag.
 * Items are objects with { target: boolean, fired: boolean }.
 *   target=true  -> in-domain item (should fire)
 *   target=false -> off-target distractor (should NOT fire)
 *   fired=true   -> the router/behavioral model chose to invoke/fire
 *
 * Reports:
 *   fpr (false positive rate) = FP / (FP + TN) = fires on off-target / all off-target
 *   fnr (false negative rate) = FN / (TP + FN) = misses on target / all target
 *   net_utility = (TP - FP) / N  (positive for correct fires, negative for wrong fires)
 * Also returns raw counts for transparency.
 */
function scoreDistractor(items) {
  if (!items || items.length === 0) {
    return { fpr: 0, fnr: 0, net_utility: 0, tp: 0, fp: 0, tn: 0, fn: 0, n_target: 0, n_offtarget: 0, n_total: 0 };
  }
  let tp = 0, fp = 0, tn = 0, fn = 0;
  for (const item of items) {
    const isTarget = !!item.target;
    const didFire = !!item.fired;
    if (isTarget && didFire) tp++;
    else if (isTarget && !didFire) fn++;
    else if (!isTarget && didFire) fp++;
    else if (!isTarget && !didFire) tn++;
  }
  const nTarget = tp + fn;
  const nOfftarget = fp + tn;
  const nTotal = nTarget + nOfftarget;
  const fpr = nOfftarget > 0 ? fp / nOfftarget : 0;
  const fnr = nTarget > 0 ? fn / nTarget : 0;
  const netUtility = nTotal > 0 ? (tp - fp) / nTotal : 0;
  return {
    fpr: +fpr.toFixed(6),
    fnr: +fnr.toFixed(6),
    net_utility: +netUtility.toFixed(6),
    tp, fp, tn, fn,
    n_target: nTarget,
    n_offtarget: nOfftarget,
    n_total: nTotal
  };
}

module.exports = { normCdf, wilson, signTest, mcnemar, mcnemarMidp, mcnemarFull, binomExactTwoSided, lgamma, lnBinom, pairedDiff, summarize, scoreDistractor };
