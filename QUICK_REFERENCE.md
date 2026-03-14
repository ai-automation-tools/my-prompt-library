# Quick Reference Card 🚀

## Current Setup: LOCAL MODE ✅

GitHub mode is **disabled**. Your app reads from local `prompts/` directory.

---

## ⚡ To Work on Other Things (Current)

```bash
# Already configured! Just run:
vercel dev
```

No GitHub API calls. No rate limits. Fast and simple.

---

## 🔄 To Re-enable GitHub Mode (Later)

**Option 1: Edit `.env` file**
```bash
USE_GITHUB_MODE=true
GITHUB_TOKEN=ghp_your_token_here
GITHUB_OWNER=michaelschecht
GITHUB_REPO=my-prompt-library
GITHUB_BRANCH=mike_desktop
```

**Option 2: Use environment variables**
```powershell
# Windows PowerShell
$env:USE_GITHUB_MODE="true"
$env:GITHUB_TOKEN="ghp_xxxx"
$env:GITHUB_OWNER="michaelschecht"
$env:GITHUB_REPO="my-prompt-library"
vercel dev
```

---

## 📁 Files Created

- **`.env`** - Local config (GitHub mode OFF) - Not committed to Git
- **`.env.example`** - Template for configuration
- **`SETUP.md`** - Complete setup guide
- **`QUICK_REFERENCE.md`** - This file!

---

## ✅ What's Fixed

✅ **Batching:** GitHub API calls now batched (50 at a time)  
✅ **Caching:** 5-minute cache reduces repeated API calls  
✅ **Feature Flag:** Easy toggle between local/GitHub modes  
✅ **Default to Local:** No more rate limit issues during dev  

---

## 🎯 Next Steps

1. Delete local Windows repo if you want
2. Work on other features using local mode
3. When ready for GitHub mode, flip `USE_GITHUB_MODE=true`

**Full documentation:** See `SETUP.md`
