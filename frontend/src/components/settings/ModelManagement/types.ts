// 文件路径: frontend/src/components/settings/ModelManagement/types.ts

/**
 * ModelManagement 类型定义
 * 契约层：先设计数据结构，后写逻辑
 */

import type { UserCustomModel, ModelCapability } from '@/types';

/**
 * 模型表单字段值
 */
export interface ModelFormValues {
  /** 模型唯一标识符 */
  id: string;
  /** 模型显示名称 */
  name: string;
  /** 提供商 ID */
  providerId: string;
  /** 模型能力列表 */
  capabilities: ModelCapability[];
  /** 最大输出 token 数 */
  maxTokens: number;
  /** 上下文窗口大小（可选） */
  contextWindow: number | null;
  /** 模型描述（可选） */
  description: string;
}

/**
 * 表单字段错误信息
 */
export interface ModelFormErrors {
  /** ID 字段错误 */
  id?: string;
  /** 名称字段错误 */
  name?: string;
  /** 提供商字段错误 */
  providerId?: string;
  /** 能力字段错误 */
  capabilities?: string;
  /** 最大 Token 字段错误 */
  maxTokens?: string;
  /** 上下文窗口字段错误 */
  contextWindow?: string;
  /** 描述字段错误 */
  description?: string;
}

/**
 * 视图模式
 */
export type ViewMode = 'list' | 'form';

/**
 * 表单提交状态
 */
export type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * 筛选条件
 */
export interface FilterState {
  /** 选中的提供商 ID */
  providerId: string;
  /** 选中的能力类型 */
  capability: ModelCapability | '';
}

/**
 * 能力选项配置
 */
export interface CapabilityOption {
  /** 能力值 */
  value: ModelCapability;
  /** 显示标签 */
  label: string;
  /** 样式类名 */
  color: string;
}

/**
 * Hook 返回的状态和方法
 */
export interface UseModelManagementReturn {
  // ==================== 数据状态 ====================
  /** 筛选后的模型列表 */
  filteredModels: UserCustomModel[];
  /** 能力选项配置 */
  capabilityOptions: CapabilityOption[];

  // ==================== UI 状态 ====================
  /** 当前视图模式 */
  viewMode: ViewMode;
  /** 是否显示表单 */
  showForm: boolean;
  /** 正在编辑的模型 */
  editingModel: UserCustomModel | null;
  /** 等待删除确认的模型 ID */
  deleteConfirmId: string | null;

  // ==================== 筛选状态 ====================
  /** 筛选条件 */
  filters: FilterState;

  // ==================== 表单状态 ====================
  /** 表单字段值 */
  formValues: ModelFormValues;
  /** 表单字段错误 */
  formErrors: ModelFormErrors;
  /** 提交状态 */
  submissionState: SubmissionState;
  /** 是否正在提交 */
  isSubmitting: boolean;
  /** 全局错误信息 */
  errorMessage: string | null;

  // ==================== 筛选操作 ====================
  /** 设置提供商筛选 */
  handleProviderFilterChange: (providerId: string) => void;
  /** 设置能力筛选 */
  handleCapabilityFilterChange: (capability: ModelCapability | '') => void;

  // ==================== 视图操作 ====================
  /** 打开新建表单 */
  handleOpenCreateForm: () => void;
  /** 打开编辑表单 */
  handleOpenEditForm: (model: UserCustomModel) => void;
  /** 关闭表单 */
  handleCloseForm: () => void;

  // ==================== 删除操作 ====================
  /** 请求删除确认 */
  handleRequestDelete: (id: string) => void;
  /** 取消删除 */
  handleCancelDelete: () => void;
  /** 确认删除 */
  handleConfirmDelete: (id: string) => void;

  // ==================== 表单字段更新 ====================
  /** 更新 ID 字段 */
  handleIdChange: (value: string) => void;
  /** 更新名称字段 */
  handleNameChange: (value: string) => void;
  /** 更新提供商字段 */
  handleProviderChange: (value: string) => void;
  /** 切换能力 */
  handleCapabilityToggle: (capability: ModelCapability) => void;
  /** 更新最大 Token 字段 */
  handleMaxTokensChange: (value: number) => void;
  /** 更新上下文窗口字段 */
  handleContextWindowChange: (value: number | null) => void;
  /** 更新描述字段 */
  handleDescriptionChange: (value: string) => void;

  // ==================== 表单提交 ====================
  /** 处理表单提交 */
  handleSubmit: (e: React.FormEvent) => Promise<void>;

  // ==================== 工具方法 ====================
  /** 获取提供商名称 */
  getProviderName: (providerId: string) => string;
  /** 获取能力样式 */
  getCapabilityStyle: (capability: ModelCapability) => string;
}

/**
 * 组件 Props
 */
export interface ModelManagementProps {
  /** 自定义类名（可选） */
  className?: string;
}
