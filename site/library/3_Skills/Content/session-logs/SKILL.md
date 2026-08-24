---
title: "session-logs"
tags: ["history", "productivity", "analysis", "logs"]
category: "Skills"
subcategory: "Content"
source: "https://skillsmp.com/skills/openclaw-openclaw-skills-session-logs-skill-md"
---

# session-logs

Search and analyze prior agent session logs when the user asks about earlier conversations, missing context, or historical decisions.

## Overview

Use this skill when:

- The user asks what happened in an earlier session
- Context is split across multiple historical runs
- You need to reconstruct prior decisions, prompts, or tool activity
- A memory file is incomplete and the raw session history matters

Do not use it when the current thread already contains the needed context.

## Prerequisites

- Session logs are stored locally and accessible
- `jq` and `rg` are available for fast filtering and search

## Workflow

1. Identify the session storage location for the current agent runtime.
2. List candidate sessions by date, size, or session id.
3. Narrow to the relevant session using dates, keywords, or the parent conversation relationship.
4. Extract only the human-readable text or tool activity needed for the question.
5. Summarize the historical context instead of dumping raw logs.

## Useful Queries

- List sessions by recency and size
- Search all sessions for a phrase or decision
- Extract only user messages or only assistant replies
- Count tool calls or estimate token and cost usage
- Compare multiple sessions to find when behavior changed

## Guardrails

- Prefer targeted extraction over reading entire large session files
- Do not expose secrets, tokens, or sensitive raw payloads from historical logs
- Distinguish direct evidence from inference when reconstructing prior events
- Treat memory files as a fast path, but fall back to session logs when memory is incomplete

## Examples

### Recover prior decision

- Question: "Why did we switch branches yesterday?"
- Action: search recent session logs for the branch name and summarize the rationale

### Find historical prompt

- Question: "What exact instructions did we use last run?"
- Action: extract user messages from the relevant session and quote only the needed passage

### Audit tool usage

- Question: "Did we already run the benchmark script?"
- Action: search tool-call records for the script invocation and report the result
