/**
 * Settings Modal
 * 用户设置和个人资料模态框
 */

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Globe,
  Palette,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Check,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { Modal, Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'profile' | 'security' | 'preferences';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { t, language, setLanguage } = useI18nStore();
  const { theme, setTheme } = useThemeStore();
  const { user, updateProfile, isLoading } = useAuthStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const email = user?.email || '';

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(user?.name || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError(null);
      setSaveStatus('idle');
    }
  }, [isOpen, user?.name]);

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: t.settings?.profile || 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: t.settings?.security || 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'preferences', label: t.settings?.preferences || 'Preferences', icon: <Palette className="w-4 h-4" /> },
  ];

  const handleSaveProfile = async () => {
    if (!name.trim()) return;

    setSaveStatus('saving');
    try {
      await updateProfile({ name });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  };

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
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaveStatus('saved');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setPasswordError(t.settings?.passwordChangeFailed || 'Failed to change password');
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-white">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-white truncate">{user?.name}</p>
          <p className="text-sm text-slate-400 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.settings?.displayName || 'Display Name'}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.settings?.displayNamePlaceholder || 'Your name'}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.settings?.email || 'Email'}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={email}
              disabled
              className="pl-10 opacity-50 cursor-not-allowed"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">{t.settings?.emailCannotChange || 'Email cannot be changed'}</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-slate-800">
        <Button
          onClick={handleSaveProfile}
          disabled={isLoading || saveStatus === 'saving' || name === user?.name}
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t.settings?.saving || 'Saving...'}
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              {t.settings?.saved || 'Saved!'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {t.settings?.saveChanges || t.common?.save || 'Save'}
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Password Section */}
      <div>
        <h3 className="text-sm font-medium text-white mb-4">{t.settings?.changePassword || 'Change Password'}</h3>

        {passwordError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{passwordError}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {t.settings?.currentPassword || 'Current Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t.settings?.currentPasswordPlaceholder || 'Enter current password'}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {t.settings?.newPassword || 'New Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t.settings?.newPasswordPlaceholder || 'Enter new password'}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {t.settings?.confirmNewPassword || 'Confirm New Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.settings?.confirmNewPasswordPlaceholder || 'Confirm new password'}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={saveStatus === 'saving' || !currentPassword || !newPassword || !confirmPassword}
            variant="secondary"
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

      {/* Account Status */}
      <div className="pt-6 border-t border-slate-800">
        <h3 className="text-sm font-medium text-white mb-4">{t.settings?.accountInfo || 'Account Information'}</h3>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-slate-400">{t.settings?.emailVerified || 'Email Verified'}</span>
          <span className={cn(
            'text-sm font-medium',
            user?.emailVerified ? 'text-emerald-400' : 'text-amber-400'
          )}>
            {user?.emailVerified ? (t.settings?.yes || 'Yes') : (t.settings?.no || 'No')}
          </span>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Language */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t.settings?.language || 'Language'}
          </div>
        </label>
        <p className="text-xs text-slate-500 mb-3">{t.settings?.languageDescription || 'Choose your preferred language'}</p>
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              language === 'en'
                ? 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/50'
                : 'bg-dark-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
          >
            {language === 'en' && <Check className="w-4 h-4" />}
            {t.settings?.english || 'English'}
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              language === 'zh'
                ? 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/50'
                : 'bg-dark-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
          >
            {language === 'zh' && <Check className="w-4 h-4" />}
            {t.settings?.chinese || '中文'}
          </button>
        </div>
      </div>

      {/* Theme */}
      <div className="pt-6 border-t border-slate-800">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            {t.settings?.theme || 'Theme'}
          </div>
        </label>
        <p className="text-xs text-slate-500 mb-3">{t.settings?.themeDescription || 'Choose your preferred theme'}</p>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme('light')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              theme === 'light'
                ? 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/50'
                : 'bg-dark-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
          >
            <Sun className="w-4 h-4" />
            {t.settings?.light || 'Light'}
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              theme === 'dark'
                ? 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/50'
                : 'bg-dark-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
          >
            <Moon className="w-4 h-4" />
            {t.settings?.dark || 'Dark'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.settings?.title || 'Settings'}
      size="xl"
    >
      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                  activeTab === tab.id
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-[420px]">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
        </div>
      </div>
    </Modal>
  );
}

export default SettingsModal;
