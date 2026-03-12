# Prompt Editor Guide

**Version**: 1.0  
**Last Updated**: March 11, 2026

This guide provides comprehensive instructions for creating, editing, and organizing prompts in the AI Prompt Library. Use this as a reference for maintaining consistency and ensuring prompts display correctly in the application.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Creating New Prompts](#creating-new-prompts)
3. [YAML Frontmatter](#yaml-frontmatter)
4. [File Naming Conventions](#file-naming-conventions)
5. [Category Organization](#category-organization)
6. [Editing Existing Prompts](#editing-existing-prompts)
7. [Automation Scripts](#automation-scripts)
8. [Quality Checklist](#quality-checklist)
9. [Testing Your Prompts](#testing-your-prompts)
10. [Common Issues](#common-issues)

---

## Project Structure

The prompt library is organized into two main sections:

```
prompts/
├── My_Prompts/           # Default collection (214 prompts)
│   ├── AI_Tools/
│   ├── Business/
│   ├── Finance/
│   ├── Images/
│   ├── IT/
│   ├── MCP_Servers/
│   ├── Social_Media/
│   ├── Video/
│   └── Writing/
└── Collections/          # Additional collections (126 prompts)
    ├── AI/
    ├── Business/
    ├── Engineering/
    ├── Finance/
    ├── Image_&_Video/
    └── Writing/
```

**Key Concepts:**
- **Section**: Top level (`My_Prompts` or `Collections`)
- **Category**: First folder level (e.g., `AI_Tools`, `Business`, `Finance`)
- **Subcategory**: Second folder level (e.g., `Claude_Cowork`, `Marketing`, `Analysis`)
- **Prompt File**: Individual `.md` file containing the prompt

---

## Creating New Prompts

### Step 1: Choose Location

**For standard prompts**, use `My_Prompts/`:
```
prompts/My_Prompts/[Category]/[Subcategory]/your-prompt-name.md
```

**For curated collections**, use `Collections/`:
```
prompts/Collections/[Category]/[Subcategory]/your-prompt-name.md
```

### Step 2: Create the File

```bash
# Example: Creating a new Finance prompt
cd prompts/My_Prompts/Finance/Analysis
touch stock-analysis-prompt.md
```

### Step 3: Add Content

```markdown
---
title: "Stock Analysis Deep Dive"
tags: ["finance", "stocks", "analysis", "investing"]
category: "Finance"
subcategory: "Analysis"
---

# Stock Analysis Deep Dive

## Purpose
Perform comprehensive analysis of publicly traded companies.

## Instructions
Analyze the following stock...

## Output Format
Provide analysis in the following sections:
1. Financial Health
2. Market Position
3. Risk Factors
4. Investment Recommendation

## Example
[Include example here]
```

### Step 4: Test in the App

```bash
cd /path/to/repo
npm run dev
# Open http://localhost:3010
# Navigate to Finance > Analysis
# Verify your prompt appears and renders correctly
```

---

## YAML Frontmatter

Every prompt **must** have YAML frontmatter at the top of the file.

### Required Format

```yaml
---
title: "Descriptive Title"
tags: ["tag1", "tag2", "tag3"]
category: "Category"
subcategory: "Subcategory"
---
```

### Field Descriptions

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | **Yes** | Human-readable prompt name | `"Technical Blog Post Writer"` |
| `tags` | **Yes** | Array of searchable keywords (3-5 recommended) | `["writing", "technical", "blog"]` |
| `category` | **Yes** | Top-level category (must match folder) | `"Writing"` |
| `subcategory` | **Yes** | Subcategory (must match folder) | `"Technical"` |

### Important Notes

1. **Path is source of truth**: The app uses the file path to determine section/category/subcategory, but frontmatter should match for consistency.
2. **Case-sensitive**: Category names are case-sensitive and must match folder names exactly.
3. **Tags format**: Use lowercase, hyphenated words in the tags array.
4. **Title capitalization**: Use Title Case for the title field.

### Auto-Generation

If you create a prompt without frontmatter, you can auto-generate it:

```bash
node scripts/add-frontmatter.mjs
```

This script will:
- Extract title from first `#` heading (or use filename)
- Infer category/subcategory from folder path
- Generate relevant tags from filename and path
- Add frontmatter to the file

---

## File Naming Conventions

### Rules

1. **Lowercase only**: Use lowercase letters
2. **Hyphens for spaces**: Separate words with hyphens (`-`)
3. **No special characters**: Avoid `@`, `#`, `$`, `%`, etc.
4. **Descriptive**: Name should indicate the prompt's purpose
5. **Extension**: Always use `.md` extension

### Good Examples ✅

```
stock-analysis-prompt.md
technical-blog-post.md
social-media-content-planner.md
api-integration-template.md
```

### Bad Examples ❌

```
Stock_Analysis.md          # Don't use underscores or capitals
prompt1.md                 # Not descriptive
Social Media Post.md       # No spaces allowed
api@integration.md         # No special characters
```

### Naming Pattern

Follow this pattern:
```
[main-purpose]-[specific-use-case].md
```

Examples:
- `financial-statement-analysis.md`
- `customer-onboarding-email.md`
- `api-documentation-generator.md`

---

## Category Organization

### My_Prompts Categories

Current categories in `My_Prompts/`:

| Category | Description | Subcategory Examples |
|----------|-------------|---------------------|
| `AI_Tools` | AI-specific tools and automation | Claude_Cowork, OpenClaw_Prompts, Other |
| `Business` | Business operations and planning | Documentation, Marketing, Operations, Sales |
| `Finance` | Financial analysis and planning | Analysis, Budgets, Crypto, Forecasts, Investments |
| `Images` | Image generation and design | Custom, Graphics, Icons, Logos, Wallpaper |
| `IT` | Technical and IT infrastructure | Architecture, Build_Apps, Development, IAM, Security |
| `MCP_Servers` | MCP server integrations | Notes, Search, Tools, Web |
| `Social_Media` | Social media content | Campaigns, Content |
| `Video` | Video and podcast production | Podcasts, Production, TV_Shows |
| `Writing` | Writing and documentation | Blogs, Books, Content, Technical |

### Collections Categories

Current categories in `Collections/`:

| Category | Description | Subcategory Examples |
|----------|-------------|---------------------|
| `AI` | AI development and ML | agent_development, prompt_engineering |
| `Business` | Business and marketing | ecommerce, freelance, marketing, online_course |
| `Engineering` | Software engineering | api_design, architecture_&_design, incident_response |
| `Finance` | Financial planning | (root level prompts) |
| `Image_&_Video` | Media generation | (root level prompts) |
| `Writing` | Creative and technical writing | technical_writing |

### Adding New Categories

**To add a new category to `My_Prompts/`:**

1. Create the folder:
   ```bash
   mkdir prompts/My_Prompts/NewCategory
   mkdir prompts/My_Prompts/NewCategory/Subcategory
   ```

2. Update `src/App.tsx`:
   ```typescript
   const FIXED_CATEGORIES = [
     "AI_Tools",
     "Business",
     "Finance",
     "Images",
     "IT",
     "MCP_Servers",
     "NewCategory",  // Add here
     "Social_Media",
     "Video",
     "Writing"
   ];
   ```

3. Add a prompt to the new category
4. Restart the dev server
5. Verify it appears in the sidebar

---

## Editing Existing Prompts

### Workflow

1. **Locate the file**:
   ```bash
   find prompts -name "*keyword*.md"
   ```

2. **Open in editor**:
   ```bash
   code prompts/My_Prompts/Finance/Analysis/stock-analysis.md
   ```

3. **Make changes**:
   - Update content as needed
   - Modify frontmatter if title/tags change
   - Keep YAML formatting intact

4. **Test**:
   - Run `npm run dev`
   - Navigate to the prompt in the app
   - Verify changes appear correctly

5. **Commit**:
   ```bash
   git add prompts/My_Prompts/Finance/Analysis/stock-analysis.md
   git commit -m "Update stock analysis prompt: Add risk assessment section"
   git push origin main
   ```

### Best Practices

- **One change at a time**: Keep edits focused
- **Clear commit messages**: Describe what changed and why
- **Test before committing**: Always verify in the app
- **Preserve frontmatter**: Don't remove or corrupt the YAML header
- **Maintain formatting**: Keep markdown clean and consistent

---

## Automation Scripts

### Add Frontmatter Script

**Location**: `scripts/add-frontmatter.mjs`

**Purpose**: Automatically add YAML frontmatter to prompts that don't have it.

**Usage**:
```bash
cd /path/to/repo
node scripts/add-frontmatter.mjs
```

**What it does**:
1. Scans all `.md` files in `prompts/` directory
2. Skips files that already have frontmatter (`---` at start)
3. Extracts title from first `#` heading (or uses filename)
4. Infers category/subcategory from folder path
5. Generates relevant tags from filename and path
6. Adds YAML frontmatter block to top of file

**Example Output**:
```
🔍 Scanning for prompt files...
📝 Found 344 .md files

✅ Updated: Finance/Analysis/stock-analysis.md
⏭️  Skipping (has frontmatter): IT/Security/security-audit.md
✅ Updated: Writing/Technical/blog-post.md

✨ Complete!
   Updated: 12
   Skipped: 332
   Errors: 0
```

### Future Scripts

- `validate-frontmatter.mjs` (planned): Check all frontmatter is valid
- `generate-categories.mjs` (planned): Auto-generate category JSON
- `optimize-images.mjs` (planned): Compress images in prompts

---

## Quality Checklist

Before submitting a new or edited prompt, verify:

### Content Quality
- [ ] **Clear purpose**: Prompt has an obvious use case
- [ ] **Well-structured**: Uses headings, lists, code blocks appropriately
- [ ] **Complete**: No placeholders like `[TODO]` or `[FILL IN]`
- [ ] **Correct spelling/grammar**: No typos or errors
- [ ] **Examples included**: Shows expected input/output when relevant

### Technical Requirements
- [ ] **YAML frontmatter present**: Starts with `---`
- [ ] **All fields filled**: title, tags, category, subcategory
- [ ] **Category matches folder**: Category field matches actual folder name
- [ ] **Subcategory matches folder**: Subcategory field matches actual folder name
- [ ] **Proper filename**: Lowercase, hyphenated, descriptive
- [ ] **Valid markdown**: Renders correctly in preview

### Testing
- [ ] **Appears in sidebar**: Shows in correct category/subcategory
- [ ] **Renders correctly**: Markdown displays properly
- [ ] **Copy works**: Copy button copies full content
- [ ] **Search works**: Findable by title/tags/content
- [ ] **Tags accurate**: Tags are relevant and searchable

---

## Testing Your Prompts

### Local Testing

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Open browser**:
   ```
   http://localhost:3010
   ```

3. **Navigate to your prompt**:
   - Click category in sidebar
   - Click subcategory
   - Find your prompt in grid or list
   - Click to open detail view

4. **Verify functionality**:
   - ✅ Title displays correctly
   - ✅ Tags appear in detail view
   - ✅ Markdown renders properly
   - ✅ Copy button works
   - ✅ Content is complete

### Testing Checklist

| Test | Pass/Fail | Notes |
|------|-----------|-------|
| Appears in correct category | ⬜ | |
| Appears in correct subcategory | ⬜ | |
| Title displays in grid | ⬜ | |
| Preview text shows (first 150 chars) | ⬜ | |
| Tags display (up to 3) | ⬜ | |
| Full content renders in detail view | ⬜ | |
| Markdown formatting correct | ⬜ | |
| Copy button copies content | ⬜ | |
| No console errors | ⬜ | |

### Browser Console

Check for errors:
1. Open browser dev tools (`F12`)
2. Go to Console tab
3. Look for red errors
4. Common issues:
   - YAML parsing errors
   - Missing files
   - Invalid markdown

---

## Common Issues

### Issue: Prompt doesn't appear in sidebar

**Causes**:
- Category/subcategory not matching folder structure
- File not saved
- Dev server not restarted

**Solutions**:
1. Check folder path matches category/subcategory in frontmatter
2. Ensure file is saved (check for unsaved indicator in editor)
3. Restart dev server: `Ctrl+C` then `npm run dev`

---

### Issue: YAML frontmatter errors

**Symptoms**:
- Prompt doesn't load
- Console shows parsing errors
- Frontmatter displays as plain text

**Causes**:
- Missing opening or closing `---`
- Invalid YAML syntax (indentation, quotes)
- Special characters not escaped

**Solutions**:
```yaml
# ❌ Bad
---
title: My Prompt (no quotes)
tags: tag1, tag2 (not an array)
category: Finance
---

# ✅ Good
---
title: "My Prompt"
tags: ["tag1", "tag2"]
category: "Finance"
subcategory: "Analysis"
---
```

---

### Issue: Duplicate category in Collections

**Symptoms**:
- Collections sidebar shows nested "Collections" category
- Categories appear twice

**Cause**:
- Frontmatter `category` field set to "Collections"

**Solution**:
- Use the actual category name (AI, Business, Engineering, etc.)
- The path structure determines section (Collections vs My_Prompts)
- Example for `prompts/Collections/AI/prompt.md`:
  ```yaml
  ---
  title: "Prompt Title"
  tags: ["ai", "ml"]
  category: "AI"          # Not "Collections"
  subcategory: "agent_development"
  ---
  ```

---

### Issue: Markdown not rendering

**Symptoms**:
- Content shows as plain text
- Code blocks don't format
- Lists don't render

**Causes**:
- Frontmatter bleeding into content
- Invalid markdown syntax

**Solutions**:
1. Ensure blank line after closing `---`
2. Check markdown syntax:
   ```markdown
   ---
   title: "Title"
   ---
   
   # Content starts here  ← Blank line above required
   ```

---

### Issue: Tags not appearing

**Causes**:
- Tags not an array
- Missing quotes
- Invalid YAML

**Solutions**:
```yaml
# ❌ Wrong
tags: writing, blog, technical

# ✅ Correct
tags: ["writing", "blog", "technical"]
```

---

## For AI Agents & Skills

### Automation Workflow

When building a skill or agent to create prompts:

1. **Determine category/subcategory**:
   - Ask user or infer from context
   - Use existing categories when possible

2. **Generate filename**:
   - Extract main topic
   - Convert to lowercase
   - Replace spaces with hyphens
   - Add `.md` extension

3. **Create frontmatter**:
   - Use template format
   - Generate 3-5 relevant tags
   - Match category/subcategory to folder path

4. **Write content**:
   - Start with clear purpose/description
   - Include instructions or steps
   - Add examples when relevant
   - Use proper markdown formatting

5. **Save to correct location**:
   - Construct full path: `prompts/[Section]/[Category]/[Subcategory]/[filename].md`
   - Ensure parent directories exist
   - Write file with frontmatter + content

6. **Validate**:
   - Run `node scripts/add-frontmatter.mjs` to verify
   - Check for YAML errors
   - Verify file appears in expected location

### Template for Automation

```javascript
const createPrompt = (options) => {
  const { title, category, subcategory, tags, content, section = "My_Prompts" } = options;
  
  // Generate filename
  const filename = title.toLowerCase().replace(/\s+/g, '-') + '.md';
  
  // Build frontmatter
  const frontmatter = `---
title: "${title}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
category: "${category}"
subcategory: "${subcategory}"
---`;
  
  // Combine
  const fullContent = `${frontmatter}\n\n${content}`;
  
  // Determine path
  const filepath = `prompts/${section}/${category}/${subcategory}/${filename}`;
  
  // Write file (pseudo-code)
  writeFile(filepath, fullContent);
  
  return filepath;
};
```

---

## Summary

**Key Takeaways**:

1. **Structure matters**: Follow `prompts/[Section]/[Category]/[Subcategory]/filename.md`
2. **Frontmatter required**: Every prompt needs valid YAML frontmatter
3. **Naming conventions**: Lowercase, hyphenated, descriptive filenames
4. **Path = truth**: File path determines how prompts appear in the UI
5. **Test before commit**: Always verify in the app at http://localhost:3010
6. **Use automation**: Run `add-frontmatter.mjs` when creating bulk prompts

**Quick Reference**:

```markdown
---
title: "Prompt Title"
tags: ["tag1", "tag2", "tag3"]
category: "Category"
subcategory: "Subcategory"
---

# Prompt Title

Your prompt content here...
```

---

**Questions or Issues?**  
See the main [README.md](./README.md) for project overview and setup instructions.

**Last Updated**: March 11, 2026  
**Version**: 1.0
