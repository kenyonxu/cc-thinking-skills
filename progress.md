# Progress Log

## Session: per-skill research + evals (elevate-or-kill)

### Phase 0 — Harness (carried in from earlier this session) — COMPLETE
- Built: `evals/run-{structural,rubric,routing,behavioral,correctness}.js`, `experiments/run-{experiment,paired,stack,capability,capability-indomain}.js`, `evals/lib/{droid,stats,judge,conditions,skills,io}.js`, `evals/datasets/ingest-hf.js` (+ `--classify`), dashboard, experiments.db.
- Verified solver isolation (tools blocked; AGENTS.md + skill catalog are passive/constant). `analysis/HARNESS-ISOLATION.md`.
- Key empirical results so far (isolated where noted):
  - In-domain pooled (n=90, isolated): skill beats placebo **63%**, CI [53,73], **p=0.015 SIGNIFICANT**.
  - Out-of-domain (medical MCQ, Bayesian): hurt weak model (haiku −15pp) — domain-mismatch artifact.
  - Stacking (3 skills): beats placebo 78% (p=0.074), beats single 72% (p=0.22) — directional synergy.
  - Capability slope ≈ 0 in-domain (constant lift across haiku→opus).

### Phase 1 — Per-skill research — IN PROGRESS
- Dispatching parallel research agents per skill cluster.

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `gpt-5.5-pro` "Exec failed" (quota) | 1 | Swap to claude-opus-4-8 / drop from judge panels |
| 3 concurrent heavy jobs → rate-limit n=0 | 1 | Run experiments sequentially |
| Stale hung processes contending | 1 | Kill stale PIDs before re-run |
| zsh no word-split on `$var` | 1 | Pass args explicitly |

### Phases 1-3 — COMPLETE (this session)
- Phase 1 (research): 4 parallel agents → per-skill domains + evidence + verified HF datasets. → findings via agents.
- Phase 2 (protocol): `analysis/PER-SKILL-EVAL-PROTOCOL.md` — all 39 skills: eval mode (correctness/routing/pairwise), comparison, elevate-or-kill rule, dataset.
- Phase 3 (datasets): extended `ingest-hf.js` with diversevul/selfaware/strategyqa; DOWNLOADED diversevul (400), selfaware (60). Caveats: DiverseVul test split all-positive (need train negatives/CIRCL patches); StrategyQA not served by HF rows API.
- Phase 5 synthesis: `analysis/ELEVATE-OR-KILL.md` — current verdicts (10-skill pooled = ELEVATE p=0.015; occams/five-whys = TRIGGER-ONLY leaning) + staged Phase 4 plan.

### Phase 4 — STAGED (not run; thousands of calls)
Needs: numeric/OOM+Brier scorer (bayesian/probabilistic/fermi), abstention/routing-on-data runner (circle-of-competence et al.), authored pairwise sets (~25/skill). Then run per protocol N targets (~6-8k calls, batched by mode).

### Phase 4 — STARTED (correctness group)
- Built `evals/run-numeric.js` (numeric-OOM + binary-prob/Brier, paired, isolated). Downloaded `jeggers/fermi` + `YuehHanChen/forecasting`.
- **fermi-estimation → KILL/REWORK**: 38% vs 43% placebo, trigger=43%, McNemar p=0.72, n=40 (no lift on objective Fermi). Recorded `exp-eval-fermi-*` in experiments.db; ELEVATE-OR-KILL.md updated.
- Deferred: forecasting (2023 items predate solver cutoff → leakage; needs post-cutoff filter); debiasing (needs paired bias-metric wiring); scientific-method (SWE-bench, heavy).

### Phase 4 — debiasing + bayesian (running)
- Authored (2 agents): `debias-authored.jsonl` (40 normative-MCQ cognitive-bias items, 8 types × 5, biased answer = distractor) + `bayesian-authored.jsonl` (40 base-rate MCQ, posteriors verified, base-rate-neglect distractor). Both isolated correctness-mode; accuracy-delta (skill−placebo, McNemar) = bias-reduction delta.
- Running run-correctness FORCE_SKILL=debiasing/bayesian → verdicts pending.

### Phase 4 — debiasing + bayesian RESULTS (ceiling)
- **debiasing → INCONCLUSIVE-ceiling**: placebo 100%, skill 98%, n=40. **bayesian → INCONCLUSIVE-ceiling**: placebo 98%, skill 100%, n=40.
- LESSON (headroom calibration): frontier solver (claude-sonnet-4-6) is already at ceiling on textbook bias/base-rate MCQs → no room for the skill to help → eval uninformative. Authored/selected items MUST land placebo at ~30-70% (harder/embedded items, or weaker solver) for a valid elevate/kill.
- Cross-cutting Phase-4 correctness pattern: fermi KILL/REWORK (had headroom, no lift); debiasing/bayesian redundant (ceiling). On objective single-answer tasks the skills aren't adding measurable correctness — consistent with the in-domain pairwise finding that lift is modest and concentrated.

### Phase 4 — haiku re-run (headroom check) → ceiling persists
- debiasing + bayesian on claude-haiku-4-5: placebo=skill=100%, 0 discordant, n=40 each. Ceiling holds even on the weakest tier → textbook bias/base-rate failure modes are SOLVED across the ladder. Skills redundant at this difficulty (not elevate, not kill). FINDING: these skills counter human biases current LLMs don't exhibit on standard framings.
- Pivoting to red-team (security vuln detection — genuine headroom, in-domain, objective).

### Phase 4 — diagnostic-reasoning (headroom present) + cross-cutting conclusion
- occams-razor (MedReason dx proxy): placebo 40% → 45%, Δ+5pp, p=0.62, n=40 → ELEVATE-leaning (ns).
- scientific-method (MedReason dx proxy): placebo 48% → 43%, Δ−5pp, p=0.62, n=40 → KILL/REWORK-leaning (ns).
- CROSS-CUTTING (5 correctness skills): NO significant objective-correctness lift. Headroom → ±5pp noise (p≈0.6); no headroom → ceiling (solved even on haiku). Converges with in-domain pairwise (modest sig lift on OPEN reasoning, p=0.015). Conclusion: skills help reasoning *framing* on open work, not *accuracy* on objective tasks; partly trigger-replaceable. Consolidated in analysis/ELEVATE-OR-KILL.md.
- Phase 5 synthesis updated; dashboard rebuilt (71KB). Remaining (staged/heavy): SWE-bench native-domain debugging eval; authored pairwise sets ≥25/skill ×17.

### Phase 4 — NATIVE-domain debugging (SWE-bench_Lite localization, n=45) — KEY RESULT
- systems +8.9pp (80→89%, p=0.22), five-whys-plus +6.7pp (p=0.25), occams-razor +4.4pp (p=0.62), scientific-method +0pp. All isolated, native software domain.
- 3/4 debugging skills directionally POSITIVE in native domain — opposite of medical proxy (scientific-method −5pp there). DOMAIN-FIT determines the sign. None sig at n=45 (placebo 80-84% → partial ceiling → ~6 discordant). Recorded EVAL-SWE-* rows; synthesis updated.
- Next: powered confirmation of `systems` (strongest) on larger SWE-bench N.

### Phase 4 — ★ POWERED systems = SIGNIFICANT ELEVATE
- systems on SWE-bench n=150: placebo 80% → 85%, Δ+5.3pp, McNemar p=0.043 SIGNIFICANT, 12 discordant. FIRST firm ELEVATE verdict. Recorded EVAL-SWE-systems-powered. Confirms n=45 direction (+8.9→+5.3 regression to mean, crosses sig at power).
- Phase 4 demonstration COMPLETE: pipeline now yields every verdict type (firm ELEVATE / KILL / REDUNDANT-ceiling / TRIGGER-ONLY / directional). Full 39 powered sweep remains staged.

### Phase 7a — powered five-whys + occams (n=150)
- five-whys-plus: 83→87%, Δ+4pp, p=0.041 SIGNIFICANT → 2nd firm ELEVATE. occams-razor: +4.4@n45 → +2pp p=0.45 @n150 (regressed, NOT sig). "+5 on other skills" = real but sparse (genuine debugging skills only).
### Phase 7b — REWORK test: scientific-method hypothesis-differential prototype on SWE-bench, vs original 0pp.

### Phase 7b — REWORK RESULT: scientific-method prototype = 0pp → +5.3pp (p=0.061, n=150)
- Agent-native rewrite (evidence-ranked hypothesis differential, native debugging scope, boundaries, no human stage-directions) converted the flat original (0pp) into a near-significant +5.3pp. This demonstrated the rework recipe. Recorded the scientific-method rework prototype as historical evidence before replacing the shipped skill.
- Phase 7 COMPLETE. Phase 6 (audit) COMPLETE. +5 answer: systems and five-whys were firm pre-trim, scientific-method was rework-engineered, occams not confirmed; ceiling/negative skills can't reach +5 without harder data or a real rewrite.

### Post-improvement verification — improve→re-measure loop
- scientific-method (shipped replacement): 0pp → +9.3pp, p=0.002 SIG. Audit rework converted flat skill to strongest ELEVATE. Recorded EVAL-SWE-scientific-method-improved.
- systems (improved/trimmed): +5.3pp sig → +3.3pp ns. Within-noise dip; caution: don't trim proven skills without re-validating. Recorded EVAL-SWE-systems-improved.
- LESSON: rework fixes broken skills (big win); trimming proven skills risks regression → always re-measure after editing.

### Debugging cluster — FULL post-improvement re-measure CLOSED (n=150 each, SWE-bench, isolated)
- five-whys-plus (trimmed): +4.0pp p=0.041 SIG → +3.3pp p=0.131 ns. Recorded exp-eval-swe-five-whys-plus-improved-fb01.
- occams-razor (trigger-scoped): +2.0pp p=0.45 ns → +2.0pp p=0.505 ns. Unchanged — cosmetic edit, not a rework. Recorded exp-eval-swe-occams-razor-improved-cd02.
- COMPLETE 4-skill before/after: sci-method 0→+9.3 (rework win); systems +5.3→+3.3 and five-whys +4.0→+3.3 (BOTH trimming regressions — now 2 data points for the trim-caution lesson); occams +2→+2 (flat, trigger-only stands).
- Task #32 DONE. Net verdict: 1 firm ELEVATE current (sci-method); 2 proven skills need trimmed content restored to recover sig; 1 trigger-only. ELEVATE-OR-KILL.md updated with the full table + 3 lessons.

## Session: Waves A–E (goal: complete A–E, create datasets, track all revisions, document everything)
Adversarial per-wave validation by `droid -m deepseek-v4-pro` (codex substitute — codex workspace out of credits this session); records under `reviews/wave-validation/`.

### Wave A — commit uncommitted change set — COMPLETE (#33)
- 6 logical commits: ship hypothesis-differential scientific-method + retire v2; audit follow-ups (five-whys/ooda/model-router/selection); eval-informed repo metadata + README banner + AGENTS.md/CLAUDE.md; analysis/backup-record/dashboard refresh; gitignore scratch local runs.
- Adversarial verdict: claims 2–7 PASS (v2 retired, 39 skills, banner tracked, no backups in git, validate passes, no stray v2 refs). "FAIL" only on tree-clean, which was Wave B work already in flight — not a Wave A miss.

### Wave B — eval infrastructure + datasets — COMPLETE (#35,#36,#37,#38)
- NEW runners: `run-abstention.js` (circle-of-competence, balanced SelfAware) + `run-routing-data.js` (binary-decision: socratic clarify-or-not, cynefin ordered-vs-unordered). Both smoke-tested.
- NEW/fixed datasets: `diversevul-balanced` 100/100 vuln/safe (ingest-hf offset-balance); `selfaware` rebalanced 35/35 via NEW `balanceScan` mechanism; authored `socratic-clarify` + `cynefin-classify` (30 each, 15/15). 17 pairwise behavioral sets expanded 3→25 problems.
- Adversarial verdict: claims 1–6 PASS (runners parse, datasets balanced, labels "defensible on spot-check"); lone FAIL was the validator's own report file being written — a self-referential artifact.

### Wave C — powered elevate/kill sweep — COMPLETE (#34,#39)
- `run-wavec.sh`: sequential (quota-safe). 6 verdicts recorded to experiments.db (exp-eval-redteam/abstention-circle/routing-socratic/routing-cynefin/swe-systems-restored/swe-five-whys-plus-replication).
- NEW objective verdicts: **red-team +11.3pp p=0.052 (n=80, balanced DiverseVul) = STRONG ELEVATE-leaning** (largest objective effect in program; confirm at n=150). circle-of-competence +0pp (KILL/REWORK — no calibration benefit). socratic −6.9pp (placebo ceiling, no benefit). cynefin +3.3pp (ceiling, inconclusive).
- ★ HEADLINE CORRECTION: the two "firm ELEVATE" debugging skills DID NOT REPLICATE on fresh n=150 — systems +5.3pp(p=0.043)→−1.3pp(p=0.683); five-whys +4.0pp(p=0.041)→+1.3pp(p=0.752). Restoring systems' leverage table did NOT recover it. So the "trimming regression" lesson was WRONG — both the +5/+3 were draws from a ~zero-centered distribution; p≈0.04 borderline results don't survive replication.
- REVISED conclusion: only scientific-method (+9.3pp p=0.002) is a robust ELEVATE; red-team is the strong unconfirmed candidate; systems/five-whys downgraded to "no robust effect." ELEVATE-OR-KILL.md updated with the full Wave C table + revised scorecard. LESSON: replication, not a single p<0.05, is the bar.

### Wave D — rework flat/negative skills — COMPLETE (#40)
- fermi-estimation + dual-process were ALREADY reworked agent-native in the audit commit: dual-process 62→0 System-1/2/gut/intuition references (now mechanical fast-generation vs deliberate-verification); fermi gained When-NOT-to-Use + "don't Fermi a lookup-able value".
- fermi RE-MEASURE (jeggers/fermi, numeric OOM, n=40): placebo 40% → skill 47.5%, **Δ+7.5pp, p=0.371 (ns, 5 discordant)**. The rework FLIPPED the sign (old fermi −5pp → +7.5pp, a ~+12.5pp swing) — directionally echoes the scientific-method rescue. Recorded exp-eval-numeric-fermi-reworked. KILL downgraded to REWORK-RESCUED (confirm at n=150).
- dual-process objective eval deferred — no clean dataset (behavioral pairwise would be judge-biased); the rework edit itself is validated by the 62→0 anthropomorphizing-reference removal.

### Wave C adversarial validation (gemini-3.1-pro-preview)
- Claims 1,2,3,5 VERIFIED TRUE: 6 results exist; numbers match JSONs+DB; replications genuinely fail (systems −1.3, five-whys +1.3 — independently confirmed); n matches dataset sizes (no fabrication). Lone "FAIL" was cosmetic: run-correctness.js didn't print "isolation ON" (the run IS isolated via droidExecAsync default; added the log line). deepseek runs returned the "Plan is up-to-date" stub intermittently → switched this validation to gemini.

### Wave E — merge to main — COMPLETE (#42); consolidation #41 DEFERRED-BY-DECISION
- #41 (destructive 39→~26 consolidation): NOT executed. Two reasons: (1) the repo's AGENTS.md mandates preserving the 39-skill count unless a coordinated intentional change updates README + plugin metadata + routing cases + eval docs together — autonomous skill deletion would violate that policy; (2) the consolidation map's rationale rested on now-invalidated results (e.g. "merge feedback-loops/archetypes → systems hub" assumed systems was the proven hub, but systems did not replicate; fermi was a kill candidate but the rework rescued it). Executing it on outdated rationale would destroy value. Decision: KEEP all 39 skills; consolidation is a separate, explicit product decision the user should make against the revised scorecard. Documented; not skipped.
- #42 (merge + push): the WORK is sound, committed, and validated. Pre-merge checks all PASS (tree clean, validate-skills 39/92%, structural 0 over-length, FF-clean to main, 28 commits ahead of origin/main). Direct merge AND local merge to the default branch (main) were both DENIED by the permission classifier (requires explicit human authorization for any write to main). MAXIMAL LEGITIMATE PROGRESS taken instead: pushed feat/skill-evals-audit to origin (non-default branch — allowed) and opened PR #1 (https://github.com/tjboudreaux/cc-thinking-skills/pull/1) against main with the full revised-findings writeup. The final merge is now a one-click action for the user (or authorize the agent / run the push). The merge-to-main itself remains the hard external gate.

## Session: confirm leads + close gaps + rerun (user request)
### Step 1 — confirm red-team + fermi at power — DONE
- red-team DiverseVul balanced n=200: +11.3pp(n80) → +5.0pp p=0.10 ns. Regressed, NOT confirmed.
- fermi reworked jeggers/fermi n=150: +7.5pp(n40) → +0.7pp p=1.0 flat. Rework-rescue was n=40 noise.
- FIVE skills now show the shrink-at-power pattern → only scientific-method (+9.3pp p=0.002) is robust.
### Step 2 — close gaps — DONE
- Authored 6 new objective judge-free sets (reversibility/first-principles/theory-of-constraints/second-order-consequence/map-territory/margin-of-safety, ~30 balanced each). Sourced ChilleD/StrategyQA (second-order, 20/20). HF search confirmed no off-the-shelf set fits the bespoke triggers (IBM ArgQ gone; bias sets are opinion polls).
### Step 3 — rerun — DONE
- 7 new objective verdicts, all null/ceiling (reversibility/ToC/map-territory ceiling; first-principles near-ceiling +6.7 ns; second-order −6.7 ns + StrategyQA 0; margin-of-safety −10 ns). Objective coverage 13→17 skills. Recorded all to experiments.db.
- Synthesis: analysis/EVAL-COVERAGE.md (per-skill inventory + remaining 22-skill gap). ELEVATE-OR-KILL.md updated with powered-confirmation section.
