/**
 * Model Store
 * AI 模型状态管理
 *
 * 支持两种模型来源：
 * 1. 系统模型 - 管理员预设，所有用户共享，用户不可修改
 * 2. 用户自定义模型 - 用户自己创建，存储在 localStorage，可增删改查
 */

import { create } from 'zustand';
import { modelService } from '@/services/modelService';
import type {
  Provider,
  Model,
  UserCustomModel,
  GroupedModelOptions,
  Category,
  CreateProviderRequest,
  UpdateProviderRequest,
  CreateModelRequest,
  UpdateModelRequest,
  CreateUserModelRequest,
  UpdateUserModelRequest,
  QueryModelsParams,
} from '@/types';

// ============ State 类型 ============

interface ModelState {
  // 系统模型数据
  providers: Provider[];
  systemModels: Model[];

  // 用户自定义模型（本地存储）
  userModels: UserCustomModel[];

  // 状态
  initialized: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  reset: () => void;
  refresh: (params?: QueryModelsParams) => Promise<void>;

  // Provider Actions (系统级别)
  createProvider: (data: CreateProviderRequest) => Promise<Provider>;
  updateProvider: (id: string, data: UpdateProviderRequest) => Promise<Provider>;
  deleteProvider: (id: string) => Promise<void>;

  // System Model Actions (管理员操作)
  createModel: (data: CreateModelRequest) => Promise<Model>;
  updateModel: (id: string, data: UpdateModelRequest) => Promise<Model>;
  deleteModel: (id: string) => Promise<void>;
  incrementUseCount: (modelId: string) => Promise<void>;

  // User Model Actions (用户操作)
  createUserModel: (data: CreateUserModelRequest) => UserCustomModel;
  updateUserModel: (id: string, data: UpdateUserModelRequest) => UserCustomModel | null;
  deleteUserModel: (id: string) => boolean;

  // Validation
  isModelIdExists: (id: string) => boolean;
  isModelNameExists: (name: string, excludeId?: string) => boolean;

  // Selectors
  getAllModels: () => Model[];  // 系统模型 + 用户模型（去重后）
  getModelsByCategory: (category: Category) => Model[];
  getModelOptions: (category?: Category) => GroupedModelOptions[];
  getModelById: (id: string) => Model | undefined;
  getDefaultModelId: (category: Category) => string;
  getProviderById: (id: string) => Provider | undefined;
  getSystemModels: () => Model[];
  getUserModels: () => UserCustomModel[];
}

// ============ Initial State ============

const initialState = {
  providers: [] as Provider[],
  systemModels: [] as Model[],
  userModels: [] as UserCustomModel[],
  initialized: false,
  isLoading: false,
  error: null as string | null,
};

// 将 UserCustomModel 转换为 Model
const toModel = (userModel: UserCustomModel): Model => ({
  ...userModel,
  status: userModel.status || 'active',
  sortOrder: 999,
  sourceType: 'user',
  userId: 'current-user',
  useCount: 0,
});

// ============ 持久化配置 ============

// 用户模型存储 key
const USER_MODELS_STORAGE_KEY = 'prompt-studio-user-models';

// 从 localStorage 加载用户模型
const loadUserModels = (): UserCustomModel[] => {
  try {
    const stored = localStorage.getItem(USER_MODELS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load user models from localStorage:', e);
  }
  return [];
};

// 保存用户模型到 localStorage
const saveUserModels = (models: UserCustomModel[]) => {
  try {
    localStorage.setItem(USER_MODELS_STORAGE_KEY, JSON.stringify(models));
  } catch (e) {
    console.error('Failed to save user models to localStorage:', e);
  }
};

// ============ Store ============

export const useModelStore = create<ModelState>((set, get) => ({
  ...initialState,
  userModels: loadUserModels(),

  /**
   * 初始化模型数据
   */
  initialize: async () => {
    const { initialized, isLoading } = get();
    if (initialized || isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const data = await modelService.getModels();
      // 为系统模型添加 sourceType
      const systemModels = data.models.map(m => ({
        ...m,
        sourceType: 'system' as const,
      }));
      set({
        providers: data.providers,
        systemModels,
        initialized: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load models',
        isLoading: false,
      });
    }
  },

  /**
   * 重置状态
   */
  reset: () => {
    set({ ...initialState, userModels: loadUserModels() });
  },

  /**
   * 刷新数据
   */
  refresh: async (params?: QueryModelsParams) => {
    set({ isLoading: true, error: null });

    try {
      const data = await modelService.getModels(params);
      const systemModels = data.models.map(m => ({
        ...m,
        sourceType: 'system' as const,
      }));
      set({
        providers: data.providers,
        systemModels,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to refresh models',
        isLoading: false,
      });
    }
  },

  // ============ Provider Actions ============

  /**
   * 创建提供商
   */
  createProvider: async (data) => {
    const provider = await modelService.createProvider(data);
    const { providers } = get();
    set({ providers: [...providers, provider] });
    return provider;
  },

  /**
   * 更新提供商
   */
  updateProvider: async (id, data) => {
    const provider = await modelService.updateProvider(id, data);
    const { providers } = get();
    set({
      providers: providers.map(p => p.id === id ? provider : p),
    });
    return provider;
  },

  /**
   * 删除提供商
   */
  deleteProvider: async (id) => {
    await modelService.deleteProvider(id);
    const { providers } = get();
    set({
      providers: providers.filter(p => p.id !== id),
    });
  },

  // ============ System Model Actions ============

  /**
   * 创建系统模型（管理员操作）
   */
  createModel: async (data) => {
    const model = await modelService.createModel(data);
    const modelWithSource = { ...model, sourceType: 'system' as const };
    const { systemModels } = get();
    set({ systemModels: [...systemModels, modelWithSource] });
    return modelWithSource;
  },

  /**
   * 更新系统模型
   */
  updateModel: async (id, data) => {
    const model = await modelService.updateModel(id, data);
    const modelWithSource = { ...model, sourceType: 'system' as const };
    const { systemModels } = get();
    set({
      systemModels: systemModels.map(m => m.id === id ? modelWithSource : m),
    });
    return modelWithSource;
  },

  /**
   * 删除系统模型
   */
  deleteModel: async (id) => {
    await modelService.deleteModel(id);
    const { systemModels } = get();
    set({
      systemModels: systemModels.filter(m => m.id !== id),
    });
  },

  /**
   * 增加模型使用次数
   */
  incrementUseCount: async (modelId) => {
    await modelService.incrementUseCount(modelId);
    const { systemModels } = get();
    set({
      systemModels: systemModels.map(m =>
        m.id === modelId ? { ...m, useCount: m.useCount + 1 } : m
      ),
    });
  },

  // ============ User Model Actions ============

  /**
   * 创建用户自定义模型
   */
  createUserModel: (data) => {
    const { userModels, isModelIdExists } = get();

    // 检查 ID 是否已存在（包括系统模型）
    if (isModelIdExists(data.id)) {
      throw new Error('Model ID already exists');
    }

    const newModel: UserCustomModel = {
      ...data,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedModels = [...userModels, newModel];
    set({ userModels: updatedModels });
    saveUserModels(updatedModels);
    return newModel;
  },

  /**
   * 更新用户自定义模型
   */
  updateUserModel: (id, data) => {
    const { userModels } = get();
    const index = userModels.findIndex(m => m.id === id);

    if (index === -1) {
      return null;
    }

    const updatedModel: UserCustomModel = {
      ...userModels[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const updatedModels = [
      ...userModels.slice(0, index),
      updatedModel,
      ...userModels.slice(index + 1),
    ];

    set({ userModels: updatedModels });
    saveUserModels(updatedModels);
    return updatedModel;
  },

  /**
   * 删除用户自定义模型
   */
  deleteUserModel: (id) => {
    const { userModels } = get();
    const filtered = userModels.filter(m => m.id !== id);

    if (filtered.length === userModels.length) {
      return false;
    }

    set({ userModels: filtered });
    saveUserModels(filtered);
    return true;
  },

  // ============ Validation ============

  /**
   * 检查模型 ID 是否已存在
   */
  isModelIdExists: (id) => {
    const { systemModels, userModels } = get();
    return systemModels.some(m => m.id === id) || userModels.some(m => m.id === id);
  },

  /**
   * 检查模型名称是否已存在
   */
  isModelNameExists: (name, excludeId) => {
    const { systemModels, userModels } = get();
    const allModels = [...systemModels, ...userModels];
    return allModels.some(m => m.name.toLowerCase() === name.toLowerCase() && m.id !== excludeId);
  },

  // ============ Selectors ============

  /**
   * 获取所有模型（系统模型 + 用户模型）
   */
  getAllModels: () => {
    const { systemModels, userModels } = get();
    const userModelsConverted = userModels.map(toModel);
    return [...systemModels, ...userModelsConverted];
  },

  /**
   * 按类别获取模型
   */
  getModelsByCategory: (category) => {
    const { getAllModels } = get();
    return getAllModels().filter(m => m.capabilities.includes(category));
  },

  /**
   * 获取模型选项 (用于 UI)
   */
  getModelOptions: (category) => {
    const { getAllModels, providers } = get();
    return modelService.getModelOptions(getAllModels(), providers, {
      category,
      includeDisabled: false,
    });
  },

  /**
   * 根据 ID 获取模型
   */
  getModelById: (id) => {
    const { getAllModels } = get();
    return modelService.findModel(id, getAllModels());
  },

  /**
   * 获取默认模型 ID
   */
  getDefaultModelId: (category) => {
    return modelService.getDefaultModelId(category);
  },

  /**
   * 根据 ID 获取提供商
   */
  getProviderById: (id) => {
    const { providers } = get();
    return providers.find(p => p.id === id);
  },

  /**
   * 获取系统模型列表
   */
  getSystemModels: () => {
    const { systemModels } = get();
    return systemModels;
  },

  /**
   * 获取用户自定义模型列表
   */
  getUserModels: () => {
    const { userModels } = get();
    return userModels;
  },
}));
