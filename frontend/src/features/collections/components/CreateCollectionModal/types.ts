// 文件路径: frontend/src/features/collections/components/CreateCollectionModal/types.ts

/**
 * CreateCollectionModal 类型定义
 */

import type { CollectionColorKey } from '../../styles/collectionStyles';

/**
 * 表单字段值
 */
export interface FormValues {
  name: string;
  description: string;
  color: CollectionColorKey;
}

/**
 * 表单字段错误
 */
export interface FormErrors {
  name?: string;
  description?: string;
}

/**
 * Hook 返回值
 */
export interface UseCreateCollectionModalReturn {
  values: FormValues;
  errors: FormErrors;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleNameChange: (value: string) => void;
  handleDescriptionChange: (value: string) => void;
  handleColorChange: (value: CollectionColorKey) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleClose: () => void;
}

/**
 * 组件 Props
 */
export interface CreateCollectionModalProps {
  className?: string;
}
