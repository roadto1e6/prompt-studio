/**
 * Prompt Service
 * 统一的数据访问层，抽象 Mock/API 实现细节
 */

import { api, PaginatedResponse } from './api';
import { mockPrompts } from '@/data/mockData';
import { generateId, generateVersionNumber } from '@/utils';
import type { Prompt, PromptVersion, Category, PromptStatus } from '@/types';

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

// 内存中的 Mock 数据存储
let mockData = [...mockPrompts];

// ============ 类型定义 ============

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

export interface CreatePromptRequest {
  title: string;
  category: Category;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tags?: string[];
  collectionId?: string | null;
}

export interface UpdatePromptRequest {
  title?: string;
  category?: Category;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tags?: string[];
  collectionId?: string | null;
  favorite?: boolean;
  status?: PromptStatus;
}

export interface CreateVersionRequest {
  changeNote: string;
  versionType?: 'major' | 'minor';
}

// ============ Mock 实现 ============

const mockService = {
  getPrompts: async (params?: PromptQueryParams): Promise<PaginatedResponse<Prompt>> => {
    await delay(100); // 模拟网络延迟

    let filtered = [...mockData];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (params?.category) {
      filtered = filtered.filter(p => p.category === params.category);
    }
    if (params?.status) {
      filtered = filtered.filter(p => p.status === params.status);
    }
    if (params?.favorite !== undefined) {
      filtered = filtered.filter(p => p.favorite === params.favorite);
    }
    if (params?.collectionId) {
      filtered = filtered.filter(p => p.collectionId === params.collectionId);
    }

    // 排序
    const sortBy = params?.sortBy || 'updatedAt';
    const sortOrder = params?.sortOrder || 'desc';
    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'title') {
        cmp = a.title.localeCompare(b.title);
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

  getPrompt: async (id: string): Promise<Prompt> => {
    await delay(50);
    const prompt = mockData.find(p => p.id === id);
    if (!prompt) throw new Error('Prompt not found');
    return prompt;
  },

  createPrompt: async (data: CreatePromptRequest): Promise<Prompt> => {
    await delay(100);
    const now = new Date().toISOString();
    const id = generateId();
    const versionId = generateId();

    const newPrompt: Prompt = {
      id,
      title: data.title || 'Untitled Prompt',
      description: '',
      category: data.category || 'text',
      systemPrompt: data.systemPrompt || '',
      userTemplate: '',
      model: data.model || 'gpt-4-turbo',
      temperature: data.temperature ?? 0.7,
      maxTokens: data.maxTokens ?? 2048,
      tags: data.tags || [],
      collectionId: data.collectionId || null,
      favorite: false,
      createdAt: now,
      updatedAt: now,
      status: 'active',
      currentVersionId: versionId,
      versions: [{
        id: versionId,
        promptId: id,
        versionNumber: '1.0',
        systemPrompt: data.systemPrompt || '',
        userTemplate: '',
        model: data.model || 'gpt-4-turbo',
        temperature: data.temperature ?? 0.7,
        maxTokens: data.maxTokens ?? 2048,
        changeNote: 'Initial creation.',
        createdAt: now,
        createdBy: 'user-1',
      }],
    };

    mockData = [newPrompt, ...mockData];
    return newPrompt;
  },

  updatePrompt: async (id: string, data: UpdatePromptRequest): Promise<Prompt> => {
    await delay(100);
    const index = mockData.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Prompt not found');

    const updated = {
      ...mockData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    mockData[index] = updated;
    return updated;
  },

  deletePrompt: async (id: string): Promise<void> => {
    await delay(100);
    mockData = mockData.filter(p => p.id !== id);
  },

  toggleFavorite: async (id: string, favorite: boolean): Promise<Prompt> => {
    return mockService.updatePrompt(id, { favorite });
  },

  moveToTrash: async (id: string): Promise<Prompt> => {
    return mockService.updatePrompt(id, { status: 'trash' });
  },

  restoreFromTrash: async (id: string): Promise<Prompt> => {
    return mockService.updatePrompt(id, { status: 'active' });
  },

  createVersion: async (promptId: string, data: CreateVersionRequest): Promise<PromptVersion> => {
    await delay(100);
    const prompt = mockData.find(p => p.id === promptId);
    if (!prompt) throw new Error('Prompt not found');

    const now = new Date().toISOString();
    const versionId = generateId();
    const versionNumber = generateVersionNumber(
      prompt.versions,
      prompt.currentVersionId,
      data.versionType || 'minor'
    );

    const newVersion: PromptVersion = {
      id: versionId,
      promptId,
      versionNumber,
      systemPrompt: prompt.systemPrompt,
      userTemplate: '',
      model: prompt.model,
      temperature: prompt.temperature,
      maxTokens: prompt.maxTokens,
      changeNote: data.changeNote,
      createdAt: now,
      createdBy: 'user-1',
    };

    const index = mockData.findIndex(p => p.id === promptId);
    mockData[index] = {
      ...prompt,
      currentVersionId: versionId,
      versions: [newVersion, ...prompt.versions],
      updatedAt: now,
    };

    return newVersion;
  },

  restoreVersion: async (promptId: string, versionId: string): Promise<Prompt> => {
    await delay(100);
    const prompt = mockData.find(p => p.id === promptId);
    if (!prompt) throw new Error('Prompt not found');

    const version = prompt.versions.find(v => v.id === versionId);
    if (!version) throw new Error('Version not found');

    const index = mockData.findIndex(p => p.id === promptId);
    const updated = {
      ...prompt,
      systemPrompt: version.systemPrompt,
      userTemplate: '',
      model: version.model,
      temperature: version.temperature,
      maxTokens: version.maxTokens,
      currentVersionId: versionId,
      updatedAt: new Date().toISOString(),
    };
    mockData[index] = updated;
    return updated;
  },

  deleteVersion: async (promptId: string, versionId: string): Promise<void> => {
    await delay(100);
    const prompt = mockData.find(p => p.id === promptId);
    if (!prompt) throw new Error('Prompt not found');

    const index = mockData.findIndex(p => p.id === promptId);
    mockData[index] = {
      ...prompt,
      versions: prompt.versions.map(v =>
        v.id === versionId ? { ...v, deleted: true, deletedAt: new Date().toISOString() } : v
      ),
      updatedAt: new Date().toISOString(),
    };
  },

  restoreDeletedVersion: async (promptId: string, versionId: string): Promise<PromptVersion> => {
    await delay(100);
    const prompt = mockData.find(p => p.id === promptId);
    if (!prompt) throw new Error('Prompt not found');

    const version = prompt.versions.find(v => v.id === versionId);
    if (!version) throw new Error('Version not found');

    const index = mockData.findIndex(p => p.id === promptId);
    const restoredVersion = { ...version, deleted: false, deletedAt: undefined };
    mockData[index] = {
      ...prompt,
      versions: prompt.versions.map(v => v.id === versionId ? restoredVersion : v),
      updatedAt: new Date().toISOString(),
    };
    return restoredVersion;
  },

  permanentDeleteVersion: async (promptId: string, versionId: string): Promise<void> => {
    await delay(100);
    const prompt = mockData.find(p => p.id === promptId);
    if (!prompt) throw new Error('Prompt not found');

    const index = mockData.findIndex(p => p.id === promptId);
    mockData[index] = {
      ...prompt,
      versions: prompt.versions.filter(v => v.id !== versionId),
      updatedAt: new Date().toISOString(),
    };
  },
};

// ============ API 实现 ============

const apiService = {
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

  getPrompt: async (id: string): Promise<Prompt> => {
    return api.get<Prompt>(`/prompts/${id}`);
  },

  createPrompt: async (data: CreatePromptRequest): Promise<Prompt> => {
    return api.post<Prompt>('/prompts', data);
  },

  updatePrompt: async (id: string, data: UpdatePromptRequest): Promise<Prompt> => {
    return api.patch<Prompt>(`/prompts/${id}`, data);
  },

  deletePrompt: async (id: string): Promise<void> => {
    return api.delete<void>(`/prompts/${id}`);
  },

  toggleFavorite: async (id: string, favorite: boolean): Promise<Prompt> => {
    return api.patch<Prompt>(`/prompts/${id}`, { favorite });
  },

  moveToTrash: async (id: string): Promise<Prompt> => {
    return api.patch<Prompt>(`/prompts/${id}`, { status: 'trash' });
  },

  restoreFromTrash: async (id: string): Promise<Prompt> => {
    return api.patch<Prompt>(`/prompts/${id}`, { status: 'active' });
  },

  createVersion: async (promptId: string, data: CreateVersionRequest): Promise<PromptVersion> => {
    return api.post<PromptVersion>(`/prompts/${promptId}/versions`, data);
  },

  restoreVersion: async (promptId: string, versionId: string): Promise<Prompt> => {
    return api.post<Prompt>(`/prompts/${promptId}/versions/${versionId}/restore`);
  },

  deleteVersion: async (promptId: string, versionId: string): Promise<void> => {
    return api.delete<void>(`/prompts/${promptId}/versions/${versionId}`);
  },

  restoreDeletedVersion: async (promptId: string, versionId: string): Promise<PromptVersion> => {
    return api.post<PromptVersion>(`/prompts/${promptId}/versions/${versionId}/restore-deleted`);
  },

  permanentDeleteVersion: async (promptId: string, versionId: string): Promise<void> => {
    return api.delete<void>(`/prompts/${promptId}/versions/${versionId}/permanent`);
  },
};

// ============ 工具函数 ============

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ 导出统一接口 ============

export const promptService = USE_MOCK ? mockService : apiService;

export default promptService;
