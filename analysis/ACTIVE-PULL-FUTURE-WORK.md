# Active-Pull Future Work — Elevate-or-Kill Mission

**Status: DEFERRED — Document Only, Nothing Built**  
**Date:** 2026-06-07  

This document describes two deferred future-work tracks from the Elevate-or-Kill mission. Neither was built or wired into the shipped harness during this mission.

---

## Track 1: Active-Pull Experiment Design (Deferred)

### Concept

Active-pull evaluation replaces static frozen datasets with a live data pipeline that fetches fresh items at evaluation time. This eliminates leakage concerns entirely (items did not exist when the skill was written) and enables continuous recalibration without manual re-sourcing.

### How It Would Work

1. **Live data sources**: The harness subscribes to feeds of newly reported CVEs (NVD API), post-cutoff forecasting questions (Metaculus API), recent GitHub issues/PRs, and fresh SWE-bench instances.
2. **Freshness gate**: Each item is timestamped; only items newer than the skill's last modification date are eligible for the decisive split.
3. **Sampling protocol**: A pre-registered sampling algorithm selects items from the live feed at evaluation time, stratified by CWE/domain/difficulty. The sample size is fixed before the run; no post-hoc enlargement.
4. **Calibration on the fly**: Each new batch is calibrated against a placebo baseline before being added to the decisive pool. Items outside the 40–70% headroom band are flagged and excluded.
5. **Continuous scoreboard**: Results accumulate over time in a live scoreboard, with verdicts updating as evidence crosses pre-registered thresholds (e.g., sequential probability ratio test with a fixed stopping boundary).

### Why It Was Deferred

- Requires a live data ingestion pipeline with API integrations (NVD, Metaculus, GitHub) — substantial infrastructure work, not a script
- Requires pre-registered sequential testing methodology (SPRT boundaries, alpha-spending functions) — statistical design work
- The mission's priority was to resolve the current catalog's status with frozen splits; active-pull is a follow-on program
- The shared `droid` API quota is already the binding constraint; adding continuous evaluation would compound this

### What Would Need to Be Built

| Component | Description |
|-----------|-------------|
| `evals/lib/live-feed.js` | API clients for NVD, Metaculus, GitHub; freshness-filtered item stream |
| `evals/lib/sequential.js` | SPRT-based verdict assignment with pre-registered stopping boundaries |
| `evals/run-active-pull.js` | Orchestrator: fetch fresh items → calibrate → power → update scoreboard |
| `evals/live-scoreboard.json` | Continuously updated scoreboard with cumulative evidence |
| Pre-registration doc | Fixed sampling algorithm, stopping rules, alpha budget |

### When to Activate

After the pre-registered larger-N scientific-method study (Track 2 below) resolves. If scientific-method achieves ELEVATE, active-pull could continuously monitor whether the effect persists as SWE-bench items evolve. If not, active-pull could be the mechanism for discovering a candidate that does work.

---

## Track 2: Pre-Registered Larger-N Primary Study for scientific-method

### The Opportunity

`scientific-method` (hypothesis-differential debugging) is the closest skill to ELEVATE in the catalog. Its M5 fresh primary scored **+5.3pp, p=0.061** (n=150, post-edit, directional) — just 0.011 above the p<0.05 gate. Its M5 replication was **+8.0pp, p=0.001** (n=150, post-edit, significant) — a genuine signal in the same direction.

The primary's borderline p=0.061 suggests a real effect that the current sample (n=150) was slightly underpowered to detect at p<0.05. A properly pre-registered larger-N study could resolve this without p-hacking.

### Anti-P-Hacking Design (Critical)

**We deliberately did NOT enlarge the primary sample during this mission** (documented decision 2026-06-07 in AGENTS.md). Enlarging N after seeing p=0.061 would be optional-stopping — it inflates the false-positive rate. The correct approach is:

1. **Pre-register everything before any data collection:**
   - Fixed sample size (recommended: n=400, calculated to detect a +5pp effect at 90% power with paired McNemar, assuming baseline 82–85% and discordant-pair rate ~8%)
   - Single stopping rule: run until n=400, then test once (no interim looks, no alpha spending)
   - Exact same frozen 150-item SWE-bench fault localization set used in M5, plus 250 additional items drawn from the same distribution (e.g., SWE-bench Verified or a held-out split) — do NOT re-use items that were in the M5 primary or replication runs
   - Exact same solver (`claude-sonnet-4-6`, high effort), same isolation settings (`EVAL_NO_ISOLATE`, `--disabled-tools`, neutral cwd)
   - Pre-specified analysis: two-sided McNemar (continuity-corrected, mid-p as supplementary), reporting both discordant-pair counts

2. **Commit the pre-registration** before running a single model call. The pre-registration file (e.g., `analysis/PRE-REGISTERED-SCIENTIFIC-METHOD-LARGER-N.md`) must be committed and timestamped.

3. **Run the full n=400** regardless of what the data looks like at n=200 or n=300. No peeking. No early stopping for significance. No adding items after seeing results.

4. **Report both the p-value and the effect size** with confidence intervals. If p<0.05 AND delta≥5pp, mark ELEVATE. If p<0.05 but delta<5pp, mark DIRECTIONAL-ONLY. If p≥0.05, mark NO-LIFT (the +5.3pp at n=150 was noise).

### Power Calculation (Illustrative)

For a paired McNemar test with baseline accuracy ≈83% (the M5 placebo rate on the frozen 150-item set):
- Assuming a +5pp treatment effect (88%), the discordant-pair split would be approximately 12 treatment-wins to 4 placebo-wins (16 discordant pairs out of 400)
- Continuity-corrected McNemar χ² = (|12−4|−1)²/16 = 3.06, p ≈ 0.080 (not significant at n=400)
- At n=400 with a +6pp effect and ~19 discordant pairs: χ² = 4.26, p ≈ 0.039 (significant)
- **Recommendation: n=500** to achieve 80% power for a +5pp effect, or accept that the effect may be smaller than 5pp and settle for a precise CI rather than significance

A more nuanced approach: use the M5 primary's empirical discordant-pair rate (14 discordant out of 150, all favoring skill) as the basis. At that rate (~9.3% discordant), n=400 would yield ~37 discordant pairs. If the split is ~25 skill-wins to ~12 placebo-wins (consistent with the observed direction), continuity-corrected McNemar would give χ² = (|25−12|−1)²/37 = 3.89, p ≈ 0.049 — right at the boundary. **Recommend n=500 for a cleaner signal.**

### Budget Estimate

At 2 `droid` calls per item (paired skill + placebo) × 500 items = 1,000 model calls. At the mission's observed ~10–15s per call with CONC=4, this is approximately 40–60 minutes of wall-clock time.

### When to Run

After the mission concludes and the orchestrator/user approves the pre-registration. This is separate from the active-pull track — it uses a static frozen dataset, not a live feed.

---

## Track 3: Proper Evaluation of Surface-Mismatched Skills

`kepner-tregoe` and `map-territory` were powered on a debugging/fault-localization surface that does not match their native value surfaces (paired reasoning quality and routing/discoverability, respectively). Their NO-LIFT verdicts are labeled **exploratory** — they need evaluation on their correct surfaces before any kill/keep decision.

### kepner-tregoe (native surface: paired reasoning quality)
- **Design:** Paired behavioral eval comparing kepner-tregoe Problem Analysis (IS/IS-NOT) vs placebo on root-cause analysis quality for complex multi-component failures
- **Items:** Authored root-cause scenarios with ground-truth fault locations; judge-evaluated reasoning quality (rubric: correct identification, evidence use, alternative elimination)
- **Control:** Format-matched placebo (same structure, different decision logic)
- **Gate:** ≥5pp pairwise win rate + replication

### map-territory (native surface: routing/discoverability)
- **Design:** Routing eval comparing map-territory trigger vs no-skill baseline on problems where model-vs-reality mismatch is the key failure mode
- **Items:** Authored scenarios where documentation/code diverge, stale assumptions cause errors, or mental models need updating
- **Metric:** Correct routing decision (use map-territory only when model-vs-reality gap is the problem; abstain otherwise)
- **Gate:** Improved routing accuracy with acceptable false-positive rate (not firing when the gap is irrelevant)

---

## Track 4: Harder Items for Ceiling Skills

8 skills are at objective ceiling (placebo 90–100%) on current authored items. A separate harder-item sourcing program is needed before these skills can receive powered verdicts. See `analysis/FUTURE-CONSOLIDATION-PLAN.md` for the full list of ceiling skills and proposed harder-item sources.

---

*None of these tracks were built or wired into the shipped harness during this mission. They are documented here as future work for a follow-on program. The pre-registered larger-N study (Track 2) is the highest-priority next step — it could resolve the mission's one near-ELEVATE candidate without p-hacking.*
