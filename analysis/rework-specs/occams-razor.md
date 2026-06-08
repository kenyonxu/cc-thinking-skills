# Rework Spec: occams-razor

**Date:** 2026-06-06
**Status:** pre-registered (pre-decisive-eval)
**Skill:** `thinking-occams-razor`
**Eval Family:** Debugging/fault-localization
**Value Surface:** localization (fewest-assumption hypothesis prioritization)

## Hypothesis

Adding a **trigger-shrink** gate — where the agent first checks whether the simplest hypothesis can be tested in one step, and only escalates to the full procedure (enumerate all hypotheses, count assumptions, verify explanatory power, test in order) when the trigger check doesn't resolve — will reduce over-application. The core mechanism (test fewest-assumption hypotheses first) remains unchanged; the rework adds a fast-path for common cases and reserves the full procedure for situations where it earns its cognitive budget.

## Value Surface

The skill delivers value when:
1. Multiple hypotheses could explain a bug and the simplest is not obviously testable in one step
2. The agent is about to investigate a complex hypothesis without first testing a simpler one
3. The full enumeration-and-scoring procedure provides lift over "just test the simplest first"

It does NOT deliver value when evidence already points to a specific cause, the domain is irreducibly complex, or only one plausible explanation exists.

## Expected Mechanism

1. **Trigger check (fast path)**: "Can I test the simplest hypothesis in one step?" → yes → just test it and report
2. **Full procedure (when trigger fails)**: Enumerate → count assumptions → verify explanatory power → test in order → escalate complexity only when evidence forces it
3. **Anti-oversimplification guard**: Einstein's corollary ("as simple as possible, but no simpler") with explicit checks for irreducible domain complexity
4. **Systemic vs local simplicity**: Prefer systemic simplicity over local simplicity

## Template Sections Applied

Overview (trigger-shrink + fewest-assumption priority), When to Use (multiple competing hypotheses, simplest not obviously testable), When NOT to Use (evidence points to specific cause, irreducible complexity, single hypothesis, trigger-check resolves instantly), Procedure (Trigger check → if unresolved, full enumeration → assumption counting → test in order), Output Contract (hypothesis ranking by assumption count with test results), Anti-Patterns (oversimplifying irreducible domains, complexity bias, testing complex before simple, trigger inflation)

## Comparison Design

Planned comparison: prior version of same skill (pre-edit vs post-edit), measuring whether the trigger-shrink gate reduces unnecessary full-procedure invocation without harming accuracy on multi-hypothesis SWE-bench debugging items.
