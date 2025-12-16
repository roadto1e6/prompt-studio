# Prompt Studio - Backend API Design

## Overview

This document describes the API contract between the frontend and backend. The frontend is ready for backend integration with a clean service layer architecture.

## Configuration

```env
# .env for development (mock data)
VITE_ENABLE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production (real API)
VITE_ENABLE_MOCK_DATA=false
VITE_API_BASE_URL=https://api.promptstudio.com/api
```

## Authentication API

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | User registration |
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Confirm password reset |
| POST | `/auth/change-password` | Change password (authenticated) |
| PATCH | `/auth/profile` | Update user profile |
| POST | `/auth/send-verification` | Send email verification |
| POST | `/auth/verify-email` | Verify email with token |
| GET | `/auth/oauth/:provider` | Get OAuth authorization URL |
| POST | `/auth/oauth/:provider/callback` | Handle OAuth callback |

### Request/Response Types

```typescript
// POST /auth/register
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// POST /auth/login
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Response for login/register
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// User object
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  settings: UserSettings;
}

interface UserSettings {
  language: 'en' | 'zh';
  theme: 'light' | 'dark';
  defaultModel: string;
  emailNotifications: boolean;
}
```

## Prompts API

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/prompts` | List prompts (paginated, filterable) |
| POST | `/prompts` | Create new prompt |
| GET | `/prompts/:id` | Get prompt by ID |
| PATCH | `/prompts/:id` | Update prompt |
| DELETE | `/prompts/:id` | Delete prompt (soft delete) |
| POST | `/prompts/:id/restore` | Restore from trash |
| DELETE | `/prompts/:id/permanent` | Permanent delete |
| POST | `/prompts/:id/favorite` | Toggle favorite |
| POST | `/prompts/:id/duplicate` | Duplicate prompt |
| GET | `/prompts/:id/versions` | Get version history |
| POST | `/prompts/:id/versions` | Create new version |
| POST | `/prompts/:id/versions/:versionId/restore` | Restore version |

### Query Parameters

```typescript
interface PromptQueryParams {
  // Pagination
  page?: number;
  limit?: number;

  // Filters
  search?: string;
  category?: 'text' | 'image' | 'audio' | 'video';
  collectionId?: string;
  isFavorite?: boolean;
  isDeleted?: boolean;
  tags?: string[];
  model?: string;

  // Sorting
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}
```

### Request/Response Types

```typescript
// POST /prompts
interface CreatePromptRequest {
  title: string;
  description?: string;
  category: 'text' | 'image' | 'audio' | 'video';
  collectionId?: string;
  systemPrompt?: string;
  userMessageTemplate?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  tags?: string[];
}

// PATCH /prompts/:id
interface UpdatePromptRequest {
  title?: string;
  description?: string;
  category?: 'text' | 'image' | 'audio' | 'video';
  collectionId?: string | null;
  systemPrompt?: string;
  userMessageTemplate?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tags?: string[];
}

// Prompt object
interface Prompt {
  id: string;
  title: string;
  description?: string;
  category: 'text' | 'image' | 'audio' | 'video';
  collectionId?: string;
  systemPrompt?: string;
  userMessageTemplate?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tags: string[];
  isFavorite: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  currentVersionId?: string;
  versionsCount: number;
}

// Version object
interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  systemPrompt?: string;
  userMessageTemplate?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  note?: string;
  createdAt: string;
  createdBy: string;
}
```

## Collections API

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/collections` | List collections |
| POST | `/collections` | Create collection |
| GET | `/collections/:id` | Get collection by ID |
| PATCH | `/collections/:id` | Update collection |
| DELETE | `/collections/:id` | Delete collection |

### Request/Response Types

```typescript
// POST /collections
interface CreateCollectionRequest {
  name: string;
  description?: string;
  color: string;
}

// Collection object
interface Collection {
  id: string;
  name: string;
  description?: string;
  color: string;
  promptCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

## Share API

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/shares` | Create share link |
| GET | `/shares/:code` | Get shared prompt by code |
| DELETE | `/shares/:id` | Revoke share |
| GET | `/shares/my` | List my shares |

### Request/Response Types

```typescript
// POST /shares
interface CreateShareRequest {
  promptId: string;
  expiresIn?: number; // hours, optional
}

interface CreateShareResponse {
  id: string;
  code: string;
  shareUrl: string;
  expiresAt?: string;
}

// GET /shares/:code
interface GetShareResponse {
  prompt: {
    title: string;
    description?: string;
    category: string;
    systemPrompt?: string;
    userMessageTemplate?: string;
    model: string;
    temperature: number;
    maxTokens: number;
    tags: string[];
  };
  sharedBy: {
    name: string;
    avatar?: string;
  };
  viewCount: number;
  createdAt: string;
  expiresAt?: string;
}
```

## Models API

AI 模型配置管理。支持系统预设模型、用户模型配置和用户自定义模型。

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/models` | Get all model data (providers, models, user configs) |
| GET | `/models/providers` | Get provider list |
| GET | `/models/system` | Get system models (supports ?category filter) |
| GET | `/models/configs` | Get user model configurations |
| POST | `/models/configs` | Save user model configuration |
| DELETE | `/models/configs/:modelId` | Delete user model configuration |
| GET | `/models/custom` | Get user custom models |
| POST | `/models/custom` | Create custom model |
| PATCH | `/models/custom/:id` | Update custom model |
| DELETE | `/models/custom/:id` | Delete custom model |
| POST | `/models/validate` | Validate model connection |

### Data Model

```typescript
// Model Provider
type ModelProvider =
  | 'openai' | 'anthropic' | 'google' | 'meta' | 'mistral'
  | 'stability' | 'midjourney' | 'elevenlabs' | 'runway' | 'pika'
  | 'custom';

// Model Capability (maps to Category + extras)
type ModelCapability = 'text' | 'image' | 'audio' | 'video' | 'embedding' | 'vision';

// Model Status
type ModelStatus = 'active' | 'deprecated' | 'beta' | 'disabled';

// Provider info
interface Provider {
  id: ModelProvider;
  name: string;
  website?: string;
  apiDocsUrl?: string;
  description?: string;
  logo?: string;
}

// System model definition
interface Model {
  id: string;                     // e.g. 'gpt-4-turbo'
  name: string;                   // Display name
  provider: ModelProvider;
  capabilities: ModelCapability[];
  maxTokens: number;
  contextWindow?: number;
  status: ModelStatus;
  description?: string;
  releasedAt?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
  pricing?: ModelPricing;
  features?: ModelFeatures;
}

interface ModelPricing {
  inputPer1kTokens?: number;
  outputPer1kTokens?: number;
  perImage?: number;
  perMinute?: number;
  currency: string;
}

interface ModelFeatures {
  streaming?: boolean;
  vision?: boolean;
  functionCalling?: boolean;
  jsonMode?: boolean;
}
```

### Request/Response Types

```typescript
// GET /models - Full response
interface GetModelsResponse {
  providers: Provider[];
  models: Model[];
  userConfigs: UserModelConfig[];
  customModels: CustomModel[];
}

// User model configuration (for API keys, custom endpoints)
interface UserModelConfig {
  id: string;
  userId: string;
  modelId: string;
  enabled: boolean;
  alias?: string;
  apiKeyConfigured: boolean;      // Never return actual key
  customEndpoint?: string;
  customParams?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  };
  createdAt: string;
  updatedAt: string;
}

// POST /models/configs
interface SaveUserModelConfigRequest {
  modelId: string;
  enabled?: boolean;
  alias?: string;
  apiKey?: string;                // Only sent when setting
  customEndpoint?: string;
  customParams?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  };
}

// User custom model
interface CustomModel {
  id: string;
  userId: string;
  name: string;
  provider: ModelProvider;        // Usually 'custom'
  capabilities: ModelCapability[];
  maxTokens: number;
  contextWindow?: number;
  status: ModelStatus;
  description?: string;
  apiEndpoint: string;
  apiKeyConfigured: boolean;
  defaultParams?: {
    temperature?: number;
    maxTokens?: number;
  };
  createdAt: string;
  updatedAt: string;
}

// POST /models/custom
interface CreateCustomModelRequest {
  name: string;
  provider?: ModelProvider;
  capabilities: ModelCapability[];
  maxTokens: number;
  contextWindow?: number;
  description?: string;
  apiEndpoint: string;
  apiKey?: string;
  defaultParams?: {
    temperature?: number;
    maxTokens?: number;
  };
}

// PATCH /models/custom/:id
interface UpdateCustomModelRequest {
  name?: string;
  capabilities?: ModelCapability[];
  maxTokens?: number;
  contextWindow?: number;
  description?: string;
  apiEndpoint?: string;
  apiKey?: string;
  status?: ModelStatus;
  defaultParams?: {
    temperature?: number;
    maxTokens?: number;
  };
}

// POST /models/validate
interface ValidateModelRequest {
  modelId?: string;
  apiEndpoint?: string;
  apiKey?: string;
}

interface ValidateModelResponse {
  valid: boolean;
  error?: string;
  latency?: number;               // Response latency in ms
}
```

### Security Notes

- API keys should be encrypted at rest
- Never return actual API key values in responses
- Use `apiKeyConfigured: boolean` to indicate if a key is set
- Validate API endpoints to prevent SSRF attacks
- Rate limit the `/models/validate` endpoint

## Common Response Format

### Success Response

```typescript
// Single item
interface ApiResponse<T> {
  success: true;
  data: T;
}

// Paginated list
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
```

### Error Response

```typescript
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>; // Validation errors
  };
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not authorized |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Authentication

### Token-based Auth (JWT)

```
Authorization: Bearer <access_token>
```

- Access token expires in 15 minutes
- Refresh token expires in 7 days (or 30 days with "Remember me")
- Frontend automatically refreshes token when it expires

### Token Storage

- Access token: Memory only
- Refresh token: localStorage (with "Remember me") or sessionStorage

## Database Schema (Suggested)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Prompts
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(20) NOT NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  system_prompt TEXT,
  user_message_template TEXT,
  model VARCHAR(50) NOT NULL,
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2048,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP,
  current_version_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Prompt Versions
CREATE TABLE prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  system_prompt TEXT,
  user_message_template TEXT,
  model VARCHAR(50) NOT NULL,
  temperature DECIMAL(3,2),
  max_tokens INTEGER,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Collections
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Shares
CREATE TABLE shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(8) UNIQUE NOT NULL,
  view_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Model Providers (system config, admin managed)
CREATE TABLE model_providers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  website TEXT,
  api_docs_url TEXT,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- System Models (admin managed, shared by all users)
CREATE TABLE models (
  id VARCHAR(100) PRIMARY KEY,
  provider_id VARCHAR(50) REFERENCES model_providers(id),
  name VARCHAR(100) NOT NULL,
  capabilities TEXT[] NOT NULL,     -- ['text', 'vision', 'image', etc.]
  max_tokens INTEGER NOT NULL,
  context_window INTEGER,
  status VARCHAR(20) DEFAULT 'active', -- active, deprecated, beta, disabled
  description TEXT,
  released_at DATE,
  default_temperature DECIMAL(3,2),
  default_max_tokens INTEGER,
  pricing JSONB,                    -- {inputPer1kTokens, outputPer1kTokens, ...}
  features JSONB,                   -- {streaming, vision, functionCalling, ...}
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Model Configurations (per-user settings for system models)
CREATE TABLE user_model_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  model_id VARCHAR(100) REFERENCES models(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT TRUE,
  alias VARCHAR(100),
  api_key_encrypted TEXT,           -- Encrypted API key
  custom_endpoint TEXT,
  custom_params JSONB,              -- {temperature, maxTokens, topP}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, model_id)
);

-- User Custom Models (user-defined models)
CREATE TABLE custom_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  provider VARCHAR(50) DEFAULT 'custom',
  capabilities TEXT[] NOT NULL,
  max_tokens INTEGER NOT NULL,
  context_window INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  description TEXT,
  api_endpoint TEXT NOT NULL,
  api_key_encrypted TEXT,
  default_params JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for models
CREATE INDEX idx_models_provider ON models(provider_id);
CREATE INDEX idx_models_status ON models(status);
CREATE INDEX idx_models_capabilities ON models USING GIN(capabilities);
CREATE INDEX idx_user_model_configs_user ON user_model_configs(user_id);
CREATE INDEX idx_custom_models_user ON custom_models(user_id);
```

## Implementation Checklist

### Backend Requirements

- [ ] Set up Node.js/Express or other backend framework
- [ ] Configure PostgreSQL database
- [ ] Implement JWT authentication with refresh tokens
- [ ] Add input validation (Zod/Joi)
- [ ] Implement rate limiting
- [ ] Add CORS configuration
- [ ] Set up error handling middleware
- [ ] Implement all API endpoints
- [ ] Add database migrations
- [ ] Write API tests

### Frontend Ready

- [x] API service layer (`src/services/api.ts`)
- [x] Auth service (`src/services/authService.ts`)
- [x] Prompt service (`src/services/promptService.ts`)
- [x] Collection service (`src/services/collectionService.ts`)
- [x] Share service (`src/services/shareService.ts`)
- [x] Model service (`src/services/modelService.ts`)
- [x] Auth store with mock/real mode switch
- [x] Model store (`src/stores/modelStore.ts`)
- [x] Token management
- [x] Error handling
- [x] Loading states
- [x] Type definitions organized (`src/types/*.ts`)

### To Enable Real API

1. Set `VITE_ENABLE_MOCK_DATA=false` in `.env`
2. Set `VITE_API_BASE_URL` to your backend URL
3. Ensure CORS is configured on backend
4. Backend must implement all endpoints above
