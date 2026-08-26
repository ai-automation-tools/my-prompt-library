import path from "path";

/**
 * Resolve a caller-supplied relative path inside `root`, returning null if it
 * escapes.
 *
 * `path.join(root, userInput)` is NOT a containment check — "a/../../b" walks
 * straight out, and a `userInput.startsWith('a/')` guard on the raw string is
 * satisfied by "a/../../b" too. Resolve first, compare after.
 */
export function resolveInside(root: string, relPath: string): string | null {
  const base = path.resolve(root);
  const full = path.resolve(base, relPath);
  if (full !== base && !full.startsWith(base + path.sep)) return null;
  return full;
}
