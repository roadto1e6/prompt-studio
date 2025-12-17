/**
 * Security Settings Component
 * 安全设置页面
 */

import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Check, Loader2, Send, LogOut } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { SettingsSection, SettingsRow } from './shared';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';

interface SecuritySettingsProps {
  onClose?: () => void;
}

export function SecuritySettings({ onClose }: SecuritySettingsProps) {
  const { t } = useI18nStore();
  const { user, changePassword, logout, sendVerificationEmail, isLoading } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    setSaveStatus('idle');
  }, []);

  const handleChangePassword = async () => {
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t.settings?.passwordRequired || 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t.auth?.register?.passwordMismatch || 'Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(t.settings?.passwordTooShort || 'Password must be at least 8 characters');
      return;
    }

    setSaveStatus('saving');
    try {
      await changePassword(currentPassword, newPassword);
      setSaveStatus('saved');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      setPasswordError(
        err instanceof Error ? err.message : t.settings?.passwordChangeFailed || 'Failed to change password'
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose?.();
    } catch {
      // Error handled in store
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      await sendVerificationEmail();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="space-y-5">
      {/* 修改密码 */}
      <SettingsSection
        title={t.settings?.changePassword || 'Change Password'}
        description={t.settings?.changePasswordDescription || 'Update your password to keep your account secure'}
      >
        {passwordError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{passwordError}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
              {t.settings?.currentPassword || 'Current Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t.settings?.currentPasswordPlaceholder || 'Enter current password'}
                className="pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors text-theme-text-muted hover:text-theme-text-secondary"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
                {t.settings?.newPassword || 'New Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                  className="pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors text-theme-text-muted hover:text-theme-text-secondary"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
                {t.settings?.confirmNewPassword || 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="pl-11"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleChangePassword}
              disabled={saveStatus === 'saving' || !currentPassword || !newPassword || !confirmPassword}
              variant="secondary"
              size="sm"
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.settings?.changing || 'Changing...'}
                </>
              ) : (
                t.settings?.updatePassword || 'Update Password'
              )}
            </Button>
          </div>
        </div>
      </SettingsSection>

      {/* 账户信息 */}
      <SettingsSection
        title={t.settings?.accountInfo || 'Account Information'}
        description={t.settings?.accountInfoDescription || 'View your account status'}
      >
        <div className="divide-y divide-theme-border">
          <SettingsRow
            label={t.settings?.emailVerified || 'Email Verified'}
            description={user?.emailVerified ? 'Your email has been verified' : 'Please verify your email address'}
          >
            <div className="flex items-center gap-2">
              {user?.emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full">
                  <Check className="w-3.5 h-3.5" />
                  {t.settings?.yes || 'Yes'}
                </span>
              ) : (
                <>
                  <span className="inline-flex items-center px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full">
                    {t.settings?.no || 'No'}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleSendVerificationEmail} disabled={isLoading}>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {t.settings?.resendVerification || 'Resend'}
                  </Button>
                </>
              )}
            </div>
          </SettingsRow>
        </div>
      </SettingsSection>

      {/* 登出 */}
      <SettingsSection
        title={t.settings?.session || 'Session'}
        description={t.settings?.sessionDescription || 'Manage your active session'}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-theme-text-primary">
              {t.settings?.logoutDescription || 'Sign out of your account on this device'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t.settings?.logout || 'Log out'}
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}

export default SecuritySettings;
