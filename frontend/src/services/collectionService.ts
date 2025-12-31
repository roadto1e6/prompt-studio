/**
 * Collection Service
 * 统一的数据访问层，抽象 Mock/API 实现细节
 */

import { api, PaginatedResponse } from './api';
import { mockCollections } from '@/data/mockData';
import { generateId } from '@/utils';
import { COLLECTION_COLORS } from '@/constants';
import type { Collection } from '@/types';

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

// 内存中的 Mock 数据存储
let mockData = [...mockCollections];

// ============ 类型定义 ============

export interface CollectionQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'updatedAt' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

// ============ 工具函数 ============

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ Mock 实现 ============

const mockService = {
  getCollections: async (params?: CollectionQueryParams): Promise<PaginatedResponse<Collection>> => {
    await delay(100);

    let filtered = [...mockData];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    // 排序
    const sortBy = params?.sortBy || 'updatedAt';
    const sortOrder = params?.sortOrder || 'desc';
    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else {
        cmp = new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime();
      }
      return sortOrder === 'asc' ? -cmp : cmp;
    });

    // 分页
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  getAllCollections: async (): Promise<Collection[]> => {
    await delay(50);
    return [...mockData];
  },

  getCollection: async (id: string): Promise<Collection> => {
    await delay(50);
    const collection = mockData.find(c => c.id === id);
    if (!collection) throw new Error('Collection not found');
    return collection;
  },

  createCollection: async (data: CreateCollectionRequest): Promise<Collection> => {
    await delay(100);
    const now = new Date().toISOString();
    const colorIndex = mockData.length % COLLECTION_COLORS.length;

    const newCollection: Collection = {
      id: generateId(),
      name: data.name || 'New Collection',
      description: data.description || '',
      color: data.color || COLLECTION_COLORS[colorIndex],
      icon: data.icon || 'Folder',
      promptCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    mockData = [...mockData, newCollection];
    return newCollection;
  },

  updateCollection: async (id: string, data: UpdateCollectionRequest): Promise<Collection> => {
    await delay(100);
    const index = mockData.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Collection not found');

    const updated = {
      ...mockData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    mockData[index] = updated;
    return updated;
  },

  deleteCollection: async (id: string): Promise<void> => {
    await delay(100);
    mockData = mockData.filter(c => c.id !== id);
  },

  getCollectionPrompts: async (id: string): Promise<{ prompts: string[]; count: number }> => {
    await delay(50);
    // Mock: 返回空数组
    return { prompts: [], count: 0 };
  },

  movePromptsToCollection: async (
    collectionId: string,
    promptIds: string[]
  ): Promise<{ updated: number }> => {
    await delay(100);
    return { updated: promptIds.length };
  },

  removePromptsFromCollection: async (
    collectionId: string,
    promptIds: string[]
  ): Promise<{ updated: number }> => {
    await delay(100);
    return { updated: promptIds.length };
  },

  getStats: async (): Promise<{
    total: number;
    withPrompts: number;
    empty: number;
  }> => {
    await delay(50);
    const withPrompts = mockData.filter(c => c.promptCount > 0).length;
    return {
      total: mockData.length,
      withPrompts,
      empty: mockData.length - withPrompts,
    };
  },
};

// ============ API 实现 ============

const apiService = {
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

  getAllCollections: async (): Promise<Collection[]> => {
    return api.get<Collection[]>('/collections/all');
  },

  getCollection: async (id: string): Promise<Collection> => {
    return api.get<Collection>(`/collections/${id}`);
  },

  createCollection: async (data: CreateCollectionRequest): Promise<Collection> => {
    return api.post<Collection>('/collections', data);
  },

  updateCollection: async (id: string, data: UpdateCollectionRequest): Promise<Collection> => {
    return api.patch<Collection>(`/collections/${id}`, data);
  },

  deleteCollection: async (id: string): Promise<void> => {
    return api.delete<void>(`/collections/${id}`);
  },

  getCollectionPrompts: async (id: string): Promise<{ prompts: string[]; count: number }> => {
    return api.get<{ prompts: string[]; count: number }>(`/collections/${id}/prompts`);
  },

  movePromptsToCollection: async (
    collectionId: string,
    promptIds: string[]
  ): Promise<{ updated: number }> => {
    return api.post<{ updated: number }>(`/collections/${collectionId}/prompts`, { promptIds });
  },

  removePromptsFromCollection: async (
    collectionId: string,
    promptIds: string[]
  ): Promise<{ updated: number }> => {
    return api.delete<{ updated: number }>(`/collections/${collectionId}/prompts`, {
      body: JSON.stringify({ promptIds }),
    });
  },

  getStats: async (): Promise<{
    total: number;
    withPrompts: number;
    empty: number;
  }> => {
    return api.get('/collections/stats');
  },
};

// ============ 导出统一接口 ============

export const collectionService = USE_MOCK ? mockService : apiService;

export default collectionService;
