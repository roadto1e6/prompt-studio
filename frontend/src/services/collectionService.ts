/**
 * Collection Service
 * Collection 相关的 API 调用
 */

import { api, PaginatedResponse } from './api';
import type { Collection } from '@/types';

// 查询参数
export interface CollectionQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'updatedAt' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

// 创建 Collection 请求
export interface CreateCollectionRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

// 更新 Collection 请求
export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export const collectionService = {
  /**
   * 获取 Collection 列表
   */
  getCollections: async (params?: CollectionQueryParams): Promise<PaginatedResponse<Collection>> => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
      if (params.search) queryParams.set('search', params.search);
      if (params.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);
    }

    const query = queryParams.toString();
    return api.get<PaginatedResponse<Collection>>(`/collections${query ? `?${query}` : ''}`);
  },

  /**
   * 获取所有 Collection（不分页）
   */
  getAllCollections: async (): Promise<Collection[]> => {
    return api.get<Collection[]>('/collections/all');
  },

  /**
   * 获取单个 Collection
   */
  getCollection: async (id: string): Promise<Collection> => {
    return api.get<Collection>(`/collections/${id}`);
  },

  /**
   * 创建 Collection
   */
  createCollection: async (data: CreateCollectionRequest): Promise<Collection> => {
    return api.post<Collection>('/collections', data);
  },

  /**
   * 更新 Collection
   */
  updateCollection: async (id: string, data: UpdateCollectionRequest): Promise<Collection> => {
    return api.patch<Collection>(`/collections/${id}`, data);
  },

  /**
   * 删除 Collection
   */
  deleteCollection: async (id: string): Promise<void> => {
    return api.delete<void>(`/collections/${id}`);
  },

  /**
   * 获取 Collection 下的所有 Prompt
   */
  getCollectionPrompts: async (id: string): Promise<{ prompts: string[]; count: number }> => {
    return api.get<{ prompts: string[]; count: number }>(`/collections/${id}/prompts`);
  },

  /**
   * 批量移动 Prompt 到 Collection
   */
  movePromptsToCollection: async (
    collectionId: string,
    promptIds: string[]
  ): Promise<{ updated: number }> => {
    return api.post<{ updated: number }>(`/collections/${collectionId}/prompts`, {
      promptIds,
    });
  },

  /**
   * 从 Collection 移除 Prompt
   */
  removePromptsFromCollection: async (
    collectionId: string,
    promptIds: string[]
  ): Promise<{ updated: number }> => {
    return api.delete<{ updated: number }>(`/collections/${collectionId}/prompts`, {
      body: JSON.stringify({ promptIds }),
    });
  },

  /**
   * 获取 Collection 统计
   */
  getStats: async (): Promise<{
    total: number;
    withPrompts: number;
    empty: number;
  }> => {
    return api.get('/collections/stats');
  },
};

export default collectionService;
