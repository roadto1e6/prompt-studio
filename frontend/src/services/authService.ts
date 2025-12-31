/**
 * Auth Service
 * 统一的认证服务层，抽象 Mock/API 实现细节
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

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

// ============ 工具函数 ============

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock 用户数据
const MOCK_USER: User = {
  id: 'user-1',
  email: 'demo@promptstudio.com',
  name: 'Demo User',
  avatar: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  emailVerified: true,
  settings: {
    language: 'zh',
    theme: 'dark',
    defaultModel: 'gpt-4-turbo',
    emailNotifications: true,
  },
};

// Mock 存储当前用户
let mockCurrentUser: User | null = null;

// ============ Mock 实现 ============

const mockService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    await delay(500);
    if (data.email === 'demo@promptstudio.com' && data.password === 'demo123') {
      mockCurrentUser = { ...MOCK_USER, lastLoginAt: new Date().toISOString() };
      return {
        user: mockCurrentUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
      };
    }
    throw new Error('Invalid email or password');
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    await delay(500);
    mockCurrentUser = {
      ...MOCK_USER,
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      user: mockCurrentUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
    };
  },

  logout: async (): Promise<void> => {
    await delay(100);
    mockCurrentUser = null;
  },

  refreshToken: async (): Promise<RefreshResponse> => {
    await delay(100);
    return {
      accessToken: 'mock-access-token-refreshed',
      refreshToken: 'mock-refresh-token-refreshed',
      expiresIn: 3600,
    };
  },

  getCurrentUser: async (): Promise<User> => {
    await delay(100);
    if (!mockCurrentUser) throw new Error('Not authenticated');
    return mockCurrentUser;
  },

  requestPasswordReset: async (_data: ResetPasswordRequest): Promise<{ message: string }> => {
    await delay(500);
    return { message: 'Password reset email sent' };
  },

  confirmPasswordReset: async (_data: ConfirmResetPasswordRequest): Promise<{ message: string }> => {
    await delay(500);
    return { message: 'Password has been reset' };
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    await delay(500);
    if (data.currentPassword !== 'demo123') {
      throw new Error('Current password is incorrect');
    }
    return { message: 'Password changed successfully' };
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    await delay(300);
    if (!mockCurrentUser) throw new Error('Not authenticated');
    mockCurrentUser = {
      ...mockCurrentUser,
      ...data,
      settings: { ...mockCurrentUser.settings, ...data.settings },
      updatedAt: new Date().toISOString(),
    };
    return mockCurrentUser;
  },

  sendVerificationEmail: async (): Promise<{ message: string }> => {
    await delay(500);
    return { message: 'Verification email sent' };
  },

  verifyEmail: async (_token: string): Promise<{ message: string }> => {
    await delay(500);
    if (mockCurrentUser) {
      mockCurrentUser.emailVerified = true;
    }
    return { message: 'Email verified' };
  },

  getOAuthUrl: async (provider: 'google' | 'github'): Promise<{ url: string }> => {
    await delay(100);
    return { url: `https://mock-oauth.com/${provider}` };
  },

  handleOAuthCallback: async (provider: 'google' | 'github', _code: string): Promise<AuthResponse> => {
    await delay(500);
    mockCurrentUser = {
      ...MOCK_USER,
      id: `user-${provider}-${Date.now()}`,
      email: `demo-${provider}@promptstudio.com`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    };
    return {
      user: mockCurrentUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
    };
  },

  isAuthenticated: (): boolean => {
    return mockCurrentUser !== null;
  },

  clearAuth: (): void => {
    mockCurrentUser = null;
  },
};

// ============ API 实现 ============

const apiService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data, { skipAuth: true });
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data, { skipAuth: true });
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      tokenManager.clearTokens();
    }
  },

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

  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  requestPasswordReset: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/forgot-password', data, { skipAuth: true });
  },

  confirmPasswordReset: async (data: ConfirmResetPasswordRequest): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/reset-password', data, { skipAuth: true });
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/change-password', data);
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    return api.patch<User>('/auth/profile', data);
  },

  sendVerificationEmail: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/send-verification');
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/verify-email', { token }, { skipAuth: true });
  },

  getOAuthUrl: async (provider: 'google' | 'github'): Promise<{ url: string }> => {
    return api.get<{ url: string }>(`/auth/oauth/${provider}`, { skipAuth: true });
  },

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

  isAuthenticated: (): boolean => {
    return tokenManager.isAuthenticated();
  },

  clearAuth: (): void => {
    tokenManager.clearTokens();
  },
};

// ============ 导出统一接口 ============

export const authService = USE_MOCK ? mockService : apiService;

export default authService;
