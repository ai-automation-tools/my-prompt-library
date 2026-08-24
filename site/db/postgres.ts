import { Pool } from 'pg';

export interface UserSkillPackInstall {
  user_id: string;
  pack_id: string;
  created_at: string;
}

// PostgreSQL connection pool
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      max: 10, // Maximum connections in pool
    });
    
    console.log('✅ PostgreSQL pool initialized');
  }
  
  return pool;
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

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export const userDb = {
  create: async (email: string, password: string, name?: string): Promise<UserPublic> => {
    const pool = getPool();
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const bcrypt = (await import('bcryptjs')).default;
    const passwordHash = bcrypt.hashSync(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, email, passwordHash, name || null]
    );
    
    return userDb.toPublic(result.rows[0]);
  },

  verifyPassword: async (email: string, password: string): Promise<UserPublic | null> => {
    const pool = getPool();
    const bcrypt = (await import('bcryptjs')).default;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) return null;
    
    const user = result.rows[0];
    const isValid = bcrypt.compareSync(password, user.password_hash);
    
    if (!isValid) return null;
    
    return userDb.toPublic(user);
  },

  toPublic: (user: User): UserPublic => {
    const { password_hash, ...publicUser } = user;
    return publicUser;
  },

  findById: async (id: string): Promise<User | null> => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  findByIdPublic: async (id: string): Promise<UserPublic | null> => {
    const user = await userDb.findById(id);
    return user ? userDb.toPublic(user) : null;
  },

  findByEmail: async (email: string): Promise<User | null> => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  update: async (id: string, updates: Partial<Omit<UserPublic, 'id' | 'created_at' | 'updated_at'>>): Promise<UserPublic | null> => {
    const pool = getPool();
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (updates.email) {
      fields.push(`email = $${paramIndex++}`);
      values.push(updates.email);
    }
    if (updates.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.avatar_url !== undefined) {
      fields.push(`avatar_url = $${paramIndex++}`);
      values.push(updates.avatar_url);
    }
    
    if (fields.length === 0) return userDb.findByIdPublic(id);
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    
    return result.rows[0] ? userDb.toPublic(result.rows[0]) : null;
  },
};

export const promptDb = {
  create: async (userId: string, prompt: Omit<UserPrompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<UserPrompt> => {
    const pool = getPool();
    const id = `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await pool.query(
      `INSERT INTO user_prompts (id, user_id, title, section, category, subcategory, tags, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        id,
        userId,
        prompt.title,
        prompt.section,
        prompt.category,
        prompt.subcategory || null,
        JSON.stringify(prompt.tags || []),
        prompt.content
      ]
    );
    
    const row = result.rows[0];
    return {
      ...row,
      tags: JSON.parse(row.tags || '[]'),
    };
  },

  findById: async (id: string): Promise<UserPrompt | null> => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM user_prompts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      ...row,
      tags: JSON.parse(row.tags || '[]'),
    };
  },

  findByUserId: async (userId: string, section?: string): Promise<UserPrompt[]> => {
    const pool = getPool();
    
    let query = 'SELECT * FROM user_prompts WHERE user_id = $1';
    const params: any[] = [userId];
    
    if (section) {
      query += ' AND section = $2';
      params.push(section);
    }
    
    query += ' ORDER BY updated_at DESC';
    
    const result = await pool.query(query, params);
    
    return result.rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
    }));
  },

  update: async (id: string, userId: string, updates: Partial<Omit<UserPrompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<UserPrompt | null> => {
    const pool = getPool();
    
    // Verify ownership
    const existing = await promptDb.findById(id);
    if (!existing || existing.user_id !== userId) {
      return null;
    }
    
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (updates.title) {
      fields.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.section) {
      fields.push(`section = $${paramIndex++}`);
      values.push(updates.section);
    }
    if (updates.category) {
      fields.push(`category = $${paramIndex++}`);
      values.push(updates.category);
    }
    if (updates.subcategory !== undefined) {
      fields.push(`subcategory = $${paramIndex++}`);
      values.push(updates.subcategory);
    }
    if (updates.tags) {
      fields.push(`tags = $${paramIndex++}`);
      values.push(JSON.stringify(updates.tags));
    }
    if (updates.content) {
      fields.push(`content = $${paramIndex++}`);
      values.push(updates.content);
    }
    
    if (fields.length === 0) return existing;
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const result = await pool.query(
      `UPDATE user_prompts SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      ...row,
      tags: JSON.parse(row.tags || '[]'),
    };
  },

  delete: async (id: string, userId: string): Promise<boolean> => {
    const pool = getPool();
    
    // Verify ownership
    const existing = await promptDb.findById(id);
    if (!existing || existing.user_id !== userId) {
      return false;
    }
    
    const result = await pool.query('DELETE FROM user_prompts WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  },

  copyFromPublic: async (userId: string, publicPrompt: {
    title: string;
    section: string;
    category: string;
    subcategory?: string | null;
    tags: string[];
    content: string;
  }): Promise<UserPrompt> => {
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

export const userSkillPackDb = {
  listByUserId: async (userId: string): Promise<UserSkillPackInstall[]> => {
    const pool = getPool();
    const result = await pool.query(
      'SELECT user_id, pack_id, created_at FROM user_skill_pack_installs WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  add: async (userId: string, packId: string): Promise<void> => {
    const pool = getPool();
    await pool.query(
      `INSERT INTO user_skill_pack_installs (user_id, pack_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, pack_id) DO NOTHING`,
      [userId, packId]
    );
  },

  remove: async (userId: string, packId: string): Promise<void> => {
    const pool = getPool();
    await pool.query(
      'DELETE FROM user_skill_pack_installs WHERE user_id = $1 AND pack_id = $2',
      [userId, packId]
    );
  },
};

export const sessionDb = {
  create: async (userId: string, expiresInDays: number = 30): Promise<Session> => {
    const pool = getPool();
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const token = `${Math.random().toString(36).substr(2)}_${Date.now()}_${Math.random().toString(36).substr(2)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    const result = await pool.query(
      `INSERT INTO user_sessions (id, user_id, token, expires_at)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, userId, token, expiresAt.toISOString()]
    );
    
    return result.rows[0];
  },

  findByToken: async (token: string): Promise<Session | null> => {
    const pool = getPool();
    const result = await pool.query(
      `SELECT * FROM user_sessions 
       WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP`,
      [token]
    );
    
    return result.rows[0] || null;
  },

  delete: async (token: string): Promise<boolean> => {
    const pool = getPool();
    const result = await pool.query('DELETE FROM user_sessions WHERE token = $1', [token]);
    return result.rowCount !== null && result.rowCount > 0;
  },

  cleanExpired: async (): Promise<number> => {
    const pool = getPool();
    const result = await pool.query('DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP');
    return result.rowCount || 0;
  },
};

// Initialize database schema
export async function initializeSchema() {
  const pool = getPool();
  
  // Create tables if they don't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_prompts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      section TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      tags TEXT,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_skill_pack_installs (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      pack_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, pack_id)
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_user_prompts_user_id ON user_prompts(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_prompts_section ON user_prompts(section, user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_user_skill_pack_installs_user_id ON user_skill_pack_installs(user_id);
  `);
  
  console.log('✅ PostgreSQL schema initialized');
}
