/**
 * Authentication & Authorization Types
 * 用户认证和权限相关类型定义
 */

// 用户角色
export type UserRole = 'admin' | 'member' | 'viewer';

// 用户计划
export type UserPlan = 'free' | 'pro' | 'team' | 'enterprise';

// 权限类型
export type Permission =
  | 'prompt:create'
  | 'prompt:read'
  | 'prompt:update'
  | 'prompt:delete'
  | 'prompt:share'
  | 'prompt:export'
  | 'collection:create'
  | 'collection:read'
  | 'collection:update'
  | 'collection:delete'
  | 'team:manage'
  | 'team:invite'
  | 'settings:manage'
  | 'billing:manage';

// 用户信息
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  plan: UserPlan;
  teamId?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerified: boolean;
  settings: UserSettings;
}

// 用户设置
export interface UserSettings {
  language: 'en' | 'zh';
  theme: 'light' | 'dark' | 'system';
  defaultModel: string;
  emailNotifications: boolean;
}

// 团队信息
export interface Team {
  id: string;
  name: string;
  ownerId: string;
  memberCount: number;
  plan: UserPlan;
  createdAt: string;
  updatedAt: string;
}

// 团队成员
export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: UserRole;
  user: Pick<User, 'id' | 'email' | 'name' | 'avatar'>;
  joinedAt: string;
}

// 登录请求
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 注册请求
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  inviteCode?: string;
}

// 认证响应
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Token 刷新响应
export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// 重置密码请求
export interface ResetPasswordRequest {
  email: string;
}

// 确认重置密码
export interface ConfirmResetPasswordRequest {
  token: string;
  password: string;
}

// 修改密码
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 更新用户资料
export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  settings?: Partial<UserSettings>;
}

// 邀请成员
export interface InviteMemberRequest {
  email: string;
  role: UserRole;
}

// 计划限制
export interface PlanLimits {
  maxPrompts: number;
  maxCollections: number;
  maxVersionsPerPrompt: number;
  maxTeamMembers: number;
  apiAccess: boolean;
  advancedModels: boolean;
  customBranding: boolean;
  prioritySupport: boolean;
}

// 各计划的限制配置
export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    maxPrompts: 50,
    maxCollections: 5,
    maxVersionsPerPrompt: 10,
    maxTeamMembers: 1,
    apiAccess: false,
    advancedModels: false,
    customBranding: false,
    prioritySupport: false,
  },
  pro: {
    maxPrompts: 500,
    maxCollections: 50,
    maxVersionsPerPrompt: 100,
    maxTeamMembers: 1,
    apiAccess: true,
    advancedModels: true,
    customBranding: false,
    prioritySupport: false,
  },
  team: {
    maxPrompts: 2000,
    maxCollections: 200,
    maxVersionsPerPrompt: 500,
    maxTeamMembers: 10,
    apiAccess: true,
    advancedModels: true,
    customBranding: true,
    prioritySupport: true,
  },
  enterprise: {
    maxPrompts: -1, // 无限制
    maxCollections: -1,
    maxVersionsPerPrompt: -1,
    maxTeamMembers: -1,
    apiAccess: true,
    advancedModels: true,
    customBranding: true,
    prioritySupport: true,
  },
};

// 角色权限映射
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'prompt:create',
    'prompt:read',
    'prompt:update',
    'prompt:delete',
    'prompt:share',
    'prompt:export',
    'collection:create',
    'collection:read',
    'collection:update',
    'collection:delete',
    'team:manage',
    'team:invite',
    'settings:manage',
    'billing:manage',
  ],
  member: [
    'prompt:create',
    'prompt:read',
    'prompt:update',
    'prompt:delete',
    'prompt:share',
    'prompt:export',
    'collection:create',
    'collection:read',
    'collection:update',
    'collection:delete',
  ],
  viewer: [
    'prompt:read',
    'collection:read',
  ],
};

// 检查权限的辅助函数
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some(p => user.permissions.includes(p));
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every(p => user.permissions.includes(p));
}

// 检查计划限制
export function checkPlanLimit(user: User | null, resource: keyof PlanLimits, currentCount: number): boolean {
  if (!user) return false;
  const limit = PLAN_LIMITS[user.plan][resource];
  if (typeof limit === 'number') {
    return limit === -1 || currentCount < limit;
  }
  return !!limit;
}
