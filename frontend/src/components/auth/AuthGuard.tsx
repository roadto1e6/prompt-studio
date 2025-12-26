/**
 * Auth Guard Component
 * 路由保护组件，检查用户是否已认证
 */

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, fallback, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading, initialized, initialize } = useAuthStore();

  // 初始化认证状态
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  // 加载中
  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // 需要认证但未登录
  if (requireAuth && !isAuthenticated) {
    return fallback || null;
  }

  // 不需要认证或已登录
  return <>{children}</>;
}

export default AuthGuard;
