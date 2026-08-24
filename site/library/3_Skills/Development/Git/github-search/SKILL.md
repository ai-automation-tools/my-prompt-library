---
title: "github-search"
tags: ["github", "search", "code-search", "repositories"]
category: "Skills"
subcategory: "Development"
source: "https://skillsmp.com/skills/parcadei-continuous-claude-v3-claude-skills-github-search-skill-md"
author: "parcadei"
repository: "https://github.com/parcadei/Continuous-Claude-v3"
stars: 3717
forks: 286
updated: 2026-01-13
---

# github-search

Search GitHub code, repositories, issues, and pull requests with focused queries instead of broad manual browsing.

## Overview

Use this skill when:

- Looking for prior art before implementing something new
- Investigating how a library is used in the wild
- Finding issues, PRs, or examples related to a bug or feature
- Comparing project patterns across repositories

## Prerequisites

- GitHub CLI or an equivalent GitHub search interface is available
- Authentication is configured when searching private or rate-limited scopes

## Search Workflow

1. Decide the target: `code`, `repos`, `issues`, or `prs`.
2. Build the narrowest useful query first.
3. Add filters for language, owner, repo, labels, or state.
4. Review a small high-signal result set before broadening.
5. Extract patterns, not just links.

## Query Patterns

### Code search

- `authentication language:python`
- `"useEffect(" repo:owner/project language:typescript`
- `"from pydantic import" path:src`

### Repository search

- `topic:observability language:go stars:>500`
- `framework language:typescript pushed:>2026-01-01`

### Issue and PR search

- `memory leak is:issue is:open`
- `label:bug state:open repo:owner/project`
- `is:pr "breaking change"`

## Evaluation Checklist

- Is the example recent enough to reflect current APIs?
- Is the repo maintained and relevant to the target stack?
- Does the result show production usage or only toy code?
- Are there repeated patterns across multiple strong repos?

## Guardrails

- Do not copy code blindly from search results
- Prefer maintained repos over the first match
- Distinguish example code from project-specific glue
- When searching issues, check whether the fix landed in code
