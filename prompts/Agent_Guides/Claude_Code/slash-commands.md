---
title: "Claude Code Slash Commands Reference"
tags: ["claude-code", "slash-commands", "cli", "reference"]
category: "Agent_Guides"
subcategory: "Claude_Code"
---

# Claude Code Slash Commands Reference

Comprehensive reference for all slash commands available in Claude Code CLI.

## Most Useful Commands (Top 10)

### 1. `/edit <file>` - Edit Files
Edit a specific file or multiple files with AI assistance.
```bash
/edit src/app.ts
/edit src/*.tsx
```

### 2. `/add <path>` - Add Files to Context
Add files or directories to the conversation context.
```bash
/add src/components/
/add package.json
```

### 3. `/drop <path>` - Remove from Context
Remove files from the conversation context.
```bash
/drop src/old-code.ts
/drop tests/
```

### 4. `/run <command>` - Execute Shell Commands
Run shell commands and capture output.
```bash
/run npm test
/run git status
```

### 5. `/search <pattern>` - Search Codebase
Search for patterns across the codebase.
```bash
/search "TODO:"
/search function.*main
```

### 6. `/diff` - Show Changes
Display uncommitted changes in the working directory.
```bash
/diff
```

### 7. `/undo` - Undo Last Operation
Undo the last file operation performed by Claude.
```bash
/undo
```

### 8. `/task <description>` - Create Task
Create a multi-step task for Claude to execute.
```bash
/task Refactor authentication module to use JWT tokens
```

### 9. `/help` - Show Available Commands
Display all available slash commands.
```bash
/help
```

### 10. `/context` - View Current Context
Show all files currently in the conversation context.
```bash
/context
```

---

## File Management Commands

### `/ls [path]` - List Files
List files and directories in the workspace.
```bash
/ls
/ls src/
```

### `/cat <file>` - Display File Contents
Show the contents of a file.
```bash
/cat README.md
```

### `/tree [path]` - Show Directory Tree
Display directory structure as a tree.
```bash
/tree
/tree src/
```

### `/find <pattern>` - Find Files
Find files matching a pattern.
```bash
/find "*.test.ts"
/find component
```

### `/grep <pattern>` - Search File Contents
Search for text patterns in files.
```bash
/grep "import React"
/grep -i "todo"
```

---

## Context Management

### `/context` - Show Context
Display current context (files, tokens, etc.).
```bash
/context
```

### `/add <path>` - Add to Context
Add files or directories to context.
```bash
/add src/utils/
/add *.md
```

### `/drop <path>` - Remove from Context
Remove files from context.
```bash
/drop old-code.js
```

### `/clear` - Clear Context
Remove all files from context.
```bash
/clear
```

### `/reset` - Reset Conversation
Start a fresh conversation, clearing all context and history.
```bash
/reset
```

---

## Code Editing

### `/edit <file>` - Edit Files
Request edits to specific files.
```bash
/edit app.py
/edit src/**/*.ts
```

### `/create <file>` - Create New File
Create a new file with specified content.
```bash
/create src/newComponent.tsx
```

### `/delete <file>` - Delete File
Delete a file from the workspace.
```bash
/delete temp.js
```

### `/rename <old> <new>` - Rename File
Rename or move a file.
```bash
/rename old.js new.js
```

### `/move <source> <dest>` - Move File
Move file to a different location.
```bash
/move src/old.ts src/components/new.ts
```

---

## Development Workflow

### `/run <command>` - Execute Command
Run shell commands and capture output.
```bash
/run npm install
/run pytest
/run git log --oneline -10
```

### `/test [pattern]` - Run Tests
Execute test suite or specific tests.
```bash
/test
/test auth
```

### `/lint [path]` - Run Linter
Run linting on files.
```bash
/lint
/lint src/
```

### `/format [path]` - Format Code
Format code using project's formatter.
```bash
/format
/format src/app.ts
```

### `/build` - Build Project
Run the project's build command.
```bash
/build
```

---

## Git Integration

### `/diff` - Show Git Diff
Display uncommitted changes.
```bash
/diff
```

### `/commit <message>` - Git Commit
Stage and commit changes.
```bash
/commit "feat: add user authentication"
```

### `/status` - Git Status
Show git status of the repository.
```bash
/status
```

### `/log [count]` - Git Log
Show recent git commits.
```bash
/log
/log 20
```

### `/branch` - Show Git Branch
Display current git branch.
```bash
/branch
```

---

## Task Management

### `/task <description>` - Create Task
Define a multi-step task for Claude to execute.
```bash
/task Add error handling to all API endpoints
```

### `/tasks` - List Tasks
Show all active tasks.
```bash
/tasks
```

### `/task cancel <id>` - Cancel Task
Cancel a specific task.
```bash
/task cancel 1
```

---

## Search & Analysis

### `/search <pattern>` - Search Codebase
Search for patterns across all files.
```bash
/search "deprecated"
/search function.*\(
```

### `/refs <symbol>` - Find References
Find all references to a symbol.
```bash
/refs MyComponent
```

### `/def <symbol>` - Go to Definition
Show the definition of a symbol.
```bash
/def authenticate
```

### `/analyze [path]` - Analyze Code
Perform static analysis on code.
```bash
/analyze
/analyze src/auth.ts
```

---

## Documentation

### `/docs [topic]` - View Documentation
View Claude Code documentation.
```bash
/docs
/docs commands
```

### `/explain <file>` - Explain Code
Get explanation of code in a file.
```bash
/explain src/complex-algorithm.ts
```

### `/comment <file>` - Add Comments
Request comments to be added to code.
```bash
/comment src/utils.ts
```

---

## Configuration

### `/config` - Show Configuration
Display current Claude Code configuration.
```bash
/config
```

### `/config set <key> <value>` - Set Config
Set a configuration value.
```bash
/config set model claude-3-5-sonnet-20241022
```

### `/config get <key>` - Get Config Value
Get a specific configuration value.
```bash
/config get model
```

---

## Session Management

### `/save [name]` - Save Session
Save the current conversation session.
```bash
/save my-feature-work
```

### `/load <name>` - Load Session
Load a previously saved session.
```bash
/load my-feature-work
```

### `/sessions` - List Sessions
Show all saved sessions.
```bash
/sessions
```

---

## Utility Commands

### `/undo` - Undo Last Change
Undo the last file modification.
```bash
/undo
```

### `/redo` - Redo Last Undo
Redo the last undone operation.
```bash
/redo
```

### `/history` - Show History
Display command history.
```bash
/history
```

### `/cd <path>` - Change Directory
Change the working directory.
```bash
/cd src/
```

### `/pwd` - Print Working Directory
Show current working directory.
```bash
/pwd
```

### `/exit` or `/quit` - Exit Claude Code
Exit the Claude Code CLI.
```bash
/exit
```

---

## Advanced Features

### `/thinking` - Toggle Thinking Mode
Enable/disable extended thinking for complex tasks.
```bash
/thinking on
/thinking off
```

### `/model <name>` - Switch Model
Switch to a different Claude model.
```bash
/model claude-3-5-sonnet-20241022
/model claude-3-opus-20240229
```

### `/token-usage` - Show Token Usage
Display token usage statistics for the session.
```bash
/token-usage
```

### `/verbose` - Toggle Verbose Mode
Enable/disable verbose output.
```bash
/verbose on
```

---

## Keyboard Shortcuts (Non-slash)

- **Ctrl+C**: Cancel current operation
- **Ctrl+D**: Exit (same as /exit)
- **↑/↓**: Navigate command history
- **Tab**: Auto-complete (file paths, commands)

---

## Tips & Best Practices

1. **Start with `/add`**: Add relevant files to context before asking questions
2. **Use `/context` frequently**: Check what's in context to avoid token bloat
3. **Leverage `/task`**: For complex multi-step operations
4. **Check `/diff` before committing**: Review changes Claude made
5. **Save important sessions**: Use `/save` for work you want to resume later
6. **Use wildcards**: `/add src/**/*.ts` adds all TypeScript files
7. **Chain commands**: Describe complex workflows in natural language
8. **Monitor tokens**: Use `/token-usage` to stay within limits

---

## Command Syntax Notes

- **`<arg>`**: Required argument
- **`[arg]`**: Optional argument
- **`path`**: File or directory path (supports wildcards: `*`, `**`, `?`)
- **`pattern`**: Search pattern (supports regex)

---

**Last Updated**: March 2026  
**Claude Code Version**: Latest
