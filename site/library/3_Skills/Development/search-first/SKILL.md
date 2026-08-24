---
title: "search-first"
tags: ["research", "development", "libraries", "workflow"]
category: "Skills"
subcategory: "Development"
source: "https://skillsmp.com/skills/affaan-m-everything-claude-code-kiro-skills-search-first-skill-md"
---

# search-first

Research-before-coding workflow. Search for existing tools, libraries, and patterns before writing custom code.

## Overview

Use this skill when:

- Starting a new feature that likely already has existing solutions
- Adding a dependency or integration
- Creating a new utility, helper, or abstraction
- The user asks for functionality and implementation is about to begin

## Workflow

1. Define the capability that is needed.
2. Identify language, framework, and project constraints.
3. Search in parallel across package registries, MCP servers, skills, GitHub, and the web.
4. Evaluate candidates for fit, maintenance, community health, docs, license, and dependency cost.
5. Decide whether to adopt, extend, compose, or build custom.
6. Implement the smallest viable solution.

## Decision Matrix

| Signal | Action |
|--------|--------|
| Exact match, maintained, permissive license | Adopt directly |
| Partial match, strong base | Extend with a thin wrapper |
| Several weak matches | Compose small pieces |
| Nothing suitable | Build custom, informed by research |

## Quick Checklist

Before writing code:

1. Search the repo first with `rg`.
2. Check package ecosystems like npm and PyPI.
3. Check whether an MCP server already solves the problem.
4. Check whether an existing skill already covers it.
5. Check GitHub for maintained OSS implementations and templates.

## Examples

### Dead link checking

- Need: validate markdown links
- Search: existing CLI tools or lint rules
- Result: install a maintained checker instead of building one

### HTTP client wrapper

- Need: retries and timeout handling
- Search: production-proven HTTP clients first
- Result: adopt an existing client and configure it

### Config validation

- Need: validate config files against a schema
- Search: CLI schema validators
- Result: install a validator and add a project-specific schema

## Anti-Patterns

- Writing a utility before checking whether it already exists
- Ignoring available MCP servers or skills
- Building a heavy wrapper around a solid library
- Adding large dependencies for a tiny need
