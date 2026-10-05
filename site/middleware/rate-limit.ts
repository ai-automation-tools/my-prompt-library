import rateLimit from 'express-rate-limit';

// Per-IP limits on the credential endpoints. The store is in-memory, so on
// Vercel it is per warm function instance rather than global: a determined
// attacker spread across instances gets more than the number below, but a
// single scripted client against one instance does not. That is the cheap
// win; a shared store (Upstash, Redis) is the upgrade if abuse ever shows up.
//
// `trust proxy` must be set on the app (api/index.ts does) so the client IP
// comes from X-Forwarded-For rather than Vercel's own hop.

const WINDOW_MS = 15 * 60 * 1000;

const json429 = (message: string) => ({
  standardHeaders: 'draft-7' as const,
  legacyHeaders: false,
  message: { error: message },
});

/** Login: 20 attempts per IP per 15 minutes. Failed attempts count; successes do not. */
export const loginLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 20,
  skipSuccessfulRequests: true,
  ...json429('Too many login attempts. Try again in 15 minutes.'),
});

/** Signup: 5 accounts per IP per 15 minutes, successful or not. */
export const signupLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 5,
  ...json429('Too many accounts created from this address. Try again in 15 minutes.'),
});
