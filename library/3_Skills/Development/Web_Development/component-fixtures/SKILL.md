---
name: "🧩 Component Fixtures"
description: Build isolated component fixtures for screenshot testing and visual debugging. Use when creating fixture-friendly UI components, stable rendering setups, or screenshot regression coverage.
source: https://skillsmp.com/skills/microsoft-vscode-github-skills-component-fixtures-skill-md
author: microsoft
repository: https://github.com/microsoft/vscode
stars: 183825
forks: 39187
updated: 2026-04-01
---

# Component Fixtures

Use component fixtures to render UI in isolation for screenshot testing, visual review, and deterministic debugging.

## When To Use

- Add screenshot coverage for a component or widget
- Reproduce a UI bug outside the full app shell
- Make a component easier to theme, mock, and visually test
- Refactor brittle UI code that depends on global state or deep DOM context

## Fixture Rules

- Keep fixtures isolated from app-wide runtime assumptions
- Render with stable, explicit mock data
- Register disposables and clean up side effects
- Avoid async layout thrash and DOM reparenting after first render
- Prefer fixture helpers or shared utilities over one-off setup code

## Good Fixture Design

- Give each state its own named fixture
- Cover light and dark themes when relevant
- Include empty, loading, error, and completed states
- Mock required services through dependency injection
- Keep CSS selectors self-contained instead of relying on deep ancestor chains

## Component Refactors That Help

- Accept dependencies through constructors instead of singletons
- Expose a root `domNode` so fixtures can mount cleanly
- Add options to disable autofocus or animations for stable screenshots
- Allow pre-filled state so complex flows can be rendered directly

## Common Pitfalls

- Reparenting DOM after async work, which causes flicker
- Hidden service dependencies that are hard to mock
- CSS that only works inside a specific production container
- Fixtures that leak timers, listeners, or widget instances

## Verification

- Confirm the fixture renders deterministically across runs
- Capture screenshots only after the component reaches its final visual state
- Add variant coverage for states that have historically regressed
