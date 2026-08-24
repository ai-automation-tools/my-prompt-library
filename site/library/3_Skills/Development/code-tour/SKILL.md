---
title: "code-tour"
tags: ["development", "onboarding", "architecture", "documentation"]
category: "Skills"
subcategory: "Development"
source: "https://skillsmp.com/skills/affaan-m-everything-claude-code-kiro-skills-code-tour-skill-md"
---

# code-tour

Create CodeTour `.tour` files with real file and line anchors for onboarding, architecture walkthroughs, PR reviews, RCA walkthroughs, and guided code explanations.

## Overview

Use this skill when:

- The user asks for a code tour or onboarding tour
- A guided walkthrough is better than a flat summary
- A PR or subsystem needs a reusable reviewer path
- A new engineer needs a structured way into the codebase

Do not use it when a one-off explanation in chat is enough, or when the task is implementation rather than documentation.

## Workflow

1. Explore the relevant repo areas before writing steps.
2. Infer the audience and depth from the request.
3. Verify that every file path and line anchor is real.
4. Write a `.tour` JSON file under `.tours/`.
5. Validate that the tour forms a coherent narrative.

## Suggested Personas

| Request Shape | Persona | Depth |
|---------------|---------|-------|
| Onboarding | `new-joiner` | 9-13 steps |
| Quick tour | `vibecoder` | 5-8 steps |
| Architecture tour | `architect` | 14-18 steps |
| PR walkthrough | `pr-reviewer` | 7-11 steps |
| RCA or debugging path | `rca-investigator` / `bug-fixer` | 7-11 steps |
| Security review | `security-reviewer` | 7-11 steps |

## Step Types

- Directory step for orientation
- File and line step for primary anchors
- Selection step for a precise code block
- Pattern step for volatile files
- Content-only step only near the end

## Writing Rule

Each step description should answer:

- Situation: what the reader is looking at
- Mechanism: how it works
- Implication: why it matters
- Gotcha: what they might miss

## Narrative Shape

Default tour arc:

1. Orientation
2. Module map
3. Core execution path
4. Edge case or gotcha
5. Closing or next move

## Anti-Patterns

- Flat file listings with no story
- Generic descriptions detached from code
- Guessed anchors
- Too many steps for a simple tour
- A content-only first step
