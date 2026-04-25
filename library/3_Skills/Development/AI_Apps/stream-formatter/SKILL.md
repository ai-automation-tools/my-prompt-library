---
title: "Stream Formatter"
tags: ["streaming", "llm", "markdown", "chat-ui", "typescript"]
category: "Skills"
subcategory: "Development"
source: "https://skillsmp.com/skills/openclaw-skills-skills-ayalili-stream-formatter-skill-md"
source_author: "openclaw"
source_repository: "openclaw/skills"
source_stars: 4094
source_updated: "2026-03-11"
---

# Stream Formatter

## Overview
Improve real-time LLM streaming output by buffering partial chunks, preserving readable sentence boundaries, repairing common Markdown issues, and reducing duplicate or malformed output before rendering to users.

## When to Use
- Building chat interfaces or agent UIs with streamed model responses.
- Rendering Markdown while chunks are still arriving.
- Users see broken words, incomplete code fences, malformed lists, or repeated text.
- You need a lightweight formatting layer between model stream events and UI rendering.

## Processing Model
1. Initialize a small buffer for each response stream.
2. Append incoming chunks to the buffer.
3. Emit only complete sentences, paragraphs, or safe Markdown units.
4. Hold incomplete code fences, links, list items, and sentences until enough context arrives.
5. On stream end, flush remaining buffered content and close any repairable Markdown structures.

## Implementation Notes
- Keep latency low by using simple string and regex checks rather than full Markdown parsing unless the app already ships a parser.
- Make buffer size configurable for languages with different punctuation and sentence boundaries.
- Deduplicate repeated suffix/prefix overlaps from provider retries or reconnects.
- Unit test code fences, tables, bullet lists, links, CJK punctuation, and interrupted words.

## Example Interface
```ts
type StreamFormatAction = "init" | "process" | "reset";

type StreamFormatInput = {
  action: StreamFormatAction;
  chunk?: string;
  flush?: boolean;
  options?: {
    bufferSize?: number;
    formatMarkdown?: boolean;
    fixIncompleteSentences?: boolean;
  };
};
```

## Source Notes
Adapted from the SkillsMP `stream-formatter` skill, selected for high marketplace popularity and useful coverage for LLM application UX.
