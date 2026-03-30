---
name: release-notes
description: "Write release notes, changelogs, migration guides, deprecation notices, and version announcements that communicate changes clearly to users and developers. Use when shipping a new version, deprecating features, or guiding users through breaking changes. Also trigger for 'release notes', 'changelog', 'migration guide', 'breaking changes', 'deprecation notice', 'version update', 'what's new', or 'upgrade guide'."
---

# Release Notes — Changelogs, Migrations & Announcements

Communicate product changes so users know what's new, what's changed, what's fixed, and what action they need to take.

## When to Use This Skill

**USE when:**
- Writing release notes for a new version
- Maintaining a changelog (Keep a Changelog format)
- Creating migration guides for breaking changes
- Writing deprecation notices with timelines
- Announcing features to users (blog, email, in-app)

**DON'T USE when:**
- Writing product documentation → use `/user-guides`
- Writing marketing announcements → use `/copywriting`
- Planning documentation structure → use `/content-strategy`

## Step 1: Changelog (Developer-Facing)

### Keep a Changelog Format

```markdown
# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- WebSocket support for real-time event streaming (#234)

### Changed
- Increase default timeout from 30s to 60s (#241)

---

## [2.5.0] - 2026-03-30

### Added
- `PATCH /resources/{id}` endpoint for partial updates (#198)
- `tags` field on Resource objects (#201)
- Cursor-based pagination on all list endpoints (#205)

### Changed
- Default rate limit increased from 60 to 120 requests/minute (#210)
- Error responses now include `request_id` for support debugging (#212)

### Deprecated
- Offset-based pagination on `GET /resources` — use `cursor` parameter
  instead. Will be removed in v3.0.0 (target: Q4 2026). (#205)

### Fixed
- `429` responses now consistently include `Retry-After` header (#215)
- Fixed race condition in concurrent resource creation (#218)

### Security
- Upgraded dependency `libcrypto` to 3.1.2 (CVE-2026-1234) (#220)

---

## [2.4.1] - 2026-03-15

### Fixed
- Fix crash when creating resource with empty tags array (#195)
```

### Changelog Rules

```
CATEGORIES (in this order):
  Added      — new features
  Changed    — changes to existing functionality
  Deprecated — features that will be removed in a future version
  Removed    — features that were removed in this version
  Fixed      — bug fixes
  Security   — vulnerability patches

FORMATTING:
  ✓ Most recent version at the top
  ✓ Date in ISO 8601 format (YYYY-MM-DD)
  ✓ Link to PR/issue number for every entry
  ✓ Write entries as complete sentences (not fragments)
  ✓ Group by category, not by file changed or developer
  ✗ Don't include internal refactoring (unless it affects users)
  ✗ Don't include test changes or CI fixes
  ✗ Don't say "various bug fixes" — list them specifically

VERSIONING:
  MAJOR.MINOR.PATCH (Semantic Versioning)
  MAJOR: Breaking changes (remove feature, change API contract)
  MINOR: New features (backward compatible)
  PATCH: Bug fixes (backward compatible)
```

## Step 2: Release Notes (User-Facing)

### Release Note Template

```markdown
# What's New in [Product] [Version]

*Released [date]*

## Highlights

### [Feature Name] — [One-line benefit]
[2-3 sentences explaining what it does and why it matters to the user.
Focus on the benefit, not the implementation.]

[Screenshot or GIF showing the feature]

[Link: Learn more → /docs/features/feature-name]

### [Feature Name] — [One-line benefit]
[Same pattern...]

## Improvements
- **[Area]:** [What improved and how it helps] (#issue)
- **[Area]:** [What improved and how it helps] (#issue)

## Bug Fixes
- Fixed [specific behavior] that caused [user-facing problem] (#issue)
- Fixed [specific behavior] that caused [user-facing problem] (#issue)

## Breaking Changes
⚠️ **[Change description]** — [What you need to do]
See the [migration guide](/docs/migrate/v2-to-v3) for details.

## Deprecations
- `[feature/parameter]` is deprecated and will be removed in [version]
  on [date]. Use `[replacement]` instead.
  [Migration guide →](/docs/migrate/feature-name)
```

### Writing Release Notes by Audience

```
DEVELOPER AUDIENCE:
  ✓ Specific: endpoint names, parameter changes, code examples
  ✓ Include code migration snippets
  ✓ Link to API reference and changelog
  ✓ Note SDK version updates

  "The `GET /users` endpoint now supports cursor-based pagination.
   Pass `cursor` instead of `offset`. The `offset` parameter is
   deprecated and will be removed in v3.0."

END USER AUDIENCE:
  ✓ Benefit-focused: what they can DO now, not what changed internally
  ✓ Screenshots and GIFs for visual changes
  ✓ Skip technical internals
  ✓ Celebrate the wins

  "You can now filter your dashboard by date range. Click the
   calendar icon in the top right to select your dates."

MIXED AUDIENCE:
  ✓ Lead with user-facing highlights
  ✓ Technical details in collapsible section or separate changelog link
  ✓ Breaking changes prominently flagged regardless of audience
```

## Step 3: Migration Guides

### Migration Guide Template

```markdown
# Migrating from [v2] to [v3]

This guide covers everything you need to update when upgrading from
[Product] v2.x to v3.0. Most applications can migrate in under [time].

## Overview of Changes

| Change | Impact | Required Action |
|--------|--------|----------------|
| [Change 1] | Breaking | [What to do] |
| [Change 2] | Breaking | [What to do] |
| [Change 3] | Non-breaking | [Optional improvement] |

## Before You Start
- [ ] Backup your configuration
- [ ] Review the [changelog](/changelog) for v3.0
- [ ] Update SDK to latest v2.x first (for compatibility warnings)
- [ ] Run your test suite to establish baseline

## Step-by-Step Migration

### 1. Update the SDK

```bash
npm install @company/sdk@3.0.0
```

### 2. [Breaking Change 1]: [Description]

**What changed:** [Specific API/behavior change]

**Before (v2):**
```javascript
client.resources.list({ offset: 20, limit: 10 });
```

**After (v3):**
```javascript
client.resources.list({ cursor: 'abc123', limit: 10 });
```

**Why:** [Brief rationale for the change]

### 3. [Breaking Change 2]: [Description]

[Same pattern...]

## Verify Your Migration
After completing all steps:

```bash
npm test                    # Run your test suite
npm run integration-test    # Test against the v3 API
```

## Getting Help
- [Community forum](/community)
- [Support email](mailto:support@company.com)
- [Migration FAQ](#faq)

## FAQ

**Q: Can I run v2 and v3 side by side?**
A: [Answer]

**Q: Is there a deadline to migrate from v2?**
A: v2 will be supported until [date]. After that, [consequence].
```

### Migration Guide Rules

```
✓ Include before/after code for EVERY breaking change
✓ Provide a checklist format — users check off as they complete
✓ Estimate total migration time ("most apps: 30 minutes")
✓ Include a "verify" step — how they confirm it worked
✓ Link to old and new docs for reference
✓ Test the migration guide yourself on a real codebase
✗ Don't assume the reader remembers v2 details — show the old code too
✗ Don't bundle non-breaking changes with breaking ones — separate them
```

## Step 4: Deprecation Notices

### Deprecation Communication Template

```markdown
## Deprecation Notice: [Feature/Endpoint]

**Deprecated:** [date]
**End of Life:** [date — at least 6 months for major features]
**Replacement:** [link to replacement feature/endpoint]

### What's Changing
[1-2 sentences: what's being deprecated and what replaces it]

### Timeline
| Date | Event |
|------|-------|
| [date] | Deprecation announced (this notice) |
| [date] | Warning headers added to deprecated API responses |
| [date] | Documentation moves deprecated feature to "Legacy" section |
| [date] | Feature disabled for new accounts |
| [date] | Feature removed for all accounts (End of Life) |

### How to Migrate
[Link to migration guide or inline instructions]

### Why
[Brief, honest explanation of why this feature is being removed.
Users deserve to understand the reasoning.]
```

### Deprecation Rules

```
✓ Give at least 6 months notice for significant features
✓ Provide a clear replacement — never deprecate without an alternative
✓ Add runtime warnings (headers, logs, console messages) before removal
✓ Communicate through EVERY channel: changelog, email, blog, in-app, docs
✓ Version the removal (deprecate in v2, remove in v3)
✗ Don't deprecate silently — users who depend on it will be angry
✗ Don't remove on the exact deprecation date — add a grace period
✗ Don't deprecate just to clean up — only when there's a better replacement
```

## Step 5: Announcement Formats

### In-App Announcement

```
BANNER:
  "New: [Feature] is here. [One sentence benefit]. Learn more →"
  → Dismissible, appears once, links to release notes

MODAL (major releases only):
  Title: "What's new in [Version]"
  Body: 3 bullet points with icons
  CTA: "See details" / "Got it"
  → Shows once on first login after update

TOOLTIP:
  "New! [Feature description]"
  → Appears on the new UI element, dismisses on interaction
```

### Email Announcement

```markdown
Subject: "[Product] [Version] — [headline feature benefit]"

Hi [name],

[One sentence: the big news]

Here's what's new:

**[Feature 1]** — [benefit in one sentence]
**[Feature 2]** — [benefit in one sentence]
**[Improvement]** — [benefit in one sentence]

[CTA button: "See what's new"]

[If breaking changes exist:]
⚠️ **Action required:** This release includes changes that may require
updates to your integration. [See the migration guide →]

Best,
The [Product] Team
```

## Output

Save release notes to:
- Changelog: `CHANGELOG.md` (root of repo)
- Release notes: `docs/releases/[version].md`
- Migration guides: `docs/migrate/[from]-to-[to].md`

## Guidelines

- **Changelog is for developers, release notes are for users** — write both but differently
- Every breaking change needs a migration guide — not just a mention in the changelog
- Deprecation is a promise — stick to the timeline you commit to
- Release notes should make users excited, not anxious — lead with value, not burden
- Link everything — changelog links to PRs, release notes link to docs, migration guides link to support
- Use `/technical-writing` for clarity in migration guides
- Use `/copywriting` for user-facing announcements
- Use `documentation-templates` for the Keep a Changelog structure
