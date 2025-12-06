/**
 * Forgot Password Page
 * 忘记密码页面
 */

import { useState } from 'react';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useI18nStore } from '@/stores/i18nStore';
import { authService } from '@/services/authService';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const { t } = useI18nStore();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Mock 模式下模拟成功
      if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitted(true);
      } else {
        await authService.requestPasswordReset({ email });
        setIsSubmitted(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.auth?.forgotPassword?.checkEmail || 'Check your email'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t.auth?.forgotPassword?.emailSent || `We've sent a password reset link to ${email}`}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={onBackToLogin}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.auth?.forgotPassword?.backToLogin || 'Back to login'}
            </Button>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.auth?.forgotPassword?.noEmail || "Didn't receive the email?"}{' '}
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t.auth?.forgotPassword?.tryAgain || 'Try again'}
              </button>
            </p>
          </div>
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
            {t.auth?.forgotPassword?.title || 'Reset your password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t.auth?.forgotPassword?.subtitle || "Enter your email and we'll send you a reset link"}
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

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.auth?.forgotPassword?.email || 'Email address'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth?.forgotPassword?.emailPlaceholder || 'you@example.com'}
                className="pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.auth?.forgotPassword?.sending || 'Sending...'}
              </>
            ) : (
              t.auth?.forgotPassword?.sendResetLink || 'Send reset link'
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
            {t.auth?.forgotPassword?.backToLogin || 'Back to login'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
