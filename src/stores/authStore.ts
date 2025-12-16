/**
 * Auth Store
 * 用户认证状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from '@/types/auth';
import { authService } from '@/services/authService';

// Mock 用户数据（开发用）
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

interface AuthState {
  // 状态
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;

  // Actions - 认证
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  initialize: () => Promise<void>;

  // Actions - OAuth
  loginWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  handleOAuthCallback: (provider: 'google' | 'github', code: string) => Promise<void>;

  // Actions - 密码
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;

  // Actions - 邮箱验证
  sendVerificationEmail: () => Promise<void>;

  // Actions - 资料
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  updateSettings: (settings: Partial<User['settings']>) => void;

  // Actions - 状态
  setError: (error: string | null) => void;
  clearError: () => void;
}

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      initialized: false,

      // 初始化 - 检查存储的认证状态
      initialize: async () => {
        if (get().initialized) return;

        set({ isLoading: true });

        try {
          if (USE_MOCK) {
            // Mock 模式：只使用本地存储的用户数据，不自动登录
            const storedUser = get().user;
            if (storedUser && get().isAuthenticated) {
              set({ initialized: true, isLoading: false });
            } else {
              // 需要手动登录
              set({ user: null, isAuthenticated: false, initialized: true, isLoading: false });
            }
          } else {
            // 真实模式：验证 token 有效性
            if (authService.isAuthenticated()) {
              const user = await authService.getCurrentUser();
              set({ user, isAuthenticated: true });
            }
          }
        } catch {
          // Token 无效或过期
          authService.clearAuth();
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false, initialized: true });
        }
      },

      // 登录
      login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          if (USE_MOCK) {
            // Mock 登录
            await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
            if (data.email === 'demo@promptstudio.com' && data.password === 'demo123') {
              set({ user: MOCK_USER, isAuthenticated: true });
            } else {
              throw new Error('Invalid email or password');
            }
          } else {
            const response = await authService.login(data);
            set({ user: response.user, isAuthenticated: true });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Login failed';
          set({ error: message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // 注册
      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });

        try {
          if (USE_MOCK) {
            // Mock 注册
            await new Promise(resolve => setTimeout(resolve, 500));
            const newUser: User = {
              ...MOCK_USER,
              id: `user-${Date.now()}`,
              email: data.email,
              name: data.name,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            set({ user: newUser, isAuthenticated: true });
          } else {
            const response = await authService.register(data);
            set({ user: response.user, isAuthenticated: true });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Registration failed';
          set({ error: message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // 登出
      logout: async () => {
        set({ isLoading: true });

        try {
          if (!USE_MOCK) {
            await authService.logout();
          }
        } finally {
          // 清除用户状态
          set({ user: null, isAuthenticated: false, isLoading: false });

          // 清除 localStorage 中的用户数据（在真实模式下）
          if (!USE_MOCK) {
            localStorage.removeItem('prompt-studio-storage');
            localStorage.removeItem('prompt-studio-collections');
          }
        }
      },

      // 刷新用户信息
      refreshUser: async () => {
        if (!get().isAuthenticated) return;

        try {
          if (USE_MOCK) {
            // Mock 模式不需要刷新
            return;
          }
          const user = await authService.getCurrentUser();
          set({ user });
        } catch {
          // 刷新失败，可能需要重新登录
          set({ user: null, isAuthenticated: false });
        }
      },

      // 更新资料
      updateProfile: async (data: UpdateProfileRequest) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true, error: null });

        try {
          if (USE_MOCK) {
            // Mock 更新
            await new Promise(resolve => setTimeout(resolve, 300));
            set({
              user: {
                ...user,
                ...data,
                settings: { ...user.settings, ...data.settings },
                updatedAt: new Date().toISOString(),
              },
            });
          } else {
            const updatedUser = await authService.updateProfile(data);
            set({ user: updatedUser });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Update failed';
          set({ error: message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // 更新设置（本地）
      updateSettings: (settings) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            settings: { ...user.settings, ...settings },
            updatedAt: new Date().toISOString(),
          },
        });
      },

      // OAuth 登录
      loginWithOAuth: async (provider: 'google' | 'github') => {
        set({ isLoading: true, error: null });

        try {
          if (USE_MOCK) {
            // Mock OAuth - 模拟跳转后返回
            await new Promise(resolve => setTimeout(resolve, 500));
            // 在真实场景中，这里会打开一个新窗口跳转到 OAuth 提供商
            // 模拟成功登录
            const mockOAuthUser: User = {
              ...MOCK_USER,
              id: `user-${provider}-${Date.now()}`,
              email: `demo-${provider}@promptstudio.com`,
              name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
            };
            set({ user: mockOAuthUser, isAuthenticated: true, isLoading: false });
          } else {
            // 真实 OAuth 流程：获取授权 URL 并跳转
            // 注意：跳转后页面会刷新，不需要设置 isLoading = false
            const { url } = await authService.getOAuthUrl(provider);
            window.location.href = url;
            // 不会执行到这里，因为页面会跳转
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : `${provider} login failed`;
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      // OAuth 回调处理
      handleOAuthCallback: async (provider: 'google' | 'github', code: string) => {
        set({ isLoading: true, error: null });

        try {
          if (USE_MOCK) {
            // Mock OAuth 回调
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockOAuthUser: User = {
              ...MOCK_USER,
              id: `user-${provider}-${Date.now()}`,
              email: `demo-${provider}@promptstudio.com`,
              name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
            };
            set({ user: mockOAuthUser, isAuthenticated: true });
          } else {
            const response = await authService.handleOAuthCallback(provider, code);
            set({ user: response.user, isAuthenticated: true });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'OAuth callback failed';
          set({ error: message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // 修改密码
      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });

        try {
          if (USE_MOCK) {
            // Mock 密码修改
            await new Promise(resolve => setTimeout(resolve, 500));
            // 模拟验证当前密码
            if (currentPassword !== 'demo123') {
              throw new Error('Current password is incorrect');
            }
          } else {
            await authService.changePassword({ currentPassword, newPassword });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Password change failed';
          set({ error: message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // 发送邮箱验证
      sendVerificationEmail: async () => {
        set({ isLoading: true, error: null });

        try {
          if (USE_MOCK) {
            // Mock 发送验证邮件
            await new Promise(resolve => setTimeout(resolve, 500));
          } else {
            await authService.sendVerificationEmail();
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to send verification email';
          set({ error: message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // 设置错误
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'prompt-studio-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
