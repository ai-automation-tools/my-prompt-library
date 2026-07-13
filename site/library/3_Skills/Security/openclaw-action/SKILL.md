---
title: "OpenClaw Action"
tags: ["github-actions", "agent-security", "secret-scanning", "prompt-injection", "ci"]
category: "Skills"
subcategory: "Security"
source: "https://skillsmp.com/skills/openclaw-skills-skills-atlaspa-openclaw-action-skill-md"
source_author: "openclaw"
source_repository: "openclaw/skills"
source_stars: 4094
source_updated: "2026-02-13"
---

# OpenClaw Action

## Overview
Set up CI security scanning for agent workspaces and skill repositories. Use this when a project needs pull request checks for exposed secrets, prompt injection markers, suspicious shell usage, or data exfiltration patterns in agent files.

## What to Scan
- `skills/**`, `.claude/**`, `.codex/**`, `.openclaw/**`, `.agents/**`, and other agent workspace folders.
- Scripts, hooks, install files, and generated instructions bundled with skills.
- Workflow files that grant network, token, or write permissions.

## GitHub Actions Pattern
```yaml
name: Agent Security Scan
on:
  pull_request:
    paths:
      - 'skills/**'
      - '.claude/**'
      - '.codex/**'
      - '.openclaw/**'
  push:
    branches: [main]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Scan agent workspace
        run: python scripts/scan-agent-workspace.py .
```

## Findings to Flag
- API keys, private keys, tokens, passwords, and wallet material.
- Instructions that try to bypass higher-priority rules or reveal secrets.
- Shell snippets that download and execute remote code without verification.
- Unexpected network calls, webhooks, or upload commands.
- Broad file deletion, credential harvesting, or persistence mechanisms.

## Operating Principles
The scan should detect and annotate risks without modifying repository files. Fail CI for high-confidence critical findings and emit a readable summary for lower-confidence warnings.

## Source Notes
Adapted from the SkillsMP `openclaw-action` skill, selected because it is a highly starred security automation skill focused on agent workspace supply-chain risk.
