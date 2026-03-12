---
title: "Codex Slash Commands Reference"
tags: ["codex", "slash-commands", "cli", "reference", "openai"]
category: "Agent_Guides"
subcategory: "Codex"
---

# Codex Slash Commands Reference

Comprehensive reference for all slash commands available in Codex CLI (OpenAI coding assistant).

## Most Useful Commands (Top 10)

### 1. `/edit <file>` - Edit Files
Request Codex to edit specific files.
```bash
/edit app.py
/edit src/*.ts
```

### 2. `/add <path>` - Add to Context
Add files or directories to context.
```bash
/add src/components/
/add package.json README.md
```

### 3. `/run <command>` - Execute Command
Run shell commands and capture output.
```bash
/run npm test
/run python script.py
```

### 4. `/ask` - Ask Questions
Ask questions about the codebase without making changes.
```bash
/ask How does authentication work in this app?
```

### 5. `/architect` - Architecture Planning
Request architectural design and planning.
```bash
/architect Design a REST API for user management
```

### 6. `/review` - Code Review
Request code review of recent changes.
```bash
/review
/review src/auth.py
```

### 7. `/test <file>` - Generate Tests
Generate test cases for code.
```bash
/test src/utils.js
/test --coverage
```

### 8. `/debug` - Debug Assistance
Get help debugging issues.
```bash
/debug Why is this function returning undefined?
```

### 9. `/refactor <file>` - Refactor Code
Request code refactoring.
```bash
/refactor src/legacy-code.js
```

### 10. `/undo` - Undo Changes
Undo the last Codex modification.
```bash
/undo
```

---

## Context Management

### `/add <path>` - Add to Context
Add files to conversation context.
```bash
/add src/
/add *.py
/add package.json tsconfig.json
```

### `/drop <path>` - Remove from Context
Remove files from context.
```bash
/drop old-file.js
/drop tests/
```

### `/context` - Show Context
Display current context (files, tokens, etc.).
```bash
/context
```

### `/clear` - Clear Context
Clear all files from context.
```bash
/clear
```

### `/ls [path]` - List Files
List files in directory.
```bash
/ls
/ls src/components/
```

### `/tree [path]` - Directory Tree
Show directory structure.
```bash
/tree
/tree src/
```

---

## Code Editing

### `/edit <file>` - Edit Files
Request edits to specific files.
```bash
/edit app.py
/edit src/**/*.ts
```

### `/create <file>` - Create File
Create a new file with content.
```bash
/create src/newModule.py
```

### `/delete <file>` - Delete File
Delete a file.
```bash
/delete temp.js
```

### `/rename <old> <new>` - Rename File
Rename or move a file.
```bash
/rename old-name.py new-name.py
```

### `/refactor <file>` - Refactor Code
Request code refactoring.
```bash
/refactor messy-code.js
/refactor --improve-performance
```

---

## Development Workflow

### `/run <command>` - Execute Commands
Run shell commands.
```bash
/run pip install requests
/run npm run build
/run git status
```

### `/test [pattern]` - Run Tests
Execute tests.
```bash
/test
/test auth
/test --watch
```

### `/lint [path]` - Run Linter
Run linting on code.
```bash
/lint
/lint src/
```

### `/format [path]` - Format Code
Format code using project formatter.
```bash
/format
/format src/app.js
```

### `/build` - Build Project
Run project build command.
```bash
/build
/build --production
```

---

## Code Generation

### `/scaffold <type>` - Generate Boilerplate
Generate project scaffolding or boilerplate.
```bash
/scaffold component UserProfile
/scaffold api users
/scaffold test auth
```

### `/generate <type>` - Generate Code
Generate specific code patterns.
```bash
/generate model User
/generate controller api
/generate migration add_users
```

### `/implement <spec>` - Implement Feature
Implement a feature from specification.
```bash
/implement Add password reset functionality
```

---

## Testing & Quality

### `/test <file>` - Generate Tests
Create test cases for code.
```bash
/test src/auth.py
/test --unit
/test --integration
```

### `/coverage` - Test Coverage
Show test coverage report.
```bash
/coverage
```

### `/review [file]` - Code Review
Request code review.
```bash
/review
/review src/critical-module.js
```

### `/security` - Security Review
Perform security analysis.
```bash
/security
/security src/api/
```

### `/performance` - Performance Analysis
Analyze performance bottlenecks.
```bash
/performance
```

---

## Git Integration

### `/diff` - Show Changes
Display uncommitted changes.
```bash
/diff
/diff --staged
```

### `/commit <message>` - Commit Changes
Stage and commit changes.
```bash
/commit "feat: add user authentication"
```

### `/status` - Git Status
Show git status.
```bash
/status
```

### `/log [n]` - Git Log
Show recent commits.
```bash
/log
/log 20
```

### `/branch` - Show Branch
Display current branch.
```bash
/branch
```

### `/pr` - Create Pull Request
Create a pull request.
```bash
/pr "Add authentication feature"
```

---

## Documentation

### `/docs [file]` - Generate Documentation
Generate documentation for code.
```bash
/docs src/api.py
/docs --format markdown
```

### `/comment <file>` - Add Comments
Add comments to code.
```bash
/comment src/complex-logic.js
```

### `/readme` - Generate README
Generate or update README file.
```bash
/readme
```

### `/changelog` - Generate Changelog
Create changelog from git history.
```bash
/changelog
/changelog --since v1.0.0
```

---

## Architecture & Design

### `/architect` - Architectural Design
Get architectural guidance.
```bash
/architect Design a microservices architecture for e-commerce
```

### `/diagram` - Generate Diagrams
Create architectural diagrams.
```bash
/diagram database-schema
/diagram component-hierarchy
```

### `/plan` - Create Implementation Plan
Generate step-by-step implementation plan.
```bash
/plan Migrate from MongoDB to PostgreSQL
```

### `/design <pattern>` - Apply Design Pattern
Apply design patterns to code.
```bash
/design singleton DatabaseConnection
/design factory PaymentProcessor
```

---

## Debugging & Analysis

### `/debug` - Debug Assistance
Get debugging help.
```bash
/debug Why is this function failing?
```

### `/trace <function>` - Trace Execution
Analyze function execution flow.
```bash
/trace calculateTotal
```

### `/analyze [file]` - Static Analysis
Perform code analysis.
```bash
/analyze
/analyze src/problematic.py
```

### `/errors` - Explain Errors
Get help with error messages.
```bash
/errors
```

### `/fix` - Auto-fix Issues
Automatically fix common issues.
```bash
/fix
/fix linting-errors
```

---

## AI & Model Control

### `/model <name>` - Switch Model
Change the active OpenAI model.
```bash
/model gpt-4-turbo
/model gpt-4o
/model o1-preview
```

**Available Models:**
- `o1-preview` - Advanced reasoning (best for complex problems)
- `o1-mini` - Faster reasoning
- `gpt-4o` - Latest multimodal model
- `gpt-4-turbo` - Fast and capable
- `gpt-3.5-turbo` - Fastest, economical

### `/temperature <value>` - Set Temperature
Adjust creativity/randomness (0.0-2.0).
```bash
/temperature 0.3
/temperature 1.0
```

### `/thinking` - Toggle Reasoning
Enable extended thinking/reasoning mode.
```bash
/thinking on
/thinking off
```

---

## Session Management

### `/save [name]` - Save Session
Save current conversation.
```bash
/save feature-development
```

### `/load <name>` - Load Session
Load a saved session.
```bash
/load feature-development
```

### `/sessions` - List Sessions
Show all saved sessions.
```bash
/sessions
```

### `/history` - Command History
Show command history.
```bash
/history
/history 50
```

---

## Questions & Learning

### `/ask` - Ask Questions
Ask about the codebase.
```bash
/ask How does the authentication flow work?
```

### `/explain <file>` - Explain Code
Get explanation of code.
```bash
/explain src/algorithm.py
```

### `/learn <topic>` - Learn About Topic
Get tutorials or explanations.
```bash
/learn design patterns in Python
```

### `/compare <a> <b>` - Compare Approaches
Compare different approaches.
```bash
/compare REST vs GraphQL
```

---

## Project Management

### `/tasks` - List Tasks
Show project tasks and TODOs.
```bash
/tasks
```

### `/todo` - Find TODOs
Find TODO comments in code.
```bash
/todo
/todo --priority
```

### `/roadmap` - Project Roadmap
Generate or update project roadmap.
```bash
/roadmap
```

### `/estimate <task>` - Time Estimate
Estimate time for a task.
```bash
/estimate Implement OAuth integration
```

---

## Configuration

### `/config` - Show Configuration
Display Codex configuration.
```bash
/config
```

### `/config set <key> <value>` - Set Config
Update configuration.
```bash
/config set auto-test true
/config set format-on-save true
```

### `/config get <key>` - Get Config
Get configuration value.
```bash
/config get model
```

---

## Utility Commands

### `/undo` - Undo Last Change
Undo last file modification.
```bash
/undo
```

### `/redo` - Redo Last Undo
Redo undone operation.
```bash
/redo
```

### `/pwd` - Working Directory
Show current directory.
```bash
/pwd
```

### `/cd <path>` - Change Directory
Change working directory.
```bash
/cd src/
```

### `/grep <pattern>` - Search Code
Search for patterns in code.
```bash
/grep "import.*axios"
```

### `/find <pattern>` - Find Files
Find files by pattern.
```bash
/find "*.test.js"
```

---

## Advanced Features

### `/bench [file]` - Benchmark
Run performance benchmarks.
```bash
/bench src/algorithm.py
```

### `/profile [file]` - Profile Code
Profile code execution.
```bash
/profile src/slow-function.js
```

### `/optimize <file>` - Optimize Code
Optimize for performance.
```bash
/optimize src/bottleneck.py
```

### `/migrate <from> <to>` - Code Migration
Migrate code between frameworks/versions.
```bash
/migrate python2 python3
/migrate react-class-components react-hooks
```

---

## Help & Documentation

### `/help` - Show Help
Display all commands.
```bash
/help
```

### `/docs` - View Documentation
View Codex documentation.
```bash
/docs
/docs commands
```

### `/examples` - Show Examples
Display example workflows.
```bash
/examples
```

### `/version` - Show Version
Display Codex version.
```bash
/version
```

---

## Exit & Cleanup

### `/exit` or `/quit` - Exit Codex
Exit the CLI.
```bash
/exit
```

### `/reset` - Reset Session
Clear conversation and start fresh.
```bash
/reset
```

---

## Keyboard Shortcuts

- **Ctrl+C**: Cancel current operation
- **Ctrl+D**: Exit (same as /exit)
- **↑/↓**: Navigate command history
- **Tab**: Auto-complete (paths, commands)
- **Ctrl+R**: Search command history

---

## Tips & Best Practices

1. **Add relevant files first**: Use `/add` to provide context before asking
2. **Use `/ask` for questions**: Don't request edits if you just want information
3. **Leverage `/architect`**: For design guidance before coding
4. **Review before committing**: Use `/review` to catch issues
5. **Generate tests early**: Use `/test` during development, not after
6. **Save important sessions**: Use `/save` for complex work
7. **Choose the right model**:
   - `o1-preview` for complex algorithmic problems
   - `gpt-4o` for general coding
   - `gpt-3.5-turbo` for simple tasks
8. **Use `/thinking on`**: For complex debugging or architectural decisions
9. **Automate workflows**: Chain commands for common tasks
10. **Keep context lean**: Drop unnecessary files with `/drop`

---

## Common Workflows

### Feature Development
```bash
/add src/
/architect Add payment processing feature
/implement payment processing
/test src/payment.js
/review
/commit "feat: add payment processing"
```

### Bug Fixing
```bash
/add src/problematic-file.js
/debug Why is X happening?
/edit src/problematic-file.js
/test
/commit "fix: resolve issue with X"
```

### Refactoring
```bash
/add src/legacy/
/review src/legacy/old-code.js
/refactor src/legacy/old-code.js
/test --all
/commit "refactor: modernize legacy code"
```

### Test Generation
```bash
/add src/utils.js
/test src/utils.js --unit
/coverage
/commit "test: add unit tests for utils"
```

---

**Last Updated**: March 2026  
**Codex Version**: Latest  
**Supported Models**: GPT-4o, o1-preview, GPT-4 Turbo
