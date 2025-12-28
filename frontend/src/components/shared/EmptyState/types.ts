// 文件路径: frontend/src/components/shared/EmptyState/types.ts

/**
 * EmptyState 类型定义
 * 契约层：先设计数据结构，后写逻辑
 */

import type { LucideIcon } from 'lucide-react';

/**
 * 空状态变体类型
 * - empty: 空数据状态（默认）
 * - error: 错误状态
 * - noResults: 无搜索结果
 * - noData: 无内容
 */
export type EmptyStateVariant = 'empty' | 'error' | 'noResults' | 'noData';

/**
 * 操作按钮配置
 */
export interface EmptyStateAction {
  /** 按钮文本 */
  label: string;
  /** 点击处理器 */
  onClick: () => void;
}

/**
 * 变体配置项
 */
export interface VariantConfig {
  /** 图标组件 */
  icon: LucideIcon;
  /** 图标颜色类名 */
  iconColor: string;
  /** 背景颜色类名 */
  bgColor: string;
}

/**
 * 所有变体的配置映射
 */
export type VariantConfigMap = Record<EmptyStateVariant, VariantConfig>;

/**
 * Hook 返回的状态和方法
 */
export interface UseEmptyStateReturn {
  /** 当前变体配置 */
  config: VariantConfig;
  /** 图标组件 */
  IconComponent: LucideIcon;
  /** 是否显示操作按钮 */
  hasAction: boolean;
  /** 是否显示描述 */
  hasDescription: boolean;
  /** 处理操作点击（已使用 useCallback 优化） */
  handleActionClick: () => void;
}

/**
 * 组件 Props
 */
export interface EmptyStateProps {
  /** 自定义图标（可选，如不提供则使用变体默认图标） */
  icon?: React.ReactNode;
  /** 标题文本 */
  title: string;
  /** 描述文本（可选） */
  description?: string;
  /** 操作按钮配置（可选） */
  action?: EmptyStateAction;
  /** 空状态变体，默认为 'empty' */
  variant?: EmptyStateVariant;
  /** 自定义类名（可选） */
  className?: string;
}
