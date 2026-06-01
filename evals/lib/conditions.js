'use strict';

/**
 * Solver conditions for the behavioral eval. Addresses the adversarial reviewers'
 * #1 validity threat: the treatment injects 2-4k words, so naive "skill vs empty"
 * confounds the model's reasoning with simply having more tokens to think with.
 *
 *   placebo  — problem + neutral, content-free filler matched to the skill's word count
 *   skill    — problem + the full SKILL.md
 *   trigger  — problem + skill name + a 2-3 sentence trigger summary (textbook-vs-trigger test)
 *
 * Headline comparison is skill-vs-placebo (length-controlled). The skill:trigger
 * comparison reveals whether the full guide beats a one-liner.
 */

// Neutral, true-but-method-free sentences in a software register. Carries no
// analytical framework — a fair length placebo.
const FILLER_SENTENCES = [
  'When approaching a task, it helps to read the request carefully and confirm what is actually being asked.',
  'Software systems are made of many components, and work in one area often touches others.',
  'It is generally good practice to communicate clearly and to write down the reasoning behind a choice.',
  'Consider the broader context of the work, including the people and teams involved.',
  'Tools, libraries, and platforms change over time, so it is worth staying reasonably current.',
  'Testing and verification are part of delivering work that holds up in practice.',
  'Keep an eye on timelines and available resources as the work proceeds.',
  'Where possible, prefer clarity over cleverness so others can follow the work later.',
  'Document assumptions and constraints so they can be revisited if circumstances change.',
  'Small, steady progress is often easier to manage than large, infrequent changes.',
  'Be mindful of edge cases and conditions that may not appear in the most common path.',
  'It is reasonable to ask clarifying questions when a request is open to interpretation.',
];

function neutralFiller(wordCount) {
  const out = [];
  let count = 0, i = 0;
  while (count < wordCount) {
    const s = FILLER_SENTENCES[i % FILLER_SENTENCES.length];
    out.push(s);
    count += s.split(/\s+/).length;
    i++;
  }
  return out.join(' ');
}

function wordCount(s) { return s.split(/\s+/).filter(Boolean).length; }

/** A 2-3 sentence trigger summary built from the skill's own frontmatter + core principle. */
function triggerSummary(content, name) {
  const desc = (content.match(/description:\s*(.+)/) || [, ''])[1].trim();
  const core = (content.match(/\*\*Core Principle:\*\*\s*(.+)/) || [, ''])[1].trim();
  let s = `Thinking skill "${name}". ${desc}`;
  if (core) s += ` Core principle: ${core}`;
  return s;
}

function buildConditionPrompt(condition, problemText, skillContent, skillName) {
  const tail = `\n\nThink carefully and give your best, decision-useful answer.`;
  if (condition === 'empty') return `${problemText}${tail}`;
  if (condition === 'placebo') {
    const filler = neutralFiller(wordCount(skillContent));
    return `Some general notes before the task:\n\n${filler}\n\nNow address this problem:\n\n${problemText}${tail}`;
  }
  if (condition === 'trigger') {
    return `Consider applying the following thinking approach if relevant. Apply it substantively; do not merely name it.\n\n${triggerSummary(skillContent, skillName)}\n\nNow address this problem:\n\n${problemText}${tail}`;
  }
  // 'skill'
  return `Use the following thinking-skill guide to structure your reasoning. Apply it substantively; do not merely name it.\n\n=== THINKING SKILL ===\n${skillContent}\n=== END SKILL ===\n\nNow address this problem:\n\n${problemText}${tail}`;
}

/**
 * Build a solve prompt for a given skill CONTENT, padded with neutral filler so
 * the total context reaches `targetWords` — lets us compare two skill versions
 * (e.g. modified vs original, or trigger vs full) head-to-head with EQUAL length,
 * isolating content from length. Used by the paired experiment runner.
 */
function buildBalancedSkillPrompt(content, problemText, targetWords) {
  const have = wordCount(content);
  const pad = targetWords > have ? `\n\nAdditional general notes:\n${neutralFiller(targetWords - have)}` : '';
  return `Use the following thinking-skill guide to structure your reasoning. Apply it substantively; do not merely name it.\n\n=== THINKING SKILL ===\n${content}\n=== END SKILL ===${pad}\n\nNow address this problem:\n\n${problemText}\n\nThink carefully and give your best, decision-useful answer.`;
}

/** Stack N skill guides into one prompt (for the stacking experiment). */
function buildStackPrompt(contents, problemText, targetWords) {
  const joined = contents.map((c, i) => `=== THINKING SKILL ${i + 1} ===\n${c}`).join('\n\n');
  const have = wordCount(joined);
  const pad = targetWords && targetWords > have ? `\n\nAdditional general notes:\n${neutralFiller(targetWords - have)}` : '';
  return `Use the following thinking-skill guides TOGETHER to structure your reasoning. Apply them substantively and in combination; do not merely name them.\n\n${joined}\n=== END SKILLS ===${pad}\n\nNow address this problem:\n\n${problemText}\n\nThink carefully and give your best, decision-useful answer.`;
}

module.exports = { neutralFiller, triggerSummary, buildConditionPrompt, buildBalancedSkillPrompt, buildStackPrompt, wordCount, FILLER_SENTENCES };
