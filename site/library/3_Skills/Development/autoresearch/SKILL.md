---
name: "🔬 autoresearch"
description: Autonomously runs iterative experiment loops to optimize code against a measurable metric. Use when the user wants to improve execution time, memory usage, test pass rate, or any numeric performance goal across repeated experiments — NOT for one-shot bug fixes or simple code review.
source: https://github.com/github/awesome-copilot
---

# Autoresearch — Autonomous Code Optimization

Runs a structured experiment loop that automatically tests changes, commits successes, reverts failures, and logs all results until a performance goal is met or a budget is exhausted.

## Overview

Before starting any experiment loop, collect the following from the user:

| Parameter | Description | Example |
|-----------|-------------|---------|
| **Goal** | What to optimize | Reduce latency, maximize test pass rate |
| **Metric** | Command to measure + how to extract value | `pytest --tb=no -q \| tail -1` |
| **Direction** | Lower or higher is better | Lower (ms), Higher (%) |
| **Scope** | Files allowed / forbidden to modify | `src/` only; don't touch `tests/` |
| **Constraints** | Dependency restrictions, test requirements | No new dependencies |
| **Budget** | Max experiments, or unlimited | 20 experiments |
| **Simplicity policy** | Prefer simpler solutions with equal gains? | Yes (default) |

## Experiment Loop

Each iteration follows this fixed sequence:

```
Think → Edit → Commit → Run → Measure → Decide → Log
```

1. **Think** — Hypothesize one specific change to try
2. **Edit** — Implement the change in-scope files
3. **Commit** — `git commit` the attempt **before** running (required)
4. **Run** — Execute the metric command
5. **Measure** — Extract the numeric result
6. **Decide** — Keep if improved; revert with `git reset --hard HEAD~1` if not
7. **Log** — Append a row to `results.tsv`

## Results Log

All experiments are tracked in `results.tsv` (tab-separated):

```
experiment  commit_hash  metric_value  status    description
1           a1b2c3d      142ms         SUCCESS   Replaced list sort with heapq
2           e4f5g6h      165ms         REVERTED  Tried async prefetch (no gain)
```

## Key Rules

- **Always commit before running** — this enables clean reverts
- **Never keep regressions** unless the user explicitly allows trade-offs
- **Operate autonomously** — do not pause for permission once the loop starts
- **All changes happen on a dedicated git branch** — never modify main directly
- **Stop conditions**: budget exhausted, goal met, or no more ideas to try

## Prerequisites

- Git repository with clean working tree
- Terminal access to run the metric command
- Writable target files within agreed scope

## Example Session

```
User: Optimize the p99 latency of my API handler. Budget: 15 experiments.

Agent: [Confirms goal, metric command, scope, constraints]
       → Creates branch: autoresearch/latency-opt
       → Runs experiment 1: inline dict lookup → 210ms → SUCCESS (was 245ms)
       → Runs experiment 2: asyncio.gather → 248ms → REVERTED
       → Runs experiment 3: LRU cache on heavy function → 187ms → SUCCESS
       ...
       → Stops after budget. Reports: best result 187ms, 3 successes out of 15.
```

## When to Stop

- Budget reached
- Goal achieved (metric crosses target threshold)
- 5+ consecutive experiments with no improvement and no new hypotheses
- User requests a stop
