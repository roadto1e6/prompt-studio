# Prompt Studio API Documentation

## Overview

Base URL: `http://localhost:3000/api`

All API endpoints require authentication unless otherwise specified. Include the JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Authentication

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "inviteCode": "optional-invite-code"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "member",
      "plan": "free",
      "permissions": ["prompt:create", "prompt:read", ...],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "emailVerified": false,
      "settings": {
        "language": "en",
        "theme": "system",
        "defaultModel": "gpt-4-turbo",
        "emailNotifications": true
      }
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 3600
  }
}
```

### POST /auth/login

Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "rememberMe": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 3600
  }
}
```

### POST /auth/refresh

Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-jwt-refresh-token",
    "expiresIn": 3600
  }
}
```

### POST /auth/logout

Invalidate current session.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /auth/me

Get current user profile.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    ...
  }
}
```

### PATCH /auth/profile

Update user profile.

**Request Body:**
```json
{
  "name": "New Name",
  "avatar": "https://example.com/avatar.jpg",
  "settings": {
    "language": "zh",
    "theme": "dark"
  }
}
```

**Response:** `200 OK` - Returns updated user object

### POST /auth/forgot-password

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### POST /auth/reset-password

Reset password with token.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "newSecurePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### POST /auth/change-password

Change password for authenticated user.

**Request Body:**
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Prompts

### GET /prompts

Get paginated list of prompts.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| pageSize | number | Items per page (default: 20, max: 100) |
| search | string | Search in title, description, tags |
| category | string | Filter by category: text, image, audio, video |
| collectionId | string | Filter by collection ID |
| status | string | Filter by status: active, archived, trash |
| favorite | boolean | Filter favorites only |
| sortBy | string | Sort field: updatedAt, createdAt, title |
| sortOrder | string | Sort order: asc, desc |
| tags | string | Comma-separated tags |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "prompt-uuid",
        "title": "My Prompt",
        "description": "A helpful prompt",
        "category": "text",
        "systemPrompt": "You are a helpful assistant...",
        "userTemplate": "Please help me with {{task}}",
        "model": "gpt-4-turbo",
        "temperature": 0.7,
        "maxTokens": 2048,
        "tags": ["productivity", "writing"],
        "collectionId": "collection-uuid",
        "favorite": false,
        "status": "active",
        "currentVersionId": "version-uuid",
        "versions": [...],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-02T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

### GET /prompts/:id

Get single prompt by ID.

**Response:** `200 OK` - Returns prompt object

### POST /prompts

Create a new prompt.

**Request Body:**
```json
{
  "title": "My New Prompt",
  "description": "A description",
  "category": "text",
  "systemPrompt": "You are...",
  "userTemplate": "Help me with {{task}}",
  "model": "gpt-4-turbo",
  "temperature": 0.7,
  "maxTokens": 2048,
  "tags": ["tag1", "tag2"],
  "collectionId": "collection-uuid"
}
```

**Response:** `201 Created` - Returns created prompt

### PATCH /prompts/:id

Update a prompt.

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "text",
  "systemPrompt": "Updated system prompt",
  "userTemplate": "Updated template",
  "model": "gpt-4",
  "temperature": 0.5,
  "maxTokens": 1024,
  "tags": ["new-tag"],
  "collectionId": null,
  "favorite": true,
  "status": "archived"
}
```

**Response:** `200 OK` - Returns updated prompt

### DELETE /prompts/:id

Permanently delete a prompt.

**Response:** `204 No Content`

### PATCH /prompts/batch

Batch update prompts.

**Request Body:**
```json
{
  "ids": ["prompt-1", "prompt-2"],
  "status": "trash"
}
```

**Response:** `200 OK` - Returns array of updated prompts

### DELETE /prompts/batch

Batch delete prompts.

**Request Body:**
```json
{
  "ids": ["prompt-1", "prompt-2"]
}
```

**Response:** `204 No Content`

### GET /prompts/stats

Get prompt statistics.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byCategory": {
      "text": 100,
      "image": 30,
      "audio": 15,
      "video": 5
    },
    "byStatus": {
      "active": 130,
      "archived": 15,
      "trash": 5
    },
    "favorites": 25,
    "recentlyUpdated": 10
  }
}
```

---

## Prompt Versions

### GET /prompts/:promptId/versions

Get all versions of a prompt.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "version-uuid",
      "promptId": "prompt-uuid",
      "versionNumber": "1.2",
      "systemPrompt": "Version of system prompt",
      "userTemplate": "Version of template",
      "model": "gpt-4-turbo",
      "temperature": 0.7,
      "maxTokens": 2048,
      "changeNote": "Fixed formatting issues",
      "createdAt": "2024-01-02T00:00:00.000Z",
      "createdBy": "user-uuid"
    }
  ]
}
```

### POST /prompts/:promptId/versions

Create a new version.

**Request Body:**
```json
{
  "changeNote": "Description of changes"
}
```

**Response:** `201 Created` - Returns created version

### POST /prompts/:promptId/versions/:versionId/restore

Restore prompt to a specific version.

**Response:** `200 OK` - Returns updated prompt

### DELETE /prompts/:promptId/versions/:versionId

Delete a version.

**Response:** `204 No Content`

---

## Prompt Sharing

### GET /prompts/:id/share

Get share code and URL for a prompt.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "shareCode": "PS-abc123...",
    "shareUrl": "https://promptstudio.com/share/PS-abc123..."
  }
}
```

### POST /prompts/import

Import a prompt from share code.

**Request Body:**
```json
{
  "shareCode": "PS-abc123..."
}
```

**Response:** `201 Created` - Returns imported prompt

---

## Collections

### GET /collections

Get paginated list of collections.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| pageSize | number | Items per page (default: 20) |
| search | string | Search in name, description |
| sortBy | string | Sort field: updatedAt, createdAt, name |
| sortOrder | string | Sort order: asc, desc |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "collection-uuid",
        "name": "Marketing Prompts",
        "description": "Prompts for marketing tasks",
        "color": "#3B82F6",
        "icon": "Megaphone",
        "promptCount": 15,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-02T00:00:00.000Z"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  }
}
```

### GET /collections/all

Get all collections without pagination.

**Response:** `200 OK` - Returns array of all collections

### GET /collections/:id

Get single collection by ID.

**Response:** `200 OK` - Returns collection object

### POST /collections

Create a new collection.

**Request Body:**
```json
{
  "name": "New Collection",
  "description": "Collection description",
  "color": "#3B82F6",
  "icon": "Folder"
}
```

**Response:** `201 Created` - Returns created collection

### PATCH /collections/:id

Update a collection.

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "color": "#EF4444",
  "icon": "Star"
}
```

**Response:** `200 OK` - Returns updated collection

### DELETE /collections/:id

Delete a collection. Prompts in the collection will not be deleted.

**Response:** `204 No Content`

### GET /collections/:id/prompts

Get prompt IDs in a collection.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "prompts": ["prompt-1", "prompt-2"],
    "count": 2
  }
}
```

### POST /collections/:id/prompts

Move prompts to a collection.

**Request Body:**
```json
{
  "promptIds": ["prompt-1", "prompt-2"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "updated": 2
  }
}
```

### DELETE /collections/:id/prompts

Remove prompts from a collection.

**Request Body:**
```json
{
  "promptIds": ["prompt-1", "prompt-2"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "updated": 2
  }
}
```

### GET /collections/stats

Get collection statistics.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 10,
    "withPrompts": 8,
    "empty": 2
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "message": "Human readable message"
}
```

### Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | BAD_REQUEST | Invalid request body or parameters |
| 401 | UNAUTHORIZED | Missing or invalid authentication |
| 401 | SESSION_EXPIRED | Token expired, need to re-login |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 422 | VALIDATION_ERROR | Validation failed |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

---

## Rate Limiting

- Default: 100 requests per minute per user
- Auth endpoints: 10 requests per minute per IP
- Bulk operations: 10 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  teamId?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerified: boolean;
  settings: UserSettings;
}
```

### Prompt
```typescript
interface Prompt {
  id: string;
  title: string;
  description: string;
  category: 'text' | 'image' | 'audio' | 'video';
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tags: string[];
  collectionId: string | null;
  favorite: boolean;
  status: 'active' | 'archived' | 'trash';
  currentVersionId: string;
  versions: PromptVersion[];
  createdAt: string;
  updatedAt: string;
}
```

### PromptVersion
```typescript
interface PromptVersion {
  id: string;
  promptId: string;
  versionNumber: string;
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  changeNote: string;
  createdAt: string;
  createdBy: string;
}
```

### Collection
```typescript
interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  promptCount: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## Plan Limits

| Feature | Free | Pro | Team | Enterprise |
|---------|------|-----|------|------------|
| Max Prompts | 50 | 500 | 2000 | Unlimited |
| Max Collections | 5 | 50 | 200 | Unlimited |
| Max Versions/Prompt | 10 | 100 | 500 | Unlimited |
| Team Members | 1 | 1 | 10 | Unlimited |
| API Access | No | Yes | Yes | Yes |
| Advanced Models | No | Yes | Yes | Yes |
| Custom Branding | No | No | Yes | Yes |
| Priority Support | No | No | Yes | Yes |
