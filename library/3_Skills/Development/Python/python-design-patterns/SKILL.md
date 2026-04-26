---
name: "🐍 Python Design Patterns"
description: Python architecture and code-structure guidance centered on KISS, single responsibility, composition over inheritance, and the rule of three. Use when designing new components or refactoring complex Python code.
source: https://skillsmp.com/skills/wshobson-agents-plugins-python-development-skills-python-design-patterns-skill-md
author: wshobson
repository: https://github.com/wshobson/agents
stars: 30813
forks: 3381
updated: 2026-01-30
---

# Python Design Patterns

Write Python that stays easy to understand, test, and modify as the codebase grows.

## When To Use

- Design a new Python module, service, or component
- Refactor overly abstract or tangled code
- Decide whether to introduce an abstraction
- Choose between inheritance and composition
- Reduce coupling and simplify responsibility boundaries

## Core Principles

### KISS

Choose the simplest solution that satisfies the real requirement.

### Single Responsibility Principle

Each class or function should have one reason to change.

### Composition Over Inheritance

Build behavior by combining focused objects instead of growing deep class hierarchies.

### Rule Of Three

Wait for repeated need before introducing a reusable abstraction.

## Decision Rules

- Prefer plain functions and dictionaries before factories or registries
- Add abstractions only when they remove real duplication or coupling
- Split code when one unit mixes transport, validation, business logic, and persistence
- Reject clever indirection unless it clearly improves maintainability

## Review Checklist

- Is there a simpler implementation?
- Does each unit have one reason to change?
- Is inheritance solving a real problem, or just adding structure?
- Has the code repeated enough times to justify abstraction?
- Will another engineer understand the design quickly?

