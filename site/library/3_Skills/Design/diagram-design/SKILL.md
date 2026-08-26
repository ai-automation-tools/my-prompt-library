---
name: diagram-design
description: Generates 28 types of editorial-quality diagrams (flowcharts, architecture, org charts, quadrants, timelines, Gantt, funnels, and more) as self-contained HTML+SVG, styled to match a brand's colors and fonts pulled from its website — instead of generic "Mermaid-slop" output. Use when a diagram needs to look publication-ready or on-brand, not just structurally correct.
source: https://github.com/cathrynlavery/diagram-design
author: cathrynlavery
repository: https://github.com/cathrynlavery/diagram-design
stars: 22900
forks: 1400
updated: 2026-08-19
license: MIT
upstream:
  match: unknown
  declared: "https://github.com/cathrynlavery/diagram-design"
  checked: 2026-08-26
---

# Diagram Design

Distinct from asking an LLM for a Mermaid diagram: produces styled, brand-matched SVG output meant to ship as-is rather than get redesigned afterward.

## Prerequisites

- Install as a Claude Code plugin (`/plugin marketplace add cathrynlavery/diagram-design`), or via the equivalent Codex/Pi install command
- No build step or design tool (e.g. Figma) required

## When To Use

- The diagram needs to go straight into a deck, doc, or webpage without manual redesign
- Generic flowchart/architecture output from an LLM reads as visually unpolished for the audience
- A brand-consistent look (matching a company or product's existing site) matters more than raw structural correctness
- Importing and re-rendering an existing diagram (e.g. a `.drawio` file) in the house style

## Usage

1. On first use, let the onboarding flow fetch the target website's homepage to extract dominant colors and fonts.
2. Review the proposed style-guide tokens (paper/background, ink/text, muted/secondary text, accent, link) — accept them or customize manually.
3. The skill checks WCAG AA contrast automatically and proposes adjustments where the extracted palette fails it.
4. Request a diagram in plain language — e.g. "Make me an architecture diagram of my app" or "Give me a quadrant showing Q2 projects by impact vs. effort."
5. To bring in an existing diagram instead, use the import command, e.g. `/diagram-design:import-drawio platform.drawio --size=slide-16x9`.
6. Check the generated "fidelity receipt," which lists which URLs were sampled and which fonts were used, before shipping the output.

## Examples

- Architecture diagrams, ER/data models, and layer stacks for technical docs
- Quadrants, 2x2s, and radar charts for strategy decks
- Timelines and Gantt charts for project status updates
- Org charts, pyramids/funnels, and flywheels for internal presentations

## Best Practices

- Run brand-matching once per project/site and reuse the resulting style guide rather than re-extracting on every diagram.
- Pick the diagram type that matches the actual relationship in the data (e.g. quadrant for a two-axis comparison, not a generic flowchart) — the type list is large enough that there's rarely a good excuse to default to the wrong one.
- Check the fidelity receipt before treating brand-matched output as final; a bad font/color extraction from an unusual homepage layout is possible.
- Complements rather than replaces `Development/Architecture/mermaid-diagram-specialist` — reach for that one when the diagram needs to stay Mermaid-source-editable; reach for this one when the output needs to be publication-ready as-is.

## References

- Repository: https://github.com/cathrynlavery/diagram-design
