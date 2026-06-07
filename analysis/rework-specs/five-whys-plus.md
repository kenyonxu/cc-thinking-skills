# Rework Spec: five-whys-plus

**Date:** 2026-06-06
**Status:** pre-registered (pre-decisive-eval)
**Skill:** `thinking-five-whys-plus`
**Eval Family:** Debugging/fault-localization
**Value Surface:** localization (post-localization root-cause analysis)

## Hypothesis

Narrowing five-whys-plus to a **post-localization** role (used only AFTER scientific-method or equivalent hypothesis-differential debugging has localized the fault to a specific component) will improve its mechanism-fit by eliminating premature application on unlocalized problems. Adding an explicit evidence-chain requirement, a counterfactual cause test ("would the problem NOT have occurred if X were different?"), and a concrete stop condition will reduce the most common failure modes (premature stopping, speculation depth, single-cause bias).

## Value Surface

The skill delivers value when:
1. A fault has already been localized to a specific component or subsystem
2. The proximate cause is known but the systemic root cause is not
3. The user needs a structured, evidence-gated chain from symptom to actionable root cause

It does NOT deliver value when the fault is unlocalized (multiple candidate components) — that requires scientific-method first.

## Expected Mechanism

1. **Post-localization gate**: Explicit decision flow requires localization before the "why" chain starts
2. **Evidence chain**: Each "why" step carries a mandatory evidence field and confidence level
3. **Counterfactual cause test**: Before stopping, test "would the problem NOT have occurred if this cause were absent?"
4. **Explicit stop condition**: Stop only when the cause is actionable, controllable, evidenced, and passes the counterfactual test
5. **Bias guards retained**: Branching on "what else?", blame avoidance, devil's advocate review

## Template Sections Applied

Overview, When to Use (situation-named, post-localization gate), When NOT to Use (unlocalized problems, obvious causes), Procedure (gated chain with evidence + counterfactual), Output Contract (structured root-cause report with evidence chain), Anti-Patterns (premature stop, speculation dive, blame stop, circular why)

## Comparison Design

Planned comparison: prior version of same skill (pre-edit vs post-edit), measuring whether the narrowed post-localization framing + counterfactual test improves root-cause accuracy on localized SWE-bench items.
