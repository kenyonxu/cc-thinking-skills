# Eval Coverage — per-skill inventory + gap closure

Authoritative map of what eval each of the 39 skills has, the result, and the remaining gap.
Generated against `experiments.db` + `evals/datasets/`. Layers: **T0** structural lint · **T1** rubric · **T2** routing/discoverability (all 39 have ≥1 case) · **T3** behavioral A/B (authored prompts) · **OBJ** objective ground-truth run (the layer that decides elevate/kill).

## Headline

> **[SUPERSEDED — 2026-06-07 M5 full-sample scrutiny] The claim below that `scientific-method` is a "robust, significant objective lift (+9.3pp, p=0.002)" and "ELEVATE (robust, replicate-worthy)" is SUPERSEDED. Canonical outcome: scientific-method is DIRECTIONAL-NOT-REPLICATED. The +9.3pp p=0.002 was a PRE-EDIT run1 primary that predates the SKILL.md rewrite. The M5 fresh post-edit primary scored +5.3pp p=0.061 (n=150) — FAILS the p<0.05 gate. The M5 replication (+8.0pp p=0.001) cannot rescue a failed primary. The mission produced ZERO robust-ELEVATE skills. See `analysis/ELEVATE-OR-KILL-SCORECARD.md` for the canonical verdicts.**

[SUPERSEDED — see banner above; canonical verdict = DIRECTIONAL-NOT-REPLICATED] An earlier (pre-edit run1) snapshot described **`scientific-method`** as "the only skill with a robust, significant objective lift (+9.3pp, p=0.002, SWE-bench n=150)." This is SUPERSEDED: the +9.3pp p=0.002 was a PRE-EDIT run1 primary; the M5 fresh post-edit primary scored +5.3pp p=0.061 and FAILS the p<0.05 gate; canonical verdict = DIRECTIONAL-NOT-REPLICATED. Every other apparent positive — `systems`, `five-whys-plus`, `red-team`, `fermi` — regressed to non-significance or null at n≥150. The consistent pattern across five skills: borderline p≈0.04–0.05 small-N results do **not** survive replication. Objective coverage is now **17/39 skills run**; the rest are genuinely pairwise (no objective formulation), at ceiling, or meta.

## Objectively measured (17 skills) — run with ground-truth verdicts
[SUPERSEDED — M5: canonical is 19 measured / 20 unmeasured; archetypes and kepner-tregoe were since measured as NO-LIFT; see analysis/ELEVATE-OR-KILL-SCORECARD.md]
| Skill | Objective dataset (N) | placebo→skill | Δ | p | Verdict |
|---|---|---|---|---|---|
| **scientific-method** | SWE-bench n=150 (native) | 82→91% | **+9.3** | **0.002** | **[SUPERSEDED] ELEVATE (robust, replicate-worthy)** — old run1 primary was PRE-EDIT; M5 fresh post-edit primary +5.3pp p=0.061 FAILS p<0.05 gate; replication +8.0pp p=0.001 cannot rescue; canonical verdict = DIRECTIONAL-NOT-REPLICATED; mission outcome = ZERO robust-ELEVATE |
| red-team | DiverseVul balanced n=200 | 59→64% | +5.0 | 0.10 | directional, not sig (was +11@n80) |
| first-principles | authored constraint n=30 | 93→100% | +6.7 | 0.48 | near-ceiling, ns |
| systems | SWE-bench n=150 | 84→83% | −1.3 | 0.68 | no robust effect (was +5.3@earlier) |
| five-whys-plus | SWE-bench n=150 | 83→84% | +1.3 | 0.75 | no robust effect (was +4.0@earlier) |
| fermi-estimation | jeggers/fermi n=150 | 41→41% | +0.7 | 1.0 | flat (rework neutralized −5pp, no lift) |
| map-territory | authored verify n=30 | 97→100% | +3.3 | 1.0 | ceiling |
| occams-razor | medical-dx n=45 + SWE | 40→45% | +5/+2 | ns | proxy, never confirmed |
| second-order | consequence n=30 + StrategyQA n=40 | 90→83% / 85→85% | −6.7/0 | ns | no effect (two datasets) |
| cynefin | authored classify n=30 | 97→100% | +3.3 | 1.0 | ceiling |
| theory-of-constraints | authored bottleneck n=30 | 97→97% | 0 | 1.0 | ceiling |
| reversibility | authored doors n=30 | 100→100% | 0 | 1.0 | ceiling |
| socratic | authored clarify n=29 | 100→93% | −6.9 | 0.48 | ceiling, no benefit |
| margin-of-safety | authored provision n=30 | 87→77% | −10 | 0.25 | headroom, no benefit |
| circle-of-competence | SelfAware n=70 (abstention) | 70→70% | 0 | 0.77 | no calibration benefit |
| bayesian | authored base-rate n=40 | 98→100% | +2 | 1.0 | ceiling |
| debiasing | authored bias n=40 | 100→98% | −2 | 1.0 | ceiling |

**Note on ceilings:** many authored binary sets used clear-cut extremes → placebo lands at 90–100% → no headroom → "ceiling" (the model already does this; the skill is redundant on easy cases), not a firm KILL. A real headroom test needs borderline items.

## Not yet objectively measured (22 skills) — the remaining gap
[SUPERSEDED — M5: canonical is 19 measured / 20 unmeasured; archetypes and kepner-tregoe were since measured as NO-LIFT; see analysis/ELEVATE-OR-KILL-SCORECARD.md]
| Group | Skills | Current eval | Why no OBJ run / next step |
|---|---|---|---|
| **Pairwise (have 25-problem T3 sets, not run)** | inversion*, pre-mortem, triz, thought-experiment, jobs-to-be-done, effectuation, lindy-effect, leverage-points, feedback-loops, archetypes, opportunity-cost*, via-negativa*, regret-minimization, steel-manning | T3 behavioral 25 each (inversion 3) | No clean objective formulation; run `run-behavioral.js` (judge-based — accept the judge-bias caveat) or convert lindy/triz/reversibility-style to objective |
| **Thin / hard-to-objectify** | ooda, kepner-tregoe, bounded-rationality, dual-process | T3 = 3 each | ooda/bounded-rationality resist objective framing; kepner-tregoe overlaps SWE debugging; dual-process eval deferred (no clean dataset) |
| **Leakage-blocked** | probabilistic | forecasting n=40 (not run) | All forecasting items resolve pre-cutoff → leakage; needs post-2026 items |
| **Meta (no T3)** | model-router, model-selection, model-combination | T2 routing-cases only | Build a routing-accuracy eval (does the router pick the right skill?) + a stacking-quality eval |
\* in the earlier n≈9 in-domain pooled run (directional only).

## Datasets created/sourced this session (gap closure)
- **Authored objective (judge-free), committed:** `socratic-clarify`, `cynefin-classify`, `reversibility-doors`, `first-principles-constraint`, `theory-of-constraints-bottleneck`, `second-order-consequence`, `map-territory-verify`, `margin-of-safety-provision` (8 sets, ~30 balanced each).
- **HF sourced (gitignored, reproducible via `ingest-hf.js`):** `diversevul-balanced` (100/100), `selfaware` rebalanced (35/35), `ChilleD/StrategyQA` (20/20), `jeggers/fermi` (n=150).
- **HF searched, rejected:** IBM argument-quality (renamed/gone); Anthropic global-opinions / bias polls (opinion, not correctness) — confirmed no off-the-shelf set fits the bespoke skill triggers, which is why authoring was used.

## What "rerun after evals work" produced
The two live leads were powered (both collapsed) and 7 newly-covered skills were run objectively (all null/ceiling). Net: objective coverage 13→17 skills [SUPERSEDED — M5: canonical is 19 measured / 20 unmeasured; archetypes and kepner-tregoe were since measured as NO-LIFT; see analysis/ELEVATE-OR-KILL-SCORECARD.md], and the elevate/kill conclusion is now stress-tested rather than resting on borderline small-N wins.
