---
name: thinking-red-team
description: Security review or pre-launch hardening of a system you control. Adopt an attacker mindset, enumerate the attack surface, and report only vulnerabilities with a concrete reproducible attack path.
---

# Red Team Thinking

## Overview

Red teaming, borrowed from military and security practice, involves deliberately attacking your own plans, systems, or ideas to find weaknesses. A dedicated "red team" assumes an adversarial role, trying to defeat the "blue team's" defenses. This reveals vulnerabilities that defenders' blind spots hide.

**Core Principle:** Attack yourself before others do. The best defense is knowing your weaknesses.

## When to Use

**Default domain: security.** Use this when you're attacking a system you control to find security weaknesses before an attacker does:

- Security architecture / auth / API review
- Pre-launch security hardening
- Code and system review for exploitable flaws

Decision flow:

```
About to ship a system that handles auth, data, or money?
  → Have you tried to break it as an attacker would? → no → RED TEAM IT
  → Confident in your defenses without testing them?  → yes → RED TEAM YOUR CONFIDENCE
```

## When NOT to Use

- **Anti-fabrication gate (the most important rule): report only vulnerabilities with a concrete, reproducible attack path.** For each finding state the entry point, the exact steps an attacker takes, and the realized impact. If you cannot describe how the attack actually executes against *this* code/config, it is not a finding — drop it. Do not pad the report with theoretical, "best-practice," or hypothetical weaknesses to look thorough. A short report of real, demonstrable vulns beats a long list of speculation.
- **Not for plan/strategy/decision stress-testing** — for "how could this plan fail," use **thinking-pre-mortem**; for "what's the strongest case against this," use **thinking-steel-manning**. Keep red-team scoped to adversarial security.
- **Not a substitute for running the tools** — where you can actually run a scanner, fuzzer, or PoC, do that; this skill structures the thinking, it doesn't replace verification.

## The Red Team Process

### Step 1: Define the Target

What are you attacking?

```markdown
## Red Team Target

System: User authentication system
Scope:
- Login flow
- Password reset
- Session management
- API authentication

Out of scope:
- Physical security
- Social engineering of employees
- Third-party services

Goal: Find vulnerabilities that could lead to:
- Unauthorized account access
- Session hijacking
- Privilege escalation
```

### Step 2: Adopt Adversary Mindset

Think like an attacker:

```markdown
## Adversary Profile

Who would attack this?
- Script kiddies: Automated scanning, known exploits
- Sophisticated attackers: Custom exploits, patience
- Insiders: Already have some access
- Competitors: Want data or disruption

Attacker motivations:
- Financial gain (steal data, ransom)
- Disruption (take down service)
- Credential harvesting (sell on dark web)
- Competitive advantage (steal IP)

What would I do if I were them?
```

### Step 3: Enumerate Attack Surfaces

Where can attacks happen?

```markdown
## Attack Surface Enumeration

Entry points:
| Surface | Exposure | Attacker Access |
|---------|----------|-----------------|
| Login form | Public | Anyone |
| API endpoints | Public | Anyone with API key |
| Password reset | Public | Anyone with email |
| Admin panel | Internal network | Employees |
| Database | No direct access | Only if compromised |

Trust boundaries:
- Public internet → Web server
- Web server → Application
- Application → Database
- User → Authenticated user
- User → Admin
```

### Step 4: Execute Attack Scenarios

Systematically try to break things:

```markdown
## Attack Scenario 1: Credential Stuffing

Attack: Try known breached credentials against login
Goal: Compromise accounts with reused passwords

Execution:
1. Obtain breach database (simulated)
2. Run credentials against login endpoint
3. Document rate limiting behavior
4. Test account lockout triggers
5. Attempt bypass techniques

Findings:
- Rate limiting triggers at 10 attempts/minute
- No account lockout
- No breach credential detection
- Login response time reveals valid usernames
```

```markdown
## Attack Scenario 2: Session Hijacking

Attack: Steal or forge session tokens
Goal: Access accounts without credentials

Execution:
1. Analyze session token structure
2. Test token entropy
3. Attempt token prediction
4. Test XSS vectors for token theft
5. Check secure cookie flags

Findings:
- Session tokens use secure random
- Cookies missing HttpOnly flag ←VULNERABILITY
- No session binding to IP
- Tokens don't expire on password change
```

### Step 5: Attempt Bypass

For each defense, try to bypass it:

```markdown
## Defense Bypass Attempts

Defense: Rate limiting on login
Bypass attempts:
| Attempt | Result |
|---------|--------|
| Distribute across IPs | BYPASSED - no IP correlation |
| Vary username slowly | Works - only per-IP limit |
| Use different user agents | No effect |
| Target password reset instead | BYPASSED - no rate limit |

Conclusion: Rate limiting is per-IP only, easily distributed
            Password reset has no rate limiting
```

### Step 6: Document Findings

Create an actionable report:

```markdown
## Red Team Findings Report

### Critical Vulnerabilities

#### CRIT-1: Password Reset No Rate Limit
Severity: Critical
Attack: Brute force password reset tokens
Impact: Mass account compromise
Remediation: Add rate limiting to password reset
Timeline: Immediate

#### CRIT-2: Session Tokens Vulnerable to XSS
Severity: Critical
Attack: Inject XSS, steal session cookies
Impact: Account takeover
Remediation: Add HttpOnly flag to session cookies
Timeline: Immediate

### High Vulnerabilities

#### HIGH-1: Rate Limiting Easily Bypassed
Severity: High
Attack: Distributed credential stuffing
Impact: Account compromise at scale
Remediation: Add account-level rate limiting
Timeline: 1 week

### Medium Vulnerabilities

#### MED-1: Username Enumeration via Timing
Severity: Medium
Attack: Determine valid usernames
Impact: Enables targeted attacks
Remediation: Constant-time response for login
Timeline: 2 weeks
```

## Red Team Patterns

> The security pattern below is the primary use. The Plan / Architecture / Decision patterns that follow are kept for reference, but for non-security work prefer **thinking-pre-mortem** (plan failure modes) or **thinking-steel-manning** (decision challenge) — and the anti-fabrication gate still applies everywhere: only report a weakness you can show is real.

### Security Red Team

```markdown
## Security Red Team Checklist

Authentication:
- [ ] Credential stuffing
- [ ] Brute force attacks
- [ ] Session hijacking
- [ ] Token prediction
- [ ] Password reset flaws

Authorization:
- [ ] Privilege escalation
- [ ] IDOR (insecure direct object reference)
- [ ] Missing function-level access control
- [ ] JWT manipulation

Input validation:
- [ ] SQL injection
- [ ] XSS (stored, reflected, DOM)
- [ ] Command injection
- [ ] Path traversal

Business logic:
- [ ] Race conditions
- [ ] State manipulation
- [ ] Price manipulation
- [ ] Workflow bypass
```

### Plan Red Team

```markdown
## Plan Red Team: Product Launch

Red team the launch plan:

What could go wrong?
| Failure Mode | Attack Vector | Mitigation |
|--------------|---------------|------------|
| Traffic spike | Product goes viral | Auto-scaling, load test |
| PR disaster | Journalist finds bug | Bug bash before launch |
| Payment failure | Provider outage | Backup payment provider |
| Support overwhelmed | Many questions | FAQ, chatbot, staff up |

Assumptions to challenge:
| Assumption | What if wrong? | How to verify? |
|------------|----------------|----------------|
| Users will understand new UI | Confusion, support tickets | User testing |
| Infrastructure handles 10x | Crashes | Load testing |
| Marketing will drive traffic | No signups | Organic channel backup |
```

### Architecture Red Team

```markdown
## Architecture Red Team: Microservices Migration

Attack the architecture:

Single points of failure:
- API Gateway - if down, everything down
- Auth service - if down, no logins
- Message queue - if down, async breaks

Cascade failures:
- Service A times out → retries → overwhelms B → cascade
- Database connection exhaustion → app servers stuck → timeout cascade

Data consistency attacks:
- Eventual consistency window exploits
- Distributed transaction rollback states
- Cache invalidation race conditions

Findings:
1. No circuit breakers between services
2. Shared database = coupled failure domains
3. No chaos engineering to verify resilience
```

### Decision Red Team

```markdown
## Decision Red Team: Technology Choice

Decision: Adopt Kubernetes for container orchestration

Red team the decision:

Arguments AGAINST:
- Operational complexity high for small team
- Learning curve delays delivery 3-6 months
- Could use simpler solutions (ECS, docker-compose)
- Over-engineering for current scale

Counter-arguments:
- Scale projections justify complexity
- Team wants to learn K8s anyway
- Platform engineering investment pays off

Red team verdict:
The learning curve argument is strongest.
Consider: Managed K8s (EKS/GKE) to reduce ops burden
         Start with single namespace, expand gradually
```

## Red Team Template

```markdown
# Red Team Report: [Target]

## Scope
Target: [What's being red teamed]
In scope: [What to attack]
Out of scope: [What to skip]
Goal: [What constitutes a successful attack]

## Adversary Model
Who: [Who would attack this]
Capabilities: [What they can do]
Motivation: [Why they'd attack]

## Attack Surface
| Surface | Exposure | Notes |
|---------|----------|-------|
| | | |

## Attack Scenarios Executed
| Scenario | Result | Severity |
|----------|--------|----------|
| | | |

## Findings

### Critical
[Findings requiring immediate action]

### High
[Findings requiring near-term action]

### Medium
[Findings for backlog]

### Low
[Informational findings]

## Recommendations
| Finding | Remediation | Priority | Effort |
|---------|-------------|----------|--------|
| | | | |

## Lessons Learned
[What did the red team reveal about blind spots?]
```

## Verification Checklist

- [ ] Defined clear scope and adversary model
- [ ] Adopted genuine adversary mindset
- [ ] Enumerated attack surfaces
- [ ] Executed multiple attack scenarios
- [ ] Attempted to bypass defenses
- [ ] **Every reported finding has a concrete, reproducible attack path (entry point → steps → realized impact); dropped everything that was only theoretical**
- [ ] Documented findings with severity
- [ ] Provided actionable remediation
- [ ] Updated defenses based on findings

## Key Questions

- "How would an attacker approach this?"
- "What assumptions am I making that an attacker wouldn't?"
- "What's the weakest point in this system?"
- "If I wanted to cause maximum damage, how would I?"
- "What am I confident about that I haven't actually tested?"
- "What would I find embarrassing if an attacker found it first?"

## Sun Tzu's Wisdom (Applied)

"If you know the enemy and know yourself, you need not fear the result of a hundred battles."

Red teaming is knowing yourself as the enemy would. You find your weaknesses before they do. You attack your confidence before it betrays you. The purpose isn't pessimism—it's preparation.
