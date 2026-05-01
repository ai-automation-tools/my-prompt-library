---
title: "linear-cli"
tags: ["linear", "cli", "project-management", "issues"]
category: "Skills"
subcategory: "Platform_Integrations"
source: "https://skillsmp.com/skills/schpet-linear-cli-skills-linear-cli-skill-md"
author: "schpet"
repository: "https://github.com/schpet/linear-cli"
stars: 547
forks: 59
updated: 2026-04-02
---

# linear-cli

Manage Linear issues from the command line with a repeatable workflow for finding, updating, and progressing tickets.

## Overview

Use this skill when:

- Working from Linear issue IDs or team backlogs
- Updating issue state as engineering work progresses
- Creating or triaging issues without leaving the terminal
- Keeping branch and ticket status aligned

## Prerequisites

- The `linear` CLI is installed, or an `npx` fallback is available
- Linear authentication is configured for the current workspace

## Workflow

1. Resolve the target team, issue, or project.
2. Inspect the current issue state, labels, assignee, and comments.
3. Make the smallest state transition that matches current work.
4. Keep ticket updates factual: what changed, what is blocked, what is next.
5. Re-check status before closing or marking ready for review.

## Common Tasks

### Find work

- List assigned issues
- Filter by team, status, or project
- Search by keyword or identifier

### Update progress

- Move issue from backlog to in progress
- Add notes after investigation
- Mark ready for review once a PR exists

### Create issues

- Write a concrete title
- Capture context, acceptance criteria, and constraints
- Set labels and priority deliberately

## Good Practices

- Keep Linear state synchronized with actual engineering state
- Link branches and PRs when the workflow supports it
- Prefer concise progress comments over long narrative updates
- Use labels to improve triage, not as a substitute for clear issue text

## Guardrails

- Do not close an issue just because code was pushed
- Avoid bulk status churn without checking ticket ownership
- Do not create duplicate issues when a follow-up comment or subtask is enough
