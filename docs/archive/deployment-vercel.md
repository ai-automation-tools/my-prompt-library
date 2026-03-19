# Deploying to Vercel

**Last Updated:** March 12, 2026  
**Deployment Platform:** Vercel  
**Deployment Type:** Node.js + Static Frontend

---

## Overview

This guide walks you through deploying the My Prompt Library app to Vercel for free hosting with automatic deployments from GitHub.

**What You Get:**
- ✅ Live URL (e.g., `https://my-prompt-library.vercel.app`)
- ✅ Automatic deployments on git push
- ✅ HTTPS by default
- ✅ CDN-powered static assets
- ✅ Serverless API functions
- ✅ Custom domain support (optional)
- ✅ Preview deployments for branches

---

## Prerequisites

1. **GitHub Account** - Your code is on GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free)
3. **Repository Access** - Make sure your repo is pushed to GitHub

---

## Step 1: Prepare Your Repository

### Push Your Code to GitHub

Make sure all changes are committed and pushed:

```bash
cd D:\AI_Agents\Repo\Mikes_Repos\my-prompt-library
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main  # or mike_desktop, depending on your branch
```

### Files Added for Deployment

The following files have been added/configured for Vercel:

1. **`vercel.json`** - Vercel configuration
2. **`package.json`** - Updated build scripts
3. **`.gitignore`** - Excludes build artifacts

---

## Step 2: Deploy to Vercel

### Option A: One-Click Deploy (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find `my-prompt-library` in the list
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment Variables (Optional)**
   - Add any environment variables if needed
   - For now, you can skip this

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a live URL: `https://my-prompt-library-xxx.vercel.app`

---

### Option B: Vercel CLI (Advanced)

If you prefer command-line deployment:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project directory
cd D:\AI_Agents\Repo\Mikes_Repos\my-prompt-library

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? my-prompt-library
# - Directory? ./
# - Auto-detected Vite, continue? Yes
# - Override settings? No

# Production deployment
vercel --prod
```

---

## Step 3: Verify Deployment

### Test Your Deployed App

1. **Open the URL** provided by Vercel
2. **Test Features:**
   - ✅ App loads correctly
   - ✅ Themes work
   - ✅ Navigation works
   - ✅ Search works
   - ✅ Prompts display correctly
   - ✅ Create new prompt (FAB button)
   - ✅ Edit a prompt
   - ✅ Delete a prompt
   - ✅ Copy prompt content

### Check API Endpoints

Test API endpoints manually:

```bash
# Get all prompts
curl https://your-app.vercel.app/api/prompts

# Should return JSON array of prompts
```

---

## Step 4: Set Up Auto-Deployment

### Connect to GitHub (if using Option A)

Vercel automatically sets up:
- ✅ **Production deployments** - When you push to `main` branch
- ✅ **Preview deployments** - When you push to other branches or open a PR

### How It Works

```
git push origin main
    ↓
Vercel detects push
    ↓
Automatic build starts
    ↓
Deploy to production (2-3 min)
    ↓
Live URL updated
```

**Preview Deployments:**
```
git push origin feature-branch
    ↓
Preview deployment created
    ↓
Unique URL: https://my-prompt-library-git-feature-branch-xxx.vercel.app
```

---

## Step 5: Custom Domain (Optional)

### Add Your Own Domain

1. **Go to Project Settings**
   - Open your project in Vercel dashboard
   - Navigate to "Settings" → "Domains"

2. **Add Domain**
   - Click "Add"
   - Enter your domain (e.g., `prompts.yourdomain.com`)
   - Follow DNS configuration instructions

3. **Configure DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers for full DNS management

4. **Wait for Verification**
   - Usually takes 5-10 minutes
   - Vercel auto-provisions SSL certificate

### Example DNS Setup

**Using CNAME (Subdomain):**
```
Type: CNAME
Name: prompts
Value: cname.vercel-dns.com
```

**Using A Record (Root Domain):**
```
Type: A
Name: @
Value: 76.76.21.21  # Vercel's IP
```

---

## Configuration Files

### `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "server.ts"
    }
  ]
}
```

**What it does:**
- Defines how Vercel should build and route your app
- `builds`: Specifies that `server.ts` should be built as a Node.js function
- `routes`: Routes API requests to server, everything else to server (which serves static files in production)

### `package.json` Scripts

```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "tsc && vite build",
    "start": "node dist/server.js",
    "vercel-build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit"
  }
}
```

**Key scripts:**
- `vercel-build`: Runs during Vercel deployment (builds frontend)
- `build`: Full build including TypeScript compilation
- `start`: Production server start (used by Vercel)

---

## Environment Variables

### Development vs Production

**Local Development:**
- Uses `.env` file (not committed to git)
- Loaded by `dotenv` package

**Vercel Production:**
- Set in Vercel dashboard: Settings → Environment Variables
- Automatically injected at build/runtime

### Adding Environment Variables

1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add variables:
   - **Name:** `VARIABLE_NAME`
   - **Value:** `your-value`
   - **Environment:** Production / Preview / Development

**Example:**
```
Name: GEMINI_API_KEY
Value: your-api-key-here
Environment: Production, Preview
```

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Solution: Make sure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "fix: update dependencies"
git push
```

**Error: "Build timed out"**
- Increase build timeout in Vercel settings
- Or optimize build (remove heavy dependencies)

### App Loads But Prompts Don't Show

**Issue:** API endpoints return 404

**Solution:** Check Vercel function logs
1. Go to Vercel dashboard
2. Select deployment
3. Click "Functions" tab
4. Check logs for errors

**Common cause:** `prompts/` folder not included in deployment

### Static Assets Not Loading

**Issue:** CSS/JS files return 404

**Solution:** 
1. Check `dist/` folder is generated correctly
2. Verify Vite build completes successfully
3. Check browser console for exact missing file

### API Requests Fail

**Issue:** CORS errors or 500 errors

**Solution:**
1. Check Vercel function logs
2. Ensure `server.ts` handles production mode correctly
3. Verify environment variables are set

---

## Deployment Checklist

Before going live, verify:

- [ ] All code committed and pushed to GitHub
- [ ] `vercel.json` is in repository root
- [ ] Build scripts updated in `package.json`
- [ ] `.gitignore` excludes `node_modules/`, `dist/`, `.env*`
- [ ] Environment variables configured (if needed)
- [ ] Test deployment works (all features functional)
- [ ] Custom domain configured (optional)
- [ ] Auto-deployment tested (push a commit and verify it deploys)

---

## Vercel Dashboard Overview

### Key Sections

**Overview**
- Recent deployments
- Production URL
- Quick stats

**Deployments**
- All deployments (production + previews)
- Build logs
- Deployment details

**Functions**
- Serverless function logs
- Runtime metrics
- Error tracking

**Settings**
- Domains
- Environment variables
- Git integration
- Build & Development settings

---

## Monitoring & Analytics

### Vercel Analytics (Optional)

Enable Vercel Analytics for visitor insights:

1. Go to project settings
2. Click "Analytics" tab
3. Enable Web Analytics
4. Install `@vercel/analytics` package:

```bash
npm install @vercel/analytics
```

5. Add to `src/main.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

6. Deploy changes

**What you get:**
- Page views
- Unique visitors
- Top pages
- Referrers
- Device types

---

## Cost

### Free Tier Limits

Vercel Free tier includes:
- ✅ **Unlimited** deployments
- ✅ **100 GB** bandwidth/month
- ✅ **100 hours** serverless function execution
- ✅ **12** serverless functions
- ✅ **Automatic** HTTPS
- ✅ **Preview** deployments
- ✅ **1** concurrent build

**This is more than enough for personal use!**

### When You Might Need Pro

Upgrade to Pro ($20/month) if:
- You exceed 100 GB bandwidth
- You need more than 12 serverless functions
- You want team collaboration features
- You need advanced analytics

For this app: **Free tier is perfect**.

---

## Post-Deployment

### Share Your App

Your app is now live! Share the URL:
```
https://my-prompt-library.vercel.app
```

Or with custom domain:
```
https://prompts.yourdomain.com
```

### Continuous Updates

From now on, every time you push to GitHub:
```bash
# Make changes locally
git add .
git commit -m "feat: new feature"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Runs build
# 3. Deploys to production
# 4. Your live site updates (2-3 min)
```

### Monitor Performance

Check Vercel dashboard regularly:
- Build success rate
- Function errors
- Response times
- Bandwidth usage

---

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` files
- Use Vercel environment variables for secrets
- Rotate API keys periodically

### 2. API Protection
- Consider adding rate limiting
- Add authentication for write operations (optional)
- Validate all inputs

### 3. HTTPS
- Always use HTTPS (Vercel does this automatically)
- Force HTTPS redirect if using custom domain

### 4. Dependencies
- Regularly update dependencies: `npm audit fix`
- Review security advisories

---

## Rollback

### If Something Goes Wrong

Vercel makes rollback easy:

1. Go to "Deployments" in dashboard
2. Find a previous working deployment
3. Click "..." menu → "Promote to Production"
4. Previous version is instantly live

**Or via CLI:**
```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>
```

---

## Advanced: CI/CD Pipeline

### GitHub Actions (Optional)

For more control, set up GitHub Actions:

**.github/workflows/deploy.yml**
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm test  # if you have tests
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Support Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Community:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## Next Steps

After deployment:
1. ✅ Test all features on live site
2. ✅ Share URL with others
3. ✅ Set up custom domain (optional)
4. ✅ Enable analytics (optional)
5. ✅ Continue development locally
6. ✅ Push updates (auto-deploys)

---

**Deployment complete! Your app is now live and accessible worldwide.** 🚀

---

**Documentation Version:** 1.0  
**Last Updated:** March 12, 2026  
**Platform:** Vercel (Free Tier)
