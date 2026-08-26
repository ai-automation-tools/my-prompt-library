import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Local stand-ins for @vercel/node's VercelRequest / VercelResponse.
 *
 * That package was a devDependency pulled in for these two types and nothing
 * else — it never runs, because Vercel supplies the real runtime. But even at
 * its latest version it bundles vulnerable `undici` and `path-to-regexp` with
 * no fixed release available, so it was six standing advisories in exchange for
 * two interfaces. These match the shape the platform actually hands the handler.
 */
export interface VercelRequest extends IncomingMessage {
  query: Partial<Record<string, string | string[]>>;
  cookies: Partial<Record<string, string>>;
  body: Record<string, unknown> | undefined;
}

export interface VercelResponse extends ServerResponse {
  send: (body: unknown) => VercelResponse;
  json: (jsonBody: unknown) => VercelResponse;
  status: (statusCode: number) => VercelResponse;
  redirect: (statusOrUrl: string | number, url?: string) => VercelResponse;
}
