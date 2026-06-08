#!/usr/bin/env bash
# Rerun: powered objective evals for the newly-covered gap skills (sequential, quota-safe).
# All isolated, length-controlled, paired skill-vs-placebo, judge-free (objective ground truth).
set -u
cd "$(dirname "$0")/.."
export EVAL_RUN=rerun
OUT=evals/results/rerun; mkdir -p "$OUT"
LOG=evals/results/rerun.log; : > "$LOG"
run () { echo "===== $* =====" | tee -a "$LOG"; eval "$*" 2>&1 | grep -v "_omz_nvm" | tee -a "$LOG"; echo "" | tee -a "$LOG"; }
echo "RERUN START $(date -u +%FT%TZ)" | tee -a "$LOG"

run "FORCE_SKILL=reversibility CONC=4 OUTFILE=$OUT/reversibility-doors.json node evals/run-routing-data.js reversibility-doors"
run "FORCE_SKILL=first-principles CONC=4 OUTFILE=$OUT/first-principles-constraint.json node evals/run-routing-data.js first-principles-constraint"
run "FORCE_SKILL=theory-of-constraints CONC=4 OUTFILE=$OUT/theory-of-constraints-bottleneck.json node evals/run-routing-data.js theory-of-constraints-bottleneck"
run "FORCE_SKILL=second-order CONC=4 OUTFILE=$OUT/second-order-consequence.json node evals/run-routing-data.js second-order-consequence"
run "FORCE_SKILL=map-territory CONC=4 OUTFILE=$OUT/map-territory-verify.json node evals/run-routing-data.js map-territory-verify"
run "FORCE_SKILL=margin-of-safety CONC=4 OUTFILE=$OUT/margin-of-safety-provision.json node evals/run-routing-data.js margin-of-safety-provision"
run "FORCE_SKILL=second-order CONC=4 OUTFILE=$OUT/strategyqa-second-order.json node evals/run-correctness.js strategyqa"

echo "RERUN DONE $(date -u +%FT%TZ)" | tee -a "$LOG"
