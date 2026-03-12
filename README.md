# AI Prompt Library

A modern, full-stack AI prompt library built with **React**, **Express**, and **Tailwind CSS**. Browse, organize, and quickly access **344 curated prompts** across multiple categories with a beautiful, customizable interface featuring **12 professional themes**.

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)](https://tailwindcss.com/)

---

## 🚀 Features

### Core Functionality
- **344 Curated Prompts**: Organized across 9 categories and 6 collections
- **Hierarchical Organization**: Category → Subcategory → Prompt structure
- **Two Collections**: "My Prompts" (default) and "Collections" (curated sets)
- **3-Column Grid Layout**: Browse multiple prompts at once
- **One-Click Copy**: Instant clipboard copy from any view
- **Full Markdown Support**: Rich formatting with code blocks, lists, headings
- **YAML Frontmatter**: Structured metadata (title, tags, category, subcategory)
- **Dynamic Loading**: Automatic detection of new prompts

### User Experience
- **12 Professional Themes**: Retro Wave, Obsidian Cyan, Carbon Ember, Midnight Violet, Emerald Glass, Solar Flare, Sahara Gold, Terminal Hacker, GitHub Dark Pro, Frosted Steel, Void Black, Light
- **Theme Persistence**: Your selected theme is saved
- **Glass Morphism UI**: Modern frosted glass effects
- **Neon Accents**: Theme-aware glow effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Custom Favicon**: Terminal/prompt icon in browser tab

### Navigation & Search
- **All Prompts View**: See entire library in grid (default landing page)
- **Category Filtering**: Click any category to browse
- **Subcategory Views**: View all prompts in a subcategory
- **"All" Option**: View all prompts within a category at once
- **Grid & Detail Views**: Browse cards or read full prompts
- **Quick Preview**: First 150 characters visible on cards

---

## 📂 Project Structure

```
my-prompt-library/
├── prompts/                    # All prompt files
│   ├── My_Prompts/            # Default collection (218 prompts)
│   │   ├── AI_Tools/          # AI automation (42 prompts)
│   │   ├── Business/          # Business ops (21 prompts)
│   │   ├── Finance/           # Financial analysis (27 prompts)
│   │   ├── Images/            # Image generation (11 prompts)
│   │   ├── IT/                # Technical/IT (83 prompts)
│   │   ├── MCP_Servers/       # MCP integrations (12 prompts)
│   │   ├── Social_Media/      # Social content (2 prompts)
│   │   ├── Video/             # Video/podcasts (13 prompts)
│   │   └── Writing/           # Writing/docs (48 prompts)
│   └── Collections/           # Curated collections (126 prompts)
│       ├── AI/                # AI development (28 prompts)
│       ├── Business/          # Marketing/ecommerce (50+ prompts)
│       ├── Engineering/       # Software engineering (47 prompts)
│       ├── Finance/           # Financial planning (7 prompts)
│       ├── Image_&_Video/     # Media generation (1 prompt)
│       └── Writing/           # Creative writing (11 prompts)
├── src/                       # React frontend
│   ├── App.tsx               # Main application
│   ├── main.tsx              # Entry point
│   ├── index.css             # Global styles
│   └── themes.css            # Theme definitions
├── scripts/                   # Automation scripts
│   └── add-frontmatter.mjs   # Auto-add YAML frontmatter
├── public/                    # Static assets
│   └── favicon.svg           # Custom favicon
├── server.ts                  # Express backend
├── index.html                # HTML entry
├── vite.config.ts            # Vite configuration
├── package.json              # Dependencies
├── README.md                 # This file
└── PROMPT_EDITOR_GUIDE.md    # Prompt creation guide
```

---

## 📝 Creating & Editing Prompts

### Quick Start

1. **Create a new file** in the appropriate folder:
   ```
   prompts/My_Prompts/[Category]/[Subcategory]/your-prompt-name.md
   ```

2. **Add YAML frontmatter**:
   ```markdown
   ---
   title: "Your Prompt Title"
   tags: ["tag1", "tag2", "tag3"]
   category: "Category"
   subcategory: "Subcategory"
   ---
   
   # Your Prompt Title
   
   Your prompt content here...
   ```

3. **Test in the app**:
   ```bash
   npm run dev
   # Open http://localhost:3010
   ```

### Full Documentation

See **[PROMPT_EDITOR_GUIDE.md](./PROMPT_EDITOR_GUIDE.md)** for comprehensive instructions on:
- Creating new prompts
- Editing existing prompts
- YAML frontmatter format
- File naming conventions
- Category organization
- Automation scripts
- Quality checklist
- Common issues & solutions
- AI agent integration

---

## 🛠️ Getting Started

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

The app will automatically reload when you:
- Add new prompt files
- Edit existing prompts
- Modify source code

### Building for Production

1. **Build frontend assets**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   NODE_ENV=production node server.ts
   ```

3. **Access the app**:
   ```
   http://localhost:3010
   ```

---

## ⚙️ Configuration

### Adding Categories

To add a new category to the sidebar:

1. **Create the folder**:
   ```bash
   mkdir -p prompts/My_Prompts/NewCategory/Subcategory
   ```

2. **Update `src/App.tsx`**:
   ```typescript
   const FIXED_CATEGORIES = [
     "AI_Tools",
     "Business",
     "Finance",
     "Images",
     "IT",
     "MCP_Servers",
     "NewCategory",  // Add here (alphabetical order)
     "Social_Media",
     "Video",
     "Writing"
   ];
   ```

3. **Restart the dev server**

### Customizing Themes

Themes are defined in `src/themes.css`. Each theme uses CSS variables:

```css
[data-theme='your-theme'] {
  --bg-primary: #000000;
  --bg-secondary: rgba(11, 11, 13, 0.8);
  --text-primary: #E5E7EB;
  --text-secondary: #8B93A1;
  --accent: #4FFFB0;
  --accent-glow: rgba(79, 255, 176, 0.4);
  --border: rgba(255, 255, 255, 0.1);
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
}
```

Add your theme to `src/App.tsx`:

```typescript
const THEMES: { id: Theme; name: string; icon: string }[] = [
  // ... existing themes
  { id: 'your-theme', name: 'Your Theme', icon: '🎨' },
];
```

---

## 🎨 Themes

Choose from 12 professionally designed themes:

| Theme | Description | Accent Color |
|-------|-------------|--------------|
| ⚡ Retro Wave | 80s neon pink/cyan (default) | Pink/Cyan |
| 💎 Obsidian Cyan | Clean, high-contrast cyan | Cyan |
| 🔥 Carbon Ember | Warm ember accents | Orange |
| 🌙 Midnight Violet | Purple-forward, sleek | Purple |
| 🌿 Emerald Glass | Green glass aesthetic | Emerald |
| ☄️ Solar Flare | Warm solar tones | Orange/Yellow |
| 🏜️ Sahara Gold | Desert gold palette | Gold |
| 💻 Terminal Hacker | Green-on-black terminal | Neon Green |
| 🐙 GitHub Dark Pro | GitHub-inspired dark | Blue |
| 🔩 Frosted Steel | Cool steel tones | Silver |
| 🕳️ Void Black | Deep black with blue | Deep Blue |
| ☀️ Light | Clean light mode | Indigo |

---

## 📊 Stats

- **Total Prompts**: 344
- **Categories**: 9 (My_Prompts) + 6 (Collections)
- **Themes**: 12
- **Lines of Code**: ~500 (frontend + backend)
- **Tech Stack**: React 18, Vite 5, TypeScript 5, Express, Tailwind CSS 3

### Prompt Breakdown

**My_Prompts** (218 prompts):
- AI_Tools: 42
- Business: 21
- Finance: 27
- Images: 11
- IT: 83
- MCP_Servers: 12
- Social_Media: 2
- Video: 13
- Writing: 48

**Collections** (126 prompts):
- AI: 28
- Business: 50+
- Engineering: 47
- Finance: 7
- Image_&_Video: 1
- Writing: 11

---

## 🤖 For AI Agents & Automation

This project is designed to be agent-friendly:

### Automation Scripts

**Add Frontmatter** (auto-generate YAML headers):
```bash
node scripts/add-frontmatter.mjs
```

**What it does**:
- Scans all `.md` files in `prompts/`
- Skips files with existing frontmatter
- Infers category/subcategory from path
- Generates title from first heading or filename
- Creates relevant tags from keywords
- Adds YAML frontmatter block

### API Endpoint

The app exposes a REST API for prompts:

```bash
GET http://localhost:3010/api/prompts
```

**Response format**:
```json
[
  {
    "id": "finance_analysis_stock-analysis",
    "title": "Stock Analysis Deep Dive",
    "category": "Finance",
    "subcategory": "Analysis",
    "tags": ["finance", "stocks", "analysis"],
    "content": "Full markdown content...",
    "lastModified": "2026-03-11T18:00:00.000Z"
  }
]
```

### Integration Guide

See **[PROMPT_EDITOR_GUIDE.md](./PROMPT_EDITOR_GUIDE.md)** section "For AI Agents & Skills" for:
- Automation workflow
- Template code
- Path construction
- Validation steps

---

## 📚 Documentation

- **[PROMPT_EDITOR_GUIDE.md](./PROMPT_EDITOR_GUIDE.md)**: Complete guide for creating, editing, and organizing prompts
- **[PROJECT.md](../openclaw/PROJECT.md)**: Project overview and architecture (OpenClaw workspace)
- **[notes.md](../openclaw/notes.md)**: Development changelog and updates

---

## 🔧 Tech Stack

### Frontend
- **React 18**: Component-based UI
- **TypeScript 5**: Type-safe code
- **Vite 5**: Fast dev server & optimized builds
- **Tailwind CSS 3**: Utility-first styling
- **React Markdown**: Markdown rendering

### Backend
- **Express**: REST API server
- **Node.js**: Runtime
- **File-based storage**: Markdown files with YAML frontmatter

### Development
- **Hot Module Replacement (HMR)**: Instant updates
- **Git**: Version control
- **GitHub**: Remote repository

---

## 🚦 Roadmap

### Phase 4: Polish & Optimization (In Progress)
- [ ] Add search functionality (title, content, tags)
- [ ] Implement URL-based navigation
- [ ] Add keyboard shortcuts
- [ ] Optimize bundle size
- [ ] Improve mobile responsive design

### Phase 5: Deployment (Planned)
- [ ] Deploy to Vercel/Netlify
- [ ] Configure custom domain
- [ ] Set up analytics
- [ ] Add SEO tags

### Phase 6: Advanced Features (Planned)
- [ ] Collections/favorites system
- [ ] Export prompts (JSON, Markdown, PDF)
- [ ] Import prompts via UI
- [ ] User preferences storage
- [ ] Advanced search filters
- [ ] Prompt sharing via URL

See **[planning.md](../openclaw/planning.md)** for detailed roadmap.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Add your prompts or code changes
4. Follow the [PROMPT_EDITOR_GUIDE.md](./PROMPT_EDITOR_GUIDE.md) for prompts
5. Test locally (`npm run dev`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Guidelines
- Follow existing code style
- Add YAML frontmatter to all prompts
- Test before submitting
- Write clear commit messages

---

## 📜 License

This project is private and not currently licensed for public use.

---

## 🙏 Acknowledgments

- **React Team**: For the amazing framework
- **Vite Team**: For the blazing-fast build tool
- **Tailwind CSS**: For utility-first styling
- **OpenClaw**: For the development environment
- **Claude Opus 4.6**: For collaboration on features

---

## 📞 Support

For issues, questions, or feature requests:
- Check the [PROMPT_EDITOR_GUIDE.md](./PROMPT_EDITOR_GUIDE.md)
- Review [notes.md](../openclaw/notes.md) for recent changes
- Open an issue on GitHub

---

**Built with ❤️ using React, Vite, and Tailwind CSS**

**Last Updated**: March 11, 2026  
**Version**: 1.0  
**Total Prompts**: 344  
**Themes**: 12
