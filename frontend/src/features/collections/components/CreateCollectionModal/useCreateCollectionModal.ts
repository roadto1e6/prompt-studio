// 文件路径: frontend/src/features/collections/components/CreateCollectionModal/useCreateCollectionModal.ts

/**
 * CreateCollectionModal 逻辑层
 * Headless UI Hook：封装状态和处理器
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useCollectionStore, useUIStore } from '@/stores';
import { getColorConfig, COLLECTION_COLOR_KEYS, type CollectionColorKey } from '../../styles/collectionStyles';
import type { FormValues, FormErrors, UseCreateCollectionModalReturn } from './types';

const DEFAULT_VALUES: FormValues = {
  name: '',
  description: '',
  color: COLLECTION_COLOR_KEYS[0],
};

const VALIDATION_RULES = {
  name: { maxLength: 100 },
  description: { maxLength: 500 },
} as const;

/**
 * CreateCollectionModal Headless Hook
 */
export function useCreateCollectionModal(): UseCreateCollectionModalReturn {
  const { createCollection } = useCollectionStore();
  const { modals, closeModal } = useUIStore();

  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const validateField = useCallback((field: 'name' | 'description', value: string): string | undefined => {
    const rule = VALIDATION_RULES[field];
    if (value.length > rule.maxLength) {
      return `不能超过 ${rule.maxLength} 个字符`;
    }
    return undefined;
  }, []);

  const handleNameChange = useCallback((value: string) => {
    setValues(prev => ({ ...prev, name: value }));
    const error = validateField('name', value);
    setErrors(prev => ({ ...prev, name: error }));
  }, [validateField]);

  const handleDescriptionChange = useCallback((value: string) => {
    setValues(prev => ({ ...prev, description: value }));
    const error = validateField('description', value);
    setErrors(prev => ({ ...prev, description: error }));
  }, [validateField]);

  const handleColorChange = useCallback((value: CollectionColorKey) => {
    setValues(prev => ({ ...prev, color: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // 验证
      const nameError = validateField('name', values.name);
      const descError = validateField('description', values.description);
      if (nameError || descError) {
        setErrors({ name: nameError, description: descError });
        return;
      }

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const colorConfig = getColorConfig(values.color);

        await createCollection({
          name: values.name.trim() || 'New Collection',
          description: values.description.trim(),
          color: colorConfig.textClass,
        });

        if (isMountedRef.current) {
          setTimeout(() => {
            if (isMountedRef.current) {
              closeModal('createCollection');
              setValues(DEFAULT_VALUES);
              setErrors({});
              setIsSubmitting(false);
            }
          }, 200);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setIsSubmitting(false);
          setErrorMessage(
            error instanceof Error ? error.message : '创建失败，请重试'
          );
        }
      }
    },
    [values, validateField, createCollection, closeModal]
  );

  const handleClose = useCallback(() => {
    setValues(DEFAULT_VALUES);
    setErrors({});
    setErrorMessage(null);
    setIsSubmitting(false);
    closeModal('createCollection');
  }, [closeModal]);

  // 模态框打开时重置状态
  useEffect(() => {
    if (modals.createCollection) {
      setValues(DEFAULT_VALUES);
      setErrors({});
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  }, [modals.createCollection]);

  return {
    values,
    errors,
    isSubmitting,
    errorMessage,
    handleNameChange,
    handleDescriptionChange,
    handleColorChange,
    handleSubmit,
    handleClose,
  };
}
