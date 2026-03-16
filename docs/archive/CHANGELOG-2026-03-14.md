# Changelog - March 14, 2026

## Summary
Major UI/UX improvements and automation enhancements for the my-prompt-library project. Focus on external resource integration, mobile responsiveness, and automated content workflows.

---

## 🤖 Automation & Cron Jobs

### 1. Daily AI News Digest Email (Updated)
**Time:** 10:13 AM PST  
**Status:** Updated existing cron job  
**Schedule:** Daily at 6:00 AM PST

**Changes:**
- Expanded recipient list from 1 to 5 email addresses
- **Recipients:**
  - mikeschecht@gmail.com
  - heath.dorn@ax-platform.com
  - jacob.taunton@ax-platform.com
  - michael.schecht@ax-platform.com
  - jonwright2087@gmail.com

**Workflow:**
- Researches AI news across 3 categories (General AI, MCP Protocol, AI Tools)
- Generates HTML email from template
- Sends via agentmail MCP tool
- Commits markdown files to GitHub
- Reports status via Telegram

**Job ID:** `24635edd-0435-4ce8-b9df-ce354100f6ab`

---

### 2. Agent CLI Guides Sync (New)
**Time:** 10:16 AM PST  
**Status:** New cron job created  
**Schedule:** Every Saturday at 12:00 PM PST

**Purpose:**
- Monitors upstream CLI repositories for documentation updates
- Syncs changes to local Agent_Guides documentation

**Monitored Repos:**
- Claude Code: https://github.com/anthropics/claude-code
- Gemini CLI: https://github.com/google-gemini/gemini-cli
- Codex CLI: https://github.com/openai/codex

**Target Documentation:**
- `prompts/Agent_Guides/claude_code/`
- `prompts/Agent_Guides/codex/`
- `prompts/Agent_Guides/gemini_cli/`

**Features:**
- Detects meaningful changes (new flags, commands, features)
- Updates local documentation with version tracking
- Commits changes with descriptive messages
- Pushes to mike_desktop branch
- Reports status via Telegram

**Job ID:** `b5a6e9bd-44e1-476b-b35b-adf6cc67ca38`

---

## 🎨 UI/UX Improvements

### 3. External Resources Section (Initial Implementation)
**Time:** 10:43 AM PST  
**Commit:** `b7d1794`

**Added:**
- Three categories of external resources
- Glass-morphism card design with hover effects
- Responsive grid layout (1 column mobile, 3 columns desktop)

**Categories:**
1. **CLI Repositories** (3 links)
   - Claude Code
   - Gemini CLI
   - Codex CLI

2. **Prompt Libraries** (5 links)
   - Prompts.chat
   - PromptHero
   - Vertex AI Gallery
   - WorkMind
   - Prompting Guide (bonus)

3. **Agent Templates** (4 links)
   - AI Template
   - 500 AI Agents
   - Awesome AI Agents (bonus)
   - HuggingFace Agents (bonus)

**Initial Location:** Hero section below search bar

---

### 4. External Resources → Toolbar Dropdowns
**Time:** 10:48 AM PST  
**Commit:** `8de127c`

**Changes:**
- Moved external resources from hero section to top toolbar
- Implemented three dropdown menus with mutual exclusion
- Added GitHub icons for repository links
- Added contextual icons (Library, BookOpen, Bot, Sparkles)
- Added ExternalLink icon on hover

**Dropdown Menus:**
- **CLI** (Terminal icon)
- **Libraries** (BookOpen icon)
- **Agents** (Bot icon)

**Icons Used:**
- GitHub repos: GitHub icon from lucide-react
- Other links: Contextual icons based on content type

**Visibility:** Hidden on mobile to save space

---

### 5. aX-Platform Standalone Button & Flickering Fix
**Time:** 11:00 AM PST  
**Commit:** `8fdd008`

**Added aX-Platform Button:**
- Standalone button left of CLI dropdown
- Gradient background (slate-800 → slate-900)
- Two-tone text: "aX-" (white) + "Platform" (blue)
- Separator line between text parts
- Hover effects: Border glow + blue accent

**Fixed Flickering Issue:**
- Wrapped dropdowns in AnimatePresence
- Added smooth fade-in/fade-out animations (150ms)
- Increased z-index from `z-50` to `z-[100]`
- Added `e.stopPropagation()` to prevent event bubbling
- Implemented click-outside handler to close dropdowns
- Added `external-resource-dropdown` class for event targeting

---

### 6. Mobile Layout Improvements
**Time:** 11:06 AM PST  
**Commit:** `de4d5b4`

**Mobile Changes:**
- Added aX-Platform button to mobile view (top right corner)
- Positioned next to menu hamburger button
- Slightly smaller text for mobile (text-xs)
- Same gradient styling as desktop

**Stat Badges Relocated:**
- Moved from top toolbar to above prompts grid
- Now appear next to section heading
- Changed first label from "Prompts" to "Total"
- Visible on all screen sizes

**Layout:**
- **Mobile:** Menu button (left) → aX-Platform button (right)
- **Desktop:** Full toolbar with aX-Platform + dropdowns
- **Responsive:** Flex-wrap for smaller screens

---

### 7. Filter Buttons Repositioned
**Time:** 11:13 AM PST  
**Commit:** `b9741da`

**Removed from Top Toolbar:**
- Favorites filter button
- Recent filter button
- Tags filter button

**Added Next to Stat Badges:**
- All three filter buttons moved to prompts section
- Appear next to stat badges above prompts grid
- Contextual placement with actual content

**Benefits:**
- Cleaner mobile toolbar (only menu + aX-Platform)
- Filters appear where they're used
- Less visual clutter
- Better information architecture

---

### 8. aX Platform Attribution
**Time:** 11:21 AM PST  
**Commit:** `f2fd260`

**Added in Two Locations:**

**Hero Section:**
- Below main heading
- Text: "Built on the **aX Platform** 🔗"
- Medium-sized text with blue hyperlink
- Includes external link icon

**Sidebar Footer:**
- Above theme selector
- Text: "Built on the **aX Platform**"
- Smaller centered text
- Blue hyperlink
- Separated by border line

**Link:** https://ax-platform.com/

**Design:**
- Blue links (`text-blue-400` hover `text-blue-300`)
- Smooth hover transitions
- Professional, non-intrusive placement

---

## 📊 Technical Details

### Build Status
All changes built successfully with no TypeScript errors.

**Build Warnings:**
- Chunk size warning (595.90 kB) - expected for single-page app
- Suggestion to use dynamic imports (future optimization opportunity)

### Git Workflow
- All changes committed to `mike_desktop` branch
- 6 commits total for UI/UX changes
- 2 cron job updates
- All changes pushed to remote successfully

### Files Modified
- `src/App.tsx` (all UI changes)
- Cron job configurations via gateway API

---

## 🔄 Workflow Integration

### Automated Content Pipeline
1. **Daily AI News:**
   - Researches content daily
   - Generates HTML emails
   - Sends to 5 recipients
   - Archives to GitHub

2. **Weekly CLI Documentation:**
   - Checks upstream repos
   - Updates local guides
   - Commits changes
   - Reports status

### User Experience Flow
1. **Mobile Users:**
   - Clean toolbar (menu + aX-Platform link)
   - Filter buttons below with prompts
   - Easy access to aX Platform

2. **Desktop Users:**
   - Full toolbar with dropdowns
   - External resources readily accessible
   - Attribution visible in multiple places

---

## 🎯 Key Improvements Summary

### Automation
✅ Multi-recipient AI news digest  
✅ Automated CLI documentation sync  
✅ Weekly schedule for maintenance tasks

### User Interface
✅ External resources integrated into toolbar  
✅ aX-Platform branding prominently displayed  
✅ Mobile-optimized layout  
✅ Decluttered toolbar  
✅ Contextual filter placement

### Code Quality
✅ No TypeScript errors  
✅ Successful builds  
✅ Smooth animations  
✅ Proper event handling  
✅ Clean git history

---

## 📝 Notes

### Cron Job Monitoring
- Both cron jobs report to Telegram (chat ID: 8491774155)
- Daily AI news runs at 6:00 AM PST
- CLI guides sync runs every Saturday at 12:00 PM PST

### Future Considerations
- Consider code-splitting for chunk size optimization
- Monitor cron job execution logs
- Review email delivery rates
- Track user engagement with external resources

---

## 🔗 Related Documentation
- **Architecture:** `docs/ARCHITECTURE.md`
- **Prompt Template Guide:** `docs/prompt-template-guide.md`
- **Navigation & Organization:** `docs/navigation-organization.md`
- **Quick Wins UX:** `docs/quick-wins-ux.md`

---

---

## 🛠️ Skills Section Addition (Evening Session)

### 9. Skills Section Implementation
**Time:** 5:57 PM PST  
**Commit:** `897955c`

**Added New Section:**
- Created "Skills" as 5th navigation tab
- Icon: 🛠️ (tools emoji)
- Folder path: `prompts/Skills/`
- Same functionality as other sections (My Prompts, Collections, etc.)

**New Skills Content Added (14 files):**

**📊 Finance (1 skill, 5 templates):**
- Financial Analysis skill
- Templates: Earnings/Corporate, Global Market, Investment Strategy, Market Sentiment, Stock Market Analysis

**📰 News (2 skills):**
- Weekly AI News Digest
- Daily News Collage Generator

**🎙️ Podcasts (4 skills):**
- Podcast Topic Picker
- Dr. Vega Respond to Podcast Topic
- Pastor Cole Respond to Topic
- End Daily Podcast Topic

**Technical Implementation:**
- Updated `activeTab` type to include `'skills'`
- Added Skills path filtering logic
- Updated all UI text locations (hero, breadcrumbs, headings)
- Added Skills option to navigation dropdown

---

### 10. Title Extraction from Markdown Headings
**Time:** 6:08 PM PST  
**Commit:** `9416561`

**Problem:** Skills showing as "SKILL" instead of proper titles

**Solution:** Extract titles from first `#` heading in markdown content

**Added `extractFirstHeading()` Function:**
- Scans markdown content for first `#` heading
- Returns heading text (e.g., "Weekly AI News Digest")
- Returns `null` if no heading found

**Title Priority (Updated):**
1. Frontmatter `title` field
2. First `#` heading in content ← **NEW**
3. Filename (fallback)

**Applied to:**
- ✅ `api/index.ts` (production/GitHub mode)
- ✅ `server.ts` (development/local mode)

**Example:**
```markdown
---
name: ai-news-digest
---

# Weekly AI News Digest    ← This is now extracted as the title
```

**Cleanup:**
- Removed unused financial analysis template files

---

### 11. CRLF Line Ending Fix
**Time:** 6:28 PM PST  
**Commit:** `bc8f046`

**Problem:** Titles still showing as "SKILL" due to Windows line endings

**Root Cause:** SKILL.md files had Windows-style line endings (`\r\n`), causing regex to fail

**Fix:** Trim lines before regex matching

**Updated Code:**
```typescript
// Before
const match = line.match(/^#\s+(.+)$/);

// After
const trimmedLine = line.trim();  // Handles \r\n
const match = trimmedLine.match(/^#\s+(.+)$/);
```

**Result:** Now correctly extracts titles from files with CRLF or LF line endings

**Updated Files:**
- `server.ts` (dev server)
- `api/index.ts` (production server)

**Verified Working:**
- ✅ "Weekly AI News Digest"
- ✅ "Podcast Topic Picker"
- ✅ "Daily News Collage Generator"
- ✅ "Respond to Podcast Topic"
- ✅ "End Daily Podcast Topic"
- ✅ "Pastor Cole: Respond to Podcast Topic"

---

### 12. Local Development Documentation
**Time:** 6:38 PM PST  
**Commits:** `999210d`, `7203320`

**Created `docs/LOCAL_SETUP.md`:**

**Contents:**
- Quick start instructions (clone, install, run)
- Folder structure explanation
- Adding new prompts (UI vs filesystem)
- Troubleshooting common issues
- Available npm scripts
- Debugging tips and API testing

**Key Sections:**
- ✅ Prerequisites (Node.js, npm, Git)
- ✅ Clone and run instructions
- ✅ What gets loaded (`prompts/` folder structure)
- ✅ Troubleshooting (titles, port conflicts, caching)
- ✅ Building for production
- ✅ Environment variables (GitHub mode)

**Created `DEBUG_UI.md`:**

**Contents:**
- Step-by-step UI debugging guide
- Browser console checks
- Network tab verification
- API endpoint testing
- React state inspection
- Common issues and fixes

**Debug Script Included:**
```javascript
fetch('/api/prompts')
  .then(res => res.json())
  .then(data => {
    console.log('Total prompts:', data.length);
    console.log('Skills prompts:', data.filter(p => p.section === 'Skills'));
  });
```

---

## 📊 Skills Section Summary

### New Capabilities

**Navigation:**
- 🛠️ Skills tab in dropdown menu
- Filter by skill category (Finance, News, Podcasts)
- Browse skills like any other section

**Content Structure:**
```
prompts/Skills/
├── Finance/
│   └── financial-analysis/
│       └── SKILL.md
├── News/
│   ├── ai-news-digest/
│   │   └── SKILL.md
│   └── daily-news-collage/
│       └── SKILL.md
└── Podcasts/
    ├── podcast-topic-picker/
    │   └── SKILL.md
    ├── dr-vega-respond-to-podcast-topic/
    │   └── SKILL.md
    ├── pastor-cole-respond-to-topic/
    │   └── SKILL.md
    └── end-daily-podcast-topic/
        └── SKILL.md
```

**Title Extraction Logic:**
1. Check frontmatter for `title` field
2. Extract first `#` heading from content
3. Fall back to filename if neither exists
4. Handle both Unix (LF) and Windows (CRLF) line endings

### Technical Details

**Files Modified:**
- `src/App.tsx` - Added Skills section UI
- `api/index.ts` - Added title extraction (production)
- `server.ts` - Added title extraction (development)

**Total Commits (Skills Session):** 5
- `897955c` - Add Skills section
- `9416561` - Extract titles from headings
- `7203320` - Fix dev server title extraction
- `bc8f046` - Handle CRLF line endings
- `999210d` - Add local setup documentation

**Files Added:** 16
- 14 SKILL.md files (Finance, News, Podcasts)
- 1 LOCAL_SETUP.md documentation
- 1 DEBUG_UI.md troubleshooting guide

### Known Issues

**UI Not Showing Prompts Locally:**
- API endpoint works (returns JSON)
- Frontend fetch appears successful
- Prompts not rendering in UI
- **Status:** Under investigation
- **Workaround:** Documented in DEBUG_UI.md

**Potential Causes:**
- Browser caching
- React state not updating
- Filtering logic excluding all prompts
- Port forwarding issues (if running remotely)

---

## 🔗 Updated Documentation Index

- **Main README:** Project overview
- **ARCHITECTURE.md:** Technical details
- **SETUP.md:** Initial setup instructions
- **LOCAL_SETUP.md:** ← **NEW** Local development guide
- **DEBUG_UI.md:** ← **NEW** UI troubleshooting
- **CHANGELOG-2026-03-14.md:** This file
- **navigation-organization.md:** UI/UX patterns
- **prompt-template-guide.md:** Prompt creation guide

---

---

### 13. Cross-Platform Path Resolution Fix
**Time:** 7:10 PM PST  
**Commit:** `599d833`

**Problem:** App only worked when run from repo root directory
- Windows users cloning to `D:\path\to\repo` couldn't see prompts
- `process.cwd()` depends on where command is executed, not where code lives
- API was looking in wrong directory based on execution context

**Solution:** Use `import.meta.url` to resolve paths relative to source files

**Changes:**
- Added `fileURLToPath` and `dirname` imports
- Convert `import.meta.url` to `__filename`, then extract `__dirname`
- All file operations now relative to source file location

**Files Updated:**
- `server.ts` - Use `__dirname` for `prompts/`, `dist/` paths
- `api/index.ts` - Use `__dirname/../prompts` (since api/ is subdirectory)

**Now Works Regardless Of:**
- Where the repo is cloned (Windows `D:`, Linux `/home`, etc.)
- What directory you run `npm run dev` from
- Cross-platform path differences (Windows backslash vs Unix forward slash)

**Fixed:** User on Windows in `D:\AI_Agents\AI_Tools\my-prompt-library` was seeing `'AX-Platform'` section instead of proper sections

---

### 14. UI Fixes - Prompt Cards and Dropdowns
**Time:** 7:28 PM PST  
**Commit:** `78133e8`

**Three UI Issues Fixed:**

#### A. Prompt Card Button Cutoff
**Problem:** Edit and Delete buttons getting cut off at bottom of cards

**Fix:**
- Added `min-h-[220px]` to ensure card has enough height
- Added `shrink-0` to button column to prevent compression
- Buttons now always visible regardless of content length

**Before:** Buttons would disappear on cards with less content  
**After:** All three buttons (favorite, edit, delete) always visible

#### B. Filter Dropdown Mutual Exclusion
**Problem:** Clicking Recent then Tags caused menus to overlap

**Fix:** Added mutual exclusion logic
```typescript
// Each button now closes the other two
onClick={() => {
  setFavoritesExpanded(!favoritesExpanded);
  setRecentlyViewedExpanded(false);  // Close others
  setTagsExpanded(false);
}}
```

**Before:** Multiple dropdown menus could be open simultaneously  
**After:** Only one dropdown open at a time

#### C. Dropdown Background Transparency
**Problem:** Filter dropdowns had transparent backgrounds, hard to read content behind them

**Fix:**
- Changed `dropdown-solid` from `--bg-secondary` (75% opacity) to `--bg-primary` (100% opacity)
- Added stronger shadow: `0 20px 60px rgba(0,0,0,0.4)`
- Removed backdrop-filter for cleaner appearance

**Before:** Semi-transparent dropdowns with content showing through  
**After:** Fully opaque backgrounds, easy to read in all themes

**Applies To:**
- Favorites dropdown
- Recent dropdown
- Tags dropdown
- All themes (dark, light, retro-wave, emerald-glass, etc.)

---

**Documentation Date:** March 14, 2026  
**Last Updated:** 7:30 PM PST  
**Total Changes:** 15 commits (2 automation, 6 UI/UX morning, 5 Skills evening, 2 fixes)  
**Status:** ✅ All issues resolved and deployed
