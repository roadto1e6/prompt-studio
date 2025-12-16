/**
 * Model Service
 * AI 模型相关 API 服务（众包模式）
 */

import { api } from './api';
import type {
  Provider,
  Model,
  GetModelsResponse,
  ModelStatsResponse,
  CreateProviderRequest,
  UpdateProviderRequest,
  CreateModelRequest,
  UpdateModelRequest,
  QueryModelsParams,
  ModelOption,
  GroupedModelOptions,
  Category,
} from '@/types';

// Mock 数据开关
const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_DATA !== 'false';

// ============ Mock 数据 ============

const mockProviders: Provider[] = [
  { id: 'openai', name: 'OpenAI', website: 'https://openai.com', apiDocsUrl: 'https://platform.openai.com/docs', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'anthropic', name: 'Anthropic', website: 'https://anthropic.com', apiDocsUrl: 'https://docs.anthropic.com', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'google', name: 'Google', website: 'https://ai.google.dev', apiDocsUrl: 'https://ai.google.dev/docs', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'meta', name: 'Meta', website: 'https://llama.meta.com', apiDocsUrl: 'https://llama.meta.com/docs', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'mistral', name: 'Mistral AI', website: 'https://mistral.ai', apiDocsUrl: 'https://docs.mistral.ai', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'stability', name: 'Stability AI', website: 'https://stability.ai', apiDocsUrl: 'https://platform.stability.ai/docs', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'midjourney', name: 'Midjourney', website: 'https://midjourney.com', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'elevenlabs', name: 'ElevenLabs', website: 'https://elevenlabs.io', apiDocsUrl: 'https://docs.elevenlabs.io', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'runway', name: 'Runway', website: 'https://runwayml.com', apiDocsUrl: 'https://docs.runwayml.com', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'pika', name: 'Pika', website: 'https://pika.art', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
];

const mockModels: Model[] = [
  // OpenAI - Text
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gpt-4', name: 'GPT-4', providerId: 'openai', capabilities: ['text'], maxTokens: 8192, contextWindow: 8192, status: 'active', features: { streaming: true, functionCalling: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gpt-4o', name: 'GPT-4o', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', providerId: 'openai', capabilities: ['text'], maxTokens: 16385, contextWindow: 16385, status: 'active', features: { streaming: true, functionCalling: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'o1-preview', name: 'o1 Preview', providerId: 'openai', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'beta', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'o1-mini', name: 'o1 Mini', providerId: 'openai', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'beta', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // OpenAI - Image
  { id: 'dall-e-3', name: 'DALL-E 3', providerId: 'openai', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'dall-e-2', name: 'DALL-E 2', providerId: 'openai', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // OpenAI - Audio
  { id: 'whisper-1', name: 'Whisper', providerId: 'openai', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'tts-1-hd', name: 'TTS HD', providerId: 'openai', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'tts-1', name: 'TTS', providerId: 'openai', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // Anthropic
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // Google
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 1000000, contextWindow: 1000000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 1000000, contextWindow: 1000000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gemini-pro', name: 'Gemini Pro', providerId: 'google', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // Meta
  { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', providerId: 'meta', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', providerId: 'meta', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', providerId: 'meta', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // Mistral
  { id: 'mistral-large', name: 'Mistral Large', providerId: 'mistral', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, functionCalling: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'mistral-medium', name: 'Mistral Medium', providerId: 'mistral', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'mistral-small', name: 'Mistral Small', providerId: 'mistral', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true }, sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // Stability AI - Image
  { id: 'sdxl-1.0', name: 'Stable Diffusion XL', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'sd-3', name: 'Stable Diffusion 3', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'sd-3-turbo', name: 'SD 3 Turbo', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // Midjourney - Image
  { id: 'midjourney-v6', name: 'Midjourney V6', providerId: 'midjourney', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'midjourney-v5', name: 'Midjourney V5', providerId: 'midjourney', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ElevenLabs - Audio
  { id: 'eleven-multilingual-v2', name: 'Multilingual V2', providerId: 'elevenlabs', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'eleven-turbo-v2', name: 'Turbo V2', providerId: 'elevenlabs', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // Runway - Video
  { id: 'gen-3-alpha', name: 'Gen-3 Alpha', providerId: 'runway', capabilities: ['video'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gen-2', name: 'Gen-2', providerId: 'runway', capabilities: ['video'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // Pika - Video
  { id: 'pika-1.0', name: 'Pika 1.0', providerId: 'pika', capabilities: ['video'], maxTokens: 4000, status: 'active', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // OpenAI - Video (Sora)
  { id: 'sora', name: 'Sora', providerId: 'openai', capabilities: ['video'], maxTokens: 4000, status: 'beta', sortOrder: 0, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
];

// ============ Service 实现 ============

class ModelService {
  // ============================================
  // 公共数据查询
  // ============================================

  /**
   * 获取所有模型和提供商
   */
  async getModels(params?: QueryModelsParams): Promise<GetModelsResponse> {
    if (USE_MOCK) {
      let filteredModels = mockModels;
      if (params?.category) {
        filteredModels = filteredModels.filter(m => m.capabilities.includes(params.category!));
      }
      if (params?.providerId) {
        filteredModels = filteredModels.filter(m => m.providerId === params.providerId);
      }
      if (params?.status) {
        filteredModels = filteredModels.filter(m => m.status === params.status);
      }
      if (params?.search) {
        const search = params.search.toLowerCase();
        filteredModels = filteredModels.filter(m =>
          m.name.toLowerCase().includes(search) ||
          m.description?.toLowerCase().includes(search)
        );
      }
      return { providers: mockProviders, models: filteredModels };
    }

    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.set('category', params.category);
    if (params?.providerId) queryParams.set('providerId', params.providerId);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.search) queryParams.set('search', params.search);

    const url = queryParams.toString() ? `/models?${queryParams}` : '/models';
    return api.get<GetModelsResponse>(url);
  }

  /**
   * 获取提供商列表
   */
  async getProviders(): Promise<Provider[]> {
    if (USE_MOCK) {
      return mockProviders;
    }
    return api.get<Provider[]>('/models/providers');
  }

  /**
   * 获取单个提供商（含模型列表）
   */
  async getProvider(id: string): Promise<Provider & { models: Model[] }> {
    if (USE_MOCK) {
      const provider = mockProviders.find(p => p.id === id);
      if (!provider) throw new Error('Provider not found');
      const models = mockModels.filter(m => m.providerId === id);
      return { ...provider, models };
    }
    return api.get<Provider & { models: Model[] }>(`/models/providers/${id}`);
  }

  /**
   * 获取单个模型
   */
  async getModel(id: string): Promise<Model> {
    if (USE_MOCK) {
      const model = mockModels.find(m => m.id === id);
      if (!model) throw new Error('Model not found');
      return model;
    }
    return api.get<Model>(`/models/${id}`);
  }

  /**
   * 获取模型统计
   */
  async getStats(): Promise<ModelStatsResponse> {
    if (USE_MOCK) {
      return {
        totalProviders: mockProviders.length,
        totalModels: mockModels.length,
        modelsByCapability: [],
        modelsByProvider: [],
        topModels: mockModels.slice(0, 10).map(m => ({
          id: m.id,
          name: m.name,
          providerId: m.providerId,
          useCount: m.useCount,
        })),
      };
    }
    return api.get<ModelStatsResponse>('/models/stats');
  }

  // ============================================
  // 提供商管理（众包）
  // ============================================

  /**
   * 创建提供商
   */
  async createProvider(data: CreateProviderRequest): Promise<Provider> {
    if (USE_MOCK) {
      const provider: Provider = {
        ...data,
        isActive: true,
        contributedBy: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockProviders.push(provider);
      return provider;
    }
    return api.post<Provider>('/models/providers', data);
  }

  /**
   * 更新提供商
   */
  async updateProvider(id: string, data: UpdateProviderRequest): Promise<Provider> {
    if (USE_MOCK) {
      const index = mockProviders.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Provider not found');
      mockProviders[index] = { ...mockProviders[index], ...data, updatedAt: new Date().toISOString() };
      return mockProviders[index];
    }
    return api.patch<Provider>(`/models/providers/${id}`, data);
  }

  /**
   * 删除提供商
   */
  async deleteProvider(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = mockProviders.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Provider not found');
      mockProviders.splice(index, 1);
      return;
    }
    await api.delete(`/models/providers/${id}`);
  }

  // ============================================
  // 模型管理（众包）
  // ============================================

  /**
   * 创建模型（系统模型 - 管理员操作）
   */
  async createModel(data: CreateModelRequest): Promise<Model> {
    if (USE_MOCK) {
      const model: Model = {
        ...data,
        status: data.status || 'active',
        sortOrder: 0,
        sourceType: 'system',
        contributedBy: null,
        useCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockModels.push(model);
      return model;
    }
    return api.post<Model>('/models', data);
  }

  /**
   * 更新模型
   */
  async updateModel(id: string, data: UpdateModelRequest): Promise<Model> {
    if (USE_MOCK) {
      const index = mockModels.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Model not found');
      mockModels[index] = { ...mockModels[index], ...data, updatedAt: new Date().toISOString() };
      return mockModels[index];
    }
    return api.patch<Model>(`/models/${id}`, data);
  }

  /**
   * 删除模型
   */
  async deleteModel(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = mockModels.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Model not found');
      mockModels.splice(index, 1);
      return;
    }
    await api.delete(`/models/${id}`);
  }

  /**
   * 增加模型使用次数
   */
  async incrementUseCount(modelId: string): Promise<void> {
    if (USE_MOCK) {
      const model = mockModels.find(m => m.id === modelId);
      if (model) model.useCount++;
      return;
    }
    await api.post(`/models/${modelId}/use`);
  }

  // ============================================
  // UI 辅助方法
  // ============================================

  /**
   * 获取模型选项（用于下拉框）
   */
  getModelOptions(
    models: Model[],
    providers: Provider[],
    options?: { category?: Category; includeDisabled?: boolean }
  ): GroupedModelOptions[] {
    const { category, includeDisabled = false } = options || {};

    // 过滤模型
    let filteredModels = models;
    if (category) {
      filteredModels = models.filter(m => m.capabilities.includes(category));
    }
    if (!includeDisabled) {
      filteredModels = filteredModels.filter(m => m.status !== 'deprecated');
    }

    // 按提供商分组
    const providerMap = new Map<string, ModelOption[]>();

    for (const model of filteredModels) {
      const provider = providers.find(p => p.id === model.providerId);
      const option: ModelOption = {
        value: model.id,
        label: model.name,
        provider: model.providerId,
        providerName: provider?.name || model.providerId,
        maxTokens: model.maxTokens,
        disabled: model.status === 'deprecated',
        badge: model.status === 'beta' ? 'beta' : model.status === 'deprecated' ? 'deprecated' : undefined,
        useCount: model.useCount,
      };

      const existing = providerMap.get(model.providerId) || [];
      providerMap.set(model.providerId, [...existing, option]);
    }

    // 转换为数组
    const result: GroupedModelOptions[] = [];
    for (const [providerId, modelOptions] of providerMap) {
      const provider = providers.find(p => p.id === providerId);
      result.push({
        provider: providerId,
        providerName: provider?.name || providerId,
        options: modelOptions,
      });
    }

    return result;
  }

  /**
   * 根据 ID 获取模型信息
   */
  findModel(modelId: string, models: Model[]): Model | undefined {
    return models.find(m => m.id === modelId);
  }

  /**
   * 获取默认模型 ID
   */
  getDefaultModelId(category: Category): string {
    const defaults: Record<Category, string> = {
      text: 'gpt-4-turbo',
      image: 'dall-e-3',
      audio: 'whisper-1',
      video: 'gen-3-alpha',
    };
    return defaults[category];
  }
}

export const modelService = new ModelService();
