// 文件路径: frontend/src/components/shared/ErrorState/useErrorState.ts

/**
 * ErrorState 逻辑层
 * Headless Hook：封装错误状态逻辑
 */

import { useCallback, useMemo } from 'react';
import type { ErrorStateVariant, VariantConfig, VariantConfigMap, UseErrorStateReturn } from './types';

/**
 * 变体配置映射表
 * 定义每种错误类型的样式配置
 * 注意：实际样式由 CSS Module 处理，这里的类名仅用于兼容性
 */
const VARIANT_CONFIG: VariantConfigMap = {
  error: {
    iconColor: '',
    bgColor: '',
    borderColor: '',
  },
  warning: {
    iconColor: '',
    bgColor: '',
    borderColor: '',
  },
  offline: {
    iconColor: '',
    bgColor: '',
    borderColor: '',
  },
};

/**
 * ErrorState Headless Hook
 *
 * @description
 * 封装错误状态的业务逻辑，包括：
 * 1. 变体配置的计算与缓存
 * 2. 事件处理器的优化（useCallback）
 * 3. 重试/返回首页逻辑的封装
 *
 * @architecture
 * - 使用 useMemo 缓存配置对象，避免重复计算
 * - 使用 useCallback 优化事件处理器，防止子组件不必要的重渲染
 *
 * @param variant - 错误类型变体
 * @param onRetry - 重试回调函数（可选）
 * @param onGoHome - 返回首页回调函数（可选）
 *
 * @returns Hook 返回值对象
 *
 * @example
 * ```tsx
 * const { config, handleRetry, handleGoHome } = useErrorState('error', retry, goHome);
 * ```
 */
export function useErrorState(
  variant: ErrorStateVariant,
  onRetry?: () => void,
  onGoHome?: () => void
): UseErrorStateReturn {
  /**
   * 派生状态：当前变体的配置对象
   * 使用 useMemo 缓存，仅在 variant 变化时重新计算
   */
  const config: VariantConfig = useMemo(() => {
    return VARIANT_CONFIG[variant];
  }, [variant]);

  /**
   * 处理重试按钮点击
   * 仅在 onRetry 存在时调用回调
   */
  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  /**
   * 处理返回首页按钮点击
   * 仅在 onGoHome 存在时调用回调
   */
  const handleGoHome = useCallback(() => {
    if (onGoHome) {
      onGoHome();
    }
  }, [onGoHome]);

  return {
    config,
    handleRetry,
    handleGoHome,
  };
}
