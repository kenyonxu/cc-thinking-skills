# Stale-Claim Cleanup Notes — Elevate-or-Kill Mission

**Generated:** 2026-06-07  
**Purpose:** Document which claims in existing analysis docs are superseded by mission evidence, without deleting history. Every stale claim is flagged rather than removed.

---

## 1. `analysis/SKILL-AUDIT.md` — Superseded Claims

### 1.1 Superseded Banner Prepended

A superseded banner has been prepended to `analysis/SKILL-AUDIT.md` (line 1) reading:

```
> **⚠️ SUPERSEDED — 2026-06-07 (Elevate-or-Kill M5 outcome)**
> This audit was written BEFORE the M5 powered runs. Several of its key dispositions are superseded by powered evidence. See `analysis/ELEVATE-OR-KILL-SCORECARD.md` for current verdicts and `analysis/STALE-CLAIM-CLEANUP.md` for the full cleanup notes. The best-practices rubric remains useful; per-skill dispositions are superseded where contradicted by powered evidence.
```

### 1.2 Specific Superseded Claims

| Claim in SKILL-AUDIT.md | Superseded By | Reason |
|--------------------------|---------------|--------|
| **`systems` = KEEP-FULL + refocus to cross-service debugging; "make it the hub"** | M5 powered: +1.3pp p=0.724 (NO-LIFT). Earlier +5.3pp p=0.043 did not replicate (−1.3pp p=0.683). | `systems` shows no robust effect at power. It cannot serve as a "proven hub." Its ELEVATE claims are superseded. |
| **`five-whys-plus` = KEEP; restore trimmed procedure content** | M5 powered (decisive split, n=224): +0.9pp p=0.724 (NO-LIFT). Earlier +4.0pp p=0.041 did not replicate (+1.3pp p=0.752). | "Restore trimmed content" was based on the (now-retracted) trimming-regression theory. The trimmed and original were both noise draws. |
| **`red-team` = KEEP-FULL, narrow to security; ELEVATE candidate** | M5 powered: +1.4pp p=1.0 on harder CWE decisive split. Earlier +11.3pp p=0.052 (n=80) collapsed to +5.0pp p=0.10 (n=200). | Directional positive but not significant. "ELEVATE candidate" is downgraded. |
| **`fermi-estimation` = KILL** | Confirmed by powered n=150: +0.7pp p=1.0. The rework "rescue" at n=40 (+7.5pp) was noise. | Audit's KILL disposition is confirmed, but for different reasons — not the original n=40 negative, but the powered null. |
| **`occams-razor` = TRIGGER-ONLY** | M5 powered (decisive split, n=224): −0.9pp p=0.724 (NO-LIFT). | Trigger-scoped rework did not move the needle. TRIGGER-ONLY disposition stands but no powered lift. |
| **`scientific-method` = REPLACED with hypothesis-differential debugging** | M5 fresh primary: +5.3pp p=0.061 (DIRECTIONAL-NOT-REPLICATED). M5 replication: +8.0pp p=0.001. | The replacement was correct and the reworked skill is the strongest in the catalog. But it did not achieve ELEVATE. Audit's +9.3pp reference was the old run1 primary (superseded). |

### 1.3 Obsolete Consolidation Map

The **"Consolidation map (39 → ~26 sharper skills)"** section in SKILL-AUDIT.md is **obsolete**. This mission's evidence invalidated several of its assumptions:
- `systems` was assumed to be a proven hub (not replicated)
- `five-whys-plus` was assumed to be proven (not replicated)
- `red-team` was assumed to be an ELEVATE candidate (directional only)
- Several kill/trigger-only dispositions were based on small-N judge-only evidence rather than powered objective runs

**A new consolidation plan** (`analysis/FUTURE-CONSOLIDATION-PLAN.md`) has been written based on the current powered evidence. The old 39→26 map should not be referenced as authoritative.

### 1.4 What Remains Valid from SKILL-AUDIT.md

- The **best-practices rubric** (situation-named descriptions, When NOT to Use, agent-native framing, right delivery scope, narrowed domain, anti-framework-theater, distinctness) remains sound and evidence-grounded
- The **cross-cutting defects** catalog-wide observations (missing When NOT to Use, framework-named descriptions, human stage-directions, over-delivery, Meadows triplication) remain valid
- The **per-skill fix recommendations** (e.g., "add stop condition," "rewrite agent-native," "narrow domain") remain useful for future rework — but the verdicts they support (KEEP-FULL, ELEVATE candidate, etc.) are superseded

---

## 2. `analysis/ELEVATE-OR-KILL.md` — Stale Narrative Cleanup

### 2.1 Superseded Banner Prepended to Mid-Document Narrative

A superseded banner has been inserted after the "Updated conclusion (domain-fit determines the sign)" section header and before the first ELEVATE claim. It reads:

```
> **⚠️ SUPERSEDED NARRATIVE — 2026-06-07 (Elevate-or-Kill M5 outcome)**
> The following mid-document sections (★ through ★★★) contain ELEVATE claims that have been overturned by powered replication evidence. These sections are retained for historical provenance only. The CURRENT verdicts are documented in `analysis/ELEVATE-OR-KILL-SCORECARD.md`. See `analysis/STALE-CLAIM-CLEANUP.md` for the full cleanup notes.
> **Only the final two sections (★ Wave C replication failure + ★★★★★ Powered confirmation collapse) and the final program verdict are current.**
```

### 2.2 Specific Overturned Claims

| Claim | Section | Overturned By |
|-------|---------|---------------|
| **"First significant verdict — thinking-systems = ELEVATE"** (+5.3pp p=0.043) | ★ | Replication n=150: −1.3pp p=0.683 |
| **"Phase 7 answer — systems +5.3pp, five-whys-plus +4.0pp both firm ELEVATE"** | ★★ | Neither replicated at power |
| **"scientific-method rework prototype went 0pp → +5.3pp (p=0.061), then replaced and improved to +9.3pp (p=0.002)"** | ★★ | Old run1 primary +9.3pp p=0.002 was superseded by M5 fresh primary +5.3pp p=0.061; the skill is now DIRECTIONAL-NOT-REPLICATED |
| **"Trimming regression lesson"** — "improving an already-proven skill can regress it... both proven skills dipped to ns after trimming" | ★★★ | **Retracted.** Both original +5pp AND trimmed +3pp were draws from a near-zero-centered distribution. The dips were regression to the mean, not caused by trimming. The content-trimming caution was based on a false causal attribution. |
| **"Firm significant ELEVATEs to date: scientific-method (+9.3pp, p=0.002)"** | ★★★ | Superseded by M5 fresh primary +5.3pp p=0.061. The old run1 primary was stale (predated the SKILL.md rewrite). |
| **"systems (+5.3pp) and five-whys-plus (+4pp) were firm pre-trim and need their trimmed content restored"** | ★★★ | Superseded — replication failure shows both were noise, regardless of trimming. |
| **"Red-team +11.3pp p=0.052 strong ELEVATE-leaning"** | ★★★★ | Powered confirmation n=200: +5.0pp p=0.10 (directional only). |
| **"Robust ELEVATE: scientific-method (+9.3pp p=0.002)"** | ★★★★ | Superseded — see above. |
| **"fermi-estimation rework rescued: +7.5pp p=0.371 (n=40)"** | ★★★★ | Powered n=150: +0.7pp p=1.0 — rework rescue was n=40 noise. |

### 2.3 What Remains Current in ELEVATE-OR-KILL.md

Only the **final two sections** (★ Wave C replication failure, ★★★★★ Powered confirmation collapse, and the final program verdict) are current. These sections correctly document:
- The replication failure of systems and five-whys-plus
- The collapse of red-team and fermi-estimation at power
- The pattern that borderline p≈0.04–0.05 results do not survive replication
- The catalog's value being in reasoning framing, not measurable correctness

However, even these sections reference the old run1 scientific-method primary (+9.3pp p=0.002) as "robust ELEVATE," which has been superseded by the M5 fresh primary (+5.3pp p=0.061, DIRECTIONAL-NOT-REPLICATED). The canonical scorecard (`analysis/ELEVATE-OR-KILL-SCORECARD.md`) is the authoritative source for current verdicts.

---

## 3. `analysis/ELEVATE-OR-KILL-SCORECARD.md` — Taxonomy Fix

### 3.1 Provenance Taxonomy Wording

**Before:** `| OBJ-powered-significant | Objective ground-truth run, powered (n≥150), p<0.05, replicated direction |`  
**After:** `| OBJ-powered-significant | Objective ground-truth run, powered (n≥150), p<0.05 (may be a standalone replication run; does NOT imply the skill-level verdict is replicated) |`

**Reason:** The old wording "replicated direction" implied that any evidence row tagged `OBJ-powered-significant` was part of a replicated ELEVATE verdict. In the current scorecard, `OBJ-powered-significant` is used for the scientific-method replication run (+8.0pp p=0.001) — which is significant but does NOT make the skill-level verdict "replicated" (the primary failed the gate). The new wording disambiguates evidence-level tags from skill-level verdicts.

### 3.2 Temporal/Significance Qualifiers

**Before:** `replicated: true/false`  
**After:** `replicated: false (no skill-level ELEVATE verdict currently meets the replication gate; individual evidence rows may carry a significant replication signal that does not rescue a failed primary)`

**Reason:** No skill currently has a skill-level `replicated: true` status. Listing `true/false` misleadingly suggests that some skills have achieved replication. The qualifier is now accurate to the current state of evidence.

---

## 4. Stale Claims Explicitly Flagged in the Scorecard

The canonical scorecard already flags these claims as `superseded` in its "Reconciliation: Stale Claims Exceptions" section:

| Stale Claim | Source | Flag |
|-------------|--------|------|
| "run1 scorecard: 22/36 proven, mean win-rate 56%" | `evals/results/run1/scorecard.md` | `judge-only-n3-superseded` |
| "systems +5.3pp p=0.043 = firm ELEVATE" | `analysis/ELEVATE-OR-KILL.md` (mid) | `superseded` |
| "five-whys-plus +4.0pp p=0.041 = firm ELEVATE" | `analysis/ELEVATE-OR-KILL.md` (mid) | `superseded` |
| "red-team +11.3pp p=0.052 = strong ELEVATE-leaning" | `analysis/ELEVATE-OR-KILL.md` (mid) | `superseded` |
| "fermi rework +7.5pp p=0.371 = rescued" | `analysis/ELEVATE-OR-KILL.md` (mid) | `superseded` |
| "trimming caused regression on systems/five-whys" | `analysis/ELEVATE-OR-KILL.md` (mid) | `superseded` |
| "39→26 consolidation map" | `analysis/SKILL-AUDIT.md` | `superseded` |

---

## 5. Cleanup Principles Applied

1. **Never delete history.** All stale claims are flagged, not removed. The original documents retain their content for provenance.
2. **Banner, don't rewrite.** Superseded documents get a prominent banner at the top identifying them as superseded, with a pointer to the current authoritative source.
3. **Cite the specific superseding evidence.** Every flag references the exact result file, run ID, or scorecard row that overturns the claim.
4. **Retract, don't revise.** The "trimming regression" lesson is explicitly retracted (not revised to a softer claim) because it was based on a false causal attribution.
5. **One source of truth.** The canonical scorecard (`analysis/ELEVATE-OR-KILL-SCORECARD.{json,md}`) is the single authoritative source for all current verdicts. All other analysis docs defer to it.

---

*These cleanup notes are the definitive record of which claims in the analysis docs are superseded. For current verdicts, always consult `analysis/ELEVATE-OR-KILL-SCORECARD.md`.*
