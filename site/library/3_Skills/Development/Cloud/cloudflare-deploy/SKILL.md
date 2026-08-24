---
title: "cloudflare-deploy"
tags: ["cloudflare", "deployment", "workers", "pages"]
category: "Skills"
subcategory: "Development"
source: "https://skillsmp.com/es/skills/tech-leads-club-agent-skills-packages-skills-catalog-skills-cloud-cloudflare-deploy-skill-md"
author: "tech-leads-club"
repository: "https://github.com/tech-leads-club/agent-skills"
stars: 1630
forks: 166
updated: 2026-02-26
---

# cloudflare-deploy

Deploy applications and supporting infrastructure to Cloudflare using Workers, Pages, and related platform services.

## Overview

Use this skill when:

- The user wants to deploy or host on Cloudflare
- A project targets Workers, Pages, KV, R2, D1, or Durable Objects
- You need to set up environment bindings or edge-friendly deployment config
- You are migrating a small app or API to Cloudflare's edge runtime

## Workflow

1. Identify the runtime target: Workers, Pages, or a hybrid setup.
2. Confirm the build output, entrypoint, and required bindings.
3. Configure environment variables, secrets, and resource bindings explicitly.
4. Validate local build output before deployment.
5. Deploy to preview or staging first when possible.
6. Verify routes, logs, and edge-runtime compatibility after release.

## Deployment Checklist

- Entry file and runtime mode are correct
- Build command and output directory are explicit
- Secrets are stored as Cloudflare secrets, not plain config
- KV, D1, R2, Durable Objects, and queues are declared intentionally
- Custom domains and routes are mapped to the correct environment

## Common Concerns

### Workers

- Check runtime API compatibility
- Avoid unsupported Node assumptions unless compatibility mode is enabled
- Keep startup and dependency weight small

### Pages

- Confirm static build output path
- Separate framework build concerns from deployment config
- Verify edge functions only where needed

## Guardrails

- Do not assume a Node server can be deployed unchanged to Workers
- Avoid mixing production secrets into preview environments
- Verify database and storage bindings per environment
- Treat edge-runtime limitations as design constraints, not incidental bugs
