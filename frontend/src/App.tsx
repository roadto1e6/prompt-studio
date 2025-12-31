import { useEffect, useState } from 'react';
import { HomePage } from '@/pages/HomePage';
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from '@/pages/auth';
import { AuthGuard } from '@/components/auth';
import { ToastContainer } from '@/components/ui';
import { useThemeStore, useAuthStore, useModelStore } from '@/stores';
import { tokenManager } from '@/services/api';

type AuthView = 'login' | 'register' | 'forgotPassword' | 'resetPassword';

// 从 URL 获取重置密码 token
function getResetTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('reset_token');
}

// 从 URL 获取 OAuth 回调的 tokens（后端重定向流程）
function getOAuthTokensFromUrl(): { accessToken: string; refreshToken: string } | null {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }
  return null;
}

// 从 URL 获取 OAuth 回调参数（code 流程 - 备用）
function getOAuthCallbackParams(): { provider: 'google' | 'github'; code: string } | null {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  // 根据 state 或 URL 路径判断 provider
  if (code) {
    if (window.location.pathname.includes('google') || state?.includes('google')) {
      return { provider: 'google', code };
    }
    if (window.location.pathname.includes('github') || state?.includes('github')) {
      return { provider: 'github', code };
    }
  }
  return null;
}

// 检查 URL 中的错误参数
function getOAuthErrorFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('error');
}

function App() {
  const { theme } = useThemeStore();
  const { initialize, handleOAuthCallback } = useAuthStore();
  const { initialize: initializeModels } = useModelStore();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [resetToken, setResetToken] = useState<string | null>(null);

  // 初始化认证状态和模型数据
  useEffect(() => {
    initialize();
    initializeModels();
  }, [initialize, initializeModels]);

  // 检查 URL 参数（重置密码 token 或 OAuth 回调）
  useEffect(() => {
    // 检查重置密码 token
    const token = getResetTokenFromUrl();
    if (token) {
      setResetToken(token);
      setAuthView('resetPassword');
      // 清理 URL
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // 检查 OAuth 错误
    const oauthError = getOAuthErrorFromUrl();
    if (oauthError) {
      console.error('OAuth error:', oauthError);
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // 检查 OAuth 回调 - 后端重定向流程（tokens 直接在 URL 中）
    const oauthTokens = getOAuthTokensFromUrl();
    if (oauthTokens) {
      // 设置 tokens 并初始化用户状态
      tokenManager.setTokens(oauthTokens.accessToken, oauthTokens.refreshToken);
      // 清理 URL
      window.history.replaceState({}, '', window.location.pathname);
      // 重新初始化以获取用户信息
      initialize();
      return;
    }

    // 检查 OAuth 回调 - code 流程（备用）
    const oauthParams = getOAuthCallbackParams();
    if (oauthParams) {
      handleOAuthCallback(oauthParams.provider, oauthParams.code)
        .then(() => {
          // 清理 URL
          window.history.replaceState({}, '', window.location.pathname);
        })
        .catch(() => {
          // 错误在 store 中处理
          window.history.replaceState({}, '', window.location.pathname);
        });
    }
  }, [handleOAuthCallback, initialize]);

  // 应用主题 - 带平滑过渡
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.add('theme-transition');

    // 过渡完成后移除 class（匹配 CSS 中最长的过渡时间 450ms + 缓冲）
    const transitionTimeout = window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 500);

    return () => {
      window.clearTimeout(transitionTimeout);
      root.classList.remove('theme-transition');
    };
  }, [theme]);

  // 渲染认证页面
  const renderAuthPage = () => {
    switch (authView) {
      case 'register':
        return (
          <RegisterPage
            onSwitchToLogin={() => setAuthView('login')}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordPage
            onBackToLogin={() => setAuthView('login')}
          />
        );
      case 'resetPassword':
        return (
          <ResetPasswordPage
            token={resetToken || ''}
            onBackToLogin={() => {
              setResetToken(null);
              setAuthView('login');
            }}
            onSuccess={() => {
              setResetToken(null);
              setAuthView('login');
            }}
          />
        );
      case 'login':
      default:
        return (
          <LoginPage
            onSwitchToRegister={() => setAuthView('register')}
            onForgotPassword={() => setAuthView('forgotPassword')}
          />
        );
    }
  };

  return (
    <>
      <AuthGuard
        requireAuth={true}
        fallback={renderAuthPage()}
      >
        <HomePage />
      </AuthGuard>
      <ToastContainer />
    </>
  );
}

export default App;
