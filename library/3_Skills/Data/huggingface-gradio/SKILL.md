---
name: "🤗 huggingface-gradio"
description: Build Gradio web UIs and interactive ML demos in Python. Use when creating or editing Gradio apps, Interface wrappers, Blocks layouts, event listeners, chatbots, or deploying demos to Hugging Face Spaces.
source: https://github.com/huggingface/skills
installs: 42000+
---

# Hugging Face Gradio

Build interactive web UIs and ML demos using Gradio — the Python library for wrapping any function in a shareable web interface.

## Overview

Gradio provides two levels of abstraction:

| API | Best For |
|-----|----------|
| **`gr.Interface`** | Single-function demos with auto-generated UI |
| **`gr.Blocks`** | Custom layouts, multi-step flows, full control |
| **`gr.ChatInterface`** | Chatbot UIs with history management |

## Quick Start

```python
import gradio as gr

# Interface (high-level)
demo = gr.Interface(
    fn=lambda x: x.upper(),
    inputs=gr.Textbox(label="Input"),
    outputs=gr.Textbox(label="Output"),
    title="My Demo"
)
demo.launch()
```

```python
# Blocks (low-level)
with gr.Blocks() as demo:
    txt = gr.Textbox()
    btn = gr.Button("Submit")
    out = gr.Textbox()
    btn.click(fn=my_function, inputs=txt, outputs=out)

demo.launch()
```

## Common Components

```python
gr.Textbox()          # Text input/output
gr.Number()           # Numeric input
gr.Slider(0, 100)     # Range slider
gr.Checkbox()         # Boolean toggle
gr.Dropdown(choices)  # Select from list
gr.Radio(choices)     # Single-choice radio
gr.Image()            # Image upload/display
gr.Audio()            # Audio input/output
gr.Video()            # Video input/output
gr.File()             # File upload
gr.Chatbot()          # Conversation history display
gr.Button()           # Trigger actions
gr.Markdown()         # Rich text display
gr.HTML()             # Custom HTML content
```

## Chatbot Pattern

```python
import gradio as gr

def respond(message, history):
    # history is list of [user, assistant] pairs
    response = my_llm(message, history)
    return response

demo = gr.ChatInterface(
    fn=respond,
    title="My Chatbot",
    examples=["Hello!", "What can you do?"]
)
demo.launch()
```

## Event Listeners

All event listeners share a consistent signature:

```python
component.event(
    fn=handler,
    inputs=[input_components],
    outputs=[output_components],
    api_name="endpoint_name",      # expose as API endpoint
    show_progress=True,
    queue=True,                    # enable queuing for concurrent users
    concurrency_limit=5
)
```

Common events: `.click()`, `.change()`, `.submit()`, `.upload()`, `.stream()`

## Streaming Outputs

```python
def stream_response(prompt):
    for chunk in llm.stream(prompt):
        yield chunk

demo = gr.Interface(fn=stream_response, inputs="text", outputs="text")
demo.queue().launch()
```

## Custom CSS and JS

```python
with gr.Blocks(css=".my-class { color: red; }") as demo:
    gr.HTML('<div class="my-class">Styled</div>')
    gr.Markdown("# Hello")
```

## Deploying to Hugging Face Spaces

```bash
# Create a Space at https://huggingface.co/new-space
# Select Gradio as the SDK, then push your code:

git init
git add app.py requirements.txt
git commit -m "Initial commit"
git remote add origin https://huggingface.co/spaces/<username>/<space-name>
git push origin main
```

`app.py` must contain `demo.launch()` (no `server_name` argument needed for Spaces).

## Prediction CLI

```bash
gradio info <space-or-url>           # Discover endpoints and parameters
gradio predict <url> --data '...'    # Send a prediction request
gradio predict <url> --token $HF_TOKEN  # Access private Spaces
```

## Prerequisites

```bash
pip install gradio
```

For Hugging Face Spaces deployment: HuggingFace account + write token.
