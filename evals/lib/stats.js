'use strict';

/** Significance helpers shared by all eval runners. No deps. */

function erf(x) {
  const s = x < 0 ? -1 : 1; x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
}
const normCdf = z => 0.5 * (1 + erf(z / Math.SQRT2));

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

module.exports = { normCdf, wilson, signTest, mcnemar, summarize };
