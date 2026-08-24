---
name: "🧪 Eval Harness"
description: Formal evaluation framework for agent workflows using eval-driven development (EDD). Use when defining pass/fail criteria, building regression evals, measuring pass@k, or benchmarking agent reliability.
source: https://skillsmp.com/skills/affaan-m-everything-claude-code-skills-eval-harness-skill-md
author: affaan-m
repository: https://github.com/affaan-m/everything-claude-code
stars: 160286
forks: 24935
updated: 2026-03-04
---

# Eval Harness

Build lightweight, repeatable evals before and during implementation so agent behavior can be measured instead of guessed.

## When To Use

- Define success criteria before coding
- Create capability or regression evals for prompts, agents, or features
- Track pass@1, pass@3, and pass^3 reliability over time
- Set up a simple release gate for AI-assisted workflows

## Core Workflow

### 1. Define The Eval First

Write down the behavior that must pass before implementation starts.

```text
## EVAL DEFINITION: feature-name

### Capability Evals
- [ ] Behavior 1 works
- [ ] Behavior 2 works
- [ ] Behavior 3 works

### Regression Evals
- [ ] Existing flow A still works
- [ ] Existing flow B still works

### Success Metrics
- pass@3 >= 0.90
- pass^3 = 1.00 for release-critical behavior
```

### 2. Use Three Grader Types

- `Code grader`: deterministic checks such as tests, grep assertions, schema checks, and builds
- `Rule grader`: format, regex, or structural validation
- `Model/Human grader`: reserved for open-ended quality checks or risky outputs

## Key Metrics

- `pass@1`: first-try success rate
- `pass@3`: success within three attempts
- `pass^3`: all three runs succeed; use for high-confidence release paths

## Minimal Project Layout

```text
.claude/
  evals/
    feature-name.md
    feature-name.log
    baseline.json
docs/releases/
  eval-summary.md
```

## Best Practices

- Define evals before implementation
- Prefer deterministic graders whenever possible
- Run evals continuously during implementation, not only at the end
- Keep evals fast enough that they actually get used
- Version evals with code and prompts
- Use human review for security or other high-stakes domains

