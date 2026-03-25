---
title: "Google Gemini CLI Guide"
tags: ["gemini", "google", "cli", "reference", "api", "multimodal"]
category: "Agent_Guides"
subcategory: "Other"
<!-- Last Updated: 2026-03-25 - CLI sync check (Gemini tooling ecosystem) -->

## CLI Sync Notes (March 2026)

Maintained as a **Gemini tooling overview**.

### Current status
- Local content is strong for Gemini API/SDK capabilities.
- CLI-specific details should be validated against official Gemini CLI/tool docs before claiming exact command support.

### Official references
- https://ai.google.dev/gemini-api/docs
- https://github.com/google-gemini

### Maintainer note
- Weekly sync should separate API model updates from CLI command-surface updates.

---

# Google Gemini Agent Guide

Comprehensive reference for building and managing agents with Google Gemini models via CLI and API.

**Key Features:**
- 🌟 Native multimodal (text, image, video, audio)
- 🧠 2M token context window (Gemini 1.5 Pro)
- 🆓 Free tier with generous limits
- 🎯 Grounding with Google Search
- 📊 JSON mode and code execution
- ⚡ Fast inference with Flash models

---

## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Official Website** | [ai.google.dev](https://ai.google.dev/) |
| **API Documentation** | [ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs) |
| **Gemini Studio** | [aistudio.google.com](https://aistudio.google.com/) |
| **Model Cards** | [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models/gemini) |
| **Pricing** | [ai.google.dev/pricing](https://ai.google.dev/pricing) |
| **API Keys** | [aistudio.google.com/apikey](https://aistudio.google.com/app/apikey) |
| **Cookbook** | [github.com/google-gemini/cookbook](https://github.com/google-gemini/cookbook) |
| **Vertex AI** | [cloud.google.com/vertex-ai](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini) |

---

## 2. Installation & Setup

### Install Official SDK

```bash
# Python
pip install google-generativeai

# Node.js
npm install @google/generative-ai

# Go
go get github.com/google/generative-ai-go
```

### API Key Setup

```bash
# Get free API key from aistudio.google.com/apikey
export GOOGLE_API_KEY="AIza..."

# Add to shell profile
echo 'export GOOGLE_API_KEY="AIza..."' >> ~/.bashrc
source ~/.bashrc
```

### Using with cURL

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$GOOGLE_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{"text": "Hello, Gemini!"}]
    }]
  }'
```

---

## 3. Available Models

### Production Models

| Model | Context | Description | Use Case |
|-------|---------|-------------|----------|
| `gemini-2.0-flash` | 1M | Latest, fastest multimodal | Real-time apps, high volume |
| `gemini-1.5-flash` | 1M | Fast, cost-effective | General tasks |
| `gemini-1.5-pro` | 2M | Most capable, longest context | Complex analysis, large docs |
| `gemini-1.0-pro` | 32K | Legacy text model | Simple text tasks |

### Model Selection Guide

**gemini-2.0-flash** (Recommended):
- Newest generation (Dec 2024)
- Multimodal: text, image, video, audio
- Real-time streaming audio/video
- Best price-to-performance ratio

**gemini-1.5-pro**:
- 2M token context (industry-leading)
- Best for: full codebases, books, hours of video
- More accurate than Flash on complex tasks

**gemini-1.5-flash**:
- 1M context
- 50x cheaper than Pro
- Good for: most everyday tasks

---

## 4. Python SDK Examples

### Basic Chat

```python
import google.generativeai as genai

genai.configure(api_key="AIza...")

model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content("Hello, Gemini!")

print(response.text)
```

### Streaming

```python
response = model.generate_content("Write a story", stream=True)

for chunk in response:
    print(chunk.text, end="")
```

### Multi-turn Conversation

```python
model = genai.GenerativeModel('gemini-1.5-flash')
chat = model.start_chat(history=[])

response = chat.send_message("Hello!")
print(response.text)

response = chat.send_message("What did I just say?")
print(response.text)
```

### System Instructions

```python
model = genai.GenerativeModel(
    'gemini-1.5-flash',
    system_instruction="You are a Python expert. Provide concise, working code examples."
)

response = model.generate_content("Explain list comprehensions")
```

### Vision (Image Analysis)

```python
import PIL.Image

model = genai.GenerativeModel('gemini-2.0-flash')

# From file
image = PIL.Image.open('photo.jpg')
response = model.generate_content(["What's in this image?", image])

# From URL
response = model.generate_content([
    "Describe this image",
    {"mime_type": "image/jpeg", "data": requests.get(url).content}
])

# Multiple images
response = model.generate_content([
    "Compare these images",
    image1,
    image2
])
```

### Video Analysis

```python
# Upload video file
video_file = genai.upload_file(path="video.mp4")

# Wait for processing
while video_file.state.name == "PROCESSING":
    time.sleep(2)
    video_file = genai.get_file(video_file.name)

# Generate content
model = genai.GenerativeModel('gemini-1.5-pro')
response = model.generate_content([
    "Summarize what happens in this video",
    video_file
])

print(response.text)
```

### Audio Analysis

```python
# Upload audio
audio_file = genai.upload_file(path="audio.mp3")

response = model.generate_content([
    "Transcribe this audio and summarize the key points",
    audio_file
])
```

### PDF Analysis

```python
# Upload PDF
pdf_file = genai.upload_file(path="document.pdf")

response = model.generate_content([
    "Summarize this document's main arguments",
    pdf_file
])
```

---

## 5. Function Calling

### Define Tools

```python
def get_weather(location: str, unit: str = "celsius"):
    """Get current weather for a location"""
    # Implementation
    return {"temperature": 22, "condition": "sunny"}

tools = [get_weather]

model = genai.GenerativeModel(
    'gemini-1.5-flash',
    tools=tools
)

chat = model.start_chat()
response = chat.send_message("What's the weather in Tokyo?")

# Gemini automatically calls the function
print(response.text)
```

### Manual Function Calling

```python
response = chat.send_message("What's the weather in Tokyo?")

# Check for function call
for part in response.parts:
    if hasattr(part, 'function_call'):
        function_call = part.function_call
        
        # Execute function
        if function_call.name == "get_weather":
            result = get_weather(**function_call.args)
            
            # Send result back
            response = chat.send_message(
                genai.protos.Content(
                    parts=[genai.protos.Part(
                        function_response=genai.protos.FunctionResponse(
                            name="get_weather",
                            response={"result": result}
                        )
                    )]
                )
            )
```

---

## 6. JSON Mode

### Structured Output

```python
import json
from typing import Literal

model = genai.GenerativeModel(
    'gemini-1.5-flash',
    generation_config={
        "response_mime_type": "application/json",
        "response_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "age": {"type": "integer"},
                "occupation": {"type": "string"}
            },
            "required": ["name", "age"]
        }
    }
)

response = model.generate_content("John Doe, 30, engineer")
data = json.loads(response.text)
print(data)
# {"name": "John Doe", "age": 30, "occupation": "engineer"}
```

---

## 7. Code Execution

### Built-in Python Execution

```python
model = genai.GenerativeModel(
    'gemini-1.5-pro',
    tools='code_execution'
)

response = model.generate_content(
    "Calculate the first 20 Fibonacci numbers"
)

# Gemini writes and executes Python code
print(response.text)
```

---

## 8. Grounding with Google Search

### Search Grounding

```python
from google.generativeai.types import Tool, GoogleSearchRetrieval

model = genai.GenerativeModel(
    'gemini-1.5-flash',
    tools=[Tool(google_search_retrieval=GoogleSearchRetrieval())]
)

response = model.generate_content("What are the latest news about AI?")

# Response includes search results as citations
print(response.text)

# Access grounding metadata
if response.candidates[0].grounding_metadata:
    for chunk in response.candidates[0].grounding_metadata.grounding_chunks:
        print(chunk.web.uri)
```

---

## 9. API Parameters

### Generation Config

```python
generation_config = {
    "temperature": 1.0,           # Randomness (0.0-2.0)
    "top_p": 0.95,                # Nucleus sampling
    "top_k": 40,                  # Top-k sampling
    "max_output_tokens": 8192,    # Max response length
    "stop_sequences": ["END"],    # Stop generation
    "candidate_count": 1,         # Number of responses
    "response_mime_type": "text/plain",  # or "application/json"
}

model = genai.GenerativeModel(
    'gemini-1.5-flash',
    generation_config=generation_config
)
```

### Safety Settings

```python
from google.generativeai.types import HarmCategory, HarmBlockThreshold

safety_settings = {
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}

response = model.generate_content(
    "Your prompt",
    safety_settings=safety_settings
)
```

---

## 10. File Management

### Upload Files

```python
# Upload for processing
file = genai.upload_file(
    path="large_document.pdf",
    display_name="Annual Report"
)

print(f"Uploaded: {file.name}")
print(f"URI: {file.uri}")
```

### List Files

```python
files = genai.list_files()

for file in files:
    print(f"{file.display_name}: {file.name}")
```

### Get File Info

```python
file = genai.get_file(name="files/abc123")
print(file.state.name)  # PROCESSING, ACTIVE, FAILED
```

### Delete Files

```python
genai.delete_file(file.name)
```

---

## 11. Rate Limits & Pricing

### Free Tier Limits

| Model | RPM | RPD | TPM |
|-------|-----|-----|-----|
| gemini-2.0-flash | 15 | 1,500 | 1M |
| gemini-1.5-flash | 15 | 1,500 | 1M |
| gemini-1.5-pro | 2 | 50 | 32K |

### Paid Tier (Pay-as-you-go)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| gemini-2.0-flash | $0.075 | $0.30 |
| gemini-1.5-flash | $0.075 | $0.30 |
| gemini-1.5-pro | $1.25 | $5.00 |

**Context caching:** Up to 90% discount on cached content

**Paid tier limits:** 1,000 RPM, unlimited daily requests

---

## 12. Context Caching

### Cache Large Documents

```python
# Upload document
document = genai.upload_file(path="large_book.pdf")

# Create cache
cache = genai.caching.CachedContent.create(
    model='gemini-1.5-pro',
    contents=[document],
    system_instruction="You are an expert on this book",
    ttl=datetime.timedelta(hours=1)
)

# Use cache
model = genai.GenerativeModel.from_cached_content(cache)
response = model.generate_content("Summarize chapter 3")

# Multiple queries reuse cache (much cheaper!)
response2 = model.generate_content("What happens in chapter 5?")
```

---

## 13. Best Practices

### Temperature Guide

| Task | Temperature |
|------|-------------|
| Code generation | 0.0 - 0.2 |
| Factual QA | 0.2 - 0.4 |
| Technical writing | 0.4 - 0.7 |
| Creative writing | 0.7 - 1.0 |
| Brainstorming | 1.0 - 1.5 |

### Error Handling

```python
from google.generativeai.types import BlockedPromptException, StopCandidateException

try:
    response = model.generate_content("Your prompt")
    print(response.text)
except BlockedPromptException:
    print("Prompt was blocked by safety filters")
except StopCandidateException:
    print("Response was blocked")
except Exception as e:
    print(f"Error: {e}")
```

### Token Counting

```python
# Count tokens before sending
model = genai.GenerativeModel('gemini-1.5-flash')
tokens = model.count_tokens("Your very long text here")

print(f"Total tokens: {tokens.total_tokens}")

if tokens.total_tokens > 1000000:
    print("Content too long, consider using Pro model")
```

---

## 14. CLI Alternatives

### Using gcloud CLI (Vertex AI)

```bash
# Setup
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Generate content
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent \
  -d '{
    "contents": {
      "role": "user",
      "parts": [{"text": "Hello!"}]
    }
  }'
```

### Using with LiteLLM

```bash
pip install litellm

export GEMINI_API_KEY="AIza..."

litellm --model gemini/gemini-1.5-flash
```

---

## 15. Advanced Features

### Thinking Mode (Gemini 2.0)

```python
model = genai.GenerativeModel(
    'gemini-2.0-flash-thinking',
    generation_config={
        "temperature": 1.0,
        "thinking_config": {
            "thinking_budget_tokens": 8192
        }
    }
)

# Get extended reasoning
response = model.generate_content("Solve this complex math problem: ...")
```

### Live Streaming (Gemini 2.0)

```python
# Real-time audio/video streaming
# Coming soon - check official docs for updates
```

### Batch Prediction (Vertex AI)

```python
# For high-volume async processing
# Use Vertex AI Batch Prediction API
```

---

## 16. Migration from Other Providers

### From OpenAI

```python
# OpenAI
from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}]
)

# Gemini equivalent
import google.generativeai as genai
model = genai.GenerativeModel('gemini-1.5-pro')
response = model.generate_content("Hello")
```

### From Anthropic

```python
# Claude
import anthropic
client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    messages=[{"role": "user", "content": "Hello"}]
)

# Gemini
import google.generativeai as genai
model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content("Hello")
```

---

## 17. Troubleshooting

### Common Issues

**API Key Invalid:**
```bash
# Verify key
echo $GOOGLE_API_KEY

# Test connection
curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GOOGLE_API_KEY"
```

**File Upload Fails:**
```python
# Check file size (max 2GB)
import os
size_mb = os.path.getsize("file.pdf") / (1024 * 1024)
print(f"Size: {size_mb:.2f} MB")

# For files >20MB, use resumable upload
file = genai.upload_file(path="large.pdf", resumable=True)
```

**Response Blocked:**
```python
# Check safety ratings
response = model.generate_content("prompt", safety_settings=...)

for rating in response.candidates[0].safety_ratings:
    print(f"{rating.category}: {rating.probability}")
```

**Rate Limit:**
```python
import time
from google.api_core.exceptions import ResourceExhausted

try:
    response = model.generate_content("prompt")
except ResourceExhausted:
    print("Rate limit hit. Waiting...")
    time.sleep(60)
    response = model.generate_content("prompt")
```

---

## 18. Comparison

### vs GPT-4

- ✅ **16x longer context** (2M vs 128K)
- ✅ **10x cheaper** ($1.25 vs $10 per 1M input)
- ✅ **Native video/audio** understanding
- ✅ **Free tier** available
- ⚠️ **Slightly weaker** at complex reasoning

### vs Claude 3.5

- ✅ **10x longer context** (2M vs 200K)
- ✅ **5x cheaper** ($1.25 vs $3 per 1M input)
- ✅ **Built-in code execution**
- ✅ **Google Search grounding**
- ⚠️ **Less nuanced** writing style

---

**Last Updated:** 2026-03-24  
**API Version:** v1beta

*Part of the [my_agents](../../) repository*
