# Direction — what changed after the audit, and what the site becomes

**Written:** 2026-08-27 · Plain-language companion to [ROADMAP.md](ROADMAP.md).

This is not a task list. It explains **why the plan changed** after
[the 2026-08-26 audit](audits/REPO-AUDIT-2026-08-26.md), what the old plan assumed, what the
new one assumes, and what the site actually looks like once the roadmap is finished. For the
tasks themselves, read the roadmap. For what already shipped, read [CHANGELOG.md](CHANGELOG.md).

---

## The one-sentence version

The old plan treated this as **an app with a big content folder attached**, and measured
progress in lines of React removed and kilobytes of JavaScript shaved. The new plan treats it
as **a curated library that happens to have an app in front of it**, and measures progress in
content a user can actually reach, trust, and date.

---

## What the plan used to say

The roadmap as of 2026-08-22 — the last version before the audit — had four working parts:

1. **Shrink `App.tsx`.** It had gone 2,845 → 1,050 lines and the target was 600–800.
2. **Shrink the JavaScript bundle.** One 985 KB chunk, and Vite complained on every build.
3. **A few open questions.** Where the external-links menu belongs in the nav. Whether the
   `backup/` and `import/` folders were live or dead. What to do about `Legacy/`.
4. **Someday: more content.** Thin categories to fill, features to add — ratings, starter
   packs, a public API.

That plan was not wrong about anything it named. It was wrong about what it **didn't** name.
It had no opinion on where the content came from, whether it was current, whether a visitor
could open it, or whether anything stopped a bad commit from reaching production. The library
was treated as a solved input to a frontend problem.

---

## What the audit found instead

Three things, and none of them were in the frontend.

**The library had no memory of where it came from.** Roughly 3% of vendored files recorded
their origin. Everything else was a copy with no repo, no commit, no date. That makes one
question unanswerable: *is this still true?* When it was finally measured, six skills were
missing 77–91% of their upstream's current content — they had rotted quietly for months, and
nothing in the repo could have told you.

**Two real security bugs, reproduced not guessed.** A path traversal in the skill-download
endpoint that returned files from outside the library, and session tokens generated with
`Math.random()` — which is predictable, so every login cookie ever minted was forgeable. Plus
22 npm advisories.

**Dev and production were two separate programs.** `server.ts` and `api/index.ts` were
hand-maintained implementations of the same API, ~2,000 duplicated lines, and they had drifted
apart: one route existed only in production, and the dev server shipped 15.5 MB per page load
against production's ~1 MB. Every "works locally" was a coin flip.

Underneath all three sat the same absence: **nothing gated a merge.** No tests, no CI, no
`.github/` directory at all.

---

## The five shifts

### 1. Provenance became the foundation, not a nice-to-have

**Before:** content was content. Where it came from wasn't tracked.

**Now:** every skill carries an `upstream:` block in its frontmatter — repo, path, commit sha,
fetch date, license. A weekly GitHub Action re-checks all of them against their publishers and
updates one rolling issue with what has drifted. `resync-upstream.mjs` pulls a single skill
back level when you decide it should be.

The important design choice here is what the tooling does when it *doesn't* know. It records
`ambiguous` (the same body exists in three or more mirrors, so no single origin is provable) or
`unknown` — rather than picking the most likely repo and presenting a guess as a fact. "We
looked and couldn't tell" and "nobody has checked" are different facts, and the file says which
one it is. Coverage is 31% with a real origin, and that number is honest.

The second choice: **the drift job never edits content.** It opens an issue and stops. The
audit's reasoning was that auto-merging upstream would reflow hundreds of files into the wrong
categories — and the categories *are* the product. A machine can tell you what moved; only you
can decide whether the local version is behind or deliberately different.

### 2. "How big is the library" became "how much of it can someone open"

**Before:** the headline number counted files in the repo.

**Now:** it counts prompts a visitor can reach. Those turned out to be very different numbers.

- `library/Legacy/` was 2,393 files and 37 MB — about half the deploy — that no reader indexed
  and no visitor could see. Deleted, but only after hashing every file against the live tree:
  1,956 were byte-identical duplicates, 404 were older revisions, and of the 33 that existed
  nowhere else, **14 were system prompts that got promoted into the live library** rather than
  thrown away.
- Two files in `2_Agents` were 5.8 MB and sat above the index builder's 500 KB ceiling — which
  meant they shipped on every deploy and were unsearchable, unlinkable, unopenable. They held
  **1,349 distinct prompts**. They are now 1,349 individual files.

Net effect: the library got **smaller on disk** (30.3 → 27.3 MB) while the reachable prompt
count nearly doubled (1,739 → 3,088). That trade only makes sense under the new metric.

### 3. A merge now has to earn its way in

**Before:** nothing was checked automatically.

**Now:** `.github/workflows/ci.yml` runs on every PR — typecheck, a test that pins the API
route table, and a rebuild of the prompt index that fails if the committed copy is stale.

Shipping that gate immediately exposed three bugs that only a Linux runner could see, all
invisible on Windows: CRLF line endings baked into the index's `contentPreview` field, one file
tracked under two different capitalizations of the same folder, and an index ordered by
whatever order the filesystem happened to return. That's the argument for CI in one story — the
gate found real corruption on day one. `.gitattributes` now forces LF repo-wide, and
"lowercase, case-unique paths" is a written rule because it already caused an outage-class
desync once.

### 4. One API, structurally

**Before:** two implementations, kept in sync by hand and memory.

**Now:** `server.ts` is a 71-line dev wrapper that imports the same Express app `api/index.ts`
exports and bolts Vite's hot reload onto it. ~880 duplicated lines deleted, the separate dev
skill-packs router gone.

The point isn't the deleted lines. It's that dev/prod divergence is now **structurally
impossible** rather than merely fixed — there is only one handler set to diverge from. All
three known parity bugs died with the duplication.

### 5. The performance problem moved, so the plan moved with it

**Before:** the JavaScript bundle was the enemy. 985 KB in one chunk.

**Now:** it isn't. Code-splitting turned one chunk into eight; first paint costs 200 KB gzipped
instead of 265, and React and `motion` sit in separate chunks that survive a content-only
deploy in the browser cache.

Which promoted a different bottleneck: the **listing payload** is now 311 KB gzipped, larger
than all the JavaScript combined. It grew because the library grew — 1,739 → 3,088 prompts — so
it's proportional, not a regression. But the fix is different in kind: server-side pagination,
or sending preview text only for the first page. The roadmap follows the actual biggest thing
on the page rather than the thing that used to be.

---

## What's actually left

**Do this one first — it's the only live risk.** The Neon database password was scrubbed out of
Git history but never rotated, and scrubbing isn't un-leaking. In the same session, run
`DELETE FROM user_sessions;` — every existing login cookie was minted by the old predictable
generator. Everyone gets logged out once, and that's the point.

**Local setup.** `site/.env` still has a placeholder `DATABASE_URL`, so auth and My Library
don't work on your machine. The site itself is fine; the dev server boots without it and serves
the read-only public library.

**52 skills have drifted from their upstreams.** This is a different job from the one already
finished. The `behind` tier — skills flatly missing content — is empty. What's left are *edits*:
the worst is 21% different, 43 of the 52 are under 5%, and 23 of those are one publisher's
`wealth-management` set. Sizes are comparable, so these are two versions of the same thing, not
a stale copy. Each one is a judgment call about whose version is better.

**A wording bug that reads like a problem.** Seven skills say `match: behind` in their
frontmatter. That field is the *attribution tool's* confidence, not the drift verdict — two
different systems using the same word. Re-run the attributor, or rename the value.

**One guide is a year out of date.** `1_Guides/API_Providers/openai_cli_guide.md` is built
around GPT-4o, with pricing, rate-limit and capability tables. The model-ID sweep deliberately
skipped it, because find-and-replace on a pricing table produces confident wrong numbers. It
needs rewriting by hand. Every other guide and agent file now names a current model.

**Two payload items.** Paginate the listing (the 311 KB above). And `motion` is 128 KB loading
before anything renders — cuttable, but it's imported in 10 files, so it's a refactor rather
than a config flag.

**Housekeeping.** Thirteen branches are fully merged and can go. Two need a decision instead:
`mike_desktop` is the working branch `CLAUDE.md` documents but is now identical to `main`
(resume the convention or drop it), and `main-backup-5_15_26` has outlived its reason. Also,
the committed prompt index makes `git status` noisy on every content change — either stop
committing it or add a pre-commit rebuild.

**Then the structural question nobody has answered yet:** *what is `2_Agents`?* 460 of its 546
files have no `name:` or `description:`, which means they cannot load as subagents. They are
role-play prompts filed under a name that implies they're installable. Either move them to
`4_Prompts` or rename the section "Agent Prompts". Splitting the two bulk files already applied
that exact argument to 1,349 files — this is the same decision at section scale.

**And the long tail:** raise attribution coverage past 31%, extend provenance to agents, prompts
and system prompts (the tooling is section-agnostic, it just hasn't been pointed at them),
resolve the remaining near-duplicates — including five C# agents with no stated difference
between them — and only then expand into the thin categories.

---

## What the site looks like when this is done

**Every item can answer "where did this come from, and when was it last checked."** Cards show a
real freshness date and a stale badge when appropriate. Today `lastModified` is the filesystem
timestamp, which means every prompt on the live site claims it changed on the last deploy — a
date that's technically present and completely meaningless. It gets replaced with the upstream
check date, which is a fact.

**Nothing ships that a visitor can't open.** No unreachable megabytes, no files above the index
ceiling, no sections that quietly drop content. What the count says is what you can click.

**Sections mean what their names say.** `2_Agents` either holds things that install as agents,
or it's called Agent Prompts. Duplicates are resolved by decision, not left as three copies of
one skill under three names.

**It's fast because of what it sends, not just what it bundles.** ~200 KB of JavaScript on first
paint, a paginated listing instead of the whole index, and React/motion cached across
content-only deploys.

**Maintenance is a triage loop, not a rewrite.** Monday morning: an issue tells you what
drifted; you decide per skill and run one script. Monthly: refresh system prompts as new
frontier models ship. Quarterly: re-check model IDs and rotate featured prompts. Nothing in that
loop requires remembering anything — the tooling asks the questions.

**Then the features land on a foundation that holds them.** Starter-pack collections, ratings,
and a public API are all still on the roadmap. They were on the old one too. The difference is
that a public API over a library with no provenance, no pagination and no CI gate would have
been a liability; over this one it's just an endpoint.

---

## What did *not* change

The stack is the same — React 19, Vite, Tailwind, Express on Vercel, Neon Postgres. The
two-library model (curated public library in Git, personal library in Postgres) is the same. The
category tree is the same, and defending it is why the sync tooling is advisory rather than
automatic.

The `App.tsx` de-bulk is still on the list too, just no longer at the top of it: 2,845 → 1,082
lines, with the routing state the last big block to lift out. That was the old plan's main
event. It's now correctly filed as maintainability work — worth doing, never the thing that was
actually wrong.
