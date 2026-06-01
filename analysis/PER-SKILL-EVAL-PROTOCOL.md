# Per-Skill Experiment & Eval Protocol (elevate-or-kill)

For **every one of the 39 skills**: the domains where it drives better outcomes, the eval **mode**, the **comparison + elevate-or-kill rule**, and the **dataset** (verified HuggingFace id or "author synthetic"). Built on the isolated, length-controlled harness (`evals/`, `experiments/`).

## Universal decision rule
Run **skill** vs **length-matched placebo** (and vs a **2-sentence trigger**) under isolation (`EVAL_NO_ISOLATE` unset). Pool to ≥~40 decisive comparisons.
- **ELEVATE** — pooled **lower 95% CI > 50%** (significant positive lift over placebo). For routing skills: accuracy clearly beats the no-router baseline.
- **KILL / REWORK** — CI includes or sits below 50% at N≥40.
- **TRIGGER-ONLY** — the 2-sentence trigger matches the full guide (ship the trigger, drop the textbook).
- Per-skill verdicts need ≥~20–40 problems; below that = directional.

## Eval-mode split (determines execution)
- **Correctness** (objective ground truth — cheapest, least gameable): bayesian, probabilistic, fermi-estimation, dual-process, occams-razor, debiasing, kepner-tregoe(PA), theory-of-constraints, scientific-method, five-whys-plus, systems, red-team, first-principles(Fermi half).
- **Routing** (does the right call/skill fire): bounded-rationality, socratic, map-territory, circle-of-competence, margin-of-safety, ooda, cynefin, model-router, model-selection, model-combination.
- **Pairwise** (open decision, blind judge): second-order, inversion, pre-mortem, regret-minimization, opportunity-cost, reversibility, steel-manning, feedback-loops, archetypes, leverage-points, triz, thought-experiment, lindy-effect, via-negativa, jobs-to-be-done, effectuation, first-principles(design half), kepner-tregoe(DA half).

---

## Correctness-mode skills (objective ground truth)

| Skill | Drives better outcomes in | Dataset (HF id) | Elevate-or-kill |
|---|---|---|---|
| **bayesian** | base-rate/test interpretation, sequential belief update, multi-hypothesis triage | `openai/gsm8k` (proxy), `YuehHanChen/forecasting`; **author base-rate word problems** (gold) | ELEVATE if posterior-accuracy CI>50% vs placebo, N≥60 |
| **probabilistic** | forecasting, timeline estimation w/ CIs, EV go/no-go | `YuehHanChen/forecasting`, `MoyYuan/FOReCAst`, `nikhilchandak/OpenForesight` (resolved 0/1 → Brier) | ELEVATE if beats-placebo Brier rate CI>50%, N≥60 |
| **fermi-estimation** | order-of-magnitude sizing, feasibility, sanity checks | **`jeggers/fermi`** (10,867; numeric answer + decomposition program; CC-BY-4.0), `atomic-canyon/FermiBench` | ELEVATE if within-1-OOM rate CI>50%, N≥60 |
| **dual-process** | CRT/bias-trap override, high-stakes pause | `HiTZ/bbq`, `jecht/cognitive_bias`, `openai/gsm8k`; +author CRT/Linda traps | ELEVATE if override-to-correct CI>50%, N≥50; TRIGGER-ONLY likely |
| **occams-razor** | debugging hypothesis pick, differential dx (incl. **trap cases** where complex is right) | **`aai530-group6/ddxplus`**, `w3joe/opensre` (OpenRCA) | ELEVATE if accuracy CI>50% AND not worse on trap slice |
| **debiasing** | high-stakes recommendation approval; anchoring/framing/overconfidence | **`tum-nlp/cognitive-biases-in-llms`** (30k paired control/treatment + bias metric; CC-BY-SA) | ELEVATE if bias-reduction win-rate CI>50%, N≥40/family |
| **kepner-tregoe** (PA) | RCA when 5-Whys ambiguous; multi-criteria choice (DA→pairwise) | `w3joe/opensre`, `aai530-group6/ddxplus` | ELEVATE if root-cause accuracy CI>50% |
| **theory-of-constraints** | find the single bottleneck before optimizing | **`qiliuchn/operations-research`**, job-shop instances; +author pipeline tables | ELEVATE if constraint-ID accuracy CI>50%, N≥60; TRIGGER-ONLY plausible |
| **scientific-method** | hypothesis-driven debugging, A/B design | **`princeton-nlp/SWE-bench_Verified`/`_Lite`** (gold patch), `microsoft/AgentRx` | ELEVATE if resolve/RCA accuracy CI>50%, N≥60 |
| **five-whys-plus** | post-mortems, recurring-bug chains (systemic not proximate) | `atishayj281/incident-dataset`, `princeton-nlp/SWE-bench_Verified`, `microsoft/AgentRx` | ELEVATE if root-cause-match CI>50%, N≥60 |
| **systems** | cross-service/distributed failures, emergent outages | `princeton-nlp/SWE-bench_*` (filter multi-file), `atishayj281/incident-dataset` | ELEVATE if resolve-rate CI>50%, N≥60 |
| **red-team** | security/auth vuln enumeration, plan stress-test | **`claudios/DiverseVul`** (524k, vuln+CWE), **`CIRCL/vulnerability-cwe-patch`** (39k), `walledai/AdvBench` | ELEVATE if vuln-detection accuracy beats baseline, N≥200 |

## Routing-mode skills (right call/skill fires)

| Skill | Drives better outcomes in | Dataset | Elevate-or-kill |
|---|---|---|---|
| **bounded-rationality** | satisfice-vs-optimize classification, stopping criteria | author synthetic (label reversibility/stakes/time); `denizspynk/requirements_ambiguity_v2` adjacent | ELEVATE if routing acc CI>50%, N≥50 |
| **socratic** | ask-clarifying-vs-answer on ambiguous requests | **`convai-challenge/conv_ai_3`** (ClariQ), `denizspynk/requirements_ambiguity_v2` | ELEVATE if ask/answer routing acc CI>50% |
| **map-territory** | recognize representation≠reality; abstain when context under-determines | `HiTZ/bbq`, `convai-challenge/conv_ai_3`; +author metric-vs-outcome cases | ELEVATE if correct-recognition CI>50% |
| **circle-of-competence** | answer-vs-abstain on unanswerable/out-of-scope | **`OkayestProgrammer/selfAware`** (1032 unanswerable + 2337 answerable), `cais/mmlu` | ELEVATE if answer/abstain F1 CI>50% |
| **margin-of-safety** | margin-tier selection by cost-of-failure | author synthetic (tier keys); `YuehHanChen/forecasting` coverage proxy | ELEVATE if margin-tier acc CI>50% |
| **ooda** | fast-iterate-vs-deliberate under urgency | `atishayj281/incident-dataset`, `microsoft/AgentRx`; +author urgency-tagged | ELEVATE if tempo-routing acc CI>50%; TRIGGER-ONLY likely |
| **cynefin** | classify domain → match method | author synthetic (domain+approach labels); `atishayj281/incident-dataset` | ELEVATE if domain-routing acc CI>50%, N≥60; TRIGGER-ONLY high-risk |
| **model-router** | cold-start framework choice (domain×problem→skill) | **OUR catalog + authored labeled prompts** (no HF) | ELEVATE if top-k acc ≫ no-router baseline |
| **model-selection** | classify problem → single best model (+fallback) | **OUR catalog + authored** | ELEVATE only if beats router-alone on fine cases, else MERGE |
| **model-combination** | choose combination pattern + member set; avoid soup/forced-marriage | **OUR catalog + authored** | ELEVATE if combo-match beats single & stack baselines |

## Pairwise-mode skills (open decision, blind judge)

| Skill | Drives better outcomes in | Dataset | Elevate-or-kill |
|---|---|---|---|
| **second-order** | policy/incentive changes w/ feedback; "and then what" chains | `voidful/StrategyQA` (partial correctness) + author policy decisions | ELEVATE if win-rate CI>50%, N≥40 |
| **inversion** | safety/harm anticipation, FMEA failure enumeration | `ai-safety-institute/AgentHarm`, `allenai/xstest-response` + author plan/req | ELEVATE if win-rate/harm-reduction CI>50% |
| **pre-mortem** | pre-launch risk under overconfidence (prospective hindsight ~+30%) | `w3joe/opensre` (proxy) + author project plans | ELEVATE if risk-recall/win CI>50%; TRIGGER-ONLY plausible |
| **regret-minimization** | career/life pivots (inaction-regret asymmetry) | `ninoscherrer/moralchoice`, `hendrycks/ethics` (proxy) + author | ELEVATE if win-rate CI>50%; TRIGGER-ONLY plausible |
| **opportunity-cost** | resource allocation, build-vs-buy (neglect bias d≈0.22) | author allocation vignettes (encode foregone alt) | ELEVATE if win-rate CI>50%; TRIGGER-ONLY likely |
| **reversibility** | one-way/two-way door process calibration | author decision vignettes (Type-1/2 key) | ELEVATE if classification acc/win CI>50%; TRIGGER-ONLY likely |
| **steel-manning** | design debates, conflict resolution, self-critique | **`ibm/argument_quality_ranking_30k`**, `Anthropic/persuasion` (judge anchor) | ELEVATE if steelman-strength win CI>50% |
| **feedback-loops** | runaway/oscillating systems, growth-loop design | `ibm-research/BPC`, `qiliuchn/operations-research` + author dominant-loop vignettes | ELEVATE if win-rate CI>50%, N≥50 |
| **archetypes** | recurring org/eng dysfunction → known leverage | author archetype-labeled vignettes; `atishayj281/incident-dataset` | ELEVATE if classification-lift/win CI>50%; **TRIGGER-ONLY high-risk** (trigger ≈ content) |
| **leverage-points** | strategic prioritization past parameter-tuning | author leverage-level-tagged vignettes; `qiliuchn/operations-research` | ELEVATE if win CI>50% (full 12-level table may add lift → likely NOT trigger-only) |
| **triz** | engineering contradictions (resolve vs compromise) | author contradiction prompts (conflicting params + ref solution) | ELEVATE if resolve-vs-compromise win CI>50% |
| **thought-experiment** | pre-build architecture failure-mode traces; counterfactuals | CRASS / CounterBench (counterfactual correctness) + author architecture traces | ELEVATE if win/counterfactual-acc CI>50% |
| **lindy-effect** | long-horizon tech/dependency selection | author tech-choice prompts; libraries.io survival data (correctness backstop) | ELEVATE if win CI>50% AND avoids "old=best for new" failure |
| **via-negativa** | simplification, tech-debt removal (subtraction-neglect, Nature 2021) | author "improve-this" prompts where subtraction dominates | ELEVATE if found-subtractive-win rate CI>50% & beats baseline addition |
| **jobs-to-be-done** | feature prioritization, low-adoption debugging, true competitor | `McAuley-Lab/Amazon-Reviews-2023` (mine jobs) + author product cases | ELEVATE if win CI>50% (not just renaming features) |
| **effectuation** | early-venture under Knightian uncertainty (+ refrain in predictable mkts) | author venture/decision scenarios (uncertainty-tagged) | ELEVATE if win CI>50% AND withholds in predictable contexts |
| **first-principles** | Fermi cost-decomposition (correctness) + pricing/greenfield (pairwise) | `voidful/fermi`, `cais/mmlu` (econ/phys) + author design teardowns | ELEVATE if win/within-OOM CI>50% |

## Notes
- **Strongest published effect sizes** (anchor expectations): pre-mortem (~+30% reasons surfaced), debiasing/opportunity-cost-neglect (replicable lab effects), inversion (InvThink harm-reduction).
- **TRIGGER-ONLY is a genuinely likely outcome** for skills whose active ingredient is a single reframe: pre-mortem, opportunity-cost, reversibility, regret-minimization, ooda, dual-process, theory-of-constraints, cynefin, archetypes.
- **Over-application guard:** occams-razor MUST include trap cases (complex-cause-correct) or it scores well by mis-firing.
- **Meta-routers (model-*) need no HF data** — they're evaluated on our own catalog + labeled prompts; `model-selection` must beat `model-router`-alone or be merged.
- Licenses vary — ClariQ "unknown", ddxplus has an author takedown request, several gated. Verify before redistribution; keep in `evals/datasets/external/` (segregated, non-MIT).
