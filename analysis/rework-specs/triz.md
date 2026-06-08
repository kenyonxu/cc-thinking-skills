# Rework Spec: triz

**Date:** 2026-06-06
**Status:** pre-registered (pre-decisive-eval)
**Skill:** `thinking-triz`
**Eval Family:** Systems/product/strategy pairwise
**Value Surface:** paired reasoning quality (architecture/API contradiction resolution)

## Hypothesis

Narrowing TRIZ to **architecture/API design contradictions** — where two requirements seem mutually exclusive (fast vs accurate, stable vs evolving, large cache vs fast invalidation) — and making the separation moves (time, space, condition, scale) the explicit primary procedure will concentrate the skill on what it does uniquely well: systematic contradiction resolution. De-emphasizing the full 40 inventive principles and evolution patterns as secondary reference material reduces the sprawl that makes the skill hard to apply in agent context.

## Value Surface

The skill delivers value when:
1. An architecture or API design decision is stuck between two requirements that seem mutually exclusive
2. The agent is about to accept a trade-off because "you can't have both"
3. The contradiction can be named precisely and attacked with separation principles

It does NOT deliver value for ordinary trade-offs with a correct answer, contradictions that dissolve under measurement, or non-technical/people problems.

## Expected Mechanism

1. **Name the contradiction**: Explicit template: "We need [A] to be [state 1] for [benefit 1] BUT also [state 2] for [benefit 2]"
2. **Separation moves (primary)**: Try separation in time, space, condition, and scale BEFORE reaching for the 40 principles
3. **Ideal Final Result**: What would the solution look like if the problem solved itself?
4. **40 principles as reference**: Available but not the primary procedure; selected principles mapped to software patterns
5. **Resource analysis**: What already exists that can be used before adding new components?

## Template Sections Applied

Overview (architecture/API contradictions, separation-first), When to Use (stuck between mutually exclusive requirements, about to accept a trade-off), When NOT to Use (ordinary trade-offs, testable contradictions, non-technical problems), Procedure (Name contradiction → Try separation moves → IFR → If unresolved, scan principles → Resource analysis), Output Contract (contradiction statement, separation resolution, concrete design decision), Anti-Patterns (manufacturing contradictions, compromising instead of separating, skipping to principles without trying separation, applying to people problems)

## Comparison Design

Planned comparison: prior version of same skill (pre-edit vs post-edit), measuring whether the narrowed architecture/API-contradiction + separation-first framing improves paired reasoning quality on design-tradeoff items vs the broader 40-principles version.
