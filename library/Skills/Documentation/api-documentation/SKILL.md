---
name: api-documentation
description: "Write API documentation including endpoint references, OpenAPI/Swagger specs, authentication guides, SDK quickstarts, and interactive code samples. Use when documenting REST APIs, GraphQL schemas, WebSocket interfaces, or SDK libraries. Also trigger for 'API docs', 'endpoint documentation', 'OpenAPI', 'Swagger', 'SDK documentation', 'API reference', or 'REST docs'."
---

# API Documentation — References, Guides & Specs

Write API documentation that developers trust, from endpoint references to quickstart guides to OpenAPI specifications.

## When to Use This Skill

**USE when:**
- Documenting REST, GraphQL, or WebSocket APIs
- Writing OpenAPI/Swagger specifications
- Creating SDK quickstart guides and code samples
- Documenting authentication and authorization flows
- Building interactive API reference pages

**DON'T USE when:**
- Writing general technical docs → use `/technical-writing`
- Creating end-user guides → use `/user-guides`
- Designing the API itself → use an API design skill

## Step 1: API Documentation Structure

### The Four Documentation Types

```
Every API needs all four — they serve different readers at different times:

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  QUICKSTART  │    │  TUTORIALS   │    │  REFERENCE   │    │   GUIDES     │
│              │    │              │    │              │    │              │
│ "Hello World │    │ "Build a     │    │ "Every       │    │ "How to      │
│  in 5 min"   │    │  real thing" │    │  endpoint"   │    │  handle X"   │
│              │    │              │    │              │    │              │
│ Goal: First  │    │ Goal: Learn  │    │ Goal: Look   │    │ Goal: Solve  │
│ successful   │    │ patterns     │    │ up details   │    │ specific     │
│ API call     │    │ and flows    │    │ on demand    │    │ problems     │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
 Read once           Read once           Read repeatedly     Read as needed
 (onboarding)        (learning)          (reference)         (problem-solving)
```

## Step 2: Quickstart Guide

### Template

```markdown
# Quickstart

Get your first API response in under 5 minutes.

## Prerequisites
- [Account/API key requirement]
- [Language/runtime requirement]

## 1. Get Your API Key

[Exact steps to obtain credentials — link to dashboard, screenshot if needed]

## 2. Install the SDK

```bash
npm install @company/sdk
# or
pip install company-sdk
```

## 3. Make Your First Request

```javascript
import { Client } from '@company/sdk';

const client = new Client({ apiKey: 'YOUR_API_KEY' });

const result = await client.resources.list();
console.log(result);
```

## 4. Expected Response

```json
{
  "data": [
    { "id": "res_123", "name": "My Resource", "status": "active" }
  ],
  "meta": { "total": 1, "page": 1 }
}
```

## Next Steps
- [Link to full tutorial]
- [Link to API reference]
- [Link to authentication guide]
```

### Quickstart Rules

```
✓ Reader should reach a successful API call in under 5 minutes
✓ Include EVERY command — don't assume they know how to install things
✓ Show the expected response — confirmation they did it right
✓ Use the simplest possible endpoint (list, get, not create/delete)
✓ Provide code in at least 2 languages (the most popular for your API)
✗ Don't explain architecture or design decisions here
✗ Don't show error handling — save that for tutorials
✗ Don't require complex setup (databases, Docker) for the quickstart
```

## Step 3: Endpoint Reference

### Endpoint Documentation Template

````markdown
## Create Resource

Creates a new resource in the specified project.

```
POST /v2/projects/{project_id}/resources
```

### Authentication
Requires Bearer token with `resources:write` scope.

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | string | Yes | The project's unique identifier |

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {token}` | Yes |
| `Content-Type` | `application/json` | Yes |
| `Idempotency-Key` | string (UUID) | Recommended |

### Request Body

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | Yes | — | Display name (1-255 chars) |
| `type` | string | Yes | — | One of: `standard`, `premium`, `enterprise` |
| `config` | object | No | `{}` | Configuration options |
| `config.timeout` | integer | No | `30` | Timeout in seconds (1-300) |
| `config.retries` | integer | No | `3` | Max retry attempts (0-10) |
| `tags` | string[] | No | `[]` | Up to 50 tags, each max 128 chars |

### Example Request

```bash
curl -X POST https://api.company.com/v2/projects/proj_abc/resources \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Resource",
    "type": "standard",
    "config": { "timeout": 60 },
    "tags": ["production", "primary"]
  }'
```

### Response — 201 Created

```json
{
  "id": "res_xyz789",
  "name": "My Resource",
  "type": "standard",
  "status": "provisioning",
  "config": {
    "timeout": 60,
    "retries": 3
  },
  "tags": ["production", "primary"],
  "created_at": "2026-03-30T12:00:00Z",
  "updated_at": "2026-03-30T12:00:00Z"
}
```

### Error Responses

| Status | Code | Description |
|--------|------|-------------|
| `400` | `invalid_request` | Request body validation failed |
| `401` | `unauthorized` | Missing or invalid API key |
| `403` | `forbidden` | API key lacks `resources:write` scope |
| `404` | `project_not_found` | Project ID does not exist |
| `409` | `conflict` | Resource with this name already exists |
| `422` | `unprocessable` | Valid JSON but semantically invalid |
| `429` | `rate_limited` | Too many requests — retry after `Retry-After` header |
````

### Endpoint Documentation Rules

```
MUST INCLUDE:
  ✓ HTTP method and path (with path parameters highlighted)
  ✓ Authentication requirements
  ✓ Every parameter with type, required/optional, default, constraints
  ✓ At least one complete request example (curl + one SDK language)
  ✓ Success response with realistic (not placeholder) data
  ✓ All error codes the endpoint can return
  ✓ Rate limit information

SHOULD INCLUDE:
  ~ Idempotency information for mutating endpoints
  ~ Pagination details for list endpoints
  ~ Webhook events triggered by this endpoint
  ~ Deprecation notices if applicable

FORMATTING RULES:
  - Parameter tables: alphabetical within required/optional groups
  - Examples: use realistic data, not "foo", "bar", "test"
  - Error descriptions: explain WHY, not just WHAT
  - Response fields: document every field, even obvious ones
```

## Step 4: Authentication Documentation

### Auth Guide Template

```markdown
# Authentication

## Overview
The API uses [Bearer tokens / API keys / OAuth 2.0] for authentication.
All requests must include valid credentials.

## Getting Credentials
1. [Sign in to the dashboard](link)
2. Navigate to Settings → API Keys
3. Click "Create Key" and select the required scopes
4. Copy the key — it won't be shown again

## Using Your API Key

### In HTTP Headers (recommended)
```bash
curl -H "Authorization: Bearer sk_live_..." https://api.company.com/v2/resources
```

### In SDK Configuration
```javascript
const client = new Client({ apiKey: process.env.COMPANY_API_KEY });
```

## Scopes

| Scope | Grants Access To |
|-------|-----------------|
| `resources:read` | List and retrieve resources |
| `resources:write` | Create, update, and delete resources |
| `admin` | Full account access |

## Security Best Practices
- Never commit API keys to version control
- Use environment variables or secret managers
- Rotate keys periodically
- Use the minimum required scope
- Use test keys (`sk_test_`) for development

## Rate Limits

| Plan | Requests/min | Burst |
|------|-------------|-------|
| Free | 60 | 10 |
| Pro | 600 | 50 |
| Enterprise | 6,000 | 200 |

When rate limited, the API returns `429` with a `Retry-After` header.
```

## Step 5: OpenAPI Specification

### Minimal OpenAPI 3.1 Template

```yaml
openapi: 3.1.0
info:
  title: Company API
  version: 2.0.0
  description: |
    The Company API provides programmatic access to resources.
  contact:
    email: api-support@company.com
  license:
    name: MIT

servers:
  - url: https://api.company.com/v2
    description: Production
  - url: https://api-staging.company.com/v2
    description: Staging

security:
  - bearerAuth: []

paths:
  /resources:
    get:
      operationId: listResources
      summary: List all resources
      tags: [Resources]
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: cursor
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResourceList'
        '401':
          $ref: '#/components/responses/Unauthorized'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

  schemas:
    Resource:
      type: object
      required: [id, name, type, status]
      properties:
        id:
          type: string
          example: res_xyz789
        name:
          type: string
          example: My Resource
        type:
          type: string
          enum: [standard, premium, enterprise]
        status:
          type: string
          enum: [provisioning, active, suspended, deleted]

  responses:
    Unauthorized:
      description: Authentication failed
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

## Step 6: Code Samples

### Multi-Language Sample Template

````markdown
### Create a Resource

<tabs>
<tab title="curl">
```bash
curl -X POST https://api.company.com/v2/resources \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Resource", "type": "standard"}'
```
</tab>

<tab title="JavaScript">
```javascript
const resource = await client.resources.create({
  name: 'My Resource',
  type: 'standard',
});
console.log(resource.id); // res_xyz789
```
</tab>

<tab title="Python">
```python
resource = client.resources.create(
    name="My Resource",
    type="standard",
)
print(resource.id)  # res_xyz789
```
</tab>
</tabs>
````

### Code Sample Rules

```
✓ Every sample must be copy-pasteable and runnable
✓ Use environment variables for secrets, never hardcode
✓ Include the import/require statement
✓ Show error handling in tutorials (not in quickstart)
✓ Use the official SDK, not raw HTTP, when an SDK exists
✓ Match the language conventions (snake_case for Python, camelCase for JS)
✗ Don't use placeholder values like "foo" — use realistic examples
✗ Don't skip steps — if they need to install something, show it
✗ Don't mix languages in one sample
```

## Step 7: Versioning & Changelog

### API Changelog Template

```markdown
# API Changelog

## 2026-03-30 — v2.5.0
### Added
- `PATCH /resources/{id}` — partial update support
- `tags` field on Resource object

### Changed
- `GET /resources` now supports cursor-based pagination (offset pagination deprecated)

### Deprecated
- `offset` parameter on `GET /resources` — use `cursor` instead. Removal: 2026-09-30.

### Fixed
- `429` responses now include `Retry-After` header consistently
```

## Output

Save API documentation to the appropriate location:
- Quickstart: `docs/quickstart.md`
- Reference: `docs/api/[resource].md`
- OpenAPI spec: `openapi.yaml` or `openapi.json`

## Guidelines

- **The quickstart is the front door** — if it doesn't work flawlessly, developers leave
- Every endpoint example must actually work — test it yourself before publishing
- Error documentation is as important as success documentation — developers spend more time debugging
- Use consistent patterns — if one endpoint uses `data` as a wrapper, all endpoints should
- Version your API docs alongside your API — they must always match
- Use `/technical-writing` for prose quality within API docs
- Use `documentation-templates` for structural starting points
- Use `/release-notes` for communicating API changes to consumers
