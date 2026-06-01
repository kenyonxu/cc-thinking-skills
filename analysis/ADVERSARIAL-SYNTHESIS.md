# Adversarial Synthesis — cc-thinking-skills

The headline deliverable: cross-model consensus, the most valuable unique ideas, genuine disagreements, and a prioritized (recommend-only) improvement list — all cross-referenced against the eval data.

## Method

Three frontier models reviewed the collection through `droid` at their highest reasoning effort:
- **gpt-5.5-pro** (`xhigh`)
- **gemini-3.1-pro-preview** (`high`)
- **deepseek-v4-pro** (`max`)

**Hybrid** scope: each did one holistic review of the whole collection + the eval design (`reviews/holistic/`), plus a deep per-skill pass on the 8 weakest-by-rubric skills + router (`reviews/per-skill/`, 23 of 24 reviews returned). Findings are cross-referenced against the 4-tier eval harness run (`evals/results/run1/scorecard.md`). Raw artifacts are reproducible via `reviews/*.js` and `evals/run-*.js`.

A note on what to trust: at 3 problems/skill the Tier 3 per-skill numbers are **directional**, not definitive (all three reviewers flagged this; the binomial noise on 3 trials is large). The reliable signals are the **cross-skill aggregate**, the **dimension-level patterns**, and the **unanimous qualitative consensus** below.

---

## 1. Consensus findings (ranked)

### C1. The skills are human artifacts ported to agents without adaptation — the #1 finding (3/3 + both judges)
Every reviewer, independently, reached the same conclusion, and the Tier 1 judge corroborated it:
- **GPT-5.5:** "human coaching/workshop artifacts translated too literally, with weak stop conditions, weak non-use guidance, and too much risk of framework theater or prompt bloat."
- **Gemini-3.1:** "highly articulate *consultantware* … forcing frontier LLMs to output 12-point checklists or 5-level causality chains frequently causes them to **hallucinate evidence to fill the template**."
- **DeepSeek-V4:** "designed for human readers and ported to agents without adapting for how LLMs actually fail (they don't have System 1 'gut feelings,' they have sycophancy, recency bias, and context-window blind spots)."

**Eval corroboration:** Tier 1's lowest dimension across all 39 skills is **discrimination (3.38/5)** vs fidelity **4.95/5** — the content is accurate but under-bounded. Tier 1 independently raised **6 "would-mislead-an-agent" flags**, each describing a *human-context* failure: `regret-minimization` → "project to age 80 triggers bizarre roleplay"; `pre-mortem` → "'Gather the team / silent brainstorming' causes the agent to halt and facilitate a human meeting"; `circle-of-competence` → "evaluate its track record → hallucinate a human persona"; `bayesian` → "hallucinate arbitrary exact probabilities"; `socratic` → "endlessly interrogate the user instead of writing code". The per-skill pass returned **"sharpen" on all 8 skills, "would-mislead" on 23/24 reviews — unanimous.**

### C2. Missing "when NOT to use" boundaries are a hazard for an autonomous agent (3/3)
Distinct from C1 and the single highest-leverage *content* fix. A skill with no stop condition invites over-application: running a 12-point audit on a trivial reversible choice, "challenging assumptions" into reinventing auth, interrogating instead of coding. Only ~12/39 skills document anti-patterns today. GPT: "weak stop conditions, weak non-use guidance." This is independently the weakest Tier 1 dimension (discrimination).

### C3. Five overlap clusters should be consolidated (3/3, with strong agreement on three)
Merge proposals, normalized across reviewers:
- **`bayesian` + `probabilistic` → one skill** — unanimous (3/3).
- **`model-selection` → fold into `model-router`** — effectively unanimous (3/3; one also folds `model-combination`).
- **`inversion` + `pre-mortem` (+ `red-team`) → one "surface failure paths" skill** — effectively unanimous (3/3; two add red-team).
- **Root-cause: `five-whys-plus` + `scientific-method` + `kepner-tregoe`** — GPT explicit, DeepSeek noted, Gemini flagged `five-whys` weak.
- **Systems: `systems` + `feedback-loops` + `leverage-points` + `archetypes`** — GPT explicit.

**Eval corroboration:** Tier 2 routing is **99% lenient but only 90% strict/unique**; every one of the 6 discrimination-only misroutes falls inside these clusters (`scientific-method`→`five-whys-plus` ×3, `inversion`→`pre-mortem`, `probabilistic`→`bayesian`, `debiasing`→`pre-mortem`). The descriptions don't encode the distinctions, so the router picks "whichever fires first."

### C4. The router is the right shape but the wrong implementation (3/3)
All three: a static, hand-maintained markdown matrix will rot and doesn't scale.
- **Gemini:** "introduces a mandatory multi-turn latency tax (agent asks router → router responds → agent loads skill). Routing should be implicit, handled by vector search over [descriptions]."
- **GPT:** "lacks confidence scores, precedence rules, a strong NONE path, disambiguation questions, token-cost awareness, and generated metadata from the leaf skills."
- **DeepSeek:** "a static lookup table pretending to be a skill … no feedback loop; routing mistakes are never captured."

### C5. "Quality" today measures headers, not reasoning (3/3 + the data)
All three endorsed the core premise of this work: structural lint (90%) is silent on whether a skill helps. **Eval corroboration is the whole scorecard** — e.g. `triz` scores rubric 4.4 / structural 89% yet behavioral **0%**; `occams-razor` and `five-whys-plus` score rubric **4.8** yet behavioral 33%. Structural ≠ rubric ≠ behavioral; they measure different things, and a skill can be excellent on one and fail another.

---

## 2. The convergent contrarian insight (the most important non-obvious takeaway)

Each reviewer's "most contrarian idea" landed on the **same** thesis from a different angle — which makes it the opposite of fringe. For a frontier model, **the verbose skill files may be net-negative; the durable value is triggers + boundaries + LLM-specific failure modes, not mental-model tutorials the model already knows.**

- **Gemini (most extreme):** "teaching frontier models 'mental models' via 2000-word files is fundamentally backwards. The model already possesses these concepts in its weights … The most effective version wouldn't use markdown at all — it would be 39 highly-optimized, 2-sentence prompt injections."
- **GPT:** "the best product may not be 39 auto-invoked skills … the durable value is a smaller failure-mode checklist plus a router that mostly says *don't use a mental model; gather evidence, run the test, inspect the code, make the smallest safe change.*"
- **DeepSeek:** "ship the skills the model already knows as lightweight **triggers**, not textbooks; reserve full guides for skills whose procedural content adds capability beyond pretraining."

**Eval corroboration (length-controlled Tier 3):** when the treatment is compared to a **same-length neutral placebo** (not an empty baseline), mean win-rate is **56%** and **12/36 skills regress** (the placebo matches or beats the full skill), several flagged "vocab-only" (framework theater). The naive "skill vs nothing" pilot had rated `second-order` at 67%; length-controlled it drops to 33%. This is direct evidence that a meaningful chunk of the measured "value" is context-length, not mental-model content.

**Trigger-vs-instruction probe (DeepSeek's proposed test, 8 skills, `tier3-trigger-probe.json`) — confirms the thesis, with a clean bifurcation.** Mean **skill-vs-trigger = 50%**: on average **the full 2,000–4,000-word SKILL.md is no better than a 2-sentence trigger** for a frontier solver. But the split is exactly what DeepSeek predicted:
- **Full guide earns its length** (procedure adds capability): `bayesian` (100% vs trigger), `debiasing`/`pre-mortem`/`opportunity-cost` (67%) — a calculation, a checklist, a structured process.
- **Trigger suffices / guide is dead weight** (concept already in weights): `first-principles`, `theory-of-constraints` (trigger ties or beats the full guide).

This operationalizes R5: **ship known concepts as triggers; reserve full SKILL.md files for procedural skills that demonstrably beat the one-liner.**

**Capability-curve probe (weaker `haiku` solver, 6 skills, `tier3-haiku.json`) — weak, mixed support.** Aggregate 61% (vs sonnet on the same skills); `occams-razor` strongly fits the hypothesis (haiku 100% vs sonnet 33%) and `debiasing` leans that way, but `first-principles` contradicts it (haiku 33% vs sonnet 100%). At n=3 this is suggestive, not conclusive: skills help weaker models *somewhat* more, but not monotonically. It does rule out "the skills are universally inert" — several produce real lift on the weaker model.

---

## 3. Disagreements (useful signal about contested choices)

- **Does the eval already catch a bad skill?** DeepSeek: **yes** (with the placebo fix). GPT and Gemini: **no, as originally specified** — the length confound and "model already knows it" mean the naive design over-credits skills. *Resolution:* they were right about the naive design; the placebo control + probes (added mid-run in response) address it.
- **How radical should the fix be?** Gemini wants to abolish markdown skills entirely (→ 2-sentence injections). GPT wants a much smaller failure-mode checklist + a "don't use a model" router. DeepSeek is the most conservative: keep the collection, add boundaries, consolidate clusters, ship known skills as triggers. The disagreement is *degree*, not direction.
- **Which skills are weakest** differed by reviewer (each surfaced different examples), which is why the consensus lives at the **theme** level (C1/C2), not a single ranked kill-list. The one skill flagged weak by ≥2 holistic reviewers *and* bottom-of-rubric *and* behaviorally regressing is **`debiasing`** (rubric 3.0, behavioral 0%); **`dual-process`** is the sharpest contradiction (see §5).

---

## 4. Most valuable UNIQUE ideas (single-model, worth considering)

**From DeepSeek-V4 (the most methodologically incisive reviewer):**
- **Trigger-vs-instruction test** (now implemented) — the single best eval-design contribution; it operationalizes "textbook vs one-liner."
- **A companion set of LLM-failure-mode skills** — sycophancy toward user framing, recency/context-window bias, inability to hold multiple calibrated hypotheses, over-reliance on authoritative-sounding text, failure to express calibrated uncertainty. *"The collection addresses how humans fail; it doesn't address how LLMs fail — and those are different failure modes."* High-value gap.
- **Five missing decision models:** cost-of-delay/decision-velocity, stakeholder/organizational-power mapping, information-foraging/when-to-stop-researching, assumption-articulation (surface implicit premises), escalation/when-to-defer.

**From Gemini-3.1:**
- **Implicit vector-search routing** over skill descriptions instead of a multi-turn router (removes the latency tax).
- **The "template-hallucination" mechanism** — rigid N-point templates *induce* fabricated evidence to fill slots. A concrete, testable failure mode that argues for softer scaffolding.
- **Missing engineering-native models:** divide-and-conquer/bisection (git-bisect logic), technical-debt tradeoff, CAP-theorem-style tradeoff analysis.

**From GPT-5.5 (the broadest gap analysis):**
- **An "evidence ladder for agents"** — when to inspect files vs run tests vs search docs vs ask the user vs stop. Arguably the most agent-relevant missing skill of all.
- **Chesterton's Fence as a first-class guardrail** *before* `via-negativa`/simplification/refactoring — directly mitigates a deletion hazard.
- **Goodhart's/Campbell's Law** for metric-gaming, OKRs, and **agent reward-hacking**.
- Plus a deep bench: reference-class forecasting (outside view), expected-value/value-of-information (beyond Bayesian updating), causal inference, threat-modeling (STRIDE/attack-trees) to replace generic red-team for security work, Normal Accident Theory, principal-agent/incentive design.

---

## 5. The orthogonality the data exposes (cross-tier nuance)

Behavioral lift and mislead-risk are **independent axes** — the single most important nuance for acting on this:
- **`first-principles`**: behavioral **100%** (helps on these problems) yet **3/3 "would-mislead"** (could reinvent custom auth elsewhere). *Keep, but add a strict "don't reinvent standard/secure solutions" boundary.*
- **`dual-process`**: behavioral **100%** yet DeepSeek calls it the weakest skill ("System 1/2 doesn't map to LLM cognition — anthropomorphizing noise"). *Strongest evidence that a high behavioral score on 3 gotcha-problems ≠ sound for agents.* Needs a from-scratch agent reframe.
- **`debiasing` / `regret-minimization` / `triz`**: behavioral **0%** AND flagged weak. *Highest-priority rewrites or trigger-only demotions.*
- **`circle-of-competence`**: rubric **2.4** (lowest) yet behavioral **67%**. *Don't cut on content score alone.*

A single-number quality gate would have made the wrong call on every one of these.

---

## 6. Prioritized recommendations (recommend-only)

| # | Recommendation | Evidence | Impact | Effort |
|---|---|---|---|---|
| R1 | **Add an agent-specific "When NOT to use / Stop conditions" section to every skill**, and strip human-only stage directions ("gather the team", "project to age 80"). | C1, C2; Tier1 discrimination 3.38; 6 mislead flags; 23/24 per-skill mislead | High | Med |
| R2 | **Rewrite the 6 mislead-flagged skills for an agent consumer** (`regret-minimization`, `pre-mortem`, `circle-of-competence`, `bayesian`, `first-principles`, `socratic`) — remove human-cognition assumptions; add "don't fabricate numbers / don't roleplay / don't interrogate instead of acting." | C1; Tier1 flags | High | Med |
| R3 | **Consolidate the 5 overlap clusters**, starting with the 3 unanimous merges (bayesian+probabilistic; model-selection→router; inversion+pre-mortem). Keep one skill per job with clear internal variants. | C3; Tier2 strict 90% vs lenient 99% | High | High |
| R4 | **Replace structural lint with this 4-tier harness as the quality gate** (keep Tier 0 as a free pre-filter). Adopt the length-controlled Tier 3 + trigger probe. | C5; whole scorecard | High | Low (built) |
| R5 | **Demote "model-already-knows-it" skills to lightweight triggers** where the trigger probe shows trigger ≈ full guide; reserve full SKILL.md for skills whose procedure adds capability. | §2 convergent contrarian; length-controlled Tier 3 | High | Med |
| R6 | **Evolve the router** to confidence-scored / implicit selection with a strong NONE path, token-cost awareness, and metadata generated from leaf descriptions. | C4 | Med | High |
| R7 | **Sharpen all descriptions to be situation-named and ≤200 chars** (8 currently over-budget; many name the framework, not the trigger). | EVALUATION discoverability; Tier2 | Med | Low |
| R8 | **Add a companion set of LLM-failure-mode skills** (sycophancy, recency, calibration, authoritative-text over-reliance) and an **evidence-ladder-for-agents** skill. | DeepSeek + GPT unique | Med | High |
| R9 | **Fill the highest-value missing models:** Chesterton's Fence (guard before via-negativa), Goodhart's Law, reference-class forecasting, cost-of-delay. | GPT/DeepSeek/Gemini unique | Med | Med |

---

## 7. Eval-the-evals (what the adversaries changed about this work)

The review improved the methodology mid-run — the system working as intended:
- **Placebo-length control** (DeepSeek's #1 flaw; GPT & Gemini concurred): the headline Tier 3 now compares skill vs a **same-length neutral placebo**, isolating content from context length. Implemented before the full run.
- **Strict vs lenient routing** (DeepSeek): Tier 2 now reports unique-correct (90%) separately from accept-siblings (99%), surfacing the discrimination problem the lenient metric hid.
- **Trigger-vs-instruction probe** (DeepSeek's contrarian): added to test whether each SKILL.md earns its length.
- **Capability-curve probe** (haiku solver): added to separate "skill is useless" from "frontier solver already reasons this way."
- **Acknowledged-not-fixed (out of scope this run):** small per-skill sample size (treat per-skill as directional), the self-referential Tier-1 "mislead" judge (partially cross-validated against Tier 3 here), and the absence of a real-usage telemetry tier (Tier 4) — the highest-signal tier none of this captures.

## Artifacts
- Eval scorecard: `evals/results/run1/scorecard.md` (+ `tier{0,1,2,3}-*.json`, probes)
- Raw reviews: `reviews/holistic/*.json`, `reviews/per-skill/*.json`, collated in `reviews/digest.json`
- Qualitative spine: `analysis/EVALUATION.md`; use cases: `analysis/USE-CASES.md`
