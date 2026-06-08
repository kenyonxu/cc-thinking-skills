# Rework Spec: red-team

**Date:** 2026-06-06
**Status:** pre-registered (pre-decisive-eval)
**Skill:** `thinking-red-team`
**Eval Family:** Security/adversarial
**Value Surface:** false-positive reduction (security vulnerability detection with reproducible attack paths)

## Hypothesis

Narrowing red-team to **security/code vulnerability detection only** — with an explicit anti-fabrication gate requiring every finding to have a concrete, reproducible attack path (entry point → steps → realized impact) — will reduce false positives and speculative claims. De-emphasizing plan/architecture/decision red-teaming (redirecting those to `thinking-pre-mortem` and `thinking-steel-manning`) focuses the skill on its highest-value domain where adversarial thinking is essential rather than optional.

## Value Surface

The skill delivers value when:
1. Reviewing code, auth, APIs, or infrastructure for security vulnerabilities
2. Every finding can be supported by a concrete attack path: entry point → exact steps → realized impact
3. The system is one the user controls and can attack adversarially

It does NOT deliver value for plan stress-testing, decision challenge, or architecture review — those are better served by pre-mortem and steel-manning.

## Expected Mechanism

1. **Security-only scope**: Default domain is security; redirect language for plan/decision/architecture red-teaming
2. **Anti-fabrication gate**: Every finding MUST have entry point + steps + realized impact; speculative/theoretical weaknesses are dropped, not padded
3. **Attack-surface enumeration**: Systematic coverage of auth, session, input validation, business logic, trust boundaries
4. **Reproducibility requirement**: A finding that can't be demonstrated is not a finding
5. **Severity triage**: Critical/High/Medium/Low with explicit remediation

## Template Sections Applied

Overview (security-focused, anti-fabrication gate), When to Use (security review, pre-launch hardening), When NOT to Use (plan stress-testing, decision challenge, architecture review, speculative best-practice lists), Procedure (define target, enumerate attack surface, execute attack scenarios, attempt bypass, document with reproducible paths), Output Contract (findings report with severity, attack path, remediation), Anti-Patterns (speculative claims, padding with best-practice items, reporting theoretical weaknesses, using for non-security tasks)

## Comparison Design

Planned comparison: prior version of same skill (pre-edit vs post-edit), measuring whether the narrowed security-only scope + anti-fabrication gate improves FPR on DiverseVul balanced vulnerable/safe code pairs vs the broader multi-domain version.
