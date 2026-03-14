# AI Prompt Library

A modern, full-stack AI prompt library built with **React**, **Express**, and **Tailwind CSS**. Effectively browse, organize, create, and manage prompts with a beautiful, customizable interface, now featuring **immediate feedback**, **loading states**, and advanced **navigation**.

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)](https://tailwindcss.com/)

---

## ✨ Features

We've developed a robust set of features to make managing your AI prompts effortless and efficient.

### Core Functionality
- **Curated Prompts**: Organized across various categories and collections.
- **Hierarchical Organization**: Category → Subcategory → Prompt structure for easy browsing.
- **Full Markdown Support**: Rich formatting with code blocks, lists, headings for prompt content.
- **YAML Frontmatter**: Structured metadata (title, tags, category, subcategory) for comprehensive organization.
- **Dynamic Loading**: Automatic detection of new and updated prompts.

### 📝 Prompt Editor UI (CRUD)
- **Create New Prompts**: Add prompts with a user-friendly modal form.
- **Edit Existing Prompts**: Modify prompt details, content, and tags directly from the UI.
- **Delete Prompts**: Securely remove prompts with a confirmation dialog.
- **Live Markdown Preview**: See exactly how your markdown will render as you type.
- **Tag Management**: Easily add and remove tags for better categorization.

### 🧭 Navigation & Organization
- **Hero Section Search**: Large, prominent search bar in hero section with fuzzy search powered by Fuse.js.
- **Horizontal Filter Bar**: Compact top bar with Favorites, Recent, and Tags filters with solid dropdown menus.
- **Advanced Filtering**: Filter prompts by tags with multi-select support and visual feedback.
- **Sorting Options**: Sort prompts by title (A-Z, Z-A) or modification date (newest/oldest first).
- **Favorites System**: Star your most-used prompts for quick access via top bar dropdown (solid background).
- **Recently Viewed**: Automatically track and access your last 10 viewed prompts via top bar dropdown.
- **Breadcrumb Navigation**: Intuitive visual path showing your current location, with clickable elements to go back.
- **Clean Sidebar**: Navigation-focused sidebar with solid theme colors - no search, just navigation.

### ⚡ Quick Wins UX Improvements
- **Toast Notifications**: Get immediate, non-intrusive feedback (success, error, info) for all actions.
- **Loading States**: Animated skeleton cards prevent blank screens and indicate content is loading.
- **Empty State Messages**: Helpful, contextual messages guide users when no prompts are found or search yields no results.
- **Prompt Count Badges**: See the number of prompts in each category directly in the sidebar.
- **Copy All Button**: On prompt detail, copy the full markdown *including frontmatter*, or just the content.

### User Experience & Theming
- **Professional Themes**: Choose from 8 professionally designed themes with solid sidebar backgrounds.
- **Glass Morphism UI**: Modern frosted glass effects on content cards with neon accents.
- **Space-Efficient Layout**: Compact top bar, 4-column grid on desktop, minimal margins for maximum content visibility.
- **Smart Prompt Cards**: Dedicated vertical button column with separator - no title/button overlap.
- **Fully Responsive**: Mobile-optimized with adaptive layouts, touch-friendly buttons, and vertical stacking on small screens.
- **Accessible**: Proper ARIA labels, keyboard navigation, and semantic HTML throughout.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/michaelschecht/my-prompt-library.git
   cd my-prompt-library
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```

### Development
1. **Start the dev server**:
   ```bash
   npm run dev
   ```
2. **Open in browser**:
   ```
   http://localhost:3010
   ```
   The app will automatically reload on code or content changes.

### Building for Production
1. **Build frontend assets**:
   ```bash
   npm run build
   ```
2. **Start production server**:
   ```bash
   NODE_ENV=production node api/index.ts
   ```
   (Note: Use `api/index.ts` for Vercel deployment structure)

---

## 📚 Documentation

**[📖 Full Documentation](./docs/README.md)** - Complete documentation index

### Quick Links

#### Getting Started & Setup
- **[Setup Guide](./docs/SETUP.md)** - Complete setup instructions for local and GitHub modes
- **[Quick Reference](./docs/QUICK_REFERENCE.md)** - Fast toggle guide for switching storage modes

#### Technical Documentation
- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture and design decisions
- **[GitHub Mode](./docs/GITHUB_MODE.md)** - GitHub API integration details and batching strategy

#### Feature Guides
- **[Quick Wins UX Improvements](./docs/quick-wins-ux.md)** - Toasts, loading states, empty states
- **[Navigation & Organization](./docs/navigation-organization.md)** - Favorites, recently viewed, breadcrumb navigation
- **[Prompt Editor UI](./docs/prompt-editor-ui.md)** - Creating, editing, and deleting prompts
- **[Prompt Template & Formatting](./docs/prompt-template-guide.md)** - How to create and format prompts
- **[Vercel Deployment](./docs/deployment-vercel.md)** - Deploy to Vercel step-by-step

---

## 💾 Storage Modes

The Prompt Library supports **two storage modes** that can be toggled via environment variable:

### 🏠 Local Mode (Default)
- Reads prompts from local `prompts/` directory
- ⚡ Fast, no API calls
- 🔒 No rate limits
- **Perfect for development**

### ☁️ GitHub Mode
- Fetches prompts from GitHub repository
- 🌐 Centralized storage with version control
- 🔄 Batched API calls (50 at a time)
- ⏱️ 5-minute cache to reduce API usage
- **Required for Vercel deployment**

**Toggle between modes:** Set `USE_GITHUB_MODE=true` in `.env` file

See **[Setup Guide](./docs/SETUP.md)** for complete configuration instructions.

---

## ⚙️ Configuration

### Adding Categories
To add a new category to the sidebar:
1. **Create the folder**: `mkdir -p prompts/My_Prompts/NewCategory/Subcategory`
2. Update `src/App.tsx` (the `FIXED_CATEGORIES` array).
3. Restart the dev server.

### Customizing Themes
Themes are defined in `src/themes.css` using CSS variables. You can add your custom theme by updating this file and `src/App.tsx` (the `THEMES` array).

---

## 🤖 For AI Agents & Automation

This project is designed to be agent-friendly:

### Automation Scripts
**Add Frontmatter** (auto-generate YAML headers):
```bash
node scripts/add-frontmatter.mjs
```
This script scans markdown files, infers metadata, and adds YAML frontmatter.

### API Endpoint
The app exposes a REST API for prompts:
```bash
GET http://localhost:3010/api/prompts
```
(Also `POST`, `PUT`, `DELETE` via `api/prompts` and `api/prompts/:id` respectively)

---

## 📈 Roadmap

We're constantly improving the Prompt Library. Here's what's next:

### ✅ Phase 4: Advanced Interaction (COMPLETED!)
- ✅ **Fuzzy Search**: Implemented with Fuse.js for intelligent search
- ✅ **Tag Filtering**: Multi-select tag filters with visual feedback
- ✅ **Sorting Options**: Sort by title or modification date
- ✅ **Mobile Optimization**: Fully responsive design with touch-friendly UI
- ✅ **Collapsible Sections**: Cleaner sidebar with expandable sections

### Phase 5: Future Enhancements (Next Up!)
- **Custom Collections**: Create and manage personal prompt collections.
- **User Preferences**: Store user settings and preferences.
- **Import/Export**: Easily import and export prompts.
- **Prompt Sharing**: Share prompts via unique URLs.
- **Version History**: Track changes and restore previous prompt versions.

---

## 🤝 Contributing

Contributions are welcome!

### Adding New Prompts
1. Review the **[Prompt Template & Formatting Guide](docs/prompt-template-guide.md)**
2. Create your prompt file following the template
3. Place it in the appropriate category folder under `prompts/Collections/`
4. Test locally to ensure proper rendering

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow existing code style and conventions
4. Test locally (`npm run dev`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📜 License

This project is private and not currently licensed for public use.

---

## 🙏 Acknowledgments

- **React Team**: For the amazing framework.
- **Vite Team**: For the blazing-fast build tool.
- **Tailwind CSS**: For utility-first styling.
- **OpenClaw**: For the development environment.
- **Claude Opus 4.6**: For collaboration on features.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**

**Last Updated**: March 13, 2026 (v2.0 - Final)
