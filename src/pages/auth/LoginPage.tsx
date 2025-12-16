/**
 * Login Page
 * 用户登录页面 - 现代化设计
 */

import { useState, useMemo } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader2, Github, AlertCircle, Sparkles } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/utils';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

// Email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginPage({ onSwitchToRegister, onForgotPassword }: LoginPageProps) {
  const { t } = useI18nStore();
  const { theme } = useThemeStore();
  const { login, loginWithOAuth, isLoading, error, clearError } = useAuthStore();
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  // Validation
  const validation = useMemo(() => ({
    email: touched.email && email ? (isValidEmail(email) ? null : 'Please enter a valid email address') : null,
    password: touched.password && !password ? 'Password is required' : null,
  }), [email, password, touched]);

  const isValid = email && password && isValidEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setTouched({ email: true, password: true });

    if (!isValid) return;

    try {
      await login({ email, password, rememberMe });
    } catch {
      // Error is handled in store
    }
  };

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden',
      isDark ? 'bg-dark-900' : 'bg-slate-50'
    )}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          'absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl',
          isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/20'
        )} />
        <div className={cn(
          'absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl',
          isDark ? 'bg-purple-500/10' : 'bg-purple-500/20'
        )} />
        <div className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl',
          isDark ? 'bg-indigo-600/5' : 'bg-indigo-600/10'
        )} />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 mb-6 shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className={cn(
            'text-2xl font-bold',
            isDark ? 'text-white' : 'text-slate-900'
          )}>
            Prompt Studio
          </h1>
          <p className={cn(
            'mt-2 text-sm',
            isDark ? 'text-slate-400' : 'text-slate-600'
          )}>
            {t.auth?.login?.subtitle || 'Sign in to your account to continue'}
          </p>
        </div>

        {/* Card */}
        <div className={cn(
          'rounded-2xl border p-8 backdrop-blur-sm',
          isDark
            ? 'bg-dark-800/80 border-slate-800'
            : 'bg-white/80 border-slate-200 shadow-xl shadow-slate-200/50'
        )}>
          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <div className={cn(
                'rounded-xl p-4 border',
                isDark
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-red-50 border-red-200'
              )}>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className={cn('text-sm', isDark ? 'text-red-400' : 'text-red-600')}>{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className={cn(
                  'block text-xs font-semibold uppercase tracking-wider mb-2',
                  isDark ? 'text-slate-400' : 'text-slate-600'
                )}>
                  {t.auth?.login?.email || 'Email'}
                </label>
                <div className="relative">
                  <Mail className={cn(
                    'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4',
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  )} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                    placeholder={t.auth?.login?.emailPlaceholder || 'you@example.com'}
                    className={cn('pl-11', validation.email ? 'border-red-500' : '')}
                    required
                    autoComplete="email"
                  />
                </div>
                {validation.email && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validation.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={cn(
                  'block text-xs font-semibold uppercase tracking-wider mb-2',
                  isDark ? 'text-slate-400' : 'text-slate-600'
                )}>
                  {t.auth?.login?.password || 'Password'}
                </label>
                <div className="relative">
                  <Lock className={cn(
                    'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4',
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  )} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                    placeholder="••••••••"
                    className={cn('pl-11 pr-11', validation.password ? 'border-red-500' : '')}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      'absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors',
                      isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                    )}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={cn(
                    'w-4 h-4 rounded border-2 transition-all peer-checked:bg-indigo-500 peer-checked:border-indigo-500',
                    isDark
                      ? 'border-slate-600 group-hover:border-slate-500'
                      : 'border-slate-300 group-hover:border-slate-400'
                  )}>
                    <svg
                      className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 8l3 3 5-6" />
                    </svg>
                  </div>
                </div>
                <span className={cn(
                  'text-sm',
                  isDark ? 'text-slate-400' : 'text-slate-600'
                )}>
                  {t.auth?.login?.rememberMe || 'Remember me'}
                </span>
              </label>

              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
              >
                {t.auth?.login?.forgotPassword || 'Forgot password?'}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.auth?.login?.signingIn || 'Signing in...'}
                </>
              ) : (
                t.auth?.login?.signIn || 'Sign in'
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={cn(
                  'w-full border-t',
                  isDark ? 'border-slate-800' : 'border-slate-200'
                )} />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className={cn(
                  'px-3',
                  isDark ? 'bg-dark-800 text-slate-500' : 'bg-white text-slate-400'
                )}>
                  {t.auth?.login?.orContinueWith || 'Or continue with'}
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11"
                disabled={isLoading}
                onClick={() => loginWithOAuth('google')}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11"
                disabled={isLoading}
                onClick={() => loginWithOAuth('github')}
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>
          </form>
        </div>

        {/* Sign Up Link */}
        <p className={cn(
          'text-center text-sm mt-6',
          isDark ? 'text-slate-400' : 'text-slate-600'
        )}>
          {t.auth?.login?.noAccount || "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            {t.auth?.login?.signUp || 'Sign up'}
          </button>
        </p>

        {/* Demo Credentials */}
        {import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' && (
          <div className={cn(
            'mt-6 p-4 rounded-xl border',
            isDark
              ? 'bg-indigo-500/10 border-indigo-500/20'
              : 'bg-indigo-50 border-indigo-200'
          )}>
            <p className={cn(
              'text-sm font-medium mb-2',
              isDark ? 'text-indigo-300' : 'text-indigo-700'
            )}>
              Demo Credentials:
            </p>
            <p className={cn(
              'text-sm font-mono',
              isDark ? 'text-indigo-400' : 'text-indigo-600'
            )}>
              Email: demo@promptstudio.com<br />
              Password: demo123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
