/**
 * Profile Settings Component
 * 用户资料设置页面
 */

import { useState, useEffect } from 'react';
import { User, Mail, Camera, Loader2, Check, Save } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { SettingsSection } from './shared';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';

export function ProfileSettings() {
  const { t } = useI18nStore();
  const { user, updateProfile, isLoading } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
  }, [user?.name]);

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) return;

    setAvatarUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        try {
          await updateProfile({ avatar: base64 });
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        } catch {
          setSaveStatus('error');
        } finally {
          setAvatarUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setAvatarUploading(false);
      setSaveStatus('error');
    }
  };

  return (
    <div className="space-y-5">
      {/* 基本信息 */}
      <SettingsSection
        title={t.settings?.basicInfo || 'Basic Information'}
        description={t.settings?.basicInfoDescription || 'Update your profile information'}
      >
        <div className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-theme-accent via-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-2xl flex items-center justify-center overflow-hidden bg-theme-card-bg">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-theme-accent">
                      {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>
              {/* Upload overlay */}
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200">
                {avatarUploading ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={avatarUploading}
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-theme-text-primary">
                {t.settings?.profilePicture || 'Profile Picture'}
              </p>
              <p className="text-xs mt-1 text-theme-text-secondary">
                {t.settings?.profilePictureHint || 'Click to upload a new avatar (max 2MB)'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
              {t.settings?.displayName || 'Display Name'}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.settings?.displayNamePlaceholder || 'Your name'}
                className="pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
              {t.settings?.email || 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
              <Input value={user?.email || ''} disabled className="pl-11 opacity-60 cursor-not-allowed" />
            </div>
            <p className="mt-1.5 text-xs text-theme-text-secondary">
              {t.settings?.emailCannotChange || 'Email cannot be changed'}
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveProfile}
              disabled={isLoading || saveStatus === 'saving' || name === user?.name}
              size="sm"
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
      </SettingsSection>
    </div>
  );
}

export default ProfileSettings;
