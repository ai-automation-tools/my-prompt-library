---
title: "Gemini CLI Flags Reference"
tags: ["gemini-cli", "flags", "cli", "reference", "google", "options"]
category: "Agent_Guides"
subcategory: "Gemini_CLI"
---

# Gemini CLI Flags Reference

Comprehensive reference for all command-line flags available in Gemini CLI.

## Most Popular Flags (Top 10)

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--model <name>` / `-m` | Model selection | Specify which Gemini model to use |
| `--thinking` | Complex reasoning tasks | Enable extended thinking mode (Gemini 2.0) |
| `--image <path>` / `-i` | Visual analysis | Add image(s) to the prompt |
| `--file <path>` / `-f` | Document context | Add file(s) to context |
| `--web <url>` / `-w` | Web content | Fetch and include web page content |
| `--grounding` | Factual queries | Enable Google Search grounding |
| `--json` | Structured output | Return response in JSON format |
| `--temperature <value>` / `-t` | Control randomness | Set response creativity (0.0-2.0) |
| `--max-tokens <n>` | Response length | Limit output token count |
| `--stream` / `-s` | Real-time output | Stream response as it generates |

---

## All Flags by Category

### Model Selection

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--model <name>` / `-m` | Model override | Specify Gemini model to use |
| `--model-list` | Available models | Show all available models |
| `--flash` | Speed priority | Use Gemini 2.0 Flash (fastest) |
| `--pro` | Quality priority | Use Gemini 1.5 Pro (most capable) |
| `--experimental` | Latest features | Use experimental model version |
| `--thinking` | Deep reasoning | Enable thinking mode (Gemini 2.0) |
| `--thinking-budget <n>` | Thinking depth | Set token budget for thinking |

**Available Models:**
- `gemini-2.0-flash-exp` (default, fast with good quality)
- `gemini-1.5-pro-002` (most capable, best for complex tasks)
- `gemini-1.5-flash-002` (balanced speed and quality)
- `gemini-1.5-flash-8b` (ultra-fast, simple tasks)
- `gemini-exp-1206` (experimental, latest features)

### Input & Context

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--file <path>` / `-f` | File context | Add text file(s) to context |
| `--image <path>` / `-i` | Image analysis | Add image(s) for visual understanding |
| `--video <path>` / `-v` | Video analysis | Add video file(s) for analysis |
| `--audio <path>` / `-a` | Audio processing | Add audio file(s) for transcription/analysis |
| `--pdf <path>` | PDF documents | Add PDF document(s) to context |
| `--doc <path>` | Office docs | Add DOCX, PPTX, XLSX files |
| `--url <url>` | Web content | Fetch content from URL |
| `--web <url>` / `-w` | Web scraping | Add web page content to context |
| `--youtube <url>` / `--yt` | YouTube videos | Add YouTube video transcript |

### Multimodal Options

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--image-quality <level>` | Image processing | Set image quality (low/medium/high) |
| `--video-fps <n>` | Video sampling | Set frames per second to analyze |
| `--video-start <time>` | Video segments | Start video analysis at timestamp |
| `--video-end <time>` | Video segments | End video analysis at timestamp |
| `--audio-format <fmt>` | Audio input | Specify audio format (mp3/wav/m4a) |
| `--ocr` | Text extraction | Extract text from images/PDFs |
| `--vision-mode <mode>` | Image understanding | Set vision mode (auto/detailed/fast) |

### Search & Grounding

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--grounding` / `-g` | Factual queries | Enable Google Search grounding |
| `--search <query>` | Web search | Perform Google Search and use results |
| `--search-lang <lang>` | Regional search | Set search language (e.g., en, es, fr) |
| `--search-region <code>` | Regional search | Set search region (e.g., US, GB, JP) |
| `--citations` | Source tracking | Include citations in response |
| `--no-grounding` | Disable search | Explicitly disable grounding |

### Output Control

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--json` / `-j` | Structured data | Output in JSON format |
| `--markdown` / `-md` | Formatted text | Output in Markdown format |
| `--code-only` | Extract code | Return only code blocks |
| `--stream` / `-s` | Real-time output | Stream response as it generates |
| `--no-stream` | Wait for completion | Show complete response at once |
| `--print` / `-p` | One-shot output | Print response and exit |
| `--quiet` / `-q` | Minimal output | Suppress non-essential output |
| `--verbose` | Detailed logs | Show detailed execution information |
| `--no-color` | Plain text | Disable ANSI color codes |

### Generation Parameters

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--temperature <0.0-2.0>` / `-t` | Response variation | Control creativity/randomness (default: 1.0) |
| `--top-p <0.0-1.0>` | Nucleus sampling | Set probability threshold (default: 0.95) |
| `--top-k <n>` | Token sampling | Set number of top tokens to consider |
| `--max-tokens <n>` | Response length | Limit output token count |
| `--presence-penalty <-2 to 2>` | Topic diversity | Penalize repeated topics |
| `--frequency-penalty <-2 to 2>` | Word repetition | Penalize repeated words |
| `--stop <sequence>` | Generation control | Stop at specified text |

### Safety & Filtering

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--safety <level>` | Content filtering | Set safety level (off/low/medium/high) |
| `--harm-block-threshold <level>` | Category threshold | Set harm blocking threshold per category |
| `--allow-dangerous` | Bypass filters | Reduce safety restrictions (use carefully) |
| `--block-none` | No filtering | Disable all content filtering |
| `--strict-safety` | Maximum safety | Enable strictest safety settings |

**Safety Categories:**
- `harassment`
- `hate-speech`
- `sexually-explicit`
- `dangerous-content`

### Code Execution & Tools

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--code-execution` | Run code | Enable code interpreter |
| `--tools` | Function calling | Enable tool use/function calling |
| `--no-tools` | Disable tools | Explicitly disable tool use |
| `--python` | Python env | Enable Python code execution |
| `--bash` | Shell execution | Enable bash command execution |
| `--sandbox` | Isolated execution | Run code in sandbox |

### Session Management

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--continue` / `-c` | Resume work | Continue most recent conversation |
| `--session <name>` | Named session | Use or create named session |
| `--list-sessions` | View sessions | List all saved sessions |
| `--delete-session <name>` | Cleanup | Delete specific session |
| `--export-session <file>` | Backup | Export session to file |
| `--import-session <file>` | Restore | Import session from file |
| `--clear-history` | Fresh start | Clear conversation history |

### System Prompts & Persona

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--system <text>` | Behavior control | Set custom system prompt |
| `--system-file <path>` | Load prompt | Load system prompt from file |
| `--persona <name>` | Predefined role | Load predefined persona |
| `--character <name>` | Character mode | Use character/style preset |
| `--no-system` | Remove system | Disable system prompt |

### Configuration

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--config <file>` | Custom config | Use specific config file |
| `--api-key <key>` | Auth override | Use specific Google AI API key |
| `--project <id>` | GCP project | Specify Google Cloud project ID |
| `--location <region>` | API region | Set API endpoint region |
| `--timeout <seconds>` | Request timeout | Set request timeout duration |
| `--retry <count>` | Network reliability | Set number of retry attempts |

### Cache & Performance

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--cache` | Speed optimization | Enable context caching |
| `--no-cache` | Fresh requests | Disable caching |
| `--cache-ttl <seconds>` | Cache duration | Set cache time-to-live |
| `--parallel <n>` | Batch requests | Process multiple requests in parallel |
| `--batch` | Bulk processing | Enable batch mode |

### Logging & Debug

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--debug` / `-d` | Troubleshooting | Enable debug logging |
| `--log-file <path>` | Persistent logs | Write logs to file |
| `--log-level <level>` | Log verbosity | Set logging level (debug/info/warn/error) |
| `--trace` | API debugging | Show API request/response details |
| `--benchmark` | Performance | Show timing and token usage |
| `--cost` | Usage tracking | Estimate API cost |

### Prompt Engineering

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--few-shot <file>` | Example learning | Provide few-shot examples |
| `--cot` | Reasoning | Enable chain-of-thought prompting |
| `--self-consistency <n>` | Multiple samples | Generate N responses and choose best |
| `--retry-on-error <n>` | Error handling | Retry failed generations N times |

### Output Processing

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--save <path>` | Save response | Save response to file |
| `--append <path>` | Append output | Append response to existing file |
| `--clipboard` | Quick copy | Copy response to clipboard |
| `--browser` | View in browser | Open response in web browser |
| `--diff` | Compare output | Show diff with previous response |

### Specialized Modes

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--chat` | Conversation mode | Enter interactive chat mode |
| `--repl` | Interactive shell | Start read-eval-print loop |
| `--watch <path>` | Auto-reload | Watch file and regenerate on changes |
| `--pipe` | Unix pipeline | Read from stdin, write to stdout |
| `--daemon` | Background service | Run as background service |

### Language & Localization

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--lang <code>` | Response language | Set response language (e.g., en, es, fr, ja) |
| `--translate-to <lang>` | Auto-translate | Translate response to specified language |
| `--detect-language` | Auto-detect | Detect and use input language |

### Experimental Features

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--experimental-features` | Beta access | Enable all experimental features |
| `--deep-research` | Research mode | Enable comprehensive research mode |
| `--multimodal-chain` | Complex workflows | Chain multimodal operations |
| `--agent-mode` | Autonomous agent | Enable autonomous agent capabilities |

### Help & Information

| Flag | When Activated | What It Does |
|------|----------------|--------------|
| `--help` / `-h` | Command help | Show help information |
| `--version` / `-V` | Version info | Show Gemini CLI version |
| `--models` | List models | Show all available models |
| `--examples` | Usage examples | Show example commands |
| `--docs` | Documentation | Open documentation in browser |

---

## Flag Combinations (Common Patterns)

### Image Analysis
```bash
gemini --image photo.jpg --vision-mode detailed "Describe this image"
```

### Research Mode
```bash
gemini --grounding --citations --thinking "Latest AI research trends"
```

### Document Processing
```bash
gemini --pdf report.pdf --ocr --markdown "Summarize this report"
```

### Video Understanding
```bash
gemini --video demo.mp4 --video-fps 1 "What happens in this video?"
```

### Code Generation
```bash
gemini --code-execution --json "Generate a Python function to sort a list"
```

### Web Research
```bash
gemini --web https://example.com --grounding --citations
```

### Multi-Image Comparison
```bash
gemini -i img1.jpg -i img2.jpg -i img3.jpg "Compare these images"
```

### Batch Processing
```bash
gemini --batch --file input.txt --save output.txt --parallel 5
```

---

## Environment Variables

| Variable | Equivalent Flag | Default |
|----------|----------------|---------|
| `GOOGLE_AI_API_KEY` | `--api-key` | None (required) |
| `GEMINI_MODEL` | `--model` | `gemini-2.0-flash-exp` |
| `GEMINI_TEMPERATURE` | `--temperature` | `1.0` |
| `GEMINI_MAX_TOKENS` | `--max-tokens` | `8192` |
| `GEMINI_SAFETY_LEVEL` | `--safety` | `medium` |
| `GEMINI_LOG_LEVEL` | `--log-level` | `info` |

---

## Tips & Best Practices

1. **Leverage multimodal**: Use `--image`, `--video`, `--pdf` together
2. **Enable grounding**: Add `--grounding` for factual queries
3. **Choose right model**: 
   - `--flash` for speed
   - `--pro` for complex reasoning
   - `--thinking` for deep analysis
4. **Optimize costs**: Use caching with `--cache` for repeated contexts
5. **Structured output**: Use `--json` for programmatic processing
6. **Safety first**: Set appropriate `--safety` level for your use case
7. **Debug issues**: Add `--debug --trace` for troubleshooting
8. **Save sessions**: Use `--session` to continue work later

---

**Last Updated**: March 2026  
**Gemini CLI Version**: Latest  
**Documentation**: [ai.google.dev/gemini-api/docs/cli](https://ai.google.dev/gemini-api/docs/cli)
