---
name: "🔍 find-skills"
description: Helps users discover and install agent skills from the open ecosystem. Use when the user asks "how do I do X", "find a skill for X", "is there a skill that can...", or expresses interest in extending Claude's capabilities with a new skill or tool.
source: https://github.com/vercel-labs/skills
installs: 579000+
---

# Find Skills

Discover and install agent skills from the open ecosystem using the Skills CLI.

## Overview

The Skills CLI (`npx skills`) is a package manager for modular agent skill packages. It connects to the open agent skills registry to search, install, and update skills from thousands of contributors.

Browse available skills at https://skills.sh/

## Core Commands

```bash
npx skills find [query]     # Search interactively or by keyword
npx skills add <package>    # Install a skill from GitHub
npx skills check            # Check for skill updates
npx skills update           # Update all installed skills
npx skills init             # Scaffold a new custom skill
```

**Install a specific skill:**
```bash
npx skills add <owner/repo@skill> -g -y
```

## Workflow

**Step 1 — Identify the need**
Determine the domain and specific task. Estimate how likely a published skill exists.

**Step 2 — Check the leaderboard first**
Visit https://skills.sh/ to browse the most popular and highest-quality skills before searching.

**Step 3 — Search if needed**
Run targeted searches using relevant keywords (domain + task, e.g. `"react performance"`).

**Step 4 — Verify quality**
Before recommending a skill, confirm:
- Install count (prefer 1,000+)
- Source reputation (official sources: Vercel Labs, Anthropic, Microsoft, HuggingFace)
- GitHub repository star count (prefer 100+)

**Step 5 — Present options**
Include: skill name, what it does, install count, and the install command.

**Step 6 — Assist installation**
Run the install command if the user confirms:
```bash
npx skills add <owner/repo@skill> -g -y
```

## When No Skills Exist

- Acknowledge the gap honestly
- Offer direct assistance for the task
- Suggest scaffolding a custom skill: `npx skills init`

## Quality Tiers

| Tier | Install Count | Source Examples |
|------|--------------|-----------------|
| Top | 10,000+ | Vercel Labs, Anthropic, Microsoft |
| Good | 1,000+ | Established community maintainers |
| Caution | < 100 | Unknown authors, new repos |

## Examples

- User asks: *"How do I add persistent memory to my agent?"*
  → Search `"memory agent"`, find `mem0ai/mem0@mem0`, present install count and command.

- User asks: *"Is there a skill for building Gradio demos?"*
  → Check leaderboard, find `huggingface/skills@huggingface-gradio`, present it.

- User asks: *"Find a skill for Kubernetes manifest generation"*
  → Run `npx skills find "kubernetes manifest"`, present top results.
