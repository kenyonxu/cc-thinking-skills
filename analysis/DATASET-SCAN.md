# HuggingFace Dataset Scan — feeding the bigger problem set

**Goal (from `LIFT-HYPOTHESES.md`):** expand the behavioral eval to ~400 problems including ~30% off-target distractors, to (a) cross the ~194-comparison power threshold for a 10pp test, (b) get ~8–20 problems/skill for concentrated per-skill moves, and (c) make Class-B interventions (boundaries/router/abstention) measurable. Scanned 5 datasets (schema + samples + size + license pulled live via the HF datasets-server API).

## TL;DR verdict

| Dataset | Rows | License | What it is | Best use here | Grade |
|---|---|---|---|---|---|
| **Jackrong/financial-economics-reasoning** | 122k | Apache-2.0 *(research/non-commercial; distilled from Qwen-3-235B)* | Open analytical finance/econ Q&A with CoT | **Pairwise-mode** open problems → opportunity-cost, second-order, margin-of-safety, probabilistic, systems | ⭐⭐⭐ (after filtering) |
| **medreason/llm-medical-reasoning-steps-benchmark** | 1,170 | **CC BY-NC 4.0** | Clinical MCQ + `answer_idx` + `answer_steps` + `answer_key_points` | **Correctness-mode** (objective accuracy) + reasoning-chain grading → bayesian, scientific-method, five-whys, debiasing, dual-process, kepner-tregoe | ⭐⭐⭐ (highest-signal, small) |
| **nguha/legalbench** | 92k | CC-BY-4.0 *(per-task licenses vary)* | 162 legal-reasoning tasks, mostly classification w/ ground truth | **Correctness-mode** on rule-application/issue-spotting → steel-manning, socratic, kepner-tregoe; **distractors** for routing | ⭐⭐ |
| **Jackrong/GLM-5.1-Reasoning-1M-Cleaned** | 357k (main; ~746k total) | Apache-2.0 *(GLM-5.1 distilled)* | Huge mixed reasoning/coding/math/science traces | **Distractor pool** (routine code/fact/math = "no skill should fire") + volume | ⭐⭐⭐ (for distractors) |
| **trjxter/DeepSeek-V4-Pro-Reasoning-8000x** | 8k | Apache-2.0 | DeepSeek-V4-Pro re-gen of **GLM-1M seeds** (derivative) | Same as GLM-1M but redundant → dedupe against it | ⭐ (subsumed) |

## The key reframe: these unlock a second eval mode

Our current Tier 3 judges *"which response reasons better"* — a **preference** signal vulnerable to the LLM-judge format-bias mirage the lift-committee flagged (neat templates score as "better reasoning"). Four of these datasets have a **single ground-truth answer**, which lets us add a **correctness-mode eval**: does injecting a skill change the *accuracy* of the answer vs a length-matched placebo? Accuracy is objective — it can't be gamed by formatting. The medical set goes further: `answer_steps` + `answer_key_points` allow **rubric-graded reasoning-chain scoring** (did the reasoning hit the key diagnostic points?), not just final-answer correctness. **This is the single most valuable thing the scan surfaces** — it directly neutralizes the prior round's biggest validity threat.

So the expanded set should be built in **three tracks**:

1. **Pairwise / open-decision (existing mode)** — backbone stays our hand-authored software/product problems; **augment** with filtered `financial-economics-reasoning` for finance/econ decision problems (tests generalization of opportunity-cost, second-order, margin-of-safety, probabilistic, systems beyond software).
2. **Correctness-mode (NEW)** — `medical-reasoning` MCQs for diagnostic/probabilistic skills (bayesian, scientific-method, five-whys-plus, debiasing, dual-process, kepner-tregoe); selected `legalbench` rule-application tasks for steel-manning / socratic / kepner-tregoe. Objective, judge-bias-free.
3. **Distractors (~30%, NEW)** — routine items from `GLM-1M` (write-a-function, fact lookups, arithmetic) where **no thinking skill should fire**. These are what make the Class-B interventions (boundaries, router NONE-path, active-pull tool) measurable; without them those interventions score ~0 in a matched-only eval.

## Per-dataset detail

**financial-economics-reasoning (122k, Apache-2.0).** `{problem, CoT_reasoning, answer}`. Problems are genuinely open ("main concerns of X… how should they be balanced", "how does monetary policy affect markets"). Caveat: a large share are **recall/explain** ("summarize the 2000-based standards") — those don't discriminate reasoning quality. **Filter** to trade-off/decision/judgment items before use (an LLM-classify pass). We only need the `problem` stem; discard CoT/answer. Bilingual — restrict to `language=en`.

**medical-reasoning (1,170, CC BY-NC).** 592 MCQ + 578 open, 24 specialties, sourced from JAMA/Medbullets/MMedBench/nephSAP/LiveQA/PubMedQA. The MCQ + `answer_idx` is a clean accuracy target; `answer_steps`/`answer_key_points` enable chain grading. Off our software/product domain, but diagnostic reasoning is domain-general (Bayesian updating on test results, differential = hypothesis enumeration) and the **objectivity is worth the domain shift**. Small (good for a focused, fully-powered correctness sub-eval on ~6 skills).

**legalbench (92k, CC-BY-4.0, per-task licenses vary).** 162 tasks; mostly binary/multi-class classification with ground truth (e.g. `consumer_contracts_qa` yes/no; `abercrombie` trademark class). Most tasks are *not* open decisions, so low value for pairwise mode. Two real uses: (a) rule-application/issue-spotting tasks as **correctness-mode** items for steel-manning/socratic/kepner-tregoe; (b) legal QA as **off-target distractors** for routing. Pick specific configs; don't ingest wholesale.

**GLM-1M (357k+, Apache-2.0, GLM-5.1-distilled).** Configs: main / Math / Multilingual-STEM / PHD-Science. Samples include routine coding ("write a python function…") and fact MCQs — **ideal distractors**. Math config gives verifiable-answer items (minor correctness-mode use). Model-generated: we reuse only the **prompt stems** (discard the `<think>` outputs), so distillation quality doesn't matter.

**DeepSeek-V4-Pro-8000x (8k, Apache-2.0).** `meta` shows `source_dataset = Jackrong/GLM-5.1-Reasoning-1M-Cleaned` — it's a re-generation of GLM-1M seeds. **Redundant**; dedupe against GLM-1M. Also note: deepseek-v4-pro is one of our judge/solver models, so don't use its outputs as ground truth (we don't anyway).

## Licensing caveats (important — the repo is MIT)

- **medical = CC BY-NC**, **financial = non-commercial**. Fine for **internal research/eval**; do **NOT** redistribute the problems verbatim inside the MIT-licensed plugin. Keep derived eval sets in a **segregated, attributed** location (e.g. `evals/datasets/external/` with a NOTICE), or **transform** items into new prompts rather than copying.
- **legalbench** per-task licenses vary — check the specific configs used.
- **GLM-1M / deepseek** Apache-2.0 but model-distilled; reusing prompt stems is low-risk, but they may themselves contain content from upstream sources.
- Net: use these to **build a private/segregated eval corpus**, not to ship problems in the public package.

## Recommended build plan

1. **Stream, don't download.** Use the datasets-server `/rows?...&offset=&length=` API (paged) — no need to pull the 18 GB GLM files. Ingestion script stub: `evals/datasets/ingest-hf.js` (pulls, maps to our schema, optional `--classify`).
2. **Classify-and-filter** each candidate with a cheap LLM pass: `{eval_worthy, mode: pairwise|correctness|distractor, skill_fit: [...], domain, single_answer}`. Drop recall-only and trivial-but-not-distractor items.
3. **Assemble ~400 problems:** ~150 hand-authored+financial (pairwise) · ~120 medical+legal (correctness) · ~130 GLM (distractors). Target ~10–12 problems per targeted skill.
4. **Dedupe** deepseek-8k ⊂ GLM-1M; restrict financial to `en`.
5. **Wire into the harness:** pairwise → existing `run-behavioral.js`; add a `run-correctness.js` (solve with vs without skill, score against `answer_idx` / `answer_key_points`); distractors → a Class-B routing/boundary eval (`run-routing.js` negatives + a "did the agent abstain?" check).

## Why this closes the loop with the power analysis

- **Volume:** trivially clears the ~194-comparison bar for a 10pp aggregate test, and gives ~10–12 problems/skill (enough to detect ≥30pp per-skill moves).
- **Validity:** correctness-mode (medical/legal/Math) gives an **objective** signal that kills the judge-bias mirage; distractors make the **boundary/router** interventions (which were unmeasurable in the matched-only set) finally testable.
- **Generalization:** finance + medical + legal extend the eval beyond software, testing whether the skills' lift is real or software-prompt-specific.

**Bottom line:** yes — these help, but not as drop-in problems. `financial-economics` (filtered) feeds pairwise mode; `medical-reasoning` (+ select `legalbench`) unlocks a higher-integrity **correctness-mode** eval; `GLM-1M` is an excellent **distractor** pool; `deepseek-8k` is redundant. Mind the **non-commercial licenses** — derive into a segregated corpus, don't ship verbatim in the MIT repo.
