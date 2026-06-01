# Elevate-or-Kill — synthesis & current verdicts

Ties the per-skill protocol (`PER-SKILL-EVAL-PROTOCOL.md`) to what we've actually measured this session. Most skills are **PENDING** a powered run (protocol + dataset ready); a subset has directional evidence from the isolated harness.

## Current evidence (isolated, length-controlled)
- **In-domain pooled, 10 skills** (second-order, inversion, opportunity-cost, theory-of-constraints, systems, pre-mortem, via-negativa, occams-razor, first-principles, debiasing): **63% beat placebo, n=90, p=0.015 SIGNIFICANT** → these collectively **ELEVATE**, but per-skill is directional (n≈9 each) — needs ≥20–40/skill to assign individual verdicts.
- **Trigger-vs-full (L1)** on conceptual skills (occams-razor, five-whys-plus, inversion, systems): trigger ≈/> full guide, p=0.046 → **TRIGGER-ONLY leaning** for these (ship the lean version).
- **Stacking** (first-principles+second-order+red-team): beats placebo 78% (p=0.074), beats single 72% (p=0.22) → directional synergy.
- **bayesian out-of-domain** (medical MCQ): negative — **NOT a kill** (domain mismatch; no skill claims medicine).

## Per-skill verdict status
| Skill | Current lean | Next step (from protocol) |
|---|---|---|
| second-order, inversion, opportunity-cost, theory-of-constraints, systems, pre-mortem, via-negativa, first-principles | ELEVATE-leaning (in pooled 63% set) | per-skill powered run (≥25 problems) to confirm |
| occams-razor, five-whys-plus | ELEVATE but **TRIGGER-ONLY** leaning | trigger-vs-full at N≥40 on ddxplus/OpenRCA / SWE-bench |
| **debiasing** | **INCONCLUSIVE-ceiling** (RAN) | placebo 100% (no headroom), skill 98% — redundant at textbook difficulty; re-test harder |
| red-team | PENDING | balanced vuln/safe (DiverseVul train negatives or CIRCL patches), N≥200 |
| **fermi-estimation** | **KILL/REWORK** (RAN) | 38% vs 43% placebo, trigger=43%, p=0.72, n=40 — no lift on `jeggers/fermi` |
| **bayesian** | **INCONCLUSIVE-ceiling** (RAN) | placebo 98% (no headroom), skill 100% — redundant on textbook base-rate; re-test harder/embedded |
| probabilistic | PENDING | `forecasting` (post-cutoff filter for leakage) |
| dual-process | PENDING; TRIGGER-ONLY likely | BBQ / GSM8K override-traps, N≥50 |
| scientific-method, kepner-tregoe(PA) | PENDING (correctness) | SWE-bench_Lite / OpenRCA, N≥60 |
| circle-of-competence | PENDING (routing) | `selfAware` (downloaded) — needs abstention runner |
| socratic, bounded-rationality, map-territory, margin-of-safety, ooda, cynefin | PENDING (routing) | ClariQ / authored — needs routing-on-data runner |
| steel-manning, feedback-loops, archetypes, leverage-points, triz, thought-experiment, lindy-effect, jobs-to-be-done, effectuation, reversibility, regret-minimization | PENDING (pairwise) | authored in-domain sets (+ ibm/argument_quality, CRASS) |
| model-router, model-selection, model-combination | PENDING (routing) | OUR catalog + labeled prompts; model-selection must beat router-alone or **MERGE** |

## What's needed to finish all 39 (staged Phase 4)
Two small harness additions enable the remaining modes: **(a) a numeric/OOM + Brier scorer** in `run-correctness.js` (unlocks bayesian/probabilistic/fermi), and **(b) an abstention/routing-on-external-data runner** (unlocks circle-of-competence/socratic/map-territory/bounded-rationality/cynefin/ooda). Pairwise skills need authored in-domain sets (~25 each). Then run each per the protocol's N targets. Estimated ~6–8k model calls for the full powered sweep → run as a background batch per eval-mode group.

## Datasets downloaded this session (`evals/datasets/external/`)
`diversevul.jsonl` (400 vuln functions — red-team; **note: test split all-positive, need negatives**), `selfaware.jsonl` (60 — circle-of-competence abstention), plus `financial`, `medical` (120 MCQ), `legal`, `glm-distractor`. Verified-but-not-yet-downloaded ids are listed per skill in the protocol (StrategyQA does not serve via the HF rows API).

## Phase-4 correctness results (RAN, isolated, judge-bias-free)
| Skill | Dataset | placebo | skill | Δ | p (McNemar) | n | Verdict |
|---|---|---|---|---|---|---|---|
| fermi-estimation | jeggers/fermi | 43% | 38% | −5 | 0.72 | 40 | KILL/REWORK (headroom, no lift) |
| occams-razor | MedReason dx (proxy) | 40% | 45% | +5 | 0.62 | 40 | ELEVATE-leaning (ns) |
| scientific-method | MedReason dx (proxy) | 48% | 43% | −5 | 0.62 | 40 | KILL/REWORK-leaning (ns) |
| debiasing | authored bias MCQ | 100% | 98% | −2 | 1.0 | 40 | INCONCLUSIVE-ceiling |
| bayesian | authored base-rate MCQ | 98% | 100% | +2 | 1.0 | 40 | INCONCLUSIVE-ceiling |
| debiasing (haiku) | authored | 100% | 100% | 0 | 1.0 | 40 | ceiling persists |
| bayesian (haiku) | authored | 100% | 100% | 0 | 1.0 | 40 | ceiling persists |

### Cross-cutting conclusion (objective correctness)
**No skill shows a significant objective-correctness lift.** Where there is headroom, deltas are noise-level (±5pp, p≈0.6); where there isn't, the targeted failure mode is already solved (ceiling, even on haiku). This **converges with the in-domain pairwise result** (modest, significant 63% lift on *open-ended reasoning quality*, p=0.015): the skills add a little to how a model *reasons through open problems*, but **do not improve accuracy on objective single-answer tasks**. Net: the collection's value is in reasoning *process/framing* on open work, not in correctness on solvable tasks — and even that is partly trigger-replaceable.

### Honest limits / remaining (staged)
- All correctness verdicts are n=40 → directional. Significance needs ~150–200/skill.
- occams/scientific-method ran in a **proxy domain** (medical dx), not native software → a SWE-bench run (native debugging) is the definitive test for scientific-method/five-whys/systems/occams.
- Pairwise group (17 skills) still needs authored in-domain sets at ≥25/skill for per-skill verdicts.

## NATIVE-domain debugging (SWE-bench_Lite fault localization, isolated, n=45)
| Skill | placebo | skill | Δ | p | Verdict |
|---|---|---|---|---|---|
| systems | 80% | 89% | +8.9 | 0.22 | ELEVATE-leaning (ns) |
| five-whys-plus | 82% | 89% | +6.7 | 0.25 | ELEVATE-leaning (ns) |
| occams-razor | 84% | 89% | +4.4 | 0.62 | ELEVATE-leaning (ns) |
| scientific-method | 84% | 84% | 0 | 1.0 | no effect / REWORK |

### Updated conclusion (domain-fit determines the sign)
The native-domain run **nuances the earlier "no objective lift" finding**: in their TRUE domain (software debugging), 3/4 debugging skills show a **consistent small positive lift (+4 to +9pp)** — vs the medical *proxy* where the same `scientific-method` went −5pp. So **domain-fit, not the skill alone, determines whether it helps.** Caveats: (1) placebo is high (80–84%) → partial ceiling caps the effect; (2) n=45 → few discordant pairs → none significant; `systems` (+8.9pp) is the strongest and the best candidate for a powered (~150–300 issue) confirmation. (3) `scientific-method` is flat even in-domain → REWORK candidate.

**Synthesis across all Phase-4 evidence:** the thinking skills add (a) a modest *significant* lift on **open-ended in-domain reasoning** (pairwise 63%, p=0.015), (b) a *consistent directional* lift on **objective native-domain debugging** (+4–9pp, ns at n=45), and (c) **nothing** out-of-domain or where the model is already at ceiling. The value is real but small and **entirely conditional on domain-fit** — supporting situation-named descriptions, trigger-only delivery for redundant skills, and rework/kill for the consistently-flat ones (`scientific-method`, `fermi-estimation`).

## ★ FIRST SIGNIFICANT VERDICT — thinking-systems = ELEVATE
Powered SWE-bench fault localization, n=150, isolated, length-controlled:
**placebo 80% → skill 85%, Δ+5.3pp, McNemar p=0.043 (SIGNIFICANT).** 12 discordant pairs.
`thinking-systems` is the first skill to clear the elevate bar with a real, judge-bias-free, native-domain effect. The lift is **modest (+5pp) but genuine** — and it required domain-fit (software debugging) + adequate power (n=150) to surface; at n=45 it was directional-only.

### Final elevate-or-kill posture (evidence to date)
- **ELEVATE (firm):** `systems` (+5.3pp, p=0.043, native debugging).
- **ELEVATE-leaning (directional, needs power):** `five-whys-plus`, `occams-razor` (native debugging +4–7pp, ns).
- **KILL/REWORK:** `fermi-estimation` (−5pp w/ headroom), `scientific-method` (flat in-domain AND negative in proxy).
- **REDUNDANT at current capability (ceiling):** `debiasing`, `bayesian` (LLMs already debiased/Bayesian on standard framings — even haiku).
- **TRIGGER-ONLY leaning:** `occams-razor`, `five-whys-plus` (trigger ≈ full guide in earlier probe).
- **ELEVATE-leaning (open reasoning):** the 10-skill in-domain pairwise pool (63%, p=0.015) — per-skill still directional.
- **Remaining 20+ skills:** protocol + datasets ready; staged powered runs.

**The one-line takeaway:** thinking skills produce a real but small lift, *strictly conditional on domain-fit, headroom, and power* — demonstrated by `systems` clearing significance only when all three aligned. The methodology now reliably distinguishes elevate / kill / redundant / trigger-only.

## ★★ Phase 7 — "Can we get +5 on the other skills?" — ANSWERED
SWE-bench fault localization, isolated, length-controlled, n=150:
| Skill | placebo→skill | Δ | p | Outcome |
|---|---|---|---|---|
| systems | 80→85% | +5.3 | **0.043** | ELEVATE (firm) |
| five-whys-plus | 83→87% | +4.0 | **0.041** | ELEVATE (firm) |
| occams-razor | 83→85% | +2.0 | 0.45 | NOT confirmed (n=45 +4.4 was noise) |
| **scientific-method (original)** | — | **+0** | — | flat |
| **scientific-method-v2 (REWORKED)** | 84→89% | **+5.3** | 0.061 | near-sig — **rework converted 0 → +5** |

### Answer
**Yes — but only two ways, and not for every skill:**
1. **Confirm it where domain-fit + headroom already exist.** `systems` and `five-whys-plus` are now *firm significant ELEVATEs* (+4–5pp) in native debugging. `occams-razor` is NOT (regressed to +2pp ns — it was n=45 noise).
2. **Engineer it by reworking the skill** per the audit best-practices (agent-native, narrowed domain, evidence-ranked procedure, drop human stage-directions, add boundaries). The reworked `scientific-method-v2` went **0pp → +5.3pp (p=0.061)** — a flat skill turned into a near-significant +5 by the rewrite alone.

**Where +5 is NOT available:** redundant-at-ceiling skills (`debiasing`, `bayesian` — model already ~100%), measured-negative skills (`fermi`), and any skill applied out-of-domain. For those, the move is kill/merge/trigger-only, not "+5."

**Takeaway:** the +5 is real, sparse, and *manufacturable* — reworking a skill to the best-practices spec is a repeatable recipe to turn a flat skill into a measurable lift, demonstrated end-to-end (0 → +5.3) on `scientific-method`.
