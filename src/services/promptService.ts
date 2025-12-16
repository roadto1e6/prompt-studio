/**
 * Prompt Service
 * Prompt 相关的 API 调用
 */

import { api, PaginatedResponse } from './api';
import type { Prompt, PromptVersion, Category, PromptStatus } from '@/types';

// 查询参数
export interface PromptQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: Category;
  collectionId?: string;
  status?: PromptStatus;
  favorite?: boolean;
  sortBy?: 'updatedAt' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  tags?: string[];
}

// 创建 Prompt 请求
export interface CreatePromptRequest {
  title: string;
  description?: string;
  category: Category;
  systemPrompt?: string;
  userTemplate?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tags?: string[];
  collectionId?: string | null;
}

// 更新 Prompt 请求
export interface UpdatePromptRequest {
  title?: string;
  description?: string;
  category?: Category;
  systemPrompt?: string;
  userTemplate?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tags?: string[];
  collectionId?: string | null;
  favorite?: boolean;
  status?: PromptStatus;
}

// 创建版本请求
export interface CreateVersionRequest {
  changeNote: string;
  versionType?: 'major' | 'minor';
}

export const promptService = {
  /**
   * 获取 Prompt 列表
   */
  getPrompts: async (params?: PromptQueryParams): Promise<PaginatedResponse<Prompt>> => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
      if (params.search) queryParams.set('search', params.search);
      if (params.category) queryParams.set('category', params.category);
      if (params.collectionId) queryParams.set('collectionId', params.collectionId);
      if (params.status) queryParams.set('status', params.status);
      if (params.favorite !== undefined) queryParams.set('favorite', params.favorite.toString());
      if (params.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);
      if (params.tags?.length) queryParams.set('tags', params.tags.join(','));
    }

    const query = queryParams.toString();
    return api.get<PaginatedResponse<Prompt>>(`/prompts${query ? `?${query}` : ''}`);
  },

  /**
   * 获取单个 Prompt
   */
  getPrompt: async (id: string): Promise<Prompt> => {
    return api.get<Prompt>(`/prompts/${id}`);
  },

  /**
   * 创建 Prompt
   */
  createPrompt: async (data: CreatePromptRequest): Promise<Prompt> => {
    return api.post<Prompt>('/prompts', data);
  },

  /**
   * 更新 Prompt
   */
  updatePrompt: async (id: string, data: UpdatePromptRequest): Promise<Prompt> => {
    return api.patch<Prompt>(`/prompts/${id}`, data);
  },

  /**
   * 删除 Prompt（永久删除）
   */
  deletePrompt: async (id: string): Promise<void> => {
    return api.delete<void>(`/prompts/${id}`);
  },

  /**
   * 移至回收站
   */
  moveToTrash: async (id: string): Promise<Prompt> => {
    return api.patch<Prompt>(`/prompts/${id}`, { status: 'trash' });
  },

  /**
   * 从回收站恢复
   */
  restoreFromTrash: async (id: string): Promise<Prompt> => {
    return api.patch<Prompt>(`/prompts/${id}`, { status: 'active' });
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite: async (id: string, favorite: boolean): Promise<Prompt> => {
    return api.patch<Prompt>(`/prompts/${id}`, { favorite });
  },

  /**
   * 批量操作
   */
  batchUpdate: async (ids: string[], data: UpdatePromptRequest): Promise<Prompt[]> => {
    return api.patch<Prompt[]>('/prompts/batch', { ids, ...data });
  },

  /**
   * 批量删除
   */
  batchDelete: async (ids: string[]): Promise<void> => {
    return api.delete<void>('/prompts/batch', {
      body: JSON.stringify({ ids }),
    });
  },

  // ============ 版本相关 ============

  /**
   * 获取 Prompt 的所有版本
   */
  getVersions: async (promptId: string): Promise<PromptVersion[]> => {
    return api.get<PromptVersion[]>(`/prompts/${promptId}/versions`);
  },

  /**
   * 创建新版本
   */
  createVersion: async (promptId: string, data: CreateVersionRequest): Promise<PromptVersion> => {
    return api.post<PromptVersion>(`/prompts/${promptId}/versions`, data);
  },

  /**
   * 恢复到指定版本
   */
  restoreVersion: async (promptId: string, versionId: string): Promise<Prompt> => {
    return api.post<Prompt>(`/prompts/${promptId}/versions/${versionId}/restore`);
  },

  /**
   * 删除版本（软删除）
   */
  deleteVersion: async (promptId: string, versionId: string): Promise<void> => {
    return api.delete<void>(`/prompts/${promptId}/versions/${versionId}`);
  },

  /**
   * 恢复已删除的版本
   */
  restoreDeletedVersion: async (promptId: string, versionId: string): Promise<PromptVersion> => {
    return api.post<PromptVersion>(`/prompts/${promptId}/versions/${versionId}/restore-deleted`);
  },

  /**
   * 永久删除版本
   */
  permanentDeleteVersion: async (promptId: string, versionId: string): Promise<void> => {
    return api.delete<void>(`/prompts/${promptId}/versions/${versionId}/permanent`);
  },

  // ============ 分享相关 ============

  /**
   * 获取分享链接
   */
  getShareLink: async (id: string): Promise<{ shareCode: string; shareUrl: string }> => {
    return api.get<{ shareCode: string; shareUrl: string }>(`/prompts/${id}/share`);
  },

  /**
   * 通过分享码导入
   */
  importFromShare: async (shareCode: string): Promise<Prompt> => {
    return api.post<Prompt>('/prompts/import', { shareCode });
  },

  // ============ 统计相关 ============

  /**
   * 获取用户的 Prompt 统计
   */
  getStats: async (): Promise<{
    total: number;
    byCategory: Record<Category, number>;
    byStatus: Record<PromptStatus, number>;
    favorites: number;
    recentlyUpdated: number;
  }> => {
    return api.get('/prompts/stats');
  },
};

export default promptService;
