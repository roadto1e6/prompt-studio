/**
 * SecuritySettings 组件 - 重构版本
 * 安全设置页面
 *
 * 重构内容：
 * - 分离类型定义到 types.ts
 * - 分离业务逻辑到 useSecuritySettings.ts
 * - 分离样式到 index.module.css
 * - 视图层采用 React.memo 优化
 * - 完整的密码修改流程
 * - 邮箱验证管理
 * - 会话管理
 *
 * 功能：
 * - 修改密码（当前密码验证、新密码强度验证、确认密码匹配）
 * - 邮箱验证状态展示与重发验证邮件
 * - 会话管理（登出）
 * - 表单验证与错误提示
 * - 敏感操作的确认流程
 *
 * @example
 * ```tsx
 * <SecuritySettings onClose={() => setShowSettings(false)} />
 * ```
 */

import React from 'react';
import { Lock, Eye, EyeOff, Check, Loader2, Send, LogOut } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useI18nStore } from '@/stores/i18nStore';
import { useSecuritySettings } from './useSecuritySettings';
import type { SecuritySettingsProps } from './types';
import styles from './index.module.css';

/**
 * SecuritySettings 组件
 */
export const SecuritySettings: React.FC<SecuritySettingsProps> = React.memo(
  ({ onClose }) => {
    const { t } = useI18nStore();

    // 使用自定义 Hook 管理状态和逻辑
    const {
      passwordForm,
      passwordFormState,
      passwordError,
      saveStatus,
      securityData,
      isLoading,
      handlePasswordChange,
      handleTogglePasswordVisibility,
      handleChangePassword,
      handleSendVerificationEmail,
      handleLogout,
    } = useSecuritySettings(onClose);

    // ============ 渲染辅助函数 ============

    /**
     * 渲染密码输入框
     */
    const renderPasswordInput = (
      field: 'currentPassword' | 'newPassword' | 'confirmPassword',
      label: string,
      placeholder: string,
      showToggle: boolean = false,
      isVisible: boolean = false
    ) => (
      <div className={styles.formField}>
        <label className={styles.formLabel}>{label}</label>
        <div className={styles.passwordInputWrapper}>
          <Lock className={styles.passwordIcon} />
          <Input
            type={isVisible ? 'text' : 'password'}
            value={passwordForm[field]}
            onChange={(e) => handlePasswordChange(field, e.target.value)}
            placeholder={placeholder}
            className="pl-11 pr-11"
            disabled={saveStatus === 'saving'}
          />
          {showToggle && (
            <button
              type="button"
              onClick={() =>
                handleTogglePasswordVisibility(
                  field === 'currentPassword' ? 'current' : 'new'
                )
              }
              className={styles.togglePasswordButton}
              aria-label={isVisible ? 'Hide password' : 'Show password'}
            >
              {isVisible ? (
                <EyeOff className={styles.togglePasswordIcon} />
              ) : (
                <Eye className={styles.togglePasswordIcon} />
              )}
            </button>
          )}
        </div>
      </div>
    );

    /**
     * 是否可以提交密码修改
     */
    const canSubmitPasswordChange =
      saveStatus !== 'saving' &&
      passwordForm.currentPassword &&
      passwordForm.newPassword &&
      passwordForm.confirmPassword;

    // ============ 渲染 ============

    return (
      <div className={styles.container}>
        {/* 错误提示 */}
        {passwordError && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{passwordError}</p>
          </div>
        )}

        {/* ========== 修改密码 ========== */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            {t.settings?.changePassword || 'Change Password'}
          </h3>
          <div className={styles.formSection}>
            {/* 当前密码 */}
            {renderPasswordInput(
              'currentPassword',
              t.settings?.currentPassword || 'Current Password',
              t.settings?.currentPasswordPlaceholder ||
                'Enter current password',
              true,
              passwordFormState.showCurrentPassword
            )}

            {/* 新密码和确认密码 */}
            <div className={styles.formGrid}>
              {renderPasswordInput(
                'newPassword',
                t.settings?.newPassword || 'New Password',
                '********',
                true,
                passwordFormState.showNewPassword
              )}

              {renderPasswordInput(
                'confirmPassword',
                t.settings?.confirmNewPassword || 'Confirm Password',
                '********',
                false,
                false
              )}
            </div>

            {/* 提交按钮 */}
            <div className={styles.formActions}>
              <Button
                onClick={handleChangePassword}
                disabled={!canSubmitPasswordChange}
                variant="secondary"
                size="sm"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.settings?.changing || 'Changing...'}
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t.settings?.saved || 'Saved'}
                  </>
                ) : (
                  t.settings?.updatePassword || 'Update Password'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ========== 账户状态 ========== */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            {t.settings?.accountInfo || 'Account Status'}
          </h3>
          <div className={styles.statusRow}>
            <div className={styles.statusLabel}>
              <span>{t.settings?.emailVerified || 'Email Verified'}</span>
              <span className={styles.statusHint}>
                {securityData?.emailVerified
                  ? 'Your email has been verified'
                  : 'Please verify your email address'}
              </span>
            </div>
            <div className={styles.verificationActions}>
              {securityData?.emailVerified ? (
                <span className={`${styles.statusBadge} ${styles.statusBadgeVerified}`}>
                  <Check className={styles.statusBadgeIcon} />
                  Verified
                </span>
              ) : (
                <>
                  <span className={`${styles.statusBadge} ${styles.statusBadgeUnverified}`}>
                    Unverified
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSendVerificationEmail}
                    disabled={isLoading}
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {t.settings?.resendVerification || 'Resend'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ========== 登出 ========== */}
        <div className={styles.sessionContainer}>
          <div className={styles.sessionInfo}>
            <span className={styles.sessionTitle}>
              {t.settings?.session || 'Session'}
            </span>
            <span className={styles.sessionDescription}>
              {t.settings?.logoutDescription ||
                'Sign out of your account on this device'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className={styles.logoutButton}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t.settings?.logout || 'Log out'}
          </Button>
        </div>
      </div>
    );
  }
);

// 设置显示名称（用于 React DevTools）
SecuritySettings.displayName = 'SecuritySettings';

export default SecuritySettings;
