/**
 * The dev server and the Vercel function must expose the same API.
 *
 * They stopped doing that once: server.ts kept a hand-written copy of every
 * prompt route, and the copy quietly lost `lightweight`, never gained
 * `GET /api/prompts/:id`, and filtered the GitHub tree on a folder that had
 * been renamed. Both now serve the app exported from api/index.ts, so this
 * check just pins the route table — if a handler is dropped or renamed, this
 * fails before anyone notices in the browser.
 *
 * Run: npm run test:routes   (from site/)
 */
import assert from "node:assert/strict";
import { app } from "../api/index.ts";

const registered = new Set();
for (const layer of app._router.stack) {
  if (layer.route) {
    for (const method of Object.keys(layer.route.methods)) {
      registered.add(`${method.toUpperCase()} ${layer.route.path}`);
    }
  } else if (layer.regexp && layer.handle?.stack) {
    // A mounted router (app.use('/api/auth', authRoutes)) — record the mount.
    registered.add(`USE ${layer.regexp.source}`);
  }
}

const expected = [
  "GET /api/prompts",
  "GET /api/prompts/:id",
  "POST /api/prompts",
  "PUT /api/prompts/:id",
  "DELETE /api/prompts/:id",
  "POST /api/prompts/:path(*)/copy-to-my-prompts",
  "GET /api/skills/download/:skillPath(*)",
];

const missing = expected.filter((r) => !registered.has(r));
assert.deepEqual(missing, [], `missing routes: ${missing.join(", ")}`);

// The auth router is mounted rather than declared route-by-route.
assert.ok(
  [...registered].some((r) => r.startsWith("USE ") && r.includes("api")),
  "auth router is not mounted on the shared app",
);

console.log(`api-routes: all ${expected.length} routes present on the shared app`);
