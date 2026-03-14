---
title: "Gemini CLI Slash Commands Reference"
tags: ["gemini-cli", "slash-commands", "cli", "reference", "google"]
category: "Agent_Guides"
subcategory: "Gemini_CLI"
---

# Gemini CLI Slash Commands Reference

Comprehensive reference for all slash commands available in Gemini CLI.

## Most Useful Commands (Top 10)

### 1. `/add <file>` - Add File to Context
Add files to the conversation context.
```bash
/add src/app.py
/add docs/*.md
```

### 2. `/web <url>` - Add Web Content
Fetch and add web page content to context.
```bash
/web https://example.com/api-docs
```

### 3. `/model <name>` - Switch Model
Switch between Gemini models.
```bash
/model gemini-2.0-flash-exp
/model gemini-1.5-pro
```

### 4. `/image <path>` - Analyze Image
Add and analyze images.
```bash
/image screenshot.png
/image photos/*.jpg
```

### 5. `/video <path>` - Analyze Video
Add and analyze video files.
```bash
/video demo.mp4
```

### 6. `/audio <path>` - Analyze Audio
Add and analyze audio files.
```bash
/audio recording.mp3
```

### 7. `/clear` - Clear Context
Clear all context (files, images, etc.).
```bash
/clear
```

### 8. `/save <name>` - Save Session
Save current conversation session.
```bash
/save project-planning
```

### 9. `/load <name>` - Load Session
Load a previously saved session.
```bash
/load project-planning
```

### 10. `/help` - Show Commands
Display all available slash commands.
```bash
/help
```

---

## Context Management

### `/add <file>` - Add Files
Add files to conversation context.
```bash
/add README.md
/add src/**/*.py
```

### `/context` - Show Context
Display current context (files, tokens, media).
```bash
/context
```

### `/drop <file>` - Remove from Context
Remove files from context.
```bash
/drop old-notes.md
```

### `/clear` - Clear All Context
Remove all files and media from context.
```bash
/clear
```

### `/reset` - Reset Conversation
Start a fresh conversation.
```bash
/reset
```

---

## Multimodal Commands

### `/image <path>` - Add Image
Add images for analysis.
```bash
/image diagram.png
/image screenshots/*.png
```

### `/video <path>` - Add Video
Add video files for analysis.
```bash
/video tutorial.mp4
/video clips/demo.webm
```

### `/audio <path>` - Add Audio
Add audio files for analysis (transcription, analysis).
```bash
/audio podcast.mp3
/audio interview.wav
```

### `/pdf <path>` - Add PDF
Add PDF documents to context.
```bash
/pdf report.pdf
/pdf docs/*.pdf
```

### `/doc <path>` - Add Document
Add various document formats (DOCX, PPTX, etc.).
```bash
/doc presentation.pptx
/doc report.docx
```

---

## Web & Search

### `/web <url>` - Fetch Web Content
Add web page content to context.
```bash
/web https://docs.python.org/3/library/
```

### `/search <query>` - Web Search
Perform a web search and use results.
```bash
/search "latest Gemini API updates"
```

### `/yt <url>` - YouTube Video
Add YouTube video transcript to context.
```bash
/yt https://youtube.com/watch?v=xxx
```

---

## Model & Configuration

### `/model <name>` - Switch Model
Change the active Gemini model.
```bash
/model gemini-2.5-flash
/model gemini-3-pro
/model gemini-3-flash
```

**Available Models (2026):**
- `gemini-2.5-flash` - Latest flash model, fast with excellent quality
- `gemini-3-pro` - Most capable with improved reasoning, 1M token context
- `gemini-3-flash` - Balanced speed and quality, 1M token context
- `gemini-2.0-flash-exp` - Experimental flash variant
- `gemini-1.5-pro-002` - Previous generation Pro (still highly capable)
- `gemini-1.5-flash-002` - Previous generation Flash
- `gemini-1.5-flash-8b` - Ultra-fast for simple tasks

### `/models` - List Models
Show all available Gemini models.
```bash
/models
```

### `/config` - Show Configuration
Display current Gemini CLI configuration.
```bash
/config
```

### `/api-key <key>` - Set API Key
Set or update Google AI API key.
```bash
/api-key YOUR_API_KEY_HERE
```

---

## Code Execution & Tools

### `/code <language>` - Execute Code
Run code in various languages (experimental).
```bash
/code python
/code javascript
```

### `/tools` - Enable Tools
Enable function calling and tool use.
```bash
/tools on
/tools off
```

### `/grounding` - Toggle Grounding
Enable/disable Google Search grounding.
```bash
/grounding on
/grounding off
```

---

## Session Management

### `/save <name>` - Save Session
Save the current conversation.
```bash
/save research-project
/save code-review-2024
```

### `/load <name>` - Load Session
Load a previously saved session.
```bash
/load research-project
```

### `/sessions` - List Sessions
Show all saved sessions.
```bash
/sessions
```

### `/delete <name>` - Delete Session
Delete a saved session.
```bash
/delete old-project
```

---

## Output & Export

### `/export <format>` - Export Conversation
Export conversation in various formats.
```bash
/export markdown
/export json
/export html
```

### `/copy` - Copy Last Response
Copy the last AI response to clipboard.
```bash
/copy
```

### `/save-response <file>` - Save Response
Save the last response to a file.
```bash
/save-response output.md
```

---

## Thinking & Reasoning

### `/thinking` - Toggle Extended Thinking
Enable extended thinking mode (Gemini 2.0).
```bash
/thinking on
/thinking off
```

### `/chain-of-thought` - Enable CoT
Enable explicit chain-of-thought reasoning.
```bash
/chain-of-thought on
```

### `/deep-research` - Deep Research Mode
Enable comprehensive research mode.
```bash
/deep-research on
```

---

## Advanced Features

### `/temperature <value>` - Set Temperature
Set sampling temperature (0.0-2.0).
```bash
/temperature 0.7
/temperature 1.2
```

### `/max-tokens <count>` - Set Max Output
Set maximum output tokens.
```bash
/max-tokens 2048
/max-tokens 8192
```

### `/top-p <value>` - Set Top-P Sampling
Set nucleus sampling parameter (0.0-1.0).
```bash
/top-p 0.95
```

### `/top-k <value>` - Set Top-K Sampling
Set top-k sampling parameter.
```bash
/top-k 40
```

### `/safety <level>` - Set Safety Level
Set content safety filtering level.
```bash
/safety low
/safety medium
/safety high
```

---

## System & Utility

### `/pwd` - Print Working Directory
Show current working directory.
```bash
/pwd
```

### `/cd <path>` - Change Directory
Change working directory.
```bash
/cd src/
/cd ../
```

### `/ls [path]` - List Files
List files in directory.
```bash
/ls
/ls src/
```

### `/cat <file>` - Display File
Show file contents.
```bash
/cat README.md
```

### `/tokens` - Show Token Count
Display token usage for current context.
```bash
/tokens
```

### `/cost` - Show Cost Estimate
Estimate API cost for current session.
```bash
/cost
```

---

## Help & Documentation

### `/help` - Show Help
Display all available commands.
```bash
/help
```

### `/docs [topic]` - View Documentation
View Gemini CLI documentation.
```bash
/docs
/docs models
/docs multimodal
```

### `/examples` - Show Examples
Show example commands and use cases.
```bash
/examples
```

### `/version` - Show Version
Display Gemini CLI version.
```bash
/version
```

---

## Prompt Management

### `/system <text>` - Set System Prompt
Set a custom system prompt.
```bash
/system You are a helpful Python expert specializing in data science.
```

### `/persona <name>` - Load Persona
Load a predefined persona/character.
```bash
/persona data-scientist
/persona creative-writer
```

### `/prompt-template <name>` - Use Template
Apply a prompt template.
```bash
/prompt-template code-review
/prompt-template summarize
```

---

## Collaboration Features

### `/share` - Share Session
Generate a shareable link to the session.
```bash
/share
```

### `/collaborate <user>` - Start Collaboration
Start collaborative session (if available).
```bash
/collaborate user@example.com
```

---

## Debug & Diagnostics

### `/debug` - Toggle Debug Mode
Enable/disable debug output.
```bash
/debug on
/debug off
```

### `/verbose` - Toggle Verbose Mode
Enable/disable verbose logging.
```bash
/verbose on
```

### `/trace` - Show API Trace
Display API request/response trace.
```bash
/trace on
```

### `/latency` - Show Latency Stats
Display request latency statistics.
```bash
/latency
```

---

## Exit & Cleanup

### `/exit` or `/quit` - Exit CLI
Exit Gemini CLI.
```bash
/exit
```

### `/clear-cache` - Clear Cache
Clear cached data.
```bash
/clear-cache
```

---

## Keyboard Shortcuts

- **Ctrl+C**: Cancel current request
- **Ctrl+D**: Exit (same as /exit)
- **↑/↓**: Navigate command history
- **Tab**: Auto-complete commands
- **Ctrl+R**: Search command history

---

## Tips & Best Practices

1. **Use multimodal features**: Gemini excels at analyzing images, videos, and documents
2. **Enable grounding for facts**: Use `/grounding on` for factual queries
3. **Choose the right model**: 
   - `gemini-3-pro` for complex reasoning and advanced tasks (1M token context)
   - `gemini-2.5-flash` for speed with excellent quality
   - `gemini-3-flash` for balanced performance
   - `gemini-1.5-flash-8b` for simple, quick tasks
4. **Manage context carefully**: Check `/tokens` to avoid hitting limits (1M token context available on Gemini 3 models)
5. **Save important sessions**: Use `/save` for work you want to continue
6. **Leverage thinking mode**: Enable `/thinking on` for complex problems
7. **Use web search**: `/web` and `/search` for up-to-date information
8. **Combine modalities**: Add images, PDFs, and code together for comprehensive analysis

---

## Common Workflows

### Code Review
```bash
/add src/app.py
/system You are an expert code reviewer
Review this code for bugs and suggest improvements
```

### Research Assistant
```bash
/grounding on
/thinking on
/search "latest AI research papers 2024"
Summarize the key findings
```

### Document Analysis
```bash
/pdf report.pdf
/image chart.png
Analyze the financial report and explain the trends shown in the chart
```

### Video Understanding
```bash
/video tutorial.mp4
/yt https://youtube.com/watch?v=xxx
Summarize the key points from both videos
```

---

**Last Updated**: 2026-03-14  
**Gemini CLI Version**: Latest  
**Source**: Synced from official Google Gemini CLI documentation  
**Supported Models**: Gemini 2.5 Flash, Gemini 3.0 Pro/Flash (1M token context)
