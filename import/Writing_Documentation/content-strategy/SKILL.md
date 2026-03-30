---
name: content-strategy
description: "Plan documentation systems including information architecture, content audits, taxonomy design, content lifecycle management, and doc-as-code workflows. Use when organizing a documentation set, planning content structure, or designing navigation and discovery. Also trigger for 'information architecture', 'content audit', 'doc structure', 'taxonomy', 'content planning', 'documentation strategy', 'IA design', or 'sitemap'."
---

# Content Strategy — Architecture, Planning & Organization

Design the system that organizes all your documentation — from information architecture to content lifecycle to navigation and discovery.

## When to Use This Skill

**USE when:**
- Planning a new documentation site or help center from scratch
- Restructuring an existing doc set that's grown organically
- Conducting a content audit (what exists, what's missing, what's stale)
- Designing navigation, taxonomy, and URL structure
- Setting up docs-as-code workflows and contribution processes

**DON'T USE when:**
- Writing individual documents → use `/technical-writing`, `/user-guides`, etc.
- Creating templates → use `documentation-templates`
- Defining editorial standards → use `/style-guide`

## Step 1: Content Audit

### Audit Spreadsheet

```markdown
| URL/Path | Title | Type | Audience | Last Updated | Traffic | Accuracy | Quality | Action |
|----------|-------|------|----------|-------------|---------|----------|---------|--------|
| /docs/setup | Getting Started | Tutorial | Beginner | 2025-06 | High | Outdated | Medium | Update |
| /docs/api/auth | Auth API | Reference | Developer | 2026-01 | High | Current | High | Keep |
| /docs/legacy | Old Widget Guide | Guide | — | 2023-04 | Zero | Obsolete | Low | Delete |
| — | WebSocket Guide | — | Developer | — | — | — | — | Create |
```

### Audit Categories

```
FOR EACH PIECE OF CONTENT, ASSESS:

ACCURACY:
  Current — matches the product as of today
  Outdated — partially correct but needs updating
  Obsolete — no longer applicable (feature removed, deprecated)

QUALITY:
  High — well-written, well-structured, tested
  Medium — functional but needs improvement
  Low — confusing, incomplete, or poorly organized

ACTION:
  Keep — no changes needed
  Update — refresh content, screenshots, examples
  Rewrite — structure or approach is wrong; redo from scratch
  Merge — combine with another doc (redundant content)
  Split — too long; break into focused pages
  Delete — no longer needed; redirect to replacement
  Create — gap identified; content doesn't exist yet
```

## Step 2: Information Architecture

### Content Model

```
Define the TYPES of content your docs contain:

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  QUICKSTART  │  │  TUTORIAL    │  │  HOW-TO      │  │  REFERENCE   │
│              │  │              │  │              │  │              │
│ 1 per product│  │ 5-10 total   │  │ 20-50+ total │  │ Per endpoint │
│ Goal: first  │  │ Goal: teach  │  │ Goal: solve  │  │ Goal: look up│
│ success      │  │ concepts     │  │ tasks        │  │ specs        │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ EXPLANATION  │  │  CHANGELOG   │  │    FAQ /      │
│              │  │              │  │  KNOWLEDGE    │
│ 5-15 total   │  │ Per release  │  │  BASE         │
│ Goal: deepen │  │ Goal: inform │  │ Goal: quick   │
│ understanding│  │ of changes   │  │ answers       │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Navigation Architecture

```
TOP-LEVEL NAV (max 5-7 items):
  docs/
  ├── Getting Started          ← Onboarding path
  │   ├── quickstart.md
  │   ├── installation.md
  │   └── first-project.md
  │
  ├── Guides                   ← Task-based
  │   ├── authentication.md
  │   ├── data-import.md
  │   └── deployment.md
  │
  ├── API Reference            ← Lookup
  │   ├── resources.md
  │   ├── users.md
  │   └── webhooks.md
  │
  ├── Concepts                 ← Understanding
  │   ├── architecture.md
  │   ├── data-model.md
  │   └── security.md
  │
  └── Resources                ← Support
      ├── changelog.md
      ├── faq.md
      ├── troubleshooting.md
      └── community.md

RULES:
  ✓ Max 3 levels deep (section → page → heading anchor)
  ✓ Section labels describe CONTENT, not AUDIENCE
  ✓ Most important/popular items first within each section
  ✓ "Getting Started" is always first
  ✓ API Reference is always in the same position
```

### URL Structure

```
PATTERNS:
  /docs/{section}/{page}
  /docs/guides/authentication
  /docs/api/resources
  /docs/concepts/data-model

RULES:
  ✓ Lowercase, hyphenated (kebab-case)
  ✓ Descriptive (reading the URL tells you what's on the page)
  ✓ Stable (don't change URLs — set up redirects if you must)
  ✓ No version numbers in URLs unless multi-version docs
  ✓ No file extensions (.html, .md) in public URLs
  ✗ /docs/section1/page3 (meaningless)
  ✗ /docs/guide_to_setting_up (inconsistent separator)
```

## Step 3: Content Planning

### Gap Analysis

```
MAP FEATURES TO CONTENT:

| Feature | Quickstart | Tutorial | How-To | Reference | Explanation |
|---------|-----------|---------|--------|-----------|------------|
| Auth | ✓ | ✓ | ✓ | ✓ | ✓ |
| API | ✓ | ✓ | ✓ | ✓ | ✗ ← gap |
| Webhooks | ✗ ← gap | ✗ ← gap | ✓ | ✓ | ✗ ← gap |
| Search | ✓ | ✓ | ✓ | ✓ | ✓ |

Prioritize gaps by: user traffic × support ticket volume
```

### Content Roadmap

```markdown
## Documentation Roadmap — Q2 2026

### Priority 1 (This Month)
- [ ] Rewrite Getting Started guide (outdated screenshots)
- [ ] Create Webhooks tutorial (top support request)
- [ ] Update API reference for v2.5 changes

### Priority 2 (Next Month)
- [ ] Add 5 how-to guides for top use cases
- [ ] Create architecture explanation doc
- [ ] Audit and update all code examples

### Priority 3 (Following Month)
- [ ] Build troubleshooting knowledge base
- [ ] Add video tutorials for top 3 workflows
- [ ] Implement docs search analytics

### Ongoing
- [ ] Update docs with every release
- [ ] Review top 10 pages monthly for freshness
- [ ] Track and respond to doc feedback
```

## Step 4: Docs-as-Code Workflow

### Repository Structure

```
docs/
├── content/                    ← All documentation source files
│   ├── getting-started/
│   ├── guides/
│   ├── api/
│   └── concepts/
├── static/                     ← Images, diagrams, assets
│   ├── images/
│   └── diagrams/
├── templates/                  ← Page templates
├── .vale.ini                   ← Style linter configuration
├── vale/styles/                ← Custom style rules
├── docusaurus.config.js        ← (or mkdocs.yml, etc.)
└── README.md                   ← Contributing guide
```

### Contribution Workflow

```
WRITING FLOW:
  1. Branch from main: docs/[change-description]
  2. Write or update content following style guide
  3. Run linter (Vale): vale content/path/to/file.md
  4. Preview locally: npm run start (Docusaurus) or mkdocs serve
  5. Open PR with description of changes
  6. Review: style compliance + technical accuracy + link check
  7. Merge → auto-deploy to docs site

PR CHECKLIST:
  □ Content follows style guide
  □ Vale linter passes with no errors
  □ Links checked (no broken links)
  □ Code examples tested
  □ Screenshots current (if applicable)
  □ Redirects added (if URLs changed)
```

### Tool Selection

| Tool | Best For | Ecosystem |
|------|---------|-----------|
| **Docusaurus** | React-based docs, versioning | JavaScript/React |
| **MkDocs + Material** | Python ecosystem, clean design | Python |
| **GitBook** | Non-technical contributors, collaboration | SaaS |
| **Mintlify** | API-first docs, beautiful defaults | SaaS |
| **Starlight** | Astro ecosystem, fast, modern | JavaScript |
| **Sphinx** | Python API docs (autodoc), academic | Python |
| **Hugo** | Speed, large doc sets, custom templates | Go |
| **Vale** | Prose linting (works with any tool above) | CLI |

## Step 5: Content Lifecycle

### Content States

```
DRAFT → REVIEW → PUBLISHED → MAINTAINED → ARCHIVED

DRAFT:
  - Author writes content
  - Not visible to users
  - May have [TBD] sections

REVIEW:
  - Technical review (accuracy)
  - Editorial review (style, clarity)
  - Minimum 1 reviewer per doc

PUBLISHED:
  - Live and visible to users
  - Indexed by search
  - Owner assigned for maintenance

MAINTAINED:
  - Reviewed on schedule (quarterly or per release)
  - Updated when product changes
  - Flagged if accuracy degrades

ARCHIVED:
  - No longer current (feature deprecated, version EOL)
  - Removed from navigation
  - Still accessible via direct URL with "archived" banner
  - Redirects to replacement content if available
```

### Freshness Schedule

```
REVIEW CADENCE BY CONTENT TYPE:

| Content Type | Review Frequency | Trigger |
|-------------|-----------------|---------|
| Quickstart | Every release | Product change |
| Tutorials | Quarterly | UI/API change |
| How-tos | Quarterly | Feature update |
| API Reference | Every release | API change |
| Explanations | Bi-annually | Architecture change |
| Changelog | Every release | Automatic |
| FAQ | Monthly | Support ticket trends |
```

## Step 6: Measuring Documentation Quality

### Metrics to Track

```
DISCOVERY:
  - Search queries with no results (content gaps)
  - Top search terms (what users need most)
  - Page views by section (what's actually used)

EFFECTIVENESS:
  - Time on page (are they reading or bouncing?)
  - Task completion rate (for tutorials)
  - Support ticket deflection (did docs reduce tickets?)
  - Feedback ratings ("Was this helpful?" yes/no)

FRESHNESS:
  - Pages not updated in 6+ months
  - Pages with broken links
  - Pages referencing deprecated features

COVERAGE:
  - Features without documentation
  - API endpoints without reference pages
  - User journey steps without guidance
```

## Output

Save content strategy to `artifacts/content-strategy/[project]-content-strategy.md`

## Guidelines

- **Structure before content** — get the architecture right before writing individual pages
- **Every page needs an owner** — orphaned docs rot; assigned docs stay current
- Delete aggressively — outdated docs are worse than no docs (they mislead)
- Navigation should mirror the user's mental model, not your org chart
- Use `/technical-writing` for writing principles within the strategy
- Use `/style-guide` to define the editorial standards writers follow
- Use `documentation-templates` for page templates within the architecture
- Use `/knowledge-base` for FAQ and troubleshooting content design
