import { useEffect, useState } from 'react';
import { HomePage } from '@/pages/HomePage';
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from '@/pages/auth';
import { AuthGuard } from '@/components/auth';
import { ToastContainer } from '@/components/ui';
import { useThemeStore, useAuthStore, useModelStore } from '@/stores';

type AuthView = 'login' | 'register' | 'forgotPassword' | 'resetPassword';

// 从 URL 获取重置密码 token
function getResetTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('reset_token');
}

// 从 URL 获取 OAuth 回调参数
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

    // 检查 OAuth 回调
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
  }, [handleOAuthCallback]);

  // 应用主题
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.add('theme-transition');

    const transitionTimeout = window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 250);

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
