---
name: 🐙 generate-recipe-images
description: Find recipes without images in the Flavor Atlas GitHub repo, search for and download recipe images, upload to GitHub, and update recipe files to link images. Use when asked to add images to recipes, enrich recipes with photos, or generate recipe images for Flavor Atlas.
---

# Generate Recipe Images

This skill automates the process of finding recipes that need images, sourcing appropriate food photos, uploading them to GitHub, and updating recipe files with image links.

## Overview

1. Scan the Flavor Atlas Recipes folder for recipes without images
2. Identify 3 recipes that need images
3. Search for and download appropriate images for each recipe
4. Save images locally in the repository working tree
5. Update recipe files to link to the new images
6. Commit and push changes following `.claude/rules.md`
7. Post update message to the Flavor Atlas workspace

## Instructions

### Step 1: Find Recipes Without Images

1. **Browse the GitHub repository** to find recipes:
   - Use `mcp__github__get_file_contents` to explore the repo structure:
     - `owner: "AX-MCP"`
     - `repo: "AX-CommunityWorkspaces"`
     - `path: "flavor-atlas/Recipes"`

2. **Check subdirectories** (recipes may be organized by region):
   - Examples: `flavor-atlas/Recipes/Italian/`, `flavor-atlas/Recipes/Middle-Eastern/`, etc.
   - List all subdirectories to get the full recipe catalog

3. **Read recipe files** to identify those without images:
   - Look for recipes that have image placeholders but no actual image links
   - Look for markdown files without `![` image syntax or with placeholder text like `[Image coming soon]`
   - Identify exactly **3 recipes** that need images

4. **Document the selected recipes**:
   - Note the recipe name, region/folder, and file path
   - Note the dish name for image searching

### Step 2: Search and Download Images

For each of the 3 recipes:

1. **Determine the search query**:
   - Use the recipe title (e.g., "Italian Carbonara", "Middle Eastern Falafel")
   - Add terms like "food photography", "plated dish", or "professional food photo"

2. **Search for images** using one of these methods:

   **Option A: Claude Chrome Extension**
   - Use `mcp__claude-in-chrome__tabs_context_mcp` to get browser context
   - Use `mcp__claude-in-chrome__navigate` to go to Google Images or Unsplash
   - Search for the recipe name + "food photography"
   - Use `mcp__claude-in-chrome__computer` to take a screenshot of suitable images
   - Use `mcp__claude-in-chrome__upload_image` or download functionality

   **Option B: Playwright**
   - Use `mcp__playwright__browser_navigate` to visit image search sites (Unsplash, Pexels, or Google Images)
   - Use `mcp__playwright__browser_snapshot` to see the page
   - Use `mcp__playwright__browser_click` to select and download images
   - Use `mcp__playwright__browser_take_screenshot` to capture images if direct download isn't available

3. **Choose appropriate images**:
   - Look for high-quality, professional food photography
   - Prefer images from free stock photo sites (Unsplash, Pexels) to avoid copyright issues
   - Images should be appetizing and represent the dish accurately
   - Prefer landscape orientation (3:2 or 4:3 aspect ratio)
   - Minimum 1600px width recommended

4. **Save images locally** to the repository working tree:
   - Target directory structure: `D:\AI_Agents\Repo\CommunityRepo\FlavorAtlas\AX-CommunityWorkspaces\flavor-atlas\Images\{slug}\`
   - Filename: `hero.jpg` (or `hero.png`)
   - Full path example: `D:\AI_Agents\Repo\CommunityRepo\FlavorAtlas\AX-CommunityWorkspaces\flavor-atlas\Images\carbonara\hero.jpg`
   - Create directories as needed using the `Write` tool

### Step 3: Update Recipe Files Locally

For each of the 3 recipes:

1. **Read the current recipe file** from the repository working tree:
   - Path format: `D:\AI_Agents\Repo\CommunityRepo\FlavorAtlas\AX-CommunityWorkspaces\flavor-atlas\Recipes\{region}\{filename}`

2. **Update the recipe markdown** to include the image:
   - Find the image placeholder or add an image at the top of the description
   - Replace placeholder text with proper markdown image syntax:
     ```markdown
     ![Hero image of {Recipe Name}](../Images/{slug}/hero.jpg)
     ```
   - Ensure the path is relative from the recipe location
   - Add descriptive alt text for accessibility

3. **Save the updated recipe** back to the working tree using the `Write` tool

### Step 4: Commit and Push to GitHub

1. **Follow the complete Git workflow** documented in `.claude/rules.md`:
   - Add both the image files and updated recipe files
   - Commit with descriptive message: `"Add hero images to 3 recipes: [list names]"`
   - Push to FlavorAtlas branch

2. **CRITICAL - Binary File Handling**:
   - Images MUST be committed using git commands (never via GitHub API)
   - See `.claude/rules.md` for detailed instructions on binary file handling
   - This ensures images are stored as actual binary files, not base64-encoded text

### Step 5: Post Update to AX Workspace

1. **Compile the list of updated recipes** with their GitHub URLs:
   - Format: `https://github.com/AX-MCP/AX-CommunityWorkspaces/blob/main/flavor-atlas/Recipes/{region}/{filename}`

2. **Post message to the Flavor Atlas board**:
   - Use `mcp__ax-gcp__messages` with `action: "send"`
   - Include links to the **recipe files only** (not the images)
   - Example message format:
     ```
     Recipe images added! 📸

     Updated 3 recipes with hero images:
     1. {Recipe Name 1}: [GitHub URL]
     2. {Recipe Name 2}: [GitHub URL]
     3. {Recipe Name 3}: [GitHub URL]

     #recipes #media #enrichment
     ```

## Important Notes

- **Git workflow**: Follow `.claude/rules.md` for complete instructions on committing and pushing to GitHub
- **Binary files**: Images MUST be committed using git commands (never via GitHub API) - see `.claude/rules.md`
- **Branch strategy**: Work on FlavorAtlas branch, never push directly to main
- **Exactly 3 recipes**: Process exactly 3 recipes per run
- **Copyright compliance**: Use images from free stock photo sites (Unsplash, Pexels, Pixabay)
- **Image quality**: Minimum 1600px width, landscape orientation preferred
- **File organization**: Images go in `flavor-atlas/Images/{slug}/`, recipes in `flavor-atlas/Recipes/{region}/`
- **Relative paths**: Recipe image links should be relative (e.g., `../Images/{slug}/hero.jpg`)

## MCP Servers Used

- **ax-gcp**: For posting messages to the Flavor Atlas workspace
- **Playwright**: For browser automation to find and download images
- **Claude browser extension**: Alternative for finding and downloading images
- **GitHub**: For browsing the repository to identify recipes without images

## Image Source Recommendations

Prefer these royalty-free image sources:
- **Unsplash** (unsplash.com) - High-quality, free food photography
- **Pexels** (pexels.com) - Free stock photos including food
- **Pixabay** (pixabay.com) - Free images and videos

Avoid:
- Google Images (copyright issues)
- Pinterest (often uncredited)
- Commercial food photography sites

## Example Workflow

1. Browse `flavor-atlas/Recipes/Italian/` folder in GitHub to identify recipes without images
2. Find `italian_carbonara_v1.md` without an image
3. Find `italian_risotto_v1.md` without an image
4. Browse `flavor-atlas/Recipes/Middle-Eastern/`
5. Find `middle-eastern_falafel_v1.md` without an image
6. Search Unsplash for "carbonara food photography" and download
7. Save to repo working tree: `flavor-atlas/Images/carbonara/hero.jpg`
8. Repeat for risotto and falafel
9. Update each recipe file locally to link to `../Images/{slug}/hero.jpg`
10. Follow `.claude/rules.md` to commit and push all changes to FlavorAtlas branch
11. Post message: "Recipe images added! 📸 Updated 3 recipes..."

## Quality Standards

Follow the image requirements from the Flavor Atlas guide:
- Hero images: 3:2 or 4:3 aspect ratio
- Minimum 1600px width
- Compressed for web (under 500KB if possible)
- Professional food photography quality
- Descriptive alt text for accessibility
- Relative path links in recipes

## Reference

For complete details on media standards and workflow:
- **Media and image standards**: `CLAUDE.md`
- **Git workflow and binary file handling**: `.claude/rules.md`
