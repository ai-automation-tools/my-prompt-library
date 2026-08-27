import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { app } from "./api/index.js";
import skillPacksHandler from "./api/skill-packs.js";
import type { VercelRequest, VercelResponse } from "./lib/vercel-types.js";
import { initializeSchema } from "./db/postgres.js";

/**
 * Local dev server.
 *
 * This file owns exactly one thing production does not have: Vite's HMR
 * middleware. Every API route comes from the same `api/` handlers Vercel runs,
 * mounted on the same Express app — so dev and prod cannot drift apart again.
 *
 * They had. This file used to carry its own copy of all seven prompt routes,
 * and the copy was the older, buggier one: no `lightweight` support (15.5 MB
 * per page load against prod's 1.06 MB), no `GET /api/prompts/:id` at all (it
 * fell through to Vite and returned the SPA's HTML), a GitHub-mode branch still
 * filtering on the `prompts/` folder that was renamed to `library/`, and a
 * `path.sep` split on a forward-slashed id that mis-parsed every section on
 * Windows.
 */
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3010;

async function startServer() {
  // Vercel routes /api/skill-packs/* to its own serverless function
  // (see vercel.json), so api/index.ts does not mount it. Dev is one process,
  // so mount it here — onto the imported app, which already has express.json()
  // and cookieParser() registered. The handler routes on the absolute
  // `req.url`, so it must be matched by pattern rather than `app.use(prefix)`,
  // which would strip the prefix it matches against.
  app.all(/^\/api\/skill-packs(\/|$)/, (req, res) =>
    skillPacksHandler(req as unknown as VercelRequest, res as unknown as VercelResponse),
  );

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // A missing or unreachable DATABASE_URL must not stop the server — the
  // read-only Public Library works without it; only auth and My Library break.
  try {
    await initializeSchema();
  } catch (err) {
    console.warn(
      "[DB] Schema init failed — starting without a database. " +
        "Public Library is read-only; auth and My Library will not work. " +
        "Set DATABASE_URL in site/.env to enable them.",
    );
    console.warn("[DB]", err instanceof Error ? err.message : err);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
