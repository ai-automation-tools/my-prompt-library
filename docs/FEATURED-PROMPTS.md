# Featured Prompts

This document tracks which prompts are marked as "featured" and displayed in the Featured Prompts section on the landing page.

**Last Updated:** 2026-03-17

---

## Current Featured Prompts

### Prompt Library (5 prompts)

1. **AX MCP Server Prompts**
   - Section: `prompt-library`
   - Category: TBD
   - Status: ✅ Featured

2. **AX Workspace Builder**
   - Section: `prompt-library`
   - Category: TBD
   - Status: ✅ Featured

3. **Crypto Rotation & Dominance Report**
   - Section: `prompt-library`
   - Category: Finance/Crypto
   - Status: ✅ Featured

4. **Awesome Nano Banana Pro Prompts**
   - Section: `prompt-library`
   - Category: Images/Generation
   - Status: ✅ Featured

5. **Investor Pitch Deck**
   - Section: `prompt-library`
   - Category: Business
   - Status: ✅ Featured

### Agent Instructions (4 prompts)

6. **Influencer Campaign Manager**
   - Section: `agent-instructions`
   - Category: Marketing/Social Media
   - Status: ✅ Featured

7. **LeBron James**
   - Section: `agent-instructions`
   - Category: Characters/Personalities
   - Status: ✅ Featured

8. **Barack Obama**
   - Section: `agent-instructions`
   - Category: Characters/Personalities
   - Status: ✅ Featured

9. **Security Analyst Agent**
   - Section: `agent-instructions`
   - Category: Security/Analysis
   - Status: ✅ Featured

### Agent Guides (3 prompts)

10. **Claude Code Agent Guide**
    - Section: `agent-guides`
    - Category: Development/CLI
    - Status: ✅ Featured

11. **Gemini CLI Agent Guide**
    - Section: `agent-guides`
    - Category: Development/CLI
    - Status: ✅ Featured

12. **OpenAI Codex Agent Guide**
    - Section: `agent-guides`
    - Category: Development/CLI
    - Status: ✅ Featured

### System Prompts (4 prompts)

13. **GPT-5**
    - Section: `system-prompts`
    - Category: AI Models
    - Status: ✅ Featured

14. **Claude Cowork**
    - Section: `system-prompts`
    - Category: AI Models/Collaboration
    - Status: ✅ Featured

15. **Claude Sonnet 4.5**
    - Section: `system-prompts`
    - Category: AI Models
    - Status: ✅ Featured

16. **Antigravity**
    - Section: `system-prompts`
    - Category: Experimental
    - Status: ✅ Featured

### Skills (2 prompts)

17. **Workspace Cookbook**
    - Section: `skills`
    - Category: Documentation/Guides
    - Status: ✅ Featured

18. **Weekly AI News Digest**
    - Section: `skills`
    - Category: Automation/News
    - Status: ✅ Featured

---

## Total Count

**18 Featured Prompts** across 5 sections:
- Prompt Library: 5
- Agent Instructions: 4
- Agent Guides: 3
- System Prompts: 4
- Skills: 2

---

## How to Feature a Prompt

### Method 1: Database Flag (Recommended)
```sql
-- Mark prompt as featured in database
UPDATE prompts 
SET featured = true 
WHERE title = 'Prompt Title';
```

### Method 2: Tag-Based (Current Implementation)
Add `"featured"` to the tags array in prompt frontmatter:

```yaml
---
title: "Your Prompt Title"
tags: ["featured", "other-tag"]
category: "Category"
---
```

### Method 3: Favorites Fallback
The app currently uses favorites as a fallback if no prompts have the "featured" tag.

---

## Featured Prompts Display Logic

**Code Location:** `src/App.tsx` (around line 430-450)

```typescript
const featuredPrompts = useMemo(() => {
  // Priority 1: Prompts with "featured" tag
  const tagged = sectionPrompts
    .filter(p => p.tags?.includes('featured'))
    .slice(0, 4);
  
  // Priority 2: Fallback to favorites if no tagged prompts
  if (tagged.length === 0) {
    return favoritePrompts.slice(0, 4);
  }
  
  return tagged;
}, [sectionPrompts, favoritePrompts]);
```

**Display Rules:**
- Shows on landing page only (not in search/filter views)
- Maximum 4 prompts displayed
- Grid layout: 4 columns on desktop, responsive on mobile
- Special styling: Star badge, accent border, hover glow

---

## Adding New Featured Prompts

1. **Choose the prompt** you want to feature
2. **Add "featured" tag** to its frontmatter:
   ```yaml
   tags: ["featured", "existing-tag"]
   ```
3. **Or update database** (if using PostgreSQL):
   ```sql
   UPDATE prompts SET featured = true WHERE id = 'prompt-id';
   ```
4. **Verify on landing page** - Should appear in Featured Prompts section
5. **Update this document** with the new entry

---

## Removing Featured Status

1. **Remove "featured" tag** from frontmatter:
   ```yaml
   tags: ["other-tag"]  # Remove "featured"
   ```
2. **Or update database**:
   ```sql
   UPDATE prompts SET featured = false WHERE id = 'prompt-id';
   ```
3. **Update this document** to reflect the change

---

## Best Practices

### Selection Criteria
- ✅ **High Quality**: Well-written, clear, useful
- ✅ **Representative**: Shows variety across sections
- ✅ **Popular**: Frequently used or copied
- ✅ **Up-to-Date**: Recently reviewed and maintained
- ✅ **Diverse**: Mix of categories and use cases

### Rotation Strategy
- Review featured prompts monthly
- Replace stale or outdated prompts
- Promote newly added high-quality prompts
- Maintain balance across sections (3-5 per section)
- Consider user favorites and copy statistics

### Display Balance
- Aim for 4-6 featured prompts per major section
- Rotate featured prompts seasonally
- Feature new prompts to drive discovery
- Keep at least 2-3 "evergreen" featured prompts

---

## Notes

- Featured prompts appear on the **landing page only** (when no search/filter is active)
- The app limits display to **4 featured prompts** per view (can be adjusted in code)
- If no prompts have the "featured" tag, the app falls back to showing **favorited prompts**
- Featured status does NOT affect search or filtering functionality

---

## Changelog

### 2026-03-17
- Initial documentation created
- Listed 18 current featured prompts across 5 sections
- Added instructions for featuring/unfeaturing prompts
