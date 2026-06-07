# Future Consolidation Plan — Elevate-or-Kill Mission

**Status: PROPOSAL ONLY — NOT EXECUTED**  
**Date:** 2026-06-07  
**Current skill count:** 39 (unchanged)  
**Proposed target:** ~26 sharper skills  

This document proposes a future catalog consolidation based on the evidence gathered during the Elevate-or-Kill mission. It is a **plan, not an action** — no skill directories have been removed, renamed, or merged. The public count remains 39. Any future execution of this plan must follow the coordinated-update checklist below.

---

## 1. Evidence Basis for Consolidation

The mission produced ZERO robust-ELEVATE skills and the following evidence pattern:
- **5 skills showed borderline-significant primary effects that collapsed under replication/power** (systems, five-whys-plus, red-team, fermi-estimation rework, scientific-method old primary)
- **8 skills are at objective ceiling** (placebo 90–100%) on current authored items — no headroom to measure
- **2 skills were powered on mismatched surfaces** (kepner-tregoe, map-territory — exploratory only)
- **19 skills remain unmeasured** — their value surface resists objective formulation or they are routing meta-skills
- **1 skill is near-ELEVATE** (scientific-method, DIRECTIONAL-NOT-REPLICATED: +5.3pp p=0.061 primary, +8.0pp p=0.001 replication)

Given this evidence, the catalog can be safely reduced without losing demonstrated value. The consolidations below remove duplication, retire ceiling/regression skills, and shrink trigger-replaceable skills to trigger cards.

---

## 2. Proposed Merges (8 skills → 4)

| Merge | Rationale | Evidence |
|-------|-----------|----------|
| `bayesian` → `probabilistic` | Identical mechanism (base-rate + update); bayesian is at ceiling on authored items | Both ceiling; probabilistic has broader forecasting surface |
| `model-selection` → `model-router` | model-router is the single entry point; model-selection's problem-classification dims fold into the router | Neither objectively measured; routing architecture favors single entry |
| `inversion` + `pre-mortem` → single failure-enumeration skill | Both enumerate failure paths; inversion is a quick checklist, pre-mortem is the narrative variant | Neither objectively measured; pre-mortem had stronger judge-only signal |
| `feedback-loops` + `archetypes` → `systems` (as depth sections) | The Meadows leverage-point table is triplicated across systems/feedback-loops/archetypes; no independent lift for the sub-skills | systems was powered (no-lift); feedback-loops and archetypes unmeasured; archetypes powered at no-lift on systems-pairwise decisive split |

---

## 3. Proposed Kills (4 skills)

| Skill | Rationale | Evidence |
|-------|-----------|----------|
| `regret-minimization` | Not agent-applicable — "project to age 80" has no meaning for a stateless agent | Judge-only: regresses (0% win rate, n=9); audit recommended kill |
| `fermi-estimation` | Powered null at n=150 (+0.7pp p=1.0); rework "rescue" was n=40 noise | `OBJ-powered-null`, post-edit, null, replicated: false |
| `debiasing` | LLMs already solve standard bias items at ceiling (100% placebo even on haiku) | `OBJ-small-ceiling`, post-edit, null, replicated: false |
| `dual-process` | Anthropomorphizing (System 1/2, "gut", "cognitive strain"); overlaps debiasing | Judge-only: 100% win rate (superseded); audit recommended rework-or-kill |

**Mitigation for kills:** Core mechanism documentation preserved in the surviving skill that absorbs the territory (e.g., debiasing sunk-cost/conservatism notes → probabilistic; Fermi decomposition heuristic → probabilistic; dual-process verification-pass → bounded-rationality).

---

## 4. Proposed Trigger-Only Shrink (13 skills)

These skills are one-paragraph reframes wrapped in 150–400 lines of textbook exposition. The evidence shows they are trigger-replaceable (the trigger card is statistically equivalent to the full guide). Shrinking them to trigger cards removes deadweight without losing the operative content.

| Skill | Trigger Card (2-4 sentences) |
|-------|------------------------------|
| `first-principles` | "Is this constraint physics or convention? Name the irreducibles and rebuild from them." |
| `reversibility` | "Is this a one-way or two-way door? If two-way, decide quickly and iterate; if one-way, slow down." |
| `occams-razor` | "When hypotheses fit equally, test the one with fewest assumptions first. Count assumptions explicitly." |
| `lindy-effect` | "Prefer older technologies/approaches for durability; but paradigm shifts invalidate the rule." |
| `via-negativa` | "Improve by removing, not adding. Don't remove load-bearing controls or tests." |
| `ooda` | "Act on 70% confidence, re-observe. For incident/time-pressure situations only." |
| `cynefin` | "Classify as Clear/Complicated/Complex/Chaotic; each domain has a different approach. Use the 4-line table." |
| `archetypes` | "Match the situation to a Senge archetype; if none match, use systems thinking." |
| `leverage-points` | "Find the highest-leverage point in the system. Move one level up from the obvious intervention." |
| `triz` | "Name the contradiction; separate in time, space, or condition. Not for ordinary trade-offs." |
| `thought-experiment` | "If you can cheaply test it, test it. Otherwise, trace the un-testable through failure/scale paths." |
| `jobs-to-be-done` | "Derive the job from PRD/tickets/usage, not interviews. Use only for product/feature decisions." |
| `bounded-rationality` | "Set a time/fidelity budget; satisfice at the threshold. For tool-call budgets and stop criteria." |

**Impact on catalog:** Trigger cards would live in the surviving skill's SKILL.md (e.g., as a "## Trigger Card" section) rather than as standalone directories. The full guide would be archived but not shipped. All 13 trigger-card skills would be removed from the active directory listing while preserving their content in the plugin's trigger-card appendix.

---

## 5. Proposed Keep-Full (Remainder)

Skills that earn their length with a genuine multi-step procedure or serve as the single entry point for a critical workflow:

| Skill | Reason to Keep Full |
|-------|---------------------|
| `scientific-method` | Near-ELEVATE; hypothesis-differential debugging procedure earns its length; strongest candidate for future ELEVATE with larger-N study |
| `systems` | Cross-service debugging hub; absorbs feedback-loops + archetypes as depth sections |
| `theory-of-constraints` | Distinct bottleneck-identification procedure; not duplicated elsewhere |
| `red-team` | Security-focused adversarial review with anti-fabrication gates; distinct from pre-mortem |
| `five-whys-plus` | Post-localization root-cause analysis with bias guards; complements scientific-method |
| `kepner-tregoe` (PA/IS-IS-NOT only) | Problem Analysis (IS/IS-NOT) is a distinct debugging procedure; retire DA/PPA |
| `probabilistic` (merged bayesian) | Reasoning under uncertainty hub; absorbs base-rate update from bayesian |
| `pre-mortem` (merged inversion) | Single failure-enumeration skill; agent-native rewrite |
| `model-router` (merged model-selection) | Single entry point; absorbs model-selection dims |
| `model-combination` | Distinct multi-model orchestration |
| `second-order` | Distinct consequence-tracing procedure |
| `opportunity-cost` | Distinct trade-off framing |
| `steel-manning` | Counters sycophancy (real LLM failure mode) |
| `map-territory` | Distinct model-vs-reality reframe (needs evaluation on its native routing/discoverability surface) |
| `margin-of-safety` | Distinct buffer-provisioning procedure |
| `circle-of-competence` | Abstention/calibration skill (needs harder items, not a kill) |

---

## 6. Net Effect

| Category | Before | After |
|----------|--------|-------|
| Merged | 8 skills | 4 merged skills |
| Killed | 4 skills | 0 skills (content absorbed) |
| Trigger-only | 13 skills | 0 standalone dirs (trigger cards in appendix) |
| Keep-Full | 14 skills | 16 skills (includes merge targets) |
| **Total active dirs** | **39** | **~26** |

**Note:** The exact count depends on how merge-target naming is resolved (e.g., does the merged probabilistic+bayesian keep the `probabilistic` directory name or both?). The range is 23–28 active skill directories after consolidation.

---

## 7. Coordinated-Update Checklist (Required If Executed)

Any future execution of this plan MUST update ALL of the following together — partial consolidation breaks the plugin:

- [ ] **Skill directories**: Remove killed directories; archive trigger-only full guides; update merge-target SKILL.md files
- [ ] **`README.md`**: Update skill count, remove killed skills from tables, update descriptions
- [ ] **Plugin metadata**: Update `plugin.json` and `marketplace.json` — skill list, count, descriptions
- [ ] **Routing cases**: Update `evals/datasets/routing-cases.jsonl` — remove killed skills, update merged skill expectations
- [ ] **Eval contracts**: Update `evals/contracts/` — remove killed skills, update merge-target contracts
- [ ] **Scorecard**: Update `analysis/ELEVATE-OR-KILL-SCORECARD.{json,md}` — mark killed/merged skills, update count
- [ ] **`CLAUDE.md`** and **`AGENTS.md`**: Update skill count references
- [ ] **`FUTURE_SKILLS.md`**: Remove any references to killed skills
- [ ] **Validation**: Run `node scripts/validate-skills.js` and `EVAL_RUN=local node evals/run-structural.js` — must pass
- [ ] **Trigger card appendix**: Create a single appendix document (e.g., `TRIGGER-CARDS.md`) collecting all trigger-card content
- [ ] **Commit**: Single atomic commit updating all of the above together

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Users relying on killed skill names | Redirect in plugin metadata; killed skill names resolve to merge target with a "this skill was merged into X" message |
| Trigger-only skills lose discoverability | Trigger cards indexed in plugin appendix with searchable keywords |
| Consolidation introduces regressions | Pre-register the consolidation, run a before/after routing eval, and replicate the scientific-method primary |
| Premature consolidation before scientific-method larger-N study | Defer consolidation until after the pre-registered larger-N primary study resolves (see `analysis/ACTIVE-PULL-FUTURE-WORK.md`) — if scientific-method achieves ELEVATE, the consolidation calculus may change |

---

*This plan is a proposal only. The public skill count remains 39. No directories have been removed or renamed. Any future execution must follow the coordinated-update checklist above and be committed as a single atomic change.*
