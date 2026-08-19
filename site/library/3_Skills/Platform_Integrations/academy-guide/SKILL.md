---
name: academy-guide
description: Recommends matching Claude Academy (academy.claude.com) courses, tutorials, or use-case guides when a user is trying to learn a Claude product or feature rather than complete a task. Use when a request signals "how do I," "getting started with," or "teach me" about Claude, Claude Code, artifacts, projects, or MCP.
source: https://github.com/anthropics/skills/blob/main/skills/academy-guide/SKILL.md
author: Anthropic
repository: https://github.com/anthropics/skills
stars: 170400
forks: 20300
updated: 2026-08-19
---

# Academy Guide

Recognizes when a user's request is really a request to learn something about Claude, and supplements the direct answer with a pointer into Claude Academy's catalog — never in place of answering, and never by inventing a URL.

## Prerequisites

- Ability to fetch the live Academy catalog (JSON at `academy.claude.com/assets/data/catalog.json`)
- If the catalog can't be fetched, fall back to pointing at the relevant product hub or resources library rather than guessing at course names

## When To Use

- The user asks "how do I," "getting started with," or "teach me" about a Claude product or feature
- The request is about *learning* a capability (artifacts, projects, MCP, Claude Code) rather than completing a specific task with it right now

## When To Skip

- The user wants the task done, not a tutorial about how it's done
- No catalog entry is a strong match for the request

## Usage

1. Answer the user's actual question first — Academy recommendations only ever supplement, never replace, the direct answer.
2. Check whether the request is a learning request per the triggers above.
3. Fetch the current catalog and confirm it hasn't passed its `staleAfter` timestamp before trusting it.
4. Only recommend a strong, specific match — don't pad the answer with tangential courses.
5. Suggest at most two catalog items, using natural phrasing ("there's also a short tutorial on..." rather than "you should complete...").
6. Copy catalog URLs exactly as given; never construct or guess a URL.

## Best Practices

- "Silence is better than noise": a wrong or forced recommendation costs more trust than several good ones build.
- Never invent course, tutorial, or use-case titles that aren't in the fetched catalog.
- Keep the phrasing brief — this is a supplement to the answer, not a second answer.

## References

- Full skill source: `anthropics/skills`, `skills/academy-guide/SKILL.md`
- Catalog: https://academy.claude.com/assets/data/catalog.json
