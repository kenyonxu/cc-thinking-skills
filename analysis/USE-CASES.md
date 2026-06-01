# Thinking Skills — Use-Case Research

For each of the 39 skills: the **job** it does, the **single best trigger** scenario in software/product/decision work, and **overlap notes**. Compiled from a full read of every `SKILL.md` plus research on how mental-model frameworks map to engineering and agentic workflows. This is the source material for the routing dataset (Tier 2) and the behavioral problems (Tier 3).

## How to read this

A thinking skill earns its place only if there is a **realistic moment** where a capable agent, reasoning naively, would make a specific mistake that the skill prevents. Each entry names that moment. Where two skills share the same moment, they are flagged as an **overlap cluster** — these are the discoverability risks (Tier 2) and the consolidation candidates.

---

## Decision-making & analysis

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-first-principles` | Strip a problem to fundamentals instead of reasoning by analogy. | A cost/constraint is asserted as fixed ("the vendor floor is $X", "we have to use Elasticsearch") and the real requirement is smaller than the assumed solution. |
| `thinking-second-order` | Trace "and then what?" past the immediate effect to downstream incentives. | A policy/incentive change that looks like an obvious win (self-merge PRs, fee waiver, raise alert thresholds) but reshapes behavior over months. |
| `thinking-inversion` | List ways to guarantee failure, then design against them. | Planning a high-stakes execution (data migration, public API launch) where optimism hides silent catastrophic paths. |
| `thinking-pre-mortem` | Assume the project already failed; work backward to surface risks a confident team won't volunteer. | Pre-launch / kickoff while the team is euphoric (checkout rewrite, first enterprise deal). |
| `thinking-kepner-tregoe` | Structured triage / root-cause / decision / risk analysis separating fact from speculation. | An incident with several competing theories, or a multi-criteria tech selection needing defensible weighting. |
| `thinking-reversibility` | Classify a decision one-way vs two-way door; match process weight to it. | A decision being over-analyzed (or dangerously rushed) relative to how hard it is to undo. |
| `thinking-regret-minimization` | Project to the long-horizon self; weigh inaction regret vs short-term fear. | A career/conviction decision where near-term downside is suppressing something the person clearly wants. |
| `thinking-opportunity-cost` | Price the best foregone alternative, not just the chosen path's value. | A "build it ourselves / it's free" or "say yes to this big thing" choice that consumes scarce engineer-time. |
| `thinking-occams-razor` | Prefer the fewest-assumption explanation and test it first. | A regression right after a small change where the team gravitates to an elaborate multi-condition theory over the obvious recent diff. |

## Cognitive & behavioral

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-bayesian` | Update a belief by weighing evidence against the base rate. | Interpreting a positive test/alert/metric (fraud flag, A/B lift) where a low base rate should dominate the conclusion. |
| `thinking-debiasing` | Run a structured checklist to catch predictable cognitive errors before a high-stakes call. | Signing off on a major proposal pushed by an authority figure with a polished plan and team enthusiasm. |
| `thinking-dual-process` | Decide when to trust a fast gut answer vs force deliberate analysis. | A confident first-instinct decision in a high-stakes or unfamiliar domain (incident rollback, security PR). |
| `thinking-bounded-rationality` | Set a "good enough" threshold and a stopping rule. | Tool selection / low-impact fixes / MVP scoping under a deadline where analysis would spiral. |
| `thinking-socratic` | Interrogate a request before acting on its stated framing. | Requirements gathering where a stakeholder hands you a solution ("build X") instead of the problem. |
| `thinking-probabilistic` | Express estimates as base-rate-anchored ranges tied to decisions. | Committing a delivery date or risk assessment that must drive staffing/rollout. |
| `thinking-steel-manning` | Argue the strongest version of an opposing view before rejecting it. | About to reject a teammate's proposal or validate your own decision. |
| `thinking-map-territory` | Distrust representations (metrics, diagrams, green tests) and verify against reality. | A clean metric/benchmark/diagram is about to drive a big decision (board narrative, capacity plan, "can't reproduce"). |
| `thinking-circle-of-competence` | Honestly bound expertise; defer or limit exposure outside it. | A confident decision in an adjacent/unfamiliar domain (compliance, ML vendor eval) where competence is assumed to transfer. |

## Systems & strategy

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-systems` | See a problem as an interconnected whole (loops, delays, emergence). | A fix in one place breaks something elsewhere or worsens the original symptom (retry/timeout tuning → cascade). |
| `thinking-feedback-loops` | Identify reinforcing vs balancing loops and delays to explain growth/collapse/oscillation. | A system stuck flat, running away, or swinging despite repeated effort. |
| `thinking-archetypes` | Match a recurring org/tech dysfunction to a known structural pattern. | "We keep fixing this and it keeps coming back," or growth that mysteriously starves. |
| `thinking-ooda` | Drive fast observe-orient-decide-act cycles under time pressure. | Live incident response or a fast competitive move demanding action before full certainty. |
| `thinking-leverage-points` | Rank interventions by Meadows' hierarchy (parameters → rules → goals → paradigm). | Incremental tweaks (cost trims, more QA) that never stick — find the higher-leverage change. |
| `thinking-theory-of-constraints` | Find the single throughput bottleneck; exploit and subordinate to it. | Optimizing performance/delivery where effort is being spread across non-constraints. |
| `thinking-cynefin` | Classify a problem's domain and match the method to it. | Choosing how much to plan vs experiment vs act (over-analyzing the emergent, experimenting in a crisis). |
| `thinking-scientific-method` | Localize an ambiguous fault by ranking falsifiable hypotheses and checking the cheapest discriminating observation first. | Debugging a symptom that could plausibly originate in several files, functions, configs, or services. |
| `thinking-five-whys-plus` | Rigorous root-cause analysis guarding against premature stop and single-cause bias. | Incident post-mortems and recurring bugs that keep getting "fixed" but return. |

## Problem-solving & innovation

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-triz` | Dissolve "impossible" trade-offs by separating conflicting requirements or reusing resources. | A team deadlocked on "fast OR accurate / small OR large" for a system constraint. |
| `thinking-thought-experiment` | Stress-test a design by tracing concrete scenarios mentally before building. | Evaluating a one-way-door architecture (billing ledger, real-time sync) needing confidence beyond the happy path. |
| `thinking-margin-of-safety` | Add buffers sized to uncertainty and stakes. | Capacity provisioning / deadline commitments / tight configs on a critical path. |
| `thinking-lindy-effect` | Weight longevity decisions toward proven, time-tested options. | Choosing a long-lived datastore/framework where hype competes with a boring battle-tested alternative. |
| `thinking-via-negativa` | Improve by subtracting friction/complexity/process rather than adding. | A plan that's a pile of additions on top of removable root causes (onboarding bloat, meeting overload, latency from N+1s). |
| `thinking-red-team` | Attack your own plan/design as an adversary before reality does. | Pre-launch review of an auth flow, migration cutover, or public API the author is already confident in. |

## Estimation & risk

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-fermi-estimation` | Order-of-magnitude estimates by decomposing into estimable factors. | A back-of-envelope sizing (storage, LLM/API cost, log volume) needed now with no measured data. |

## Product & innovation

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-jobs-to-be-done` | Reframe product decisions around the progress users seek and the real competitor. | Low feature adoption, or a roadmap framed as feature-parity while the true competition is a different behavior. |
| `thinking-effectuation` | Start from means / affordable loss / partner commitments, not goal-first prediction. | An open-ended "build something useful" mandate where predictive planning paralyzes. |

## Meta-skills (routers/composers — tested by Tier 2, not Tier 3)

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-model-router` | Single entry point — route a problem (domain × problem-type) to the right model. | User explicitly unsure which lens to apply; a dispatch step before deep analysis. |
| `thinking-model-selection` | Choose the right mental model for a problem. | Facing a novel problem where the usual approach failed. |
| `thinking-model-combination` | Combine multiple models for richer analysis. | A high-stakes problem where single lenses leave blind spots. |

---

## Overlap clusters (discoverability + consolidation risk)

These groups share triggers; a router will struggle to disambiguate them from a natural prompt, and they are the prime consolidation/cross-linking candidates. (Surfaced during routing-dataset authoring and confirmed against descriptions.)

1. **Debugging cluster:** `scientific-method` localizes the faulty component, `five-whys-plus` traces the confirmed cause to a systemic root, and `kepner-tregoe` is reserved for formal problem analysis. Keep those distinctions explicit to avoid "whichever fires first" routing.
2. **Systems-dynamics cluster:** `systems` ↔ `feedback-loops` ↔ `archetypes`. All about interconnected dynamics/loops; `archetypes` is separable only by "recurring fix that keeps failing."
3. **Attack-the-plan cluster:** `inversion` ↔ `pre-mortem` ↔ `red-team`. All find failure paths; differ only by stance (work-backward vs imagine-failed vs adversarial). A single planning prompt fits all three.
4. **Belief-update cluster:** `bayesian` ↔ `probabilistic`. Bayesian is the mechanism, probabilistic the framing; heavy overlap on "how confident should I be / update my estimate."
5. **Meta cluster:** `model-router` ↔ `model-selection` ↔ `model-combination`. Mutually entangled by design; `model-selection` also bleeds into `cynefin` (matching approach to problem type).

## Trigger-phrase guidance (for sharpening descriptions)

The most reliable auto-invocation comes from descriptions that name the **situation**, not the framework. Examples of high-signal triggers a description should contain:
- second-order → "before approving a policy/incentive change"
- via-negativa → "when the plan is to add more (features, infra, meetings)"
- map-territory → "when a metric or green test is about to drive a decision"
- theory-of-constraints → "when optimization effort is spread across many components"
- circle-of-competence → "deciding in an unfamiliar/adjacent domain"

These situational phrasings are what make the difference between a skill that fires at the right moment and one that never fires (or fires everywhere).
