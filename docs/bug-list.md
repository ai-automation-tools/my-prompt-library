# My Prompt Library — Bug List

_Last updated: 2026-03-18 11:22 PDT_

---

## 🔴 Critical Bugs (Blocking UX)

### 1) Loading State — No Skeleton/Spinner
- **Issue:** Page briefly shows "0 prompts" before async data loads, causing a flash of empty content
- **Root Cause:** No loading state between initial render and `/api/prompts` response
- **Expected behavior:** Show loading skeleton grid (pulsing card placeholders) while data loads
- **Impact:** Confusing UX, looks like an error on slow connections
- **Platform:** Web, Mobile
- **Priority:** 🔴 Critical
- **Effort:** Low (1-2 hours)
- **Fix:** Add `loading` state flag and render skeleton cards

### 2) Tablet Header Overflow (768px)
- **Issue:** Login/Sign Up buttons are partially cut off at the right edge at tablet widths
- **Root Cause:** Header nav items don't collapse at tablet breakpoint
- **Expected behavior:** Collapse header nav into hamburger menu at `md` breakpoint, move auth buttons inside mobile menu or stack below nav
- **Impact:** Unusable auth buttons on tablets
- **Platform:** Tablet (768px-1024px)
- **Priority:** 🔴 Critical
- **Effort:** Medium (3-4 hours)

---

## ⚠️ High Priority Bugs

### 3) Console Debug Noise
- **Issue:** Dozens of `DEBUG:` log statements in `App.tsx` (lines 197-287) clutter the console. Also, `/api/auth/me` fires twice on load (React double-render in StrictMode) returning 401 when not logged in.
- **Root Cause:** Debug logs not wrapped in dev-only checks, unnecessary API call without token
- **Expected behavior:** Clean console in production, skip auth check if no token present
- **Platform:** Web, Mobile
- **Priority:** ⚠️ High
- **Effort:** Low (1 hour)
- **Fix:**
  - Wrap debug logs in `if (import.meta.env.DEV)` or remove
  - Check `document.cookie` for auth_token before calling `/api/auth/me`
  - Or return 204 instead of 401 when no token present

### 4) Theme Persistence Race Condition
- **Issue:** Theme selection may not survive full page reload
- **Root Cause:** Theme read from localStorage after first paint causes flash of default theme
- **Expected behavior:** Theme applied before first paint (no flash)
- **Platform:** Web, Mobile
- **Priority:** ⚠️ High
- **Effort:** Low (2 hours)
- **Fix:** Read theme from localStorage synchronously before first paint (in `index.html` or blocking script)

---

## 🟡 Medium Priority Bugs

### 5) Search UX Gaps
- **Issue:** No clear/reset button on search input. Sidebar category counts don't update during search (still show section totals).
- **Expected behavior:** 
  - Clear button (`X`) inside search input when text present
  - Sidebar counts reflect filtered results during active search
  - "N results for 'query'" feedback text above grid
- **Platform:** Web, Mobile
- **Priority:** 🟡 Medium
- **Effort:** Medium (2-3 hours)

### 6) Card Preview Shows Raw Markdown
- **Issue:** Some cards show markdown syntax (e.g., `**bold**`, `[link]()`) in content preview
- **Root Cause:** Preview text not stripping markdown before truncation
- **Expected behavior:** Plain text preview with markdown syntax removed
- **Platform:** Web, Mobile
- **Priority:** 🟡 Medium
- **Effort:** Low (1 hour)

### 7) Sidebar State Not Persisted
- **Issue:** Expanded/collapsed categories reset on page refresh
- **Expected behavior:** Persist expanded state in localStorage
- **Platform:** Web, Mobile
- **Priority:** 🟡 Medium
- **Effort:** Low (1-2 hours)

---

## 🟢 Low Priority Bugs

### 8) Missing ARIA Labels
- **Issue:** Icon-only buttons (download, copy, save) lack ARIA labels
- **Impact:** Screen reader users can't identify button purpose
- **Platform:** Web, Mobile
- **Priority:** 🟢 Low (Accessibility)
- **Effort:** Low (1 hour)

### 9) No Focus Trap in Modals
- **Issue:** Tab key can navigate outside of Login/Signup/Editor modals
- **Expected behavior:** Focus should cycle within modal while open
- **Platform:** Web
- **Priority:** 🟢 Low (Accessibility)
- **Effort:** Low (2 hours)

---

## 📦 Resolved/Completed

### ✅ Back button from subcategory goes to broken state
- **Resolved:** 2026-03-17 20:05, commit e3fdcc0
- **Solution:** Updated `handleShowAllPrompts()` to clear both state variables and URL search params

### ✅ Skill titles showing generic names
- **Resolved:** 2026-03-16, commit bfc42c9

### ✅ Frontmatter displayed as text in prompt content
- **Resolved:** 2026-03-16, commit 5858e22

### ✅ Section switcher landing on last visited category
- **Resolved:** 2026-03-16, commit 6308185

### ✅ Long prompt titles causing button cutoff
- **Resolved:** 2026-03-16, commit 32d3df5

### ✅ Auth state caching before check completes
- **Resolved:** 2026-03-16, commit bb12815

### ✅ Prompt card action buttons get cut off
- **Resolved:** 2026-03-16

### ✅ Browser back button goes to home instead of previous page
- **Resolved:** 2026-03-16

### ✅ Mobile loads with sidebar open by default
- **Resolved:** Earlier (pre-2026-03-16)

### ✅ Refresh resets to home page instead of reloading current page
- **Resolved:** 2026-03-16

### ✅ In-view back button loses subcategory context
- **Resolved:** 2026-03-17 (part of commit e3fdcc0)

### ✅ Remove delete button from Public Library prompt actions
- **Resolved:** 2026-03-16

### ✅ Copy All button causing confusion
- **Resolved:** 2026-03-17, commit 753b139

### ✅ Sub-menu overlap in toolbar dropdowns
- **Resolved:** 2026-03-17, commit 86a2b7d

---

## Known Limitations (Not Bugs)

### SQLite → PostgreSQL Migration Complete
- **Status:** ✅ Completed (2026-03-16)
- **Notes:** Local dev and production both use Neon PostgreSQL
- **Old files:** Archived to `backup/db/`

### GitHub Mode Optional
- **Status:** Working as designed
- **Notes:** Local filesystem mode is default, GitHub API mode available for collaborative editing
- **Config:** `USE_GITHUB_MODE=false` (default)

---

## Potential Future Issues (Monitoring)

### 1) Mobile Touch Target Size
- **Description:** Some action buttons might be too small on mobile devices
- **Status:** Monitoring for user feedback
- **Potential fix:** Increase button padding on mobile, add touch ripple effect

### 2) Search Performance with Large Libraries
- **Description:** Search might slow down with 1000+ prompts in user library
- **Status:** Not observed yet, but worth monitoring
- **Potential fix:** Implement pagination, debounce search input, use database indexes

### 3) Session Cookie Expiry UX
- **Description:** Users might not notice when their session expires after 30 days
- **Status:** Working as designed, but could be improved
- **Potential fix:** Show "Session expiring soon" notification, auto-refresh on activity

### 4) Large Prompt Load Performance
- **Description:** Loading 465+ prompts at once (current max per section) could impact performance
- **Status:** Works fine currently, but may not scale past 1000+ prompts
- **Potential fix:** Add pagination or virtual scrolling

---

## Security Issues (From Analysis)

### 10) No Rate Limiting on Auth Endpoints
- **Issue:** `/api/auth/login` and `/api/auth/signup` have no rate limiting
- **Risk:** Vulnerable to brute force attacks and credential stuffing
- **Priority:** ⚠️ High (Security)
- **Effort:** Low (2-3 hours)
- **Fix:** Add `express-rate-limit` middleware

### 11) Missing Security Headers
- **Issue:** No CSP, Helmet.js, or security headers configured
- **Risk:** Vulnerable to XSS, clickjacking, MIME sniffing
- **Priority:** 🟡 Medium (Security)
- **Effort:** Low (2 hours)
- **Fix:** Add Helmet.js middleware, configure CSP headers

### 12) No Input Sanitization
- **Issue:** Markdown content not validated/sanitized
- **Risk:** Potential stored XSS if malicious markdown injected
- **Priority:** 🟡 Medium (Security)
- **Effort:** Medium (3-4 hours)
- **Fix:** Sanitize markdown input, validate content length limits

### 13) No CSRF Protection
- **Issue:** State-changing requests lack CSRF tokens
- **Risk:** Vulnerable to CSRF attacks
- **Priority:** 🟡 Medium (Security)
- **Effort:** Medium (4-5 hours)
- **Fix:** Add CSRF token middleware

---

## Bug Reporting Guidelines

When reporting bugs, please include:
1. **Steps to reproduce** (be specific about navigation path)
2. **Expected behavior** vs actual behavior
3. **Platform** (web/mobile, browser/device)
4. **Screenshots** (especially for UI bugs)
5. **URL** if applicable (for navigation bugs)
6. **Browser console errors** (if any)

**Submit bugs via:**
- GitHub Issues: https://github.com/michaelschecht/my-prompt-library/issues
- Email: mikeschecht@gmail.com

---

## Notes

- **Priority Levels:**
  - 🔴 **Critical:** Blocks core functionality
  - ⚠️ **High:** Impacts UX significantly
  - 🟡 **Medium:** Noticeable but has workarounds
  - 🟢 **Low:** Minor issues, edge cases

- **Status Tags:**
  - 🔴 Active
  - ⚠️ In Progress
  - ✅ Fixed
  - 📦 Resolved

- **Related Documents:**
  - Feature List: `/openclaw/feature-list.md`
  - Update Plan: `/openclaw/major-updates-plan.md`
  - Analysis Report: `/openclaw/app-analysis-3_18_26.md`

---

_9 new bugs identified from analysis (2026-03-18). Priority: Fix critical loading/tablet issues first._
