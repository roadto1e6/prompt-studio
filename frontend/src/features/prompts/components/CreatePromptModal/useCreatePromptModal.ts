// 文件路径: frontend/src/features/prompts/components/CreatePromptModal/useCreatePromptModal.ts

/**
 * CreatePromptModal 逻辑层
 * Headless UI Hook：封装所有状态、副作用和处理器
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { usePromptStore, useUIStore, useModelStore } from '@/stores';
import type { Category } from '@/types';
import type {
  FormValues,
  FormErrors,
  SubmissionState,
  UseCreatePromptModalReturn,
} from './types';

/**
 * 默认表单值
 */
const getDefaultFormValues = (getDefaultModelId: (category: Category) => string): FormValues => ({
  title: '',
  category: 'text' as Category,
  model: getDefaultModelId('text'),
  collectionId: '',
  systemPrompt: '',
  tags: [],
});

/**
 * 表单验证规则
 */
const VALIDATION_RULES = {
  title: {
    maxLength: 200,
    minLength: 0,
  },
} as const;

/**
 * CreatePromptModal Headless Hook
 *
 * @description
 * 封装所有表单状态管理、验证逻辑、提交处理和副作用。
 * 采用 Headless UI 模式，视图层只需调用返回的 handlers 和 state。
 *
 * @example
 * ```tsx
 * const modal = useCreatePromptModal();
 * return (
 *   <form onSubmit={modal.handleSubmit}>
 *     <input value={modal.values.title} onChange={e => modal.handleTitleChange(e.target.value)} />
 *   </form>
 * );
 * ```
 */
export function useCreatePromptModal(): UseCreatePromptModalReturn {
  // ==================== Store 依赖 ====================
  const { createPrompt } = usePromptStore();
  const { modals, closeModal, openDetailPanel } = useUIStore();
  const { getDefaultModelId, initialized, initialize } = useModelStore();

  // ==================== 初始化模型数据 ====================
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  // ==================== Client State ====================
  const [values, setValues] = useState<FormValues>(() => getDefaultFormValues(getDefaultModelId));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ==================== 派生状态 ====================
  const isSubmitting = submissionState === 'submitting';

  // ==================== 预览模式切换 ====================
  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  // ==================== 全屏模式 ====================
  const openFullscreen = useCallback(() => {
    setIsFullscreen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  // ==================== 验证逻辑 ====================

  /**
   * 验证单个字段
   * @param field - 字段名
   * @param value - 字段值
   * @returns 错误信息（无错误返回 undefined）
   */
  const validateField = useCallback((field: keyof FormValues, value: string): string | undefined => {
    switch (field) {
      case 'title': {
        if (value.length > VALIDATION_RULES.title.maxLength) {
          return `标题不能超过 ${VALIDATION_RULES.title.maxLength} 个字符`;
        }
        return undefined;
      }

      default:
        return undefined;
    }
  }, []);

  /**
   * 验证所有字段
   * @returns 所有字段的错误信息对象
   */
  const validateAllFields = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    // 验证标题字段
    const titleError = validateField('title', values.title);
    if (titleError) {
      newErrors.title = titleError;
    }

    return newErrors;
  }, [values.title, validateField]);

  // ==================== 字段更新 Handlers ====================

  /**
   * 更新标题字段
   * 包含实时验证
   */
  const handleTitleChange = useCallback((value: string) => {
    setValues((prev) => ({ ...prev, title: value }));

    // 实时验证
    const error = validateField('title', value);
    setErrors((prev) => ({ ...prev, title: error }));
  }, [validateField]);

  /**
   * 更新分类字段
   * 分类变化时自动更新模型为该分类的默认模型
   */
  const handleCategoryChange = useCallback((value: Category) => {
    setValues((prev) => ({
      ...prev,
      category: value,
      model: getDefaultModelId(value),
    }));
  }, [getDefaultModelId]);

  /**
   * 更新模型字段
   */
  const handleModelChange = useCallback((value: string) => {
    setValues((prev) => ({ ...prev, model: value }));
  }, []);

  /**
   * 更新集合字段
   */
  const handleCollectionIdChange = useCallback((value: string) => {
    setValues((prev) => ({ ...prev, collectionId: value }));
  }, []);

  /**
   * 更新系统提示词字段
   */
  const handleSystemPromptChange = useCallback((value: string) => {
    setValues((prev) => ({ ...prev, systemPrompt: value }));
  }, []);

  /**
   * 更新标签字段
   */
  const handleTagsChange = useCallback((tags: string[]) => {
    setValues((prev) => ({ ...prev, tags }));
  }, []);

  // ==================== 表单提交 ====================

  /**
   * 处理表单提交
   * 包含完整的异步流程：验证 → 提交 → 成功/失败处理
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // 验证所有字段
      const validationErrors = validateAllFields();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // 开始提交
      setSubmissionState('submitting');
      setErrorMessage(null);

      try {
        // 调用 Store 的创建方法
        await createPrompt({
          title: values.title.trim() || 'Untitled Prompt',
          category: values.category,
          model: values.model,
          collectionId: values.collectionId || undefined,
          systemPrompt: values.systemPrompt.trim(),
          tags: values.tags,
        });

        // 提交成功 - 直接关闭模态框，不依赖组件挂载状态
        // Store 已经更新了 activePromptId，所以不需要再调用 setActivePrompt
        openDetailPanel();
        closeModal('createPrompt');
      } catch (error) {
        // 提交失败
        setSubmissionState('error');
        setErrorMessage(
          error instanceof Error ? error.message : '创建失败，请重试'
        );
      }
    },
    [
      values,
      validateAllFields,
      createPrompt,
      openDetailPanel,
      closeModal,
    ]
  );

  // ==================== 模态框关闭 ====================

  /**
   * 处理模态框关闭
   * 重置所有状态
   */
  const handleClose = useCallback(() => {
    // 立即重置表单
    setValues(getDefaultFormValues(getDefaultModelId));
    setErrors({});
    setSubmissionState('idle');
    setErrorMessage(null);

    // 关闭模态框
    closeModal('createPrompt');
  }, [closeModal, getDefaultModelId]);

  // ==================== 表单重置 ====================

  /**
   * 重置表单到初始状态
   */
  const reset = useCallback(() => {
    setValues(getDefaultFormValues(getDefaultModelId));
    setErrors({});
    setSubmissionState('idle');
    setErrorMessage(null);
    setIsPreviewMode(false);
    setIsFullscreen(false);
  }, [getDefaultModelId]);

  // ==================== 副作用：监听模态框开关 ====================

  /**
   * 当模态框打开时，自动重置表单
   * 确保每次打开都是干净的状态
   * 注意：只在 modal 从 false 变为 true 时重置，避免提交过程中被重置
   */
  const prevOpenRef = useRef(false);
  useEffect(() => {
    // 只有当 modal 从关闭变为打开时才重置
    if (modals.createPrompt && !prevOpenRef.current) {
      reset();
    }
    prevOpenRef.current = modals.createPrompt;
  }, [modals.createPrompt, reset]);

  // ==================== 返回值 ====================

  return {
    // 状态
    values,
    errors,
    submissionState,
    isSubmitting,
    errorMessage,
    isPreviewMode,
    isFullscreen,

    // 处理器（全部使用 useCallback 优化）
    handleTitleChange,
    handleCategoryChange,
    handleModelChange,
    handleCollectionIdChange,
    handleSystemPromptChange,
    handleTagsChange,
    handleSubmit,
    handleClose,
    reset,
    togglePreviewMode,
    openFullscreen,
    closeFullscreen,
  };
}
