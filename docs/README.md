# Documentation

Documentation for **my-prompt-library**, live at
[prompts.mikesailab.com](https://prompts.mikesailab.com).

---

## 📚 Quick Links

### Getting Started
- **[Setup Guide](setup/SETUP.md)** — local development and production setup
- **[Deployment Guide](setup/DEPLOYMENT.md)** — Vercel + Neon PostgreSQL
- **[Architecture](ARCHITECTURE.md)** — system design, repo layout, technology stack

### Creating Content
- **[Contributing Guide](CONTRIBUTING.md)** — how to add content of any type
- **[Templates](templates/)** — starter templates for all five content types
- **[Skill Packs](skill-packs/)** — create and manage skill pack collections

### Features
- **[API Reference](features/API.md)** — REST endpoints
- **[Library Modes](features/LIBRARY-MODE-IMPLEMENTATION.md)** — Public vs My Library
- **[Featured Prompts](features/FEATURED-PROMPTS.md)** — highlighting top prompts
- **[GitHub Mode](features/GITHUB_MODE.md)** — using GitHub as the storage backend

### Development
- **[Debug Guide](development/DEBUG_UI.md)** — troubleshooting
- **[PostgreSQL Migration](development/POSTGRES-MIGRATION-SUMMARY.md)** — SQLite → Postgres notes

### Planning & Status
- **[Roadmap](ROADMAP.md)** — what's next
- **[Changelog](CHANGELOG.md)** — shipped work, newest first
- **[Repository Audit (2026-08-26)](audits/REPO-AUDIT-2026-08-26.md)** — whole-repo health check
- **[Upstream Drift Baseline](audits/upstream-drift-2026-08-26.md)** — first drift report

---

## 📂 Directory Structure

```
docs/
├── README.md                     # This file
├── ROADMAP.md                    # What's next
├── CHANGELOG.md                  # Shipped work, newest first
├── ARCHITECTURE.md               # System design and repo layout
├── CONTRIBUTING.md               # How to add content
│
├── audits/                       # Point-in-time health checks
│   ├── REPO-AUDIT-2026-08-26.md
│   └── upstream-drift-2026-08-26.md
│
├── setup/
│   ├── SETUP.md                  # Local dev setup
│   └── DEPLOYMENT.md             # Production deployment
│
├── templates/                    # Content templates, one per section
│   ├── README.md
│   ├── prompt-library-template.md
│   ├── agent-guides-template.md
│   ├── agents-template.md
│   ├── system-prompts-template.md
│   ├── skills-template.md
│   └── TEMPLATE-SUMMARY.md
│
├── skill-packs/
│   ├── README.md                 # Complete guide
│   ├── QUICK-START.md
│   └── PACK-TEMPLATE.json
│
├── features/
│   ├── API.md
│   ├── LIBRARY-MODE-IMPLEMENTATION.md
│   ├── FEATURED-PROMPTS.md
│   └── GITHUB_MODE.md
│
└── development/
    ├── DEBUG_UI.md
    └── POSTGRES-MIGRATION-SUMMARY.md
```

> Superseded planning docs (`archive/`, `QUICK_REFERENCE.md`, `library-update-logs/`) were
> removed on 2026-08-26. They remain in Git history; the entries worth keeping were folded
> into [CHANGELOG.md](CHANGELOG.md).

---

## 🚀 Quick Start Paths

**...run the app locally** → [Setup Guide](setup/SETUP.md), then `cd site && npm run dev`

**...deploy to production** → [Deployment Guide](setup/DEPLOYMENT.md) → [Architecture](ARCHITECTURE.md)

**...add new content** → [Contributing Guide](CONTRIBUTING.md) → [Templates](templates/)

**...understand the codebase** → [Architecture](ARCHITECTURE.md) → [API Reference](features/API.md)

**...know what needs doing** → [Roadmap](ROADMAP.md) → [Repository Audit](audits/REPO-AUDIT-2026-08-26.md)

**...troubleshoot** → [Debug Guide](development/DEBUG_UI.md)

---

## 📝 Content Templates

| Template | Use for | Library section |
|:---|:---|:---|
| 📌 **[Prompts](templates/prompt-library-template.md)** | General AI prompts | `4_Prompts/` |
| 💻 **[Guides](templates/agent-guides-template.md)** | Platform documentation | `1_Guides/` |
| 🤖 **[Agents](templates/agents-template.md)** | Agent definitions | `2_Agents/` |
| 📝 **[System Prompts](templates/system-prompts-template.md)** | LLM instructions | `5_System_Prompts/` |
| 🔧 **[Skills](templates/skills-template.md)** | Agent Skills (`SKILL.md`) | `3_Skills/` |

See the [Templates README](templates/README.md) for the detailed usage guide.

Skills additionally have to satisfy the Agent Skills spec: `name` must be lowercase-hyphen
and match the containing directory, and `description` is required. Run
`node scripts/fix-skill-frontmatter.mjs` to check, and
`node scripts/skill-frontmatter.test.mjs` to verify the whole section.

---

## 🏗️ Stack

| Layer | Technology |
|:---|:---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind v4, Fuse.js |
| Backend | Express (local dev) and Vercel serverless handlers |
| Data | Public Library = markdown in `site/library/`; user data = Neon PostgreSQL |
| Auth | bcrypt hashes, CSPRNG cookie sessions (30-day) |
| Deploy | Vercel, Root Directory `site` |

See [ARCHITECTURE.md](ARCHITECTURE.md) for details.

---

## 🔧 Development

Prerequisites: Node.js 18+, a Neon (or local) PostgreSQL URL, Git.

```bash
cd site                     # the whole app lives here
npm install
cp .env.example .env        # then set DATABASE_URL
npm run dev                 # http://localhost:3010
npm run build               # build:index -> tsc -> vite build
npm run lint                # tsc --noEmit
npm run build:index         # regenerate api/prompt-index.json from library/
```

Repo-level tooling lives in `scripts/`, outside the deploy root:

```bash
node scripts/check-upstream-drift.mjs      # what has drifted from upstream
node scripts/resync-upstream.mjs <skill>   # pull that skill back level with upstream
node scripts/attribute-upstream.mjs        # re-stamp provenance (see its header)
node scripts/fix-skill-frontmatter.mjs     # enforce the Agent Skills spec
node scripts/upstream.test.mjs             # self-checks (CI runs both)
node scripts/skill-frontmatter.test.mjs
```

Provenance vocabulary: `upstream.match` records *attribution confidence* — `exact`,
`prefix`, `similar`, `ambiguous`, `unknown`, `fork`. It never records freshness.
`behind` is a verdict `check-upstream-drift.mjs` assigns at run time and belongs
only in its report; `upstream.test.mjs` fails if it ever lands in frontmatter.

The app runs without `DATABASE_URL` — it serves the read-only Public Library, and auth plus
My Library are disabled.

---

## 📊 Project Status

Production-ready and live. Security is clean as of 2026-08-26 (0 npm advisories, path
traversal closed, CSPRNG session tokens). The open work is content freshness, dev/prod
parity, and payload size — see [ROADMAP.md](ROADMAP.md).

A weekly GitHub Action (`.github/workflows/upstream-drift.yml`) reports which vendored
skills have fallen behind their upstream. It never edits content; it updates one rolling
issue for a human to triage.

---

## 🤝 Contributing

**Content:** pick a template from [templates/](templates/), follow
[CONTRIBUTING.md](CONTRIBUTING.md), include the required metadata fields, and put the file
in the right section directory. Then run `npm run build:index` from `site/` so the index
reflects it.

**Code:** branch off `main`, keep the existing style (strict TS, no `any`; Tailwind
utility-first), run `npm run lint` and `npm run build`, and open a PR describing the change.

---

## 📖 Additional Resources

- **Main README:** [../README.md](../README.md)
- **Agent guide:** [../CLAUDE.md](../CLAUDE.md)
- **Repository:** [github.com/michaelschecht/my-prompt-library](https://github.com/michaelschecht/my-prompt-library)
- **Live site:** [prompts.mikesailab.com](https://prompts.mikesailab.com)

---

**Last updated:** 2026-08-26
