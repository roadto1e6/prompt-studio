/**
 * SecuritySettings Types
 * 安全设置相关类型定义
 */

/**
 * 密码表单数据
 */
export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 密码表单状态
 */
export interface PasswordFormState {
  showCurrentPassword: boolean;
  showNewPassword: boolean;
}

/**
 * 安全数据
 */
export interface SecurityData {
  emailVerified: boolean;
  email: string;
  twoFactorEnabled?: boolean;
  lastPasswordChange?: string;
  activeSessions?: number;
}

/**
 * 保存状态
 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * 密码验证错误
 */
export interface PasswordValidationError {
  field: keyof PasswordFormData;
  message: string;
}

/**
 * useSecuritySettings Hook 返回类型
 */
export interface UseSecuritySettingsReturn {
  // 密码表单
  passwordForm: PasswordFormData;
  passwordFormState: PasswordFormState;
  passwordError: string | null;
  saveStatus: SaveStatus;

  // 用户数据
  securityData: SecurityData | null;
  isLoading: boolean;

  // 密码操作
  handlePasswordChange: (field: keyof PasswordFormData, value: string) => void;
  handleTogglePasswordVisibility: (field: 'current' | 'new') => void;
  handleChangePassword: () => Promise<void>;

  // 账户操作
  handleSendVerificationEmail: () => Promise<void>;
  handleLogout: () => Promise<void>;

  // 表单验证
  validatePasswordForm: () => boolean;
  clearPasswordForm: () => void;
}

/**
 * SecuritySettings Props
 */
export interface SecuritySettingsProps {
  onClose?: () => void;
}
