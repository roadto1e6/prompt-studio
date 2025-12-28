// 文件路径: frontend/src/components/auth/AuthGuard/useAuthGuard.ts

/**
 * useAuthGuard Hook
 * 逻辑层：封装所有状态、Side-effects 和 Handlers
 */

import { useEffect, useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { UseAuthGuardReturn, UseAuthGuardOptions } from './types';

/**
 * AuthGuard 组件的业务逻辑 Hook
 *
 * @description
 * 采用 Headless UI 思路，将认证状态管理逻辑与视图分离。
 *
 * @param options - Hook 配置选项
 * @returns 认证状态和派生状态
 */
export const useAuthGuard = ({ requireAuth }: UseAuthGuardOptions): UseAuthGuardReturn => {
  const { isAuthenticated, isLoading, initialized, initialize } = useAuthStore();

  /**
   * 初始化认证状态
   * 仅在未初始化时执行
   */
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  /**
   * 计算是否应该显示加载状态
   */
  const shouldShowLoading = useMemo(() => {
    return !initialized || isLoading;
  }, [initialized, isLoading]);

  /**
   * 计算是否应该显示 fallback
   */
  const shouldShowFallback = useMemo(() => {
    return requireAuth && !isAuthenticated && !shouldShowLoading;
  }, [requireAuth, isAuthenticated, shouldShowLoading]);

  /**
   * 计算是否应该显示内容
   */
  const shouldShowContent = useMemo(() => {
    if (shouldShowLoading) return false;
    if (!requireAuth) return true;
    return isAuthenticated;
  }, [shouldShowLoading, requireAuth, isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    initialized,
    shouldShowLoading,
    shouldShowContent,
    shouldShowFallback,
  };
};
