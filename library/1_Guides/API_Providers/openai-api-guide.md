---
title: "📚 OpenAI API Setup Guide"
tags: ["api_providers", "new"]
category: "Agent_Guides"
subcategory: "API_Providers"
---

# OpenAI API Setup Guide

## Overview
This guide explains how to properly configure, authenticate, and use the OpenAI API for your agent workflows.

## Setup Instructions
1. Navigate to the OpenAI Developer Dashboard
2. Generate an API Key under Settings -> API Keys
3. Set your environment variable: `export OPENAI_API_KEY="your-key-here"`

## Integration Points
- Core completion API for primary logic
- Embeddings API for vector search

## Example JSON Protocol
```json
{
  "request_type": "completion",
  "model": "gpt-4-turbo",
  "messages": [{"role": "user", "content": "Hello"}]
}
```
