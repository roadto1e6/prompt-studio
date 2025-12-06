import { useEffect, useState } from 'react';
import { HomePage } from '@/pages/HomePage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/pages/auth';
import { AuthGuard } from '@/components/auth';
import { useThemeStore, useAuthStore } from '@/stores';

type AuthView = 'login' | 'register' | 'forgotPassword';

function App() {
  const { theme } = useThemeStore();
  const { initialize } = useAuthStore();
  const [authView, setAuthView] = useState<AuthView>('login');

  // 初始化认证状态
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 应用主题
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
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
    <AuthGuard
      requireAuth={true}
      fallback={renderAuthPage()}
    >
      <HomePage />
    </AuthGuard>
  );
}

export default App;
