import { Request, Response, NextFunction } from 'express';
import { sessionDb, userDb } from '../db/index.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string | null;
      };
    }
  }
}

/**
 * Authentication middleware
 * Checks for auth token in cookies or Authorization header
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  // Check for token in Authorization header or cookie
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.auth_token;
  
  const token = authHeader?.replace('Bearer ', '') || cookieToken;
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Verify token
  const session = sessionDb.findByToken(token);
  
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Get user
  const user = userDb.findById(session.user_id);
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Attach user to request
  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  next();
}

/**
 * Optional authentication middleware
 * Attaches user to request if token is present, but doesn't require it
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.auth_token;
  
  const token = authHeader?.replace('Bearer ', '') || cookieToken;
  
  if (!token) {
    return next();
  }

  const session = sessionDb.findByToken(token);
  
  if (session) {
    const user = userDb.findById(session.user_id);
    
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }
  }

  next();
}
