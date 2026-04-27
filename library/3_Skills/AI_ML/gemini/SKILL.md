---
name: "✨ Gemini"
description: Use the Gemini CLI for one-shot Q&A, summarization, and generation tasks. Trigger when Gemini-specific CLI usage, model selection, or JSON-formatted output is needed.
source: https://skillsmp.com/skills/openclaw-openclaw-skills-gemini-skill-md
author: openclaw
repository: https://github.com/openclaw/openclaw
stars: 354023
forks: 71530
updated: 2026-03-11
---

# Gemini

Use this skill when the task specifically benefits from the `gemini` CLI rather than a generic model prompt.

## Prerequisites

- `gemini` CLI installed and available on `PATH`
- Authenticated locally by running `gemini` once interactively if needed

## When To Use

- Run one-shot prompts against Gemini models
- Request structured JSON output from the CLI
- Switch models explicitly for a prompt
- Summarize or generate text through Gemini without entering interactive mode

## Common Patterns

- Basic prompt: `gemini "Answer this question..."`
- Model selection: `gemini --model <name> "Prompt..."`
- Structured output: `gemini --output-format json "Return JSON"`
- Extension discovery: `gemini --list-extensions`

## Working Notes

- Prefer positional prompts for deterministic one-shot execution
- Avoid interactive sessions unless setup or login is required
- Avoid unsafe flags like `--yolo`
- If a task depends on Gemini extensions, list them first before assuming availability
