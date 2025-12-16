/**
 * Reset Password Page
 * 重置密码页面 - 用于从邮件链接跳转
 */

import { useState, useEffect } from 'react';
import { Lock, Loader2, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff, Check, X } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useI18nStore } from '@/stores/i18nStore';
import { authService } from '@/services/authService';

interface ResetPasswordPageProps {
  token: string;
  onBackToLogin: () => void;
  onSuccess: () => void;
}

// 密码强度检查
function checkPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  return {
    checks,
    score,
    strength: score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong',
  };
}

export function ResetPasswordPage({ token, onBackToLogin, onSuccess }: ResetPasswordPageProps) {
  const { t } = useI18nStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  const passwordStrength = checkPasswordStrength(password);
  const passwordsMatch = password === confirmPassword;
  const isValid = password && confirmPassword && passwordsMatch && passwordStrength.score >= 3;

  // 验证 token（可选，根据后端实现）
  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValid) return;

    setIsLoading(true);

    try {
      // Mock 模式下模拟成功
      if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSuccess(true);
      } else {
        await authService.confirmPasswordReset({ token, password });
        setIsSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  // 成功状态
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.auth?.resetPassword?.success || 'Password reset successful'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t.auth?.resetPassword?.successMessage || 'Your password has been reset. You can now sign in with your new password.'}
            </p>
          </div>

          <Button
            className="w-full"
            onClick={onSuccess}
          >
            {t.auth?.resetPassword?.signIn || 'Sign in'}
          </Button>
        </div>
      </div>
    );
  }

  // 无效 token 状态
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.auth?.resetPassword?.invalidToken || 'Invalid reset link'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t.auth?.resetPassword?.invalidTokenMessage || 'This password reset link is invalid or has expired. Please request a new one.'}
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={onBackToLogin}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.auth?.resetPassword?.backToLogin || 'Back to login'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Prompt Studio
          </h1>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            {t.auth?.resetPassword?.title || 'Create new password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t.auth?.resetPassword?.subtitle || 'Enter your new password below'}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.auth?.resetPassword?.newPassword || 'New Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= passwordStrength.score
                            ? strengthColors[passwordStrength.strength as keyof typeof strengthColors]
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.checks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      8+ characters
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.checks.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Uppercase
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.checks.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Lowercase
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.checks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Number
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.auth?.resetPassword?.confirmPassword || 'Confirm Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pl-10 ${confirmPassword && !passwordsMatch ? 'border-red-500' : ''}`}
                  required
                  autoComplete="new-password"
                />
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-sm text-red-500">
                  {t.auth?.register?.passwordMismatch || 'Passwords do not match'}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.auth?.resetPassword?.resetting || 'Resetting...'}
              </>
            ) : (
              t.auth?.resetPassword?.resetPassword || 'Reset Password'
            )}
          </Button>

          {/* Back to Login */}
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onBackToLogin}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.auth?.resetPassword?.backToLogin || 'Back to login'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
