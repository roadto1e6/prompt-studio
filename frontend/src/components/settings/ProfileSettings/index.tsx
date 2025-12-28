/**
 * ProfileSettings 组件 - 视图层
 * 文件路径: frontend/src/components/settings/ProfileSettings/index.tsx
 *
 * 职责：
 * 1. 纯声明式 UI 渲染
 * 2. 所有逻辑委托给 useProfileSettings Hook
 * 3. 样式通过 CSS Modules 管理
 */

import { memo, useRef } from 'react';
import { Camera, Loader2, User, Mail, Save, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useProfileSettings } from './useProfileSettings';
import styles from './index.module.css';
import type { ProfileSettingsProps } from './types';

/**
 * ProfileSettings 组件
 *
 * @description 个人资料设置页面，包含头像上传和个人信息编辑
 * @param {ProfileSettingsProps} props - 组件属性
 * @returns {JSX.Element} 个人资料设置组件
 */
const ProfileSettings = memo<ProfileSettingsProps>(({ className = '' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    values,
    errors,
    saveStatus,
    isSaving,
    avatarUploading,
    errorMessage,
    user,
    handleNameChange,
    handleSaveProfile,
    handleAvatarUpload,
  } = useProfileSettings();

  /**
   * 触发文件选择
   */
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  /**
   * 获取用户头像首字母
   */
  const getInitials = (): string => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  /**
   * 渲染保存按钮图标
   */
  const renderSaveIcon = () => {
    if (isSaving) {
      return <Loader2 className={styles.buttonSpinner} aria-hidden="true" />;
    }
    if (saveStatus === 'saved') {
      return <Check className={styles.buttonIcon} aria-hidden="true" />;
    }
    return <Save className={styles.buttonIcon} aria-hidden="true" />;
  };

  /**
   * 获取保存按钮文本
   */
  const getSaveButtonText = (): string => {
    if (isSaving) return 'Saving...';
    if (saveStatus === 'saved') return 'Saved';
    return 'Save Changes';
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* 错误提示 */}
      {errorMessage && (
        <div className={styles.errorAlert} role="alert">
          <AlertCircle className={styles.errorAlertIcon} aria-hidden="true" />
          <div className={styles.errorAlertContent}>
            <div className={styles.errorAlertTitle}>Error</div>
            <div className={styles.errorAlertMessage}>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* 头像上传区域 */}
      <div className={styles.avatarSection}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarInner}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User avatar"
                  className={styles.avatarImage}
                />
              ) : (
                <span className={styles.avatarInitials}>{getInitials()}</span>
              )}
            </div>
          </div>
          <label className={styles.uploadOverlay} onClick={triggerFileInput}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleAvatarUpload}
              disabled={avatarUploading}
              aria-label="Upload avatar"
            />
            {avatarUploading ? (
              <Loader2 className={styles.uploadSpinner} aria-hidden="true" />
            ) : (
              <Camera className={styles.uploadIcon} aria-hidden="true" />
            )}
          </label>
        </div>
        <div className={styles.avatarInfo}>
          <div className={styles.avatarTitle}>Profile Photo</div>
          <div className={styles.avatarHint}>
            JPG, PNG, GIF or WebP. Max 2MB.
          </div>
        </div>
      </div>

      {/* 个人信息表单 */}
      <div className={styles.formContainer}>
        {/* 显示名称 */}
        <div className={styles.formField}>
          <label htmlFor="profile-name" className={styles.formLabel}>
            Display Name
          </label>
          <div className={styles.inputWrapper}>
            <User className={styles.inputIcon} aria-hidden="true" />
            <Input
              id="profile-name"
              type="text"
              value={values.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter your name"
              error={errors.name}
              className={styles.inputWithIcon}
              disabled={isSaving}
            />
          </div>
        </div>

        {/* 邮箱（只读） */}
        <div className={styles.formField}>
          <label htmlFor="profile-email" className={styles.formLabel}>
            Email Address
          </label>
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} aria-hidden="true" />
            <Input
              id="profile-email"
              type="email"
              value={user?.email || ''}
              readOnly
              disabled
              className={styles.inputWithIcon}
            />
          </div>
          <p className={styles.fieldHint}>
            Email address cannot be changed
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className={styles.actionsContainer}>
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving || !!errors.name}
          variant="primary"
          success={saveStatus === 'saved'}
          className={styles.saveButton}
        >
          {renderSaveIcon()}
          {getSaveButtonText()}
        </Button>
      </div>
    </div>
  );
});

ProfileSettings.displayName = 'ProfileSettings';

export { ProfileSettings };
export type { ProfileSettingsProps } from './types';
