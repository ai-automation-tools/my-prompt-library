---
title: "OpenAI GPT-4 CLI Guide"
tags: ["openai", "gpt-4", "cli", "reference", "api"]
category: "Agent_Guides"
subcategory: "Other"
<!-- Last Updated: 2026-03-25 - Synced with OpenAI Codex CLI changelog (Mar 2026) -->

## CLI Sync Notes (March 2026)

This guide remains in `Other/OpenAI/` and distinguishes legacy API tooling from modern **Codex CLI** workflows.

### Notable March 2026 CLI updates
- Codex CLI 0.116.0 updates include device-code sign-in, plugin/setup improvements, and hook/runtime refinements.
- Ongoing app/CLI parity improvements (settings sync, thread search, quality/perf fixes).

### Official references
- https://developers.openai.com/codex/changelog
- https://developers.openai.com/codex/cli/

### Maintainer note
- Keep OpenAI API examples, but treat Codex CLI docs/changelog as source of truth for terminal-agent behavior.

---

# OpenAI GPT-4 Agent Guide

Comprehensive reference for building and managing agents with OpenAI GPT-4 models via CLI and API.

**Key Features:**
- 🧠 State-of-the-art reasoning capabilities
- 👁️ Vision support (GPT-4 Vision, GPT-4o)
- 🎯 Function calling and JSON mode
- 🔊 Audio input/output (GPT-4o Audio)
- 📊 128K context window (GPT-4 Turbo, GPT-4o)
- 🚀 Fast inference with GPT-4o mini

---

## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Official Website** | [openai.com](https://openai.com/) |
| **API Documentation** | [platform.openai.com/docs](https://platform.openai.com/docs/api-reference) |
| **Cookbook** | [github.com/openai/openai-cookbook](https://github.com/openai/openai-cookbook) |
| **Model Cards** | [platform.openai.com/docs/models](https://platform.openai.com/docs/models) |
| **Pricing** | [openai.com/pricing](https://openai.com/pricing) |
| **API Keys** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Playground** | [platform.openai.com/playground](https://platform.openai.com/playground) |
| **Status Page** | [status.openai.com](https://status.openai.com/) |

---

## 2. Installation & Setup

### Install Official SDK

```bash
# Python
pip install openai

# Node.js
npm install openai

# Go
go get github.com/sashabaranov/go-openai
```

### Install Official CLI

```bash
# Using pip
pip install openai-cli

# Verify installation
openai --version
```

### API Key Setup

```bash
# Set environment variable
export OPENAI_API_KEY="sk-..."

# Add to shell profile
echo 'export OPENAI_API_KEY="sk-..."' >> ~/.bashrc
source ~/.bashrc

# Or use config file
openai config set api-key sk-...
```

### Using with cURL

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

---

## 3. Available Models

### GPT-4 Family

| Model | Context | Description | Use Case |
|-------|---------|-------------|----------|
| `gpt-4o` | 128K | Multimodal (text, vision, audio) | General purpose, best overall |
| `gpt-4o-mini` | 128K | Fast, cost-effective | High-volume tasks |
| `gpt-4-turbo` | 128K | Latest GPT-4 Turbo | Complex reasoning |
| `gpt-4` | 8K | Original GPT-4 | Legacy support |
| `gpt-4-32k` | 32K | Extended context (deprecated) | Long documents |
| `o1-preview` | 128K | Advanced reasoning | Research, complex problems |
| `o1-mini` | 128K | Fast reasoning | STEM, coding |

### Model Comparison

**gpt-4o** (Recommended):
- Fastest GPT-4 level model
- Multimodal: text + vision + audio
- 128K context window
- $2.50/$10.00 per 1M tokens (input/output)

**gpt-4o-mini** (Budget):
- 60% cheaper than GPT-3.5 Turbo
- Fast inference
- Good for simple tasks
- $0.15/$0.60 per 1M tokens

**o1-preview** (Reasoning):
- Extended thinking time
- Best for complex problems
- No streaming
- $15.00/$60.00 per 1M tokens

---

## 4. CLI Commands

### Chat Completion

```bash
# Basic chat
openai api chat.completions.create \
  -m gpt-4o \
  -g user "Hello, GPT-4!"

# With system message
openai api chat.completions.create \
  -m gpt-4o \
  -g system "You are a Python expert" \
  -g user "Explain list comprehensions"

# Streaming response
openai api chat.completions.create \
  -m gpt-4o \
  -g user "Write a story" \
  --stream

# Set temperature
openai api chat.completions.create \
  -m gpt-4o \
  -g user "Be creative" \
  --temperature 0.8
```

### Image Analysis (Vision)

```bash
# Analyze image from URL
openai api chat.completions.create \
  -m gpt-4o \
  -g user "What's in this image? https://example.com/image.jpg"

# Analyze local image (base64)
openai api chat.completions.create \
  -m gpt-4o \
  -g user "Describe this: data:image/jpeg;base64,$(base64 -i photo.jpg)"
```

### Image Generation (DALL-E)

```bash
# Generate image
openai api images.generate \
  -m dall-e-3 \
  -p "A serene landscape with mountains" \
  --size 1024x1024 \
  --quality standard

# Edit image
openai api images.edit \
  -p "Add a rainbow" \
  -i original.png \
  -m mask.png

# Create variation
openai api images.create-variation \
  -i original.png \
  -n 2
```

### Audio Transcription (Whisper)

```bash
# Transcribe audio
openai api audio.transcriptions.create \
  -m whisper-1 \
  -f audio.mp3

# With translation to English
openai api audio.translations.create \
  -m whisper-1 \
  -f spanish_audio.mp3
```

### Text-to-Speech

```bash
# Generate speech
openai api audio.speech.create \
  -m tts-1 \
  -i "Hello, world!" \
  --voice alloy \
  -o output.mp3

# High quality
openai api audio.speech.create \
  -m tts-1-hd \
  -i "Premium quality speech" \
  --voice nova \
  -o premium.mp3
```

### Embeddings

```bash
# Generate embeddings
openai api embeddings.create \
  -m text-embedding-3-small \
  -i "Your text here"
```

### Fine-tuning

```bash
# Upload training data
openai api files.create \
  -f training_data.jsonl \
  -p fine-tune

# Create fine-tuning job
openai api fine_tuning.jobs.create \
  -m gpt-4o-mini-2024-07-18 \
  -t file-abc123

# List fine-tuning jobs
openai api fine_tuning.jobs.list

# Retrieve job status
openai api fine_tuning.jobs.retrieve \
  -i ftjob-abc123

# Cancel job
openai api fine_tuning.jobs.cancel \
  -i ftjob-abc123
```

### Moderation

```bash
# Check content
openai api moderations.create \
  -i "Text to check for policy violations"
```

---

## 5. Python SDK Examples

### Basic Chat

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content)
```

### Streaming

```python
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Count to 10"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

### Function Calling

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["location"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=tools,
    tool_choice="auto"
)

# Handle tool call
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    # Execute function and send result back
```

### JSON Mode

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Extract user info as JSON"},
        {"role": "user", "content": "John Doe, 30, engineer"}
    ],
    response_format={"type": "json_object"}
)

print(response.choices[0].message.content)
# Output: {"name": "John Doe", "age": 30, "occupation": "engineer"}
```

### Vision

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/image.jpg"}
                }
            ]
        }
    ]
)
```

### Audio (GPT-4o Audio)

```python
# Coming soon - audio input/output capabilities
response = client.chat.completions.create(
    model="gpt-4o-audio-preview",
    modalities=["text", "audio"],
    audio={"voice": "alloy", "format": "wav"},
    messages=[
        {"role": "user", "content": "Tell me a joke"}
    ]
)
```

---

## 6. API Parameters

### Chat Completion Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | required | Model ID |
| `messages` | array | required | Conversation history |
| `temperature` | float | 1.0 | Sampling temperature (0-2) |
| `max_tokens` | int | inf | Max tokens to generate |
| `top_p` | float | 1.0 | Nucleus sampling |
| `frequency_penalty` | float | 0.0 | Reduce repetition (-2.0 to 2.0) |
| `presence_penalty` | float | 0.0 | Encourage diversity (-2.0 to 2.0) |
| `stop` | string/array | null | Stop sequences |
| `stream` | boolean | false | Enable streaming |
| `tools` | array | null | Function definitions |
| `tool_choice` | string/object | auto | Tool selection strategy |
| `response_format` | object | text | Output format (text/json_object) |
| `seed` | int | null | Reproducibility seed |
| `logit_bias` | object | null | Token probability adjustments |

---

## 7. Best Practices

### Temperature Guide

| Task | Temperature |
|------|-------------|
| Code generation | 0.0 - 0.2 |
| Data extraction | 0.0 - 0.3 |
| Technical writing | 0.3 - 0.7 |
| Creative writing | 0.7 - 1.0 |
| Brainstorming | 1.0 - 1.5 |

### Context Management

```python
MAX_TOKENS = 120000  # Leave headroom for response

def estimate_tokens(text):
    """Rough estimate: 1 token ≈ 4 characters"""
    return len(text) // 4

def trim_conversation(messages, max_tokens=MAX_TOKENS):
    """Keep conversation within limits"""
    total = sum(estimate_tokens(m["content"]) for m in messages)
    
    while total > max_tokens and len(messages) > 2:
        # Remove oldest non-system message
        for i, msg in enumerate(messages):
            if msg["role"] != "system":
                removed = messages.pop(i)
                total -= estimate_tokens(removed["content"])
                break
    
    return messages
```

### Error Handling

```python
from openai import OpenAIError, RateLimitError, APITimeoutError
import time

def chat_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(
                model="gpt-4o",
                messages=messages
            )
        except RateLimitError:
            if attempt < max_retries - 1:
                wait = 2 ** attempt
                print(f"Rate limited. Waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
        except APITimeoutError:
            if attempt < max_retries - 1:
                print("Timeout. Retrying...")
                continue
            else:
                raise
        except OpenAIError as e:
            print(f"API error: {e}")
            raise
```

---

## 8. Rate Limits & Pricing

### Rate Limits (Tier 3 example)

| Model | RPM | TPM | Batch Queue |
|-------|-----|-----|-------------|
| gpt-4o | 5,000 | 800,000 | 1,400,000 |
| gpt-4o-mini | 5,000 | 2,000,000 | 15,000,000 |
| gpt-4-turbo | 5,000 | 300,000 | 600,000 |

### Pricing (per 1M tokens)

| Model | Input | Output | Context |
|-------|-------|--------|---------|
| gpt-4o | $2.50 | $10.00 | 128K |
| gpt-4o-mini | $0.15 | $0.60 | 128K |
| gpt-4-turbo | $10.00 | $30.00 | 128K |
| gpt-4 | $30.00 | $60.00 | 8K |
| o1-preview | $15.00 | $60.00 | 128K |
| o1-mini | $3.00 | $12.00 | 128K |

**Batch API:** 50% discount for async processing

---

## 9. Advanced Features

### Structured Outputs

```python
from pydantic import BaseModel

class UserInfo(BaseModel):
    name: str
    age: int
    occupation: str

response = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "John Doe, 30, engineer"}
    ],
    response_format=UserInfo
)

user = response.choices[0].message.parsed
print(user.name)  # "John Doe"
```

### Batch Processing

```python
# Create batch file
with open("batch.jsonl", "w") as f:
    f.write('{"custom_id": "req-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-4o", "messages": [{"role": "user", "content": "Hello"}]}}\n')

# Upload and submit
batch_file = client.files.create(file=open("batch.jsonl", "rb"), purpose="batch")
batch = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h"
)

# Check status
status = client.batches.retrieve(batch.id)
```

### Assistants API

```bash
# Create assistant
openai api assistants.create \
  --model gpt-4o \
  --name "Code Helper" \
  --instructions "You are a coding assistant"

# Create thread
openai api threads.create

# Add message
openai api threads.messages.create \
  --thread-id thread_abc123 \
  --role user \
  --content "Explain recursion"

# Run assistant
openai api threads.runs.create \
  --thread-id thread_abc123 \
  --assistant-id asst_abc123
```

---

## 10. Troubleshooting

### Common Errors

**Invalid API Key:**
```bash
# Verify key
openai api models.list
```

**Context Length Exceeded:**
```python
# Use tiktoken for accurate counting
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o")
tokens = enc.encode("Your text here")
print(f"Token count: {len(tokens)}")
```

**Rate Limit:**
```python
# Implement exponential backoff
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
def call_api():
    return client.chat.completions.create(...)
```

**Model Not Found:**
```python
# List available models
models = client.models.list()
for model in models.data:
    if "gpt-4" in model.id:
        print(model.id)
```

---

## 11. Security & Compliance

### API Key Management

```bash
# Never commit keys
echo "OPENAI_API_KEY=sk-..." >> .env
echo ".env" >> .gitignore

# Use environment variables
export OPENAI_API_KEY=$(cat .env | grep OPENAI_API_KEY | cut -d '=' -f2)
```

### Content Filtering

```python
# Check content before processing
moderation = client.moderations.create(input="User content here")

if moderation.results[0].flagged:
    print("Content violates policies")
    # Handle appropriately
else:
    # Proceed with API call
    pass
```

### Prompt Injection Protection

```python
# Sanitize user input
def sanitize(text):
    # Remove potential prompt injection
    forbidden = ["ignore previous", "new instructions", "system:"]
    for phrase in forbidden:
        if phrase.lower() in text.lower():
            raise ValueError("Potential prompt injection detected")
    return text

user_input = sanitize(user_message)
```

---

## 12. Migration Guide

### From GPT-3.5 to GPT-4o

```python
# Old (GPT-3.5)
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[...]
)

# New (GPT-4o) - same API
response = client.chat.completions.create(
    model="gpt-4o",  # Just change the model
    messages=[...]
)
```

### From Legacy Completions to Chat

```python
# Old (Completions API - deprecated)
response = client.completions.create(
    model="text-davinci-003",
    prompt="Say hello"
)

# New (Chat API)
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Say hello"}]
)
```

---

**Last Updated:** 2026-03-24  
**API Version:** v1

*Part of the [my_agents](../../) repository*
