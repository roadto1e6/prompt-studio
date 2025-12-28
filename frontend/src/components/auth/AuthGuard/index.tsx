// 文件路径: frontend/src/components/auth/AuthGuard/index.tsx

/**
 * AuthGuard 组件 - 视图层
 * 路由保护组件，检查用户是否已认证
 *
 * @description
 * 纯声明式 UI，零业务逻辑。
 * 所有状态管理和计算逻辑委托给 useAuthGuard Hook。
 */

import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthGuard } from './useAuthGuard';
import type { AuthGuardProps } from './types';
import styles from './index.module.css';

/**
 * AuthGuard - 路由认证守卫组件
 *
 * @example
 * ```tsx
 * <AuthGuard fallback={<LoginPage />}>
 *   <ProtectedContent />
 * </AuthGuard>
 * ```
 */
const AuthGuardComponent: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  requireAuth = true,
}) => {
  const {
    shouldShowLoading,
    shouldShowContent,
    shouldShowFallback,
  } = useAuthGuard({ requireAuth });

  // 加载中状态
  if (shouldShowLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  // 需要认证但未登录，显示 fallback
  if (shouldShowFallback) {
    return <>{fallback || null}</>;
  }

  // 显示内容
  if (shouldShowContent) {
    return <>{children}</>;
  }

  return null;
};

export const AuthGuard = memo(AuthGuardComponent);

AuthGuard.displayName = 'AuthGuard';

// 导出类型
export type { AuthGuardProps } from './types';
export default AuthGuard;
