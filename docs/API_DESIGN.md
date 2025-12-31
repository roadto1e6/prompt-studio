# Prompt Studio API 设计文档

## 概述

本文档定义了 Prompt Studio 前后端交互的 RESTful API 接口规范。

### 基础信息

- **Base URL**: `/api`
- **认证方式**: Bearer Token (JWT)
- **请求格式**: JSON
- **响应格式**: JSON

### 通用响应格式

```typescript
// 成功响应
interface ApiResponse<T> {
  success: true;
  data: T;
}

// 分页响应
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// 错误响应
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

### 通用错误码

| 错误码 | 描述 |
|--------|------|
| `UNAUTHORIZED` | 未认证或 Token 过期 |
| `FORBIDDEN` | 权限不足 |
| `NOT_FOUND` | 资源不存在 |
| `VALIDATION_ERROR` | 请求参数验证失败 |
| `INTERNAL_ERROR` | 服务器内部错误 |

---

## 1. 认证模块 (Auth)

### 1.1 用户登录

```
POST /auth/login
```

**请求体:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

**响应:**
```typescript
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 秒
}
```

### 1.2 用户注册

```
POST /auth/register
```

**请求体:**
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
```

**响应:** 同 `AuthResponse`

### 1.3 用户登出

```
POST /auth/logout
```

**Headers:** `Authorization: Bearer {accessToken}`

**响应:** `204 No Content`

### 1.4 刷新 Token

```
POST /auth/refresh
```

**请求体:**
```typescript
{
  refreshToken: string;
}
```

**响应:**
```typescript
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

### 1.5 获取当前用户

```
GET /auth/me
```

**Headers:** `Authorization: Bearer {accessToken}`

**响应:**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerified: boolean;
  settings: UserSettings;
}

interface UserSettings {
  language: 'en' | 'zh';
  theme: 'light' | 'dark' | 'system';
  defaultModel: string;
  emailNotifications: boolean;
}
```

### 1.6 更新用户资料

```
PATCH /auth/profile
```

**Headers:** `Authorization: Bearer {accessToken}`

**请求体:**
```typescript
interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  settings?: Partial<UserSettings>;
}
```

**响应:** `User`

### 1.7 修改密码

```
POST /auth/change-password
```

**Headers:** `Authorization: Bearer {accessToken}`

**请求体:**
```typescript
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
```

**响应:**
```typescript
{
  message: string;
}
```

### 1.8 忘记密码

```
POST /auth/forgot-password
```

**请求体:**
```typescript
interface ResetPasswordRequest {
  email: string;
}
```

**响应:**
```typescript
{
  message: string;
}
```

### 1.9 重置密码

```
POST /auth/reset-password
```

**请求体:**
```typescript
interface ConfirmResetPasswordRequest {
  token: string;
  password: string;
}
```

**响应:**
```typescript
{
  message: string;
}
```

### 1.10 发送邮箱验证

```
POST /auth/send-verification
```

**Headers:** `Authorization: Bearer {accessToken}`

**响应:**
```typescript
{
  message: string;
}
```

### 1.11 验证邮箱

```
POST /auth/verify-email
```

**请求体:**
```typescript
{
  token: string;
}
```

**响应:**
```typescript
{
  message: string;
}
```

### 1.12 OAuth 登录

```
GET /auth/oauth/{provider}
```

**路径参数:** `provider` - `google` | `github`

**响应:**
```typescript
{
  url: string; // OAuth 授权 URL
}
```

### 1.13 OAuth 回调

```
POST /auth/oauth/{provider}/callback
```

**路径参数:** `provider` - `google` | `github`

**请求体:**
```typescript
{
  code: string;
}
```

**响应:** 同 `AuthResponse`

---

## 2. Prompt 模块

### 2.1 获取 Prompt 列表

```
GET /prompts
```

**Headers:** `Authorization: Bearer {accessToken}`

**查询参数:**
| 参数 | 类型 | 描述 |
|------|------|------|
| `page` | number | 页码，默认 1 |
| `pageSize` | number | 每页数量，默认 20 |
| `search` | string | 搜索关键词 |
| `category` | string | 分类：`text` \| `image` \| `audio` \| `video` |
| `collectionId` | string | 集合 ID |
| `status` | string | 状态：`active` \| `archived` \| `trash` |
| `favorite` | boolean | 是否收藏 |
| `sortBy` | string | 排序字段：`updatedAt` \| `createdAt` \| `title` |
| `sortOrder` | string | 排序方向：`asc` \| `desc` |
| `tags` | string | 标签，逗号分隔 |

**响应:** `PaginatedResponse<Prompt>`

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
  createdBy?: string;
  versionsCount?: number;
  createdAt: string;
  updatedAt: string;
}
```

### 2.2 获取单个 Prompt

```
GET /prompts/{id}
```

**响应:** `Prompt`

### 2.3 创建 Prompt

```
POST /prompts
```

**请求体:**
```typescript
interface CreatePromptRequest {
  title: string;
  description?: string;
  category: 'text' | 'image' | 'audio' | 'video';
  systemPrompt?: string;
  userTemplate?: string;
  model: string;
  temperature?: number;    // 默认 0.7
  maxTokens?: number;      // 默认 2048
  tags?: string[];
  collectionId?: string | null;
}
```

**响应:** `Prompt`

### 2.4 更新 Prompt

```
PATCH /prompts/{id}
```

**请求体:**
```typescript
interface UpdatePromptRequest {
  title?: string;
  description?: string;
  category?: 'text' | 'image' | 'audio' | 'video';
  systemPrompt?: string;
  userTemplate?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tags?: string[];
  collectionId?: string | null;
  favorite?: boolean;
  status?: 'active' | 'archived' | 'trash';
}
```

**响应:** `Prompt`

### 2.5 删除 Prompt（永久删除）

```
DELETE /prompts/{id}
```

**响应:** `204 No Content`

### 2.6 批量更新

```
PATCH /prompts/batch
```

**请求体:**
```typescript
{
  ids: string[];
  ...UpdatePromptRequest
}
```

**响应:** `Prompt[]`

### 2.7 批量删除

```
DELETE /prompts/batch
```

**请求体:**
```typescript
{
  ids: string[];
}
```

**响应:** `204 No Content`

### 2.8 获取统计信息

```
GET /prompts/stats
```

**响应:**
```typescript
{
  total: number;
  byCategory: Record<Category, number>;
  byStatus: Record<PromptStatus, number>;
  favorites: number;
  recentlyUpdated: number;
}
```

---

## 3. Prompt 版本管理

### 3.1 获取版本列表

```
GET /prompts/{promptId}/versions
```

**响应:**
```typescript
interface PromptVersion {
  id: string;
  promptId: string;
  versionNumber: string;   // 如 "1.0", "1.1", "2.0"
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  changeNote: string;
  createdAt: string;
  createdBy: string;
  deleted?: boolean;
  deletedAt?: string;
}
```

### 3.2 创建新版本

```
POST /prompts/{promptId}/versions
```

**请求体:**
```typescript
interface CreateVersionRequest {
  changeNote: string;
  versionType?: 'major' | 'minor';  // major: 1.0→2.0, minor: 1.0→1.1
}
```

**响应:** `PromptVersion`

### 3.3 恢复到指定版本

```
POST /prompts/{promptId}/versions/{versionId}/restore
```

**响应:** `Prompt` (更新后的 Prompt)

### 3.4 删除版本（软删除）

```
DELETE /prompts/{promptId}/versions/{versionId}
```

**响应:** `204 No Content`

### 3.5 恢复已删除的版本

```
POST /prompts/{promptId}/versions/{versionId}/restore-deleted
```

**响应:** `PromptVersion`

### 3.6 永久删除版本

```
DELETE /prompts/{promptId}/versions/{versionId}/permanent
```

**响应:** `204 No Content`

---

## 4. Collection 模块

### 4.1 获取 Collection 列表

```
GET /collections
```

**查询参数:**
| 参数 | 类型 | 描述 |
|------|------|------|
| `page` | number | 页码 |
| `pageSize` | number | 每页数量 |
| `search` | string | 搜索关键词 |
| `sortBy` | string | 排序：`name` \| `createdAt` \| `updatedAt` \| `promptCount` |
| `sortOrder` | string | 排序方向 |

**响应:** `PaginatedResponse<Collection>`

```typescript
interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;          // 颜色代码
  icon: string;           // 图标标识
  promptCount: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4.2 获取所有 Collection（不分页）

```
GET /collections/all
```

**响应:** `Collection[]`

### 4.3 获取单个 Collection

```
GET /collections/{id}
```

**响应:** `Collection`

### 4.4 创建 Collection

```
POST /collections
```

**请求体:**
```typescript
interface CreateCollectionRequest {
  name: string;
  description?: string;
  color: string;
  icon?: string;
}
```

**响应:** `Collection`

### 4.5 更新 Collection

```
PATCH /collections/{id}
```

**请求体:**
```typescript
interface UpdateCollectionRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}
```

**响应:** `Collection`

### 4.6 删除 Collection

```
DELETE /collections/{id}
```

**响应:** `204 No Content`

> 注意：删除 Collection 不会删除其中的 Prompt，只是将 Prompt 的 `collectionId` 设为 `null`

### 4.7 获取 Collection 下的 Prompt

```
GET /collections/{id}/prompts
```

**响应:**
```typescript
{
  prompts: string[];  // Prompt IDs
  count: number;
}
```

### 4.8 批量移动 Prompt 到 Collection

```
POST /collections/{collectionId}/prompts
```

**请求体:**
```typescript
{
  promptIds: string[];
}
```

**响应:**
```typescript
{
  updated: number;
}
```

### 4.9 从 Collection 移除 Prompt

```
DELETE /collections/{collectionId}/prompts
```

**请求体:**
```typescript
{
  promptIds: string[];
}
```

**响应:**
```typescript
{
  updated: number;
}
```

### 4.10 获取 Collection 统计

```
GET /collections/stats
```

**响应:**
```typescript
{
  total: number;
  withPrompts: number;
  empty: number;
}
```

---

## 5. Model 模块

### 5.1 获取模型列表

```
GET /models
```

**查询参数:**
| 参数 | 类型 | 描述 |
|------|------|------|
| `category` | string | 能力类型：`text` \| `image` \| `audio` \| `video` |
| `providerId` | string | 提供商 ID |
| `status` | string | 状态：`active` \| `deprecated` \| `beta` |
| `search` | string | 搜索关键词 |

**响应:**
```typescript
interface GetModelsResponse {
  providers: Provider[];
  models: Model[];
}

interface Provider {
  id: string;
  name: string;
  website?: string;
  apiDocsUrl?: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
  contributedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface Model {
  id: string;
  name: string;
  providerId: string;
  capabilities: ('text' | 'image' | 'audio' | 'video' | 'embedding' | 'vision')[];
  maxTokens: number;
  contextWindow?: number;
  status: 'active' | 'deprecated' | 'beta';
  description?: string;
  releasedAt?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
  pricing?: {
    inputPer1kTokens?: number;
    outputPer1kTokens?: number;
    perImage?: number;
    perMinute?: number;
    currency: string;
  };
  features?: {
    streaming?: boolean;
    vision?: boolean;
    functionCalling?: boolean;
    jsonMode?: boolean;
  };
  sortOrder: number;
  sourceType: 'system' | 'user';
  userId?: string;
  useCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### 5.2 获取提供商列表

```
GET /models/providers
```

**响应:** `Provider[]`

### 5.3 获取单个提供商

```
GET /models/providers/{id}
```

**响应:**
```typescript
Provider & {
  models: Model[];
}
```

### 5.4 创建提供商

```
POST /models/providers
```

**请求体:**
```typescript
interface CreateProviderRequest {
  id: string;
  name: string;
  website?: string;
  apiDocsUrl?: string;
  description?: string;
  logoUrl?: string;
}
```

**响应:** `Provider`

### 5.5 更新提供商

```
PATCH /models/providers/{id}
```

**请求体:**
```typescript
interface UpdateProviderRequest {
  name?: string;
  website?: string;
  apiDocsUrl?: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
}
```

**响应:** `Provider`

### 5.6 删除提供商

```
DELETE /models/providers/{id}
```

**响应:** `204 No Content`

### 5.7 获取单个模型

```
GET /models/{id}
```

**响应:** `Model`

### 5.8 创建模型

```
POST /models
```

**请求体:**
```typescript
interface CreateModelRequest {
  id: string;
  name: string;
  providerId: string;
  capabilities: ModelCapability[];
  maxTokens: number;
  contextWindow?: number;
  status?: 'active' | 'deprecated' | 'beta';
  description?: string;
  releasedAt?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
  pricing?: ModelPricing;
  features?: ModelFeatures;
}
```

**响应:** `Model`

### 5.9 更新模型

```
PATCH /models/{id}
```

**请求体:**
```typescript
interface UpdateModelRequest {
  name?: string;
  capabilities?: ModelCapability[];
  maxTokens?: number;
  contextWindow?: number;
  status?: 'active' | 'deprecated' | 'beta';
  description?: string;
  releasedAt?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
  pricing?: ModelPricing;
  features?: ModelFeatures;
}
```

**响应:** `Model`

### 5.10 删除模型

```
DELETE /models/{id}
```

**响应:** `204 No Content`

### 5.11 增加模型使用次数

```
POST /models/{id}/use
```

**响应:** `204 No Content`

### 5.12 获取模型统计

```
GET /models/stats
```

**响应:**
```typescript
interface ModelStatsResponse {
  totalProviders: number;
  totalModels: number;
  modelsByCapability: Array<{
    capabilities: string[];
    _count: number;
  }>;
  modelsByProvider: Array<{
    providerId: string;
    _count: number;
  }>;
  topModels: Array<{
    id: string;
    name: string;
    providerId: string;
    useCount: number;
  }>;
}
```

---

## 6. Share 模块

### 6.1 创建分享

```
POST /shares
```

**请求体:**
```typescript
interface CreateShareRequest {
  promptId: string;
  expiresIn?: number;  // 过期时间（小时），不传则永不过期
}
```

**响应:**
```typescript
interface CreateShareResponse {
  id: string;
  code: string;           // 8位短码
  shareUrl: string;       // 完整分享链接
  expiresAt?: string;
}
```

### 6.2 获取分享内容

```
GET /shares/{code}
```

**响应:**
```typescript
interface GetShareResponse {
  prompt: SharedPromptData;
  sharedBy: {
    name: string;
    avatar?: string;
  };
  viewCount: number;
  createdAt: string;
  expiresAt?: string;
}

interface SharedPromptData {
  title: string;
  description: string;
  category: 'text' | 'image' | 'audio' | 'video';
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tags: string[];
  sharedAt: string;
  sharedBy: string;
}
```

### 6.3 通过分享码导入

```
POST /prompts/import
```

**请求体:**
```typescript
{
  shareCode: string;
}
```

**响应:** `Prompt` (新创建的 Prompt)

### 6.4 获取分享链接（Prompt 级别）

```
GET /prompts/{id}/share
```

**响应:**
```typescript
{
  shareCode: string;
  shareUrl: string;
}
```

---

## 7. 数据类型定义

### 7.1 Category

```typescript
type Category = 'text' | 'image' | 'audio' | 'video';
```

### 7.2 PromptStatus

```typescript
type PromptStatus = 'active' | 'archived' | 'trash';
```

### 7.3 ModelStatus

```typescript
type ModelStatus = 'active' | 'deprecated' | 'beta';
```

### 7.4 ModelCapability

```typescript
type ModelCapability = 'text' | 'image' | 'audio' | 'video' | 'embedding' | 'vision';
```

### 7.5 SortOrder

```typescript
type SortOrder = 'asc' | 'desc';
```

---

## 8. HTTP 状态码

| 状态码 | 描述 |
|--------|------|
| `200` | 成功 |
| `201` | 创建成功 |
| `204` | 删除成功（无返回内容） |
| `400` | 请求参数错误 |
| `401` | 未认证 |
| `403` | 权限不足 |
| `404` | 资源不存在 |
| `409` | 资源冲突（如重复创建） |
| `422` | 验证错误 |
| `500` | 服务器内部错误 |

---

## 9. 认证流程

### 9.1 Token 机制

- **Access Token**: 短期有效（默认 15 分钟）
- **Refresh Token**: 长期有效（默认 7 天）

### 9.2 请求头格式

```
Authorization: Bearer {accessToken}
```

### 9.3 Token 刷新流程

1. 客户端发起请求
2. 服务端返回 `401 Unauthorized`
3. 客户端使用 `refreshToken` 调用 `/auth/refresh`
4. 获取新的 `accessToken` 和 `refreshToken`
5. 重试原请求

---

## 10. 版本历史

| 版本 | 日期 | 描述 |
|------|------|------|
| 1.0.0 | 2024-12-28 | 初始版本 |
