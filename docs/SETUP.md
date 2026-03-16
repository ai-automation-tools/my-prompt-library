# Setup Guide

Complete setup instructions for local development and production deployment.

---

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** or **yarn**
- **PostgreSQL database** (Neon recommended for free tier)
- **Git** ([download](https://git-scm.com/))

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/michaelschecht/my-prompt-library.git
cd my-prompt-library
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Neon Database

1. Sign up at [neon.tech](https://neon.tech) (free)
2. Create a new project: "my-prompt-library"
3. Copy the connection string from Settings → Connection Details

Example connection string:
```
postgresql://neondb_owner:npg_xxxxx@ep-xxxxx.neon.tech/neondb?sslmode=require
```

### 4. Configure Environment Variables

Create `.env` file in the project root:

```bash
# Required: PostgreSQL Database
DATABASE_URL=postgresql://neondb_owner:npg_xxxxx@ep-xxxxx.neon.tech/neondb?sslmode=require

# Optional: GitHub Mode (for public library)
USE_GITHUB_MODE=false
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BRANCH=main
```

### 5. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3010**

The database schema will initialize automatically on first run.

---

## Production Deployment (Vercel)

### 1. Create Vercel Account

Sign up at [vercel.com](https://vercel.com) (free tier available)

### 2. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 3. Deploy

**Option A: GitHub Integration (Recommended)**

1. Push your code to GitHub
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables (see below)
5. Deploy

**Option B: Vercel CLI**

```bash
vercel login
vercel link
vercel env add DATABASE_URL
# Paste your Neon connection string
vercel --prod
```

### 4. Add Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required:**
```
DATABASE_URL = postgresql://neondb_owner:npg_xxxxx@ep-xxxxx.neon.tech/neondb?sslmode=require
```

**Optional (GitHub Mode):**
```
USE_GITHUB_MODE = true
GITHUB_TOKEN = ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER = your-username
GITHUB_REPO = my-prompt-library
GITHUB_BRANCH = main
```

### 5. Redeploy

After adding environment variables, trigger a redeploy:
- Vercel Dashboard → Deployments → Redeploy
- Or push a new commit to trigger auto-deployment

---

## Storage Modes

### Local Filesystem Mode (Default)

**Public Library:** Reads from `library/` directory (local files)  
**User Data:** PostgreSQL (Neon)

**Pros:**
- ✅ Fast (no external API calls for public library)
- ✅ Works offline
- ✅ No rate limits

**Cons:**
- ❌ Public library updates require git pull + redeploy

**Configuration:**
```bash
USE_GITHUB_MODE=false
```

---

### GitHub API Mode (Optional)

**Public Library:** Fetched from GitHub API  
**User Data:** PostgreSQL (Neon)

**Pros:**
- ✅ Public library updates without redeployment
- ✅ Collaborative editing via Git
- ✅ Dynamic content

**Cons:**
- ❌ Slower (API calls required)
- ❌ GitHub API rate limits (5000/hour authenticated)

**Configuration:**
```bash
USE_GITHUB_MODE=true
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx  # Personal Access Token
GITHUB_OWNER=your-username
GITHUB_REPO=my-prompt-library
GITHUB_BRANCH=main
```

**How to create GitHub Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Scopes: `repo` (full control)
4. Copy token and add to `.env`

---

## Database Schema

The database initializes automatically with these tables:

**`users`**
- id, email, password_hash, name, avatar_url
- created_at, updated_at

**`user_prompts`**
- id, user_id, title, section, category, subcategory
- tags (JSON), content
- created_at, updated_at

**`user_sessions`**
- id, user_id, token, expires_at
- created_at

Schema file: `db/postgres.ts` (see `initializeSchema()`)

---

## Testing Your Setup

### 1. Create an Account

Visit your local or deployed URL:
1. Click "Sign Up"
2. Enter email, password, name
3. Create account

### 2. Browse Public Library

- Switch to "Public Library" tab
- Browse categories
- Search for prompts

### 3. Save Prompts

- Click "+ Add to My Library" on any public prompt
- Switch to "My Library" tab
- Verify prompt was copied

### 4. Create Custom Prompts

- Click "+ New Prompt" in My Library
- Fill in details
- Save

---

## Troubleshooting

### Database Connection Errors

**Error:** `connect ECONNREFUSED` or `connection timeout`

**Solution:**
- Verify `DATABASE_URL` is correct in `.env` (local) or Vercel env vars (production)
- Check Neon dashboard for connection string
- Ensure SSL is enabled (`sslmode=require`)

### Build Failures

**Error:** `Transform failed` or TypeScript errors

**Solution:**
```bash
npm run build  # Test build locally
npm run dev    # Check console for errors
```

### Authentication Issues

**Error:** `401 Unauthorized` or `Invalid token`

**Solution:**
- Clear browser cookies
- Check browser console for CORS errors
- Verify cookies are enabled in browser

### GitHub API Rate Limit

**Error:** `403 API rate limit exceeded`

**Solution:**
- Switch to local filesystem mode (`USE_GITHUB_MODE=false`)
- Wait 1 hour for rate limit reset
- Use authenticated token (higher rate limit: 5000/hour)

---

## Next Steps

- [**API Reference**](API.md) - Learn about available endpoints
- [**Architecture**](ARCHITECTURE.md) - Understand system design
- [**Deployment Guide**](DEPLOYMENT.md) - Advanced deployment options

---

**Need help?** Open an issue on [GitHub](https://github.com/michaelschecht/my-prompt-library/issues)
