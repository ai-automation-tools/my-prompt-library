---
name: 🐙 new-recipe
description: Process recipe tasks from the Flavor Atlas workspace on ax-gcp MCP server. Pick one recipe task, build it using the FlavorAtlas template, store locally in Artifacts, upload to GitHub AX-CommunityWorkspaces repo, and update tasks/messages. Use when asked to work on recipes, create new recipes, process Flavor Atlas tasks, or build recipe content.
---

# New Recipe

This skill guides you through the complete workflow for processing a recipe task in the Flavor Atlas project: from task selection to GitHub publication and task closure.

## Overview

1. Fetch and select one recipe task from the Flavor Atlas workspace
2. Build the recipe using the official template
3. Store locally in the Artifacts folder
4. Upload to GitHub in the appropriate regional folder
5. Update the task and post to the message board

## Instructions

### Step 1: Get and Select a Recipe Task

1. Use the `mcp__ax-gcp__tasks` tool to list available tasks in the Flavor Atlas workspace:
   - Set `action: "list"`
   - Set `filter: "available"` or `filter: "my_tasks"`

2. Select ONE task at random from the available recipe tasks

3. Update the selected task to `in_progress`:
   - Use `mcp__ax-gcp__tasks` with `action: "update"`
   - Set `status: "in_progress"`
   - Set `task_id` to the selected task

### Step 2: Research and Build the Recipe

1. **Get the template**: Fetch the recipe template from GitHub:
   - URL: `https://github.com/AX-MCP/AX-CommunityWorkspaces/blob/main/flavor-atlas/Templates/FlavorAtlas_Recipe_Template.md`
   - Use `mcp__github__get_file_contents` with:
     - `owner: "AX-MCP"`
     - `repo: "AX-CommunityWorkspaces"`
     - `path: "flavor-atlas/Templates/FlavorAtlas_Recipe_Template.md"`

2. **Research the recipe** (if needed):
   - Use `mcp__serper__google_search` to find recipe information
   - Use `mcp__playwright__*` tools for browser-based recipe research
   - Gather ingredients, measurements, steps, and cultural context

3. **Build the recipe** following the template structure:
   - Include YAML frontmatter with all required fields
   - Use dual units (US customary and metric) for all ingredients
   - Write numbered, imperative steps with sensory cues
   - Add cultural/context paragraph (2-4 lines)
   - Include food safety temps and storage instructions
   - Add allergen flags
   - **Add image placeholder**: Include a note like `![Hero image of {Dish Name}](../images/{slug}/hero.jpg)` in the recipe description

4. **Follow the editorial checklist** from `claude.md`:
   - Valid YAML front matter
   - Dual units on all ingredients
   - Numbered steps with sensory cues
   - Food safety temps and storage
   - Cultural/context paragraph
   - Image placeholders with alt text

### Step 3: Store Recipe Locally and Publish to GitHub

1. **Save the recipe locally** in the repository working tree:
   - Target directory: `D:\AI_Agents\Repo\CommunityRepo\FlavorAtlas\AX-CommunityWorkspaces\flavor-atlas\Recipes\{region}\`
   - Filename format: `{region}_{slug}_v{n}.md`
   - Example: `midwest_chicago-deep-dish_v1.md`
   - Use the `Write` tool to save to the working tree location

2. **Commit and push to GitHub**:
   - Follow the complete workflow documented in `.claude/rules.md`
   - This includes: git add, commit with descriptive message, and push to FlavorAtlas branch
   - See `.claude/rules.md` for branch strategy, SSH configuration, and binary file handling

3. **Capture the GitHub URL** for reference:
   - Format: `https://github.com/AX-MCP/AX-CommunityWorkspaces/blob/main/flavor-atlas/Recipes/{region}/{filename}`

### Step 4: Update Task and Post Message

1. **Update the task description** with the GitHub link:
   - Use `mcp__ax-gcp__tasks` with `action: "update"`
   - Add a note with the GitHub URL: `note: "Recipe published: [GitHub URL]"`
   - Set `status: "completed"`
   - Add `closing_note: "Recipe created and published to GitHub"`

2. **Post to the Flavor Atlas message board**:
   - Use `mcp__ax-gcp__messages` with `action: "send"`
   - Include the recipe name and GitHub link
   - Example message format:
     ```
     New recipe published: {Dish Name} ({Region})

     Check it out: [GitHub URL]

     #recipes #published
     ```

## Important Notes

- **One task per run**: Only complete ONE recipe task each time this skill is invoked
- **Image placeholders**: Always include image placeholders with descriptive alt text
- **Git workflow**: Follow `.claude/rules.md` for complete instructions on committing and pushing to GitHub
- **Branch strategy**: Work on FlavorAtlas branch, never push directly to main
- **Follow claude.md**: Always reference the agent instruction file for editorial standards

## MCP Servers Used

- **ax-gcp**: For tasks and messages
- **Serper**: For web search when researching recipes
- **Playwright**: For browser automation when researching recipes
- **GitHub**: For uploading recipes to the community workspace

## Example Workflow

1. List tasks → Select "NEW RECIPE: Deep Dish Pizza (Midwest)"
2. Fetch template from GitHub
3. Research Chicago deep dish pizza
4. Build recipe with dual units, steps, and cultural context
5. Save to repo working tree: `flavor-atlas/Recipes/midwest/midwest_chicago-deep-dish_v1.md`
6. Follow `.claude/rules.md` to commit and push to FlavorAtlas branch
7. Update task with GitHub link and mark completed
8. Post message: "New recipe published: Chicago Deep Dish Pizza..."

## Quality Standards

Follow the editorial checklist from the Flavor Atlas guide:
- Front matter present and valid YAML
- Dual units on all ingredients
- Steps numbered, imperative, with sensory cues
- Food safety temps & storage present
- Cultural/context paragraph (2-4 lines)
- Image placeholders with alt text
- Filenames: lowercase, hyphenated slugs

## Reference

For complete details on recipe standards and editorial guidelines:
- **Recipe standards**: `CLAUDE.md`
- **Git workflow and publishing**: `.claude/rules.md`
