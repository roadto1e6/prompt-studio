import { FastifyRequest } from 'fastify';

// ============================================
// Extended Fastify Types
// ============================================

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
    requestId?: string;
    startTime?: bigint;
  }
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<PaginatedData<T>> {}

// ============================================
// User Types
// ============================================

export interface UserSettings {
  language: 'en' | 'zh';
  theme: 'light' | 'dark' | 'system';
  defaultModel: string;
  emailNotifications: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  emailVerified: boolean;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================
// Prompt Types
// ============================================

export type PromptCategory = 'text' | 'image' | 'audio' | 'video';
export type PromptStatus = 'active' | 'archived' | 'trash';

export interface PromptVersion {
  id: string;
  versionNumber: string;
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  changeNote: string;
  createdAt: Date;
  createdBy: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tags: string[];
  favorite: boolean;
  status: PromptStatus;
  currentVersionId: string | null;
  collectionId: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  versions?: PromptVersion[];
}

// ============================================
// Collection Types
// ============================================

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  userId: string;
  promptCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Share Types
// ============================================

export interface ShareData {
  type: 'prompt' | 'collection';
  prompt?: Partial<Prompt>;
  collection?: Partial<Collection> & { prompts?: Partial<Prompt>[] };
}

export interface Share {
  id: string;
  code: string;
  data: ShareData;
  password: string | null;
  viewCount: number;
  expiresAt: Date | null;
  userId: string;
  createdAt: Date;
}

export interface ShareInfo {
  id: string;
  code: string;
  type: string;
  title: string;
  viewCount: number;
  expiresAt: Date | null;
  createdAt: Date;
  hasPassword: boolean;
  isExpired: boolean;
}

// ============================================
// Stats Types
// ============================================

export interface PromptStats {
  total: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  favorites: number;
}

export interface CollectionStats {
  total: number;
  withPrompts: number;
  empty: number;
}

export interface ShareStats {
  total: number;
  active: number;
  expired: number;
  totalViews: number;
}
