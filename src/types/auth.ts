/**
 * Authentication Types
 * 用户认证相关类型定义
 */

// 用户信息
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
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
