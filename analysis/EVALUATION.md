# Deep Evaluation — cc-thinking-skills

A holistic assessment of the 39-skill thinking-skills collection: what it is, where it's strong, and the structural gaps that motivated building a behavioral eval harness. Empirical per-skill numbers live in `evals/results/<run>/scorecard.md`; cross-model critique lives in `analysis/ADVERSARIAL-SYNTHESIS.md`. This doc is the qualitative spine that ties them together.

## What the collection is

39 single-file `SKILL.md` mental models packaged as a Claude Code plugin marketplace: 36 leaf models (first-principles, inversion, Cynefin, OODA, Bayesian, …) + 3 meta-skills (`thinking-model-router`, `-model-selection`, `-model-combination`). Each follows a strong, consistent template (Overview → Core Principle → When to Use → Process → Examples → Verification Checklist → Key Questions → attribution). The content is, on the whole, **well-written and faithful** to source material — the Tier 1 judge gave fidelity scores of 4–5 on the skills sampled. This is a mature, thoughtfully curated collection, not a dump.

## Central finding: "quality" today measures headers, not reasoning

The only quality signal in the repo is `scripts/validate-skills.js`, an 18-point **structural** checker (does the file contain `## Overview`, `**Core Principle:**`, ≥3 tables, ≥3 `- [ ]` items, an ASCII arrow diagram, etc.). It reports **90% overall** — but that number measures *header conformance*, not whether a skill makes an agent reason better.

**Evidence (Tier 0, `evals/run-structural.js`):** a substance-aware re-scoring of the same files shows the strict checker systematically *undercounts content-rich skills*:

| Skill | Strict | Substance-aware | Why strict undercounts |
|---|---|---|---|
| `thinking-debiasing` | 72% | 83% | Marked "missing Anti-patterns" — though the skill *is* a 12-point bias checklist. No numbered "Step N" header and no arrow diagram. |
| `thinking-second-order` | 78% | 92% | Penalized for header/format, not content (Tier 1 rated it 4.6/5). |
| `thinking-socratic` | 78% | 92% | Same — strong content, non-conforming layout. |

The strict score's failures are **format false-negatives**, and — more dangerously — it is silent on the things that actually matter: is the model represented faithfully? would it change a decision? does it tell the agent when *not* to use it? A skill can score 100% structurally and still be reasoning-neutral or actively misleading. That gap is the entire reason for Tiers 1–3.

## The substance signal the lint can't see (Tier 1 rubric)

LLM-graded rubric scoring (fidelity / applicability / actionability / discrimination / discoverability) surfaces issues invisible to regex. From the pilot:
- `thinking-debiasing`: fidelity **5**, but actionability **2** — "entirely abstract, no software examples, poor boundaries against overuse."
- `thinking-first-principles`: flagged **potentially misleading** — "encouraging an AI agent to 'challenge industry assumptions' without strict boundaries can cause it to waste compute reinventing standard, secure solutions (rolling custom auth/routers)."

This points at the **single most important systemic weakness** below.

## Systemic weakness: missing "when NOT to use" boundaries → over-application risk

Across the collection, the weakest rubric dimension is **discrimination** — boundaries, failure modes, and "when not to use." Only ~12/39 skills document anti-patterns at all. For a *human* reader this is a minor gap. For an **autonomous agent** that auto-loads a skill, it is a real hazard: a skill with no boundaries invites over-application — running a 12-point debiasing audit on a trivial reversible choice, "challenging assumptions" into reinventing auth, applying systems-thinking ceremony to a one-line fix. The skills optimize for "here's how to apply me" and under-invest in "here's when applying me is wrong." This is the highest-leverage improvement theme and a likely cross-model consensus.

## Coverage & redundancy

Mapped across domain (coding/architecture/product/strategy/personal/risk/innovation) × problem-type (diagnose/decide/understand/create/evaluate/predict/optimize), coverage is broad and the *diagnose* and *decide* cells are well-served. Redundancy concentrates in **five overlap clusters** (see `USE-CASES.md` for triggers):

1. **Root-cause:** `five-whys-plus` / `scientific-method` / `kepner-tregoe` — descriptions reference each other; any "find the root cause" prompt fits all three. **Highest risk.**
2. **Systems-dynamics:** `systems` / `feedback-loops` / `archetypes`.
3. **Attack-the-plan:** `inversion` / `pre-mortem` / `red-team`.
4. **Belief-update:** `bayesian` / `probabilistic`.
5. **Meta:** `model-router` / `model-selection` / `model-combination` (entangled by design; `model-selection` also overlaps `cynefin`).

These are not necessarily *duplicates* — each has a defensible distinct stance — but their **descriptions don't encode the distinction**, so a router can't pick between them from a natural prompt. They are the consolidation-or-sharpen candidates.

## Discoverability (the description field drives auto-invocation)

Claude Code matches skills primarily on the `description:` frontmatter, so description quality *is* discoverability. Two concrete problems:

- **8 descriptions exceed the 200-char budget** (`feedback-loops` 276, `kepner-tregoe` 233, `bounded-rationality` 236, `triz` 223, `red-team` 214, `leverage-points` 213, `systems` 204, `fermi-estimation` 201). Overlong descriptions dilute the trigger signal.
- **Framework-named, not situation-named.** Descriptions tend to describe the *model* ("apply Donella Meadows' feedback loop framework") rather than the *situation that should trigger it* ("when a system runs away, stalls, or oscillates despite effort"). Situation-named descriptions are what make a skill fire at the right moment — see the trigger-phrase guidance in `USE-CASES.md`.

Tier 2 (routing accuracy, with negatives and the five overlap clusters as ambiguous cases) quantifies this; the full-run numbers are in the scorecard.

## Router quality

`thinking-model-router` is well-conceived — a domain × problem-type matrix plus a model inventory — and is the right architecture for 39 skills. Risks: (a) it is a manually-maintained matrix that must be updated whenever skills are added (it already lags the current 39); (b) it inventories models but is thin on *examples* and has no "when not to route / just answer directly" guidance; (c) it overlaps the other two meta-skills. It is a hub worth keeping, but it needs the same boundary/triggers discipline as the leaves.

## Why behavioral evals, and what the harness measures

Structural and rubric scores grade the *artifact*. They cannot answer the question the user actually cares about — **does the skill make Claude reason better?** Only an outcome test can. The harness (`evals/`) therefore layers four tiers:

- **Tier 0 — structural lint** (free): header/format conformance + the substance-aware re-score above. A fast pre-filter, not a quality verdict.
- **Tier 1 — reasoning-quality rubric** (LLM-graded): content fidelity/applicability/actionability/discrimination/discoverability, with a "would mislead an agent" flag.
- **Tier 2 — invocation/routing accuracy**: does the right skill fire from a natural prompt, and correctly *not* fire on routine requests (negatives)? Tests the description fields and the overlap clusters.
- **Tier 3 — behavioral A/B lift** (headline): Claude solves 108 realistic, jargon-free problems with vs without each skill; a cross-family judge does a blind pairwise comparison. A skill that can't beat baseline is flagged **"unproven — does it earn its place?"**

The behavioral problems are designed so naive reasoning falls into a named failure mode the skill is meant to prevent (e.g. the self-merge-PR policy that looks like a win but erodes review culture). This is the first evidence in the repo's history about whether the skills *work*, not just whether they're well-formatted.

## Empirical results (run1 — see `evals/results/run1/scorecard.md`)

- **Tier 0 structural:** strict 90% (reproduces the baseline) vs substance-aware 92%; biggest false-negatives `debiasing` (72→83), `second-order`/`socratic` (78→92).
- **Tier 1 rubric (gemini judge):** mean **4.22/5**. Dimension means: fidelity **4.95**, discoverability 4.41, applicability 4.33, actionability 4.00, **discrimination 3.38** (clearly the systemic weak point). **6 skills flagged "would mislead an agent."**
- **Tier 2 routing (claude-sonnet router):** **99% lenient / 90% strict-unique**; positives 39/39, **negatives 16/16** (no spurious firing), ambiguous 15/16. The lenient–strict gap is entirely the overlap clusters.
- **Tier 3 behavioral (length-controlled, skill vs same-length placebo):** mean win-rate **56%**, **22/36 proven**. Strong (100%): dual-process, first-principles, pre-mortem, theory-of-constraints, thought-experiment. **Regressing (≤0 lift): 12 skills** incl. debiasing/regret-minimization/triz at 0%, several "vocab-only" (framework theater). Per-skill at n=3 is directional; the aggregate + dimension patterns are the reliable read.
- **Adversarial (3 frontier models):** unanimous "sharpen" + 23/24 "would-mislead" on the weakest 8 skills; convergent thesis that verbose files may be net-negative for a frontier model. Full detail in `ADVERSARIAL-SYNTHESIS.md`.

## Bottom line

A genuinely strong, faithful collection sitting on a quality signal that can't see its real strengths *or* its real weaknesses. The three highest-leverage themes — independent of the empirical numbers — are: **(1)** add "when NOT to use" boundaries everywhere to curb agent over-application; **(2)** sharpen descriptions to be situation-named and within budget, and disambiguate the five overlap clusters; **(3)** adopt outcome-based evals (this harness) as the quality gate instead of header conformance. The empirical scorecard and the adversarial synthesis test and prioritize these.
