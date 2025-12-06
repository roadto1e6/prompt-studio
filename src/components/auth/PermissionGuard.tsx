/**
 * Permission Guard Component
 * 权限保护组件，检查用户是否有特定权限
 */

import { useAuthStore } from '@/stores/authStore';
import type { Permission } from '@/types/auth';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const { user, hasPermission, hasAnyPermission } = useAuthStore();

  // 未登录
  if (!user) {
    return <>{fallback}</>;
  }

  // 单个权限检查
  if (permission) {
    if (!hasPermission(permission)) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // 多个权限检查
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      // 需要所有权限
      const hasAll = permissions.every(p => hasPermission(p));
      if (!hasAll) {
        return <>{fallback}</>;
      }
    } else {
      // 只需要任一权限
      if (!hasAnyPermission(permissions)) {
        return <>{fallback}</>;
      }
    }
  }

  return <>{children}</>;
}

export default PermissionGuard;
