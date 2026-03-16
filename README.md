# My Prompt Library

A modern, full-stack web application for managing and organizing AI prompt templates with user authentication, personal libraries, and a public template collection.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Status](https://img.shields.io/badge/status-production-green.svg)

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
- Dark/light theme toggle
- Fuzzy search with Fuse.js
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

### Getting Started
- [**Local Setup**](docs/LOCAL_SETUP.md) - Development environment setup
- [**Deployment Guide**](docs/DEPLOYMENT.md) - Deploy to Vercel with Neon database
- [**Architecture**](docs/ARCHITECTURE.md) - System design and tech stack

### Features
- [**Library Mode Implementation**](docs/LIBRARY-MODE-IMPLEMENTATION.md) - Public vs My Library
- [**Featured Prompts**](docs/FEATURED-PROMPTS.md) - Highlighting top templates
- [**API Reference**](docs/API.md) - REST API endpoints

### Configuration
- [**GitHub Mode**](docs/GITHUB_MODE.md) - Use GitHub as public library storage
- [**Quick Reference**](docs/QUICK_REFERENCE.md) - Common tasks and commands

### Development
- [**PostgreSQL Migration**](docs/POSTGRES-MIGRATION-SUMMARY.md) - SQLite → Postgres migration notes
- [**Debug UI**](docs/DEBUG_UI.md) - Troubleshooting and debugging

### Historical
- [**Archive**](docs/archive/) - Legacy documentation and changelogs

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

See [API.md](docs/API.md) for detailed documentation.

---

## Database Schema

**Tables:**
- `users` - User accounts
- `user_prompts` - User-owned prompts
- `user_sessions` - Authentication sessions

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
