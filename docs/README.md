# Documentation Index

Complete documentation for My Prompt Library.

---

## Getting Started

**New to the project? Start here:**

1. [**Local Setup**](LOCAL_SETUP.md) - Set up your development environment
2. [**Deployment Guide**](DEPLOYMENT.md) - Deploy to Vercel + Neon
3. [**Quick Reference**](QUICK_REFERENCE.md) - Common commands and tasks

---

## Core Documentation

### Architecture & Design
- [**Architecture**](ARCHITECTURE.md) - System design, tech stack, data flow
- [**API Reference**](API.md) - REST API endpoints and authentication

### Features
- [**Library Mode Implementation**](LIBRARY-MODE-IMPLEMENTATION.md) - Public vs My Library
- [**Featured Prompts**](FEATURED-PROMPTS.md) - Featured section implementation
- [**Featured Section Summary**](FEATURED-SECTION-SUMMARY.md) - Design decisions

### Configuration
- [**GitHub Mode**](GITHUB_MODE.md) - Use GitHub as remote storage for public library
- [**Setup Guide**](SETUP.md) - Initial configuration steps

### Development
- [**PostgreSQL Migration**](POSTGRES-MIGRATION-SUMMARY.md) - SQLite → Postgres migration notes
- [**Debug UI**](DEBUG_UI.md) - Debugging and troubleshooting
- [**Performance Analysis**](PERFORMANCE-ANALYSIS.md) - Performance optimization guide (March 2026)

### Changelogs
- [**March 25, 2026**](CHANGELOG-2026-03-25.md) - Performance optimizations & MCP server prompts
- [**March 16, 2026**](archive/CHANGELOG-2026-03-14.md) - Initial restructure (archived)
- [**March 14, 2026**](archive/CHANGELOG-2026-03-14-RESTRUCTURE.md) - Postgres migration (archived)

---

## Historical Documentation

Older documentation and implementation logs are in [`archive/`](archive/):

- `DATABASE.md` - Old SQLite documentation (superseded by Postgres)
- `deployment-vercel.md` - Original Vercel deployment guide
- `CHANGELOG-*.md` - Implementation logs from March 14-16, 2026
- `navigation-organization.md` - UI/UX design notes
- `prompt-editor-ui.md` - Editor implementation notes
- `quick-wins-ux.md` - UX improvement notes

---

## Quick Links

**Common Tasks:**
- Create account → See [API.md](API.md#post-apiauthsignup)
- Deploy to production → See [DEPLOYMENT.md](DEPLOYMENT.md)
- Add featured prompts → See [FEATURED-PROMPTS.md](FEATURED-PROMPTS.md)
- Enable GitHub mode → See [GITHUB_MODE.md](GITHUB_MODE.md)

**Troubleshooting:**
- Authentication issues → [API.md](API.md#authentication)
- Database connection → [DEPLOYMENT.md](DEPLOYMENT.md#database-configuration)
- UI debugging → [DEBUG_UI.md](DEBUG_UI.md)

---

## Contributing to Docs

When updating documentation:

1. **Current docs** → Update in place (e.g., `API.md`, `ARCHITECTURE.md`)
2. **Implementation logs** → Add to `archive/` with date prefix
3. **Obsolete guides** → Move to `archive/` (don't delete)
4. **New features** → Create new doc + link from this index

Keep docs concise, accurate, and up-to-date with code changes.

---

---

## Recent Updates

### March 25, 2026 - Performance & Content Update
- 🚀 **Performance:** 50x faster cold starts with prebuilt index
- 📚 **Content:** Added 7 MCP server prompt libraries (135 prompts)
- 🎨 **UX:** Pagination, emojis, better navigation
- 📖 **Docs:** Updated API.md, FEATURED-PROMPTS.md, new CHANGELOG-2026-03-25.md

[Read full changelog →](CHANGELOG-2026-03-25.md)

---

**Last Updated:** March 25, 2026
