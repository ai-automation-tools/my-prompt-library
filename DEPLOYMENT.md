# Deployment Guide

## Vercel Deployment

### Prerequisites

1. **Neon Database**
   - Sign up at https://neon.tech
   - Create a new project named "my-prompt-library"
   - Copy the connection string (Settings → Connection Details)

2. **Vercel Account**
   - Sign up at https://vercel.com
   - Install Vercel CLI: `npm i -g vercel`

### Environment Variables

Add these to your Vercel project (Settings → Environment Variables):

```bash
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-....neon.tech/neondb?sslmode=require
NODE_ENV=production
```

**Optional GitHub Mode** (for collaborative public library editing):
```bash
USE_GITHUB_MODE=true
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=your-username
GITHUB_REPO=my-prompt-library
GITHUB_BRANCH=main
```

### Deploy Steps

1. **Connect to Vercel**
   ```bash
   cd ~/.openclaw/workspace/projects/my-prompt-library/repo
   vercel login
   vercel link
   ```

2. **Add Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   # Paste your Neon connection string when prompted
   
   vercel env add NODE_ENV
   # Type: production
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Post-Deployment

1. **Test the deployment:**
   - Visit your Vercel URL
   - Click "Sign Up" → Create an account
   - Browse Public Library → Add prompts to your library
   - Switch to "My Library" → Verify your prompts are saved

2. **Custom Domain** (optional):
   - Vercel Dashboard → Settings → Domains
   - Add your domain (e.g., prompts.example.com)

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3010

## Database Schema

The database is automatically initialized on first run. Tables:

- `users` - User accounts (email, password_hash, name, avatar_url)
- `user_prompts` - User-owned prompts
- `user_sessions` - Authentication sessions (30-day expiry)

See `db/postgres.ts` for full schema.

## Architecture

- **Public Library:** File-based (library/ directory)
- **User Prompts:** PostgreSQL (Neon database)
- **Auth:** Cookie-based sessions, bcrypt password hashing
- **Frontend:** React + Vite
- **Backend:** Express + TypeScript

## Troubleshooting

**Database connection errors:**
- Verify `DATABASE_URL` environment variable is set
- Check Neon dashboard for connection details
- Ensure SSL is enabled in connection string

**Build failures:**
- Run `npm run build` locally to test
- Check `vercel build` logs for TypeScript errors

**Authentication issues:**
- Clear cookies and try again
- Check browser console for CORS errors
- Verify `NODE_ENV=production` on Vercel

## Migration from SQLite

If you have existing data in SQLite (local dev):

1. Export SQLite data:
   ```bash
   node -e "const db = require('better-sqlite3')('db/prompts.db'); console.log(JSON.stringify(db.prepare('SELECT * FROM users').all(), null, 2));" > users.json
   ```

2. Import to Postgres (manual SQL INSERT or use a migration script)

---

**Status:** Postgres migration complete. Ready for Vercel deployment.
