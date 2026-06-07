# Elevate-or-Kill — Executive Synthesis

**Generated:** 2026-06-07  
**Source:** `analysis/ELEVATE-OR-KILL-SCORECARD.{json,md}` (canonical single source of truth)  
**Mission:** Full replication-gated evaluation of all 39 shipped thinking skills  
**M5 Powered Run:** 7 skills powered (hard cap 10), solver `claude-sonnet-4-6`, CONC=4, isolation ON  

---

## Headline Result

**The mission produced ZERO robust-ELEVATE skills.** No skill met the full ELEVATE bar (≥5pp lift on its primary value surface, passes paired test at p<0.05, AND replicates on a fresh independent sample in the same direction). The strongest candidate — `scientific-method` — finished **DIRECTIONAL-NOT-REPLICATED**: its M5 fresh primary scored +5.3pp but p=0.061 (fails the p<0.05 gate), and while its replication was significant (+8.0pp, p=0.001), a successful replication cannot rescue a primary that fails the paired-test gate.

This is an honest, evidence-backed conclusion. The mission deliberately did NOT chase significance by enlarging samples after seeing borderline p-values (per documented anti-p-hacking decision 2026-06-07 in AGENTS.md). A properly pre-registered larger-N primary study for `scientific-method` is recommended as future work.

---

## Section 1: Verdict Categories — Complete Listing

Every claim below carries the three required provenance dimensions: **pre/post-edit**, **directional/significant/null**, **replicated: false** (no skill-level ELEVATE verdict achieved replication).

### 1.1 DIRECTIONAL-NOT-REPLICATED

Skills that showed a positive primary signal but failed the replication gate (primary did not pass p<0.05, or replication failed/mismatched).

| Skill | Primary | Replication | Status |
|-------|---------|-------------|--------|
| **scientific-method** | +5.3pp, p=0.061 (n=150, post-edit, directional) | +8.0pp, p=0.001 (n=150, post-edit, significant) | Primary fails p<0.05 gate; replication significant but cannot rescue. **Downgraded from ELEVATE. No skill currently holds ELEVATE.** |
| **red-team** | +1.4pp, p=1.0 (n=70, post-edit, null) on harder CWE decisive split; earlier +5.0pp p=0.10 (n=200, post-edit, directional) on easier diversevul pool | N/A (primary did not pass) | Directional positive signal on easier items (+5.0pp) but not significant; collapsed to noise on harder items (+1.4pp). |

### 1.2 NO-LIFT

Skills that received a powered evaluation on their calibrated decisive split and showed no significant lift over placebo. These were given a fair chance — calibrated headroom, frozen split, post-edit evaluation.

| Skill | Dataset | N | Placebo → Skill | Δ (pp) | p | Family | Notes |
|-------|---------|---|-----------------|--------|---|--------|-------|
| **systems** | SWE-bench decisive split | 150 | 83% → 84% | +1.3 | 0.724 | Debugging/fault-localization | Original +5.3pp p=0.043 **superseded**; replication −1.3pp p=0.683. Not reworked this mission; split frozen before result. |
| **five-whys-plus** | debugging-fault-localization-decisive | 224 | 59% → 59% | +0.9 | 0.724 | Debugging/fault-localization | Original +4.0pp p=0.041 **superseded**; replication +1.3pp p=0.752. M4 reworked skill, decisive split, full-n=224. |
| **occams-razor** | debugging-fault-localization-decisive | 224 | 56% → 55% | −0.9 | 0.724 | Debugging/fault-localization | M4 reworked skill; trigger-scoped rework did not move needle. Full-n=224. |
| **archetypes** | systems-product-strategy-pairwise decisive | 117 | 72% → 73% | +0.9 | 1.0 | Systems/product/strategy pairwise | In-band quarantine candidate given fair chance. No lift detected. |
| **fermi-estimation** | jeggers/fermi | 150 | 41% → 41% | +0.7 | 1.0 | Quantitative/uncertainty | Rework "rescue" at n=40 (+7.5pp) was noise. Powered n=150 confirmation flat. |

### 1.3 NO-LIFT (Exploratory — Surface Mismatch)

Skills powered on a debugging/fault-localization surface that does NOT match their native value surface. A no-lift here is NOT an honest kill — these skills need evaluation on their true surface.

| Skill | Powered Surface | Native Surface | N | Δ (pp) | p |
|-------|----------------|----------------|---|--------|---|
| **kepner-tregoe** | fault-localization | paired reasoning quality | 224 | −1.8 | 0.289 |
| **map-territory** | fault-localization | routing/discoverability | 224 | +2.2 | 0.074 |

### 1.4 CEILING-NEEDS-HARDER-DATA

Skills where the placebo/baseline accuracy is at or near ceiling (90–100%), leaving no headroom to measure a skill effect. These are NOT kill verdicts — they need harder calibrated items before a powered verdict is possible.

| Skill | Dataset | N | Placebo | Δ (pp) | Provenance |
|-------|---------|---|---------|--------|------------|
| `first-principles` | authored constraint | 30 | 93% | +6.7 (ns) | `OBJ-small-ceiling` |
| `map-territory` | authored verify | 30 | 97% | +3.3 (ns) | `OBJ-small-ceiling` |
| `cynefin` | authored classify | 30 | 97% | +3.3 (ns) | `OBJ-small-ceiling` |
| `theory-of-constraints` | authored bottleneck | 30 | 97% | 0 (ns) | `OBJ-small-ceiling` |
| `reversibility` | authored doors | 30 | 100% | 0 (ns) | `OBJ-small-ceiling` |
| `bayesian` | authored base-rate | 40 | 98% | +2 (ns) | `OBJ-small-ceiling` |
| `debiasing` | authored bias | 40 | 100% | −2 (ns) | `OBJ-small-ceiling` |
| `socratic` | authored clarify | 29 | 100% | −6.9 (ns) | `OBJ-small-ceiling` |

### 1.5 Unmeasured / Pending Objective Evaluation

Skills with no objective ground-truth run — either because their value surface resists objective formulation (paired reasoning quality), they are routing meta-skills, or they were not in the M5 powered batch.

| Group | Skills | Reason |
|-------|--------|--------|
| **Pairwise/behavioral only** | `inversion`, `pre-mortem`, `triz`, `thought-experiment`, `jobs-to-be-done`, `effectuation`, `lindy-effect`, `leverage-points`, `feedback-loops`, `opportunity-cost`, `via-negativa`, `regret-minimization`, `steel-manning` | No clean objective formulation; value surface = paired reasoning quality |
| **Thin / hard-to-objectify** | `ooda`, `bounded-rationality`, `dual-process` | Resist objective framing; small-N judge-only evidence only |
| **Leakage-blocked** | `probabilistic` | Forecasting items resolve pre-cutoff |
| **Meta (routing only)** | `model-router`, `model-selection`, `model-combination` | Routing-only evaluation; need routing-accuracy metric |
| **Other** | `circle-of-competence`, `second-order`, `margin-of-safety` | Measured but non-powered or small-N negative |

---

## Section 2: Cross-Cutting Conclusions

### 2.1 The Replication Gate Works As Designed

The mission's defining finding is NOT that skills lack value — it is that **borderline p≈0.04–0.05 results at modest N do not survive replication.** The pattern is consistent across five skills:

- `systems`: +5.3pp p=0.043 → replication −1.3pp p=0.683
- `five-whys-plus`: +4.0pp p=0.041 → replication +1.3pp p=0.752
- `red-team`: +11.3pp p=0.052 (n=80) → +5.0pp p=0.10 (n=200)
- `fermi-estimation`: rework +7.5pp (n=40) → +0.7pp p=1.0 (n=150)
- `scientific-method`: +9.3pp p=0.002 (old run1) → +5.3pp p=0.061 (M5 fresh primary, post-edit)

The replication gate prevented false ELEVATE claims that a single-p<0.05 approach would have declared. **"Replication, not a single p<0.05" is the standard any future ELEVATE claim must meet.**

### 2.2 Scientific-Method Is the Closest to ELEVATE — But Not There

`scientific-method` (hypothesis-differential debugging) is the strongest skill in the catalog. Its M5 replication (+8.0pp, p=0.001, post-edit, significant) is a genuine signal — the effect is real and in the right direction. But the M5 fresh primary (+5.3pp, p=0.061, post-edit, directional) falls just short of the paired-test gate.

**We deliberately did NOT enlarge the primary sample to chase p<0.05** — that would be optional-stopping/p-hacking (see AGENTS.md Anti-P-Hacking decision 2026-06-07). A properly pre-registered larger-N study (~n=300–400) with a single pre-specified stopping rule is the correct next step (see `analysis/FUTURE-CONSOLIDATION-PLAN.md` and `analysis/ACTIVE-PULL-FUTURE-WORK.md`).

### 2.3 Domain-Fit Determines the Sign

The native-domain debugging run showed that 3/4 debugging skills had a consistent small positive lift (+4–9pp at n=45), while the same skills were flat or negative in proxy domains (medical dx). The value of thinking skills is **entirely conditional on domain-fit** — they do not generalize across unrelated problem types.

### 2.4 The Catalog's Value Is in Reasoning Framing, Not Measurable Correctness

On objective, judge-free tasks, injecting a thinking-skill guide produces **no reliable accuracy lift for 38 of 39 skills.** The honest value proposition of the catalog is:
- **Reasoning framing on open-ended work** (the pooled 63% pairwise lift, p=0.015, though per-skill is directional)  
- **Discoverability** — well-bounded, situation-named references  
- **One near-ELEVATE debugging skill** (scientific-method, directional-not-replicated)  

### 2.5 Quarantine/Redirect Strategy Is Evidence-Grounded

Skills flagged for quarantine/redirect (`bayesian`→`probabilistic`, `model-selection`→`model-router`, `inversion`→`pre-mortem`, `feedback-loops`/`archetypes`→`systems`/`leverage-points`, `regret-minimization`→`reversibility`, `fermi-estimation`, `debiasing`, `dual-process`) were evaluated against their evidence and either: (a) showed no lift on their value surface, (b) were at ceiling, (c) duplicated another skill's mechanism, or (d) were not agent-applicable. All were given "When NOT to Use" boundaries and explicit redirect language. No skill directory was deleted — the public count remains 39.

---

## Section 3: Active-Pull Track — Deferred

The **active-pull** experiment track (described in `analysis/ACTIVE-PULL-FUTURE-WORK.md`) is documented as future work only. Nothing was built or wired into the shipped harness. The concept: pre-register a study where the harness actively fetches fresh items (e.g., newly reported CVEs, post-cutoff forecasting questions, recent SWE-bench issues) at evaluation time, eliminating leakage concerns and enabling continuous calibration. This requires a live data pipeline, a freshness-gated sampling protocol, and pre-registered stopping rules — all out of scope for this mission.

---

## Section 4: Future Consolidation Plan — Not Executed

A separate consolidation plan (`analysis/FUTURE-CONSOLIDATION-PLAN.md`) proposes reducing the catalog below 39 skills (merging overlapping skills, retiring kill candidates, and shrinking trigger-only skills to trigger cards). This plan is a **proposal only** — the skill count remains 39 and no directories were removed or renamed. The plan includes a coordinated-update checklist for any future reduction: README, plugin metadata, routing cases, eval docs, and directory changes must all be updated together.

---

## Section 5: Provenance Integrity

Every eval claim in this synthesis and in the canonical scorecard carries:
- **Pre/post-edit** — identifying whether evidence predates or postdates the skill's most recent rewrite  
- **Directional/significant/null** — the statistical strength of the finding  
- **Replicated: false** — no skill-level verdict currently meets the replication gate  

There are **no unsupported +5–10pp claims.** Every numeric lift is backed by a specific result JSON file, a sample size, a p-value or CI, and a provenance tag. Stale claims from earlier mission phases (run1 scorecard n=3 wins, mid-document ELEVATE-OR-KILL.md ELEVATE assertions, SKILL-AUDIT.md "systems as proven hub") are explicitly flagged superseded in the scorecard and in the stale-claim cleanup notes.

---

## Section 6: Stale-Claim Cleanup — Summary

See `analysis/STALE-CLAIM-CLEANUP.md` for the full cleanup notes. Key actions:

1. **`analysis/SKILL-AUDIT.md`**: A superseded banner was prepended. The audit's recommendation that `systems` be kept as a "proven debugging hub" is **superseded** (systems produced no-lift at power). The 39→26 consolidation map is **obsolete** — this mission's evidence invalidated its assumptions. The audit's best-practices rubric remains useful; its per-skill dispositions are superseded where contradicted by powered evidence.

2. **`analysis/ELEVATE-OR-KILL.md`**: A superseded banner was prepended to the mid-document narrative. The "trimming regression" lesson (section ★★★) is **retracted** — the dips were NOT caused by trimming but by regression to the mean from borderline-significant draws. Only the final two sections (★ Wave C replication failure + ★★★★★ Powered confirmation collapse) and the final program verdict section are current. All earlier ELEVATE claims (systems, five-whys-plus, red-team +11.3pp, fermi rework rescue) are superseded.

3. **`analysis/ELEVATE-OR-KILL-SCORECARD.md`**: The provenance taxonomy wording was updated to remove the implication that any skill currently achieves a "replicated" status. The `OBJ-powered-significant` tag description no longer says "replicated direction" — it now clarifies this tag may describe a standalone replication run that does NOT imply the skill-level verdict is replicated.

---

## Section 7: Scorecard Summary (All 39 Skills)

| Verdict Category | Count | Skills |
|------------------|-------|--------|
| **DIRECTIONAL-NOT-REPLICATED** | 2 | `scientific-method` (primary +5.3pp p=0.061 fails gate; replication +8.0pp p=0.001 cannot rescue), `red-team` (directional only) |
| **NO-LIFT** | 5 | `systems`, `five-whys-plus`, `occams-razor`, `archetypes`, `fermi-estimation` |
| **NO-LIFT (exploratory)** | 2 | `kepner-tregoe`, `map-territory` (surface-mismatch) |
| **CEILING-NEEDS-HARDER-DATA** | 8 | `first-principles`, `cynefin`, `theory-of-constraints`, `reversibility`, `bayesian`, `debiasing`, `socratic` (+ `map-territory` on authored) |
| **Other measured** | 3 | `circle-of-competence` (no calibration benefit), `second-order` (no effect), `margin-of-safety` (headroom, no benefit) |
| **Unmeasured** | 19 | All remaining skills (pairwise, thin, leakage-blocked, meta) |
| **Total** | **39** | — |

---

*This executive synthesis is the definitive summary of the Elevate-or-Kill mission. All numeric claims are verifiable against the canonical scorecard at `analysis/ELEVATE-OR-KILL-SCORECARD.json` and the result JSONs under `evals/results/`.*
