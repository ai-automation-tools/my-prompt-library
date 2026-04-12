---
title: "⚡ Groq API Guide"
tags: ["agent-guides", "groq", "api", "inference", "lpu"]
category: "Agent_Guides"
subcategory: "API_Providers"
---

# Groq API Guide

## Overview
Groq is a fast AI inference provider that utilizes specialized LPUs (Language Processing Units) to deliver extremely high-speed token generation. This guide covers how to configure and use the Groq API with your agents, which is particularly useful for applications requiring real-time, low-latency responses like voice agents or rapid data processing.

## Agent Configuration

### Basic Settings
- **Agent Name:** Groq Fast Agent
- **Model:** `llama3-70b-8192` or `mixtral-8x7b-32768` (Groq hosts open-source models)
- **Temperature:** 0.2 - 0.8 (depending on use case)
- **Context Window:** Model dependent (e.g., 8k for Llama 3, 32k for Mixtral)

### Tools & Permissions
- Tool 1: HTTP Client (for API requests)
- Tool 2: OpenAI SDK (Groq API is OpenAI-compatible)

## System Prompt

```xml
<system_info>
You are a highly responsive agent operating on Groq's low-latency infrastructure. Your primary advantage is speed. You should provide concise, immediate, and accurate answers, prioritizing rapid delivery of information over overly verbose explanations unless specifically requested.
</system_info>
```

## Workflow

1. **Client Setup**: Initialize the OpenAI client pointing to the Groq base URL.
2. **Model Selection**: Choose an appropriate open-source model hosted by Groq.
3. **Execution**: Send the prompt and receive near-instantaneous streaming or standard responses.
4. **Tool Use**: Utilize function calling capabilities if supported by the specific model.

## Example Interactions

### Example 1: Basic Chat Completion
**Code:**
```python
import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Explain quantum computing in one sentence.",
        }
    ],
    model="llama3-8b-8192",
)
print(chat_completion.choices[0].message.content)
```

## Best Practices

- **Leverage OpenAI Compatibility**: If you have an existing application using the OpenAI SDK, you can switch to Groq simply by changing the `base_url` and `api_key`.
- **Stream Responses**: For maximum perceived performance, always use streaming (`stream=True`) to take advantage of Groq's high token-per-second rate.
- **Watch Rate Limits**: While inference is fast, be aware of RPM (Requests Per Minute) and TPM (Tokens Per Minute) limits on your tier.

## Customization Options

- **JSON Mode**: Force JSON output by setting `response_format={"type": "json_object"}`.
- **Seed Parameter**: Use the `seed` parameter for reproducible outputs when testing.

## Troubleshooting

- **Model Not Found**: Ensure you are using the exact model ID string provided in the Groq console (e.g., `llama3-70b-8192`).
- **Context Length Exceeded**: Be mindful of the `-8192` or `-32768` suffixes on model names, which denote the maximum context window.

## Integration

Groq integrates perfectly with standard orchestration frameworks like LangChain, LlamaIndex, and Autogen by using their OpenAI-compatible wrappers.

## Version History

- **2024-Q1**: GroqCloud API public access launched.
- **2024-Q2**: Llama 3 models added with record-breaking inference speeds.

## References

- [Groq Console & API Keys](https://console.groq.com/)
- [Groq API Documentation](https://console.groq.com/docs/quickstart)
