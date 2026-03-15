# UI Not Showing Prompts - Debug Guide

## Quick Debug Steps

### 1. Open Browser Console

**Chrome/Edge:**
- Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Click the "Console" tab

**Look for:**
- `🔍 DEBUG: Fetched prompts: X` (should show a number > 0)
- `🔍 DEBUG: First prompt: {...}` (should show prompt object)
- `🔍 DEBUG: Sections: [...]` (should show section names)
- Any red error messages

### 2. Check Network Tab

1. Open DevTools → **Network** tab
2. Refresh the page (Ctrl+R / Cmd+R)
3. Find the `/api/prompts` request
4. Click on it and check:
   - **Status:** Should be `200 OK`
   - **Response:** Should show JSON array of prompts
   - **Preview:** Should show array with objects

### 3. Verify API Manually

Open a new tab and go to:
```
http://localhost:3010/api/prompts
```

You should see JSON data like:
```json
[
  {
    "id": "Skills/News/ai-news-digest/SKILL.md",
    "title": "Weekly AI News Digest",
    "section": "Skills",
    "category": "News",
    ...
  },
  ...
]
```

### 4. Check React State

In the browser console, type:
```javascript
// Check if prompts are loaded
window.localStorage.getItem('prompt-favorites')
window.localStorage.getItem('prompt-recently-viewed')
```

### 5. Force Reload

1. **Hard refresh:** Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. **Clear cache and reload:**
   - Chrome: F12 → Network tab → Check "Disable cache"
   - Or: DevTools → Application → Clear storage → Clear site data
3. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

## Common Issues & Fixes

### Issue 1: Empty Array in Console

**Symptom:** Console shows `Fetched prompts: 0` or `[]`

**Fix:**
```bash
# Make sure prompts folder exists and has content
ls -la prompts/

# Should show folders: My_Prompts, Collections, System_Prompts, Agent_Guides, Skills

# Check if markdown files exist
find prompts/ -name "*.md" | head -20
```

### Issue 2: 404 on /api/prompts

**Symptom:** Network tab shows 404 error

**Fix:**
```bash
# Verify server is running on correct port
lsof -i :3010

# Should show node process on port 3010
# If not, restart dev server
npm run dev
```

### Issue 3: CORS Error

**Symptom:** Console shows CORS error

**Fix:** This shouldn't happen with same-origin, but if it does:
```bash
# Make sure you're accessing via localhost:3010, not file:// or different port
```

### Issue 4: Old Cached Data

**Symptom:** UI shows old prompts or no prompts

**Fix:**
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Clear storage** (left sidebar)
4. Click **Clear site data** button
5. Close and reopen the browser tab

### Issue 5: TypeScript/Build Errors

**Symptom:** Server crashes or console shows errors

**Fix:**
```bash
# Check for TypeScript errors
npm run lint

# Clean rebuild
npm run clean
npm run build
npm run dev
```

## Debug Script

Run this in the browser console to see what's happening:

```javascript
// Fetch prompts manually
fetch('/api/prompts')
  .then(res => {
    console.log('Status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('Total prompts:', data.length);
    console.log('First 3 prompts:', data.slice(0, 3));
    console.log('Sections:', [...new Set(data.map(p => p.section))]);
    console.log('Skills prompts:', data.filter(p => p.section === 'Skills'));
  })
  .catch(err => {
    console.error('Fetch failed:', err);
  });
```

## Expected Console Output

When working correctly, you should see:

```
🔍 DEBUG: Fetched prompts: 15
🔍 DEBUG: First prompt: {
  id: "Skills/Finance/financial-analysis/SKILL.md",
  title: "Financial Analysis",
  section: "Skills",
  category: "Finance",
  subcategory: "financial-analysis",
  tags: [],
  content: "...",
  lastModified: "2026-03-14T..."
}
🔍 DEBUG: Sections: ["Skills", "My_Prompts", "Collections", "System_Prompts", "Agent_Guides"]
```

## Visual Debugging

### Check the UI State

Look at the screen:

1. **Hero section** - Should show "My Prompts" heading
2. **Dropdown menu** - Should have 5 options: My Prompts, Collections, System Prompts, Agent Guides, Skills
3. **Sidebar** - Should show categories on the left
4. **Main area** - Should show prompt cards or grid

### If You See:

- ✅ **Dropdown menu works** → React is loaded
- ✅ **Themes work** → State management working  
- ❌ **No prompt cards** → Data not being rendered
- ❌ **"Loading..."** forever → Fetch is stuck
- ❌ **Empty screen** → JavaScript error (check console)

## Quick Fix Commands

```bash
# 1. Verify repo state
cd /home/mike/.openclaw/workspace/projects/my-prompt-library/repo
git status
git pull origin mike_desktop

# 2. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Restart dev server
npm run dev

# 4. In another terminal, verify API
curl http://localhost:3010/api/prompts | jq '. | length'
# Should output a number > 0
```

## Still Not Working?

### Gather Debug Info

Run this and share the output:

```bash
cd /home/mike/.openclaw/workspace/projects/my-prompt-library/repo

echo "=== Environment ==="
node --version
npm --version

echo ""
echo "=== Prompts Count ==="
find prompts/ -name "*.md" | wc -l

echo ""
echo "=== Server Running? ==="
lsof -i :3010

echo ""
echo "=== API Response ==="
curl -s http://localhost:3010/api/prompts | jq '. | length'

echo ""
echo "=== Git Status ==="
git log --oneline -3
git status
```

### Browser Console Screenshot

1. Open DevTools (F12)
2. Go to Console tab
3. Refresh page
4. Take screenshot of console output
5. Check for errors

## Port Conflict Check

Sometimes another process uses port 3010:

```bash
# Check what's on port 3010
lsof -i :3010

# Kill old process if needed
lsof -ti :3010 | xargs kill -9

# Restart
npm run dev
```

## Package.json Script

Verify your `package.json` has:

```json
{
  "scripts": {
    "dev": "tsx server.ts"
  }
}
```

If you see `vite` instead of `tsx server.ts`, that's wrong - it would bypass the API server.

---

## Need More Help?

If none of this works:

1. Share browser console output
2. Share `curl http://localhost:3010/api/prompts | jq '.[0]'` output
3. Share screenshot of the UI
4. Share any error messages

**Last Updated:** March 14, 2026
