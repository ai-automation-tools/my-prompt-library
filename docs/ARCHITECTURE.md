# System Architecture

Technical architecture and design decisions for the Prompt Library application.

---

## Overview

The Prompt Library is a full-stack web application for managing and organizing prompt templates. It uses a **hybrid storage model**:

1. **Public Library** - Filesystem-based (Git version control)
2. **User Data** - PostgreSQL database (Neon)
3. **GitHub Mode** (optional) - API-based public library access

---

## Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Markdown** - Markdown rendering
- **Fuse.js** - Fuzzy search

### Backend
- **Express** - API server
- **Vercel Serverless Functions** - Production deployment
- **Node.js** - Runtime
- **TypeScript** - Type safety
- **PostgreSQL (Neon)** - User data and authentication

### External Services
- **Neon** - Serverless PostgreSQL database
- **GitHub API** - Remote storage (optional)
- **Vercel** - Hosting and deployment

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React UI   │  │ Fuse Search  │  │  MD Render   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (fetch)
┌────────────────────────▼────────────────────────────────────┐
│                      API Layer                              │
│              Express + Vercel Functions                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GET  /api/prompts          - List all prompts      │  │
│  │  POST /api/prompts          - Create new prompt     │  │
│  │  PUT  /api/prompts/:id      - Update prompt         │  │
│  │  DELETE /api/prompts/:id    - Delete prompt         │  │
│  │  POST /api/prompts/:id/copy - Copy to My_Prompts    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         │                                │
         ▼                                ▼
┌─────────────────┐          ┌──────────────────────┐
│  Local Storage  │          │   GitHub Storage     │
│   (filesystem)  │          │   (GitHub API)       │
│                 │          │                      │
│  prompts/       │          │  + Batching (50)     │
│  ├─ My_Prompts  │          │  + Cache (5min)      │
│  ├─ Collections │          │  + Rate Limiting     │
│  └─ ...         │          │                      │
└─────────────────┘          └──────────────────────┘
```

---

## Data Flow

### 1. List Prompts (`GET /api/prompts`)

```
User Request
    ↓
Frontend (React)
    ↓ fetch('/api/prompts')
API Layer
    ↓ Check feature flag (USE_GITHUB_MODE)
    ├─ false → Filesystem Read
    │           ↓ fs.readdirSync()
    │           ↓ gray-matter.parse()
    │           ↓ Return JSON
    │
    └─ true → GitHub API
                ↓ Check cache
                ├─ HIT → Return cached
                └─ MISS → Fetch from GitHub
                           ↓ Get branch SHA
                           ↓ Get file tree
                           ↓ Batch fetch blobs (50 at a time)
                           ↓ Parse frontmatter
                           ↓ Cache results (5min TTL)
                           ↓ Return JSON
```

### 2. Create Prompt (`POST /api/prompts`)

```
User Input (form)
    ↓
Frontend
    ↓ fetch('/api/prompts', { method: 'POST', body: {...} })
API Layer
    ↓ Validate input
    ↓ Generate safe filename
    ├─ Local Mode → fs.writeFileSync()
    └─ GitHub Mode → GitHub API PUT (create file)
    ↓ Return success
Frontend
    ↓ Refresh prompts list
```

### 3. Copy to My_Prompts (`POST /api/prompts/:id/copy-to-my-prompts`)

```
User clicks "Add to My Prompts"
    ↓
Frontend
    ↓ fetch('/api/prompts/:id/copy-to-my-prompts', { method: 'POST' })
API Layer
    ↓ Validate source section (Collections/System_Prompts/Agent_Guides)
    ↓ Check destination doesn't exist
    ├─ Local Mode → fs.copyFileSync()
    └─ GitHub Mode → GitHub API (read + write)
    ↓ Return success
Frontend
    ↓ Show success toast
    ↓ Refresh prompts list
```

---

## File Structure

```
my-prompt-library/
├── api/
│   └── index.ts              # Express API routes + Vercel handler
├── src/
│   ├── components/           # React components
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── prompts/                  # Local prompt storage
│   ├── My_Prompts/          # User's personal prompts
│   ├── Collections/         # Curated collections
│   ├── System_Prompts/      # System prompts
│   └── Agent_Guides/        # Agent configuration
├── docs/                     # Documentation
│   ├── README.md            # Documentation index
│   ├── SETUP.md             # Setup guide
│   ├── QUICK_REFERENCE.md   # Quick toggle guide
│   ├── GITHUB_MODE.md       # GitHub integration details
│   └── ARCHITECTURE.md      # This file
├── .env                      # Local config (not committed)
├── .env.example             # Config template
├── package.json             # Dependencies
├── vercel.json              # Vercel config
├── vite.config.ts           # Vite config
└── tsconfig.json            # TypeScript config
```

---

## Component Architecture

### Frontend Components

```
App.tsx
├── Header
│   ├── Logo
│   ├── SearchBar (Fuse.js)
│   └── ViewToggle (Grid/List)
├── Sidebar
│   ├── SectionFilter
│   ├── CategoryFilter
│   └── TagFilter
├── PromptList
│   ├── PromptCard
│   │   ├── Title
│   │   ├── Tags
│   │   ├── Preview
│   │   └── Actions
│   │       ├── View
│   │       ├── Edit
│   │       ├── Delete
│   │       └── Copy
│   └── EmptyState
└── PromptModal
    ├── MarkdownRenderer
    ├── Metadata
    └── ActionButtons
```

---

## Design Decisions

### 1. **Dual Storage Modes**

**Rationale:**
- Local mode needed for development (fast, no API limits)
- GitHub mode needed for production (centralized, version control)

**Trade-offs:**
- More complexity in API layer
- Need to test both code paths
- **Benefit:** Flexibility and better DX

### 2. **Batching GitHub API Calls**

**Problem:** 666 prompts → 666 concurrent API calls → EMFILE error

**Solution:** Batch processing (50 at a time)

**Alternative considered:**
- GraphQL API (single query) - More complex, GitHub GraphQL learning curve
- Git clone on deployment - Requires writable filesystem (not available on Vercel)

**Why batching won:**
- Simple implementation
- Works with REST API
- Provides progress logging
- Easy to tune (batch size, delays)

### 3. **In-Memory Caching**

**Why in-memory?**
- Simple to implement
- No dependencies
- Fast access
- Auto-invalidates on server restart

**Alternative considered:**
- Redis/Memcached - Overkill for read-heavy use case
- Filesystem cache - Vercel has ephemeral filesystem
- LocalStorage - Client-side only, doesn't reduce API calls

**Why 5-minute TTL?**
- Balances freshness vs API usage
- Most users refresh within 5 minutes
- Long enough to prevent rate limit issues
- Short enough to see recent changes

### 4. **Feature Flag Pattern**

**Why feature flag?**
- Easy to toggle modes
- Safe default (local mode)
- No code changes needed to switch
- Can be environment-specific

**Implementation:**
```typescript
const USE_GITHUB_MODE = process.env.USE_GITHUB_MODE === 'true';
```

**Benefits:**
- Explicit opt-in (secure by default)
- Boolean check is fast
- Works across all environments

---

## Performance Considerations

### Bottlenecks

1. **GitHub API latency** (~100-200ms per request)
   - Mitigated by: Batching, caching
   
2. **Large file parsing** (gray-matter)
   - Mitigated by: Lazy loading, pagination (future)

3. **Frontend rendering** (666 cards)
   - Mitigated by: Virtualization (future), search filtering

### Optimization Strategies

| Layer | Strategy | Impact |
|-------|----------|--------|
| API | Batching | -95% concurrent requests |
| API | Caching | -99% repeat API calls |
| API | Delays | Prevents rate limiting |
| Frontend | Fuse.js | Fast search without server round-trip |
| Frontend | Lazy render | (Future) Only render visible cards |

---

## Security Considerations

### Environment Variables

**Sensitive data:**
- `GITHUB_TOKEN` - Must be encrypted in Vercel

**Public data:**
- `GITHUB_OWNER`, `GITHUB_REPO` - Safe to expose (public repo)

### API Security

**Current:**
- Read-only GitHub token (no write permissions needed for read operations)
- No authentication on API endpoints (public read)

**Future considerations:**
- Add authentication for write operations
- Rate limiting per IP/user
- CSRF protection for mutations

### File Path Validation

```typescript
const resolvePromptPath = (promptId: string) => {
  // Normalize path separators
  const normalizedId = promptId.replace(/\\/g, '/');
  
  // Validate .md extension
  if (!normalizedId.endsWith('.md')) {
    throw new Error('Invalid prompt path');
  }
  
  // Prevent directory traversal
  const absolutePath = path.resolve(promptsRoot, normalizedId);
  if (!absolutePath.startsWith(promptsRoot)) {
    throw new Error('Invalid prompt path');
  }
  
  return absolutePath;
};
```

**Prevents:**
- Directory traversal (`../../etc/passwd`)
- Non-markdown files
- Access outside `prompts/` directory

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────┐
│          Vercel Edge CDN            │
│     (Static assets + caching)       │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│      Vercel Serverless Functions    │
│                                     │
│  /api/prompts → api/index.ts        │
│                                     │
│  Cold start: ~300ms                 │
│  Warm: ~50ms                        │
└─────────────┬───────────────────────┘
              │
              ▼
     GitHub API (if USE_GITHUB_MODE=true)
```

### Environment Configuration

| Environment | USE_GITHUB_MODE | Storage |
|-------------|----------------|---------|
| Local Dev | false | Filesystem |
| Vercel Preview | true | GitHub API |
| Vercel Production | true | GitHub API |

---

## Error Handling Strategy

### API Layer

```typescript
try {
  // Operation
} catch (error) {
  console.error("Error reading prompts:", error);
  console.error("Error stack:", error?.stack);
  // Return empty array instead of 500 to prevent UI break
  res.json([]);
}
```

**Rationale:**
- UI should never crash on API errors
- Empty array allows UI to show "No prompts" state
- Errors logged for debugging
- User sees graceful degradation

### Frontend Error Handling

- **Network errors:** Show retry button
- **Parse errors:** Show error message, don't break app
- **Empty state:** Show helpful message ("No prompts found")

---

## Testing Strategy

### Manual Testing

- ✅ Local mode - filesystem read/write
- ✅ GitHub mode - API fetch with batching
- ✅ Cache hit/miss behavior
- ✅ Rate limit handling
- ✅ Error states

### Future Testing

- [ ] Unit tests for API endpoints
- [ ] Integration tests for GitHub API calls
- [ ] E2E tests for UI workflows
- [ ] Performance benchmarks

---

## Future Improvements

### Short Term
- [ ] Pagination for large libraries (>1000 prompts)
- [ ] Virtual scrolling for performance
- [ ] Markdown preview in grid view
- [ ] Export/import functionality

### Medium Term
- [ ] User authentication
- [ ] Multi-user support
- [ ] Prompt versioning
- [ ] Collaborative editing

### Long Term
- [ ] AI-powered prompt suggestions
- [ ] Prompt templates with variables
- [ ] Analytics dashboard
- [ ] REST API for third-party integrations

---

## References

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [GitHub REST API](https://docs.github.com/en/rest)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Last Updated:** March 14, 2026  
**Version:** 1.0.0
