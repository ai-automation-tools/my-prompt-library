---
title: "Claude Code CLI Flags Reference"
tags: ["claude-code", "flags", "cli", "reference", "options"]
category: "Agent_Guides"
subcategory: "Claude_Code"
---

# Claude Code CLI Flags Reference

Comprehensive reference for all command-line flags available in Claude Code.

## Most Popular Flags (Top 10)

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--continue` / `-c` | Quick session resume | Continue the most recent conversation |
| `--resume <session>` / `-r` | Specific session resume | Resume a specific session by name or ID |
| `--thinking` | Complex tasks, architecture planning | Enable extended thinking mode (~4K tokens) for deeper analysis |
| `--thinking-hard` | System design, major refactors | Deep thinking mode (~10K tokens) with enhanced reasoning |
| `--model <name>` | Model selection needed | Override default model (e.g., `claude-3-5-sonnet-20241022`) |
| `--permission-mode <mode>` | Control execution safety | Set permission level: `ask`, `allow-once`, `allow-all`, `bypass` |
| `--print` | Quick output needed | Print response to stdout and exit (no interactive mode) |
| `--file <path>` | Specific file context | Add file(s) to initial context |
| `--diff` | Review changes | Show git diff before starting conversation |
| `--help` / `-h` | Learning commands | Display help information |

---

## All Flags by Category

### Session Management

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--continue` / `-c` | Resuming work | Continue most recent conversation |
| `--resume <session>` / `-r` | Named session | Resume specific session by name or ID |
| `--session-name <name>` | Organizing work | Set custom name for new session |
| `--list-sessions` | Finding sessions | List all saved sessions |
| `--delete-session <name>` | Cleanup | Delete a specific session |
| `--export-session <name>` | Sharing/backup | Export session to JSON |
| `--import-session <file>` | Restore session | Import session from JSON file |

### Thinking & Reasoning

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--thinking` | 5+ files OR complex analysis | Standard structured thinking (~4K tokens) |
| `--thinking-hard` | Architectural design, system dependencies | Deep analysis (~10K tokens) with enhanced tools |
| `--ultrathinking` | Critical redesign, legacy modernization | Maximum depth analysis (~32K tokens) with all tools |
| `--no-thinking` | Simple tasks | Disable thinking mode explicitly |
| `--thinking-budget <tokens>` | Custom depth | Set custom token budget for thinking |

### Model Selection

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--model <name>` | Model override | Use specific Claude model |
| `--model-list` | Available models | Show all available models |
| `--fast` | Speed priority | Use fastest model (claude-3-5-haiku) |
| `--smart` | Quality priority | Use most capable model (claude-3-opus) |
| `--experimental` | Bleeding edge | Use latest experimental model |

**Available Models:**
- `claude-3-5-sonnet-20241022` (default, balanced)
- `claude-3-5-haiku-20241022` (fastest)
- `claude-3-opus-20240229` (most capable)
- `claude-3-sonnet-20240229` (previous generation)

### Context & Files

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--file <path>` / `-f` | Specific files needed | Add file(s) to initial context |
| `--dir <path>` / `-d` | Directory context | Add entire directory to context |
| `--exclude <pattern>` | Filter files | Exclude files matching pattern |
| `--include <pattern>` | Filter files | Include only files matching pattern |
| `--max-files <n>` | Large projects | Limit number of files in context |
| `--max-tokens <n>` | Context budget | Set maximum context tokens |
| `--git-context` | Git-aware context | Add git status, recent commits, and changes |
| `--no-git` | Ignore git | Skip git context even if in repo |

### Execution & Permissions

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--permission-mode ask` | Default safety | Ask before each command execution |
| `--permission-mode allow-once` | Single command | Execute one command without asking |
| `--permission-mode allow-all` | Trusted scripts | Execute all commands without asking |
| `--permission-mode bypass` | Full automation | Skip all permission checks (dangerous) |
| `--dry-run` | Preview changes | Show what would happen without executing |
| `--no-execute` | Read-only mode | Disable all command execution |
| `--sandbox` | Isolated execution | Run commands in sandboxed environment |

### Output & Display

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--print` | One-shot output | Print response and exit (non-interactive) |
| `--json` | Machine-readable | Output in JSON format |
| `--markdown` | Formatted output | Output in markdown format |
| `--verbose` / `-v` | Debugging | Show detailed execution information |
| `--quiet` / `-q` | Minimal output | Suppress non-essential output |
| `--no-color` | Plain text | Disable ANSI color codes |
| `--stream` | Real-time output | Stream response as it generates |
| `--no-stream` | Wait for completion | Show response only when complete |

### Git Integration

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--diff` | Review changes | Show git diff before conversation |
| `--commit-msg <msg>` | Auto-commit | Commit changes with specified message |
| `--branch <name>` | Work on branch | Checkout or create branch before starting |
| `--no-commit` | Manual commits | Disable auto-commit behavior |
| `--staged-only` | Staged changes | Only consider staged files in context |

### Configuration & Setup

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--config <file>` | Custom config | Use specific config file |
| `--workspace <path>` | Project root | Set workspace directory |
| `--api-key <key>` | Auth override | Use specific Anthropic API key |
| `--endpoint <url>` | Custom endpoint | Use custom API endpoint |
| `--timeout <seconds>` | Long operations | Set request timeout |
| `--retry <count>` | Network issues | Set number of retry attempts |

### MCP & Plugins

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--mcp-server <path>` | Custom MCP | Connect to MCP server |
| `--plugin <name>` | Plugin features | Load specific plugin |
| `--no-plugins` | Minimal setup | Disable all plugins |
| `--list-plugins` | Available features | Show installed plugins |
| `--plugin-config <file>` | Plugin settings | Use custom plugin configuration |

### Development & Debug

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--debug` | Troubleshooting | Enable debug logging |
| `--log-file <path>` | Persistent logs | Write logs to file |
| `--log-level <level>` | Log control | Set logging level (debug/info/warn/error) |
| `--trace` | Deep debugging | Enable request/response tracing |
| `--benchmark` | Performance analysis | Show timing and token usage stats |
| `--profile` | Optimization | Profile execution and show bottlenecks |

### Task & Workflow

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--task <description>` | Multi-step work | Define task for Claude to execute |
| `--auto-approve` | Trusted workflows | Auto-approve all task steps |
| `--max-steps <n>` | Task complexity | Limit maximum task execution steps |
| `--checkpoint` | Long tasks | Save state at each major step |
| `--rollback <step>` | Undo changes | Roll back to specific checkpoint |

### Testing & Validation

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--test` | Verify changes | Run tests after modifications |
| `--lint` | Code quality | Run linter on modified files |
| `--format` | Code style | Auto-format modified files |
| `--validate` | Pre-commit | Validate changes before committing |
| `--coverage` | Test quality | Show test coverage after changes |

### Templates & Patterns

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--template <name>` | Scaffolding | Use predefined template |
| `--pattern <name>` | Design patterns | Apply design pattern to code |
| `--style <guide>` | Code standards | Follow specific style guide |
| `--convention <name>` | Naming rules | Apply naming conventions |

### AI Behavior

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--temperature <0.0-2.0>` | Response variation | Control randomness/creativity (default: 1.0) |
| `--top-p <0.0-1.0>` | Nucleus sampling | Set probability threshold (default: 0.95) |
| `--max-tokens <n>` | Response length | Limit response token count |
| `--stop <sequence>` | Generation control | Stop generation at sequence |
| `--system-prompt <text>` | Behavior override | Set custom system prompt |

### Documentation

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--docs` | Generate docs | Generate documentation for code |
| `--readme` | Project docs | Generate or update README |
| `--comments` | Code clarity | Add inline comments to code |
| `--changelog` | Version history | Generate changelog from commits |

### Utilities

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--version` / `-V` | Version check | Show Claude Code version |
| `--help` / `-h` | Command help | Show help information |
| `--update` | Get latest | Check for and install updates |
| `--doctor` | Troubleshoot | Run diagnostics and check setup |
| `--init` | Project setup | Initialize Claude Code in project |

---

## Flag Combinations (Common Patterns)

### Quick Edit Mode
```bash
claude --print --file src/app.py "Add error handling"
```

### Deep Analysis Mode
```bash
claude --thinking-hard --git-context --verbose
```

### Safe Automation
```bash
claude --permission-mode allow-once --dry-run --task "Refactor auth module"
```

### Fast Iteration
```bash
claude -c --fast --no-thinking
```

### Full Context Review
```bash
claude --dir src/ --git-context --diff --thinking
```

### Production Safety
```bash
claude --permission-mode ask --test --lint --validate
```

---

## Environment Variables

These can be used instead of flags:

| Variable | Equivalent Flag | Default |
|----------|----------------|---------|
| `ANTHROPIC_API_KEY` | `--api-key` | None (required) |
| `CLAUDE_MODEL` | `--model` | `claude-3-5-sonnet-20241022` |
| `CLAUDE_PERMISSION_MODE` | `--permission-mode` | `ask` |
| `CLAUDE_WORKSPACE` | `--workspace` | Current directory |
| `CLAUDE_CONFIG` | `--config` | `~/.claude/config.json` |
| `CLAUDE_LOG_LEVEL` | `--log-level` | `info` |

---

## Tips & Best Practices

1. **Start simple**: Use `--thinking` only when needed (5+ files or complex tasks)
2. **Save sessions**: Use `--session-name` for important work
3. **Review changes**: Always use `--diff` before major modifications
4. **Control permissions**: Default to `ask`, use `allow-once` for trusted operations
5. **Optimize context**: Use `--exclude` to skip `node_modules`, `.git`, etc.
6. **Debug issues**: Add `--verbose` or `--debug` when troubleshooting
7. **Quick iterations**: Use `-c --fast` for simple follow-ups
8. **Document work**: Combine `--session-name` with `--export-session` for records

---

**Last Updated**: 2026-03-14  
**Claude Code Version**: Latest  
**Source**: Synced from official Anthropic documentation  
**Documentation**: [code.claude.com/docs/cli-reference](https://code.claude.com/docs/en/cli-reference.md)
