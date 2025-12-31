// 文件路径: frontend/src/components/shared/EmptyState/useEmptyState.ts

/**
 * EmptyState 逻辑层
 * Headless UI Hook：封装所有状态、派生计算和处理器
 */

import { useMemo, useCallback } from 'react';
import { FolderOpen, AlertCircle, Search, Inbox } from 'lucide-react';
import type {
  EmptyStateProps,
  VariantConfigMap,
  UseEmptyStateReturn,
} from './types';

/**
 * 变体配置映射表
 * 定义每种变体的默认图标、颜色和背景
 * 注意：实际样式由 CSS Module 处理，这里的类名仅用于兼容性
 */
const VARIANT_CONFIG_MAP: VariantConfigMap = {
  empty: {
    icon: FolderOpen,
    iconColor: '',
    bgColor: '',
  },
  error: {
    icon: AlertCircle,
    iconColor: '',
    bgColor: '',
  },
  noResults: {
    icon: Search,
    iconColor: '',
    bgColor: '',
  },
  noData: {
    icon: Inbox,
    iconColor: '',
    bgColor: '',
  },
};

/**
 * EmptyState Headless Hook
 *
 * @description
 * 封装空状态组件的所有逻辑：变体配置查找、派生状态计算、事件处理。
 * 采用 Headless UI 模式，视图层只需调用返回的状态和 handlers。
 *
 * @param props - 组件 Props
 * @returns Hook 返回的状态和方法
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 逻辑层：useEmptyState.ts（本文件）
 * - 表现层：index.module.css（样式）
 * - 视图层：index.tsx（React 组件）
 *
 * @performance
 * - 使用 useMemo 缓存变体配置和派生状态
 * - 使用 useCallback 优化事件处理器
 * - 避免不必要的重计算和重渲染
 *
 * @example
 * ```tsx
 * const emptyState = useEmptyState({
 *   variant: 'error',
 *   title: 'Something went wrong',
 *   description: 'Please try again later',
 *   action: { label: 'Retry', onClick: handleRetry },
 * });
 *
 * // 使用返回的状态和方法
 * const { config, IconComponent, hasAction, handleActionClick } = emptyState;
 * ```
 */
export function useEmptyState(props: EmptyStateProps): UseEmptyStateReturn {
  const { variant = 'empty', description, action } = props;

  // ==================== 派生状态（使用 useMemo 缓存） ====================

  /**
   * 获取当前变体的配置
   * 根据 variant prop 从配置映射表中查找对应配置
   */
  const config = useMemo(() => {
    return VARIANT_CONFIG_MAP[variant];
  }, [variant]);

  /**
   * 获取图标组件
   * 从配置中提取图标组件类型
   */
  const IconComponent = useMemo(() => {
    return config.icon;
  }, [config.icon]);

  /**
   * 判断是否有操作按钮
   * 检查 action prop 是否存在且有效
   */
  const hasAction = useMemo(() => {
    return Boolean(action && action.label && action.onClick);
  }, [action]);

  /**
   * 判断是否有描述文本
   * 检查 description prop 是否存在且非空
   */
  const hasDescription = useMemo(() => {
    return Boolean(description && description.trim().length > 0);
  }, [description]);

  // ==================== 事件处理器（使用 useCallback 优化） ====================

  /**
   * 处理操作按钮点击
   * 如果 action 存在且有 onClick 回调，则调用它
   * 使用 useCallback 避免函数重新创建，优化性能
   */
  const handleActionClick = useCallback(() => {
    if (action && action.onClick) {
      action.onClick();
    }
  }, [action]);

  // ==================== 返回值 ====================

  return {
    config,
    IconComponent,
    hasAction,
    hasDescription,
    handleActionClick,
  };
}
