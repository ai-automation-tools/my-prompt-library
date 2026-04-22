---
name: "🧠 mem0"
description: Integrates Mem0 Platform SDK for persistent memory in AI applications. Use when building agents or chatbots that need to remember user preferences, past interactions, or personalized context across sessions. Covers Python and TypeScript SDKs, plus LangChain, CrewAI, OpenAI Agents, LlamaIndex, AutoGen, and LangGraph integrations.
source: https://github.com/mem0ai/mem0
version: "3.0.0"
license: Apache-2.0
installs: 50800+
---

# Mem0 — Persistent Memory for AI Applications

Mem0 provides a managed memory layer that stores, searches, and retrieves user-specific context across AI agent sessions.

## Prerequisites

- Python 3.10+ or Node.js 18+
- `MEM0_API_KEY` environment variable (from https://app.mem0.ai)

## Installation

```bash
# Python
pip install mem0ai

# TypeScript / Node.js
npm install mem0ai
```

## Core Setup

```python
from mem0 import MemoryClient

client = MemoryClient()  # uses MEM0_API_KEY from env
```

```typescript
import { MemoryClient } from "mem0ai";

const client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY });
```

## Key Operations

| Method | Purpose |
|--------|---------|
| `add(messages, user_id=...)` | Store a new memory |
| `search(query, user_id=...)` | Retrieve relevant memories |
| `get_all(user_id=...)` | List all memories for a user |
| `update(memory_id, data)` | Update a specific memory |
| `delete(memory_id)` | Remove a memory |

## Core Pattern: Retrieve → Generate → Store

```python
def chat(user_message: str, user_id: str) -> str:
    # 1. Retrieve relevant memories
    memories = client.search(user_message, user_id=user_id)
    context = "\n".join(m["memory"] for m in memories)

    # 2. Generate response with memory context
    response = llm.generate(
        system=f"Relevant memories:\n{context}",
        user=user_message
    )

    # 3. Store the interaction
    client.add([
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": response}
    ], user_id=user_id)

    return response
```

## Important Behaviors

- **Search is async**: Allow 2–3 seconds after `add()` before results appear in `search()`
- **Filter syntax**: `filters={"user_id": "alice"}` (values are case-sensitive)
- **SDK v3 defaults**: `top_k=20`, `threshold=0.1`, `rerank=False`
- **v2 compatibility**: Pass `api_version="v1"` if you need legacy behavior

## Framework Integrations

Mem0 has drop-in integrations for:
- **LangChain** — use as a retriever or memory store
- **CrewAI** — persistent agent memory across crew runs
- **OpenAI Agents SDK** — tool-based memory access
- **LlamaIndex** — index memories alongside document retrieval
- **AutoGen** — cross-agent shared memory
- **LangGraph** — stateful node memory
- **Pipecat** — voice/conversation pipeline memory

## Use Cases

- Chatbots that remember user preferences and past conversations
- Personal assistants with long-term user profiles
- Multi-session coding agents with project context
- Customer support agents with CRM-style memory
- Educational tutors that adapt to learner history

## Related Skills

- `mem0-cli` — Terminal-based memory management commands
- `mcp-builder` — Build an MCP server wrapping Mem0 API
