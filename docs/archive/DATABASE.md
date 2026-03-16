# Database Documentation

## Overview

My Prompt Library uses **SQLite** for user authentication and user-owned prompt storage. The database provides multi-user support while keeping the public prompt library in version-controlled files.

## Architecture

### Hybrid Storage Model

```
┌─────────────────────────────────────────┐
│         Application Storage             │
├─────────────────────────────────────────┤
│                                         │
│  PUBLIC LIBRARY (Files)                 │
│  ├── library/Prompt_Library/            │
│  ├── library/Agent_Instructions/        │
│  ├── library/Agent_Guides/              │
│  ├── library/System_Prompts/            │
│  └── library/Skills/                    │
│                                         │
│  USER DATA (SQLite Database)            │
│  ├── users                              │
│  ├── user_prompts                       │
│  └── user_sessions                      │
│                                         │
└─────────────────────────────────────────┘
```

**Why Hybrid?**
- **Public Library**: Git version control, easy updates, shared across all users
- **User Data**: Fast queries, proper isolation, scales to many users

## Database Location

**Default Path:**
```
repo/db/prompts.db
```

**Environment Variable:**
```bash
DATABASE_PATH=/custom/path/to/database.db
```

## Schema

### Users Table

Stores user accounts and profiles.

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- Format: user_<timestamp>_<random>
  email TEXT UNIQUE NOT NULL,       -- User's email (used for login)
  password_hash TEXT NOT NULL,      -- Bcrypt hashed password
  name TEXT,                        -- Display name (optional)
  avatar_url TEXT,                  -- Profile picture URL (optional)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**Fields:**
- `id`: Unique identifier, generated on signup
- `email`: Must be unique, used for authentication
- `password_hash`: Bcrypt hash with 10 rounds
- `name`: Optional display name
- `avatar_url`: Optional profile picture
- `created_at`: Account creation timestamp
- `updated_at`: Last profile update

**Example Row:**
```json
{
  "id": "user_1710609876543_abc123",
  "email": "john@example.com",
  "password_hash": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "name": "John Doe",
  "avatar_url": null,
  "created_at": "2024-03-16 10:17:56",
  "updated_at": "2024-03-16 10:17:56"
}
```

### User Prompts Table

Stores prompts created or copied by users.

```sql
CREATE TABLE user_prompts (
  id TEXT PRIMARY KEY,              -- Format: prompt_<timestamp>_<random>
  user_id TEXT NOT NULL,            -- Foreign key to users.id
  title TEXT NOT NULL,              -- Prompt title
  section TEXT NOT NULL,            -- Prompt_Library, Agent_Instructions, etc.
  category TEXT NOT NULL,           -- Business, Marketing, etc.
  subcategory TEXT,                 -- Optional subcategory
  tags TEXT,                        -- JSON array stored as string
  content TEXT NOT NULL,            -- Full prompt content (markdown)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_prompts_user_id ON user_prompts(user_id);
CREATE INDEX idx_user_prompts_section ON user_prompts(section, user_id);
CREATE INDEX idx_user_prompts_category ON user_prompts(category, user_id);
```

**Fields:**
- `id`: Unique prompt identifier
- `user_id`: Owner of this prompt
- `title`: Prompt title
- `section`: One of 5 main sections (Prompt_Library, Agent_Instructions, Agent_Guides, System_Prompts, Skills)
- `category`: Category within section (Business, Development, etc.)
- `subcategory`: Optional sub-category
- `tags`: JSON array of tag strings
- `content`: Full markdown content
- `created_at`: When prompt was created/copied
- `updated_at`: Last modification timestamp

**Example Row:**
```json
{
  "id": "prompt_1710610123456_xyz789",
  "user_id": "user_1710609876543_abc123",
  "title": "SEO Blog Post Generator",
  "section": "Prompt_Library",
  "category": "Writing",
  "subcategory": "Technical",
  "tags": "[\"seo\", \"blog\", \"content\"]",
  "content": "Generate an SEO-optimized blog post about...",
  "created_at": "2024-03-16 10:22:03",
  "updated_at": "2024-03-16 10:22:03"
}
```

**Data Integrity:**
- `ON DELETE CASCADE`: When a user is deleted, all their prompts are automatically deleted

### User Sessions Table

Manages authentication sessions and tokens.

```sql
CREATE TABLE user_sessions (
  id TEXT PRIMARY KEY,              -- Format: session_<timestamp>_<random>
  user_id TEXT NOT NULL,            -- Foreign key to users.id
  token TEXT UNIQUE NOT NULL,       -- Session token (sent in cookie/header)
  expires_at DATETIME NOT NULL,     -- Token expiration (default: 30 days)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_token ON user_sessions(token);
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
```

**Fields:**
- `id`: Unique session identifier
- `user_id`: User this session belongs to
- `token`: Random token sent to client (stored in cookie)
- `expires_at`: When this session expires
- `created_at`: When session was created (login time)

**Example Row:**
```json
{
  "id": "session_1710610234567_def456",
  "user_id": "user_1710609876543_abc123",
  "token": "abc123_1710610234567_xyz789",
  "expires_at": "2024-04-15 10:23:54",
  "created_at": "2024-03-16 10:23:54"
}
```

**Session Lifecycle:**
1. User logs in → session created
2. Token sent to client in httpOnly cookie
3. Client sends token with each request
4. Server validates token hasn't expired
5. User logs out → session deleted
6. Auto-cleanup removes expired sessions

## Database Operations

### Initialization

Database is automatically initialized on first server start:

```typescript
import { getDb } from './db/index.js';

// Singleton pattern - creates DB if doesn't exist
const db = getDb();
```

**Initialization Process:**
1. Check if database file exists
2. Create database file if missing
3. Execute schema.sql to create tables
4. Enable WAL mode for better concurrency
5. Log success message

### User Operations

**Create User:**
```typescript
import { userDb } from './db/index.js';

const user = userDb.create(
  'john@example.com',
  'securePassword123',
  'John Doe'
);
// Returns: { id, email, name, avatar_url, created_at, updated_at }
// (password_hash excluded)
```

**Find User:**
```typescript
const user = userDb.findByEmail('john@example.com');
const user = userDb.findById('user_1710609876543_abc123');
const user = userDb.findByIdPublic('user_...'); // Without password_hash
```

**Verify Password:**
```typescript
const user = userDb.verifyPassword('john@example.com', 'password123');
// Returns user if valid, null if invalid
```

**Update User:**
```typescript
const updated = userDb.update('user_123', {
  name: 'John Smith',
  avatar_url: 'https://example.com/avatar.jpg'
});
```

### Prompt Operations

**Create Prompt:**
```typescript
import { promptDb } from './db/index.js';

const prompt = promptDb.create('user_123', {
  title: 'My Prompt',
  section: 'Prompt_Library',
  category: 'Business',
  subcategory: 'Marketing',
  tags: ['marketing', 'seo'],
  content: 'Full prompt content here...'
});
```

**Find Prompts:**
```typescript
// All prompts for a user
const prompts = promptDb.findByUserId('user_123');

// Prompts in specific section
const prompts = promptDb.findByUserId('user_123', 'Prompt_Library');

// Single prompt by ID
const prompt = promptDb.findById('prompt_123');
```

**Update Prompt:**
```typescript
const updated = promptDb.update('prompt_123', 'user_123', {
  title: 'Updated Title',
  content: 'New content...',
  tags: ['new', 'tags']
});
// Returns null if not found or wrong owner
```

**Delete Prompt:**
```typescript
const deleted = promptDb.delete('prompt_123', 'user_123');
// Returns true if deleted, false if not found or wrong owner
```

**Copy from Public Library:**
```typescript
const copied = promptDb.copyFromPublic('user_123', {
  title: 'Market Research Plan',
  section: 'Prompt_Library',
  category: 'Business',
  subcategory: 'Marketing',
  tags: ['research', 'business'],
  content: 'Public prompt content...'
});
```

### Session Operations

**Create Session:**
```typescript
import { sessionDb } from './db/index.js';

const session = sessionDb.create('user_123', 30); // 30 days
// Returns: { id, user_id, token, expires_at, created_at }
```

**Find Session:**
```typescript
const session = sessionDb.findByToken('abc123_1710610234567_xyz789');
// Returns null if expired or not found
```

**Delete Session (Logout):**
```typescript
const deleted = sessionDb.delete('token_value');
// Returns true if deleted
```

**Clean Expired:**
```typescript
const count = sessionDb.cleanExpired();
// Returns number of sessions deleted
```

## Performance Optimizations

### WAL Mode

Write-Ahead Logging enabled for better concurrency:
```typescript
db.pragma('journal_mode = WAL');
```

**Benefits:**
- Readers don't block writers
- Writers don't block readers
- Better performance for web apps

### Indexes

Strategic indexes for common queries:

```sql
-- Fast user lookup by email (login)
CREATE INDEX idx_users_email ON users(email);

-- Fast prompt queries by user
CREATE INDEX idx_user_prompts_user_id ON user_prompts(user_id);

-- Fast filtering by section
CREATE INDEX idx_user_prompts_section ON user_prompts(section, user_id);

-- Fast category browsing
CREATE INDEX idx_user_prompts_category ON user_prompts(category, user_id);

-- Fast session validation
CREATE INDEX idx_sessions_token ON user_sessions(token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
```

### Prepared Statements

All queries use prepared statements (parameterized queries):

```typescript
// ✅ Safe from SQL injection
const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
const user = stmt.get(email);

// ❌ Vulnerable (never do this)
db.exec(`SELECT * FROM users WHERE email = '${email}'`);
```

## Security

### Password Security

**Bcrypt Hashing:**
```typescript
import bcrypt from 'bcryptjs';

// On signup
const passwordHash = bcrypt.hashSync(password, 10); // 10 rounds

// On login
const isValid = bcrypt.compareSync(password, user.password_hash);
```

**Why Bcrypt?**
- Designed for password hashing (slow by design)
- Built-in salt generation
- Resistant to rainbow tables
- Industry standard

### Session Security

**Token Generation:**
```typescript
const token = `${Math.random().toString(36).substr(2)}_${Date.now()}_${Math.random().toString(36).substr(2)}`;
```

**Token Properties:**
- Long random string (hard to guess)
- Unique per session
- Expires after 30 days
- Stored in httpOnly cookie (XSS protection)

### Ownership Verification

Every mutation checks ownership:

```typescript
// Update prompt - verify user owns it
const existing = promptDb.findById(id);
if (!existing || existing.user_id !== userId) {
  return null; // Unauthorized
}
```

**Defense in Depth:**
- UI hides buttons (UX)
- API checks ownership (security)
- Database enforces foreign keys (data integrity)

## Backup & Recovery

### Manual Backup

```bash
# Backup database
cp db/prompts.db db/prompts.db.backup

# Or use SQLite backup command
sqlite3 db/prompts.db ".backup db/prompts.db.backup"
```

### Automated Backup Script

```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR
sqlite3 db/prompts.db ".backup $BACKUP_DIR/prompts_$DATE.db"
echo "Backup created: $BACKUP_DIR/prompts_$DATE.db"
```

### Restore from Backup

```bash
# Stop server first
npm run dev # Stop with Ctrl+C

# Restore backup
cp db/prompts.db.backup db/prompts.db

# Restart server
npm run dev
```

### Export User Data

```typescript
// Export single user's data
const user = userDb.findById('user_123');
const prompts = promptDb.findByUserId('user_123');

const exportData = {
  user: {
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url
  },
  prompts: prompts.map(p => ({
    title: p.title,
    section: p.section,
    category: p.category,
    subcategory: p.subcategory,
    tags: p.tags,
    content: p.content
  }))
};

fs.writeFileSync(
  `user_export_${user.id}.json`,
  JSON.stringify(exportData, null, 2)
);
```

## Maintenance

### View Database Contents

```bash
# Open SQLite CLI
sqlite3 db/prompts.db

# List all tables
.tables

# View schema
.schema users
.schema user_prompts
.schema user_sessions

# Query data
SELECT * FROM users;
SELECT * FROM user_prompts WHERE user_id = 'user_123';
SELECT * FROM user_sessions WHERE expires_at > datetime('now');

# Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM user_prompts;

# Exit
.quit
```

### Clean Up Expired Sessions

```bash
sqlite3 db/prompts.db "DELETE FROM user_sessions WHERE expires_at <= datetime('now');"
```

Or use the API:
```typescript
import { sessionDb } from './db/index.js';
const count = sessionDb.cleanExpired();
console.log(`Deleted ${count} expired sessions`);
```

### Database Statistics

```sql
-- User count
SELECT COUNT(*) as user_count FROM users;

-- Prompts per user
SELECT 
  u.email,
  COUNT(p.id) as prompt_count
FROM users u
LEFT JOIN user_prompts p ON u.id = p.user_id
GROUP BY u.id;

-- Active sessions
SELECT COUNT(*) as active_sessions 
FROM user_sessions 
WHERE expires_at > datetime('now');

-- Database size
SELECT page_count * page_size as size 
FROM pragma_page_count(), pragma_page_size();
```

## Migration Guide

### From File-Based to Database

If you have existing user prompts in `library/My_Prompts/`:

```typescript
// migrate-my-prompts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { promptDb } from './db/index.js';

const myPromptsDir = './library/My_Prompts';
const userId = 'user_123'; // Your user ID

function migratePrompts(dirPath: string) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      migratePrompts(filePath);
      return;
    }
    
    if (!file.endsWith('.md')) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdown } = matter(content);
    
    const relativePath = path.relative(myPromptsDir, filePath);
    const parts = relativePath.split(path.sep);
    
    promptDb.create(userId, {
      title: data.title || path.basename(file, '.md'),
      section: parts[0] || 'Prompt_Library',
      category: parts[1] || 'General',
      subcategory: parts[2] || null,
      tags: data.tags || [],
      content: markdown
    });
    
    console.log(`Migrated: ${relativePath}`);
  });
}

migratePrompts(myPromptsDir);
```

## Troubleshooting

### Database Locked Error

**Cause:** Multiple processes accessing database

**Solution:**
```typescript
// Enable WAL mode (already done in getDb())
db.pragma('journal_mode = WAL');

// Or increase timeout
db.pragma('busy_timeout = 5000'); // 5 seconds
```

### Database File Not Found

**Check:**
1. Server working directory: `process.cwd()`
2. Database path: `db/prompts.db` (relative to server.ts)
3. Permissions: File must be readable/writable

**Fix:**
```bash
# Create db directory
mkdir -p db

# Restart server (will create database)
npm run dev
```

### Schema Changes

If you need to modify the schema:

1. **Backup database first:**
   ```bash
   cp db/prompts.db db/prompts.db.backup
   ```

2. **Create migration script:**
   ```sql
   -- Add new column
   ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0;
   ```

3. **Apply migration:**
   ```bash
   sqlite3 db/prompts.db < migration.sql
   ```

## Environment Variables

```bash
# .env file
DATABASE_PATH=/custom/path/to/database.db  # Default: db/prompts.db
NODE_ENV=production                         # Affects secure cookies
```

## Best Practices

### DO ✅
- Always use prepared statements
- Verify ownership before mutations
- Clean expired sessions periodically
- Backup database regularly
- Use WAL mode for concurrency
- Hash passwords with bcrypt
- Validate user input

### DON'T ❌
- Never store plain text passwords
- Don't skip ownership checks
- Avoid string concatenation in queries
- Don't commit database file to git
- Never expose password_hash to frontend
- Don't run migrations without backup

## Future Enhancements

### Planned Features
- [ ] Database versioning/migrations system
- [ ] Automatic backup scheduler
- [ ] User data export API endpoint
- [ ] Admin user role
- [ ] Soft delete for prompts (trash/restore)
- [ ] Prompt sharing between users
- [ ] Collaborative prompt folders
- [ ] Full-text search on prompt content

### Scalability
- Current setup handles ~1000 users easily
- For 10,000+ users, consider PostgreSQL migration
- For enterprise: Add connection pooling, read replicas
