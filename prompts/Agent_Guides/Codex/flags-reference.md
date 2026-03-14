---
title: "Codex CLI Flags Reference"
tags: ["codex", "flags", "cli", "reference", "openai", "options"]
category: "Agent_Guides"
subcategory: "Codex"
---

# Codex CLI Flags Reference

Comprehensive reference for all command-line flags available in Codex CLI (OpenAI coding assistant).

## Most Popular Flags (Top 10)

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--model <name>` / `-m` | Model selection | Specify which OpenAI model to use |
| `--reasoning` | Complex problems | Enable o1-preview reasoning mode |
| `--file <path>` / `-f` | Code context | Add file(s) to conversation context |
| `--continue` / `-c` | Resume work | Continue most recent conversation |
| `--temperature <value>` / `-t` | Control creativity | Set response randomness (0.0-2.0) |
| `--json-mode` | Structured output | Force JSON output format |
| `--stream` / `-s` | Real-time output | Stream response as it generates |
| `--max-tokens <n>` | Response length | Limit output token count |
| `--auto-execute` | Automation | Automatically execute generated code |
| `--test` | Code quality | Run tests after code generation |

---

## All Flags by Category

### Model Selection

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--model <name>` / `-m` | Model override | Specify OpenAI model to use |
| `--models` | List available | Show all available models |
| `--reasoning` | Deep thinking | Use o1-preview reasoning model |
| `--fast` | Speed priority | Use gpt-3.5-turbo (fastest) |
| `--smart` | Quality priority | Use gpt-4o (most capable) |
| `--turbo` | Balanced | Use gpt-4-turbo (fast and capable) |
| `--mini` | Efficiency | Use o1-mini (reasoning, cost-effective) |

**Available Models:**
- `gpt-4o` (default, best for coding)
- `o1-preview` (advanced reasoning, complex problems)
- `o1-mini` (faster reasoning, good for most tasks)
- `gpt-4-turbo` (fast, high-quality)
- `gpt-3.5-turbo` (fastest, simple tasks)

### Context & Input

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--file <path>` / `-f` | File context | Add file(s) to context |
| `--dir <path>` / `-d` | Directory context | Add entire directory recursively |
| `--stdin` | Pipe input | Read input from stdin |
| `--clipboard` | Paste context | Use clipboard content as input |
| `--url <url>` | Web content | Fetch content from URL |
| `--github <repo>` | GitHub context | Add GitHub repository |
| `--gist <id>` | GitHub Gist | Load code from Gist |

### Context Filtering

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--include <pattern>` | Filter files | Include only files matching pattern |
| `--exclude <pattern>` | Filter files | Exclude files matching pattern |
| `--gitignore` | Respect .gitignore | Honor .gitignore patterns |
| `--no-gitignore` | Ignore .gitignore | Include all files |
| `--max-files <n>` | Limit files | Maximum number of files to include |
| `--max-size <bytes>` | File size limit | Skip files larger than size |

### Code Generation

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--language <lang>` / `-l` | Target language | Specify programming language |
| `--framework <name>` | Framework context | Specify framework (React, Django, etc.) |
| `--style <guide>` | Code style | Follow style guide (PEP8, Airbnb, etc.) |
| `--pattern <name>` | Design pattern | Apply design pattern |
| `--scaffold` | Boilerplate | Generate project scaffolding |
| `--class <name>` | OOP generation | Generate class structure |
| `--function <name>` | Function generation | Generate specific function |

### Execution & Testing

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--execute` / `-e` | Run code | Execute generated code |
| `--auto-execute` | Automatic run | Always execute without asking |
| `--dry-run` | Preview only | Show code without executing |
| `--test` | Run tests | Execute tests after generation |
| `--test-framework <name>` | Testing tool | Specify test framework (pytest, jest, etc.) |
| `--coverage` | Code coverage | Generate coverage report |
| `--lint` | Code quality | Run linter on generated code |
| `--format` | Auto-format | Format code using standard formatter |

### Session Management

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--continue` / `-c` | Resume session | Continue most recent conversation |
| `--session <name>` | Named session | Use or create named session |
| `--list-sessions` | View all | List all saved sessions |
| `--load <name>` | Load session | Load specific session |
| `--save <name>` | Save session | Save current session with name |
| `--delete <name>` | Remove session | Delete specific session |
| `--export <file>` | Export session | Export session to file |
| `--import <file>` | Import session | Import session from file |

### Output Control

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--json-mode` | JSON output | Force response in JSON format |
| `--markdown` / `-md` | Markdown output | Format response as Markdown |
| `--code-only` | Extract code | Return only code blocks |
| `--comments` | Add comments | Include inline code comments |
| `--docs` | Add docstrings | Include documentation strings |
| `--print` / `-p` | One-shot | Print response and exit |
| `--output <file>` / `-o` | Save to file | Write response to file |
| `--append <file>` | Append output | Append to existing file |

### Streaming & Display

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--stream` / `-s` | Real-time output | Stream response as it generates |
| `--no-stream` | Wait for complete | Show only final response |
| `--verbose` / `-v` | Detailed logs | Show detailed execution info |
| `--quiet` / `-q` | Minimal output | Suppress non-essential output |
| `--no-color` | Plain text | Disable ANSI color codes |
| `--syntax-highlight` | Pretty code | Syntax highlight code blocks |
| `--line-numbers` | Number lines | Add line numbers to code |

### Generation Parameters

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--temperature <0.0-2.0>` / `-t` | Creativity control | Set randomness (default: 0.3 for code) |
| `--top-p <0.0-1.0>` | Nucleus sampling | Set probability threshold |
| `--max-tokens <n>` | Length limit | Maximum output tokens |
| `--presence-penalty <-2 to 2>` | Topic diversity | Penalize repeated topics |
| `--frequency-penalty <-2 to 2>` | Word variety | Penalize repeated words |
| `--stop <sequence>` | Stop generation | Stop at specific text |
| `--seed <n>` | Reproducibility | Set random seed for deterministic output |

### Git Integration

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--git-diff` | Show changes | Display git diff before conversation |
| `--commit` | Auto-commit | Commit changes after generation |
| `--commit-msg <text>` | Commit message | Set commit message |
| `--branch <name>` | Branch workflow | Create or switch to branch |
| `--push` | Auto-push | Push changes to remote |
| `--pr` | Pull request | Create pull request after changes |
| `--no-commit` | Disable commits | Prevent automatic commits |

### Code Review & Analysis

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--review` | Code review | Perform code review |
| `--security` | Security scan | Check for security vulnerabilities |
| `--performance` | Performance analysis | Analyze performance bottlenecks |
| `--complexity` | Complexity check | Calculate code complexity metrics |
| `--dependencies` | Dep analysis | Analyze and suggest dependencies |
| `--optimize` | Code optimization | Suggest optimizations |

### Architecture & Design

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--architect` | Design mode | Generate architectural design |
| `--diagram` | Visual design | Create architecture diagrams |
| `--plan` | Step-by-step | Create implementation plan |
| `--refactor` | Code refactoring | Refactor existing code |
| `--migrate` | Code migration | Migrate between frameworks/versions |
| `--modernize` | Update code | Modernize legacy code |

### AI Behavior

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--system-prompt <text>` | Behavior control | Set custom system prompt |
| `--persona <name>` | Role-playing | Use predefined persona |
| `--expert <domain>` | Domain expert | Act as domain expert |
| `--beginner` | Simple explanations | Explain for beginners |
| `--advanced` | Expert level | Assume advanced knowledge |
| `--concise` | Brief responses | Keep responses short |
| `--verbose-mode` | Detailed responses | Provide extensive explanations |

### Configuration

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--config <file>` | Custom config | Use specific config file |
| `--api-key <key>` | Auth override | Use specific OpenAI API key |
| `--org <id>` | Organization | Specify OpenAI organization ID |
| `--endpoint <url>` | Custom endpoint | Use custom API endpoint |
| `--timeout <seconds>` | Request timeout | Set request timeout |
| `--retry <count>` | Network reliability | Number of retry attempts |
| `--proxy <url>` | Network proxy | Use HTTP/HTTPS proxy |

### Logging & Debug

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--debug` / `-d` | Troubleshooting | Enable debug logging |
| `--log-file <path>` | Persistent logs | Write logs to file |
| `--log-level <level>` | Log verbosity | Set logging level |
| `--trace` | API debugging | Show API request/response |
| `--benchmark` | Performance stats | Show timing and token usage |
| `--cost` | Usage tracking | Estimate API cost |
| `--tokens` | Token count | Show token usage breakdown |

### Project Management

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--project <path>` | Project root | Set project root directory |
| `--workspace <path>` | Workspace | Set workspace directory |
| `--init` | Initialize | Initialize Codex in project |
| `--config-wizard` | Setup | Run configuration wizard |
| `--detect-project` | Auto-detect | Detect project type automatically |

### Documentation

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--doc-gen` | Generate docs | Generate documentation |
| `--readme` | README creation | Generate or update README |
| `--changelog` | Version history | Generate changelog |
| `--api-docs` | API documentation | Generate API documentation |
| `--inline-docs` | Code comments | Add inline documentation |

### Specialized Features

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--interactive` / `-i` | Chat mode | Enter interactive mode |
| `--repl` | REPL mode | Start read-eval-print loop |
| `--watch <path>` | Auto-reload | Watch files and regenerate |
| `--daemon` | Background service | Run as daemon |
| `--batch <file>` | Batch processing | Process multiple prompts from file |

### Code Formatting

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--format-style <style>` | Code style | Specify formatting style |
| `--indent <n>` | Indentation | Set indent size (spaces) |
| `--tabs` | Use tabs | Use tabs instead of spaces |
| `--line-length <n>` | Line width | Set maximum line length |
| `--trailing-comma` | Style preference | Add trailing commas |
| `--single-quotes` | Quote style | Use single quotes (JS/Python) |

### Error Handling

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--fix-errors` | Auto-fix | Automatically fix detected errors |
| `--explain-errors` | Error help | Explain error messages |
| `--handle-exceptions` | Exception handling | Add exception handling to code |
| `--fallback <model>` | Model fallback | Use fallback model on error |

### Performance & Optimization

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--cache` | Enable caching | Cache API responses |
| `--no-cache` | Disable cache | Force fresh API calls |
| `--parallel <n>` | Concurrency | Process N requests in parallel |
| `--rate-limit <n>` | Throttling | Limit requests per minute |

### Help & Documentation

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--help` / `-h` | Command help | Show help information |
| `--version` / `-V` | Version info | Show Codex version |
| `--examples` | Usage examples | Show example commands |
| `--docs` | Documentation | Open documentation |
| `--update` | Self-update | Check for and install updates |

---

## Flag Combinations (Common Patterns)

### Quick Code Generation
```bash
codex --fast --code-only "Generate a binary search function in Python"
```

### Full Feature Development
```bash
codex --file app.py --reasoning --test --lint --commit
```

### Code Review Mode
```bash
codex --file src/ --review --security --performance
```

### Interactive Development
```bash
codex -i --stream --execute --test
```

### Refactoring Workflow
```bash
codex --file legacy.py --refactor --modernize --test --format
```

### Documentation Generation
```bash
codex --dir src/ --doc-gen --readme --api-docs
```

### Batch Processing
```bash
codex --batch prompts.txt --json-mode --output results.json
```

---

## Environment Variables

| Variable | Equivalent Flag | Default |
|----------|----------------|---------|
| `OPENAI_API_KEY` | `--api-key` | None (required) |
| `CODEX_MODEL` | `--model` | `gpt-4o` |
| `CODEX_TEMPERATURE` | `--temperature` | `0.3` |
| `CODEX_MAX_TOKENS` | `--max-tokens` | `4096` |
| `CODEX_PROJECT` | `--project` | Current directory |
| `CODEX_LOG_LEVEL` | `--log-level` | `info` |

---

## Tips & Best Practices

1. **Use reasoning models**: Add `--reasoning` for complex algorithmic problems
2. **Lower temperature**: Use `--temperature 0.2` for deterministic code
3. **Test always**: Include `--test` flag for code generation
4. **Review security**: Use `--security` for production code
5. **Format code**: Always use `--format` for consistent style
6. **Save sessions**: Use `--session` for complex multi-turn work
7. **Context matters**: Add `--file` for relevant existing code
8. **Debug with flags**: Use `--debug --trace` for troubleshooting
9. **Optimize costs**: Use `--cache` for repeated contexts
10. **Commit often**: Use `--commit` to track changes

---

**Last Updated**: 2026-03-14  
**Codex Version**: Latest  
**Source**: Synced from official OpenAI documentation  
**Models**: GPT-5.4, GPT-5.3-Codex, GPT-4o, o1-preview, GPT-4 Turbo
