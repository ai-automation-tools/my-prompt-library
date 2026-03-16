import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file location
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'prompts.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Initialize database
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Create db directory if it doesn't exist
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL'); // Better performance for concurrent access
    
    // Initialize schema if tables don't exist
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schema);
    
    console.log(`✅ Database initialized at ${DB_PATH}`);
  }
  
  return db;
}

// User operations
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPrompt {
  id: string;
  user_id: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  content: string;
  created_at: string;
  updated_at: string;
}

export const userDb = {
  // Create user with password
  create: (email: string, password: string, name?: string): UserPublic => {
    const db = getDb();
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password_hash, name)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(id, email, passwordHash, name || null);
    
    const user = userDb.findById(id)!;
    return userDb.toPublic(user);
  },

  // Verify password
  verifyPassword: (email: string, password: string): UserPublic | null => {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as User | null;
    
    if (!user) return null;
    
    const isValid = bcrypt.compareSync(password, user.password_hash);
    
    if (!isValid) return null;
    
    return userDb.toPublic(user);
  },

  // Convert User to UserPublic (remove password_hash)
  toPublic: (user: User): UserPublic => {
    const { password_hash, ...publicUser } = user;
    return publicUser;
  },

  // Find user by ID (returns User with password_hash for internal use)
  findById: (id: string): User | null => {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | null;
  },

  // Find user by ID (public version without password)
  findByIdPublic: (id: string): UserPublic | null => {
    const user = userDb.findById(id);
    return user ? userDb.toPublic(user) : null;
  },

  // Find user by email (returns User with password_hash for internal use)
  findByEmail: (email: string): User | null => {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | null;
  },

  // Update user
  update: (id: string, updates: Partial<Omit<UserPublic, 'id' | 'created_at' | 'updated_at'>>): UserPublic | null => {
    const db = getDb();
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.email) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.avatar_url !== undefined) {
      fields.push('avatar_url = ?');
      values.push(updates.avatar_url);
    }
    
    if (fields.length === 0) return userDb.findByIdPublic(id);
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = db.prepare(`
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return userDb.findByIdPublic(id);
  },
};

export const promptDb = {
  // Create user prompt
  create: (userId: string, prompt: Omit<UserPrompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>): UserPrompt => {
    const db = getDb();
    const id = `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const stmt = db.prepare(`
      INSERT INTO user_prompts (id, user_id, title, section, category, subcategory, tags, content)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      userId,
      prompt.title,
      prompt.section,
      prompt.category,
      prompt.subcategory || null,
      JSON.stringify(prompt.tags || []),
      prompt.content
    );
    
    return promptDb.findById(id)!;
  },

  // Find prompt by ID
  findById: (id: string): UserPrompt | null => {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM user_prompts WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      tags: JSON.parse(row.tags || '[]'),
    };
  },

  // Find all prompts for a user
  findByUserId: (userId: string, section?: string): UserPrompt[] => {
    const db = getDb();
    
    let query = 'SELECT * FROM user_prompts WHERE user_id = ?';
    const params: any[] = [userId];
    
    if (section) {
      query += ' AND section = ?';
      params.push(section);
    }
    
    query += ' ORDER BY updated_at DESC';
    
    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as any[];
    
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
    }));
  },

  // Update prompt
  update: (id: string, userId: string, updates: Partial<Omit<UserPrompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): UserPrompt | null => {
    const db = getDb();
    
    // Verify ownership
    const existing = promptDb.findById(id);
    if (!existing || existing.user_id !== userId) {
      return null; // Not found or unauthorized
    }
    
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.title) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.section) {
      fields.push('section = ?');
      values.push(updates.section);
    }
    if (updates.category) {
      fields.push('category = ?');
      values.push(updates.category);
    }
    if (updates.subcategory !== undefined) {
      fields.push('subcategory = ?');
      values.push(updates.subcategory);
    }
    if (updates.tags) {
      fields.push('tags = ?');
      values.push(JSON.stringify(updates.tags));
    }
    if (updates.content) {
      fields.push('content = ?');
      values.push(updates.content);
    }
    
    if (fields.length === 0) return existing;
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = db.prepare(`
      UPDATE user_prompts
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return promptDb.findById(id);
  },

  // Delete prompt
  delete: (id: string, userId: string): boolean => {
    const db = getDb();
    
    // Verify ownership
    const existing = promptDb.findById(id);
    if (!existing || existing.user_id !== userId) {
      return false; // Not found or unauthorized
    }
    
    const stmt = db.prepare('DELETE FROM user_prompts WHERE id = ?');
    const result = stmt.run(id);
    
    return result.changes > 0;
  },

  // Copy public prompt to user library
  copyFromPublic: (userId: string, publicPrompt: {
    title: string;
    section: string;
    category: string;
    subcategory?: string | null;
    tags: string[];
    content: string;
  }): UserPrompt => {
    return promptDb.create(userId, {
      title: publicPrompt.title,
      section: publicPrompt.section,
      category: publicPrompt.category,
      subcategory: publicPrompt.subcategory || null,
      tags: publicPrompt.tags,
      content: publicPrompt.content,
    });
  },
};

// Session management
export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export const sessionDb = {
  // Create session
  create: (userId: string, expiresInDays: number = 30): Session => {
    const db = getDb();
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const token = `${Math.random().toString(36).substr(2)}_${Date.now()}_${Math.random().toString(36).substr(2)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    const stmt = db.prepare(`
      INSERT INTO user_sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(id, userId, token, expiresAt.toISOString());
    
    return sessionDb.findByToken(token)!;
  },

  // Find session by token
  findByToken: (token: string): Session | null => {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT * FROM user_sessions 
      WHERE token = ? AND expires_at > CURRENT_TIMESTAMP
    `);
    return stmt.get(token) as Session | null;
  },

  // Delete session (logout)
  delete: (token: string): boolean => {
    const db = getDb();
    const stmt = db.prepare('DELETE FROM user_sessions WHERE token = ?');
    const result = stmt.run(token);
    return result.changes > 0;
  },

  // Clean up expired sessions
  cleanExpired: (): number => {
    const db = getDb();
    const stmt = db.prepare('DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP');
    const result = stmt.run();
    return result.changes;
  },
};

// Initialize database on import
getDb();
