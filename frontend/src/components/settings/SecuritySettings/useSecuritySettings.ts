/**
 * useSecuritySettings Hook
 * 安全设置业务逻辑
 *
 * 功能：
 * - 密码修改表单管理
 * - 密码验证逻辑
 * - 邮箱验证发送
 * - 会话管理（登出）
 * - 表单状态管理
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import type {
  UseSecuritySettingsReturn,
  PasswordFormData,
  PasswordFormState,
  SaveStatus,
  SecurityData,
} from './types';

/**
 * 密码验证规则
 */
const PASSWORD_MIN_LENGTH = 8;
// 密码强度正则（备用，暂未启用）
// const PASSWORD_REGEX = {
//   strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
// };

/**
 * useSecuritySettings Hook
 */
export function useSecuritySettings(
  onClose?: () => void
): UseSecuritySettingsReturn {
  const { user, changePassword, logout, sendVerificationEmail, isLoading } =
    useAuthStore();
  const { t } = useI18nStore();

  // ============ 状态管理 ============

  // 密码表单数据
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 密码表单UI状态
  const [passwordFormState, setPasswordFormState] =
    useState<PasswordFormState>({
      showCurrentPassword: false,
      showNewPassword: false,
    });

  // 表单错误和保存状态
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // ============ 计算属性 ============

  /**
   * 安全数据（从用户信息派生）
   */
  const securityData = useMemo<SecurityData | null>(() => {
    if (!user) return null;

    return {
      emailVerified: user.emailVerified || false,
      email: user.email,
      twoFactorEnabled: false, // TODO: 从用户数据中获取
      lastPasswordChange: user.updatedAt,
      activeSessions: 1, // TODO: 从后端获取
    };
  }, [user]);

  // ============ 初始化 ============

  /**
   * 组件挂载时重置表单
   */
  useEffect(() => {
    clearPasswordForm();
  }, []);

  // ============ 表单验证 ============

  /**
   * 验证密码表单
   */
  const validatePasswordForm = useCallback((): boolean => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    // 检查必填字段
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(
        t.settings?.passwordRequired || 'Please fill in all password fields'
      );
      return false;
    }

    // 检查新密码长度
    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(
        t.settings?.passwordTooShort ||
          `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
      );
      return false;
    }

    // 检查密码强度（可选）
    // if (!PASSWORD_REGEX.strong.test(newPassword)) {
    //   setPasswordError(
    //     'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    //   );
    //   return false;
    // }

    // 检查密码匹配
    if (newPassword !== confirmPassword) {
      setPasswordError(
        t.auth?.register?.passwordMismatch || 'Passwords do not match'
      );
      return false;
    }

    // 检查新密码是否与当前密码相同
    if (currentPassword === newPassword) {
      setPasswordError(
        'New password must be different from current password'
      );
      return false;
    }

    return true;
  }, [passwordForm, t]);

  // ============ 密码操作 ============

  /**
   * 处理密码字段变化
   */
  const handlePasswordChange = useCallback(
    (field: keyof PasswordFormData, value: string) => {
      setPasswordForm((prev) => ({
        ...prev,
        [field]: value,
      }));

      // 清除错误提示（当用户开始输入时）
      if (passwordError) {
        setPasswordError(null);
      }
    },
    [passwordError]
  );

  /**
   * 切换密码可见性
   */
  const handleTogglePasswordVisibility = useCallback(
    (field: 'current' | 'new') => {
      setPasswordFormState((prev) => ({
        ...prev,
        [field === 'current' ? 'showCurrentPassword' : 'showNewPassword']:
          !prev[
            field === 'current' ? 'showCurrentPassword' : 'showNewPassword'
          ],
      }));
    },
    []
  );

  /**
   * 修改密码
   */
  const handleChangePassword = useCallback(async () => {
    // 清除之前的错误
    setPasswordError(null);

    // 验证表单
    if (!validatePasswordForm()) {
      return;
    }

    // 设置保存中状态
    setSaveStatus('saving');

    try {
      // 调用修改密码API
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      // 成功
      setSaveStatus('saved');

      // 清空表单
      clearPasswordForm();

      // 2秒后重置状态
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (err) {
      // 失败
      setSaveStatus('error');

      // 设置错误信息
      const errorMessage =
        err instanceof Error
          ? err.message
          : t.settings?.passwordChangeFailed || 'Failed to change password';

      setPasswordError(errorMessage);
    }
  }, [passwordForm, validatePasswordForm, changePassword, t]);

  /**
   * 清空密码表单
   */
  const clearPasswordForm = useCallback(() => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordFormState({
      showCurrentPassword: false,
      showNewPassword: false,
    });
    setPasswordError(null);
    setSaveStatus('idle');
  }, []);

  // ============ 账户操作 ============

  /**
   * 发送邮箱验证邮件
   */
  const handleSendVerificationEmail = useCallback(async () => {
    try {
      await sendVerificationEmail();

      // 显示成功状态
      setSaveStatus('saved');

      // 2秒后重置
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (err) {
      // 错误已在 store 中处理
      console.error('Failed to send verification email:', err);
    }
  }, [sendVerificationEmail]);

  /**
   * 登出
   */
  const handleLogout = useCallback(async () => {
    try {
      await logout();

      // 关闭设置面板
      onClose?.();
    } catch (err) {
      // 错误已在 store 中处理
      console.error('Logout failed:', err);
    }
  }, [logout, onClose]);

  // ============ 返回值 ============

  return {
    // 密码表单
    passwordForm,
    passwordFormState,
    passwordError,
    saveStatus,

    // 用户数据
    securityData,
    isLoading,

    // 密码操作
    handlePasswordChange,
    handleTogglePasswordVisibility,
    handleChangePassword,

    // 账户操作
    handleSendVerificationEmail,
    handleLogout,

    // 工具方法
    validatePasswordForm,
    clearPasswordForm,
  };
}

export default useSecuritySettings;
