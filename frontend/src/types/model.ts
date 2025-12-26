/**
 * Model Types
 * AI 模型相关类型定义
 *
 * 设计原则：
 * 1. 系统模型 - 管理员预设，所有用户共享，用户不可修改
 * 2. 用户自定义模型 - 用户自己创建，可以增删改查
 * 3. 去重机制 - 系统模型已有的，用户无法再创建同名/同ID模型
 * 4. 审核机制 - 用户模型可以被管理员审核后提升为系统模型
 */

import { Category } from './prompt';

// ============ 基础类型 ============

// 模型能力类型 (与 Category 对应)
export type ModelCapability = Category | 'embedding' | 'vision';

// 模型状态
export type ModelStatus = 'active' | 'deprecated' | 'beta';

// 模型来源类型
export type ModelSourceType = 'system' | 'user';

// 用户模型审核状态
export type UserModelReviewStatus = 'pending' | 'approved' | 'rejected';

// ============ 提供商 ============

export interface Provider {
  id: string;                    // 唯一标识，如 'openai', 'anthropic'
  name: string;                  // 显示名称
  website?: string | null;       // 官网
  apiDocsUrl?: string | null;    // API 文档链接
  description?: string | null;   // 描述
  logoUrl?: string | null;       // Logo URL
  isActive: boolean;             // 是否启用
  contributedBy?: string | null; // 贡献者 userId, null = 系统预设
  createdAt: string;
  updatedAt: string;
}

// ============ 模型定义 ============

export interface Model {
  id: string;                     // 唯一标识，如 'gpt-4-turbo'
  name: string;                   // 显示名称
  providerId: string;             // 提供商 ID
  provider?: {                    // 提供商信息 (关联查询时)
    id: string;
    name: string;
  };
  capabilities: ModelCapability[]; // 支持的能力
  maxTokens: number;              // 最大输出 token
  contextWindow?: number | null;  // 上下文窗口大小
  status: ModelStatus;            // 模型状态
  description?: string | null;    // 模型描述
  releasedAt?: string | null;     // 发布日期
  defaultTemperature?: number | null;
  defaultMaxTokens?: number | null;
  pricing?: ModelPricing | null;  // 定价信息
  features?: ModelFeatures | null; // 特性标记
  sortOrder: number;

  // 模型来源字段
  sourceType: ModelSourceType;    // 模型来源：system = 系统模型，user = 用户自定义
  userId?: string | null;         // 创建者用户ID (仅用户模型有值)
  reviewStatus?: UserModelReviewStatus | null; // 审核状态 (仅用户模型)
  reviewedAt?: string | null;     // 审核时间
  reviewedBy?: string | null;     // 审核管理员ID

  // 兼容旧字段
  contributedBy?: string | null;  // 贡献者 userId, null = 系统预设 (保留兼容)
  useCount: number;               // 使用次数

  createdAt: string;
  updatedAt: string;
}

// 用户自定义模型（前端本地存储使用）
export interface UserCustomModel {
  id: string;                     // 唯一标识
  name: string;                   // 显示名称
  providerId: string;             // 提供商 ID
  capabilities: ModelCapability[]; // 支持的能力
  maxTokens: number;              // 最大输出 token
  contextWindow?: number | null;  // 上下文窗口大小
  status: ModelStatus;            // 模型状态
  description?: string | null;    // 模型描述
  features?: ModelFeatures | null; // 特性标记
  createdAt: string;
  updatedAt: string;
}

// 模型定价
export interface ModelPricing {
  inputPer1kTokens?: number;
  outputPer1kTokens?: number;
  perImage?: number;
  perMinute?: number;
  currency: string;
}

// 模型特性
export interface ModelFeatures {
  streaming?: boolean;
  vision?: boolean;
  functionCalling?: boolean;
  jsonMode?: boolean;
}

// ============ API 请求类型 ============

// 创建提供商
export interface CreateProviderRequest {
  id: string;
  name: string;
  website?: string;
  apiDocsUrl?: string;
  description?: string;
  logoUrl?: string;
}

// 更新提供商
export interface UpdateProviderRequest {
  name?: string;
  website?: string;
  apiDocsUrl?: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
}

// 创建模型（系统模型 - 管理员使用）
export interface CreateModelRequest {
  id: string;
  name: string;
  providerId: string;
  capabilities: ModelCapability[];
  maxTokens: number;
  contextWindow?: number;
  status?: ModelStatus;
  description?: string;
  releasedAt?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
  pricing?: ModelPricing;
  features?: ModelFeatures;
}

// 创建用户自定义模型
export interface CreateUserModelRequest {
  id: string;
  name: string;
  providerId: string;
  capabilities: ModelCapability[];
  maxTokens: number;
  contextWindow?: number;
  description?: string;
  features?: ModelFeatures;
}

// 更新用户自定义模型
export interface UpdateUserModelRequest {
  name?: string;
  capabilities?: ModelCapability[];
  maxTokens?: number;
  contextWindow?: number;
  description?: string;
  features?: ModelFeatures;
}

// 更新模型
export interface UpdateModelRequest {
  name?: string;
  capabilities?: ModelCapability[];
  maxTokens?: number;
  contextWindow?: number;
  status?: ModelStatus;
  description?: string;
  releasedAt?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
  pricing?: ModelPricing;
  features?: ModelFeatures;
}

// 查询参数
export interface QueryModelsParams {
  category?: ModelCapability;
  providerId?: string;
  status?: ModelStatus;
  search?: string;
}

// ============ API 响应类型 ============

export interface GetModelsResponse {
  providers: Provider[];
  models: Model[];
}

export interface ModelStatsResponse {
  totalProviders: number;
  totalModels: number;
  modelsByCapability: Array<{ capabilities: string[]; _count: number }>;
  modelsByProvider: Array<{ providerId: string; _count: number }>;
  topModels: Array<{ id: string; name: string; providerId: string; useCount: number }>;
}

// ============ UI 辅助类型 ============

// 模型选择器选项
export interface ModelOption {
  value: string;
  label: string;
  provider: string;
  providerName: string;
  maxTokens: number;
  disabled?: boolean;
  badge?: 'new' | 'beta' | 'deprecated';
  useCount?: number;
}

// 分组的模型选项
export interface GroupedModelOptions {
  provider: string;
  providerName: string;
  options: ModelOption[];
}

// 获取模型选项的参数
export interface GetModelOptionsParams {
  category?: Category;
  includeDisabled?: boolean;
}
