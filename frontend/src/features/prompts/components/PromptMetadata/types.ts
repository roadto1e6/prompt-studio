// 文件路径: frontend/src/features/prompts/components/PromptMetadata/types.ts

/**
 * PromptMetadata 类型定义
 * 契约层：元数据展示组件的类型契约
 */

import type { Prompt } from '@/types';

/**
 * 模型选项组
 */
export interface ModelOptionGroup {
  /** 供应商名称（组标签） */
  label: string;
  /** 模型选项列表 */
  options: ModelOption[];
}

/**
 * 模型选项
 */
export interface ModelOption {
  /** 模型值 */
  value: string;
  /** 模型显示名称 */
  label: string;
}

/**
 * 集合选项
 */
export interface CollectionOption {
  /** 集合ID */
  value: string;
  /** 集合名称 */
  label: string;
}

/**
 * PromptMetadata Props
 */
export interface PromptMetadataProps {
  /** 自定义类名 */
  className?: string;
}

/**
 * Hook 返回值
 */
export interface UsePromptMetadataReturn {
  /** 当前选中的提示词 */
  prompt: Prompt | null;
  /** 模型选项组 */
  modelGroups: ModelOptionGroup[];
  /** 集合选项列表 */
  collectionOptions: CollectionOption[];
  /** 模型值 */
  model: string;
  /** 温度值 */
  temperature: number;
  /** 最大令牌数 */
  maxTokens: number;
  /** 标签列表 */
  tags: string[];
  /** 新标签输入值 */
  newTag: string;
  /** 集合ID */
  collectionId: string | null;
  /** 是否显示高级设置 */
  showAdvanced: boolean;
  /** 格式化的创建时间 */
  formattedCreatedAt: string;
  /** 格式化的更新时间 */
  formattedUpdatedAt: string;
  /** 处理模型变更 */
  handleModelChange: (e: { target: { value: string } }) => void;
  /** 处理温度变更 */
  handleTemperatureChange: (value: number) => void;
  /** 处理最大令牌数变更 */
  handleMaxTokensChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 处理添加标签 */
  handleAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** 处理移除标签 */
  handleRemoveTag: (tag: string) => void;
  /** 处理集合变更 */
  handleCollectionChange: (e: { target: { value: string } }) => void;
  /** 处理新标签输入变更 */
  handleNewTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 切换高级设置显示 */
  toggleAdvanced: () => void;
}
