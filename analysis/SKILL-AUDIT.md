# Skill Audit + Best Practices + Scope/Domain Recommendations

> **⚠️ SUPERSEDED — 2026-06-07 (Elevate-or-Kill M5 outcome)**
> This audit was written BEFORE the M5 powered runs. Several of its key dispositions are superseded by powered evidence. The canonical scorecard at `analysis/ELEVATE-OR-KILL-SCORECARD.md` is the authoritative source for current verdicts. See `analysis/STALE-CLAIM-CLEANUP.md` for the full cleanup notes. **The best-practices rubric remains useful; per-skill dispositions are superseded where contradicted by powered evidence.** The "Consolidation map (39 → ~26)" section is obsolete — a new evidence-based consolidation plan exists at `analysis/FUTURE-CONSOLIDATION-PLAN.md`.

Audit of all 39 skills against an evidence-grounded best-practices rubric, with a scope/domain disposition for each — built on this session's eval verdicts (`ELEVATE-OR-KILL.md`), the adversarial review (`ADVERSARIAL-SYNTHESIS.md`), and the harness-isolation findings.

## Skill best practices (the rubric, derived from what actually moved the needle)
A good agent-facing thinking skill:
1. **Situation-named description, ≤200 chars** — name the *trigger situation*, not the framework. (Drives auto-invocation; `systems` won only after its description matched its proven trigger.)
2. **Explicit "When NOT to use" / stop conditions** — the single most-missing element; for an autonomous agent a boundaryless skill invites over-application. *Weakest dimension across the entire catalog.*
3. **Agent-native framing** — no human stage directions ("gather the team", "project to age 80", "your gut", "track record", "comfortable silence", "track over time"); reframe around how *LLMs* fail (sycophancy, first-plausible-answer lock-in, fabrication), not human cognition.
4. **Right delivery scope** — a single *reframe* → ship a 2-sentence **trigger**; a genuine multi-step *procedure* that beats the trigger → keep the full guide. (Most skills are a reframe wrapped in 150–400 lines.)
5. **Narrowed domain** — claim only the domain where it drives lift (domain-fit determines the sign of the effect); don't claim "everything."
6. **Anti-framework-theater** — instruct substantive application + (for adversarial/generative skills) an anti-fabrication gate; never reward naming the model.
7. **Distinctness** — not a duplicate of a neighbor; merge overlapping skills.

## Cross-cutting defects (catalog-wide)
- **Missing "When NOT to use": ~30 of 39.** Only `bounded-rationality`, `margin-of-safety`, `five-whys-plus`, `model-combination`, `lindy-effect`, `occams-razor`, `regret-minimization` have decent boundaries.
- **Framework-named and/or >200-char descriptions:** `feedback-loops` (276), `kepner-tregoe` (233), `bounded-rationality` (236), `triz` (223), `red-team` (214), `leverage-points` (213), `systems` (204), `fermi` (201) + framework-named leads on first-principles/occams/debiasing/triz.
- **Human stage-directions (agent-native FAIL):** `pre-mortem` ("gather the team / round-robin / enforce silence"), `regret-minimization` ("project to age 80"), `debiasing` ("assign a devil's advocate"), `dual-process` ("your gut / induce cognitive strain"), `circle-of-competence` ("your track record / jQuery 2015→2024"), `socratic` ("comfortable silence / non-judgmental tone"), `probabilistic` ("track calibration over time" — stateless agent has no log).
- **Over-delivery:** most skills are one reframe in 150–400 lines → trigger-only candidates.
- **The Meadows triplication:** the leverage-point table is duplicated verbatim-in-spirit across `systems`, `feedback-loops`, `leverage-points`.

## Per-skill disposition (recommendation + highest-leverage fix)
| Skill | Disposition | Highest-leverage fix |
|---|---|---|
| **systems** | **KEEP-FULL + refocus to cross-service debugging; make it the hub** | Rewrite desc ≤200 to the proven debugging trigger; front-load the Step-1–5 debugging procedure (it's the one firm ELEVATE, +5.3pp). |
| **theory-of-constraints** | KEEP, narrow to perf/throughput bottleneck | Add stop ("no dominant stage → no constraint, use systems"); re-anchor desc on latency/throughput. |
| **red-team** | KEEP-FULL, narrow to **security**; ELEVATE candidate | Add anti-fabrication gate ("report only vulns with a reproducible attack path"); split off plan/decision variants → pre-mortem/steel-manning. |
| **five-whys-plus** | KEEP; restore trimmed procedure content before shipping | Use after scientific-method has localized the proximate cause; keep bias-guards + 5-criteria stop gate. |
| **second-order** | KEEP, trim | Replace human "10/10/10" emotional horizons with agent horizons (immediate/next-deploy/at-scale) + a stop condition. |
| **opportunity-cost** | KEEP, trim toward trigger | Lead with the 2 operative prompts (next-best-alternative + explicit do-nothing); add stop for trivial choices. |
| **steel-manning** | KEEP, trim toward trigger | Keep the core loop + "red flags" table; counters sycophancy (a real LLM failure); add "when NOT". |
| **map-territory** | KEEP, narrow to debugging reframe | Lead with "behavior≠docs/tests → verify the real code"; drop freshness/drift bookkeeping. |
| **margin-of-safety** | KEEP, narrow to provisioning buffers | Compress to the 2 margin tables + reframe; cross-link (don't dup) bounded-rationality. |
| **occams-razor** | **TRIGGER-ONLY**, scope to debugging | Ship "when hypotheses fit equally, test fewest-assumption first" + the assumption-count heuristic; ELEVATE-leaning (+4pp). |
| **first-principles** | TRIGGER-ONLY | Ship "is this constraint physics or convention?" + stop; drop the rocket case study. |
| **reversibility** | TRIGGER-ONLY | 2-sentence one-way/two-way-door trigger + "increase reversibility" moves; strip org roles. |
| **lindy-effect** | TRIGGER-ONLY (boundaries already good) | Delete the rotting age tables; keep the rule + 3 failure modes (incl. paradigm-shift). |
| **via-negativa** | TRIGGER-ONLY (in the ELEVATE pooled set) | Keep the reframe; add "don't subtract load-bearing controls/tests" gate. |
| **ooda** | TRIGGER-ONLY, narrow to incident/time-pressure | Trigger ("act on 70% confidence, re-observe") + incident examples; drop Boyd taxonomy + OODA-for-teams. |
| **cynefin** | TRIGGER-ONLY (pure classifier) | Ship the 4-line domain→approach table; drop template + checklists. |
| **archetypes** | TRIGGER-ONLY or merge → systems | Replace 7 ASCII sections with the Quick Reference Card + "none match → use systems". |
| **leverage-points** | TRIGGER-ONLY; canonical home of the Meadows table | Keep the 12-level table + "next-level-up?" prompt; de-dup the copies in systems/feedback-loops. |
| **triz** | TRIGGER-ONLY, narrow to architecture/API contradictions | Trigger ("name the contradiction, separate in time/space/condition") + "when NOT (ordinary trade-offs)". |
| **thought-experiment** | TRIGGER-ONLY, narrow to un-testable failure/scale tracing | Add stop ("if you can cheaply test it, test it"); defer adversarial → red-team. |
| **jobs-to-be-done** | REWORK (agent-native) + trigger | Replace human-interview step with "derive the job from PRD/tickets/usage"; add "when NOT (execution/infra)". |
| **bounded-rationality** | REWORK to agent-loop framing | Re-justify on tool-call budgets/stop-criteria, not "working memory"; trim desc ≤200. |
| **socratic** | REWORK, narrow to pre-build clarification | Cut facilitation tips (silence/tone); keep the 6 question-types as a clarification trigger. |
| **kepner-tregoe** | **SPLIT** — keep PA(IS/IS-NOT) for debugging, retire DA/PPA | Extract Problem Analysis as a focused root-cause skill; fold PPA→pre-mortem. |
| **scientific-method** | **REPLACED with hypothesis-differential debugging** | The old broad observe→question skill was replaced by the agent-executable evidence-ranked differential. Post-rewrite SWE-bench: +9.3pp, p=0.002. |
| **dual-process** | **REWORK or KILL** (anthropomorphizing) | Delete System 1/2 + "gut"; rebuild as "force a verification pass on high-stakes/obvious answers" — overlaps debiasing. |
| **circle-of-competence** | **REWORK → abstention** | Rebuild around "lack evidence/context → abstain/ask/fetch, don't confabulate" (selfAware-testable); drop personal-track-record tables. |
| **debiasing** | **KILL / trigger-only** (redundant-ceiling) | Model already avoids textbook biases (100% even haiku); if kept, one trigger for sunk-cost/confirmation in long trajectories. |
| **bayesian** | **MERGE → probabilistic** (ceiling) | Collapse theorem walkthrough; keep "state the base rate before updating" trigger. |
| **probabilistic** | KEEP as merged "reasoning under uncertainty"; drop calibration-log | Keep ranges+base-rate+update; strip the stateless-agent calibration-over-time apparatus. |
| **fermi-estimation** | **KILL** (negative eval, −5pp) or one-line trigger | Default kill; if kept, "decompose unknowns into estimable factors" + "don't Fermi a lookup-able number". |
| **regret-minimization** | **KILL** (not agent-applicable) | No 80-year-old self for an agent; fold the irreversible-upside nugget into reversibility. |
| **inversion** | **MERGE → pre-mortem** ("surface failure paths") | One failure-enumeration skill; inversion=quick checklist, pre-mortem=narrative variant. |
| **pre-mortem** | MERGE-target + REWORK agent-native | Strip "gather the team/round-robin"; one prospective-hindsight prompt → ranked risks. |
| **feedback-loops** | **MERGE → systems** (depth section) | No independent lift; folds loop-identification into the proven systems hub. |
| **effectuation** | KEEP, add boundary | Add "use only under Knightian uncertainty; causal planning for predictable markets". |
| **model-router** | KEEP as single entry point; **absorb model-selection** | Add "if you already know the model, skip the router" short-circuit. |
| **model-selection** | **MERGE → model-router** | Lift only its problem-classification dims + model-exit criteria into the router; retire the rest. |
| **model-combination** | KEEP (distinct), trim | Lead with anti-patterns (Model Soup, max 3-4); cut worked recipes. |

## Consolidation map (39 → ~26 sharper skills)
- **Merge clusters:** `inversion`+`pre-mortem` → *failure-enumeration*; `bayesian`+`probabilistic` → *reasoning-under-uncertainty*; `model-selection` → `model-router`; `feedback-loops`+`archetypes` → `systems` (hub). Keep `scientific-method` separate as the fault-localization differential and `five-whys-plus` as post-localization root-cause analysis.
- **Kill candidates:** `debiasing`, `regret-minimization`, `fermi-estimation`, `dual-process` (rework-or-kill).
- **Trigger-only (ship lean, drop the textbook):** ~13 skills (first-principles, reversibility, occams, lindy, via-negativa, ooda, cynefin, archetypes, leverage-points, triz, thought-experiment, jobs-to-be-done, bounded-rationality).
- **Keep full guide (procedure earns its length):** `systems`, `theory-of-constraints`, `red-team`, `five-whys-plus`, `model-router`, `model-combination`.

## The headline best-practice
Every fix above reduces to one principle the data forced: **a skill should be exactly as long as the lift it earns, scoped to exactly the domain where it earns it, written for an agent (not a human), with an explicit boundary that stops it firing elsewhere.** `systems` is the proof — it earned its full length only in its native debugging domain; everything else is over-scoped, over-broad, or human-ported until proven otherwise.
