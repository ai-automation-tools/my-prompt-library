# My Prompt Library — Analysis & Recommendations

**Date:** 2026-03-18
**Scope:** Codebase review, live UI audit, AI integration opportunities, enhancement roadmap
**App URL:** http://localhost:3010 | Deployed on Vercel
**Stack:** React 19 + TypeScript, Express 4, PostgreSQL (Neon), Vite 6, Tailwind CSS 4

---

## Table of Contents

1. [Current State Summary](#1-current-state-summary)
2. [UI/UX Improvements](#2-uiux-improvements)
3. [AI Tool & Resource Integrations](#3-ai-tool--resource-integrations)
4. [Architecture & Code Quality](#4-architecture--code-quality)
5. [Feature Enhancements](#5-feature-enhancements)
6. [Performance & Infrastructure](#6-performance--infrastructure)
7. [Prioritized Roadmap](#7-prioritized-roadmap)

---

## 1. Current State Summary

### What's Working Well

- **Dual library model** (Public + My Library) is clean and intuitive
- **940+ prompts** organized across 5 sections with categories/subcategories
- **14 CSS-variable themes** — instant switching, well-designed palettes
- **Fuzzy search** via Fuse.js works across title, content, tags, and category
- **Markdown rendering** with GFM support for rich prompt content
- **Auth system** is solid — bcrypt hashing, httpOnly cookies, 30-day sessions
- **Responsive design** — sidebar collapses to drawer on mobile, grid adapts
- **Copy-to-library flow** lets users save public prompts to their personal collection
- **Featured prompts** section highlights curated content
- **External resource dropdowns** in header (CLI, Prompts, Skills, Tools, Agents) link to the broader AI ecosystem

### Key Metrics

| Metric | Value |
|---|---|
| Total public prompts | 940 |
| Sections | 5 (Prompt Library, Agent Instructions, Agent Guides, System Prompts, Skills) |
| Categories | ~40+ across all sections |
| Themes | 14 |
| API endpoints | 10 |
| Main component size | `App.tsx` — 2,386 lines |
| Database tables | 3 (users, user_prompts, user_sessions) |

---

## 2. UI/UX Improvements

### Critical Fixes

#### 2.1 Loading State — No Skeleton/Spinner
**Problem:** Page briefly shows "0 prompts" before async data loads, causing a flash of empty content.
**Fix:** Add a loading skeleton grid (pulsing card placeholders) while `GET /api/prompts` resolves. Use a `loading` state flag.

#### 2.2 Tablet Header Overflow (768px)
**Problem:** Login/Sign Up buttons are partially cut off at the right edge at tablet widths.
**Fix:** Collapse header nav items into a hamburger menu at `md` breakpoint. Move auth buttons inside the mobile menu or stack them below the nav.

#### 2.3 Console Noise
**Problem:** Dozens of `DEBUG:` log statements in `App.tsx` (lines 197-287) clutter the console. Also, `/api/auth/me` fires twice on load (React double-render in StrictMode) returning 401 when not logged in.
**Fix:**
- Wrap debug logs in `if (import.meta.env.DEV)` or remove entirely
- Skip `/api/auth/me` call if no `auth_token` cookie exists (check `document.cookie` first)
- Or return 204 instead of 401 when no token is present

#### 2.4 Search UX Gaps
**Problem:** No clear/reset button on search input. Sidebar category counts don't update during search (still show section totals).
**Fix:**
- Add an `X` clear button inside the search input when text is present
- Update sidebar counts to reflect filtered results during active search
- Show "N results for 'query'" feedback text above the grid

### Enhancements

#### 2.5 Prompt Detail View — Improvements
- **Copy to clipboard button** on the prompt content itself (one-click copy of the full prompt text)
- **Font size toggle** is present but could be more prominent — consider a slider or A/A+ buttons
- **Table of contents** for longer prompts (auto-generated from headings)
- **"Related prompts"** section at the bottom based on shared tags/category

#### 2.6 Card Grid — Enhancements
- **Content preview truncation** — some cards show raw markdown syntax in preview. Strip markdown before truncating.
- **Tag filtering** — clicking a tag on a card should filter the grid to that tag
- **Batch actions** — multi-select cards for bulk copy-to-library, bulk download, or bulk delete (My Library)

#### 2.7 Sidebar — Polish
- **Persist expanded/collapsed state** in localStorage (currently resets on refresh)
- **Search within sidebar** for quickly finding categories in large sections
- **Active category highlight** — more prominent visual indicator for the currently selected category
- **Drag-to-reorder categories** in My Library

#### 2.8 Theme System
- **Theme persistence bug** — theme selection may not survive full page reload (race condition in initialization). Ensure theme is read from localStorage synchronously before first paint (in `index.html` or as a blocking script).
- **Theme preview thumbnails** — show a mini color swatch next to each theme name
- **Auto dark/light mode** — respect `prefers-color-scheme` OS setting as default

#### 2.9 Accessibility
- **Keyboard navigation** — ensure all interactive elements are reachable via Tab, cards are focusable, Enter opens detail view
- **ARIA labels** on icon-only buttons (download, copy, save)
- **Focus trap** in modals (Login, Signup, Editor)
- **Screen reader** — announce toast notifications with `aria-live="polite"`
- **Color contrast** — audit all 14 themes for WCAG AA compliance (some glass-morphism effects may reduce contrast)

---

## 3. AI Tool & Resource Integrations

### 3.1 Claude API — Prompt Enhancement & Generation
**What:** Integrate Claude API to enhance, refine, or generate prompts directly in the app.
**Features:**
- **"Improve this prompt"** button on detail view — sends prompt to Claude, returns optimized version
- **"Generate prompt from description"** — user describes what they need, Claude generates a full prompt template
- **"Explain this prompt"** — Claude analyzes a prompt and explains what it does, who it's for, and how to customize it
- **Variable extraction** — auto-detect `[bracketed placeholders]` and generate a fill-in form
**Implementation:** Add a `/api/ai/enhance` endpoint using the Anthropic SDK (`@anthropic-ai/sdk`). The `google-genai` package is already installed but unused — consider standardizing on one provider or supporting both.

### 3.2 MCP Server Integration
**What:** Expose the prompt library as an MCP server so Claude Code, Cursor, and other AI tools can read/search prompts directly.
**Features:**
- **Tool: `search_prompts`** — fuzzy search by keyword, tag, or category
- **Tool: `get_prompt`** — retrieve a specific prompt by ID
- **Tool: `list_categories`** — browse available sections/categories
- **Resource: `prompt://{id}`** — individual prompts as MCP resources
**Implementation:** Create an MCP server using `@modelcontextprotocol/sdk` that connects to the same database/filesystem. Register it in `.mcp.json` for Claude Code access.

### 3.3 Hugging Face Integration
**What:** Search and import prompt datasets from Hugging Face Hub.
**Features:**
- **Import from HF** — browse prompt datasets (e.g., `fka/awesome-chatgpt-prompts`) and import selected prompts
- **Export to HF** — publish your personal library as a dataset
- **Model-specific prompts** — tag prompts with compatible models (Claude, GPT-4, Gemini, Llama)
**Implementation:** Use the Hugging Face MCP tools already available (`mcp__claude_ai_Hugging_Face__hf_hub_query`, `hub_repo_search`).

### 3.4 NotebookLM Integration
**What:** Feed prompts into NotebookLM for research and synthesis.
**Features:**
- **"Research this topic"** button — creates a NotebookLM notebook from selected prompts and generates a synthesis
- **Audio overview** — generate a podcast-style discussion about a collection of prompts
**Implementation:** Use the NotebookLM MCP tools (`notebook_create`, `notebook_add_text`, `research_start`).

### 3.5 Canva Integration
**What:** Generate visual prompt cards or cheat sheets.
**Features:**
- **"Create cheat sheet"** — select multiple prompts, generate a designed PDF/image via Canva
- **"Share card"** — create a shareable visual card for a single prompt
**Implementation:** Use Canva MCP tools (`generate-design`, `export-design`).

### 3.6 n8n Workflow Automation
**What:** Trigger workflows when prompts are created, updated, or shared.
**Features:**
- **Webhook on new prompt** — push new prompts to Slack, email, or a team channel
- **Scheduled digest** — weekly email of new/popular prompts
- **Sync to Notion/Obsidian** — auto-export prompts to external knowledge bases
**Implementation:** Add webhook support to the API (`POST /api/webhooks`), integrate with n8n MCP tools.

### 3.7 GitHub Sync (Enhanced)
**What:** The app already has `USE_GITHUB_MODE` for reading from GitHub. Enhance it to be bidirectional.
**Features:**
- **Push personal prompts to a GitHub repo** — version-controlled prompt library
- **Pull from multiple repos** — aggregate prompts from team members' repos
- **PR-based contributions** — users submit new public prompts via GitHub PR
**Implementation:** Use the GitHub MCP tools (`create_or_update_file`, `create_pull_request`).

### 3.8 Ollama / Local LLM Support
**What:** For users who want to test prompts locally without API costs.
**Features:**
- **"Test this prompt"** panel — send the prompt to a local Ollama instance and see the response inline
- **Model selector** — choose from locally available models
- **Side-by-side comparison** — test same prompt across multiple models
**Implementation:** Add an optional `/api/ai/test` endpoint that proxies to `http://localhost:11434/api/generate` (Ollama default).

---

## 4. Architecture & Code Quality

### 4.1 Break Up App.tsx (Critical)
**Problem:** `App.tsx` is 2,386 lines — a monolithic component handling state, layout, sidebar, grid, detail view, search, filtering, sorting, favorites, and more.
**Recommendation:** Extract into focused components:

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Nav bar, dropdowns, auth buttons
│   │   ├── Sidebar.tsx           # Section selector, categories, tags, theme
│   │   └── MainLayout.tsx        # Shell that composes header + sidebar + content
│   ├── prompts/
│   │   ├── PromptGrid.tsx        # Card grid with sorting/filtering
│   │   ├── PromptCard.tsx        # Individual card
│   │   ├── PromptDetail.tsx      # Full prompt view with actions
│   │   ├── FeaturedPrompts.tsx   # Featured section
│   │   └── PromptSearch.tsx      # Search bar + results count
│   ├── auth/
│   │   ├── LoginModal.tsx        # (exists)
│   │   └── SignupModal.tsx       # (exists)
│   └── ui/
│       ├── Toast.tsx             # (exists)
│       ├── EmptyState.tsx        # (exists)
│       ├── LoadingSkeleton.tsx   # New — loading placeholders
│       └── DropdownMenu.tsx      # Reusable dropdown
├── hooks/
│   ├── usePrompts.ts            # Fetch, search, filter, sort logic
│   ├── useTheme.ts              # Theme state + persistence
│   ├── useFavorites.ts          # Favorites + recently viewed
│   └── useKeyboardShortcuts.ts  # Keyboard navigation
├── contexts/
│   └── AuthContext.tsx           # (exists)
├── lib/
│   ├── api.ts                   # API client functions
│   ├── constants.ts             # Theme definitions, section config
│   └── utils.ts                 # Shared helpers (cn, formatDate, etc.)
└── types/
    └── index.ts                 # Prompt, User, Theme types
```

### 4.2 API Client Layer
**Problem:** API calls are inline in components with `fetch()`. No shared error handling or response typing.
**Fix:** Create `src/lib/api.ts` with typed functions:

```typescript
export const api = {
  prompts: {
    list: (library: 'public' | 'my') => fetchJSON<Prompt[]>(`/api/prompts?library=${library}`),
    get: (id: string) => fetchJSON<Prompt>(`/api/prompts/${id}`),
    create: (data: CreatePromptInput) => fetchJSON<Prompt>('/api/prompts', { method: 'POST', body: data }),
    update: (id: string, data: UpdatePromptInput) => fetchJSON<Prompt>(`/api/prompts/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetchJSON<void>(`/api/prompts/${id}`, { method: 'DELETE' }),
    copyToLibrary: (id: string) => fetchJSON<Prompt>(`/api/prompts/${id}/copy-to-my-prompts`, { method: 'POST' }),
  },
  auth: { ... }
}
```

### 4.3 Server-Side Improvements
- **Rate limiting** — add `express-rate-limit` on auth endpoints (prevent brute force)
- **Input sanitization** — validate/sanitize markdown content to prevent stored XSS
- **Session cleanup** — add a cron job or startup task to delete expired sessions
- **Request logging** — add structured logging (currently no request logging in production)
- **CORS configuration** — explicitly set allowed origins instead of relying on defaults

### 4.4 Type Safety
- **Shared types** — the `Prompt` interface is defined in `App.tsx`. Move to `src/types/index.ts` and share between frontend and server (via a shared package or copy).
- **API response types** — type the API responses end-to-end
- **Database queries** — consider Drizzle or Prisma instead of raw SQL strings in `db/postgres.ts` for type-safe queries

---

## 5. Feature Enhancements

### 5.1 Prompt Versioning
- Track edit history for personal prompts
- "View history" button showing diffs between versions
- "Restore previous version" action
- Store as a `prompt_versions` table with `prompt_id`, `version`, `content`, `created_at`

### 5.2 Collections / Folders
- Let users organize prompts into custom collections beyond section/category
- Drag-and-drop prompts into collections
- Share collections via link (read-only public URL)
- Pre-built collections: "Getting Started", "For Developers", "For Writers"

### 5.3 Prompt Variables / Templates
- Detect `[placeholder]` patterns in prompts
- Generate a fill-in form when user clicks "Use this prompt"
- Save filled-in versions as new personal prompts
- Variable presets (save common values like `[App Name] = "My App"`)

### 5.4 Import / Export
- **Import:** Paste raw markdown, upload `.md` files, import from URL, bulk import from ZIP
- **Export:** Download as `.md`, export collection as ZIP, export to clipboard with formatting
- **Sync:** Two-way sync with a GitHub repo (personal prompt backup)

### 5.5 Social Features
- **Public profiles** — users can publish selected prompts from My Library
- **Upvotes / Stars** — community rating on public prompts
- **Comments** — discussion on public prompts (tips, variations, use cases)
- **"Remix"** — fork a public prompt, modify it, publish your version with attribution

### 5.6 Prompt Testing Playground
- Split-pane view: prompt on left, AI response on right
- Model selector (Claude, GPT-4, Gemini, Ollama)
- Variable filling form
- Response history
- A/B test two prompt variants side-by-side

### 5.7 Analytics (My Library)
- Most used prompts (track copies/views)
- Tag cloud visualization
- Prompt creation over time chart
- Category distribution pie chart

### 5.8 Keyboard Shortcuts
- `/` to focus search
- `Esc` to close detail view / clear search
- `j`/`k` to navigate cards
- `Enter` to open selected card
- `c` to copy prompt content
- `n` to create new prompt
- `t` to toggle theme
- `1-5` to switch sections

---

## 6. Performance & Infrastructure

### 6.1 Data Loading
- **Current:** All prompts loaded at once per section (potentially 465+ items)
- **Improvement:** Add pagination or virtual scrolling for large sections
- **API:** Add `?page=1&limit=50` support to `GET /api/prompts`
- **Frontend:** Use `react-window` or `@tanstack/virtual` for virtualized grid rendering

### 6.2 Caching
- **Browser:** Cache public library responses with `Cache-Control` headers (prompts don't change frequently)
- **Server:** Add in-memory cache (or Redis) for public prompt listings
- **Service Worker:** Add offline support for previously viewed prompts
- **SWR/React Query:** Replace manual `fetch` + `useState` with TanStack Query for automatic caching, deduplication, and revalidation

### 6.3 Bundle Optimization
- **Code splitting** — lazy load the editor modal, auth modals, and detail view
- **Tree shaking** — verify Lucide icons are tree-shaken (import individual icons, not the full package)
- **Font loading** — use `font-display: swap` for Outfit, DM Sans, JetBrains Mono (prevent FOIT)

### 6.4 Database
- **Connection pooling** — already using Neon pool (max 10). Monitor and adjust under load.
- **Indexes** — existing indexes look good. Add a GIN index on `tags` if search-by-tag becomes a bottleneck.
- **Full-text search** — add PostgreSQL `tsvector` column for server-side full-text search instead of loading all prompts client-side for Fuse.js

### 6.5 Security Hardening
- **Rate limiting** on `/api/auth/login` and `/api/auth/signup` (prevent credential stuffing)
- **CSRF protection** — add CSRF tokens for state-changing requests
- **Content Security Policy** headers
- **Helmet.js** middleware for Express security headers
- **Input length limits** — cap prompt content size (prevent abuse)

---

## 7. Prioritized Roadmap

### Phase 1 — Quick Wins (1-2 days each)

| # | Item | Impact | Effort |
|---|---|---|---|
| 1 | Add loading skeleton | High | Low |
| 2 | Fix console debug noise | Medium | Low |
| 3 | Add search clear button | Medium | Low |
| 4 | Fix tablet header overflow | Medium | Low |
| 5 | Fix theme persistence race condition | Medium | Low |
| 6 | Add rate limiting to auth endpoints | High | Low |
| 7 | Add keyboard shortcut `/` for search | Medium | Low |
| 8 | Strip markdown from card preview text | Medium | Low |

### Phase 2 — Core Improvements (3-5 days each)

| # | Item | Impact | Effort |
|---|---|---|---|
| 9 | Break up App.tsx into components | High | Medium |
| 10 | Create API client layer (`src/lib/api.ts`) | High | Medium |
| 11 | Add TanStack Query for data fetching | High | Medium |
| 12 | Prompt variables / fill-in form | High | Medium |
| 13 | Import/export (markdown, ZIP) | Medium | Medium |
| 14 | Keyboard shortcuts system | Medium | Medium |
| 15 | Pagination / virtual scrolling | Medium | Medium |

### Phase 3 — AI Integrations (1-2 weeks each)

| # | Item | Impact | Effort |
|---|---|---|---|
| 16 | Claude API — "Improve this prompt" | High | Medium |
| 17 | MCP server for prompt library | High | High |
| 18 | Prompt testing playground | High | High |
| 19 | Ollama local testing support | Medium | Medium |
| 20 | Hugging Face dataset import | Medium | Medium |

### Phase 4 — Platform Features (2-4 weeks each)

| # | Item | Impact | Effort |
|---|---|---|---|
| 21 | Collections / folders | High | High |
| 22 | Prompt versioning | Medium | Medium |
| 23 | Social features (stars, comments) | Medium | High |
| 24 | GitHub bidirectional sync | Medium | High |
| 25 | Analytics dashboard | Low | Medium |
| 26 | n8n webhook integrations | Low | Medium |

---

*Analysis performed by Claude Code — Full-Stack Dev Agent*
