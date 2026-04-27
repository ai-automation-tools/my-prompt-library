---
name: "🗺️ Codebase Onboarding"
description: Analyze a repository and generate onboarding documentation including architecture overviews, key file maps, setup guides, runbooks, and contribution guidance. Use when a codebase needs newcomer-friendly documentation.
source: https://skillsmp.com/skills/openclaw-skills-skills-alirezarezvani-codebase-onboarding-skill-md
author: openclaw
repository: https://github.com/openclaw/skills
stars: 4312
forks: 1182
updated: 2026-03-13
---

# Codebase Onboarding

Use this skill when the goal is to explain a codebase clearly to a new teammate, contractor, or future maintainer.

## When To Use

- Onboard a new engineer to an unfamiliar repo
- Refresh stale project documentation after major refactors
- Produce a service overview before handoff or open-sourcing
- Build a team wiki page or internal runbook from the code itself

## Expected Outputs

- Architecture overview with major system boundaries and data flow
- Key file map showing what matters and why
- Local setup guide from clone to running tests
- Common task runbooks for recurring developer workflows
- Debugging guide with logs, common failures, and recovery steps
- Contribution guide with branch, PR, and validation expectations

## Recommended Workflow

1. Inspect package metadata, scripts, dependencies, and top-level directories.
2. Identify core runtime paths, routes, jobs, schema files, and integration points.
3. Review recent git history to understand active areas and major changes.
4. Write docs for the intended audience: junior, senior, or contractor.
5. Prefer actionable setup and debugging steps over abstract theory.

## Quality Bar

- Keep setup instructions runnable on a fresh machine
- Explain the "why" behind important files, not just the path names
- Link to deeper docs instead of repeating them
- Update onboarding docs in the same change set as code when possible
