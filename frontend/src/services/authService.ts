/**
 * Authentication Service
 * 认证相关的 API 调用
 */

import { api, tokenManager } from './api';
import type {
  AuthResponse,
  RefreshResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ConfirmResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  User,
} from '@/types/auth';

export const authService = {
  /**
   * 用户登录
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data, { skipAuth: true });
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  /**
   * 用户注册
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data, { skipAuth: true });
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  /**
   * 用户登出
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      tokenManager.clearTokens();
    }
  },

  /**
   * 刷新 Token
   */
  refreshToken: async (): Promise<RefreshResponse> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<RefreshResponse>(
      '/auth/refresh',
      { refreshToken },
      { skipAuth: true }
    );
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  /**
   * 发送密码重置邮件
   */
  requestPasswordReset: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/forgot-password', data, { skipAuth: true });
  },

  /**
   * 确认密码重置
   */
  confirmPasswordReset: async (data: ConfirmResetPasswordRequest): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/reset-password', data, { skipAuth: true });
  },

  /**
   * 修改密码
   */
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/change-password', data);
  },

  /**
   * 更新用户资料
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    return api.patch<User>('/auth/profile', data);
  },

  /**
   * 发送邮箱验证邮件
   */
  sendVerificationEmail: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/send-verification');
  },

  /**
   * 验证邮箱
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/verify-email', { token }, { skipAuth: true });
  },

  /**
   * OAuth 登录 - 获取授权 URL
   */
  getOAuthUrl: async (provider: 'google' | 'github'): Promise<{ url: string }> => {
    return api.get<{ url: string }>(`/auth/oauth/${provider}`, { skipAuth: true });
  },

  /**
   * OAuth 回调处理
   */
  handleOAuthCallback: async (
    provider: 'google' | 'github',
    code: string
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      `/auth/oauth/${provider}/callback`,
      { code },
      { skipAuth: true }
    );
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  /**
   * 检查是否已认证
   */
  isAuthenticated: (): boolean => {
    return tokenManager.isAuthenticated();
  },

  /**
   * 清除认证状态
   */
  clearAuth: (): void => {
    tokenManager.clearTokens();
  },
};

export default authService;
