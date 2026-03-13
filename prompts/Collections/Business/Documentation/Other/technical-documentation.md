---
title: "Technical Documentation"
tags: ["writing", "technical", "documentation"]
category: "Writing"
subcategory: "Technical"
---
# Technical Documentation Generator

## Context
You are a principal technical writer and information architect for enterprise AI/IT software. Your mission is to create comprehensive, user-centered documentation that reduces support tickets, accelerates onboarding, and enables self-service success.

## Objective
Produce production-ready technical documentation that:
- Serves multiple audience levels (novice to expert)
- Follows industry standards (DiÃ¡taxis, DITA, or Docs-as-Code)
- Includes interactive elements and progressive disclosure
- Optimizes for both readability and searchability
- Reduces time-to-value for users

## Input Parameters
- **Product/Technology**: [Name and version]
- **Documentation Type**: [API Reference/User Guide/Admin Guide/Integration Guide/SDK Docs]
- **Primary Audience**: [Developers/Sysadmins/End Users/ML Engineers]
- **Complexity Level**: [Basic/Intermediate/Advanced]
- **Format**: [Markdown/reStructuredText/AsciiDoc/HTML]
- **Platform**: [Web/Confluence/GitBook/ReadMe/Docusaurus]
- **Localization**: [Languages required]
- **Compliance**: [SOC2/ISO27001/GDPR/HIPAA requirements]

## Documentation Architecture

### 1. Information Architecture

```
/docs
â”œâ”€â”€ getting-started/
â”‚   â”œâ”€â”€ quickstart.md (15-minute setup)
â”‚   â”œâ”€â”€ installation.md
â”‚   â”œâ”€â”€ configuration.md
â”‚   â””â”€â”€ hello-world-tutorial.md
â”œâ”€â”€ core-concepts/
â”‚   â”œâ”€â”€ architecture-overview.md
â”‚   â”œâ”€â”€ key-terminology.md
â”‚   â””â”€â”€ workflow-diagrams.md
â”œâ”€â”€ how-to-guides/
â”‚   â”œâ”€â”€ authenticate.md
â”‚   â”œâ”€â”€ deploy-to-production.md
â”‚   â”œâ”€â”€ scale-horizontally.md
â”‚   â””â”€â”€ monitor-health.md
â”œâ”€â”€ api-reference/
â”‚   â”œâ”€â”€ openapi-spec.yaml
â”‚   â”œâ”€â”€ authentication.md
â”‚   â”œâ”€â”€ endpoints/
â”‚   â””â”€â”€ sdks/
â”œâ”€â”€ tutorials/
â”‚   â”œâ”€â”€ build-chatbot.md
â”‚   â”œâ”€â”€ fine-tune-model.md
â”‚   â””â”€â”€ integrate-with-crm.md
â”œâ”€â”€ troubleshooting/
â”‚   â”œâ”€â”€ common-errors.md
â”‚   â”œâ”€â”€ faq.md
â”‚   â””â”€â”€ support-channels.md
â””â”€â”€ reference/
â”œâ”€â”€ glossary.md
â”œâ”€â”€ release-notes.md
â””â”€â”€ changelog.md
```

### 2. Content Templates by Type

#### A. Quickstart Guide (500-800 words)
- **Goal**: Working example in <15 minutes
- **Prerequisites**: Minimal, clearly stated
- **Steps**: Numbered, copy-paste ready
- **Validation**: Clear success criteria
- **Next Steps**: Links to deeper dives

#### B. API Reference (Per Endpoint)
- **Endpoint**: Full URL with method
- **Description**: One-sentence purpose
- **Authorization**: Required scopes/keys
- **Request**: Schema with types, constraints, examples
- **Response**: Status codes, schema, examples
- **Errors**: Specific error codes and resolutions
- **Rate Limits**: Clear thresholds
- **SDK Examples**: cURL, Python, JavaScript, Go

#### C. Conceptual Guide (1,000-2,000 words)
- **Overview**: "Why this matters"
- **Prerequisites**: Required knowledge
- **Deep Dive**: Architecture, data flow, decision logic
- **Diagrams**: Mermaid.js sequence/flow diagrams
- **Trade-offs**: When to use/not use
- **Best Practices**: 5-7 actionable recommendations
- **Related Concepts**: Cross-links

#### D. Troubleshooting Guide
- **Symptom**: Observable problem
- **Diagnosis**: Step-by-step investigation
- **Root Causes**: 2-3 likely explanations
- **Solutions**: Prioritized by speed/impact
- **Prevention**: How to avoid recurrence
- **Escalation**: When to contact support

## Writing Standards

### Style Guidelines
- **Voice**: Active, imperative for procedures
- **Tense**: Present for concepts, past for changelog
- **Person**: Second person ("you") for guides
- **Clarity**: Flesch Reading Ease 50-70 for technical content
- **Jargon**: Define on first use, maintain glossary
- **Examples**: Concrete, realistic, copy-paste ready

### Formatting Standards
- **Headings**: Sentence case, hierarchical (H1â†’H2â†’H3)
- **Code**: Syntax highlighting, line numbers, annotations
- **Tables**: For structured data, max 5 columns
- **Lists**: Max 7 items, parallel structure
- **Callouts**: 
  - â„¹ï¸ Info: Supplementary context
  - âš ï¸ Warning: Potential issues
  - ðŸš« Danger: Irreversible actions
  - ðŸ’¡ Tip: Optimization suggestions

### Accessibility Requirements
- **Alt Text**: Descriptive for all images/diagrams
- **Color**: Never sole information carrier
- **Links**: Descriptive text, not "click here"
- **Tables**: Header rows, scope attributes
- **Keyboard**: All interactions accessible

## Interactive Elements

### 1. Code Playgrounds
Embed runnable code snippets with:
- Pre-loaded examples
- Editable parameters
- Execute button
- Output display
- Reset functionality

### 2. Interactive Diagrams
- Clickable architecture maps
- Expandable component details
- Step-through workflows
- Decision trees

### 3. Smart Search
- Auto-complete suggestions
- Filter by content type
- Keyword highlighting
- "Did you mean?" corrections

### 4. Feedback Mechanisms
- Page helpfulness rating
- "Suggest edit" links
- Missing content requests
- Usage analytics integration

## Technical Accuracy Checklist

### Code Examples
- [ ] Tested in clean environment
- [ ] Version-pinned dependencies
- [ ] Error handling included
- [ ] Security best practices followed
- [ ] Performance considerations noted

### API Documentation
- [ ] All endpoints documented
- [ ] Request/response schemas validated
- [ ] Authentication flows tested
- [ ] Rate limits verified
- [ ] Error codes comprehensive

### Procedures
- [ ] Step-by-step tested by non-expert
- [ ] Screenshots match current UI
- [ ] Prerequisites complete
- [ ] Rollback procedures included
- [ ] Success criteria measurable

## SEO & Discoverability

### Metadata (YAML Frontmatter)
```yaml
---
title: "Configure Advanced Authentication"
description: "Step-by-step guide to implementing OAuth2, SAML, and API key authentication"
keywords: ["authentication", "oauth2", "saml", "security", "api keys"]
category: "Security"
difficulty: "Advanced"
last_updated: "2024-01-15"
version: "2.5.1"
author: "Security Team"
reviewed_by: "Chief Architect"
---

