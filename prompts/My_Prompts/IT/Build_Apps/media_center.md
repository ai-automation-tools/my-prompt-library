---
title: "Private Media Server – Site Builder Agent Prompt"
tags: ["it", "build-apps", "media", "center"]
category: "IT"
subcategory: "Build_Apps"
---
# Private Media Server – Site Builder Agent Prompt

You are a full-stack site builder. Build me a **private, self-hosted media library web app** (UI + authentication + deployment) for streaming/playing media I already own. The result must be **sleek, modern, and clean**, optimized for **large cover art** per movie and TV show.

---

## 1. Goals

- A **protected URL** (login required) that I can share with friends/family  
- Users authenticate with **credentials I create**
- A **Netflix-style browsing experience**
- Separate **Movies** and **TV Shows**
- I already have all media files (video, artwork, subtitles)

---

## 2. Tech & Hosting (choose defaults if not specified)

Make sensible choices and implement them fully.

**Preferred stack (or justify alternatives):**
- Frontend: React / Next.js
- Backend: Node.js (Express or Next.js API routes)
- Database: SQLite (default) or Postgres
- Authentication:
  - Secure login
  - Password hashing (bcrypt or argon2)
  - Sessions (cookies) or JWT
  - Rate-limited login
- Deployment:
  - Docker + Docker Compose
  - Reverse proxy (Caddy or Nginx)
  - HTTPS with Let’s Encrypt
- Storage:
  - Media files mounted read-only from host filesystem

If an existing open-source foundation is appropriate, you may propose it — but still deliver a **custom UI** matching the design requirements.

---

## 3. Core Features (Required)

### Authentication & Access
- Login + logout
- Admin user creation (UI or CLI)
- Session persistence
- Public URL, but **all content requires authentication**
- Security best practices:
  - Password hashing
  - CSRF protection (if cookie-based)
  - Secure headers
  - Login rate limiting

---

### Library Browsing UI
- Home dashboard sections:
  - Continue Watching
  - Recently Added
  - Movies
  - TV Shows
  - Genres / Collections (if metadata exists)
- Poster grid:
  - Large covers (poster aspect ratio)
  - Hover effects with title, year, play button
- Detail pages:
  - Poster + cinematic backdrop hero
  - Title, year, runtime, synopsis, genres
  - Cast info (if metadata available)
- TV Shows:
  - Seasons → episode lists
  - Episode thumbnails
- Instant search
- Filters (type, genre, year)

---

### Playback
- In-browser video playback
- Clean modern player UI
- Subtitle support (.srt / .vtt)
- If transcoding is required:
  - Propose the simplest, safest approach
  - Prefer direct play where possible

---

### Metadata & Artwork
- Either:
  - Allow user-provided metadata, OR
  - Auto-fetch metadata (TMDB or equivalent)
- If auto-fetching:
  - Cache locally
  - Do not refetch on every request
- Posters and backdrops stored locally

---

## 4. Media Ingestion

### Folder Structure (example)
/media
/movies
/Movie Name (2020)
Movie Name (2020).mp4
poster.jpg
subtitles.srt
/tv
/Show Name
/Season 01
Episode 01.mp4


### Scanner Requirements
- Index mounted media folders
- Extract metadata from filenames
- Match artwork and subtitles
- Persist results to database
- Re-scan on demand

---

## 5. Visual Design Requirements

- Style: **Sleek, modern, clean**
- Dark theme default
- Large posters dominate layout
- Smooth hover animations
- Rounded corners, subtle shadows
- Cinematic detail pages with backdrop blur/gradient
- Responsive grid (desktop, tablet, mobile)
- Define a small design system:
  - Colors
  - Spacing
  - Typography
  - Components

---

## 6. Deliverables

You must provide:

1. Complete working codebase
2. Docker Compose setup
3. Reverse proxy + HTTPS configuration
4. README including:
   - Setup instructions
   - Media folder mounting
   - User/admin creation
   - Library scan/import
   - Updating & rebuilding
   - Security notes
5. Configuration via environment variables

---

## 7. Defaults (Do Not Block)

If not explicitly provided, choose safe defaults for:
- Domain / hostname
- Database
- Authentication method
- Metadata strategy

Proceed without asking clarification unless absolutely required.

---

## 8. Acceptance Criteria

- Deployable on a VPS with HTTPS
- Login required before accessing content
- Beautiful poster-based UI
- Secure user management
- Playback works reliably
- Persistent data after restarts

---

## Instructions

Start by proposing the architecture.  
Then generate the project with all required files and step-by-step run instructions.
