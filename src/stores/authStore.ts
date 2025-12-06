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
  Permission,
} from '@/types/auth';
import { hasPermission, hasAnyPermission, PLAN_LIMITS, ROLE_PERMISSIONS } from '@/types/auth';
import { authService } from '@/services/authService';

// Mock 用户数据（开发用）
const MOCK_USER: User = {
  id: 'user-1',
  email: 'demo@promptstudio.com',
  name: 'Demo User',
  avatar: undefined,
  role: 'admin',
  plan: 'pro',
  teamId: undefined,
  permissions: ROLE_PERMISSIONS.admin,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  emailVerified: true,
  settings: {
    language: 'zh',
    theme: 'system',
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

  // Actions - 资料
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  updateSettings: (settings: Partial<User['settings']>) => void;

  // Actions - 状态
  setError: (error: string | null) => void;
  clearError: () => void;

  // Computed / Helpers
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  canCreatePrompt: () => boolean;
  canCreateCollection: () => boolean;
  getPlanLimits: () => typeof PLAN_LIMITS[keyof typeof PLAN_LIMITS] | null;
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
            // Mock 模式：使用本地存储的用户数据或默认用户
            const storedUser = get().user;
            if (storedUser) {
              set({ isAuthenticated: true, initialized: true, isLoading: false });
            } else {
              // 自动登录为 Mock 用户
              set({ user: MOCK_USER, isAuthenticated: true, initialized: true, isLoading: false });
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
              plan: 'free',
              permissions: ROLE_PERMISSIONS.member,
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
          set({ user: null, isAuthenticated: false, isLoading: false });
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

      // 设置错误
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // 检查权限
      hasPermission: (permission: Permission) => {
        return hasPermission(get().user, permission);
      },

      hasAnyPermission: (permissions: Permission[]) => {
        return hasAnyPermission(get().user, permissions);
      },

      // 检查是否可以创建 Prompt
      canCreatePrompt: () => {
        const { user } = get();
        if (!user) return false;
        if (!hasPermission(user, 'prompt:create')) return false;
        // 这里需要从 promptStore 获取当前数量，暂时返回 true
        return true;
      },

      // 检查是否可以创建 Collection
      canCreateCollection: () => {
        const { user } = get();
        if (!user) return false;
        if (!hasPermission(user, 'collection:create')) return false;
        return true;
      },

      // 获取计划限制
      getPlanLimits: () => {
        const { user } = get();
        if (!user) return null;
        return PLAN_LIMITS[user.plan];
      },
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
