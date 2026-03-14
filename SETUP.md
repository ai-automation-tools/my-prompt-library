# Prompt Library Setup Guide

## Quick Start (Local Development)

**Current mode: LOCAL FILESYSTEM** ✅ (recommended for development)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
vercel dev

# 3. Open browser
http://localhost:3000
```

Your prompts are stored in the local `prompts/` directory.

---

## Storage Modes

### 🏠 Local Mode (Default)

**When to use:**
- Development and testing
- Working on features
- No internet connection needed
- Instant loading (no API calls)

**Configuration:**
```bash
# .env file
USE_GITHUB_MODE=false
```

**Pros:**
- ⚡ Fast (no network calls)
- 🔒 No rate limits
- 🛠️ Easy to test changes

---

### ☁️ GitHub Mode (Production)

**When to use:**
- Deploying to Vercel
- Sharing prompts across devices
- Collaborative editing via Git

**Configuration:**
```bash
# .env file
USE_GITHUB_MODE=true
GITHUB_TOKEN=ghp_your_token_here
GITHUB_OWNER=michaelschecht
GITHUB_REPO=my-prompt-library
GITHUB_BRANCH=mike_desktop
```

**Features:**
- Batched API calls (50 files at a time)
- 5-minute cache to reduce API usage
- Automatic rate limit handling

**Pros:**
- 🌐 Access from anywhere
- 🔄 Git-based version control
- 🚀 Deploy to Vercel easily

**Cons:**
- ⏱️ Slower initial load
- 📊 GitHub API rate limits (5000/hour authenticated)
- 🔑 Requires GitHub Personal Access Token

---

## Switching Between Modes

### Switch to Local Mode

```bash
# Edit .env file
USE_GITHUB_MODE=false
```

Restart `vercel dev` - that's it!

### Switch to GitHub Mode

```bash
# 1. Create GitHub Personal Access Token:
#    https://github.com/settings/tokens
#    Scopes needed: repo (Full control of private repositories)

# 2. Edit .env file
USE_GITHUB_MODE=true
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=michaelschecht
GITHUB_REPO=my-prompt-library
GITHUB_BRANCH=mike_desktop

# 3. Restart vercel dev
```

---

## Deployment (Vercel)

### Environment Variables

Set these in your Vercel project dashboard:

```
USE_GITHUB_MODE=true
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=michaelschecht
GITHUB_REPO=my-prompt-library
GITHUB_BRANCH=mike_desktop
```

**Important:** The `prompts/` directory won't be included in Vercel deployments by default, so GitHub mode is **required** for production.

---

## Troubleshooting

### Rate Limit Exceeded (403 error)

**Symptom:**
```
API rate limit exceeded for user ID...
```

**Solution:**
1. Switch to local mode temporarily:
   ```bash
   USE_GITHUB_MODE=false
   ```
2. Wait ~1 hour for rate limit reset
3. Cache will reduce future API calls (5-minute TTL)

### Prompts Not Loading

**Local mode:**
- Check that `prompts/` directory exists
- Verify `.md` files are present

**GitHub mode:**
- Verify `GITHUB_TOKEN` is valid
- Check that `GITHUB_BRANCH` exists
- Ensure token has `repo` scope

---

## File Structure

```
my-prompt-library/
├── api/
│   └── index.ts          # API routes (handles both modes)
├── prompts/              # Local prompt storage
│   ├── My_Prompts/
│   ├── Collections/
│   ├── System_Prompts/
│   └── Agent_Guides/
├── .env                  # Local config (not committed)
├── .env.example          # Example config
└── SETUP.md             # This file
```

---

## Need Help?

- **GitHub mode issues:** Check [GitHub API docs](https://docs.github.com/en/rest)
- **Vercel deployment:** Check [Vercel docs](https://vercel.com/docs)
- **Local development:** Just use `USE_GITHUB_MODE=false` and work offline!
