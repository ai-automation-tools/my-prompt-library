<a id="readme-top"></a>

<p align="center">
  <a href="https://prompts.mikesailab.com">
    <img src="images/My-Prompt-Library-Images/logos/dark/landscape-01-template-vault.svg" alt="My Prompt Library - searchable prompt templates and skill packs" width="720">
  </a>
</p>

<p align="center">
  <em>A full-stack prompt-template manager with public templates,<br>personal libraries, auth, search, markdown, and skill packs.</em>
</p>

<p align="center">
  <a href="docs/README.md"><strong>Explore the docs »</strong></a>
</p>

<p align="center">
  <a href="https://prompts.mikesailab.com">View Demo</a>
  ·
  <a href="https://github.com/michaelschecht/my-prompt-library/issues">Report Bug</a>
  ·
  <a href="https://github.com/michaelschecht/my-prompt-library/issues">Request Feature</a>
</p>

<p align="center">
  <a href="https://prompts.mikesailab.com"><img src="https://img.shields.io/badge/Live_Demo-prompts.mikesailab.com-f59e0b?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"></a>
  <img src="https://img.shields.io/badge/status-production-2ea44f?style=for-the-badge" alt="Status: production">
  <a href="docs/ROADMAP.md"><img src="https://img.shields.io/badge/plan-ROADMAP-8B5CF6?style=for-the-badge" alt="Roadmap"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL on Neon">
  <img src="https://img.shields.io/badge/Vercel-serverless-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel serverless">
</p>

---

## Features

✨ **Dual Library System**
- **Public Library** - Browse curated prompt templates
- **My Library** - Save and organize your own prompts

🔐 **User Authentication**
- Secure signup/login with bcrypt password hashing
- Session-based authentication with 30-day expiry
- Profile management

📦 **Prompt Management**
- Create, edit, delete prompts
- Copy public prompts to your library
- Tag-based organization
- Section/Category hierarchy
- Markdown support

🎨 **Modern UI**
- Responsive design (mobile, tablet, desktop)
- 16 selectable themes (default: Mikes AI Lab, matching [mikesailab.com](https://mikesailab.com))
- Fuzzy search with Fuse.js
- Title-prioritized search ranking (title starts-with/contains first)
- Clean, intuitive interface

🚀 **Production-Ready**
- PostgreSQL database (Neon)
- Vercel serverless deployment
- TypeScript throughout
- API-first architecture

---

## Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/michaelschecht/my-prompt-library.git
cd my-prompt-library

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your DATABASE_URL (Neon PostgreSQL connection string)

# Start development server
npm run dev

# Visit http://localhost:3010
```

### Deploy to Vercel

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment instructions.

---

## Documentation

📚 **[Complete Documentation](docs/)** - Full documentation index

### Quick Links

**Getting Started**
- [Setup Guide](docs/setup/SETUP.md) - Local development setup
- [Deployment Guide](docs/setup/DEPLOYMENT.md) - Deploy to Vercel
- [Architecture](docs/ARCHITECTURE.md) - System design

**Creating Content**
- [Contributing Guide](docs/CONTRIBUTING.md) - How to add content
- [Templates](docs/templates/) - Starter templates for all content types
- [Quick Reference](docs/QUICK_REFERENCE.md) - Common commands

**Features**
- [API Reference](docs/features/API.md) - REST API endpoints
- [Library Modes](docs/features/LIBRARY-MODE-IMPLEMENTATION.md) - Public vs My Library
- [Featured Prompts](docs/features/FEATURED-PROMPTS.md) - Highlighting top prompts

**Development**
- [Debug Guide](docs/development/DEBUG_UI.md) - Troubleshooting
- [Project Status](docs/planning/PROJECT-STATUS.md) - Current state and roadmap

---

## Technology Stack

**Frontend:**
- React + TypeScript
- Vite (build tool)
- Tailwind CSS
- Lucide React (icons)
- Fuse.js (search)

**Backend:**
- Express + TypeScript
- PostgreSQL (Neon)
- bcrypt (password hashing)
- cookie-based sessions

**Deployment:**
- Vercel (serverless functions)
- Neon (database)
- GitHub (version control)

---

## Project Structure

```
my-prompt-library/
├── api/
│   └── index.ts              # Vercel serverless API handler
├── src/
│   ├── App.tsx               # Main React application
│   ├── components/           # React components
│   ├── contexts/             # Auth context provider
│   └── main.tsx              # React entry point
├── library/                  # Public prompt templates (files)
│   ├── Prompt_Library/
│   ├── Agent_Instructions/
│   ├── Agent_Guides/
│   └── System_Prompts/
├── db/
│   └── postgres.ts           # Database layer (PostgreSQL)
├── routes/
│   └── auth.ts               # Auth API routes
├── middleware/
│   └── auth.ts               # Auth middleware
├── docs/                     # Documentation
├── server.ts                 # Local dev server
├── vercel.json               # Vercel configuration
└── README.md                 # This file
```

---

## Environment Variables

Create a `.env` file in the root:

```bash
# PostgreSQL Database (Neon)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Optional: GitHub Mode for Public Library
USE_GITHUB_MODE=false
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BRANCH=main
```

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile

### Prompts
- `GET /api/prompts?library=public|my` - List prompts
- `POST /api/prompts` - Create prompt (auth required)
- `PUT /api/prompts/:id` - Update prompt (auth required)
- `DELETE /api/prompts/:id` - Delete prompt (auth required)
- `POST /api/prompts/:path/copy-to-my-prompts` - Copy to My Library

### Skill Packs
- `GET /api/skill-packs?library=public|my` - List packs by mode
- `GET /api/skill-packs/:packId` - Pack details
- `POST /api/skill-packs/:packId/add-to-library` - Add pack to My Library (auth + confirm)
- `DELETE /api/skill-packs/:packId/remove-from-library` - Remove pack from My Library (auth + confirm)
- `GET /api/skill-packs/:packId/download` - Download pack ZIP

See [docs/features/API.md](docs/features/API.md) for detailed documentation.

---

## Database Schema

**Tables:**
- `users` - User accounts
- `user_prompts` - User-owned prompts
- `user_sessions` - Authentication sessions
- `user_skill_pack_installs` - User-installed skill packs

**Hybrid Storage:**
- Public Library → Files (`library/` directory, Git version control)
- User Data → PostgreSQL (Neon database)

---

## Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Apache License 2.0 - See LICENSE file for details.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/michaelschecht/my-prompt-library/issues)
- **Documentation:** [docs/](docs/)
- **Email:** mikeschecht@gmail.com

---

**Built with ❤️ by Michael Schecht**
