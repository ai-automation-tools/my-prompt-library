# Featured/Suggested Prompts Section

## Overview

The Featured/Suggested prompts section displays curated prompts at the top of each dropdown menu item landing page. This section helps highlight important, popular, or recommended prompts to users when they first land on a category page.

## Features

- ✨ **Prominent Display**: Featured prompts appear in a special section above the main prompt grid
- 🎯 **Smart Visibility**: Only shows on default landing pages (hidden when category/subcategory is selected)
- 🔍 **Filter-Aware**: Automatically hidden when users are searching or filtering by tags
- ⭐ **Special Styling**: Featured cards have accent borders, badges, and animated gradients
- 🔄 **Automatic Fallback**: If no featured prompts exist, shows 4 most recent prompts

## When the Featured Section Appears

The featured section is shown when:
- ✅ User is on the default landing page of any dropdown menu item:
  - Prompt Library
  - Agent Instructions  
  - Agent Guides
  - System Prompts
  - Skills
- ✅ No category or subcategory is selected
- ✅ No search query is active
- ✅ No tag filters are applied

The featured section is hidden when:
- ❌ User selects a category or subcategory
- ❌ User is searching for prompts
- ❌ User has active tag filters
- ❌ User is viewing a specific prompt detail page

## How to Mark Prompts as Featured

### Method 1: Add "featured" Tag (Recommended)

Simply add `"featured"` to the `tags` array in the prompt's frontmatter:

```markdown
---
title: "Your Awesome Prompt"
tags: ["business", "marketing", "featured"]
category: "Business"
subcategory: "Marketing"
---
```

### Method 2: Favorite Prompts (User-Specific)

Featured prompts also include prompts that users have favorited by clicking the star icon. This allows for personalized featured sections.

## Customization

### Changing the Number of Featured Prompts

In `src/App.tsx`, locate the `featuredPrompts` useMemo:

```typescript
const featuredPrompts = useMemo(() => {
  const featured = sectionPrompts
    .filter(p => p.tags.includes('featured') || favorites.includes(p.id))
    .slice(0, 4); // Change this number to show more or fewer prompts
  // ...
}, [sectionPrompts, favorites]);
```

### Changing Selection Logic

You can customize how featured prompts are selected. Current logic:

1. First, select prompts with "featured" tag OR favorited by user
2. If none found, select 4 most recently modified prompts

To manually curate by IDs instead:

```typescript
const featuredPrompts = useMemo(() => {
  const featuredIds = [
    'Prompt_Library/Business/Marketing/market-research',
    'Prompt_Library/Writing/Technical/technical-blog-post',
    // ... add more IDs
  ];
  
  const featured = sectionPrompts.filter(p => featuredIds.includes(p.id));
  
  if (featured.length === 0) {
    return sectionPrompts
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 4);
  }
  
  return featured;
}, [sectionPrompts]);
```

### Styling Customization

The featured cards have special styling defined in the featured section render. Key style features:

- **Border**: `border-2 border-[var(--accent)]/30 hover:border-[var(--accent)]`
- **Badge**: Gold "Featured" badge with star icon in top-right corner
- **Gradient**: Animated gradient overlay on hover
- **Glow**: Box shadow glow effect on hover

Modify these in `src/App.tsx` around line 1370 in the featured section rendering code.

## Example Featured Prompts

The following prompts are currently featured:

1. **Market Research Plan** - Business/Marketing category
2. **Brand Positioning Brief** - Business/Marketing category  
3. **Technical Blog Post Architect** - Writing/Technical category
4. **Prompt Generator** - Collections/Other category

## Testing

To verify the featured section is working:

1. Start the dev server: `npm run dev`
2. Navigate to http://localhost:3010
3. Select "Prompt Library" from the dropdown (or any other category)
4. Look for the "Featured Prompts" section above the main grid
5. Click on a category - the featured section should disappear
6. Return to the main view - the featured section should reappear

## Technical Details

### Component Location
- File: `src/App.tsx`
- Featured prompts logic: ~line 320 (`featuredPrompts` useMemo)
- Featured section render: ~line 1370 (inside main grid view)

### Dependencies
- Uses `motion` (framer-motion) for animations
- Uses existing `Sparkles` and `Star` icons from lucide-react
- Integrates with existing filtering, search, and favorites systems

### Performance
- Featured prompts are computed via `useMemo` for efficiency
- Only recalculates when `sectionPrompts` or `favorites` change
- No additional API calls required - uses existing prompt data

## Future Enhancements

Potential improvements:

- [ ] Admin UI to manage featured prompts without editing files
- [ ] Featured section rotation (show different prompts on each visit)
- [ ] Category-specific featured prompts
- [ ] Analytics on featured prompt click-through rates
- [ ] Featured prompt scheduling (time-based rotation)
- [ ] A/B testing different featured selections
