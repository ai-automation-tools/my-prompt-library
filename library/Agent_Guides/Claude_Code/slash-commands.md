---
title: "Claude Code Slash Commands Reference"
tags: ["claude-code", "slash-commands", "cli", "reference"]
category: "Agent_Guides"
subcategory: "Claude_Code"
---

<!-- Last Updated: 2026-03-14 - Synced with upstream documentation -->

# Claude Code Slash Commands Reference

Built-in commands available in Claude Code CLI interactive mode.

**Source**: [code.claude.com/docs/en/commands](https://code.claude.com/docs/en/commands)

Type `/` in Claude Code to see all available commands, or type `/` followed by letters to filter.

## Core Commands

| Command | Purpose |
|---------|---------|
| `/help` | Show help and available commands |
| `/exit` | Exit the CLI (Alias: `/quit`) |
| `/clear` | Clear conversation history and free up context (Aliases: `/reset`, `/new`) |

## Session Management

| Command | Purpose |
|---------|---------|
| `/resume [session]` | Resume conversation by ID/name, or open session picker (Alias: `/continue`) |
| `/fork [name]` | Create a fork of the current conversation at this point |
| `/rename [name]` | Rename current session and show name on prompt bar |
| `/export [filename]` | Export current conversation as plain text |
| `/compact [instructions]` | Compact conversation with optional focus instructions |

## Model & Configuration

| Command | Purpose |
|---------|---------|
| `/model [model]` | Select or change AI model (use arrows to adjust effort level) |
| `/effort [low\|medium\|high\|max\|auto]` | Set model effort level |
| `/config` | Open Settings interface (Alias: `/settings`) |
| `/status` | Open Settings interface (Status tab) showing version, model, account |

## Context & Memory

| Command | Purpose |
|---------|---------|
| `/add-dir <path>` | Add a new working directory to current session |
| `/context` | Visualize current context usage as colored grid |
| `/btw <question>` | Ask quick side question without adding to conversation |
| `/memory` | Edit CLAUDE.md memory files, enable/disable auto-memory |

## Permissions & Safety

| Command | Purpose |
|---------|---------|
| `/permissions` | View or update permissions (Alias: `/allowed-tools`) |
| `/plan` | Enter plan mode directly from prompt |
| `/sandbox` | Toggle sandbox mode (supported platforms only) |

## Development Tools

| Command | Purpose |
|---------|---------|
| `/diff` | Open interactive diff viewer (uncommitted changes + per-turn diffs) |
| `/rewind` | Rewind conversation/code to previous point (Alias: `/checkpoint`) |
| `/security-review` | Analyze pending changes for security vulnerabilities |
| `/pr-comments [PR]` | Fetch and display GitHub PR comments |

## Integrations & Extensions

| Command | Purpose |
|---------|---------|
| `/agents` | Manage agent configurations |
| `/mcp` | Manage MCP server connections and OAuth |
| `/chrome` | Configure Claude in Chrome settings |
| `/ide` | Manage IDE integrations and show status |
| `/plugin` | Manage Claude Code plugins |
| `/reload-plugins` | Reload all active plugins without restarting |
| `/hooks` | View hook configurations for tool events |
| `/skills` | List available skills |

## Remote & Web Sessions

| Command | Purpose |
|---------|---------|
| `/remote-control` | Make session available for remote control from claude.ai (Alias: `/rc`) |
| `/remote-env` | Configure default remote environment for web sessions |
| `/desktop` | Continue current session in Claude Code Desktop app (macOS/Windows) (Alias: `/app`) |
| `/mobile` | Show QR code to download Claude mobile app (Aliases: `/ios`, `/android`) |

## GitHub & CI/CD

| Command | Purpose |
|---------|---------|
| `/install-github-app` | Set up Claude GitHub Actions app for repository |
| `/install-slack-app` | Install Claude Slack app (OAuth flow) |

## Utilities

| Command | Purpose |
|---------|---------|
| `/copy` | Copy last assistant response to clipboard (picker for code blocks) |
| `/color [color\|default]` | Set prompt bar color (red/blue/green/yellow/purple/orange/pink/cyan) |
| `/init` | Initialize project with CLAUDE.md guide |
| `/doctor` | Diagnose and verify installation and settings |

## Display & UI

| Command | Purpose |
|---------|---------|
| `/theme` | Change color theme (light/dark/colorblind/ANSI variants) |
| `/terminal-setup` | Configure terminal keybindings (Shift+Enter, etc.) |
| `/keybindings` | Open or create keybindings configuration file |
| `/statusline` | Configure Claude Code's status line |

## Usage & Analytics

| Command | Purpose |
|---------|---------|
| `/cost` | Show token usage statistics |
| `/usage` | Show plan usage limits and rate limit status |
| `/insights` | Generate report analyzing your sessions |
| `/stats` | Visualize daily usage, session history, streaks |
| `/tasks` | List and manage background tasks |

## Account & Plans

| Command | Purpose |
|---------|---------|
| `/login` | Sign in to Anthropic account |
| `/logout` | Sign out from Anthropic account |
| `/upgrade` | Open upgrade page to switch plan tier |
| `/passes` | Share free week of Claude Code (if eligible) |
| `/extra-usage` | Configure extra usage for rate limits |
| `/privacy-settings` | View and update privacy settings (Pro/Max plans only) |
| `/stickers` | Order Claude Code stickers |

## Advanced

| Command | Purpose |
|---------|---------|
| `/fast [on\|off]` | Toggle fast mode |
| `/feedback [report]` | Submit feedback about Claude Code (Alias: `/bug`) |
| `/release-notes` | View full changelog |
| `/vim` | Toggle between Vim and Normal editing modes |

## MCP Prompts

MCP servers can expose prompts as commands using format `/mcp__<server>__<prompt>`. These are dynamically discovered from connected servers.

## Bundled Skills

Claude Code includes bundled skills like `/simplify`, `/batch`, and `/debug` that appear alongside built-in commands.

## Command Aliases

- `/resume` = `/continue`
- `/config` = `/settings`
- `/clear` = `/reset` = `/new`
- `/rewind` = `/checkpoint`
- `/permissions` = `/allowed-tools`
- `/remote-control` = `/rc`
- `/desktop` = `/app`
- `/mobile` = `/ios` = `/android`
- `/feedback` = `/bug`

---

## Notes

- Not all commands visible to every user - some depend on platform, plan, or environment
- `/desktop` only appears on macOS and Windows
- `/upgrade` and `/privacy-settings` only for Pro and Max plans
- `/terminal-setup` hidden when terminal natively supports keybindings
- Type `/` to filter available commands in real-time

---

## See Also

- [Skills](https://code.claude.com/docs/en/skills) - Create your own commands
- [Interactive Mode](https://code.claude.com/docs/en/interactive-mode) - Keyboard shortcuts, Vim mode
- [CLI Reference](https://code.claude.com/docs/en/cli-reference) - Launch-time flags
