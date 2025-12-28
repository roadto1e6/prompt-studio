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
  description: '',
  category: 'text' as Category,
  model: getDefaultModelId('text'),
  collectionId: '',
  systemPrompt: '',
});

/**
 * 表单验证规则
 */
const VALIDATION_RULES = {
  title: {
    maxLength: 100,
    minLength: 0,
  },
  description: {
    maxLength: 500,
  },
  systemPrompt: {
    maxLength: 5000,
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
  const { createPrompt, setActivePrompt } = usePromptStore();
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

  // ==================== Refs ====================
  // 用于防止组件卸载后的状态更新
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ==================== 派生状态 ====================
  const isSubmitting = submissionState === 'submitting';

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

      case 'description': {
        if (value.length > VALIDATION_RULES.description.maxLength) {
          return `描述不能超过 ${VALIDATION_RULES.description.maxLength} 个字符`;
        }
        return undefined;
      }

      case 'systemPrompt': {
        if (value.length > VALIDATION_RULES.systemPrompt.maxLength) {
          return `系统提示词不能超过 ${VALIDATION_RULES.systemPrompt.maxLength} 个字符`;
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

    // 验证文本字段
    const textFields: Array<keyof FormValues> = ['title', 'description', 'systemPrompt'];
    textFields.forEach((field) => {
      const error = validateField(field, values[field] as string);
      if (error) {
        newErrors[field] = error;
      }
    });

    return newErrors;
  }, [values, validateField]);

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
   * 更新描述字段
   * 包含实时验证
   */
  const handleDescriptionChange = useCallback((value: string) => {
    setValues((prev) => ({ ...prev, description: value }));

    // 实时验证
    const error = validateField('description', value);
    setErrors((prev) => ({ ...prev, description: error }));
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
   * 包含实时验证
   */
  const handleSystemPromptChange = useCallback((value: string) => {
    setValues((prev) => ({ ...prev, systemPrompt: value }));

    // 实时验证
    const error = validateField('systemPrompt', value);
    setErrors((prev) => ({ ...prev, systemPrompt: error }));
  }, [validateField]);

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
        const newPrompt = await createPrompt({
          title: values.title.trim() || 'Untitled Prompt',
          description: values.description.trim(),
          category: values.category,
          model: values.model,
          collectionId: values.collectionId || null,
          systemPrompt: values.systemPrompt.trim(),
        });

        // 提交成功
        if (isMountedRef.current) {
          setSubmissionState('success');

          // 选中新创建的 Prompt 并打开详情面板
          setActivePrompt(newPrompt.id);
          openDetailPanel();

          // 延迟关闭，让用户看到成功状态
          setTimeout(() => {
            if (isMountedRef.current) {
              closeModal('createPrompt');
              // 重置表单状态
              setValues(getDefaultFormValues(getDefaultModelId));
              setErrors({});
              setSubmissionState('idle');
            }
          }, 300);
        }
      } catch (error) {
        // 提交失败
        if (isMountedRef.current) {
          setSubmissionState('error');
          setErrorMessage(
            error instanceof Error ? error.message : '创建失败，请重试'
          );
        }
      }
    },
    [
      values,
      validateAllFields,
      createPrompt,
      setActivePrompt,
      openDetailPanel,
      closeModal,
      getDefaultModelId,
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
  }, [getDefaultModelId]);

  // ==================== 副作用：监听模态框开关 ====================

  /**
   * 当模态框打开时，自动重置表单
   * 确保每次打开都是干净的状态
   */
  useEffect(() => {
    if (modals.createPrompt) {
      reset();
    }
  }, [modals.createPrompt, reset]);

  // ==================== 返回值 ====================

  return {
    // 状态
    values,
    errors,
    submissionState,
    isSubmitting,
    errorMessage,

    // 处理器（全部使用 useCallback 优化）
    handleTitleChange,
    handleDescriptionChange,
    handleCategoryChange,
    handleModelChange,
    handleCollectionIdChange,
    handleSystemPromptChange,
    handleSubmit,
    handleClose,
    reset,
  };
}
