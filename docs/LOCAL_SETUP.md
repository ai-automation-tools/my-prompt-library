# Local Development Setup

Quick guide for running the my-prompt-library web app locally.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/michaelschecht/my-prompt-library.git
cd my-prompt-library
```

### 2. Checkout Development Branch

```bash
git checkout mike_desktop
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The app will start on **http://localhost:3010**

## What Gets Loaded

When you run `npm run dev`, the app:

✅ **Loads prompts from the local filesystem** (`prompts/` directory)  
✅ **Runs the API server** on port 3010  
✅ **Starts Vite dev server** with hot module reloading  
✅ **Extracts titles** from markdown headings (first `#` in content)

## Folder Structure

```
prompts/
├── My_Prompts/          # Your personal prompts
├── Collections/         # Curated prompt collections
├── System_Prompts/      # System-level prompts
├── Agent_Guides/        # CLI agent documentation
└── Skills/              # Skill-based prompts
    ├── Finance/
    ├── News/
    └── Podcasts/
```

## Adding New Prompts

### Option 1: Via UI

1. Navigate to "My Prompts" section
2. Click the "+" button
3. Fill in the prompt editor
4. Save

### Option 2: Via Filesystem

Create a new `.md` file in the appropriate folder:

```markdown
---
title: "My Custom Prompt"
tags: ["example", "custom"]
category: "General"
subcategory: "Examples"
---

# My Custom Prompt

Your prompt content here...
```

**Important:** The app prioritizes:
1. Frontmatter `title` field
2. First `#` heading in content
3. Filename (fallback)

## Troubleshooting

### Prompts Not Showing Up?

**Problem:** Empty prompts list after cloning  
**Solution:** Make sure you're in the correct directory and `prompts/` folder exists with content.

```bash
# Verify prompts exist
ls -la prompts/

# Should show: My_Prompts, Collections, System_Prompts, Agent_Guides, Skills
```

### Titles Showing as "SKILL" or Filename?

**Problem:** Skills section shows generic titles  
**Solution:** This was fixed in commit `bc8f046`. Make sure you've pulled the latest changes:

```bash
git pull origin mike_desktop
```

The issue was Windows-style line endings (`\r\n`) preventing regex from matching headings.

### Port Already in Use?

**Problem:** `Error: listen EADDRINUSE: address already in use :::3010`  
**Solution:** Another process is using port 3010. Either:

```bash
# Option 1: Kill the existing process
lsof -ti:3010 | xargs kill -9

# Option 2: Change the port in server.ts
# Edit server.ts and change: const PORT = 3010;
```

### Dev Server Not Reloading?

**Problem:** Changes not appearing in the browser  
**Solution:** 

1. **Hard refresh** the browser (Ctrl+Shift+R or Cmd+Shift+R)
2. **Clear browser cache** for localhost:3010
3. **Restart the dev server** (Ctrl+C, then `npm run dev` again)

### TypeScript Errors?

**Problem:** Build fails with TypeScript errors  
**Solution:**

```bash
# Check for errors without building
npm run lint

# Clean and rebuild
npm run clean
npm run build
```

## Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The production build goes to the `dist/` folder.

## Environment Variables

For production deployment (Vercel), you can set these environment variables:

```bash
# Optional: GitHub mode (fetches prompts from GitHub instead of filesystem)
USE_GITHUB_MODE=true
GITHUB_TOKEN=your_token_here
GITHUB_OWNER=michaelschecht
GITHUB_REPO=my-prompt-library
GITHUB_BRANCH=mike_desktop
```

**Note:** Local development always uses the filesystem, not GitHub mode.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3010) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run clean` | Remove dist folder |
| `npm run lint` | Check TypeScript types |

## File Watching

The dev server automatically watches for changes in:

- **`src/`** - React components and UI code
- **`prompts/`** - Markdown prompt files
- **`server.ts`** - API server code

Changes will trigger hot module reloading or server restart.

## Tips

### Fast Prompt Editing

Edit `.md` files directly in `prompts/` and refresh the browser. No need to restart the server.

### Testing New Skills

Add a new SKILL.md file to `prompts/Skills/YourCategory/skill-name/SKILL.md`:

```markdown
---
name: your-skill-name
description: What this skill does
---

# Your Skill Display Name

Skill content here...
```

Refresh the browser and switch to the Skills section to see it.

### Debugging API Responses

Check the API response directly:
```bash
curl http://localhost:3010/api/prompts | jq '.[0]'
```

This shows the first prompt's data structure.

## Need Help?

- Check the [main README](../README.md) for project overview
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- See [CHANGELOG-2026-03-14.md](./CHANGELOG-2026-03-14.md) for recent changes

---

**Last Updated:** March 14, 2026  
**Dev Server Port:** 3010  
**Production URL:** TBD (Vercel deployment)
