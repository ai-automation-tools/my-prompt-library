# GitHub Mode Documentation

Technical documentation for GitHub API integration.

---

## Overview

GitHub Mode allows the Prompt Library to fetch prompts directly from a GitHub repository instead of the local filesystem. This enables:

- Centralized prompt storage
- Version control via Git
- Cross-device synchronization
- Easy deployment to Vercel

---

## How It Works

### 1. **Feature Flag Check**

```typescript
const USE_GITHUB_MODE = process.env.USE_GITHUB_MODE === 'true';
const isGitHubConfigured = () => USE_GITHUB_MODE && !!(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);
```

GitHub mode is **disabled by default** and requires explicit opt-in.

### 2. **API Call Flow**

When a user requests `/api/prompts`:

```
1. Check cache (5-minute TTL)
   ↓ (if cache miss)
2. Fetch branch SHA from GitHub API
   ↓
3. Get file tree recursively
   ↓
4. Filter for .md files in prompts/
   ↓
5. Batch fetch file contents (50 at a time)
   ↓
6. Parse frontmatter and content
   ↓
7. Cache results
   ↓
8. Return JSON response
```

### 3. **Batching Implementation**

```typescript
async function batchProcess<T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  batchSize = 50,
  delayMs = 100
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processFn));
    results.push(...batchResults);
    
    // Delay between batches to avoid rate limits
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  return results;
}
```

**Why batching?**
- Prevents file descriptor exhaustion (EMFILE error)
- Reduces GitHub API rate limit strain
- Allows for progress logging

### 4. **Caching Strategy**

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
```

**Benefits:**
- Reduces API calls on page refreshes
- Prevents hitting rate limits during development
- Faster subsequent loads

**Cache invalidation:**
- Automatic after 5 minutes
- Manual via server restart

---

## Configuration

### Required Environment Variables

```bash
USE_GITHUB_MODE=true                    # Enable GitHub mode
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx   # Personal Access Token
GITHUB_OWNER=michaelschecht             # Repository owner
GITHUB_REPO=my-prompt-library          # Repository name
GITHUB_BRANCH=mike_desktop             # Branch to fetch from (default: mike_desktop)
```

### GitHub Personal Access Token

**Scopes required:**
- `repo` - Full control of private repositories

**Create token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select `repo` scope
4. Copy the token (starts with `ghp_`)

---

## API Endpoints Used

### 1. Get Branch SHA
```
GET /repos/{owner}/{repo}/git/ref/heads/{branch}
```

### 2. Get File Tree
```
GET /repos/{owner}/{repo}/git/trees/{sha}?recursive=1
```

### 3. Get Blob Content
```
GET /repos/{owner}/{repo}/git/blobs/{sha}
```

---

## Rate Limits

### GitHub API Limits

| Authentication | Requests/Hour |
|----------------|---------------|
| Unauthenticated | 60 |
| Authenticated | 5,000 |

### Our Mitigation Strategies

1. **Batching:** Max 50 concurrent requests
2. **Caching:** 5-minute TTL reduces repeat calls
3. **Delays:** 100ms between batches
4. **Feature Flag:** Easy switch to local mode

### Example Load

For a library with **666 prompts**:

**Without optimizations:**
- 666 concurrent API calls
- EMFILE error (too many file descriptors)
- Rate limit exhaustion

**With optimizations:**
- ~14 batches (50 × 13 + 16)
- Total time: ~1.4 seconds
- Subsequent loads: 0 API calls (cached)

---

## Error Handling

### Rate Limit Exceeded (403)

```json
{
  "message": "API rate limit exceeded for user ID...",
  "status": "403"
}
```

**Solution:**
1. Switch to local mode: `USE_GITHUB_MODE=false`
2. Wait ~1 hour for reset
3. Cache will prevent future exhaustion

### Invalid Token (401)

**Solution:**
1. Regenerate GitHub token
2. Update `GITHUB_TOKEN` in `.env`
3. Restart server

### Branch Not Found (404)

**Solution:**
1. Verify `GITHUB_BRANCH` exists
2. Check repository access permissions

---

## Performance Comparison

### Local Mode
- **First load:** ~50ms (filesystem read)
- **Cached load:** ~50ms (no cache)
- **API calls:** 0

### GitHub Mode
- **First load:** ~2-3 seconds (API fetch + batch processing)
- **Cached load:** ~10ms (in-memory cache)
- **API calls:** 668 (1 branch + 1 tree + 666 blobs)

**Recommendation:** Use local mode for development, GitHub mode for production.

---

## Security Considerations

### Token Storage

⚠️ **Never commit `.env` to Git**

```gitignore
# .gitignore
.env*
!.env.example
```

### Vercel Environment Variables

Set in Vercel dashboard:
- Project Settings → Environment Variables
- Add `GITHUB_TOKEN` as **encrypted**

### API Permissions

Token only needs `repo` scope:
- ✅ Read repository contents
- ❌ No write access needed (for read-only mode)
- ❌ No admin permissions

---

## Troubleshooting

### Prompts Not Loading in GitHub Mode

**Debug checklist:**
1. Check console logs for error messages
2. Verify `USE_GITHUB_MODE=true`
3. Confirm `GITHUB_TOKEN` is valid
4. Test token manually:
   ```bash
   curl -H "Authorization: Bearer $GITHUB_TOKEN" \
     https://api.github.com/repos/{owner}/{repo}
   ```
5. Check rate limit status:
   ```bash
   curl -H "Authorization: Bearer $GITHUB_TOKEN" \
     https://api.github.com/rate_limit
   ```

### Slow Performance

**Solutions:**
1. Increase `batchSize` (default: 50)
2. Reduce `delayMs` (default: 100ms)
3. Increase cache TTL (default: 5 minutes)
4. Use local mode for development

---

## Future Enhancements

### Potential Improvements

- [ ] **Incremental Updates:** Only fetch changed files
- [ ] **Persistent Cache:** Save to disk for cross-restart persistence
- [ ] **Webhook Integration:** Auto-refresh on Git push
- [ ] **GraphQL API:** Reduce API calls with single query
- [ ] **Streaming Responses:** Start rendering before all files loaded

### Alternative Approaches

1. **Git Clone:** Clone repo on deployment, read filesystem
2. **GitHub Content API:** Direct file fetching (simpler but less efficient)
3. **GitHub GraphQL:** Single query for all files

---

## References

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub Rate Limiting Guide](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

**Last Updated:** March 14, 2026
