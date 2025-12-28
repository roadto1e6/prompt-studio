// 文件路径: frontend/src/components/auth/AuthGuard/types.ts

/**
 * AuthGuard 组件类型定义
 * 契约层：定义严格的 TypeScript 类型
 */

import { ReactNode } from 'react';

/**
 * AuthGuard 组件 Props
 */
export interface AuthGuardProps {
  /** 子组件 */
  children: ReactNode;
  /** 未认证时显示的备用内容 */
  fallback?: ReactNode;
  /** 是否需要认证，默认为 true */
  requireAuth?: boolean;
}

/**
 * useAuthGuard Hook 返回值类型
 */
export interface UseAuthGuardReturn {
  /** 是否已认证 */
  isAuthenticated: boolean;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 是否已初始化 */
  initialized: boolean;
  /** 是否应该显示加载状态 */
  shouldShowLoading: boolean;
  /** 是否应该显示内容 */
  shouldShowContent: boolean;
  /** 是否应该显示 fallback */
  shouldShowFallback: boolean;
}

/**
 * useAuthGuard Hook 参数类型
 */
export interface UseAuthGuardOptions {
  /** 是否需要认证 */
  requireAuth: boolean;
}
