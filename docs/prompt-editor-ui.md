# Prompt Editor UI

**Feature Added:** March 12, 2026  
**Version:** 1.0  
**Commit:** `cb83551`

## Overview

The Prompt Editor UI enables users to create, edit, and delete prompts directly from the web interface without manually editing markdown files. This feature provides full CRUD (Create, Read, Update, Delete) functionality with a modern, user-friendly interface, now enhanced with immediate feedback via toast notifications and loading states.

---

## Features

### ✅ Create New Prompts
- Click the floating action button (FAB) in the bottom-right corner
- Fill out the form with prompt details
- Auto-generates safe filenames and folder structure
- Validates required fields before saving

### ✅ Edit Existing Prompts
- Click the edit button on any prompt card
- Modify title, tags, or content
- Live markdown preview available
- Preserves existing frontmatter

### ✅ Delete Prompts
- Click the delete button on any prompt card
- Confirmation dialog prevents accidental deletions
- Removes markdown file from disk
- Auto-refreshes the prompt list

### ✅ Live Markdown Preview
- Toggle between edit and preview modes
- See exactly how your markdown will render
- Supports all markdown features (tables, code blocks, lists, etc.)

### ✅ Tag Management
- Add tags by typing and pressing Enter
- Remove tags with a single click
- Prevents duplicate tags
- Tags are saved to frontmatter

### ✅ Immediate Feedback via Toast Notifications
- All CRUD operations (create, edit, delete) now trigger clear, contextual toast notifications.
- Provides success or error messages (e.g., "Prompt saved successfully," "Failed to delete prompt").
- Integrated with the global toast system for consistent user feedback.

---

## Backend API

### Endpoints

#### **POST `/api/prompts`** - Create Prompt
Creates a new prompt markdown file.

**Request Body:**
```json
{
  "title": "My New Prompt",
  "section": "My_Prompts",
  "category": "IT",
  "subcategory": "DevOps",
  "tags": ["docker", "deployment"],
  "content": "# My Prompt\n\nContent here..."
}
```

**Response:**
```json
{
  "id": "My_Prompts/IT/DevOps/my-new-prompt.md",
  "title": "My New Prompt",
  "section": "My_Prompts",
  "category": "IT",
  "subcategory": "DevOps",
  "tags": ["docker", "deployment"],
  "content": "# My Prompt\n\nContent here...",
  "message": "Prompt created successfully"
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Prompt with same title already exists
- `500` - Server error

---

#### **PUT `/api/prompts/:id`** - Update Prompt
Updates an existing prompt.

**Request Body:**
```json
{
  "title": "Updated Title",
  "tags": ["new-tag", "another-tag"],
  "content": "Updated content..."
}
```

**Response:**
```json
{
  "id": "My_Prompts/IT/DevOps/my-new-prompt.md",
  "message": "Prompt updated successfully"
}
```

**Error Responses:**
- `404` - Prompt not found
- `500` - Server error

---

#### **DELETE `/api/prompts/:id`** - Delete Prompt
Deletes a prompt markdown file.

**Response:**
```json
{
  "message": "Prompt deleted successfully"
}
```

**Error Responses:**
- `404` - Prompt not found
- `500` - Server error

---

## Frontend Components

### PromptEditorModal

**Location:** `src/components/PromptEditorModal.tsx`

**Props:**
```typescript
interface PromptEditorModalProps {
  isOpen: boolean;              // Controls modal visibility
  onClose: () => void;          // Called when modal closes
  onSave: (prompt: Prompt) => Promise<void>;  // Save handler
  editingPrompt?: Prompt | null;  // Prompt to edit (null for create)
  defaultSection?: string;      // Default section selection
}
```

**Features:**
- Responsive design (works on mobile and desktop)
- Smooth animations (Framer Motion)
- Form validation with error messages
- Live markdown preview toggle
- Tag management interface
- Auto-focus on first field

---

## Usage Guide

### Creating a New Prompt

1. **Click the FAB Button**
   - Look for the **➕ button** in the bottom-right corner
   - It has a floating animation and glows on hover

2. **Fill Out the Form**
   - **Title** (required): Enter a descriptive title
   - **Section** (required): Choose from:
     - My Prompts
     - Collections
     - System Prompts
     - Agent Guides
   - **Category** (required): e.g., IT, Business, Writing
   - **Subcategory** (optional): Further categorization
   - **Tags**: Type and press Enter to add
   - **Content** (required): Write your prompt in Markdown

3. **Preview Your Content**
   - Click the **👁️ Preview** button to toggle preview mode
   - Review how your markdown will render
   - Toggle back to **✏️ Edit** to continue editing

4. **Save**
   - Click the **Save** button
   - The prompt is created as a markdown file
   - Auto-refreshes the prompt list
   - Modal closes automatically

**Example File Created:**
```
prompts/My_Prompts/IT/DevOps/docker-deployment-guide.md
```

**Frontmatter:**
```yaml
---
title: "Docker Deployment Guide"
tags: ["docker", "devops", "deployment"]
category: "IT"
subcategory: "DevOps"
---
```

---

### Editing an Existing Prompt

1. **Locate the Prompt**
   - Browse or search for the prompt you want to edit
   - Hover over the prompt card

2. **Click Edit Button**
   - Click the **✏️ Edit** button in the top-right corner of the card
   - The editor modal opens with the prompt pre-filled

3. **Make Changes**
   - Modify the title, tags, or content
   - Note: Section, Category, and Subcategory are **locked** when editing
   - This prevents accidentally moving files to different folders

4. **Save Changes**
   - Click **Update** to save
   - The markdown file is updated in place
   - Changes appear immediately in the UI

---

### Deleting a Prompt

1. **Locate the Prompt**
   - Browse or search for the prompt you want to delete
   - Hover over the prompt card

2. **Click Delete Button**
   - Click the **🗑️ Delete** button (top-right corner)
   - A confirmation dialog appears

3. **Confirm Deletion**
   - Click **OK** to confirm
   - The markdown file is permanently deleted
   - Prompt is removed from the UI
   - If the prompt was currently selected, view returns to "all prompts"

⚠️ **Warning:** Deletion is permanent and cannot be undone!

---

## File Structure

### Auto-Generated Filenames

Titles are converted to safe filenames:
- Lowercase
- Spaces and special characters replaced with hyphens
- Leading/trailing hyphens removed

**Examples:**
| Title | Filename |
|-------|----------|
| "My Cool Prompt" | `my-cool-prompt.md` |
| "Docker: Best Practices" | `docker-best-practices.md` |
| "React + TypeScript Guide" | `react-typescript-guide.md` |

### Directory Structure

Prompts are saved in a hierarchical folder structure:

```
prompts/
├── My_Prompts/
│   ├── IT/
│   │   ├── DevOps/
│   │   │   └── docker-deployment.md
│   │   └── Development/
│   │       └── python-tips.md
│   └── Business/
│       └── marketing-strategy.md
├── Collections/
│   └── AI/
│       └── chatgpt-prompts.md
├── System_Prompts/
│   └── AI_Research/
│       └── benchmark_analyst.md
└── Agent_Guides/
    └── Claude_Code/
        └── claude-code_agent-guide.md
```

Folders are created automatically if they don't exist.

---

## Validation Rules

### Required Fields
- ✅ **Title**: Cannot be empty
- ✅ **Section**: Must select one
- ✅ **Category**: Cannot be empty
- ✅ **Content**: Cannot be empty

### Optional Fields
- Subcategory
- Tags

### Constraints
- **Title must be unique** within the same category
- **Filename safety**: Special characters are sanitized
- **Frontmatter format**: Auto-generated in valid YAML

---

## Error Handling

All user-facing errors are now displayed via toast notifications for a non-intrusive experience.

### User-Facing Errors (via Toast Notifications)

**"Title is required"**
- Displayed when title field is empty
- Action: Enter a title

**"Category is required"**
- Displayed when category field is empty
- Action: Enter a category name

**"Content is required"**
- Displayed when content textarea is empty
- Action: Add some markdown content

**"A prompt with this title already exists"**
- Displayed when trying to create a duplicate
- Action: Choose a different title

**"Failed to save prompt"**
- Generic error when save fails
- Action: Check console for details, try again

**"Prompt not found"**
- Displayed when trying to edit/delete a non-existent prompt
- Action: Refresh the page

### Developer Errors (Console)

All API errors are logged to the browser console:
```javascript
console.error('Failed to fetch prompts:', err);
console.error('Error creating prompt:', error);
console.error('Error updating prompt:', error);
console.error('Error deleting prompt:', error);
```

---

## Technical Implementation

### State Management

**New State Variables:**
```typescript
const [isEditorOpen, setIsEditorOpen] = useState(false);
const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
```

**Functions:**
```typescript
const handleNewPrompt = () => {
  setEditingPrompt(null);
  setIsEditorOpen(true);
};

const handleEditPrompt = (prompt: Prompt) => {
  setEditingPrompt(prompt);
  setIsEditorOpen(true);
};

const handleSavePrompt = async (prompt: Prompt) => {
  const method = prompt.id ? 'PUT' : 'POST';
  const url = prompt.id 
    ? `/api/prompts/${encodeURIComponent(prompt.id)}` 
    : '/api/prompts';
  // ... fetch logic
  // Integrates `showToast` for success/error messages
  // Throws error on failure for modal to catch
};

const handleDeletePrompt = async (promptId: string) => {
  if (!confirm('Are you sure...')) return;
  // Integrates `showToast` for success/error messages
  // ... fetch logic
  refreshPrompts();
};
```

### Auto-Refresh

After any CRUD operation, the prompt list is automatically refreshed. This process now integrates loading states and error toasts:
```typescript
const refreshPrompts = useCallback(() => {
  setIsLoading(true); // Set loading state
  fetch('/api/prompts')
    .then(res => res.json())
    .then(data => {
      setPrompts(data);
      setIsLoading(false); // Clear loading state
    })
    .catch(err => {
      console.error('Failed to fetch prompts:', err);
      showToast('error', 'Failed to load prompts'); // Show error toast
      setIsLoading(false); // Clear loading state
    });
}, [showToast]);
```

Called after:
- Creating a prompt
- Updating a prompt
- Deleting a prompt

---

## UI Components

### Floating Action Button (FAB)

**Location:** Bottom-right corner  
**Appearance:**
- Purple gradient circle (`var(--accent)`)
- White plus icon
- Shadow glow effect on hover
- Icon rotates 90° on hover
- Fixed position (stays visible when scrolling)

**Code:**
```tsx
<button
  onClick={handleNewPrompt}
  className="fixed bottom-8 right-8 w-16 h-16 bg-[var(--accent)] hover:bg-[var(--accent-secondary)] text-white rounded-full shadow-lg hover:shadow-[0_0_40px_var(--accent-glow)] transition-all duration-300 flex items-center justify-center z-40 group"
>
  <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
</button>
```

### Prompt Card Buttons

Each prompt card now has three buttons in the top-right corner:

1. **✏️ Edit** - Blue/purple accent on hover
2. **🗑️ Delete** - Red on hover
3. **📋 Copy** - Blue/purple accent on hover

Buttons appear on hover for a clean look.

---

## Animations

### Modal Entrance
- Fade in backdrop (0 → 100% opacity)
- Scale and slide up modal (0.95 → 1.0 scale, 20px → 0 Y offset)
- Duration: 300ms
- Easing: Smooth bezier curve

### Modal Exit
- Reverse of entrance animation
- Duration: 300ms

### FAB Hover
- Shadow glow expands
- Background color shifts to secondary accent
- Plus icon rotates 90°
- Duration: 300ms

---

## Keyboard Shortcuts

### Tag Input
- **Enter**: Add tag
- Focus remains in input field

### Modal
- **Escape**: Close modal (not implemented yet, could be added)

---

## Browser Compatibility

Tested and working on:
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+
- ✅ Edge 120+

Requires:
- Modern JavaScript (ES2020+)
- Fetch API
- CSS Grid & Flexbox
- CSS Custom Properties (variables)

---

## Performance

### Optimizations
- Debounced search (300ms)
- Memoized components (`React.memo`)
- Callback memoization (`useCallback`)
- Efficient re-renders (only affected components update)

### Bundle Size Impact
- **PromptEditorModal.tsx**: ~12KB (source)
- **Dependencies**: No new dependencies added
- **Runtime overhead**: Minimal (modal only renders when open)

---

## Future Enhancements

### Planned Features (Not Yet Implemented)

1. **Keyboard Shortcuts**
   - `Cmd/Ctrl + S`: Save
   - `Cmd/Ctrl + E`: Toggle preview
   - `Escape`: Close modal

2. **Undo/Redo**
   - Track edit history
   - Undo last change
   - Redo undone change

3. **Auto-Save Drafts**
   - Save to localStorage periodically
   - Recover unsaved changes on reload

4. **Rich Text Editor Option**
   - WYSIWYG editor as alternative to markdown
   - Toggle between markdown and rich text

5. **Duplicate Prompt**
   - Quick clone of existing prompt
   - Modify and save as new

6. **Bulk Operations**
   - Select multiple prompts
   - Bulk delete, move, or tag

7. **Import/Export**
   - Import markdown files
   - Export prompts as JSON or Markdown bundle

8. **Version History**
   - Track changes over time
   - Compare versions
   - Restore previous versions

9. **Drag-and-Drop**
   - Reorder prompts
   - Move between categories

10. **Templates**
    - Pre-defined prompt templates
    - Quick-start for common formats

---

## Troubleshooting

### "Prompt created but doesn't appear in the list"
**Solution:** Refresh the page manually (Ctrl+R)

### "Cannot create prompt in this category"
**Solution:** Check that the category exists and has proper permissions

### "Delete button doesn't work"
**Solution:** 
1. Check browser console for errors
2. Ensure you have write permissions
3. Try refreshing the page

### "Preview mode shows weird formatting"
**Solution:** 
- Check markdown syntax
- Ensure no conflicting CSS
- Try toggling preview off and on

### "Modal won't open"
**Solution:**
1. Check browser console for JavaScript errors
2. Refresh the page
3. Clear browser cache

---

## Developer Notes

### Adding New Fields

To add a new field to prompts:

1. **Update Interface** (`src/App.tsx`):
```typescript
interface Prompt {
  // ... existing fields
  newField: string;  // Add here
}
```

2. **Update Modal** (`src/components/PromptEditorModal.tsx`):
```tsx
const [newField, setNewField] = useState('');

// Add input field in form
<input
  value={newField}
  onChange={(e) => setNewField(e.target.value)}
/>
```

3. **Update API** (`server.ts`):
```typescript
const frontmatter = {
  // ... existing fields
  newField: req.body.newField
};
```

---

## Related Files

### Modified Files
- `server.ts` - Backend API endpoints
- `src/App.tsx` - Main app component with CRUD handlers
- `src/components/PromptEditorModal.tsx` - New modal component

### Dependencies Used
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown
- `motion` - Animations (Framer Motion)
- `lucide-react` - Icons
- `express` - Backend server
- `gray-matter` - Frontmatter parsing

---

## Changelog

### v1.0 - March 12, 2026
- ✅ Initial release
- ✅ Create, edit, delete prompts
- ✅ Live markdown preview
- ✅ Tag management
- ✅ Form validation
- ✅ Auto-generated filenames
- ✅ Floating action button
- ✅ Confirmation dialogs
- ✅ Auto-refresh after operations
- ✅ Integrated with global toast notification system for feedback

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [Usage Guide](#usage-guide)
3. Check browser console for errors
4. Open an issue on GitHub

---

**Documentation Version:** 1.0  
**Last Updated:** March 12, 2026  
**Author:** OpenClaw AI Assistant
