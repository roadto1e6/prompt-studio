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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      initialized: false,

      // 初始化
      initialize: async () => {
        if (get().initialized) return;

        set({ isLoading: true });

        try {
          if (authService.isAuthenticated()) {
            const user = await authService.getCurrentUser();
            set({ user, isAuthenticated: true });
          }
        } catch {
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
          const response = await authService.login(data);
          set({ user: response.user, isAuthenticated: true });
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
          const response = await authService.register(data);
          set({ user: response.user, isAuthenticated: true });
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
          await authService.logout();
        } finally {
          set({ user: null, isAuthenticated: false, isLoading: false });
          // 清除本地存储
          localStorage.removeItem('prompt-studio-storage');
          localStorage.removeItem('prompt-studio-collections');
        }
      },

      // 刷新用户信息
      refreshUser: async () => {
        if (!get().isAuthenticated) return;

        try {
          const user = await authService.getCurrentUser();
          set({ user });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      // 更新资料
      updateProfile: async (data: UpdateProfileRequest) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true, error: null });

        try {
          const updatedUser = await authService.updateProfile(data);
          set({ user: updatedUser });
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
          const { url } = await authService.getOAuthUrl(provider);
          window.location.href = url;
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
          const response = await authService.handleOAuthCallback(provider, code);
          set({ user: response.user, isAuthenticated: true });
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
          await authService.changePassword({ currentPassword, newPassword });
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
          await authService.sendVerificationEmail();
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
