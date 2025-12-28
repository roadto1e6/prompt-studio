// 文件路径: frontend/src/components/settings/ProfileSettings/useProfileSettings.ts

/**
 * ProfileSettings 逻辑层
 * Headless UI Hook：封装所有状态、副作用和处理器
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type {
  FormValues,
  FormErrors,
  SaveStatus,
  UseProfileSettingsReturn,
} from './types';

/**
 * 表单验证规则
 */
const VALIDATION_RULES = {
  name: {
    maxLength: 100,
    minLength: 1,
  },
} as const;

/**
 * 头像上传限制
 */
const AVATAR_UPLOAD_LIMITS = {
  maxSize: 2 * 1024 * 1024, // 2MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
} as const;

/**
 * ProfileSettings Headless Hook
 *
 * @description
 * 封装所有表单状态管理、验证逻辑、保存处理和副作用。
 * 采用 Headless UI 模式，视图层只需调用返回的 handlers 和 state。
 *
 * @example
 * ```tsx
 * const profile = useProfileSettings();
 * return (
 *   <form onSubmit={profile.handleSaveProfile}>
 *     <input value={profile.values.name} onChange={e => profile.handleNameChange(e.target.value)} />
 *   </form>
 * );
 * ```
 */
export function useProfileSettings(): UseProfileSettingsReturn {
  // ==================== Store 依赖 ====================
  const { user, updateProfile, isLoading } = useAuthStore();

  // ==================== Client State ====================
  const [values, setValues] = useState<FormValues>({
    name: user?.name || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ==================== Refs ====================
  // 用于防止组件卸载后的状态更新
  const isMountedRef = useRef(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // ==================== 派生状态 ====================
  const isSaving = saveStatus === 'saving' || isLoading;

  // ==================== 同步用户数据到表单 ====================

  /**
   * 当用户数据变化时，同步到表单
   */
  useEffect(() => {
    if (user?.name) {
      setValues((prev) => ({
        ...prev,
        name: user.name,
      }));
    }
  }, [user?.name]);

  // ==================== 验证逻辑 ====================

  /**
   * 验证名称字段
   * @param value - 名称值
   * @returns 错误信息（无错误返回 undefined）
   */
  const validateName = useCallback((value: string): string | undefined => {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return '名称不能为空';
    }

    if (trimmed.length < VALIDATION_RULES.name.minLength) {
      return `名称至少需要 ${VALIDATION_RULES.name.minLength} 个字符`;
    }

    if (trimmed.length > VALIDATION_RULES.name.maxLength) {
      return `名称不能超过 ${VALIDATION_RULES.name.maxLength} 个字符`;
    }

    return undefined;
  }, []);

  /**
   * 验证所有字段
   * @returns 所有字段的错误信息对象
   */
  const validateAllFields = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    const nameError = validateName(values.name);
    if (nameError) {
      newErrors.name = nameError;
    }

    return newErrors;
  }, [values.name, validateName]);

  // ==================== 字段更新 Handlers ====================

  /**
   * 更新名称字段
   * 包含实时验证
   */
  const handleNameChange = useCallback((value: string) => {
    setValues((prev) => ({ ...prev, name: value }));

    // 实时验证
    const error = validateName(value);
    setErrors((prev) => ({ ...prev, name: error }));

    // 清除全局错误
    if (errorMessage) {
      setErrorMessage(null);
    }
  }, [validateName, errorMessage]);

  // ==================== 表单保存 ====================

  /**
   * 处理表单保存
   * 包含完整的异步流程：验证 → 提交 → 成功/失败处理
   */
  const handleSaveProfile = useCallback(async () => {
    // 验证所有字段
    const validationErrors = validateAllFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 检查是否有变更
    if (values.name.trim() === user?.name) {
      return;
    }

    // 开始保存
    setSaveStatus('saving');
    setErrorMessage(null);

    try {
      // 调用 Store 的更新方法
      await updateProfile({ name: values.name.trim() });

      // 保存成功
      if (isMountedRef.current) {
        setSaveStatus('saved');

        // 2秒后重置状态
        saveTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setSaveStatus('idle');
          }
        }, 2000);
      }
    } catch (error) {
      // 保存失败
      if (isMountedRef.current) {
        setSaveStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : '保存失败，请重试'
        );
      }
    }
  }, [values.name, user?.name, validateAllFields, updateProfile]);

  // ==================== 头像上传 ====================

  /**
   * 处理头像上传
   * 包含文件验证、读取、上传流程
   */
  const handleAvatarUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 验证文件类型
      if (!AVATAR_UPLOAD_LIMITS.allowedTypes.includes(file.type as typeof AVATAR_UPLOAD_LIMITS.allowedTypes[number])) {
        setErrorMessage('仅支持 JPG、PNG、GIF、WebP 格式的图片');
        return;
      }

      // 验证文件大小
      if (file.size > AVATAR_UPLOAD_LIMITS.maxSize) {
        setErrorMessage('图片大小不能超过 2MB');
        return;
      }

      setAvatarUploading(true);
      setErrorMessage(null);

      try {
        // 读取文件为 base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
              resolve(result);
            } else {
              reject(new Error('文件读取失败'));
            }
          };
          reader.onerror = () => reject(new Error('文件读取失败'));
          reader.readAsDataURL(file);
        });

        // 上传头像
        await updateProfile({ avatar: base64 });

        // 上传成功
        if (isMountedRef.current) {
          setSaveStatus('saved');

          // 2秒后重置状态
          saveTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              setSaveStatus('idle');
            }
          }, 2000);
        }
      } catch (error) {
        // 上传失败
        if (isMountedRef.current) {
          setErrorMessage(
            error instanceof Error ? error.message : '头像上传失败，请重试'
          );
        }
      } finally {
        if (isMountedRef.current) {
          setAvatarUploading(false);
        }

        // 清空 input，允许重复上传同一文件
        e.target.value = '';
      }
    },
    [updateProfile]
  );

  // ==================== 表单重置 ====================

  /**
   * 重置表单到用户当前数据
   */
  const reset = useCallback(() => {
    setValues({
      name: user?.name || '',
    });
    setErrors({});
    setSaveStatus('idle');
    setErrorMessage(null);
    setAvatarUploading(false);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, [user?.name]);

  // ==================== 返回值 ====================

  return {
    // 状态
    values,
    errors,
    saveStatus,
    isSaving,
    avatarUploading,
    errorMessage,
    user: user ? {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    } : null,

    // 处理器（全部使用 useCallback 优化）
    handleNameChange,
    handleSaveProfile,
    handleAvatarUpload,
    reset,
  };
}
