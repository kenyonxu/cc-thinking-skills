# Rework Spec: map-territory

**Date:** 2026-06-06
**Status:** pre-registered (pre-decisive-eval)
**Skill:** `thinking-map-territory`
**Eval Family:** Debugging/fault-localization
**Value Surface:** localization (docs/tests/mental-model vs runtime/code reality verification)

## Hypothesis

Narrowing map-territory to the specific agent-relevant domain of **docs/tests/mental-model vs runtime/code reality** — with an agent-executable verification checklist — will make it more actionable for autonomous debugging. The highest-leverage use is when behavior contradicts a description: stop reasoning from the map, go verify the territory directly. Adding a concrete verification checklist (read the actual function body, run it, query the real data, reproduce the behavior) and a "note what maps can't show" step will produce actionable output rather than philosophical observation.

## Value Surface

The skill delivers value when:
1. Behavior contradicts the docs, tests, diagram, comment, or agent's mental model
2. The agent is about to theorize instead of verifying against the running code/data
3. A claim about the system comes from a description rather than direct inspection

It does NOT deliver value when the map IS the artifact being edited, when already verified this session, or when the mismatch doesn't affect the decision.

## Expected Mechanism

1. **Name the map**: Explicitly identify which representation (doc/test/comment/assumption) the surprise is measured against
2. **Go to the territory**: Agent-executable steps: read the function body, run it with instrumentation, query real data, reproduce
3. **Let territory overrule**: Code does X and doc says Y → code wins; update the model
4. **Note what maps can't show**: After verification, name aspects no available map covers (likely next bug site)
5. **Stop condition**: Don't re-verify something already confirmed this session

## Template Sections Applied

Overview (docs/tests/mental-model vs runtime reality), When to Use (behavior contradicts description, about to theorize without verifying), When NOT to Use (editing the map itself, already verified, mismatch irrelevant), Procedure (Name the map → Go to territory → Let territory overrule → Note uncovered aspects), Output Contract (verified behavior with map-territory delta documented), Anti-Patterns (re-verifying known territory, trusting map over code, over-applying to artifacts being edited)

## Comparison Design

Planned comparison: prior version of same skill (pre-edit vs post-edit), measuring whether the narrowed verification-checklist framing improves debugging efficiency on map-territory-mismatch SWE-bench items vs the broader philosophical version.
