// 文件路径: frontend/src/features/prompts/components/CreatePromptModal/types.ts

/**
 * CreatePromptModal 类型定义
 * 契约层：先设计数据结构，后写逻辑
 */

import type { Category } from '@/types';

/**
 * 表单字段值
 */
export interface FormValues {
  /** Prompt 标题 */
  title: string;
  /** Prompt 描述 */
  description: string;
  /** Prompt 分类（text/image/audio/video） */
  category: Category;
  /** 模型 ID */
  model: string;
  /** 所属集合 ID（可选） */
  collectionId: string;
  /** 系统提示词 */
  systemPrompt: string;
}

/**
 * 表单字段错误信息
 */
export interface FormErrors {
  /** 标题字段错误 */
  title?: string;
  /** 描述字段错误 */
  description?: string;
  /** 分类字段错误 */
  category?: string;
  /** 模型字段错误 */
  model?: string;
  /** 集合字段错误 */
  collectionId?: string;
  /** 系统提示词字段错误 */
  systemPrompt?: string;
}

/**
 * 表单提交状态
 */
export type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Hook 返回的状态和方法
 */
export interface UseCreatePromptModalReturn {
  /** 表单字段值 */
  values: FormValues;
  /** 表单字段错误 */
  errors: FormErrors;
  /** 提交状态 */
  submissionState: SubmissionState;
  /** 是否正在提交 */
  isSubmitting: boolean;
  /** 错误信息（全局错误） */
  errorMessage: string | null;

  /** 更新标题字段 */
  handleTitleChange: (value: string) => void;
  /** 更新描述字段 */
  handleDescriptionChange: (value: string) => void;
  /** 更新分类字段 */
  handleCategoryChange: (value: Category) => void;
  /** 更新模型字段 */
  handleModelChange: (value: string) => void;
  /** 更新集合字段 */
  handleCollectionIdChange: (value: string) => void;
  /** 更新系统提示词字段 */
  handleSystemPromptChange: (value: string) => void;
  /** 处理表单提交 */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** 处理模态框关闭 */
  handleClose: () => void;
  /** 重置表单 */
  reset: () => void;
}

/**
 * 组件 Props
 */
export interface CreatePromptModalProps {
  /** 自定义类名（可选） */
  className?: string;
}
