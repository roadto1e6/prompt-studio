// 文件路径: frontend/src/components/settings/ProfileSettings/types.ts

/**
 * ProfileSettings 类型定义
 * 契约层：先设计数据结构，后写逻辑
 */

/**
 * 个人资料数据
 */
export interface ProfileData {
  /** 用户名 */
  name: string;
  /** 邮箱（只读） */
  email: string;
  /** 头像 URL 或 base64 */
  avatar?: string;
}

/**
 * 表单字段值
 */
export interface FormValues {
  /** 显示名称 */
  name: string;
}

/**
 * 表单字段错误信息
 */
export interface FormErrors {
  /** 名称字段错误 */
  name?: string;
}

/**
 * 保存状态
 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Hook 返回的状态和方法
 */
export interface UseProfileSettingsReturn {
  /** 表单字段值 */
  values: FormValues;
  /** 表单字段错误 */
  errors: FormErrors;
  /** 保存状态 */
  saveStatus: SaveStatus;
  /** 是否正在保存 */
  isSaving: boolean;
  /** 头像上传中状态 */
  avatarUploading: boolean;
  /** 错误信息（全局错误） */
  errorMessage: string | null;
  /** 用户数据 */
  user: ProfileData | null;

  /** 更新名称字段 */
  handleNameChange: (value: string) => void;
  /** 处理表单保存 */
  handleSaveProfile: () => Promise<void>;
  /** 处理头像上传 */
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  /** 重置表单 */
  reset: () => void;
}

/**
 * 组件 Props
 */
export interface ProfileSettingsProps {
  /** 自定义类名（可选） */
  className?: string;
}
