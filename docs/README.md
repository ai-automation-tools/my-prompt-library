# Documentation

Complete documentation for the my-prompt-library project.

---

## 📚 Quick Links

### Getting Started
- **[Setup Guide](setup/SETUP.md)** - Local development and production setup
- **[Deployment Guide](setup/DEPLOYMENT.md)** - Deploy to Vercel with Neon PostgreSQL
- **[Architecture](ARCHITECTURE.md)** - System design and technology stack

### Creating Content
- **[Contributing Guide](CONTRIBUTING.md)** - How to add content (all types)
- **[Templates](templates/)** - Starter templates for all 5 content types
- **[Skill Packs](skill-packs/)** - Create and manage skill pack collections
- **[Quick Reference](QUICK_REFERENCE.md)** - Common tasks and CLI commands

### Features
- **[API Reference](features/API.md)** - REST API endpoints
- **[Library Modes](features/LIBRARY-MODE-IMPLEMENTATION.md)** - Public vs My Library
- **[Featured Prompts](features/FEATURED-PROMPTS.md)** - Highlighting top prompts
- **[GitHub Mode](features/GITHUB_MODE.md)** - Use GitHub as storage backend

### Development
- **[Debug Guide](development/DEBUG_UI.md)** - Troubleshooting and debugging
- **[PostgreSQL Migration](development/POSTGRES-MIGRATION-SUMMARY.md)** - SQLite → Postgres notes

### Planning & Status
- **[Roadmap](ROADMAP.md)** - What's next: near-term cleanup, UI de-bulk, content/feature plans
- **[Changelog](CHANGELOG.md)** - Shipped work, newest first
- **[Project Audit (2026-06-24)](audits/PROJECT-AUDIT-2026-06-24.md)** - Whole-repo health check + UI bulk analysis

---

## 📂 Directory Structure

```
docs/
├── README.md                     # This file
├── ROADMAP.md                    # What's next
├── CHANGELOG.md                  # Shipped work, newest first
├── ARCHITECTURE.md               # System design
├── QUICK_REFERENCE.md            # Quick commands
│
├── audits/                       # Point-in-time health checks
│   └── PROJECT-AUDIT-2026-06-24.md
│
├── setup/                        # Setup & deployment
│   ├── SETUP.md                  # Local dev setup
│   └── DEPLOYMENT.md             # Production deployment
│
├── templates/                    # Content templates
│   ├── README.md                 # Template guide
│   ├── prompt-library-template.md
│   ├── agent-guides-template.md
│   ├── agents-template.md
│   ├── system-prompts-template.md
│   └── skills-template.md
│
├── skill-packs/                  # Skill pack documentation
│   ├── README.md                 # Complete guide
│   ├── QUICK-START.md            # Fast creation guide
│   └── PACK-TEMPLATE.json        # Template file
│
├── features/                     # Feature documentation
│   ├── API.md                    # API endpoints
│   ├── LIBRARY-MODE-IMPLEMENTATION.md
│   ├── FEATURED-PROMPTS.md
│   └── GITHUB_MODE.md
│
├── development/                  # Developer guides
│   ├── DEBUG_UI.md
│   └── POSTGRES-MIGRATION-SUMMARY.md
│
└── archive/                      # Superseded / historical docs
```

---

## 🚀 Quick Start Paths

### I want to...

**...run the app locally**
1. [Setup Guide](setup/SETUP.md)
2. [Quick Reference](QUICK_REFERENCE.md)

**...deploy to production**
1. [Deployment Guide](setup/DEPLOYMENT.md)
2. [Architecture](ARCHITECTURE.md)

**...add new content**
1. [Contributing Guide](CONTRIBUTING.md)
2. [Templates](templates/)

**...understand the codebase**
1. [Architecture](ARCHITECTURE.md)
2. [API Reference](features/API.md)

**...contribute content**
1. [Contributing Guide](CONTRIBUTING.md)
2. [Templates README](templates/README.md)

**...troubleshoot issues**
1. [Debug Guide](development/DEBUG_UI.md)
2. [Roadmap](ROADMAP.md)

---

## 📝 Content Templates

Use these templates when adding new content:

| Template | Use For | Location |
|----------|---------|----------|
| 📌 **Prompt Library** | General AI prompts | [template](templates/prompt-library-template.md) |
| 💻 **Agent Guides** | Platform documentation | [template](templates/agent-guides-template.md) |
| 🤖 **Agents** | Agent definitions | [template](templates/agents-template.md) |
| 📝 **System Prompts** | LLM instructions | [template](templates/system-prompts-template.md) |
| 🔧 **Skills** | Tool integrations | [template](templates/skills-template.md) |

See [Templates README](templates/README.md) for detailed usage guide.

---

## 🏗️ Architecture Overview

**Frontend:**
- React + TypeScript + Vite
- Tailwind CSS
- Fuzzy search (Fuse.js)

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL (Neon)
- Session-based auth

**Deployment:**
- Vercel (serverless)
- Neon (database)

See [ARCHITECTURE.md](ARCHITECTURE.md) for details.

---

## 🔧 Development

### Prerequisites
- Node.js 18+
- PostgreSQL (local or Neon)
- Git

### Quick Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run type checking
npm run lint
```

See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for more commands.

---

## 📊 Project Status

**Current State:** Production-ready, live at `prompts.mikesailab.com`

See [ROADMAP.md](ROADMAP.md) for what's next and [CHANGELOG.md](CHANGELOG.md) for recent changes.

---

## 🤝 Contributing

### Adding Content

1. Choose appropriate template from [templates/](templates/)
2. Follow [Prompt Template Guide](archive/prompt-template-guide.md)
3. Ensure all 4 required metadata fields (title, tags, category, subcategory)
4. Submit PR with content in correct directory

### Code Contributions

1. Fork the repository
2. Create feature branch
3. Follow existing code style
4. Test locally
5. Submit PR with clear description

---

## 📖 Additional Resources

- **Main README:** [../README.md](../README.md)
- **GitHub Repository:** [github.com/michaelschecht/my-prompt-library](https://github.com/michaelschecht/my-prompt-library)
- **Live Site:** [prompts.mikesailab.com](https://prompts.mikesailab.com)

---

**Last Updated:** 2026-06-24
