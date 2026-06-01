---
name: thinking-scientific-method
description: Use when a symptom could have several causes and you must find the faulty one—enumerate falsifiable hypotheses, rank by likelihood×cheapness-to-check, test the cheapest discriminating one first.
---

# Scientific Method (evidence-ranked differential)

> A reworked, agent-native version of this skill lives at `thinking-scientific-method-v2` (Hypothesis-Differential Debugging). This file is aligned to that approach. If you only need the lean procedure, use v2; the material below adds the falsification discipline behind it.

## Overview

The scientific method's payoff for an agent is not narrating "observe → question." It is the **differential**: when a symptom could come from several places, enumerate competing falsifiable hypotheses and spend your cheapest observation on the one that best discriminates between them. A good hypothesis is one you could prove **wrong**.

**Core Principle:** Don't guess-and-patch. Enumerate competing causes, then make the cheapest observation that would falsify the most likely one.

## When to Use

- A bug/incident symptom could plausibly come from more than one place
- Performance investigation with several candidate causes
- Root-cause analysis where you have read access to code, logs, diffs, and tests

```
Investigating a symptom?
  → Could it have more than one cause?    → no  → just test/fix the one cause
  → Can you list 3–5 falsifiable causes?  → no  → you're guessing—force alternatives
  → Have you named what would FALSIFY each?→ no  → do that before observing
```

## When NOT to Use

- The cause is already obvious from one trace or the recent diff → just fix it; skip the differential.
- Only one plausible hypothesis exists → test it directly.
- You can't make any observation (no code/log access) → get access first; don't speculate.
- You're tempted to design an A/B test, canary, or multi-week experiment → you (an agent) can't run those. The "test" must be an observation you can make **now** (read a file, grep callers, inspect a log line, diff a function).

## The Procedure

1. **Enumerate 3–5 falsifiable hypotheses** for where the fault lives. Be specific—a file/function/condition, not "something in the backend." If you can only think of one, you're guessing; force alternatives.
2. **For each, name the cheapest discriminating observation** a code-reading agent can actually make: read `auth/session.py:refresh`, grep callers of `parse_token`, check the error on the eu-west log line, diff the function the stack trace points to. Not "deploy a canary."
3. **Rank by likelihood × cheapness** and make the top observation first.
4. **State what result would falsify each hypothesis** *before* you look, so the observation updates you instead of confirming a prior.
5. **Stop** when one hypothesis is confirmed by direct evidence AND the others are ruled out. Name the file/function to change. Stop narrating once the fault is located.

## Worked Shape (fault localization)

```
Symptom: intermittent 500s on /export, only eu-west, started 3 days ago.

Hypotheses (ranked by likelihood × cheapness):
  H1  recent diff to the export serializer
      → cheap: grep last 3-day commits touching export*  | high prior
  H2  eu-west Redis rotation 4 days ago broke a cache key
      → cheap: read the cache client config              | region fits
  H3  upstream timeout under load
      → expensive: would need live traffic               | defer

Falsifier set before looking:
  if H1's diff doesn't touch the failing codepath → drop H1
  if the cache key resolves fine in eu-west       → drop H2

→ Observe H1, then H2. Name the implicated file.
```

## Multi-Hypothesis Debugging Table

When the cause is genuinely ambiguous, lay it out and test in order of (cheapness × likelihood):

```markdown
## Bug: users sometimes see stale data

| # | Hypothesis | Discriminating observation (now) | Falsified if… |
|---|------------|----------------------------------|---------------|
| 1 | CDN serving old content | check CDN cache-status headers | timestamps are fresh |
| 2 | Browser caching | force-refresh in repro | stale persists after refresh |
| 3 | Read-replica lag | correlate report times with lag metric | no correlation |
| 4 | Cache not invalidating | inspect invalidation path in code | invalidation fires correctly |

Test order: 1, 2 (cheapest), then 3, 4.
Result: 1 ruled out (fresh), 2 ruled out (stale after refresh),
        3 strong correlation with lag spikes → SUPPORTED. Cause: replica lag.
```

## Anti-Patterns

- Narrating "Observe → Question → Hypothesize" without ever proposing **competing** causes.
- Proposing a "test" you can't run (A/B, canary, load test). The test must be an observation available now.
- Confirmation: looking only for evidence that supports your first guess. State the falsifier first.
- Diving into speculation past the evidence—if you have no observation for a hypothesis, mark it deferred, don't assert it.

## Verification Checklist

- [ ] Listed 3–5 specific, falsifiable hypotheses (not one)
- [ ] Each has a discriminating observation you can make now
- [ ] Stated the falsifier for each before observing
- [ ] Ranked by likelihood × cheapness; tested the cheapest discriminating one first
- [ ] Stopped when one was confirmed and the rest ruled out; named the file/function

## Key Questions

- "What would I see if this hypothesis were FALSE?"
- "Which single observation best separates my top two hypotheses?"
- "Am I testing my hypothesis, or confirming my first guess?"
- "Is this a 'test' I can actually run as an agent right now?"

## Feynman's Wisdom

"The first principle is that you must not fool yourself—and you are the easiest person to fool." Your intuition generates hypotheses; the differential tests them ruthlessly. When the evidence disagrees with your expectation, the evidence wins.
