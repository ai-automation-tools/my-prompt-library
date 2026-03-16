# API Documentation

## Base URL

```
http://localhost:3010/api
```

Production: `https://your-domain.com/api`

## Authentication

### Overview

The API uses **token-based authentication** with httpOnly cookies.

**Authentication Flow:**
1. User signs up or logs in
2. Server creates session and returns token
3. Token stored in httpOnly cookie (automatically sent by browser)
4. Subsequent requests include cookie
5. Server validates token and attaches user to request

**Token Format:**
```
<random>_<timestamp>_<random>
Example: abc123_1710610234567_xyz789
```

### Using Tokens

**Cookie (Recommended):**
```javascript
// Automatic with fetch() in browser
fetch('/api/prompts', {
  credentials: 'include' // Include cookies
});
```

**Authorization Header (Alternative):**
```bash
curl -H "Authorization: Bearer abc123_1710610234567_xyz789" \
  http://localhost:3010/api/auth/me
```

---

## Authentication Endpoints

### POST /api/auth/signup

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"  // optional
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_1710609876543_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": null,
    "created_at": "2024-03-16T10:17:56.000Z",
    "updated_at": "2024-03-16T10:17:56.000Z"
  },
  "token": "abc123_1710610234567_xyz789"
}
```

**Set-Cookie Header:**
```
auth_token=abc123_1710610234567_xyz789; HttpOnly; Path=/; Max-Age=2592000
```

**Errors:**
- `400 Bad Request`: Missing email or password
- `400 Bad Request`: Password too short (min 6 characters)
- `409 Conflict`: Email already exists

**Example:**
```bash
curl -X POST http://localhost:3010/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secret123",
    "name": "John Doe"
  }'
```

---

### POST /api/auth/login

Login with existing credentials.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_1710609876543_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": null,
    "created_at": "2024-03-16T10:17:56.000Z",
    "updated_at": "2024-03-16T10:17:56.000Z"
  },
  "token": "abc123_1710610234567_xyz789"
}
```

**Errors:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid email or password

**Example:**
```bash
curl -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secret123"
  }' \
  -c cookies.txt  # Save cookie
```

---

### POST /api/auth/logout

Logout current user (requires authentication).

**Request:** (no body)

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Errors:**
- `401 Unauthorized`: Not authenticated

**Example:**
```bash
curl -X POST http://localhost:3010/api/auth/logout \
  -b cookies.txt  # Use saved cookie
```

---

### GET /api/auth/me

Get current user info (requires authentication).

**Request:** (no body)

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_1710609876543_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2024-03-16T10:17:56.000Z",
    "updated_at": "2024-03-16T10:22:15.000Z"
  }
}
```

**Errors:**
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: User not found in database

**Example:**
```bash
curl http://localhost:3010/api/auth/me \
  -b cookies.txt
```

---

### PUT /api/auth/me

Update current user profile (requires authentication).

**Request:**
```json
{
  "name": "John Smith",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_1710609876543_abc123",
    "email": "user@example.com",
    "name": "John Smith",
    "avatar_url": "https://example.com/new-avatar.jpg",
    "created_at": "2024-03-16T10:17:56.000Z",
    "updated_at": "2024-03-16T10:25:30.000Z"
  }
}
```

**Errors:**
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: User not found

**Example:**
```bash
curl -X PUT http://localhost:3010/api/auth/me \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "John Smith",
    "avatar_url": "https://example.com/avatar.jpg"
  }'
```

---

## Prompt Endpoints

### GET /api/prompts

List prompts based on library mode.

**Query Parameters:**
- `library` (required): `public` or `my`

**Public Library (`?library=public`):**
- Returns all prompts from file system
- No authentication required
- All prompts have `isUserOwned: false`

**My Library (`?library=my`):**
- Returns user's personal prompts from database
- **Requires authentication**
- All prompts have `isUserOwned: true`

**Response (200 OK):**
```json
[
  {
    "id": "prompt_1710610123456_xyz789",
    "title": "SEO Blog Post Generator",
    "section": "Prompt_Library",
    "category": "Writing",
    "subcategory": "Technical",
    "tags": ["seo", "blog", "content"],
    "content": "Generate an SEO-optimized blog post about...",
    "lastModified": "2024-03-16T10:22:03.000Z",
    "isUserOwned": true
  },
  ...
]
```

**Errors:**
- `401 Unauthorized`: Not authenticated (for `?library=my`)

**Examples:**

```bash
# Public library (no auth required)
curl http://localhost:3010/api/prompts?library=public

# My library (requires auth)
curl http://localhost:3010/api/prompts?library=my \
  -b cookies.txt
```

---

### POST /api/prompts

Create a new prompt in user's library (requires authentication).

**Request:**
```json
{
  "title": "My Custom Prompt",
  "section": "Prompt_Library",
  "category": "Business",
  "subcategory": "Marketing",  // optional
  "tags": ["custom", "marketing"],  // optional
  "content": "Full prompt content in markdown..."
}
```

**Response (200 OK):**
```json
{
  "id": "prompt_1710610456789_abc123",
  "title": "My Custom Prompt",
  "section": "Prompt_Library",
  "category": "Business",
  "subcategory": "Marketing",
  "tags": ["custom", "marketing"],
  "content": "Full prompt content in markdown...",
  "lastModified": "2024-03-16T10:27:36.000Z",
  "isUserOwned": true,
  "message": "Prompt created successfully"
}
```

**Errors:**
- `400 Bad Request`: Missing required fields (title, section, category, content)
- `401 Unauthorized`: Not authenticated

**Example:**
```bash
curl -X POST http://localhost:3010/api/prompts \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "My Prompt",
    "section": "Prompt_Library",
    "category": "Business",
    "subcategory": "Marketing",
    "tags": ["custom"],
    "content": "# My Prompt\n\nContent here..."
  }'
```

---

### PUT /api/prompts/:id

Update an existing prompt (requires authentication).

**URL Parameters:**
- `id`: Prompt ID (e.g., `prompt_1710610456789_abc123`)

**Request:**
```json
{
  "title": "Updated Title",  // optional
  "section": "Agent_Instructions",  // optional
  "category": "Development",  // optional
  "subcategory": "Python",  // optional
  "tags": ["updated", "python"],  // optional
  "content": "Updated content..."  // optional
}
```

**Response (200 OK):**
```json
{
  "id": "prompt_1710610456789_abc123",
  "title": "Updated Title",
  "section": "Agent_Instructions",
  "category": "Development",
  "subcategory": "Python",
  "tags": ["updated", "python"],
  "content": "Updated content...",
  "lastModified": "2024-03-16T10:30:15.000Z",
  "isUserOwned": true,
  "message": "Prompt updated successfully"
}
```

**Errors:**
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Prompt not found or user doesn't own it

**Example:**
```bash
curl -X PUT http://localhost:3010/api/prompts/prompt_123 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "New Title",
    "content": "New content..."
  }'
```

---

### DELETE /api/prompts/:id

Delete a prompt (requires authentication).

**URL Parameters:**
- `id`: Prompt ID

**Request:** (no body)

**Response (200 OK):**
```json
{
  "message": "Prompt deleted successfully"
}
```

**Errors:**
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Prompt not found or user doesn't own it

**Example:**
```bash
curl -X DELETE http://localhost:3010/api/prompts/prompt_123 \
  -b cookies.txt
```

---

### POST /api/prompts/:id/copy-to-my-prompts

Copy a public prompt to user's personal library (requires authentication).

**URL Parameters:**
- `id`: Public prompt path (e.g., `Prompt_Library/Business/Marketing/market-research.md`)

**Request:** (no body)

**Response (200 OK):**
```json
{
  "id": "prompt_1710610789012_def456",
  "title": "Market Research Plan",
  "section": "Prompt_Library",
  "category": "Business",
  "subcategory": "Marketing",
  "tags": ["research", "business"],
  "content": "Design a market research plan for...",
  "lastModified": "2024-03-16T10:33:09.000Z",
  "isUserOwned": true,
  "message": "Prompt copied to My Library"
}
```

**Errors:**
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Source prompt not found
- `500 Internal Server Error`: Copy failed

**Example:**
```bash
curl -X POST "http://localhost:3010/api/prompts/Prompt_Library%2FBusiness%2FMarketing%2Fmarket-research.md/copy-to-my-prompts" \
  -b cookies.txt
```

---

## Response Formats

### Success Response

All successful responses use HTTP status `200 OK` (or `201 Created` where appropriate).

**Standard Format:**
```json
{
  "data": { ... },
  "message": "Operation successful"  // optional
}
```

### Error Response

All error responses include an `error` field with a human-readable message.

**Format:**
```json
{
  "error": "Description of what went wrong"
}
```

**Common HTTP Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required or invalid
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

---

## Data Models

### User (Public)

Returned by API (password_hash excluded).

```typescript
{
  id: string;              // "user_<timestamp>_<random>"
  email: string;           // "user@example.com"
  name: string | null;     // Display name
  avatar_url: string | null;  // Profile picture URL
  created_at: string;      // ISO 8601 timestamp
  updated_at: string;      // ISO 8601 timestamp
}
```

### Prompt

Returned by prompt endpoints.

```typescript
{
  id: string;              // Database ID or file path
  title: string;           // Prompt title
  section: string;         // Prompt_Library | Agent_Instructions | Agent_Guides | System_Prompts | Skills
  category: string;        // Business, Marketing, Development, etc.
  subcategory: string | null;  // Optional sub-category
  tags: string[];          // Array of tag strings
  content: string;         // Full markdown content
  lastModified: string;    // ISO 8601 timestamp
  isUserOwned: boolean;    // true for user prompts, false for public
}
```

### Session

Not directly returned (internal use only).

```typescript
{
  id: string;              // "session_<timestamp>_<random>"
  user_id: string;         // Foreign key to user
  token: string;           // Random session token
  expires_at: string;      // ISO 8601 timestamp
  created_at: string;      // ISO 8601 timestamp
}
```

---

## Rate Limiting

**Current:** No rate limiting implemented

**Planned:**
- 100 requests per minute per IP
- 1000 requests per hour per user
- Separate limits for auth endpoints (stricter)

---

## CORS

**Current:** Not configured (same-origin only)

**For Production:**
```typescript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true  // Allow cookies
}));
```

---

## Pagination

**Current:** Not implemented (returns all results)

**Future Format:**
```
GET /api/prompts?library=my&page=2&limit=20
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

---

## Filtering & Search

**Planned Features:**

**Search:**
```
GET /api/prompts?library=my&search=marketing
```

**Filter by Section:**
```
GET /api/prompts?library=my&section=Prompt_Library
```

**Filter by Category:**
```
GET /api/prompts?library=my&category=Business
```

**Filter by Tags:**
```
GET /api/prompts?library=my&tags=seo,marketing
```

**Sort:**
```
GET /api/prompts?library=my&sort=title&order=asc
```

---

## Webhooks

**Status:** Not implemented

**Planned Events:**
- `prompt.created`
- `prompt.updated`
- `prompt.deleted`
- `user.created`

---

## SDK / Client Libraries

**Status:** Not yet available

**Planned:**
- JavaScript/TypeScript client
- Python client
- CLI tool

**Example Future Usage:**
```typescript
import { MyPromptLibrary } from '@my-prompt-library/client';

const client = new MyPromptLibrary({
  apiUrl: 'http://localhost:3010',
  token: 'your-auth-token'
});

const prompts = await client.prompts.list({ library: 'my' });
const newPrompt = await client.prompts.create({
  title: 'Test',
  content: '...'
});
```

---

## Testing

### Using cURL

**Complete Flow:**
```bash
# 1. Sign up
curl -X POST http://localhost:3010/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt

# 2. Get profile
curl http://localhost:3010/api/auth/me \
  -b cookies.txt

# 3. List my prompts
curl http://localhost:3010/api/prompts?library=my \
  -b cookies.txt

# 4. Create prompt
curl -X POST http://localhost:3010/api/prompts \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Test Prompt",
    "section": "Prompt_Library",
    "category": "Business",
    "content": "Test content"
  }'

# 5. Logout
curl -X POST http://localhost:3010/api/auth/logout \
  -b cookies.txt
```

### Using Postman

1. Create collection
2. Set base URL variable: `http://localhost:3010`
3. Add requests for each endpoint
4. Use Tests tab to save token:
   ```javascript
   pm.environment.set("auth_token", pm.response.json().token);
   ```

### Using JavaScript (fetch)

```javascript
// Sign up
const signupResponse = await fetch('http://localhost:3010/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123'
  })
});
const { user, token } = await signupResponse.json();

// Get prompts
const promptsResponse = await fetch('http://localhost:3010/api/prompts?library=my', {
  credentials: 'include'
});
const prompts = await promptsResponse.json();
```

---

## Versioning

**Current Version:** v1 (implicit)

**Future:** API versioning via URL path
```
/api/v1/prompts
/api/v2/prompts
```

---

## Support

**Issues:** GitHub Issues  
**Documentation:** `/docs` directory  
**Questions:** Discord community

---

## Changelog

### v1.0.0 (Current)
- Initial release
- User authentication (signup, login, logout)
- Prompt CRUD operations
- Public/My Library separation
- Copy prompts from public to personal library
