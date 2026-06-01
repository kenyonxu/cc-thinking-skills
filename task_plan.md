# Task Plan — Per-Skill Research, Experiments & Evals (elevate-or-kill)

## Goal
For **every one of the 39 thinking skills**: (1) deep research on the domains where it drives better outcomes, (2) a concrete experiment + eval protocol with an **elevate-or-kill decision rule**, (3) HuggingFace datasets to power those evals. Build on the harness already created this session.

## Decision rule (applies to every skill)
A skill is **ELEVATED** if, on its claimed in-domain problems under the isolated, length-controlled harness, it beats a length-matched placebo with a **pooled lower-CI > 50%** (significant positive lift). **KILLED/REWORK** if its CI includes or sits below 50% across adequate N (≥~40 decisive). **TRIGGER-ONLY** if a 2-sentence trigger matches the full guide (ship lean). Per-skill verdicts require ≥~20–40 problems; below that, directional only.

## Phases
- [x] **Phase 0 — Harness (DONE earlier this session).** behavioral/correctness/routing/capability/stacking runners, ingester+classifier, stats lib, judge panel, **verified isolation** (no skill/AGENTS contamination of the solver), experiments ledger (experiments.db), dashboard.
- [x] **Phase 1 — Per-skill research (39).** Domains where each skill drives better outcomes: claimed domains (already extracted) + literature/evidence + our eval data. Output → `findings.md` + `analysis/SKILL-RESEARCH.md`.
- [x] **Phase 2 — Per-skill eval protocol (39).** For each skill: eval mode (correctness / pairwise / routing), the comparison, target N, HF/authored dataset, and the elevate-or-kill threshold. Output → `analysis/PER-SKILL-EVAL-PROTOCOL.md`.
- [x] **Phase 3 — HuggingFace dataset sourcing.** Map each skill-domain to datasets; extend `evals/datasets/ingest-hf.js` with new sources; ingest+classify. Output → updated `evals/datasets/external/` + protocol dataset column.
- [ ] **Phase 4 — Execute powered isolated evals (prioritized subset).** Run the isolated in-domain protocol on a prioritized set; record per-skill verdicts to experiments.db. (Full 39 = staged; thousands of calls.)
- [ ] **Phase 5 — Synthesis.** Per-skill elevate/kill scorecard + recommendations. Output → `analysis/ELEVATE-OR-KILL.md` + dashboard panel.

## Key constraints
- **Isolation ON** for all solver calls (verified; see `analysis/HARNESS-ISOLATION.md`). Residual passive catalog is constant across conditions.
- **Domain = skill↔problem fit** (a problem is a realistic instance of the skill's "When to Use" triggers), not subject matter alone — see the in/out-of-domain analysis.
- **Power:** ~200 decisive comparisons for a 10pp aggregate; ~20–40/skill for large per-skill moves. Treat small-N per-skill as directional.
- **Cost:** powered all-39 execution is thousands of calls → design fully, execute staged.

## Status
Phase 0 ✅. Phase 1 ✅ (4 research agents → domains + evidence per skill). Phase 2 ✅ (`analysis/PER-SKILL-EVAL-PROTOCOL.md` — all 39 skills: eval mode, elevate-or-kill rule, verified HF datasets). Phase 3 in progress (download verified datasets + extend ingester). Phase 4 next (one powered elevate/kill demo, e.g. red-team on DiverseVul).

## Phase 6 — Skill audit + best practices + scope/domain research (NEW)
For all 39: audit against an evidence-grounded best-practices rubric (situation-named desc, when-NOT-to-use boundaries, agent-native framing, right delivery scope trigger-vs-full, narrowed domain, anti-framework-theater, distinctness) + per-skill scope/domain recommendation (keep/narrow/broaden/refocus/merge/kill). Output → `analysis/SKILL-AUDIT.md`.

## Phase 7 — "Can we get +5 on the other skills?" (NEW)
Honest: +5 is conditional on domain-fit + headroom (why systems won). 
- 7a: powered SWE-bench confirmation of five-whys-plus + occams-razor (the other ELEVATE-leaning debugging skills). 
- 7b: REWORK experiment — agent-native rewrite + narrowed scope + boundaries of a flat skill (scientific-method), re-run on SWE-bench; does the rework earn +5 where the original got 0?
- Conclusion: which skills CAN reach +5 (domain-fit+headroom), which CAN'T (ceiling/redundant), which need rework not re-measurement.
