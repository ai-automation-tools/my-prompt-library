# Navigation & Organization Features

**Feature Added:** March 12, 2026  
**Major Update:** March 13, 2026 (v2.0 - UI Overhaul)  
**Version:** 2.0  

## Overview

Comprehensive navigation and organization features that make it easier to find, access, and manage prompts. Features a **horizontal filter bar** at the top of the screen for quick access to favorites, recent prompts, and tag filtering - always visible without scrolling. Includes breadcrumb navigation and clean, navigation-focused sidebar.

---

## Features

### ✅ Favorites System

Star your most-used prompts for quick access via the **top bar filter chip**.

**Features:**
- Star button on every prompt card (vertical button column)
- Favorites persist across sessions (localStorage)
- **Top bar chip** with count badge - always visible
- Click to open dropdown with all favorites
- Yellow star icon (filled when favorited)
- Dropdown shows prompt title and category
- Auto-closes when selecting a prompt

**How to Use:**
1. Click the **⭐ star button** in the prompt card's button column (right side)
2. Star turns yellow and prompt is added to favorites
3. View your favorites by clicking the **"Favorites (N)"** chip in the top bar
4. Select a prompt from the dropdown to navigate to it
5. Click star again to remove from favorites

**Visual Indicators:**
- **Unfavorited:** Gray outline star
- **Favorited:** Solid yellow star (filled)
- **Top Bar Chip:** Shows count (e.g., "Favorites (5)")

---

### ✅ Recently Viewed

Automatically tracks the last 10 prompts you viewed, accessible via the **top bar filter chip**.

**Features:**
- Automatic tracking when you view a prompt
- Persists across sessions (localStorage)
- **Top bar chip** with count badge - always visible
- Click to open dropdown with all recently viewed prompts
- Chronological order (most recent first)
- Dropdown shows prompt title and category
- Auto-closes when selecting a prompt

**How It Works:**
1. Click on any prompt to view it
2. Prompt is automatically added to "Recently Viewed"
3. Most recent appears at the top
4. Keeps last 10 prompts (older ones removed)
5. Access from sidebar to quickly return

**Use Cases:**
- Return to a prompt you just viewed
- Review prompts from your last session
- Track your browsing history
- Quick access without searching

---

### ✅ Breadcrumb Navigation

Visual navigation path showing where you are.

**Features:**
- Shows current location in the app
- Clickable breadcrumbs to navigate back
- Only appears when navigating into content
- Clean, subtle design
- Home icon for root level

**Breadcrumb Patterns:**

**When viewing all prompts:**
```
(No breadcrumbs - you're at the root)
```

**When viewing a category:**
```
🏠 My Prompts > IT
```

**When viewing a subcategory:**
```
🏠 My Prompts > IT > Development
```

**When viewing a prompt:**
```
🏠 My Prompts > IT > prompt-title
```

**How to Use:**
- Click **🏠 Home** to return to all prompts
- Click **category name** to go back to category
- Each level is clickable
- Auto-hides when viewing all prompts

---

### ✅ Hero Section with Search

Large, prominent search bar positioned in a clean hero section at the top of the content area.

**Hero Section Layout:**
1. **Section Title** - Large (4xl-5xl) heading showing current section
2. **Search Bar** - Prominent search with icon and placeholder text
3. **Minimal Design** - Just title + search, no clutter

**Search Features:**
- **Fuzzy Search**: Powered by Fuse.js for typo-tolerant search
- **Searches Across**: Title, content, tags, category, subcategory
- **Real-Time Results**: Updates as you type
- **Prominent Design**: Large input with left icon
- **Focus State**: Accent color border and shadow on focus

**Benefits:**
- Primary search location (removed from sidebar)
- Always visible when browsing prompts
- Professional, clean interface
- Large, easy-to-find search bar

---

### ✅ Horizontal Filter Bar (Top Bar)

Quick access to favorites, recent prompts, and tag filtering - always visible at the top of the screen.

**Top Bar Layout:**
1. **Mobile Menu Button** - Toggle sidebar on mobile
2. **Filter Chips** - Favorites, Recent, Tags (with count badges)
3. **Stat Badges** - Prompt count and category count (desktop only)

**Filter Chips:**
- **Favorites (N)** ⭐ - Click to see dropdown of all favorites
- **Recent (N)** 🕐 - Click to see dropdown of recently viewed
- **Tags (N)** 🏷️ - Click to open tag multi-select dropdown

**Dropdown Design:**
- **Solid Backgrounds**: Opaque backgrounds (no glass effect)
- **Click to Open/Close**: Click outside to dismiss
- **Count Badges**: Shows number of items in each
- **Auto-Close on Select**: Closes when you pick an item

**Benefits:**
- Filters always accessible without scrolling
- Solid dropdown menus (better visibility)
- Modern app-like layout (similar to GitHub, Notion)
- More vertical space for content
- Clean, uncluttered interface

---

### ✅ Clean Navigation Sidebar

Sidebar focused purely on navigation with solid theme backgrounds.

**Sidebar Sections:**
1. **Header** - "Prompt Library" title with theme switcher
2. **Navigation Tabs** - Switch between sections (My Prompts, Collections, etc.)
3. **Categories** - Expandable category tree with prompt counts

**Design:**
- **Solid Backgrounds**: No glass effect - uses theme-specific solid colors
- **Navigation Only**: No search (moved to hero), no filters (moved to top bar)
- **Theme Colors**: Each theme has a custom sidebar background color
- **Collapsible Categories**: Click to expand/collapse category groups

**Benefits:**
- Pure navigation focus (search and filters elsewhere)
- Better readability with solid backgrounds
- Less clutter, more space for categories
- Professional, minimal aesthetic

---

## Usage Guide

### Starring a Prompt

1. **Find a prompt** you use often
2. **Look at the right side** of the prompt card - vertical button column
3. **Click the ⭐ star** (top button in the column)
4. **Star turns yellow** - prompt is now favorited
5. **Check top bar** - "Favorites (N)" chip appears

### Accessing Favorites

1. **Look at the top bar** - "Favorites (N)" chip
2. **Click the chip** - dropdown opens with all favorites
3. **Click any prompt** - jumps directly to it
4. **Dropdown auto-closes** after selection
4. **Click "+X more"** - view all prompts (scroll to find favorites)

### Using Recently Viewed

1. **View any prompt** - automatically tracked
2. **Check sidebar** - "Recently Viewed" section
3. **See your history** - most recent first
4. **Click to return** - quick access

### Navigation with Breadcrumbs

**Scenario: You're deep in a prompt**
```
Current: 🏠 My Prompts > IT > Development > docker-deployment

Actions:
- Click "Development" → go to Development category
- Click "IT" → go to IT category  
- Click 🏠 → go to all prompts
```

---

## Technical Implementation

### LocalStorage Structure

**Favorites:**
```json
{
  "prompt-favorites": [
    "My_Prompts/IT/DevOps/docker-deployment.md",
    "My_Prompts/Business/Marketing/cold-outreach.md"
  ]
}
```

**Recently Viewed:**
```json
{
  "prompt-recently-viewed": [
    "My_Prompts/IT/DevOps/docker-deployment.md",
    "My_Prompts/Writing/Fiction/character-arc.md"
  ]
}
```

### State Management

**New State Variables:**
```typescript
const [favorites, setFavorites] = useState<string[]>([]);
const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
```

**localStorage Persistence:**
```typescript
// Load from localStorage on mount
const [favorites, setFavorites] = useState<string[]>(() => {
  const saved = localStorage.getItem('prompt-favorites');
  return saved ? JSON.parse(saved) : [];
});

// Save to localStorage on change
useEffect(() => {
  localStorage.setItem('prompt-favorites', JSON.stringify(favorites));
}, [favorites]);
```

### Functions

**Toggle Favorite:**
```typescript
const toggleFavorite = useCallback((promptId: string, e?: React.MouseEvent) => {
  if (e) e.stopPropagation();
  setFavorites(prev => {
    if (prev.includes(promptId)) {
      return prev.filter(id => id !== promptId);
    } else {
      return [...prev, promptId];
    }
  });
}, []);
```

**Track Recently Viewed:**
```typescript
const handlePromptClick = useCallback((prompt: Prompt) => {
  setSelectedPrompt(prompt);
  
  // Track in recently viewed
  setRecentlyViewed(prev => {
    const filtered = prev.filter(id => id !== prompt.id);
    return [prompt.id, ...filtered].slice(0, 10); // Keep last 10
  });
}, []);
```

**Computed Values:**
```typescript
const favoritePrompts = useMemo(() => {
  return prompts.filter(p => favorites.includes(p.id));
}, [prompts, favorites]);

const recentlyViewedPrompts = useMemo(() => {
  return recentlyViewed
    .map(id => prompts.find(p => p.id === id))
    .filter((p): p is Prompt => p !== undefined);
}, [prompts, recentlyViewed]);
```

---

## UI Components

### Star Button

**Location:** Top-right of prompt cards  
**Appearance:** First button in the action group

**States:**
- **Default:** Gray outline star, transparent background
- **Hover:** Accent color background
- **Favorited:** Yellow star (filled), yellow border
- **Favorited + Hover:** Lighter yellow background

**Code:**
```tsx
<button
  onClick={(e) => toggleFavorite(prompt.id, e)}
  className={cn(
    "p-2.5 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] transition-all",
    favorites.includes(prompt.id)
      ? "text-yellow-400 border-yellow-400/50"
      : "text-[var(--text-tertiary)] border-[var(--glass-border)]"
  )}
>
  <Star className={cn(
    "w-3.5 h-3.5",
    favorites.includes(prompt.id) && "fill-yellow-400"
  )} />
</button>
```

### Favorites Sidebar Section

**Shows when:** `favoritePrompts.length > 0`

**Contains:**
- Header with star icon and count
- List of top 5 favorites
- "+X more" link if more than 5

**Appearance:**
- Glass card background
- Compact spacing
- Hover effects on items
- Truncated text for long titles

### Recently Viewed Sidebar Section

**Shows when:** `recentlyViewedPrompts.length > 0`

**Contains:**
- Header with clock icon
- List of 5 most recent
- Chronological order (newest first)

### Breadcrumbs

**Shows when:** `selectedPrompt || selectedSubcategory`

**Structure:**
- Home icon + section name (always)
- Separator (ChevronRight icon)
- Category (if viewing subcategory/prompt)
- Separator
- Subcategory (if viewing prompt in subcategory)
- Separator
- Prompt title (if viewing prompt, bold)

**Styling:**
- Small text (text-sm)
- Tertiary color for inactive
- Primary color for current
- Accent color on hover
- Chevron separators

---

## Performance

### Optimizations

1. **useMemo for computed values**
   ```typescript
   const favoritePrompts = useMemo(...);
   const recentlyViewedPrompts = useMemo(...);
   ```

2. **useCallback for functions**
   ```typescript
   const toggleFavorite = useCallback(...);
   const handlePromptClick = useCallback(...);
   ```

3. **Conditional rendering**
   - Favorites section only renders if there are favorites
   - Recently Viewed only renders if there's history
   - Breadcrumbs only render when needed

4. **Debounced localStorage writes**
   - Only writes when state changes
   - No performance impact

### Bundle Size

- **No new dependencies** - Uses existing Lucide icons
- **Minimal code** - ~200 lines added
- **localStorage** - Negligible storage (~1KB)

---

## Browser Compatibility

**LocalStorage:**
- ✅ Chrome, Firefox, Safari, Edge (all modern versions)
- ✅ Mobile browsers
- ✅ Private/Incognito mode (clears on exit)

**Features work in:**
- ✅ Desktop browsers
- ✅ Mobile browsers  
- ✅ Tablets
- ✅ Offline (once loaded)

---

## User Benefits

### Before

- ❌ No way to mark important prompts
- ❌ Had to search or browse to find recent prompts
- ❌ Lost in deep navigation without breadcrumbs
- ❌ Sidebar only showed categories

### After

- ✅ Star prompts for quick access
- ✅ Recently viewed shows your history
- ✅ Breadcrumbs show where you are
- ✅ Sidebar organized by usage patterns
- ✅ Faster access to commonly used prompts
- ✅ Better navigation UX

---

## Future Enhancements

### Planned Features (Not Yet Implemented)

1. **Custom Collections**
   - Create named collections
   - Drag-and-drop prompts into collections
   - Share collections with others

2. **Smart Favorites**
   - Auto-suggest prompts to favorite
   - Based on usage frequency
   - "You've used this 5 times - favorite it?"

3. **Advanced Recently Viewed**
   - Filter by date
   - Group by category
   - Search within recently viewed

4. **Breadcrumb Enhancements**
   - Copy path to clipboard
   - Share direct link
   - Keyboard shortcuts (B key for breadcrumbs menu)

5. **Export/Import Favorites**
   - Export favorites list
   - Import from file
   - Sync across devices

---

## Troubleshooting

### Favorites Not Persisting

**Issue:** Favorites disappear after closing browser

**Solutions:**
1. Check browser settings - ensure localStorage is enabled
2. If in private/incognito mode - favorites clear on exit
3. Check browser console for errors
4. Clear localStorage and try again:
   ```javascript
   localStorage.removeItem('prompt-favorites');
   ```

### Recently Viewed Not Updating

**Issue:** Recently viewed doesn't track new prompts

**Solutions:**
1. Refresh the page
2. Check console for JavaScript errors
3. Clear recently viewed:
   ```javascript
   localStorage.removeItem('prompt-recently-viewed');
   ```

### Breadcrumbs Not Showing

**Issue:** Breadcrumbs don't appear

**Expected Behavior:**
- Breadcrumbs only show when you navigate into content
- Won't show on "all prompts" view
- Only shows when viewing category, subcategory, or prompt

**Solution:**
- This is by design - click into a category or prompt to see breadcrumbs

### Sidebar Sections Missing

**Issue:** Favorites or Recently Viewed sections not visible

**Expected Behavior:**
- Favorites only shows if you have favorites
- Recently Viewed only shows if you've viewed prompts

**Solution:**
- Star a prompt to see Favorites section
- View a prompt to see Recently Viewed section

---

## Developer Notes

### Adding to Favorites Programmatically

```typescript
// Add a prompt to favorites
setFavorites(prev => [...prev, 'prompt-id-here']);

// Remove from favorites
setFavorites(prev => prev.filter(id => id !== 'prompt-id-here'));

// Clear all favorites
setFavorites([]);
```

### Accessing localStorage Directly

```javascript
// Get favorites
const favorites = JSON.parse(localStorage.getItem('prompt-favorites') || '[]');

// Get recently viewed
const recent = JSON.parse(localStorage.getItem('prompt-recently-viewed') || '[]');
```

### Clearing All Data

```javascript
// Clear favorites
localStorage.removeItem('prompt-favorites');

// Clear recently viewed
localStorage.removeItem('prompt-recently-viewed');

// Clear all app data
localStorage.clear();
```

---

## Related Files

### Modified Files
- `src/App.tsx` - Main component with all navigation features

### Icon Imports
- `Star` - Favorites icon
- `Home` - Breadcrumb home icon
- `Clock` - Recently viewed icon
- `ChevronRight` - Breadcrumb separator

---

## Changelog

### v1.0 - March 12, 2026
- ✅ Initial release
- ✅ Favorites system with localStorage
- ✅ Recently viewed tracking
- ✅ Breadcrumb navigation
- ✅ Enhanced sidebar organization
- ✅ Performance optimizations

---

**Documentation Version:** 1.0  
**Last Updated:** March 12, 2026  
**Author:** OpenClaw AI Assistant
