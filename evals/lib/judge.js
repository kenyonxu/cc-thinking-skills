'use strict';

/**
 * Pairwise judging across a panel of models with majority vote — reduces the
 * single-judge variance/bias the adversarial committee flagged. Set JUDGES to a
 * comma list (e.g. "gemini-3.1-pro-preview,gpt-5.5-pro,deepseek-v4-pro").
 */

const { droidJsonAsync } = require('./droid');

function panelModels() {
  return (process.env.JUDGES || process.env.JUDGE_MODEL || 'gemini-3.1-pro-preview')
    .split(',').map(s => s.trim()).filter(Boolean);
}

/**
 * @returns {{winner:'A'|'B'|'tie', votes:Array, vocab_only:boolean, whys:string[]}}
 * `winner` is the panel majority; ties (or no majority) → 'tie'.
 */
async function panelJudge(judgePromptFor, judges = panelModels()) {
  const votes = await Promise.all(judges.map(async model => {
    const r = await droidJsonAsync({ model, prompt: judgePromptFor });
    if (!r.ok || !r.json) return { model, winner: null };
    return { model, winner: (r.json.winner || 'tie').toUpperCase(), margin: r.json.margin, why: r.json.why, vocab_only: !!r.json.skill_vocab_without_substance };
  }));
  const tally = { A: 0, B: 0, tie: 0 };
  for (const v of votes) if (v.winner && tally[v.winner] !== undefined) tally[v.winner]++;
  let winner = 'tie';
  if (tally.A > tally.B && tally.A > tally.tie) winner = 'A';
  else if (tally.B > tally.A && tally.B > tally.tie) winner = 'B';
  const vocabVotes = votes.filter(v => v.vocab_only).length;
  return { winner, tally, votes, vocab_only: vocabVotes > votes.length / 2, whys: votes.map(v => v.why).filter(Boolean) };
}

module.exports = { panelModels, panelJudge };
