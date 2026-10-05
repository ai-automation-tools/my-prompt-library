# Security Policy

## Reporting a vulnerability

Please do not open a public issue for security problems.

Use GitHub's private reporting instead: **Security → Report a vulnerability** on this
repository. That opens a private advisory only the maintainer can see. If that option is
unavailable to you, email the address listed under *Support* in the README with
`[security]` in the subject.

Include what you found, how to reproduce it, and what you think the impact is. You will get
an acknowledgement within a few days. Fixes ship as ordinary commits to `main`, which
deploys to `prompts.mikesailab.com`, and are noted in `docs/CHANGELOG.md`.

## Scope

In scope:

- The application under `site/` (`api/`, `routes/`, `middleware/`, `db/`, `src/`) and its
  deployment at `prompts.mikesailab.com`.
- Anything that exposes another user's My Library content, session, or account.
- Path traversal, injection, or auth bypass in the API.
- Secrets or personal data committed to the repository.

Out of scope:

- The content of prompts and skills under `site/library/`. They are text. If a vendored
  skill ships sample code with a vulnerability, report it upstream (see the `upstream:`
  block in its frontmatter) and open a normal issue here so we can resync.
- Rate-limit bypass by spreading requests across many IPs. The limiter is per-instance and
  documented as such in `site/middleware/rate-limit.ts`.
- Denial of service against the public Vercel deployment.

## What is already in place

- Passwords are bcrypt-hashed. Sessions are random 256-bit tokens in `httpOnly`,
  `sameSite=lax` cookies, `secure` in production, 30-day expiry.
- All SQL is parameterized (`site/db/postgres.ts`).
- Login and signup are rate-limited per IP; signup validates email shape and enforces an
  8-character minimum.
- `helmet` sets the standard response headers. CSP is intentionally off (see the comment
  in `site/api/index.ts`).
- Skill-pack and prompt file reads are confined to the library root (`site/lib/safe-path.ts`).
- Dependabot watches `site/` and CI fails on a stale prompt index or a type error.

## Supported versions

Only `main` is supported. There are no tagged releases.
