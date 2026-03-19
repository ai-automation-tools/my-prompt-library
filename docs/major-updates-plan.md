# My Prompt Library — Major Functionality Update Plan

_Last updated: 2026-03-18 10:29 PDT_

## Status: ✅ COMPLETED (2026-03-16)

All phases complete. Public/My Library separation is live in production with PostgreSQL backend.

---

## Goal
Split the product into two library modes:
1. **Public Library** (read-only, shared catalog) ✅
2. **My Library** (user-owned prompts with full management actions) ✅

---

## Product Rules

### 1) Public Library (Read-Only) ✅ IMPLEMENTED
- Contains all prompts across five categories: Prompt Library, Agent Instructions, Agent Guides, System Prompts, Skills.
- Visible to all users (authenticated or not).
- Users **cannot edit or delete** prompts here.
- Prompt cards show:
  - **Add to My Library** button (FolderPlus icon)
  - **Copy** button (Copy icon)
  - **Download** button (Download icon) ✅ NEW
- Featured section appears at top of default landing pages (4 prompts with star badge).

### 2) My Library (User-Owned) ✅ IMPLEMENTED
- Contains only:
  - Prompts user created
  - Prompts user copied/saved from Public Library
- Full prompt actions enabled:
  - **Favorite** (Star icon)
  - **Edit** (Edit icon)
  - **Delete** (Trash icon)
  - **Copy** (Copy icon)
  - **Download** (Download icon) ✅ NEW
- Empty states guide new users:
  - "Sign In Required" → prompts to login/signup
  - "Your Library is Empty" → getting started guide

### 3) Library Switcher ✅ IMPLEMENTED
- Toggle in sidebar switches between Public/My Library
- Mode state persists via:
  - URL parameter (`?library=public|my`)
  - localStorage fallback
- Clear visual indication of active mode

---

## Implementation Status

### Phase 1 — Foundation ✅ COMPLETE
1. ✅ Added PostgreSQL database (Neon) with `user_prompts` table
2. ✅ User authentication with bcrypt password hashing
3. ✅ Session-based auth with 30-day cookie expiry
4. ✅ API permissions enforce ownership checks
5. ✅ Hybrid storage model:
   - Public Library: Files (`library/` directory, Git version control)
   - User Prompts: PostgreSQL (isolation, CRUD operations)

### Phase 2 — UI Mode Switching ✅ COMPLETE
1. ✅ Library mode toggle in sidebar (Public/My)
2. ✅ Global state management via URL + localStorage
3. ✅ Conditional rendering based on `libraryMode`
4. ✅ Auth context with `useAuth()` hook

### Phase 3 — Prompt Actions by Mode ✅ COMPLETE
1. ✅ Public mode:
   - Add to My Library button
   - Copy button
   - Download button (Markdown with frontmatter) ✅ NEW (2026-03-17)
   - No edit/delete
2. ✅ My Library mode:
   - Favorite button
   - Edit button (opens modal)
   - Delete button (with confirmation)
   - Copy button
   - Download button (Markdown with frontmatter) ✅ NEW (2026-03-17)
3. ✅ Action buttons moved to bottom-right corner (prevents cutoff with long titles)

### Phase 4 — Persistence + QA ✅ COMPLETE
1. ✅ Mode persists across refresh (URL + localStorage)
2. ✅ URL-based navigation with section/category/subcategory
3. ✅ Browser back/forward button support
4. ✅ Mobile responsive (sidebar collapses, touch-friendly buttons)
5. ✅ Featured prompts section (Public Library only)

### Phase 5 — Top Toolbar Redesign ✅ COMPLETE (2026-03-17)
1. ✅ Centered navigation dropdowns (CLI, Prompts, Skills, Tools, Agents)
2. ✅ Renamed "Libraries" → "Prompts" with 4 sub-menus:
   - System Prompts (5 links)
   - Prompt Libraries (4 links)
   - Agent Instructions (5 links)
   - Prompting Guides (2 links)
3. ✅ Added "Skills" dropdown (5 links)
4. ✅ Added "Tools" dropdown (3 links)
5. ✅ Light red logout button background
6. ✅ Split user button (username | logout)
7. ✅ Multi-level dropdown animations with Framer Motion
8. ✅ Sub-menu overlap prevention
9. ✅ ESC key and click-outside-to-close support

### Phase 6 — Download & Share ✅ COMPLETE (2026-03-17)
1. ✅ Download as Markdown (.md) with frontmatter
2. ✅ Download button on all prompt cards
3. ✅ Download button on featured prompts
4. ✅ Download button in prompt detail view
5. ✅ Share via Email (mailto: with pre-filled content)
6. ✅ Share button in prompt detail view
7. ✅ Proper frontmatter formatting (title, category, tags, etc.)
8. ✅ Auto-generated clean filenames
9. ✅ Toast notifications on download

---

## Technical Implementation Details

### Database Schema (PostgreSQL/Neon)
```sql
users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

user_prompts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  section TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT,  -- JSON array
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### API Endpoints
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `GET /api/prompts?library=public|my` - List prompts
- `POST /api/prompts` - Create prompt (auth required)
- `PUT /api/prompts/:id` - Update prompt (auth required)
- `DELETE /api/prompts/:id` - Delete prompt (auth required)
- `POST /api/prompts/:path/copy-to-my-prompts` - Copy public prompt to My Library

### Frontend Components
- `AuthContext` - Global auth state
- `LoginModal` - Email/password login with validation
- `SignupModal` - Registration with password strength indicator
- `EmptyState` - Two variants (not-authenticated, no-prompts)
- Conditional button rendering based on `libraryMode`

---

## Acceptance Criteria

### ✅ All Criteria Met

- ✅ Library mode switcher visible on web and mobile
- ✅ Public Library displays all five categories and is read-only
- ✅ Edit/Delete not available in Public Library cards
- ✅ My Library shows only user's own/copied prompts
- ✅ Edit/Delete available in My Library cards
- ✅ Library mode persists across navigation and refresh
- ✅ Backend rejects unauthorized edit/delete attempts
- ✅ Empty states guide new users appropriately
- ✅ Featured section appears in Public Library only
- ✅ URL-based navigation for deep linking
- ✅ Browser back button works correctly
- ✅ Top toolbar redesigned with centered navigation ✅ NEW
- ✅ Download/share functionality implemented ✅ NEW

---

## Open Questions (ALL RESOLVED)

### 1. Copy to My Library button?
**Resolution:** ✅ Yes, present on all Public Library prompts.

### 2. Empty-state guided for first-time users?
**Resolution:** ✅ Yes, two empty states:
- "Sign In Required" with login/signup buttons
- "Your Library is Empty" with getting started guide

### 3. URL encoding?
**Resolution:** ✅ Both URL (`?library=public|my`) and localStorage persistence.

### 4. Admin override permissions?
**Resolution:** ⏳ Deferred. Admin features not implemented yet. Public Library is file-based (Git), admins edit via Git commits.

### 5. Category order customizable?
**Resolution:** ⏳ Deferred. Both libraries use same category structure for now.

---

## Deployment Status

### Production (Vercel)
- ✅ Deployed at: https://my-prompt-library-azure.vercel.app
- ✅ Database: Neon PostgreSQL (East US 2)
- ✅ Environment variables configured
- ✅ Serverless functions working
- ✅ All features live and tested

### Local Development
- ✅ Works with same Neon database
- ✅ Hot reload via Vite
- ✅ TypeScript compilation working

---

## Next Steps (Post-Completion)

### Immediate Priorities (Critical UX Fixes)
1. ✅ Fix back button from subcategory to ALL view (Fixed 2026-03-17)
2. ✅ Top toolbar redesign (Complete 2026-03-17)
3. ✅ Download/Share functionality (Complete 2026-03-17)
4. 🔴 **Add loading skeleton** (no spinner on initial load - Bug #1)
5. 🔴 **Fix tablet header overflow** (auth buttons cut off at 768px - Bug #2)
6. ⚠️ **Clean up console debug noise** (Bug #3)
7. ⚠️ **Fix theme persistence race condition** (Bug #4)
8. Add profile editing modal
9. Add delete confirmation dialogs
10. Improve mobile touch targets

### Code Quality (Tech Debt)
1. **Component Architecture Refactor** (Feature #43)
   - Break up `App.tsx` (2,386 lines) into focused components
   - Extract hooks: `usePrompts`, `useTheme`, `useFavorites`, `useKeyboardShortcuts`
   - Create API client layer (`src/lib/api.ts`)
   - Shared TypeScript types in `src/types/`
   - **Blocker:** Should be done before adding major new features
   - **Effort:** 1-2 weeks

2. **TanStack Query Integration** (Feature #47)
   - Replace manual `fetch` + `useState`
   - Automatic caching, deduplication, revalidation
   - **Effort:** 3-5 days

3. **Security Hardening**
   - Rate limiting on auth endpoints (Bug #10)
   - Add Helmet.js security headers (Bug #11)
   - Input sanitization for markdown (Bug #12)
   - CSRF protection (Bug #13)
   - **Effort:** 1-2 days total

### AI Integrations (High Impact)
1. **Claude API - Prompt Enhancement** (Feature #44)
   - "Improve this prompt" button
   - "Generate from description"
   - "Explain this prompt"
   - Variable extraction
   - **Effort:** 3-5 days

2. **MCP Server Integration** (Feature #45)
   - Expose library as MCP server
   - Claude Code, Cursor, etc. can search/read prompts
   - **Effort:** 1-2 weeks

3. **Prompt Testing Playground** (Feature #46)
   - Test prompts with live AI responses
   - Multi-model support (Claude, GPT-4, Gemini, Ollama)
   - A/B testing
   - **Effort:** 1-2 weeks

### Future Enhancements (see feature-list.md)
- Google OAuth integration
- Password reset flow
- Prompt sharing between users
- Analytics dashboard
- Export to PDF/Notion/Obsidian
- Hugging Face dataset import/export
- NotebookLM integration
- Pagination / virtual scrolling
- Keyboard shortcuts system

---

## Documentation

**Complete docs available at:**
- `README.md` - Project overview and quick start
- `docs/SETUP.md` - Local development setup
- `docs/DEPLOYMENT.md` - Vercel deployment guide
- `docs/ARCHITECTURE.md` - System design and tech stack
- `docs/API.md` - REST API reference
- `docs/POSTGRES-MIGRATION-SUMMARY.md` - SQLite → Postgres migration notes

---

## Lessons Learned

### What Went Well ✅
- Hybrid storage model (files for public, DB for user data) works great
- PostgreSQL migration smoother than expected
- Vercel serverless functions performant
- React Context for auth state clean and maintainable
- Download/share features simple to implement and well-received

### Challenges 🤔
- Vercel serverless required restructuring from long-running Express server
- URL state management for navigation complex (back button behavior)
- gray-matter frontmatter parsing needed careful handling
- Auth state caching required explicit loading states
- Multi-level dropdown animations required careful z-index management

### Future Considerations 💡
- Consider Redis for session caching (Vercel edge caching)
- Evaluate Supabase for built-in auth + database
- Add end-to-end tests (Playwright)
- Implement proper logging (Sentry, LogRocket)
- Consider PDF export (next phase of download/share)

---

## Analysis Findings (2026-03-18)

### Code Review Summary
**Agent:** Claude Code (Full-Stack Dev)
**Scope:** Codebase review, live UI audit, AI integration opportunities
**Full Report:** `/openclaw/app-analysis-3_18_26.md`

### Key Metrics
- **Total public prompts:** 940
- **Sections:** 5 (Prompt Library, Agent Instructions, Agent Guides, System Prompts, Skills)
- **Categories:** 40+ across all sections
- **Themes:** 14 CSS-variable themes
- **Main component size:** `App.tsx` — 2,386 lines ⚠️
- **Database tables:** 3 (users, user_prompts, user_sessions)

### What's Working Well ✅
- Dual library model (Public + My Library) is clean and intuitive
- 940+ prompts well-organized with categories/subcategories
- 14 themes with instant switching
- Fuzzy search via Fuse.js works across title, content, tags, category
- Markdown rendering with GFM support
- Auth system is solid (bcrypt, httpOnly cookies, 30-day sessions)
- Responsive design (sidebar collapses on mobile)
- Copy-to-library flow is smooth
- Featured prompts section works well
- External resource dropdowns link to broader AI ecosystem

### Critical Issues Identified 🔴
1. **No loading state** → "0 prompts" flash before data loads (Bug #1)
2. **Tablet header overflow** → Auth buttons cut off at 768px (Bug #2)
3. **Console debug noise** → Dozens of DEBUG logs, double API calls (Bug #3)
4. **Theme persistence race** → Flash of default theme on reload (Bug #4)

### Architecture Recommendations
1. **Component refactor** → Break up 2,386-line `App.tsx` into focused components
2. **API client layer** → Replace inline `fetch()` with typed API client
3. **State management** → Consider TanStack Query for data fetching
4. **Type safety** → Share types between frontend and backend
5. **Security** → Add rate limiting, Helmet.js, input sanitization, CSRF tokens

### AI Integration Opportunities
1. **Claude API** → "Improve this prompt", generate from description, explain prompt
2. **MCP Server** → Expose library for Claude Code, Cursor, etc.
3. **Hugging Face** → Import/export prompt datasets
4. **NotebookLM** → Research and synthesis from prompt collections
5. **Canva** → Generate visual prompt cards
6. **Ollama** → Local LLM testing without API costs
7. **GitHub Sync** → Bidirectional sync (currently read-only)
8. **n8n** → Workflow automation (webhooks on prompt create/update)

### Performance Recommendations
1. **Pagination/Virtual Scrolling** → Current max 465 prompts per section, doesn't scale past 1000+
2. **Caching** → Cache public library responses with `Cache-Control` headers
3. **Code splitting** → Lazy load editor modal, auth modals, detail view
4. **Bundle optimization** → Verify Lucide icons are tree-shaken

### Prioritized Roadmap (From Analysis)

**Phase 1 — Quick Wins (1-2 days each)**
- Add loading skeleton
- Fix console debug noise
- Add search clear button
- Fix tablet header overflow
- Fix theme persistence
- Add rate limiting to auth endpoints
- Add keyboard shortcut `/` for search
- Strip markdown from card preview text

**Phase 2 — Core Improvements (3-5 days each)**
- Break up App.tsx into components
- Create API client layer
- Add TanStack Query
- Prompt variables / fill-in form
- Import/export (markdown, ZIP)
- Keyboard shortcuts system
- Pagination / virtual scrolling

**Phase 3 — AI Integrations (1-2 weeks each)**
- Claude API "Improve this prompt"
- MCP server for prompt library
- Prompt testing playground
- Ollama local testing support
- Hugging Face dataset import

**Phase 4 — Platform Features (2-4 weeks each)**
- Collections / folders
- Prompt versioning
- Social features (stars, comments)
- GitHub bidirectional sync
- Analytics dashboard
- n8n webhook integrations

---

_Status: Project Phase 1 complete. Analysis complete (2026-03-18). Next: Fix critical bugs, then component refactor._
