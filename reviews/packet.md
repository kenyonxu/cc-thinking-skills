# Review Packet — cc-thinking-skills

You are one of three independent frontier models performing an ADVERSARIAL review of a Claude Code plugin that ships 39 "thinking skills" (mental models) for an AI coding/decision agent. Your job is to find what is weak, wrong, redundant, or missing — and to attack the eval methodology itself. Be specific and skeptical; do not flatter.

## A. Project README
```markdown
# Claude Code Thinking Skills

> **39 Mental Models and Frameworks for Critical Thinking in Claude Code**

A comprehensive collection of thinking skills for [Claude Code](https://claude.ai/claude-code) that enhance AI-assisted problem solving, decision making, and strategic analysis. These skills provide structured frameworks based on proven mental models from leaders in systems thinking, cognitive science, and strategic analysis.

[![Claude Code Skills](https://img.shields.io/badge/Claude_Code-Skills-7C3AED?style=flat&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiA3TDEyIDEyTDIyIDdMMTIgMloiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMiAxN0wxMiAyMkwyMiAxNyIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yIDEyTDEyIDE3TDIyIDEyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+)](https://github.com/tjboudreaux/cc-thinking-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Skills Count](https://img.shields.io/badge/Skills-39-blue)](https://github.com/tjboudreaux/cc-thinking-skills)

## Features

- **39 Thinking Frameworks** - Comprehensive mental models for better decision-making
- **Battle-Tested** - Based on proven frameworks from cognitive science and systems thinking
- **Claude Code Native** - Designed specifically for Claude Code's skill system
- **Quality Scripts** - Tools to validate and enhance skill quality
- **Zero Configuration** - Just install and invoke with skill names

## Quick Start

### Installation via Plugin Marketplace (Recommended)

Install directly in Claude Code using the plugin system:

```bash
# Add the marketplace
/plugin marketplace add tjboudreaux/cc-thinking-skills

# Install the plugin
/plugin install thinking-skills@thinking-skills-marketplace
```

### Alternative: Manual Installation

Clone and copy skills directly:

```bash
# Clone the repository
git clone https://github.com/tjboudreaux/cc-thinking-skills.git

# Copy skills to your global Claude Code config
cp -r cc-thinking-skills/skills/* ~/.claude/skills/

# Or copy to a specific project
cp -r cc-thinking-skills/skills/* /path/to/your/project/.claude/skills/
```

### Development: Load as Local Plugin

For testing or development:

```bash
claude --plugin-dir ./cc-thinking-skills
```

### Usage

Once installed, invoke any skill by name in Claude Code:

```
> Use first-principles thinking to analyze this architecture decision
> Apply the pre-mortem framework to this project plan
> Help me use Bayesian reasoning to evaluate this hypothesis
> Use the theory of constraints to find our bottleneck
```

## Available Skills

### Decision Making & Analysis

| Skill | Description | Best For |
|-------|-------------|----------|
| `thinking-first-principles` | Break problems into fundamental truths | Innovation, challenging assumptions |
| `thinking-second-order` | Think beyond immediate consequences | Strategic decisions, policy changes |
| `thinking-inversion` | Approach problems by identifying paths to failure | Risk identification, planning |
| `thinking-pre-mortem` | Imagine failure and work backward | Project kickoffs, risk assessment |
| `thinking-kepner-tregoe` | Systematic rational process for complex analysis | High-stakes decisions, root cause analysis |
| `thinking-reversibility` | Classify decisions by reversibility (Type 1/2) | Commitment sizing, risk assessment |
| `thinking-regret-minimization` | Project to future self to test decisions | Career choices, major life decisions |
| `thinking-opportunity-cost` | Evaluate choices by what you give up | Resource allocation, prioritization |

### Cognitive & Behavioral

| Skill | Description | Best For |
|-------|-------------|----------|
| `thinking-bayesian` | Update beliefs based on evidence | Probability estimation, uncertainty |
| `thinking-debiasing` | Identify and counteract cognitive biases | Major decisions, high stakes |
| `thinking-dual-process` | Recognize when to trust intuition vs. analysis | Speed vs. accuracy tradeoffs |
| `thinking-bounded-rationality` | Make good-enough decisions under constraints | Time pressure, satisficing |
| `thinking-socratic` | Systematic questioning framework | Requirements, debugging, coaching |
| `thinking-probabilistic` | Calibrated probability estimation | Forecasting, uncertainty quantification |
| `thinking-steel-manning` | Argue the strongest opposing position | Debate, decision validation |

### Systems & Strategy

| Skill | Description | Best For |
|-------|-------------|----------|
| `thinking-systems` | Analyze interconnected systems | Complex debugging, architecture |
| `thinking-feedback-loops` | Identify reinforcing and balancing loops | Growth design, organizational dynamics |
| `thinking-archetypes` | Recognize recurring system patterns | Organizational problems, recurring issues |
| `thinking-ooda` | Rapid decision-making for dynamic situations | Incident response, competitive scenarios |
| `thinking-leverage-points` | Find where small changes have big effects | System optimization, intervention design |
| `thinking-theory-of-constraints` | Identify and manage bottlenecks | Performance optimization, throughput |
| `thinking-cynefin` | Classify problems by complexity domain | Methodology selection, approach matching |

### Problem Solving & Innovation

| Skill | Description | Best For |
|-------|-------------|----------|
| `thinking-occams-razor` | Prefer simpler explanations | Debugging, architecture decisions |
| `thinking-map-territory` | Recognize limits of mental models | Expectation mismatches, abstractions |
| `thinking-circle-of-competence` | Know the boundaries of expertise | Delegation, learning decisions |
| `thinking-triz` | Resolve technical contradictions | Engineering design, innovation |
| `thinking-five-whys-plus` | Enhanced root cause analysis with bias guards | Debugging, incident postmortems |
| `thinking-scientific-method` | Hypothesis-driven investigation | Debugging, A/B testing, experimentation |
| `thinking-thought-experiment` | Structured imagination for exploration | Architecture, edge cases, philosophy |

### Estimation & Risk

| Skill | Description | Best For |
|-------|-------------|----------|
| `thinking-fermi-estimation` | Order-of-magnitude calculations | Quick sizing, feasibility checks |
| `thinking-margin-of-safety` | Build in buffers for uncertainty | Risk management, system design |
| `thinking-lindy-effect` | Older things likely to last longer | Technology selection, durability |
| `thinking-via-negativa` | Improve by removing, not adding | Simplification, robustness |
| `thinking-red-team` | Attack your own plans adversarially | Security review, plan validation |

### Product & Innovation

| Skill | Description | Best For |
|-------|-------------|----------|
| `thinking-jobs-to-be-done` | Understand the job customers hire products for | Product development, feature design |
| `thinking-effectuation` | Start with means, not goals | Startups, innovation, uncertainty |

### Meta-Skills

| Skill | Description | Best For |
|-------|-------------|----------|
| `thinking-model-router` | **START HERE** - Route to the right model by domain | Entry point for all thinking skills |
| `thinking-model-selection` | Choose the right model for the problem | New problems, approach selection |
| `thinking-model-combination` | Combine multiple models for richer analysis | Complex problems, high-stakes decisions |

## Quality Assurance Tools

This collection includes scripts to maintain and improve skill quality:

### Validate Skills

Check all skills against quality criteria:

```bash
node scripts/validate-skills.js
```

Outputs a report showing:
- Required sections present/missing
- Quality metrics (examples, tables, checklists)
- Overall score per skill
- Skills needing attention

### Generate Enhancement Suggestions

Get specific improvement suggestions for a skill:

```bash
# Single skill
node scripts/enhance-skill.js thinking-first-principles

# All skills summary
node scripts/enhance-skill.js
```

### Generate AI Improvement Prompts

Create prompts for Claude to enhance skills:

```bash
node scripts/generate-improvement-prompt.js thinking-bayesian
```

This generates a detailed prompt you can use with Claude Code to systematically improve any skill.

## Detailed Skill Descriptions

### First Principles Thinking
Strip away assumptions to reveal fundamental truths, then rebuild solutions from basics. Championed by Elon Musk and rooted in Aristotle's philosophy.

**When to use:**
- Conventional approaches have failed
- You're told something is "impossible"
- Need innovation, not incremental improvement

### Bayesian Reasoning
Update beliefs systematically based on new evidence. Provides a framework for thinking about probability and uncertainty.

**When to use:**
- Estimating probabilities or likelihoods
- Interpreting test results or metrics
- Making decisions with incomplete information

### Systems Thinking
View problems as part of interconnected wholes with feedback loops and emergent properties. Essential for debugging complex distributed systems.

**When to use:**
- Debugging spans multiple components
- Fix in one place breaks another
- Behavior seems emergent or unexpected

### Theory of Constraints
Every system has exactly one constraint limiting throughput. Optimizing anything else is wasted effort. Based on Eliyahu Goldratt's work.

**When to use:**
- Performance optimization
- Process improvement
- Resource allocation
- Identifying bottlenecks

### Cynefin Framework
Classify problems by the relationship between cause and effect: Clear, Complicated, Complex, or Chaotic. Each domain requires a different approach.

**When to use:**
- Choosing methodologies
- Understanding why approaches fail
- Crisis management

### Jobs to Be Done
Customers don't buy products—they hire them to do jobs. Understanding the job unlocks innovation.

**When to use:**
- Product development
- Feature prioritization
- Understanding customer behavior

### Red Team Thinking
Attack your own plans before adversaries do. The best defense is knowing your weaknesses.

**When to use:**
- Security review
- Pre-launch preparation
- Plan stress-testing

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Adding New Skills

1. Create a new directory under `skills/` with the format `thinking-{name}`
2. Add a `SKILL.md` file with YAML frontmatter:
```yaml
---
name: thinking-your-skill-name
description: Brief description under 200 chars (used by Claude Code for skill matching)
---
```
3. Write comprehensive documentation with:
   - Overview and core principle
   - When to use decision flow
   - Step-by-step process
   - At least 2 practical examples
   - Reusable template
   - Verification checklist
   - Key questions

4. Validate your skill:
```bash
node scripts/validate-skills.js
```

## Keywords

`claude-code` `claude` `anthropic` `ai` `skills` `mental-models` `critical-thinking` `decision-making` `problem-solving` `systems-thinking` `first-principles` `bayesian-reasoning` `cognitive-bias` `strategic-thinking` `frameworks` `triz` `ooda` `pre-mortem` `socratic-method` `theory-of-constraints` `cynefin` `jobs-to-be-done` `red-team` `fermi-estimation`

## Related Resources

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Charlie Munger's Mental Models](https://fs.blog/mental-models/)
- [Thinking in Systems - Donella Meadows](https://www.chelseagreen.com/product/thinking-in-systems/)
- [Thinking, Fast and Slow - Daniel Kahneman](https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555)
- [The Goal - Eliyahu Goldratt](https://www.amazon.com/Goal-Process-Ongoing-Improvement/dp/0884271951)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Created by [TJ Boudreaux](https://github.com/tjboudreaux)

---

**Found this useful?** Give it a star and share with others who could benefit from better thinking frameworks in Claude Code.
```

## B. Existing quality framework
```markdown
# Thinking Skills Quality Framework

## Overview

This document defines the quality standards and improvement processes for thinking skills in this collection. Each skill should meet these criteria to maximize its effectiveness when used in Claude Code.

## Quality Dimensions

### 1. Structure Quality

**Required Elements:**
- [ ] YAML frontmatter with `name` and `description`
- [ ] H1 title matching the skill name
- [ ] Overview section explaining the model
- [ ] Core Principle callout
- [ ] "When to Use" section with scenarios
- [ ] Decision flow diagram
- [ ] Step-by-step process
- [ ] Practical examples with code blocks
- [ ] Template section
- [ ] Verification checklist
- [ ] Key questions section
- [ ] Attribution/wisdom quote

**Format Standards:**
- Markdown code blocks for examples and templates
- Tables for comparisons and matrices
- Consistent header hierarchy (H2 for main sections, H3 for subsections)
- Decision flows using ASCII art or markdown

### 2. Content Quality

**Clarity Criteria:**
- [ ] Core concept explained in 2-3 sentences
- [ ] Jargon defined or avoided
- [ ] Examples are realistic and relatable
- [ ] Steps are actionable (start with verbs)

**Completeness Criteria:**
- [ ] Covers when to use AND when not to use
- [ ] Addresses common mistakes/anti-patterns
- [ ] Provides multiple examples (minimum 2)
- [ ] Includes both simple and complex applications

**Accuracy Criteria:**
- [ ] Model correctly represents source material
- [ ] Attribution to original thinkers
- [ ] No misrepresentation of concepts

### 3. Pedagogical Quality

**Learning Progression:**
- [ ] Starts with why (motivation)
- [ ] Builds from simple to complex
- [ ] Provides scaffolding (templates, checklists)
- [ ] Enables self-verification

**Application Support:**
- [ ] Clear decision criteria for when to apply
- [ ] Step-by-step process that can be followed
- [ ] Fill-in-the-blank templates
- [ ] Verification checklist to confirm proper use

### 4. Integration Quality

**Claude Code Optimization:**
- [ ] Description is concise (<200 chars) for tool hints
- [ ] First paragraph is self-contained summary
- [ ] Works well when partially quoted
- [ ] Key information front-loaded

## Quality Scoring Rubric

### Score: 5 (Excellent)
- All required elements present
- Multiple high-quality examples
- Templates are immediately usable
- Clear decision guidance
- Proper attribution
- No ambiguity in process

### Score: 4 (Good)
- All required elements present
- At least 2 examples
- Usable template
- Clear when-to-use guidance
- Minor clarity improvements possible

### Score: 3 (Adequate)
- Most required elements present
- At least 1 example
- Template present but needs work
- When-to-use needs more specificity
- Some sections thin

### Score: 2 (Needs Work)
- Missing required elements
- Examples weak or absent
- No usable template
- Unclear when to apply
- Process hard to follow

### Score: 1 (Poor)
- Missing multiple required elements
- No practical examples
- No template
- Confusing or incomplete process
- Would not help a user

## Improvement Process

### Phase 1: Structural Validation
1. Run validation script to check required elements
2. Add missing sections
3. Fix formatting issues

### Phase 2: Content Enhancement
1. Review against source material
2. Add missing examples
3. Improve templates
4. Add anti-patterns

### Phase 3: Pedagogical Review
1. Test with fresh eyes (does it make sense?)
2. Follow the process yourself
3. Fill in the template
4. Identify confusion points

### Phase 4: Integration Testing
1. Test in Claude Code
2. Verify description works in tool selection
3. Test partial quotation scenarios
4. Optimize for AI consumption

## Best Practices from Research

### From Cognitive Science
- **Worked Examples**: Show complete worked examples, not just abstract steps
- **Self-Explanation**: Include prompts for the user to explain back
- **Dual Coding**: Use both text and diagrams/tables
- **Spacing**: Break content into digestible chunks
- **Testing Effect**: Checklists that require active engagement

### From Technical Writing
- **Inverted Pyramid**: Most important information first
- **Chunking**: 3-7 items per list/section
- **Parallelism**: Consistent structure across similar sections
- **Active Voice**: "Identify the constraint" not "The constraint should be identified"
- **Specificity**: "3 examples" not "several examples"

### From UX Design
- **Progressive Disclosure**: Basic usage first, advanced later
- **Error Prevention**: Warn about common mistakes upfront
- **Recognition over Recall**: Templates > blank pages
- **Flexibility**: Support different skill levels

### From AI/LLM Optimization
- **Front-Loading**: Key info in first 200 chars for description
- **Self-Contained Sections**: Each section should work if quoted alone
- **Explicit Structure**: Clear markers for AI to parse
- **Concrete over Abstract**: Examples > theory for AI application
```

## C. Full skill catalog (name: description)
- **thinking-archetypes**: Recognize Senge's Systems Archetypes to diagnose recurring organizational and technical problems, identify why fixes keep failing, and design interventions that address root structure.
- **thinking-bayesian**: Update beliefs systematically based on new evidence using probabilistic reasoning. Use when estimating probabilities, learning from data, or making decisions under uncertainty.
- **thinking-bounded-rationality**: Apply Herbert Simon's Bounded Rationality and satisficing to make good-enough decisions under real-world constraints. Use for design decisions under time pressure, recognizing cognitive limits, and setting appropriate stopping criteria.
- **thinking-circle-of-competence**: Know the boundaries of your expertise and operate within them. Use when evaluating opportunities, making decisions outside your domain, or assessing when to defer to experts.
- **thinking-cynefin**: Classify problems by complexity domain (clear, complicated, complex, chaotic) and match approach to domain. Use for choosing methodologies, problem framing, and process design.
- **thinking-debiasing**: Systematic checklist to identify and counteract cognitive biases in decision-making. Use before major decisions, when evaluating recommendations, or when stakes are high.
- **thinking-dual-process**: Apply Kahneman's Dual-Process Theory to recognize when to trust intuition vs engage deliberate analysis. Use for high-stakes decisions, error-prone contexts, or when balancing speed vs accuracy.
- **thinking-effectuation**: Start with means, not goals; co-create with partners; leverage contingencies. Use for startup strategy, innovation projects, and uncertain/novel domains where planning is unreliable.
- **thinking-feedback-loops**: Analyze systems using Donella Meadows' feedback loop framework to identify reinforcing loops, balancing loops, delays, and leverage points. Use for organizational dynamics, product growth design, debugging runaway or oscillating systems, and finding high-impact interventions.
- **thinking-fermi-estimation**: Make order-of-magnitude estimates for unknown quantities by decomposing into known or estimable factors. Use for capacity planning, cost estimation, market sizing, and technical feasibility assessment.
- **thinking-first-principles**: Break complex problems into fundamental truths by questioning assumptions and rebuilding from irreducible components. Use for innovation, challenging status quo, or when conventional solutions fail.
- **thinking-five-whys-plus**: Enhanced root cause analysis with explicit bias guards and stopping criteria. Use for incident post-mortems, bug investigations, and process failures where standard 5 Whys might mislead.
- **thinking-inversion**: Approach problems backward by identifying paths to failure, then systematically avoiding them. Use for risk identification, planning, and avoiding obvious mistakes.
- **thinking-jobs-to-be-done**: Understand what "job" users hire your product to do, focusing on progress users seek rather than features. Use for product development, feature prioritization, user research, and market positioning.
- **thinking-kepner-tregoe**: Systematic rational process for complex problem analysis, decision making, and risk assessment. Use for high-stakes engineering decisions, root cause analysis beyond 5 Whys, and multi-factor evaluations requiring structured criteria.
- **thinking-leverage-points**: Identify where small changes can have large effects using Donella Meadows' hierarchy of system intervention points. Use for strategic decisions, system optimization, and choosing where to focus engineering effort.
- **thinking-lindy-effect**: For non-perishable things, future life expectancy is proportional to current age. Use for technology selection, evaluating frameworks/libraries, and predicting tool longevity.
- **thinking-map-territory**: Recognize limits of mental models and diagrams. Use when models diverge from reality, debugging expectation mismatches, or questioning abstraction accuracy.
- **thinking-margin-of-safety**: Build in buffers for unknown unknowns and don't optimize to the edge. Use for capacity planning, deadline estimation, architecture design, and risk management.
- **thinking-model-combination**: Combine multiple mental models for richer analysis. Use for complex problems requiring multiple lenses, high-stakes decisions, or when single models leave blind spots.
- **thinking-model-router**: Route to the right mental model based on your domain and problem type. The single entry point for all thinking skills.
- **thinking-model-selection**: Choose the right mental model for the problem at hand. Use when facing new problems, when current approaches fail, or when you need to match tool to context.
- **thinking-occams-razor**: Apply parsimony principle to prefer simpler explanations with fewer assumptions. Use for hypothesis selection in debugging, architecture decisions, and choosing between competing approaches.
- **thinking-ooda**: Rapid decision-making loop for dynamic situations. Use for incident response, competitive scenarios, time-sensitive decisions, and situations requiring quick adaptation.
- **thinking-opportunity-cost**: Evaluate decisions by what you give up, not just what you gain. Use for resource allocation, prioritization, build vs. buy choices, and technical debt evaluation.
- **thinking-pre-mortem**: Imagine a project has failed and work backward to identify why. Use at project kickoffs, before major decisions, or when optimism may be obscuring risks.
- **thinking-probabilistic**: Express confidence in ranges, update predictions with new information, and track calibration over time. Use for project estimation, risk assessment, and decision making under uncertainty.
- **thinking-red-team**: Deliberately attack your own plans, systems, and assumptions to find weaknesses before adversaries or reality does. Use for security review, architecture validation, plan stress-testing, and pre-launch preparation.
- **thinking-regret-minimization**: Project to your future self and ask what you would regret not doing. Use for career decisions, strategic pivots, risk-taking choices, and life-changing decisions.
- **thinking-reversibility**: Classify decisions by reversibility and match decision process to decision type. Use for technology choices, architecture decisions, process changes, and hiring decisions.
- **thinking-scientific-method**: Hypothesis → Prediction → Test → Revise with explicit falsification. Use for debugging, feature experimentation, performance investigation, and A/B testing design.
- **thinking-second-order**: Think beyond immediate consequences to second and third-order effects. Use for strategic decisions, policy changes, and avoiding unintended consequences.
- **thinking-socratic**: Systematic questioning framework to deepen understanding, challenge assumptions, and uncover hidden beliefs. Use for requirements gathering, debugging, coaching, and critical analysis.
- **thinking-steel-manning**: Argue against the strongest version of opposing positions, not the weakest. Use for design reviews, evaluating alternatives, conflict resolution, and decision validation.
- **thinking-systems**: Analyze problems as interconnected systems with feedback loops, emergent behavior, and non-linear effects. Use for debugging complex systems, architecture decisions, and understanding unexpected behavior.
- **thinking-theory-of-constraints**: Identify and manage the bottleneck; improvements elsewhere don't matter until the constraint is addressed. Use for performance optimization, process improvement, and resource allocation.
- **thinking-thought-experiment**: Test ideas through hypothetical scenarios when empirical testing is impractical. Use for architecture evaluation, edge case analysis, ethics considerations, and strategy development.
- **thinking-triz**: Apply TRIZ (Theory of Inventive Problem Solving) methodology to resolve technical contradictions and find innovative solutions. Use for engineering design, breaking through impossible constraints, and systematic innovation.
- **thinking-via-negativa**: Improve by removal rather than addition. Focus on what to stop doing, eliminate the negative, and subtract complexity. Use for system simplification, process improvement, and feature prioritization.

## D. Six full skill files (exemplars + weak cases)
### thinking-debiasing
```markdown
---
name: thinking-debiasing
description: Systematic checklist to identify and counteract cognitive biases in decision-making. Use before major decisions, when evaluating recommendations, or when stakes are high.
---

# Cognitive Debiasing

## Overview
Based on Daniel Kahneman, Dan Lovallo, and Olivier Sibony's research, this skill provides a systematic checklist to identify cognitive biases that distort decisions. Awareness of biases alone doesn't prevent them—structured checklists and processes do.

**Core Principle:** Your brain is systematically wrong in predictable ways. Use checklists to catch errors your intuition will miss.

## When to Use
- Before making or approving major decisions
- Evaluating recommendations from others
- When stakes are high and errors costly
- When you feel very confident (overconfidence is a bias)
- During investment, hiring, or strategic decisions
- When a decision "feels right" but you can't articulate why

## System 1 vs System 2

| System 1 (Fast) | System 2 (Slow) |
|-----------------|-----------------|
| Automatic, effortless | Deliberate, effortful |
| Emotional, intuitive | Analytical, logical |
| Pattern-matching | Rule-following |
| Prone to biases | Can catch biases |
| Default mode | Requires activation |

**Goal:** Activate System 2 for important decisions using structured processes.

## The 12-Point Decision Quality Checklist

Before approving any significant recommendation, evaluate:

### Self-Interest Biases
**1. Is there self-interest at play?**
- Does the recommender benefit from this decision?
- Would they recommend the same if incentives were different?
- Are there conflicts of interest?

**2. Is there emotional attachment (affect heuristic)?**
- Has the team fallen in love with the proposal?
- Are they dismissing concerns too quickly?
- Is criticism being taken personally?

### Group Dynamics
**3. Has dissenting opinion been suppressed (groupthink)?**
- Were alternative views genuinely explored?
- Is there pressure to conform?
- Has a devil's advocate been assigned?

**4. Is there appropriate diversity of opinion?**
- Did independent thinkers contribute?
- Were estimates made independently before discussion?
- Has anyone with a different perspective reviewed this?

### Pattern Recognition Errors
**5. Are we over-relying on a single analogy (saliency bias)?**
- Is there one "this is just like X" dominating thinking?
- Have we sought disconfirming analogies?
- Are we cherry-picking the comparison?

**6. Are we anchored on an initial number?**
- Where did the first estimate come from?
- Would a different starting point change the conclusion?
- Have we re-estimated from scratch?

### Confirmation Bias
**7. Were credible alternatives seriously considered?**
- Did we explore at least 2-3 real alternatives?
- Were alternatives given fair evaluation?
- Or were they strawmen to justify the preferred option?

**8. Are we seeking confirming evidence only?**
- What evidence would disprove this thesis?
- Have we actively looked for disconfirming data?
- Are we explaining away contradictory evidence?

### Planning Fallacies
**9. Is the base case realistic?**
- Is this more optimistic than similar past projects?
- What's the base rate of success for similar efforts?
- Have we adjusted for "this time is different" thinking?

**10. Is the worst case bad enough?**
- Does worst case assume only one thing goes wrong?
- What if multiple risks materialize simultaneously?
- Have we considered tail risks?

**11. Are we discounting sunk costs appropriately?**
- Would we make this decision if starting fresh?
- Are we continuing because we've "invested too much"?
- What would an outsider with no history decide?

### Halo Effects
**12. Are we assuming success transfers?**
- Are we trusting this team/approach because of past wins?
- Were past successes in similar contexts?
- Are we attributing success to skill when luck played a role?

## Quick Debiasing Techniques

### For Anchoring
- Generate estimate BEFORE seeing others' numbers
- Ask: "What if the true number is 2x or 0.5x?"
- Use multiple independent estimators

### For Confirmation Bias
- Assign someone to argue the opposite position
- Ask: "What would make us wrong?"
- Seek out critics, not supporters

### For Overconfidence
- Widen confidence intervals (usually too narrow)
- Use reference class forecasting (base rates)
- Ask: "How often have similar predictions been right?"

### For Sunk Cost
- Ask: "Would we start this project today knowing what we know?"
- Ignore past investment when evaluating future returns
- Consider opportunity cost of continuing

### For Groupthink
- Collect independent opinions before discussion
- Assign devil's advocate role
- Make it safe to dissent

## Decision Quality Audit Template

```markdown
# Decision Quality Audit: [Decision Name]

## Recommendation Summary
[Brief description]

## Bias Checklist

### Self-Interest & Emotion
- [ ] Self-interest checked: [Notes]
- [ ] Emotional attachment assessed: [Notes]

### Group Dynamics  
- [ ] Dissent encouraged: [Notes]
- [ ] Independent input gathered: [Notes]

### Pattern Recognition
- [ ] Multiple analogies considered: [Notes]
- [ ] Anchoring effects checked: [Notes]

### Confirmation Bias
- [ ] Alternatives genuinely evaluated: [Notes]
- [ ] Disconfirming evidence sought: [Notes]

### Planning Realism
- [ ] Base case reality-checked: [Notes]
- [ ] Worst case severe enough: [Notes]
- [ ] Sunk costs ignored: [Notes]

### Halo Effects
- [ ] Success transfer questioned: [Notes]

## Red Flags Identified
[List any concerns from checklist]

## Mitigations
[How will identified biases be addressed?]

## Decision
- [ ] Proceed as recommended
- [ ] Proceed with modifications
- [ ] Requires more analysis
- [ ] Reject recommendation
```

## Verification Checklist
- [ ] Systematically evaluated all 12 bias categories
- [ ] Identified at least 2 potential biases affecting this decision
- [ ] Applied specific debiasing technique to each identified bias
- [ ] Sought independent/outside perspective
- [ ] Documented reasoning for future reference
- [ ] Comfortable defending decision process (not just outcome)

## Key Questions
- "What would have to be true for this to be wrong?"
- "How confident am I, and what's driving that confidence?"
- "What would an outsider with fresh eyes conclude?"
- "Am I reasoning toward a conclusion I already want?"
- "What's the base rate of success for decisions like this?"
- "If I'm wrong, how will I know, and when?"

## Kahneman's Warning
"We can be blind to the obvious, and we are also blind to our blindness."

You cannot debias through willpower alone. Use checklists, processes, and outside perspectives to catch what your intuition misses.
```

### thinking-first-principles
```markdown
---
name: thinking-first-principles
description: Break complex problems into fundamental truths by questioning assumptions and rebuilding from irreducible components. Use for innovation, challenging status quo, or when conventional solutions fail.
---

# First Principles Reasoning

## Overview
First principles thinking strips away assumptions and conventions to reveal fundamental truths, then reconstructs solutions from those basics. This approach, championed by Elon Musk and rooted in Aristotle's philosophy, enables breakthrough solutions by escaping the trap of reasoning by analogy.

**Core Principle:** Don't accept "that's how it's always done." Reduce to fundamentals, then rebuild.

## When to Use
- Conventional approaches have failed or seem inadequate
- You're told something is "impossible" or "too expensive"
- Designing new systems/products from scratch
- Challenging industry assumptions or pricing
- Problem seems intractable using existing mental models
- You need innovation rather than incremental improvement

Decision flow:
```
Problem intractable? → yes → Are you reasoning from analogy? → yes → APPLY FIRST PRINCIPLES
                                                            ↘ no → Already at fundamentals
                  ↘ no → Standard problem-solving may suffice
```

## The Process

### Step 1: Identify Current Assumptions
List everything you "know" or assume about the problem:
- What are the constraints everyone accepts?
- What costs/limitations are considered fixed?
- What's the conventional wisdom?
- Why do people say it can't be done?

```
Example: "Rocket launches cost $65M because that's what aerospace companies charge"
Assumptions: Must buy from existing suppliers, existing designs are optimal, 
             materials must be aerospace-grade, vertical integration is too hard
```

### Step 2: Break Down to Fundamentals
Ask repeatedly: "What are we absolutely certain is true?"

Decomposition questions:
- What are the physical/mathematical constraints?
- What are the raw inputs required?
- What laws of physics/economics apply?
- What would this cost if built from raw materials?
- What is the minimum viable version?

```
Example: Rocket raw materials (aluminum, titanium, copper, carbon fiber)
         = ~2% of typical rocket price
Fundamental truth: Materials aren't the cost driver; 
                   manufacturing/overhead/margins are
```

### Step 3: Challenge Each Assumption
For each assumption, ask:
- Is this actually true, or just convention?
- What evidence supports this?
- Under what conditions would this be false?
- Who benefits from this assumption persisting?

Use the "5 Whys" to drill deeper:
```
Why is it expensive? → Suppliers charge high margins
Why? → Limited competition
Why? → High barriers to entry
Why? → Assumption that you must use existing supply chain
Why? → Nobody questioned it
```

### Step 4: Rebuild from Fundamentals
Starting ONLY from verified truths:
- What's the simplest solution that satisfies fundamental requirements?
- What new approaches become possible without false constraints?
- How would you solve this if starting from scratch today?
- What would a solution look like with 10x less resources?

```
Example: Build rockets in-house using commodity materials
         = SpaceX reduced launch costs by 10x
```

### Step 5: Validate Against Reality
- Does your reconstructed solution violate any physics/laws?
- What practical constraints remain?
- What's the minimum viable test?
- How can you prove/disprove this quickly?

## Mental Traps to Avoid

| Trap | Description | Antidote |
|------|-------------|----------|
| Reasoning by Analogy | "Others do it this way" | Ask "but is it optimal?" |
| Appeal to Authority | "Experts say it's impossible" | "What specifically makes it impossible?" |
| Sunk Cost | "We've always done it this way" | "What if we started fresh today?" |
| Complexity Bias | Assuming complex = better | "What's the simplest version?" |
| False Constraints | Accepting artificial limits | "Is this a law of physics or convention?" |

## Application Examples

### Software Architecture
```
Assumption: "We need a microservices architecture"
First Principles:
- What problem are we solving? (scalability, team independence, deployment)
- What's the minimum that achieves this?
- A modular monolith might suffice for current scale
```

### Cost Reduction
```
Assumption: "This service costs $50k/month, that's just cloud pricing"
First Principles:
- What compute/storage do we actually need?
- What are we paying for that we don't use?
- Could we reduce by 80% with right-sizing?
```

### Feature Development
```
Assumption: "Users need feature X (because competitor has it)"
First Principles:
- What job is the user trying to accomplish?
- What's the simplest way to enable that job?
- Maybe a different approach solves it better
```

## Verification Checklist
- [ ] Listed all assumptions about the problem
- [ ] Identified which assumptions are physics/math vs convention
- [ ] Challenged at least 3 "obvious" constraints
- [ ] Rebuilt solution using only verified fundamentals
- [ ] Validated that solution doesn't violate actual constraints
- [ ] Identified minimum viable test to prove/disprove approach

## Combining with Other Models
- **Inversion**: After first principles, ask "what would make this fail?"
- **Second-Order Thinking**: Consider downstream effects of your new approach
- **Pre-Mortem**: Imagine your first-principles solution failed—why?

## Key Questions
- "What do we know to be absolutely true?"
- "Why does everyone assume this constraint exists?"
- "What would we do if we had to solve this with 10% of the budget?"
- "If we were starting from scratch today, would we build it this way?"
- "What would a complete outsider try?"
```

### thinking-second-order
```markdown
---
name: thinking-second-order
description: Think beyond immediate consequences to second and third-order effects. Use for strategic decisions, policy changes, and avoiding unintended consequences.
---

# Second-Order Thinking

## Overview
Second-order thinking, articulated by Howard Marks, moves beyond immediate effects to consider what happens next, and what that leads to. First-order thinking is simplistic ("This action solves the problem"); second-order thinking asks "And then what?" repeatedly.

**Core Principle:** The obvious answer to "What should I do?" is often wrong because it ignores downstream effects.

## When to Use
- Making strategic or architectural decisions
- Evaluating policy or process changes
- Considering incentive structures
- Planning features that change user behavior
- Decisions with long-term consequences
- When the "obvious" solution feels too easy

Decision flow:
```
Decision with consequences beyond immediate? → yes → APPLY SECOND-ORDER THINKING
                                            ↘ no → First-order may suffice
```

## First vs Second-Order Thinking

| Situation | First-Order | Second-Order |
|-----------|-------------|--------------|
| Team is slow | Add more engineers | More engineers → more coordination → slower decisions → may get slower |
| Users complain | Add the feature they request | Feature → complexity → more support load → less time for core work |
| Costs too high | Cut spending | Cuts → reduced quality → customer churn → revenue drop → worse situation |
| Bug in prod | Hotfix immediately | Hotfix → skip testing → more bugs → trust erosion → slower deployments |

## The Process

### Step 1: Identify the Decision and First-Order Effect
```
Decision: Add a feature flag system
First-order: Teams can ship features independently ✓
```

### Step 2: Ask "And Then What?"
Chain the consequences:
```
Feature flags → More flags created → Flag debt accumulates
             → Teams don't clean up → Combinatorial testing complexity
             → Bugs from flag interactions → "Turn it off" becomes risky
             → Flags become permanent → Codebase complexity explodes
```

### Step 3: Apply the 10/10/10 Framework
Evaluate impact across time horizons:

| Timeframe | Question | Analysis |
|-----------|----------|----------|
| 10 minutes | How will I feel right after? | Relief—problem solved |
| 10 months | How will this affect things in 10 months? | Flag sprawl emerging |
| 10 years | What's the long-term trajectory? | Technical debt crisis |

### Step 4: Consider Systemic Effects
Ask: "What if everyone did this?"
```
Decision: Skip code review for urgent fixes
If everyone: All urgent fixes skip review
Result: Definition of "urgent" expands → most things skip review
Outcome: Quality collapses, more urgent fixes needed
```

### Step 5: Map the Consequence Chain
```
┌─────────────────┐
│ Decision: X     │
└────────┬────────┘
         ▼
┌─────────────────┐
│ 1st Order: A    │ ← Obvious, intended
└────────┬────────┘
         ▼
┌─────────────────┐
│ 2nd Order: B    │ ← Less obvious
└────────┬────────┘
         ▼
┌─────────────────┐
│ 3rd Order: C    │ ← Often counterintuitive
└────────┬────────┘
         ▼
┌─────────────────┐
│ Feedback Loop   │ ← May reinforce or counteract
└─────────────────┘
```

## Common Second-Order Effects in Software

### Optimization
```
1st: Optimize critical path → Faster
2nd: Team focuses on optimization → Less feature work
3rd: Premature optimization spreads → Complexity increases
4th: Maintenance burden grows → Slower overall
```

### Hiring
```
1st: Hire senior engineers → More capacity
2nd: Salary expectations rise → Budget pressure
3rd: Junior engineers feel stuck → Attrition
4th: Knowledge concentrated in seniors → Bus factor risk
```

### Process Addition
```
1st: Add approval process → More oversight
2nd: Approvals create bottleneck → Slower delivery
3rd: People route around process → Shadow processes
4th: Formal process becomes theater → Worst of both worlds
```

### Technical Shortcuts
```
1st: Skip tests to ship faster → Feature delivered
2nd: Bugs emerge → Support load increases
3rd: Team fights fires → Less time for features
4th: More shortcuts taken → Quality death spiral
```

## Application Framework

For any significant decision, fill out:

```markdown
## Second-Order Analysis: [Decision]

### Immediate Effect (1st Order)
[What happens right away]

### Near-Term Consequences (2nd Order)
[What does the immediate effect cause? 1-3 months]

### Medium-Term Consequences (3rd Order)  
[What do the near-term effects cause? 3-12 months]

### Long-Term Trajectory
[Where does this path lead? 1+ years]

### Feedback Loops
[Does this create reinforcing or balancing dynamics?]

### If Scaled
[What happens if this becomes standard practice?]

### Revised Decision
[Given analysis, what should we actually do?]
```

## Questions to Surface Second-Order Effects
- "And then what?"
- "Who else is affected, and how will they respond?"
- "What incentives does this create?"
- "What behavior does this encourage/discourage?"
- "If this works, what problems does success create?"
- "What will we wish we had done differently in a year?"
- "What does this look like if everyone does it?"

## Verification Checklist
- [ ] Identified first-order effect clearly
- [ ] Asked "and then what?" at least 3 times
- [ ] Applied 10/10/10 framework
- [ ] Considered systemic/scaled effects
- [ ] Identified potential feedback loops
- [ ] Revised decision based on full consequence chain
- [ ] Documented reasoning for future reference

## Marks' Warning
"First-level thinking is simplistic and superficial, and just about everyone can do it. Second-level thinking is deep, complex, and convoluted."

The crowd uses first-order thinking. Competitive advantage comes from thinking one level deeper—seeing what happens after the obvious effect.
```

### thinking-systems
```markdown
---
name: thinking-systems
description: Analyze problems as interconnected systems with feedback loops, emergent behavior, and non-linear effects. Use for debugging complex systems, architecture decisions, and understanding unexpected behavior.
---

# Systems Thinking

## Overview
Systems thinking views problems as part of interconnected wholes rather than isolated components. It focuses on relationships, feedback loops, and emergent properties—behaviors that arise from interactions and can't be predicted from parts alone. Essential for debugging complex distributed systems and understanding why "obvious" fixes often fail.

**Core Principle:** The behavior of a system cannot be understood by analyzing components in isolation. Look at connections, feedback, and emergence.

## When to Use
- Debugging issues that span multiple services/components
- Understanding unexpected emergent behavior
- Designing resilient architectures
- Analyzing incidents and outages
- When fixing one thing breaks another
- Performance issues with non-obvious causes
- Organizational/process problems

Decision flow:
```
Problem spans multiple components?     → yes → APPLY SYSTEMS THINKING
Fix in one place caused issue in another? → yes → APPLY SYSTEMS THINKING
Behavior seems "emergent" or unexpected?  → yes → APPLY SYSTEMS THINKING
```

## Key Concepts

### 1. Feedback Loops

**Reinforcing (Positive) Loops:** Amplify change
```
Technical Debt Loop:
Deadline pressure → Shortcuts → More bugs → More firefighting 
                                           ↓
                            ← Less time for quality ←
```

**Balancing (Negative) Loops:** Counteract change
```
Auto-scaling Loop:
Load increases → More instances spawn → Load per instance decreases
                                       ↓
                    ← Fewer instances needed ←
```

**Questions to identify loops:**
- Does this effect feed back into its cause?
- Is this self-reinforcing or self-correcting?
- What keeps this system in equilibrium?

### 2. Stocks and Flows
**Stocks:** Accumulated quantities (users, technical debt, cache size)
**Flows:** Rates of change (registrations/day, bugs fixed/sprint)

```
┌─────────────────────────────────────┐
│  Inflow → [Stock] → Outflow         │
│                                     │
│  New bugs → [Bug Backlog] → Fixes   │
│  Requests → [Queue Depth] → Processed│
│  Hires → [Team Size] → Attrition    │
└─────────────────────────────────────┘
```

**Key insight:** Stocks change slowly even when flows change quickly. Queue depth doesn't drop instantly when you add capacity.

### 3. Delays
Time lags between cause and effect obscure relationships:
```
Code deployed → [Delay: Cache TTL] → Users see change
Feature shipped → [Delay: Adoption curve] → Metrics change  
New hire starts → [Delay: Ramp-up] → Productivity impact
```

**Danger:** Acting before feedback arrives leads to overcorrection.

### 4. Non-Linear Relationships
Small changes can have large effects (and vice versa):
```
Linear assumption: 2x traffic = 2x latency
Reality: Traffic crosses threshold → 10x latency (queue buildup)

Linear assumption: Adding engineer adds capacity
Reality: Communication overhead grows O(n²)
```

### 5. Emergent Properties
Behaviors that arise from interactions, not individual components:
- **Distributed system:** No single service is slow, but the system is slow (cascading delays)
- **Team dynamics:** No individual is toxic, but collaboration is toxic (incentive interactions)
- **Market behavior:** No actor intends a bubble, but bubble emerges

## Systems Debugging Process

### Step 1: Map the System
Draw components, connections, and data/control flows:
```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Client  │────▶│   API   │────▶│   DB    │
└─────────┘     └────┬────┘     └─────────┘
                     │
                     ▼
               ┌─────────┐
               │  Cache  │
               └─────────┘
```

### Step 2: Identify Feedback Loops
For each loop, determine:
- Is it reinforcing or balancing?
- What's the delay in the loop?
- What could make it unstable?

```
Retry Storm Loop (Reinforcing - Dangerous):
Service slow → Clients retry → More load → Service slower → More retries
```

### Step 3: Trace Upstream
Follow the symptom backward to find originating cause:
```
Symptom: High latency in Service C
→ Service C waiting on Service B
  → Service B waiting on Service A
    → Service A doing full table scan (ROOT CAUSE)
```

### Step 4: Look for Interactions
What happens when components interact under stress?
- Circuit breakers tripping
- Cascading timeouts
- Resource contention
- Thundering herd

### Step 5: Consider Time Dynamics
- When did this start?
- What changed recently (deploys, config, traffic)?
- Is it periodic? (Cron jobs, cache expiration, batch processes)
- Is it growing or stabilizing?

## Common System Patterns

### Cascading Failure
```
One component fails → Dependent components overload → They fail
                                                    ↓
                              ← More traffic to remaining ←
```
**Mitigation:** Circuit breakers, bulkheads, graceful degradation

### Thundering Herd
```
Cache expires → All requests hit backend simultaneously → Overload
```
**Mitigation:** Jittered expiration, cache warming, request coalescing

### Queue Backup
```
Processing rate < Arrival rate → Queue grows → Memory pressure → OOM
```
**Mitigation:** Backpressure, rate limiting, queue bounds

### Resource Contention
```
Multiple processes → Same resource → Lock contention → Serialization
                                                     ↓
                    Throughput collapses despite available CPU
```
**Mitigation:** Sharding, optimistic locking, resource isolation

## Causal Loop Diagram Template

```
┌──────────────────────────────────────────────────────────────┐
│                    System: [Name]                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│    ┌─────────┐                        ┌─────────┐           │
│    │ Factor  │──────(+)──────────────▶│ Factor  │           │
│    │    A    │                        │    B    │           │
│    └─────────┘                        └────┬────┘           │
│         ▲                                  │                │
│         │                                  │                │
│        (-)                                (+)               │
│         │                                  │                │
│         │         ┌─────────┐              │                │
│         └─────────│ Factor  │◀─────────────┘                │
│                   │    C    │                               │
│                   └─────────┘                               │
│                                                              │
│   Legend: (+) = same direction, (-) = opposite direction    │
│   Loop type: Reinforcing / Balancing                        │
└──────────────────────────────────────────────────────────────┘
```

## Leverage Points
Where small changes have large effects (Donella Meadows):

| Leverage | Example | Impact |
|----------|---------|--------|
| Parameters | Timeout values | Low |
| Buffer sizes | Queue limits | Low-Medium |
| Feedback loops | Add monitoring | Medium |
| Information flows | Make metrics visible | Medium-High |
| Rules | Change retry policy | High |
| Goals | Redefine SLOs | Very High |
| Paradigm | Rethink architecture | Transformational |

## Verification Checklist
- [ ] Mapped system components and connections
- [ ] Identified at least one feedback loop
- [ ] Traced symptom upstream to potential root causes
- [ ] Considered time delays in the system
- [ ] Looked for emergent/interaction effects
- [ ] Identified leverage points for intervention
- [ ] Considered unintended consequences of fix

## Key Questions
- "What feeds back into what?"
- "Where are the delays in this system?"
- "What happens when this scales 10x?"
- "What would an observer see vs. what's actually happening?"
- "If I fix this here, what breaks over there?"
- "What behavior emerges that no single component intends?"
- "Where is the smallest change with the largest effect?"

## Meadows' Reminder
"We can't control systems or figure them out. But we can dance with them."

Systems resist simple fixes. Effective intervention requires understanding the whole, finding leverage points, and accepting that you're influencing, not controlling.
```

### thinking-model-router
```markdown
---
name: thinking-model-router
description: Route to the right mental model based on your domain and problem type. The single entry point for all thinking skills.
---

# Model Router

## Overview

This is the **master routing skill** for all mental models. Instead of knowing 38 frameworks, start here. Identify your domain and problem type, and this skill points you to the right model(s). Think of it as the "which tool do I use?" guide.

**Core Principle:** Don't memorize models—memorize how to find the right one. Domain + Problem Type → Model.

## Quick Router

### Step 1: What's Your Domain?

| Domain | You're working on... |
|--------|---------------------|
| **Coding/Debugging** | Bugs, errors, performance issues, root cause |
| **Architecture** | System design, technical decisions, scalability |
| **Product** | Features, user needs, prioritization, roadmap |
| **Business Strategy** | Competition, growth, market, organization |
| **Personal Decisions** | Career, life choices, major commitments |
| **Abstract/Analytical** | Arguments, ideas, theories, pure reasoning |
| **Risk/Safety** | What could go wrong, preparation, resilience |
| **Innovation** | New ideas, breakthroughs, creative solutions |

### Step 2: What's Your Problem Type?

| Type | You need to... |
|------|----------------|
| **Diagnose** | Find root cause, understand why |
| **Decide** | Choose between options |
| **Understand** | Grasp how something works |
| **Create** | Generate new solutions |
| **Evaluate** | Judge quality or validity |
| **Predict** | Forecast outcomes |
| **Optimize** | Improve performance |

---

## Domain → Model Maps

### 🖥️ Coding & Debugging

```
PROBLEM                          → MODEL(S)
─────────────────────────────────────────────────────
Bug with unknown cause           → Scientific Method, 5 Whys Plus
Performance degradation          → Theory of Constraints, Systems Thinking
Spans multiple services          → Systems Thinking, Feedback Loops
Incident postmortem              → 5 Whys Plus, Systems Thinking
Flaky/intermittent behavior      → Scientific Method (hypothesis testing)
"It works on my machine"         → Map-Territory (model vs reality gap)
```

**Default for debugging:** Start with **5 Whys Plus**, escalate to **Systems Thinking** if it spans components.

---

### 🏗️ Architecture & Technical Decisions

```
PROBLEM                          → MODEL(S)
─────────────────────────────────────────────────────
Technology choice                → Lindy Effect, Reversibility
Build vs buy                     → Opportunity Cost, First Principles
Scalability design               → Systems Thinking, Leverage Points
Microservices vs monolith        → Cynefin, Reversibility
Database selection               → Lindy Effect, Theory of Constraints
API design tradeoffs             → TRIZ (resolve contradictions)
Should we rewrite?               → Second-Order, Opportunity Cost
```

**Default for architecture:** Start with **Reversibility** (is this Type 1 or Type 2?), then **Systems Thinking** for interconnections.

---

### 📦 Product & Feature Development

```
PROBLEM                          → MODEL(S)
─────────────────────────────────────────────────────
What should we build?            → Jobs to be Done
Feature prioritization           → Opportunity Cost, Theory of Constraints
Why aren't users engaging?       → Jobs to be Done, 5 Whys Plus
New product exploration          → Effectuation, First Principles
Should we pivot?                 → Regret Minimization, Reversibility
Product-market fit               → Jobs to be Done, Scientific Method
Roadmap planning                 → Theory of Constraints, Opportunity Cost
A/B test design                  → Scientific Method, Bayesian
```

**Default for product:** Start with **Jobs to be Done** (what job is the user hiring this for?).

---

### 📈 Business Strategy

```
PROBLEM                          → MODEL(S)
─────────────────────────────────────────────────────
Competitive analysis             → Red Team, Second-Order
Market entry                     → Cynefin, Effectuation
Growth strategy                  → Feedback Loops, Leverage Points
Organizational dysfunction       → Archetypes, Systems Thinking
Resource allocation              → Theory of Constraints, Opportunity Cost
Startup strategy                 → Effectuation, Margin of Safety
M&A evaluation                   → Pre-mortem, Steel-manning
Pricing decisions                → First Principles, Fermi Estimation
```

**Default for strategy:** Start with **Cynefin** (what domain is this problem in?), then match approach.

---

### 🧑 Personal & Career Decisions

```
PROBLEM                          → MODEL(S)
─────────────────────────────────────────────────────
Should I take this job?          → Regret Minimization, Reversibility
Career direction                 → Circle of Competence, Regret Minimization
Major life decision              → Regret Minimization, Pre-mortem
Learning what to learn           → Circle of Competence, Lindy Effect
Negotiation prep                 → Steel-manning, Red Team
Should I start a company?        → Effectuation, Margin of Safety, Pre-mortem
Time allocation                  → Opportunity Cost, Theory of Constraints
```

**Default for personal:** Start with **Regret Minimization** (what will 80-year-old you think?).

---

### 🧠 Abstract & Analytical Thinking

```
PROBLEM                          → MODEL(S)
─────────────────────────────────────────────────────
Evaluating an argument           → Steel-manning, Bayesian
Challenging assumptions          → First Principles, Socratic
Estimating unknowns              → Fermi Estimation, Probabilistic
Updating beliefs                 → Bayesian, Probabilistic
Exploring edge cases             → Thought Experiment, Inversion
Finding logical flaws            → Inversion, Steel-manning
Complex causation                → Systems Thinking, Feedback Loops
Philosophical questions          → Thought Experiment, First Principles
```

**Default for abstract:** Start with **Steel-manning** (argue the strongest opposing view first).

---

### ⚠️ Risk & Safety

```
PROBLEM                          → MODEL(S)
─────────────────────────────────────────────────────
What could go wrong?             → Pre-mortem, Red Team
Security review                  → Red Team, Inversion
Disaster preparation             → Pre-mortem, Margin of Safety
Avoiding catastrophic failure    → Margin of Safety, Via Negativa
Stress-testing plans             → Red Team, Pre-mortem
Probability of failure           → Probabilistic, Bayesian
Building resilience              → Via Negativa, Margin of Safety
```

**Default for risk:** Start with **Pre-mortem** (assume failure, explain why).

---

### 💡 Innovation & Creativity

```
PROBLEM                          → MODEL(S)
─────────────────────────────────────────────────────
Breakthrough needed              → First Principles, TRIZ
Stuck on contradictions          → TRIZ
Limited resources                → Effectuation, Via Negativa
Simplification                   → Via Negativa, Occam's Razor
Challenging "impossible"         → First Principles, TRIZ
New market creation              → Effectuation, Jobs to be Done
Removing complexity              → Via Negativa, Occam's Razor
```

**Default for innovation:** Start with **First Principles** (strip to fundamentals, rebuild).

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                    MENTAL MODEL QUICK ROUTER                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  "Why is this broken?"        → 5 Whys Plus, Scientific Method  │
│  "How does this system work?" → Systems Thinking, Feedback Loops│
│  "What should we build?"      → Jobs to be Done                 │
│  "Should I do this?"          → Reversibility, Regret Min       │
│  "What could go wrong?"       → Pre-mortem, Red Team            │
│  "How do I innovate?"         → First Principles, TRIZ          │
│  "What's the probability?"    → Bayesian, Probabilistic         │
│  "Where's the bottleneck?"    → Theory of Constraints           │
│  "What am I giving up?"       → Opportunity Cost                │
│  "Is this argument valid?"    → Steel-manning                   │
│  "Will this technology last?" → Lindy Effect                    │
│  "How complex is this?"       → Cynefin                         │
│  "What to remove?"            → Via Negativa                    │
│  "Is this safe enough?"       → Margin of Safety                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Decision Flow

```
START HERE
    │
    ▼
┌─────────────────────┐
│ What's your domain? │
└──────────┬──────────┘
           │
     ┌─────┴─────┬──────────┬──────────┬──────────┐
     ▼           ▼          ▼          ▼          ▼
  Coding    Architecture  Product   Strategy   Personal
     │           │          │          │          │
     ▼           ▼          ▼          ▼          ▼
┌─────────────────────┐
│ What problem type?  │
│ Diagnose/Decide/    │
│ Understand/Create/  │
│ Evaluate/Predict    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Look up in domain   │
│ table above         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Single model enough?│
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
   YES           NO
    │             │
    ▼             ▼
 Apply it    Use Model Combination
             (Sequential/Parallel/Nested)
```

## Model Inventory by Category

### Diagnostic Models (Find root cause)
- `5 Whys Plus` - Iterative "why" with bias guards
- `Scientific Method` - Hypothesis → Test → Learn
- `Kepner-Tregoe` - Systematic problem/decision analysis

### Decision Models (Choose wisely)
- `Reversibility` - Type 1 vs Type 2 decisions
- `Regret Minimization` - What will future-you think?
- `Opportunity Cost` - What are you giving up?
- `Bayesian` - Update beliefs with evidence
- `Probabilistic` - Calibrated probability estimates

### Systems Models (Understand interconnections)
- `Systems Thinking` - Feedback, emergence, non-linearity
- `Feedback Loops` - Reinforcing and balancing loops
- `Theory of Constraints` - Find and exploit the bottleneck
- `Leverage Points` - Where small changes have big effects
- `Archetypes` - Recurring system patterns

### Risk Models (Prepare for failure)
- `Pre-mortem` - Assume failure, explain why
- `Red Team` - Attack your own plan
- `Margin of Safety` - Build in buffers
- `Inversion` - Identify paths to failure, avoid them

### Innovation Models (Create breakthroughs)
- `First Principles` - Strip to fundamentals, rebuild
- `TRIZ` - Resolve technical contradictions
- `Effectuation` - Start with means, not goals
- `Via Negativa` - Improve by removing

### Evaluation Models (Judge quality)
- `Steel-manning` - Argue strongest opposing view
- `Lindy Effect` - Older = likely to last longer
- `Circle of Competence` - Know your expertise boundaries
- `Occam's Razor` - Prefer simpler explanations

### Context Models (Match approach to situation)
- `Cynefin` - Clear/Complicated/Complex/Chaotic domains
- `Model Selection` - Choose the right model
- `Model Combination` - Use multiple models together

### Product Models (Build the right thing)
- `Jobs to be Done` - What job is user hiring this for?
- `Thought Experiment` - Structured imagination

### Estimation Models (Size unknowns)
- `Fermi Estimation` - Order-of-magnitude calculations

## When to Combine Models

Use **Model Combination** when:

| Situation | Combination Pattern | Example |
|-----------|--------------------| --------|
| High-stakes decision | Sequential | Reversibility → Pre-mortem → Opportunity Cost |
| System diagnosis | Nested | Cynefin (macro) → ToC (meso) → OODA (micro) |
| Validating strategy | Parallel | Red Team + Steel-manning + Second-Order |
| Innovation under constraints | Sequential | First Principles → TRIZ → Effectuation |
| Career decision | Temporal | 5 Whys (past) → Circle of Competence (present) → Regret Min (future) |

## Template

```markdown
# Model Router Analysis

## Context
Domain: [Coding/Architecture/Product/Strategy/Personal/Abstract/Risk/Innovation]
Problem: [Brief description]
Problem Type: [Diagnose/Decide/Understand/Create/Evaluate/Predict/Optimize]

## Routed Models
Primary: [Main model to use]
Secondary: [If needed]
Combination pattern: [Sequential/Parallel/Nested/None]

## Application
[Apply the selected model(s) here]

## Verification
- [ ] Domain correctly identified
- [ ] Problem type matches
- [ ] Model fits the situation
- [ ] Considered if combination needed
```

## Key Questions

- "What domain am I operating in?"
- "What type of problem is this—diagnose, decide, understand, create, or evaluate?"
- "What's the default model for this domain + type?"
- "Does one model cover it, or do I need to combine?"
- "Am I using a model because it fits, or because it's familiar?"

---

**Remember:** You don't need to know all 38 models. You need to know how to find the right one. Start with domain, identify problem type, look it up, apply. That's it.
```

### thinking-five-whys-plus
```markdown
---
name: thinking-five-whys-plus
description: Enhanced root cause analysis with explicit bias guards and stopping criteria. Use for incident post-mortems, bug investigations, and process failures where standard 5 Whys might mislead.
---

# Five Whys Plus

## Overview

The Five Whys technique from Toyota Production System is powerful but often misapplied. This enhanced version adds explicit guards against common failures: premature stopping, single-cause bias, blame-oriented thinking, and confirmation bias. It transforms a simple technique into a rigorous root cause methodology.

**Core Principle:** Keep asking "why" until you reach actionable root causes, but guard against the technique's known failure modes.

## When to Use

- Incident post-mortems
- Bug investigations
- Process failures
- Customer complaints
- Recurring problems
- Any situation where you need root cause, not just proximate cause

Decision flow:

```
Problem occurred?
  → Is the cause obvious and verified? → yes → Fix directly
  → Need to find root cause? → yes → APPLY FIVE WHYS PLUS
  → Is this a complex multi-factor problem? → yes → Consider Kepner-Tregoe PA
```

## Standard Five Whys Failure Modes

| Failure Mode | Description | Guard |
|--------------|-------------|-------|
| Premature stopping | Accepting first plausible cause | Minimum depth + actionability test |
| Single-cause bias | Assuming one root cause | Branch on "what else?" |
| Blame orientation | Stopping at human error | "Why was error possible?" |
| Confirmation bias | Finding expected cause | Devil's advocate review |
| Circular reasoning | Why loops back on itself | Detect and break cycles |
| Speculation depth | Going beyond evidence | Evidence requirement |

## The Five Whys Plus Process

### Step 1: State the Problem Precisely

Bad: "The system was slow"
Good: "API response times exceeded 2 seconds for 30% of requests between 14:00-14:45 UTC on January 15"

```markdown
Problem Statement:
- What happened: [Specific observable symptom]
- When: [Time range]
- Where: [Affected systems/users]
- Extent: [Scope and severity]
- Impact: [Business/user impact]
```

### Step 2: Apply "Why" with Evidence Requirement

For each "why," require evidence:

```markdown
Why #1: Why did [problem] occur?
Answer: [Hypothesis]
Evidence: [Data, logs, metrics that support this]
Confidence: [High/Medium/Low]
```

**Evidence types:**
- Logs showing the event
- Metrics correlating with timeline
- Code showing the behavior
- Configuration proving the state
- Testimony from multiple sources

### Step 3: Branch on "What Else?"

After each "why," explicitly ask "what else could cause this?"

```markdown
Why #1: Why did API response times spike?
Primary answer: Database queries were slow
Evidence: DB query times increased from 50ms to 1.5s

What else could cause this?
- [ ] Network latency (checked: normal)
- [ ] Application code changes (checked: none deployed)
- [ ] Memory pressure (checked: normal)
- [ ] External API dependencies (checked: normal)

→ Proceeding with database queries as verified cause
```

### Step 4: Apply "Why Was This Possible?" for Human Error

Never stop at "human error" or "someone made a mistake."

```
BAD chain:
Why did the outage occur? → Config was wrong
Why was config wrong? → Engineer made a typo
→ STOP (blames human)

GOOD chain:
Why did the outage occur? → Config was wrong
Why was config wrong? → Engineer made a typo
Why was a typo possible? → No validation on config changes
Why was there no validation? → Config system doesn't support schemas
Why doesn't it support schemas? → Tech debt, never prioritized
→ ROOT CAUSE: Config validation infrastructure gap
```

### Step 5: Check Stopping Criteria

Only stop when ALL are true:

| Criterion | Question | ✓ |
|-----------|----------|---|
| Actionable | Can we take concrete action on this cause? | |
| Controllable | Is this within our control to fix? | |
| Fundamental | Would fixing this prevent recurrence? | |
| Evidenced | Do we have evidence, not just speculation? | |
| Not-blame | Is this a system issue, not just "someone messed up"? | |

### Step 6: Verify with Counter-Analysis

Before finalizing, apply devil's advocate:

```markdown
Proposed root cause: [X]

Counter-analysis:
1. What evidence contradicts this conclusion?
2. What other explanation fits the evidence?
3. Would someone with a different perspective agree?
4. If we fix X, are we confident the problem won't recur?
5. Are we finding what we expected to find? (confirmation bias check)
```

## Enhanced Template

```markdown
# Five Whys Plus Analysis

## Problem Statement
- **What:** [Specific symptom]
- **When:** [Time range]
- **Where:** [Affected scope]
- **Impact:** [Severity and consequences]

## Why Chain

### Why #1: Why did [problem] occur?
**Answer:**
**Evidence:**
**Confidence:** High / Medium / Low
**What else considered:**
**Ruled out because:**

### Why #2: Why did [answer #1] occur?
**Answer:**
**Evidence:**
**Confidence:**
**What else considered:**
**Ruled out because:**

### Why #3: Why did [answer #2] occur?
**Answer:**
**Evidence:**
**Confidence:**
**What else considered:**
**Ruled out because:**

[Continue as needed...]

## Stopping Criteria Check
- [ ] Actionable: We can take concrete action
- [ ] Controllable: Within our control
- [ ] Fundamental: Prevents recurrence
- [ ] Evidenced: Supported by data
- [ ] System-focused: Not blaming individuals

## Counter-Analysis
**Contradicting evidence:**
**Alternative explanations:**
**Confirmation bias check:**
**Confidence in conclusion:**

## Root Causes Identified
1. [Primary root cause]
2. [Contributing factor if applicable]

## Recommended Actions
| Action | Addresses | Owner | Timeline |
|--------|-----------|-------|----------|
| | | | |

## Verification Plan
How will we know the fix worked?
```

## Example: Production Outage

```markdown
# Five Whys Plus: Payment Service Outage

## Problem Statement
- What: Payment service returned 500 errors
- When: 2024-01-15 14:00-14:45 UTC
- Where: Production, US-East region
- Impact: 2,400 failed transactions, ~$180K revenue impact

## Why Chain

### Why #1: Why did payment service return 500 errors?
**Answer:** Database connection pool exhausted
**Evidence:** Connection pool metrics showed 100/100 in use, logs show "connection wait timeout"
**Confidence:** High
**What else considered:**
- Application bugs (no recent deploys)
- Memory issues (heap normal)
- Network problems (latency normal)

### Why #2: Why was connection pool exhausted?
**Answer:** Queries taking 10x longer than normal
**Evidence:** P99 query time went from 50ms to 500ms at 14:00
**Confidence:** High
**What else considered:**
- Connection leak (connection count stable before incident)
- Sudden traffic spike (traffic was normal)

### Why #3: Why were queries taking 10x longer?
**Answer:** Missing index on payment_status table
**Evidence:** EXPLAIN shows sequential scan on 10M row table
**Confidence:** High
**What else considered:**
- Lock contention (no blocking locks)
- DB resource exhaustion (CPU/memory normal)

### Why #4: Why was the index missing?
**Answer:** Migration to add index was rolled back 2 weeks ago
**Evidence:** Deployment logs show rollback on 2024-01-01
**Confidence:** High

### Why #5: Why was the migration rolled back?
**Answer:** Migration timed out during deploy window
**Evidence:** Deploy log shows "migration timeout after 30 minutes"

### Why #6: Why did migration timeout?
**Answer:** Table too large for online migration in current window
**Evidence:** Table has 10M rows, online migration takes ~2 hours
**Confidence:** High

### Why #7 (System-level): Why wasn't this caught before impact?
**Answer:** No alerting on query performance degradation
**Evidence:** No alerts fired until connection pool exhausted

## Stopping Criteria Check
- [x] Actionable: Can add index, fix alerting
- [x] Controllable: Within our control
- [x] Fundamental: Index prevents query issue, alerting prevents impact
- [x] Evidenced: All steps have supporting data
- [x] System-focused: Process and tooling issues, not blame

## Root Causes Identified
1. **Primary:** Index migration process doesn't handle large tables
2. **Contributing:** No alerting on query latency before connection exhaustion

## Recommended Actions
| Action | Addresses | Owner | Timeline |
|--------|-----------|-------|----------|
| Implement online index creation tool | Root cause 1 | Platform | 2 weeks |
| Add query latency alerting | Root cause 2 | SRE | 1 week |
| Create index during maintenance window | Immediate fix | DBA | Tonight |
```

## Common Patterns to Catch

### The Blame Stop

```
BAD: "Why did it fail?" → "Engineer didn't test properly" → STOP

BETTER: → "Why was it possible to deploy without proper testing?"
        → "Why doesn't the pipeline enforce testing?"
        → System/process root cause
```

### The Premature Technical Stop

```
BAD: "Why was it slow?" → "Query was inefficient" → STOP

BETTER: → "Why was an inefficient query in production?"
        → "Why didn't code review catch it?"
        → "Why don't we have query performance testing?"
```

### The Circular Why

```
DETECT: "Why A?" → "Because B" → "Why B?" → "Because A"

BREAK: Introduce external evidence or third factor
```

### The Speculation Dive

```
DETECT: Answers become increasingly speculative without evidence

BREAK: "What evidence do we have for this?"
       If none, mark as hypothesis and seek evidence
```

## Verification Checklist

- [ ] Problem stated with specific details (what, when, where, extent)
- [ ] Each "why" has supporting evidence
- [ ] "What else?" asked at each branch point
- [ ] Didn't stop at human error—asked "why was error possible?"
- [ ] Stopping criteria all satisfied
- [ ] Counter-analysis performed
- [ ] Root cause is actionable and controllable
- [ ] Actions address root cause, not just symptoms

## Key Questions

- "What evidence supports this answer?"
- "What else could explain this?"
- "Why was this mistake/error/failure possible?"
- "If we stop here, will the problem actually be prevented?"
- "Are we finding what we expected, or what the evidence shows?"
- "Would someone outside our team reach the same conclusion?"

## Ohno's Wisdom (Extended)

Taiichi Ohno said: "By asking 'why' five times and answering each time, we can get to the real cause of the problem."

The extension: Five is not magic. The real guidance is:
1. Keep asking until you reach something actionable
2. But don't speculate past your evidence
3. And never stop at human blame

The technique is simple. Applying it well requires discipline.
```

## E. Our own deep evaluation (for you to challenge)
```markdown
# Deep Evaluation — cc-thinking-skills

A holistic assessment of the 39-skill thinking-skills collection: what it is, where it's strong, and the structural gaps that motivated building a behavioral eval harness. Empirical per-skill numbers live in `evals/results/<run>/scorecard.md`; cross-model critique lives in `analysis/ADVERSARIAL-SYNTHESIS.md`. This doc is the qualitative spine that ties them together.

## What the collection is

39 single-file `SKILL.md` mental models packaged as a Claude Code plugin marketplace: 36 leaf models (first-principles, inversion, Cynefin, OODA, Bayesian, …) + 3 meta-skills (`thinking-model-router`, `-model-selection`, `-model-combination`). Each follows a strong, consistent template (Overview → Core Principle → When to Use → Process → Examples → Verification Checklist → Key Questions → attribution). The content is, on the whole, **well-written and faithful** to source material — the Tier 1 judge gave fidelity scores of 4–5 on the skills sampled. This is a mature, thoughtfully curated collection, not a dump.

## Central finding: "quality" today measures headers, not reasoning

The only quality signal in the repo is `scripts/validate-skills.js`, an 18-point **structural** checker (does the file contain `## Overview`, `**Core Principle:**`, ≥3 tables, ≥3 `- [ ]` items, an ASCII arrow diagram, etc.). It reports **90% overall** — but that number measures *header conformance*, not whether a skill makes an agent reason better.

**Evidence (Tier 0, `evals/run-structural.js`):** a substance-aware re-scoring of the same files shows the strict checker systematically *undercounts content-rich skills*:

| Skill | Strict | Substance-aware | Why strict undercounts |
|---|---|---|---|
| `thinking-debiasing` | 72% | 83% | Marked "missing Anti-patterns" — though the skill *is* a 12-point bias checklist. No numbered "Step N" header and no arrow diagram. |
| `thinking-second-order` | 78% | 92% | Penalized for header/format, not content (Tier 1 rated it 4.6/5). |
| `thinking-socratic` | 78% | 92% | Same — strong content, non-conforming layout. |

The strict score's failures are **format false-negatives**, and — more dangerously — it is silent on the things that actually matter: is the model represented faithfully? would it change a decision? does it tell the agent when *not* to use it? A skill can score 100% structurally and still be reasoning-neutral or actively misleading. That gap is the entire reason for Tiers 1–3.

## The substance signal the lint can't see (Tier 1 rubric)

LLM-graded rubric scoring (fidelity / applicability / actionability / discrimination / discoverability) surfaces issues invisible to regex. From the pilot:
- `thinking-debiasing`: fidelity **5**, but actionability **2** — "entirely abstract, no software examples, poor boundaries against overuse."
- `thinking-first-principles`: flagged **potentially misleading** — "encouraging an AI agent to 'challenge industry assumptions' without strict boundaries can cause it to waste compute reinventing standard, secure solutions (rolling custom auth/routers)."

This points at the **single most important systemic weakness** below.

## Systemic weakness: missing "when NOT to use" boundaries → over-application risk

Across the collection, the weakest rubric dimension is **discrimination** — boundaries, failure modes, and "when not to use." Only ~12/39 skills document anti-patterns at all. For a *human* reader this is a minor gap. For an **autonomous agent** that auto-loads a skill, it is a real hazard: a skill with no boundaries invites over-application — running a 12-point debiasing audit on a trivial reversible choice, "challenging assumptions" into reinventing auth, applying systems-thinking ceremony to a one-line fix. The skills optimize for "here's how to apply me" and under-invest in "here's when applying me is wrong." This is the highest-leverage improvement theme and a likely cross-model consensus.

## Coverage & redundancy

Mapped across domain (coding/architecture/product/strategy/personal/risk/innovation) × problem-type (diagnose/decide/understand/create/evaluate/predict/optimize), coverage is broad and the *diagnose* and *decide* cells are well-served. Redundancy concentrates in **five overlap clusters** (see `USE-CASES.md` for triggers):

1. **Root-cause:** `five-whys-plus` / `scientific-method` / `kepner-tregoe` — descriptions reference each other; any "find the root cause" prompt fits all three. **Highest risk.**
2. **Systems-dynamics:** `systems` / `feedback-loops` / `archetypes`.
3. **Attack-the-plan:** `inversion` / `pre-mortem` / `red-team`.
4. **Belief-update:** `bayesian` / `probabilistic`.
5. **Meta:** `model-router` / `model-selection` / `model-combination` (entangled by design; `model-selection` also overlaps `cynefin`).

These are not necessarily *duplicates* — each has a defensible distinct stance — but their **descriptions don't encode the distinction**, so a router can't pick between them from a natural prompt. They are the consolidation-or-sharpen candidates.

## Discoverability (the description field drives auto-invocation)

Claude Code matches skills primarily on the `description:` frontmatter, so description quality *is* discoverability. Two concrete problems:

- **8 descriptions exceed the 200-char budget** (`feedback-loops` 276, `kepner-tregoe` 233, `bounded-rationality` 236, `triz` 223, `red-team` 214, `leverage-points` 213, `systems` 204, `fermi-estimation` 201). Overlong descriptions dilute the trigger signal.
- **Framework-named, not situation-named.** Descriptions tend to describe the *model* ("apply Donella Meadows' feedback loop framework") rather than the *situation that should trigger it* ("when a system runs away, stalls, or oscillates despite effort"). Situation-named descriptions are what make a skill fire at the right moment — see the trigger-phrase guidance in `USE-CASES.md`.

Tier 2 (routing accuracy, with negatives and the five overlap clusters as ambiguous cases) quantifies this; the full-run numbers are in the scorecard.

## Router quality

`thinking-model-router` is well-conceived — a domain × problem-type matrix plus a model inventory — and is the right architecture for 39 skills. Risks: (a) it is a manually-maintained matrix that must be updated whenever skills are added (it already lags the current 39); (b) it inventories models but is thin on *examples* and has no "when not to route / just answer directly" guidance; (c) it overlaps the other two meta-skills. It is a hub worth keeping, but it needs the same boundary/triggers discipline as the leaves.

## Why behavioral evals, and what the harness measures

Structural and rubric scores grade the *artifact*. They cannot answer the question the user actually cares about — **does the skill make Claude reason better?** Only an outcome test can. The harness (`evals/`) therefore layers four tiers:

- **Tier 0 — structural lint** (free): header/format conformance + the substance-aware re-score above. A fast pre-filter, not a quality verdict.
- **Tier 1 — reasoning-quality rubric** (LLM-graded): content fidelity/applicability/actionability/discrimination/discoverability, with a "would mislead an agent" flag.
- **Tier 2 — invocation/routing accuracy**: does the right skill fire from a natural prompt, and correctly *not* fire on routine requests (negatives)? Tests the description fields and the overlap clusters.
- **Tier 3 — behavioral A/B lift** (headline): Claude solves 108 realistic, jargon-free problems with vs without each skill; a cross-family judge does a blind pairwise comparison. A skill that can't beat baseline is flagged **"unproven — does it earn its place?"**

The behavioral problems are designed so naive reasoning falls into a named failure mode the skill is meant to prevent (e.g. the self-merge-PR policy that looks like a win but erodes review culture). This is the first evidence in the repo's history about whether the skills *work*, not just whether they're well-formatted.

## Bottom line

A genuinely strong, faithful collection sitting on a quality signal that can't see its real strengths *or* its real weaknesses. The three highest-leverage themes — independent of the empirical numbers — are: **(1)** add "when NOT to use" boundaries everywhere to curb agent over-application; **(2)** sharpen descriptions to be situation-named and within budget, and disambiguate the five overlap clusters; **(3)** adopt outcome-based evals (this harness) as the quality gate instead of header conformance. The empirical scorecard and the adversarial synthesis test and prioritize these.
```

## F. Use-case research
```markdown
# Thinking Skills — Use-Case Research

For each of the 39 skills: the **job** it does, the **single best trigger** scenario in software/product/decision work, and **overlap notes**. Compiled from a full read of every `SKILL.md` plus research on how mental-model frameworks map to engineering and agentic workflows. This is the source material for the routing dataset (Tier 2) and the behavioral problems (Tier 3).

## How to read this

A thinking skill earns its place only if there is a **realistic moment** where a capable agent, reasoning naively, would make a specific mistake that the skill prevents. Each entry names that moment. Where two skills share the same moment, they are flagged as an **overlap cluster** — these are the discoverability risks (Tier 2) and the consolidation candidates.

---

## Decision-making & analysis

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-first-principles` | Strip a problem to fundamentals instead of reasoning by analogy. | A cost/constraint is asserted as fixed ("the vendor floor is $X", "we have to use Elasticsearch") and the real requirement is smaller than the assumed solution. |
| `thinking-second-order` | Trace "and then what?" past the immediate effect to downstream incentives. | A policy/incentive change that looks like an obvious win (self-merge PRs, fee waiver, raise alert thresholds) but reshapes behavior over months. |
| `thinking-inversion` | List ways to guarantee failure, then design against them. | Planning a high-stakes execution (data migration, public API launch) where optimism hides silent catastrophic paths. |
| `thinking-pre-mortem` | Assume the project already failed; work backward to surface risks a confident team won't volunteer. | Pre-launch / kickoff while the team is euphoric (checkout rewrite, first enterprise deal). |
| `thinking-kepner-tregoe` | Structured triage / root-cause / decision / risk analysis separating fact from speculation. | An incident with several competing theories, or a multi-criteria tech selection needing defensible weighting. |
| `thinking-reversibility` | Classify a decision one-way vs two-way door; match process weight to it. | A decision being over-analyzed (or dangerously rushed) relative to how hard it is to undo. |
| `thinking-regret-minimization` | Project to the long-horizon self; weigh inaction regret vs short-term fear. | A career/conviction decision where near-term downside is suppressing something the person clearly wants. |
| `thinking-opportunity-cost` | Price the best foregone alternative, not just the chosen path's value. | A "build it ourselves / it's free" or "say yes to this big thing" choice that consumes scarce engineer-time. |
| `thinking-occams-razor` | Prefer the fewest-assumption explanation and test it first. | A regression right after a small change where the team gravitates to an elaborate multi-condition theory over the obvious recent diff. |

## Cognitive & behavioral

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-bayesian` | Update a belief by weighing evidence against the base rate. | Interpreting a positive test/alert/metric (fraud flag, A/B lift) where a low base rate should dominate the conclusion. |
| `thinking-debiasing` | Run a structured checklist to catch predictable cognitive errors before a high-stakes call. | Signing off on a major proposal pushed by an authority figure with a polished plan and team enthusiasm. |
| `thinking-dual-process` | Decide when to trust a fast gut answer vs force deliberate analysis. | A confident first-instinct decision in a high-stakes or unfamiliar domain (incident rollback, security PR). |
| `thinking-bounded-rationality` | Set a "good enough" threshold and a stopping rule. | Tool selection / low-impact fixes / MVP scoping under a deadline where analysis would spiral. |
| `thinking-socratic` | Interrogate a request before acting on its stated framing. | Requirements gathering where a stakeholder hands you a solution ("build X") instead of the problem. |
| `thinking-probabilistic` | Express estimates as base-rate-anchored ranges tied to decisions. | Committing a delivery date or risk assessment that must drive staffing/rollout. |
| `thinking-steel-manning` | Argue the strongest version of an opposing view before rejecting it. | About to reject a teammate's proposal or validate your own decision. |
| `thinking-map-territory` | Distrust representations (metrics, diagrams, green tests) and verify against reality. | A clean metric/benchmark/diagram is about to drive a big decision (board narrative, capacity plan, "can't reproduce"). |
| `thinking-circle-of-competence` | Honestly bound expertise; defer or limit exposure outside it. | A confident decision in an adjacent/unfamiliar domain (compliance, ML vendor eval) where competence is assumed to transfer. |

## Systems & strategy

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-systems` | See a problem as an interconnected whole (loops, delays, emergence). | A fix in one place breaks something elsewhere or worsens the original symptom (retry/timeout tuning → cascade). |
| `thinking-feedback-loops` | Identify reinforcing vs balancing loops and delays to explain growth/collapse/oscillation. | A system stuck flat, running away, or swinging despite repeated effort. |
| `thinking-archetypes` | Match a recurring org/tech dysfunction to a known structural pattern. | "We keep fixing this and it keeps coming back," or growth that mysteriously starves. |
| `thinking-ooda` | Drive fast observe-orient-decide-act cycles under time pressure. | Live incident response or a fast competitive move demanding action before full certainty. |
| `thinking-leverage-points` | Rank interventions by Meadows' hierarchy (parameters → rules → goals → paradigm). | Incremental tweaks (cost trims, more QA) that never stick — find the higher-leverage change. |
| `thinking-theory-of-constraints` | Find the single throughput bottleneck; exploit and subordinate to it. | Optimizing performance/delivery where effort is being spread across non-constraints. |
| `thinking-cynefin` | Classify a problem's domain and match the method to it. | Choosing how much to plan vs experiment vs act (over-analyzing the emergent, experimenting in a crisis). |
| `thinking-scientific-method` | Force falsifiable hypotheses and discriminating tests over confirmation. | Debugging/rollout amid multiple simultaneous changes, or shipping a redesign with no control. |
| `thinking-five-whys-plus` | Rigorous root-cause analysis guarding against premature stop and single-cause bias. | Incident post-mortems and recurring bugs that keep getting "fixed" but return. |

## Problem-solving & innovation

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-triz` | Dissolve "impossible" trade-offs by separating conflicting requirements or reusing resources. | A team deadlocked on "fast OR accurate / small OR large" for a system constraint. |
| `thinking-thought-experiment` | Stress-test a design by tracing concrete scenarios mentally before building. | Evaluating a one-way-door architecture (billing ledger, real-time sync) needing confidence beyond the happy path. |
| `thinking-margin-of-safety` | Add buffers sized to uncertainty and stakes. | Capacity provisioning / deadline commitments / tight configs on a critical path. |
| `thinking-lindy-effect` | Weight longevity decisions toward proven, time-tested options. | Choosing a long-lived datastore/framework where hype competes with a boring battle-tested alternative. |
| `thinking-via-negativa` | Improve by subtracting friction/complexity/process rather than adding. | A plan that's a pile of additions on top of removable root causes (onboarding bloat, meeting overload, latency from N+1s). |
| `thinking-red-team` | Attack your own plan/design as an adversary before reality does. | Pre-launch review of an auth flow, migration cutover, or public API the author is already confident in. |

## Estimation & risk

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-fermi-estimation` | Order-of-magnitude estimates by decomposing into estimable factors. | A back-of-envelope sizing (storage, LLM/API cost, log volume) needed now with no measured data. |

## Product & innovation

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-jobs-to-be-done` | Reframe product decisions around the progress users seek and the real competitor. | Low feature adoption, or a roadmap framed as feature-parity while the true competition is a different behavior. |
| `thinking-effectuation` | Start from means / affordable loss / partner commitments, not goal-first prediction. | An open-ended "build something useful" mandate where predictive planning paralyzes. |

## Meta-skills (routers/composers — tested by Tier 2, not Tier 3)

| Skill | Job | Best trigger |
|---|---|---|
| `thinking-model-router` | Single entry point — route a problem (domain × problem-type) to the right model. | User explicitly unsure which lens to apply; a dispatch step before deep analysis. |
| `thinking-model-selection` | Choose the right mental model for a problem. | Facing a novel problem where the usual approach failed. |
| `thinking-model-combination` | Combine multiple models for richer analysis. | A high-stakes problem where single lenses leave blind spots. |

---

## Overlap clusters (discoverability + consolidation risk)

These groups share triggers; a router will struggle to disambiguate them from a natural prompt, and they are the prime consolidation/cross-linking candidates. (Surfaced during routing-dataset authoring and confirmed against descriptions.)

1. **Root-cause cluster:** `five-whys-plus` ↔ `scientific-method` ↔ `kepner-tregoe`. Descriptions even reference each other ("beyond 5 Whys"). Any "find the root cause of this incident" prompt fits all three. **Highest discriminability risk.**
2. **Systems-dynamics cluster:** `systems` ↔ `feedback-loops` ↔ `archetypes`. All about interconnected dynamics/loops; `archetypes` is separable only by "recurring fix that keeps failing."
3. **Attack-the-plan cluster:** `inversion` ↔ `pre-mortem` ↔ `red-team`. All find failure paths; differ only by stance (work-backward vs imagine-failed vs adversarial). A single planning prompt fits all three.
4. **Belief-update cluster:** `bayesian` ↔ `probabilistic`. Bayesian is the mechanism, probabilistic the framing; heavy overlap on "how confident should I be / update my estimate."
5. **Meta cluster:** `model-router` ↔ `model-selection` ↔ `model-combination`. Mutually entangled by design; `model-selection` also bleeds into `cynefin` (matching approach to problem type).

## Trigger-phrase guidance (for sharpening descriptions)

The most reliable auto-invocation comes from descriptions that name the **situation**, not the framework. Examples of high-signal triggers a description should contain:
- second-order → "before approving a policy/incentive change"
- via-negativa → "when the plan is to add more (features, infra, meetings)"
- map-territory → "when a metric or green test is about to drive a decision"
- theory-of-constraints → "when optimization effort is spread across many components"
- circle-of-competence → "deciding in an unfamiliar/adjacent domain"

These situational phrasings are what make the difference between a skill that fires at the right moment and one that never fires (or fires everywhere).
```

## G. The eval harness design (Tiers 0-3) — critique this
- **Tier 0 structural lint** (free): header/format conformance + a substance-aware re-score.
- **Tier 1 reasoning-quality rubric**: a judge model scores each SKILL.md on fidelity / applicability / actionability / discrimination / discoverability (1-5) and flags "would mislead an agent".
- **Tier 2 routing accuracy**: given a natural prompt + all 39 descriptions, does a Claude-class model pick the right skill, and correctly pick NONE on routine requests (negatives)? 71 cases (39 positive / 16 negative / 16 ambiguous).
- **Tier 3 behavioral A/B lift** (headline): Claude (claude-sonnet-4-6) solves 108 realistic jargon-free problems WITH vs WITHOUT each skill injected; a cross-family judge (gemini-3.1-pro-preview) does a blind, order-randomized pairwise comparison. Solver≠judge family to limit self-preference. A skill that can't beat baseline is flagged "unproven".
- Behavioral problems never name the framework; each targets a specific failure mode a naive solver falls into.
