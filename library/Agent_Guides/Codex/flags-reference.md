---
title: "Codex CLI Flags Reference"
tags: ["codex", "flags", "cli", "reference", "openai", "options"]
category: "Agent_Guides"
subcategory: "Codex"
---

<!-- Last Updated: 2026-03-14 - Synced with upstream documentation -->

# Codex CLI Flags Reference

Official command-line flags for Codex CLI (OpenAI's coding agent).

**Source**: [developers.openai.com/codex/cli](https://developers.openai.com/codex/cli/)

## Installation & Basic Commands

```bash
# Install
npm i -g @openai/codex

# Run interactive mode
codex

# Run with initial prompt
codex "Explain this codebase to me"

# Update to latest version
npm i -g @openai/codex@latest
```

## Core Commands

| Command | Description | Example |
|---------|-------------|---------|
| `codex` | Start interactive TUI session | `codex` |
| `codex "query"` | Start with initial prompt | `codex "Explain this codebase"` |
| `codex exec "task"` | Non-interactive automation | `codex exec "fix the CI failure"` |
| `codex resume` | Open session picker | `codex resume` |
| `codex resume --last` | Resume most recent session | `codex resume --last` |
| `codex resume --all` | Show all sessions (any directory) | `codex resume --all` |
| `codex resume <id>` | Resume specific session | `codex resume 7f9f9a2e-...` |
| `codex features list` | List feature flags | `codex features list` |
| `codex features enable <name>` | Enable feature | `codex features enable unified_exec` |
| `codex features disable <name>` | Disable feature | `codex features disable shell_snapshot` |
| `codex cloud` | Browse/launch cloud tasks | `codex cloud` |
| `codex cloud exec --env ENV_ID "task"` | Start cloud task | `codex cloud exec --env ENV_ID "Summarize bugs"` |
| `codex completion bash` | Generate bash completions | `codex completion bash` |
| `codex completion zsh` | Generate zsh completions | `codex completion zsh` |
| `codex completion fish` | Generate fish completions | `codex completion fish` |

## CLI Flags

### Model Selection

| Flag | Description | Example |
|------|-------------|---------|
| `--model <name>` | Specify model (gpt-5.4, gpt-5.3-codex, etc.) | `codex --model gpt-5.4` |

**Available Models:**
- `gpt-5.4` - Recommended for most tasks (combines GPT-5.3-Codex with frontier reasoning)
- `gpt-5.3-codex` - Strong coding capabilities
- `gpt-5.3-codex-spark` - Extra fast (ChatGPT Pro only, research preview)

### Context & Directories

| Flag | Description | Example |
|------|-------------|---------|
| `--cd <path>` | Set working directory | `codex --cd apps/frontend` |
| `--add-dir <path>` | Expose additional writable roots | `codex --add-dir ../backend --add-dir ../shared` |

### Image Input

| Flag | Description | Example |
|------|-------------|---------|
| `-i <file>` | Attach image (PNG/JPEG) | `codex -i screenshot.png "Explain this error"` |
| `--image <files>` | Attach multiple images (comma-separated) | `codex --image img1.png,img2.jpg "Summarize these"` |

### Web Search

| Flag | Description | Default |
|------|-------------|---------|
| `--search` | Enable live web search (single run) | Cached mode |

**Note**: Web search defaults to cached index for safety. Use `--search` for live results or set `web_search = "live"` in config. Can be disabled with `web_search = "disabled"`.

### Approval Modes

| Mode | Description |
|------|-------------|
| **Auto** (default) | Read/edit/run within working directory; asks for network or outside scope |
| **Read-only** | Browse files only; no changes without approval |
| **Full Access** | Work across machine including network (use sparingly) |

Use `/permissions` in interactive session to switch modes.

### Session Management

| Flag | Description | Example |
|------|-------------|---------|
| `--last` | Resume most recent session | `codex resume --last` |
| `--all` | Show sessions from all directories | `codex resume --all` |

### Cloud Tasks

| Flag | Description | Example |
|------|-------------|---------|
| `--env <id>` | Specify cloud environment | `codex cloud exec --env ENV_ID "task"` |
| `--attempts <1-4>` | Request best-of-N runs | `codex cloud exec --env ENV_ID --attempts 3 "task"` |

### Configuration

| Flag | Description | Note |
|------|-------------|------|
| `--profile <name>` | Use specific config profile | Changes persist to profile, not root config |

## Interactive Mode Features

### Keyboard Shortcuts

- **Ctrl+C** - Cancel current operation / Exit
- **Ctrl+L** - Clear screen (preserves conversation)
- **Up/Down** - Navigate draft history
- **Enter** - Inject new instructions (while running)
- **Tab** - Queue follow-up for next turn
- **Ctrl+G** - Open full editor (uses $VISUAL or $EDITOR)
- **Esc Esc** - Edit previous message / fork conversation

### Special Prefixes

- **@** - Fuzzy file search (drop path into message)
- **!** - Run local shell command (output included in context)

## Slash Commands

Type `/` in interactive mode to access:

- `/model` - Switch between models or adjust reasoning
- `/review` - Open code review presets
- `/fork` - Fork conversation at current point
- `/copy` - Copy latest output
- `/theme` - Preview and select color theme
- `/clear` - Wipe terminal and start fresh (or Ctrl+L)
- `/exit` - Close session

## Model Context Protocol (MCP)

Configure MCP servers in `~/.codex/config.toml` to connect Codex to additional tools.

```bash
# Manage MCP servers via CLI
codex mcp <command>
```

Codex can also run as an MCP server for other agents.

## Configuration File

Location: `~/.codex/config.toml`

**Key Settings:**
- `review_model` - Override model for `/review` command
- `web_search` - Set to `"live"`, `"cached"`, or `"disabled"`
- `tui.theme` - Color theme setting

## Multi-Agent Workflows

Enable parallel task execution with multi-agent features.

**Configuration**: `[agents]` in `config.toml`  
**Documentation**: See [Multi-agents](https://developers.openai.com/codex/multi-agent)

## Code Review

Use `/review` in interactive mode to:

- Review against base branch
- Review uncommitted changes
- Review a specific commit
- Custom review instructions

Reviewer runs isolated, no working tree changes.

## Shell Completions

```bash
# Bash
echo 'eval "$(codex completion bash)"' >> ~/.bashrc

# Zsh
echo 'eval "$(codex completion zsh)"' >> ~/.zshrc

# Fish
codex completion fish > ~/.config/fish/completions/codex.fish
```

**Zsh Note**: If you see `compdef` error, add this before the eval line:
```bash
autoload -Uz compinit && compinit
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_CLI=1` | Set when running shell commands via `!` or shell mode |
| `VISUAL` | Editor for Ctrl+G (fallback: `$EDITOR`) |
| `EDITOR` | Fallback editor if `VISUAL` not set |
| `CODEX_HOME` | Custom Codex home directory (default: `~/.codex`) |

## Best Practices

1. **Activate environments first** - Source Python venv, set env vars before launching
2. **Use `--cd` for project root** - Set working directory without `cd` first
3. **Review before committing** - Use `/review` to check changes
4. **Leverage completion scripts** - Install shell completions for better UX
5. **Configure MCP for extensibility** - Connect external tools via MCP servers

## Platform Support

- ✅ macOS
- ✅ Linux
- ⚠️ Windows (experimental - use WSL for best experience)

**Windows Setup**: See [Windows setup guide](https://developers.openai.com/codex/windows)

---

## See Also

- [Codex CLI Features](https://developers.openai.com/codex/cli/features) - Full feature documentation
- [Codex Models](https://developers.openai.com/codex/models) - Model comparison
- [Multi-Agent](https://developers.openai.com/codex/multi-agent) - Parallel workflows
- [MCP Documentation](https://developers.openai.com/codex/mcp) - Model Context Protocol
- [Changelog](https://developers.openai.com/codex/changelog) - Release notes
- [Best Practices](https://developers.openai.com/codex/learn/best-practices) - Usage guide
