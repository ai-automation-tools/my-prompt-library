---
title: "⌨️ Aider Setup Guide"
tags: ["guide", "aider", "cli", "setup"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
---

# Aider Setup Guide

A guide for setting up and using Aider, an AI pair programming tool in your terminal.

## Overview
Aider lets you pair program with LLMs to edit code in your local git repository. It can start new projects or work with existing repos.

## Agent Configuration
- **Preferred Model:** Claude 3.5 Sonnet (via Anthropic API).
- **Environment:** Requires `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`.
- **Installation:** `python -m pip install aider-chat`.

## System Prompt
Aider uses its own system prompts. You can provide conventions via a `CONVENTIONS.md` file:
```
- Use strict type hinting.
- Write docstrings for all functions.
- Follow PEP 8 guidelines.
```

## Workflow
1. Navigate to your git repo: `cd my-project`.
2. Start Aider: `aider <files-to-edit>`.
3. Provide instructions: "Add a login function to auth.py".

## Example Interactions
- **User:** `aider auth.py` -> "Add JWT token validation."
- **Aider:** Reads `auth.py`, generates the validation code, and commits the changes with a descriptive message.

## Best Practices
- Add only the necessary files to the chat context (`/add <file>`).
- Use `/drop` to remove files from context when no longer needed.
- Write clear, focused requests.

## Customization Options
- Model selection via `--model`.
- Custom commit messages.
- Dark/light mode for terminal output.

## Troubleshooting
- **API errors:** Verify your API keys are correctly exported.
- **Git errors:** Ensure you are in a valid git repository.

## Integration
Aider integrates directly with git, automatically committing changes. It works well with existing CI/CD pipelines.

## Version History
- v1.0.0: Initial Aider guide.

## References
- [Aider Documentation](https://aider.chat/)
