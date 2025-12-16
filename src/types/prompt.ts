/**
 * Prompt Types
 * 提示词相关类型定义
 */

import { BaseQueryParams, TimestampedEntity } from './common';

// ============ 基础类型 ============

export type Category = 'text' | 'image' | 'audio' | 'video';
export type PromptStatus = 'active' | 'archived' | 'trash';

// ============ Prompt 实体 ============

export interface Prompt extends TimestampedEntity {
  id: string;
  title: string;
  description: string;
  category: Category;
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tags: string[];
  collectionId: string | null;
  favorite: boolean;
  status: PromptStatus;
  currentVersionId: string;
  versions: PromptVersion[];
  // 后端返回时可能包含
  createdBy?: string;
  versionsCount?: number;
}

// ============ 版本管理 ============

export interface PromptVersion {
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
  deleted?: boolean;
  deletedAt?: string;
}

// ============ API 请求类型 ============

export interface CreatePromptRequest {
  title: string;
  description?: string;
  category: Category;
  collectionId?: string | null;
  systemPrompt?: string;
  userTemplate?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  tags?: string[];
}

export interface UpdatePromptRequest {
  title?: string;
  description?: string;
  category?: Category;
  collectionId?: string | null;
  systemPrompt?: string;
  userTemplate?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tags?: string[];
  status?: PromptStatus;
}

export interface CreateVersionRequest {
  changeNote?: string;
  versionType?: 'major' | 'minor';
}

// ============ 查询参数 ============

export type PromptSortBy = 'updatedAt' | 'title' | 'createdAt';

export interface PromptQueryParams extends BaseQueryParams {
  search?: string;
  category?: Category;
  collectionId?: string;
  status?: PromptStatus;
  favorite?: boolean;
  tags?: string[];
  model?: string;
  sortBy?: PromptSortBy;
}

// ============ UI 相关类型 ============

export type QuickFilter = 'all' | 'favorites' | 'recent' | 'trash';
export type ViewMode = 'grid' | 'list';
export type TabType = 'editor' | 'metadata' | 'versions';
