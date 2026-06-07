# Rework Spec: kepner-tregoe

**Date:** 2026-06-06
**Status:** pre-registered (pre-decisive-eval)
**Skill:** `thinking-kepner-tregoe`
**Eval Family:** Debugging/fault-localization
**Value Surface:** localization (IS/IS-NOT boundary contrast for selective defects)

## Hypothesis

De-emphasizing the Decision Analysis (DA) and Potential Problem Analysis (PPA) sprawl — redirecting those to `thinking-opportunity-cost` and `thinking-pre-mortem` respectively — and focusing kepner-tregoe tightly on **Problem Analysis (PA) with the IS/IS-NOT matrix** for debugging selective defects will concentrate its mechanism on what it does uniquely well: boundary-contrast root-causing of bugs that affect some endpoints/regions/users/times but not all. The Situation Analysis (SA) scaffolding is retained as a lightweight triage entry but trimmed to avoid competing with the PA core.

## Value Surface

The skill delivers value when:
1. A defect is selective (affects some cases but not others — there IS an IS-vs-IS-NOT boundary to contrast)
2. The cause is unclear and not obvious from a stack trace or recent change
3. The IS/IS-NOT matrix can produce a distinction that points at the root cause

It does NOT deliver value for uniform failures (100% affected — no boundary), obvious causes, or pure decision/risk tasks.

## Expected Mechanism

1. **PA-first entry**: Decision flow routes directly to Problem Analysis for debugging; SA only when multiple concerns need triage
2. **IS/IS-NOT as primary tool**: The matrix is the core — What/Where/When/Extent dimensions with explicit distinctions
3. **DA/PPA redirected**: Decision analysis → `thinking-opportunity-cost`; risk anticipation → `thinking-pre-mortem`
4. **Lightweight SA retained**: Only for multi-concern triage, not as a required preamble
5. **Anti-fabrication**: Each possible cause must explain BOTH the IS and IS-NOT before being pursued

## Template Sections Applied

Overview (PA-focused, IS/IS-NOT as core), When to Use (selective defects with clear boundary), When NOT to Use (uniform failures, obvious causes, pure decisions), Procedure (SA→PA flow, IS/IS-NOT matrix, cause testing), Output Contract (confirmed root cause with evidence from boundary contrast), Anti-Patterns (running full KT on uniform failure, using DA/PPA when simpler tools suffice, over-specifying the matrix)

## Comparison Design

Planned comparison: prior version of same skill (pre-edit vs post-edit), measuring whether the PA-focused IS/IS-NOT framing improves root-cause accuracy on selective-defect SWE-bench items vs the broader four-process version.
