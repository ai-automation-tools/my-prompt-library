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

**Documentation Date:** March 14, 2026  
**Last Updated:** 11:28 AM PST  
**Total Changes:** 8 commits (2 automation, 6 UI/UX)  
**Status:** ✅ All changes deployed successfully
