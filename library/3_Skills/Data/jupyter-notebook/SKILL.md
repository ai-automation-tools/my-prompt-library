---
name: "📓 Jupyter Notebook"
description: Create, scaffold, or refactor Jupyter notebooks for experiments and tutorials. Use when working with `.ipynb` files, exploratory analysis, reproducible walkthroughs, or teaching-oriented notebooks.
source: https://skillsmp.com/skills/microsoft-ai-agents-for-beginners-translations-en-agents-skills-jupyter-notebook-skill-md
author: microsoft
repository: https://github.com/microsoft/ai-agents-for-beginners
stars: 54211
forks: 18781
updated: 2026-02-18
---

# Jupyter Notebook

Produce clean, reproducible notebooks instead of hand-editing raw notebook JSON.

## When To Use

- Create a new `.ipynb` notebook from scratch
- Convert notes or scripts into a structured notebook
- Refactor an existing notebook to improve readability and reproducibility
- Build analysis notebooks or tutorial-style walkthroughs

## Notebook Modes

- `experiment`: exploratory, analytical, hypothesis-driven work
- `tutorial`: step-by-step, teaching-oriented walkthroughs

## Workflow

### 1. Lock The Intent

Decide:

- notebook kind: `experiment` or `tutorial`
- target audience
- expected outcome

### 2. Scaffold Instead Of Hand-Editing JSON

Use a helper script or template-based generator when available:

```bash
uv run --python 3.12 python "$JUPYTER_NOTEBOOK_CLI" \
  --kind experiment \
  --title "Compare prompt variants" \
  --out output/jupyter-notebook/compare-prompt-variants.ipynb
```

## Authoring Rules

- Keep each code cell focused on one step
- Use short markdown cells to explain purpose and expected output
- Prefer compact, reproducible outputs over noisy notebook dumps
- Preserve the original notebook’s intent when refactoring
- Make reruns safe and understandable for another reader

## Quality Checklist

- Clear title and objective
- Ordered sections with small runnable steps
- Minimal hidden state between cells
- Inputs, outputs, and assumptions are obvious
- Notebook can be skimmed quickly and rerun without guesswork

