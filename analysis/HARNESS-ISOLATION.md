# Harness Isolation — confirmation & remediation

**Question:** does the eval harness's solver have *other* skills (project or global scope) loaded, which would confound the skill-vs-placebo comparison?

**Answer: yes, it did — and it's now mitigated and verified.** This is a material finding: all results produced *before* this fix are confounded by active contamination.

## What was contaminating the solver

The solver runs via `droid exec`, which authenticates with a keyring-bound Factory session and **injects global context into every call**:
- **`~/.factory/AGENTS.md`** — personal CoS/calendar/email "Agent Guidelines" — loaded into the system prompt.
- **~150 skills advertised** in an "Available skills" system reminder — **including the thinking skills themselves** (`thinking-bayesian`, `thinking-inversion`, `thinking-first-principles`, …) — plus an **allowed `Skill` tool** and `Read`/`Execute`/`Grep`/`Glob` tools.

So the "placebo" condition was never a clean no-framework baseline: the solver could **invoke any thinking skill** or **read the repo's skill files**, and the entire catalog sat in its context. (Confirmed empirically — the solver listed all 150 skills and quoted AGENTS.md's first line.)

## Why a fully-clean context isn't reachable here

- `FACTORY_HOME_OVERRIDE` to a sanitized home **breaks auth** — the WorkOS session is keyring-bound, not portable (copying or symlinking the auth files still fails).
- `FACTORY_API_KEY` is **empty** (no static key to fall back on).
- Custom direct-provider models need a config format `droid exec` wouldn't accept under the override.
- Relocating `~/.factory/skills` + `AGENTS.md` would work but is **invasive** (mutates the user's global config, affects other droid usage, fragile) — rejected.

## What the harness now does (`evals/lib/droid.js`, isolation ON by default)

1. **`--disabled-tools`** for every tool (`Skill`, `Read`, `Execute`, `Grep`, `Glob`, `LS`, `Edit`, `Create`, `Task`, `WebSearch`, `FetchUrl`, `TodoWrite`, …) → the solver **cannot invoke any skill or read any file**.
2. **Neutral cwd** (`os.tmpdir()`) → no project `AGENTS.md`/files in scope (the repo has none anyway).
3. **Appended system directive** instructing the solver to ignore any skills catalog / AGENTS.md / personal instructions / tools and reason only from the prompt.

Opt out with `EVAL_NO_ISOLATE=1`.

## Verification (ground truth, not self-report)

- `droid exec --list-tools` with the disabled set → every tool shows **`blocked override`**.
- Through the harness, instructing the solver to actually use `Read` → droid returns **"The Read tool is unavailable or blocked... invocation failed."**
- (An LLM self-report claimed it *could* use skills — a misreport; the forced tool attempt is the real test, and that attempt fails.)

**Therefore:** the solver cannot invoke any of the 39 thinking skills and cannot read their files. The only skill content it uses is what the harness injects. **Active contamination is eliminated.**

## The residual (honest limitation)

The **passive** context — the skill *name* catalog + AGENTS.md text — remains in the system prompt and cannot be stripped under the current keyring-bound session. However:
- It is **identical across every condition** (placebo, single skill, stack; every model; every effort), so it **cannot bias a skill-vs-placebo *delta* or a capability *slope*** — only inflate the absolute baseline.
- The solver is explicitly instructed to ignore it and **cannot act on it** (tools blocked).

## Implications

- **Pre-isolation results** (`tier3-behavioral`, `correctness`, experiments `exp-l1`/`exp-l2`) ran with tools **enabled** → potential active contamination → treat as **superseded/indicative**; re-run under isolation before trusting.
- **Capability experiments** (`CAP-EFFORT`, `CAP-MODEL`, stacking) run **isolation-ON**; their deltas/slopes are robust to the constant passive context.
- **For a fully pristine harness:** obtain a `FACTORY_API_KEY` (or a direct-provider key) and run under `FACTORY_HOME_OVERRIDE=<clean home>` — then even the passive catalog/AGENTS.md disappears. Documented as the production path.
