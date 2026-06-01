---
name: thinking-systems
description: Use when debugging across services/an incident where a fix in one place breaks another, or behavior is emergent and no single component explains it. Maps the system and traces causes.
---

# Systems Thinking

## Overview
Systems thinking views a problem as part of an interconnected whole rather than isolated components. It focuses on relationships, feedback loops, delays, and emergent properties—behaviors that arise from interactions and can't be predicted from parts alone. Its proven payoff is cross-service/incident debugging, where "obvious" single-component fixes fail.

**Core Principle:** The behavior of a system cannot be understood by analyzing components in isolation. Look at connections, feedback, and emergence.

## When to Use
- Debugging issues that span multiple services/components
- A fix in one place breaks something in another
- Behavior is emergent—no single component is at fault, but the whole misbehaves
- Analyzing incidents and outages with non-obvious causes
- Performance issues where the slow part isn't the actual cause

```
Problem spans multiple components?        → yes → APPLY SYSTEMS THINKING
Fix in one place caused issue in another? → yes → APPLY SYSTEMS THINKING
Behavior seems "emergent" or unexpected?  → yes → APPLY SYSTEMS THINKING
```

## When NOT to Use
- A single-component, linear bug (one service, clear stack trace) → just trace and fix it; the systems overhead buys nothing.
- The cause is already obvious from the recent diff or one log line → fix directly.
- The work is a contained refactor or feature with no cross-component interactions → skip.

## Systems Debugging Process
This is the core of the skill—apply it first.

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
- Is it reinforcing (amplifies change) or balancing (counteracts change)?
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
Once you've located where to intervene, pick the highest-leverage point you can actually move (timeout tweaks are low leverage; rules and architecture are high). See `thinking-leverage-points` for Meadows' full 12-level hierarchy—don't re-derive it here.

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
