---
name: thinking-scientific-method-v2
description: Localize a bug by ranking falsifiable hypotheses by likelihood×cheapness-to-check and testing the cheapest discriminating one first. Use when a symptom could have several causes and you must find the faulty code.
---

# Hypothesis-Differential Debugging (reworked)

Agent-native rewrite of the scientific method, scoped to its native domain — finding the faulty code behind a symptom. The original's value was buried under observe→question narration and human-only "run a canary / A/B test" steps an agent can't execute. This version is just the differential.

**Core principle:** Don't guess-and-patch and don't narrate. Enumerate competing causes, then spend your cheapest observation on the one that best discriminates between them.

## When to Use
- A bug/incident symptom could plausibly come from more than one place.
- You have read access to the code, logs, diffs, and tests but cannot run expensive experiments.

## When NOT to use (stop conditions)
- The cause is already obvious from a single trace or the recent diff → just fix it; skip the differential.
- Only one plausible hypothesis exists → test it directly.
- You cannot make any observation (no code/log access) → gather access first; don't speculate.

## The procedure
1. **Enumerate 3–5 falsifiable hypotheses** for where the fault lives (be specific: a file/function/condition, not "something in the backend"). If you can only think of one, you're guessing — force alternatives.
2. **For each hypothesis, name the *cheapest discriminating observation* available to a code-reading agent** — e.g. "read `auth/session.py:refresh`", "grep for callers of `parse_token`", "check the error in the eu-west log line", "diff the function the issue's stack trace points to". NOT "deploy a canary" or "run a 2-week A/B test."
3. **Rank by likelihood × cheapness** and make the top observation first.
4. **State what result would falsify each hypothesis** before you look, so the observation actually updates you instead of confirming a prior.
5. **Stop** when one hypothesis is confirmed by direct evidence AND the others are ruled out — then name the file/function to change. Do not keep narrating once the fault is located.

## Anti-patterns
- Narrating "Observe → Question → Hypothesize" without ever proposing competing causes.
- Proposing a "test" the agent cannot run (canary, A/B, load test) — the test must be an observation you can actually make now.
- Confirmation: looking only for evidence that supports your first guess.

## Worked shape (fault localization)
```
Symptom: intermittent 500s on /export, only eu-west, started 3 days ago.
Hypotheses (ranked by likelihood×cheapness):
  H1 recent diff to export serializer (grep last 3-day commits touching export*) — cheap, high prior
  H2 eu-west Redis rotation 4 days ago broke a cache key (read cache client config) — cheap, region-specific fits
  H3 upstream timeout under load (would need traffic — expensive, defer)
Falsifier: if H1's diff doesn't touch the failing codepath, drop it.
→ Observe H1 then H2; name the file the evidence implicates.
```
