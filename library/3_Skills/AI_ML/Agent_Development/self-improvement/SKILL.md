---
title: "Self Improvement"
tags: ["learning", "memory", "agent-improvement", "postmortem"]
category: "Skills"
subcategory: "AI_ML"
source: "https://skillsmp.com/skills/openclaw-skills-skills-asterisk622-xiaoding-self-improving-agent-skill-md"
source_author: "openclaw"
source_repository: "openclaw/skills"
source_stars: 4094
source_updated: "2026-03-26"
---

# Self Improvement

## Overview
Capture corrections, command failures, tool surprises, missing capabilities, and better approaches as durable project learnings. Use this skill when a task reveals reusable knowledge that should prevent future mistakes or improve agent behavior.

## When to Use
- A command, API call, or integration fails in a non-obvious way.
- The user corrects an assumption or gives project-specific guidance.
- A recurring problem suggests a reusable rule, checklist, or automation.
- A workaround should be promoted into `CLAUDE.md`, `AGENTS.md`, or another project memory file.

## Workflow
1. Decide whether the event is a learning, error, or feature request.
2. Create or update `.learnings/LEARNINGS.md`, `.learnings/ERRORS.md`, or `.learnings/FEATURE_REQUESTS.md`.
3. Include a short summary, context, priority, affected area, suggested action, and related files.
4. Search existing entries before adding a new one; link related entries with `See Also`.
5. Promote broadly useful items into project guidance after they are verified or recur.

## Entry Template
```markdown
## [LRN-YYYYMMDD-001] concise-category

**Logged**: ISO-8601 timestamp
**Priority**: low | medium | high | critical
**Status**: pending
**Area**: frontend | backend | infra | tests | docs | config

### Summary
One-line description.

### Details
What happened, what was misunderstood, and what is now known.

### Suggested Action
Specific prevention or improvement.

### Metadata
- Source: conversation | error | user_feedback | investigation
- Related Files: path/to/file.ext
- Tags: tag1, tag2
- See Also: optional related IDs
```

## Promotion Rules
Promote a learning when it applies across multiple tasks, prevents repeated mistakes, documents an important project convention, or has been verified by a fix. Keep promoted guidance short and action-oriented.

## Source Notes
Adapted from the SkillsMP `self-improvement` skill, selected because it is highly starred on SkillsMP and fills a library gap around persistent agent learning workflows.
