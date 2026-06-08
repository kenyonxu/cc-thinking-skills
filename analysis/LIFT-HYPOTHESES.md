# Lift Hypotheses + Statistical Confidence

**Question:** how do we create a **≥10 percentage-point lift** in mean behavioral win-rate (currently **56.5%** vs a length-matched placebo), and **do we have enough data to prove we did?**

Two parts: (1) the statistical-confidence verdict computed from the actual data (`evals/stats/power.js`), and (2) an adversarial committee (gpt-5.5-pro `xhigh`, gemini-3.1-pro-preview `high`, deepseek-v4-pro `max`) that proposed lift hypotheses and then cross-examined each other (`reviews/committee/`). The committee's stat estimates were checked against the ground-truth power script — they agreed.

---

## Part 1 — Do we have a big enough dataset? **No, definitively.**

Computed from the 108 main-run comparisons (60 skill-wins / 46 placebo-wins / 2 ties; 36 skills × 3 problems):

| Question | Answer |
|---|---|
| Is the collection even significantly better than placebo (>50%)? | **No.** Sign test p=**0.21**; Wilson 95% CI **[47.1%, 65.6%]** — includes 50%. We can't currently claim the skills beat placebo *at all*. |
| Is any single skill's verdict valid at n=3? | **No.** Even a perfect **3/3 (100%)** skill has two-sided p=**0.25**. Every per-skill label is directional only. |
| Power to detect a true 10pp aggregate lift (60% vs 50%) at n=106? | **~54%** — a coin flip. (80% is the minimum bar.) |
| N to detect a 10pp aggregate lift @ 80% power? | **~194** decisive comparisons (have 106). @90%: ~259. |
| N to detect an intervention lift 56%→66%? | Two independent arms: **~373/arm**. **Paired** (old vs new skill on the *same* problem): **~194**. |
| N to detect a *concentrated* per-skill move? | 30pp (50→80%): **~20**/skill. 47pp (33→80%): **~8**/skill. 20pp: ~47/skill. |

**Verdict:** the current 108-problem set is underpowered on every axis. It cannot confirm the collection beats placebo, cannot validate any per-skill verdict, and cannot detect a 10pp aggregate lift. **To prove a 10pp lift you need roughly 2–4× the data**, and the efficient path is a **paired design** (old skill vs improved skill judged head-to-head on identical problems) at **~10–12 problems/skill (~400 total)**. Large, concentrated per-skill moves (≥30pp) are the cheapest thing to prove (~8–20 problems for the targeted skills).

---

## Part 2 — The methodological catch that reframes everything

The current Tier 3 eval is **skill-vs-placebo on *matched* problems** — every problem is one the skill is *supposed* to help with. GPT-5.5 caught the consequence: **interventions that work by routing, abstaining, or adding boundaries cannot show lift in this eval**, because there are no off-target problems for them to act on. Anti-triggers reduce *over-application* (a false-positive/deployment harm) but don't teach better execution on in-scope problems — so "add boundaries everywhere" (our top recommendation for *safety*) would score ~0pp on *this* metric.

So hypotheses split into two classes, and **you must expand the dataset to measure the second**:
- **Class A — measurable in the current matched-problem eval:** content rewrites (LLM-native reframe, executable checklists), the trigger/instruction bifurcation, the verifier gate.
- **Class B — needs an expanded eval with off-target / distractor problems:** boundaries/anti-triggers, the router/NONE-path, capability gate, active-pull tool. Without distractors these look inert; with them they're where the deployment lift actually lives.

---

## Part 3 — Ranked hypotheses (committee-vetted)

Predicted lift is the committee's estimate; "measurable now" flags Class A vs B; verdict reflects the round-2 cross-examination.

| # | Hypothesis | Pred. lift | Measurable now? | Committee verdict |
|---|---|---|---|---|
| **L1** | **Trigger/instruction bifurcation** — ship conceptual skills (first-principles, occams, theory-of-constraints…) as ~100-word triggers; keep full SKILL.md only for procedural skills (bayesian, debiasing, pre-mortem) that beat the trigger. | +10 to +14pp (subset) | **A** (with same-length control) | **Top-ranked by both judges.** Must control length and validate the conceptual/procedural split on more than the 8 probed skills. |
| **L2** | **LLM-native rewrite** — replace human framing ("you anchor", "as a leader", "project to age 80") with LLM failure modes (sycophancy to user framing, recency, miscalibration, template-hallucination, no ground-truth). | +7 to +11pp | **A** | **Top-3 by both.** Directly attacks the unanimous "human-artifact" finding; the most defensible content fix. |
| **L3** | **Agent-native executable checklists** for procedural/leakage-prone skills: inputs → ordered steps → stop condition → answer template → "do not fabricate facts/probabilities" guard; cut prose to hold length constant. | +10pp | **A** | GPT's #1. Targets actionability (4.00) + the bayesian "hallucinate exact probabilities" flag. |
| **L4** | **Mandatory "When NOT to use / stop conditions"** + strip human stage-directions. | +8 to +11.5pp claimed | **B** | Real and unanimous for *safety*, but GPT down-rates the in-scope lift: anti-triggers prevent over-application, they don't improve matched-problem reasoning. **Lift shows only with distractor problems.** |
| **L5** | **Consolidate the 5 overlap clusters** + situation-named ≤200-char descriptions. | +4 to +12pp | **B** | Improves routing discrimination (90%→); small on the matched-problem metric (lenient routing already 99%). |

---

## Part 4 — Mirages the committee killed (do **not** chase)

- **Remove the 12 "regressing" skills (DeepSeek's own top bet).** Both other models independently flagged it as the #1 mirage: *"selection-on-noise / winner's-curse pruning / overfitting by selecting on the dependent variable."* At n=3 the regressor labels are unreliable; dropping losers and re-scoring on the same data guarantees an apparent +11pp that is a **statistical illusion**, not durable lift. (If pursued at all, it must be re-measured on a fresh holdout.)
- **Contrastive micro-examples + output scaffold.** Flagged as **teaching-to-the-test / LLM-judge structural bias** — the judge conflates a neat template with better reasoning. Gemini's "most likely mirage."
- **Rewrite everything as pseudocode/YAML.** Confounds density + length + format; likely biases the judge toward structured output without improving reasoning.
- **Capability gate ("can I solve this without a skill?").** Requires an **oracle** — that self-assessment is nearly as hard as the task; LLM metacognition is poorly calibrated.

Common thread: any "lift" that comes from **format the judge likes** or from **selecting on the same noisy data** is fake. The verifier of last resort is a paired test on fresh problems.

---

## Part 5 — Most valuable *unique* ideas (single-model, worth prototyping)

- **GPT-5.5 — post-skill verifier / reversion gate.** After a skill drafts an answer, a separate *no-framework* pass checks for fabricated facts, unsupported assumptions, and "would the direct answer be better?"; if so, discard the framework output. Targets framework-theater losses **without needing an oracle router** — and it's testable in the current eval.
- **Gemini-3.1 — active pull, not passive injection.** Replace auto-injection with a `consult_mental_model` tool the agent calls *only when it recognizes it's stuck*. Converts skills from distracting background context into on-demand tools, dissolving the routing/overlap/verbosity problems at the root. This is a different architecture and arguably the highest-ceiling bet — but it changes the unit of evaluation (needs the Class-B eval).

---

## Part 6 — Recommended experiment to actually prove a ≥10pp lift

1. **Expand the dataset to ~10–12 problems/skill (~400)**, and **add ~30% off-target/distractor problems** (cases where the skill should *not* fire) so Class-B interventions (boundaries, router, active-pull) become measurable. This alone fixes the power gap (>194 decisive comparisons).
2. **Use a paired design:** judge old-skill vs new-skill outputs head-to-head on the *same* problem (most power per dollar; ~194 paired comparisons for 80% power at a 60% paired-win target).
3. **Pre-register** the 2–3 hypotheses to test (recommend **L1 bifurcation + L2 LLM-native rewrite**, plus the **GPT verifier gate** as a harness probe) and the target skills — no post-hoc selection.
4. **Keep the placebo length-control** and add a **format-control** (same structure, scrambled content) to kill the judge-bias mirages.
5. **Report the paired win-rate with a CI**, not a point estimate; treat per-skill results as directional unless a skill gets ≥8–20 problems.

**Bottom line:** the committee converges on *L1 (bifurcation)* and *L2 (LLM-native rewrite)* as the most credible, in-eval paths to a real ≥10pp lift, with the *verifier gate* and *active-pull tool* as higher-ceiling architectural bets — but **none of it can be proven on today's 108 problems.** Step 1 is to grow and re-shape the dataset; only then is a 10pp claim statistically defensible.

## Artifacts
- Power analysis: `evals/stats/power.js` (run it: `node evals/stats/power.js`)
- Committee raw: `reviews/committee/round1-*.json`, `round2-*.json` (deepseek round-2 returned prose, not JSON — its round-1 + the other two round-2 passes carry the cross-examination)
