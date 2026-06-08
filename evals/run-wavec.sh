#!/usr/bin/env bash
# Wave C — powered elevate/kill sweep (sequential to respect the shared droid quota).
# Each step is isolated, length-controlled, paired (skill vs length-matched placebo).
# Writes results under evals/results/wavec/ and logs to evals/results/wavec.log.
set -u
cd "$(dirname "$0")/.."
export EVAL_RUN=wavec
OUT=evals/results/wavec
mkdir -p "$OUT"
LOG=evals/results/wavec.log
: > "$LOG"
run () { echo "===== $* =====" | tee -a "$LOG"; eval "$*" 2>&1 | grep -v "_omz_nvm" | tee -a "$LOG"; echo "" | tee -a "$LOG"; }

echo "WAVE C START $(date -u +%FT%TZ)" | tee -a "$LOG"

# 1) red-team — NEW objective verdict on the balanced vuln/safe set (judge-free)
run "FORCE_SKILL=red-team LIMIT=80 CONC=4 OUTFILE=$OUT/redteam-diversevul-balanced.json node evals/run-correctness.js diversevul-balanced"

# 2) circle-of-competence — NEW objective abstention verdict (balanced selfAware)
run "FORCE_SKILL=circle-of-competence CONC=4 OUTFILE=$OUT/abstention-circle-of-competence.json node evals/run-abstention.js selfaware"

# 3) socratic — NEW binary-decision verdict (clarify-or-not)
run "FORCE_SKILL=socratic CONC=4 OUTFILE=$OUT/routing-socratic.json node evals/run-routing-data.js socratic-clarify"

# 4) cynefin — NEW binary-decision verdict (ordered vs unordered)
run "FORCE_SKILL=cynefin CONC=4 OUTFILE=$OUT/routing-cynefin.json node evals/run-routing-data.js cynefin-classify"

# 5) systems (restored leverage table) — SWE replication at the protocol N=150
run "FORCE_SKILL=systems LIMIT=150 CONC=4 OUTFILE=$OUT/swe-systems-restored.json node evals/run-swe.js"

# 6) five-whys-plus (content intact) — SWE replication at N=150
run "FORCE_SKILL=five-whys-plus LIMIT=150 CONC=4 OUTFILE=$OUT/swe-five-whys-plus-replication.json node evals/run-swe.js"

echo "WAVE C DONE $(date -u +%FT%TZ)" | tee -a "$LOG"
