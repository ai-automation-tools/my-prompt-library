# AI Prompt Library

A full-stack, highly organized AI Prompt Library built with React, Express, and Tailwind CSS. This application allows you to manage, categorize, and quickly access prompts for various AI models and workflows.

## 🚀 Features

- **Hierarchical Organization**: Organize prompts by Category and Subcategory using a simple folder structure.
- **Markdown Support**: Prompts are rendered with full Markdown support for clear formatting.
- **Multi-Theme UI**: Choose between "Retro Wave", "Emerald Glass", and "Light" themes.
- **One-Click Copy**: Quickly copy prompt content to your clipboard.
- **Real-Time Search**: Filter prompts by title, content, or tags.
- **Dynamic Loading**: The app automatically detects new prompts added to the filesystem.

## 📂 Project Structure

- `prompts/`: The root directory for all prompt files.
  - `Category/`: Top-level folder (e.g., `Business`, `IT`, `Writing`).
    - `Subcategory/`: Nested folder (e.g., `Marketing`, `Security`, `Blogs`).
      - `prompt-name.md`: Individual prompt files.
      - `readme.md`: Special file that acts as the index/overview for the subcategory.
- `src/`: React frontend source code.
  - `App.tsx`: Main application logic and UI.
  - `index.css`: Global styles and theme definitions.
- `server.ts`: Express backend that serves the prompt API and integrates with Vite.

## 📝 Adding New Prompts

To add a new prompt, simply create a `.md` file in the appropriate directory within `/prompts`.

### 1. Folder Pattern
Follow this structure to ensure the sidebar displays correctly:
`prompts/[Category]/[Subcategory]/[PromptName].md`

### 2. Frontmatter Metadata
You can add metadata to your prompts using YAML frontmatter at the top of the file:

```markdown
---
title: "My Awesome Prompt"
tags: ["creative", "writing", "gpt-4"]
category: "Writing"
subcategory: "Creative"
---

Your prompt content goes here...
```

*Note: If `category` or `subcategory` are missing from the frontmatter, the app will infer them from the folder names.*

### 3. Subcategory Overviews
If you create a `readme.md` file inside a subcategory folder, it will be used as the default "index" prompt when that subcategory is clicked in the sidebar.

## ⚙️ Configuration

### Sidebar Categories
The top-level categories displayed in the sidebar are defined in `src/App.tsx` via the `FIXED_CATEGORIES` constant. If you add a new top-level folder in `/prompts`, make sure to add its name to this list to see it in the sidebar.

```typescript
const FIXED_CATEGORIES = [
  "Business",
  "Finance",
  "Images",
  "IT",
  "MCP_Servers",
  "Social_Media",
  "Video",
  "Writing"
];
```

## 🛠️ Getting Started

### Prerequisites
- Node.js installed on your machine.

### Installation
1. Install the dependencies:
   ```bash
   npm install
   ```

### Development
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

### Building for Production
1. Build the frontend assets:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   NODE_ENV=production node server.ts
   ```

## 🎨 Customization

You can add or modify themes in `src/index.css` by updating the `[data-theme]` selectors. The UI uses Tailwind CSS utility classes for easy styling adjustments.
