import { Router, Request, Response } from 'express';
import { userDb, sessionDb } from '../db/postgres.js';
import { authenticate } from '../middleware/auth.js';
import { loginLimiter, signupLimiter } from '../middleware/rate-limit.js';

const router = Router();

// Loose on purpose: one @, no whitespace, something on both sides. The goal is
// to reject garbage and oversized input, not to validate deliverability.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX = 254;
const PASSWORD_MIN = 8;
// bcrypt only hashes the first 72 bytes; anything past that is silently ignored,
// so cap well before the point where two different passwords collide.
const PASSWORD_MAX = 72;
const NAME_MAX = 100;

type Credentials = { email: string; password: string; name?: string };

/** Returns trimmed credentials, or an error message for the 400 response. */
function readCredentials(body: unknown, { requireStrongPassword }: { requireStrongPassword: boolean }):
  | { ok: true; value: Credentials }
  | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const email = typeof b.email === 'string' ? b.email.trim() : '';
  const password = typeof b.password === 'string' ? b.password : '';
  const name = typeof b.name === 'string' ? b.name.trim() : undefined;

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required' };
  }
  if (email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'Enter a valid email address' };
  }
  if (password.length > PASSWORD_MAX) {
    return { ok: false, error: `Password must be at most ${PASSWORD_MAX} characters` };
  }
  if (requireStrongPassword && password.length < PASSWORD_MIN) {
    return { ok: false, error: `Password must be at least ${PASSWORD_MIN} characters` };
  }
  if (name !== undefined && name.length > NAME_MAX) {
    return { ok: false, error: `Name must be at most ${NAME_MAX} characters` };
  }
  return { ok: true, value: { email, password, name: name || undefined } };
}

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post('/signup', signupLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = readCredentials(req.body, { requireStrongPassword: true });
    if (parsed.ok === false) {
      return res.status(400).json({ error: parsed.error });
    }
    const { email, password, name } = parsed.value;

    // Check if user already exists
    const existing = await userDb.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create user
    const user = await userDb.create(email, password, name);

    // Create session
    const session = await sessionDb.create(user.id);

    // Set cookie
    res.cookie('auth_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax',
    });

    res.json({
      user,
      token: session.token,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    // Existing accounts may have passwords shorter than today's minimum, so
    // login only enforces shape and size, not strength.
    const parsed = readCredentials(req.body, { requireStrongPassword: false });
    if (parsed.ok === false) {
      return res.status(400).json({ error: parsed.error });
    }
    const { email, password } = parsed.value;

    // Verify credentials
    const user = await userDb.verifyPassword(email, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create session
    const session = await sessionDb.create(user.id);

    // Set cookie
    res.cookie('auth_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax',
    });

    res.json({
      user,
      token: session.token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/logout
 * Logout current user
 */
router.post('/logout', authenticate, async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await sessionDb.delete(token);
    }

    res.clearCookie('auth_token');
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await userDb.findByIdPublic(req.user!.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

/**
 * PUT /api/auth/me
 * Update current user info
 */
router.put('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, avatar_url } = req.body ?? {};
    if (name !== undefined && (typeof name !== 'string' || name.length > NAME_MAX)) {
      return res.status(400).json({ error: `Name must be a string of at most ${NAME_MAX} characters` });
    }
    if (avatar_url !== undefined && (typeof avatar_url !== 'string' || avatar_url.length > 2048)) {
      return res.status(400).json({ error: 'avatar_url must be a string of at most 2048 characters' });
    }

    const user = await userDb.update(req.user!.id, { name, avatar_url });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
