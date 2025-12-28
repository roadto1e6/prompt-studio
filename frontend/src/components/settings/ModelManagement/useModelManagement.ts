// 文件路径: frontend/src/components/settings/ModelManagement/useModelManagement.ts

/**
 * ModelManagement 逻辑层
 * Headless UI Hook：封装所有状态、副作用和处理器
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useModelStore } from '@/stores/modelStore';
import { useI18nStore } from '@/stores/i18nStore';
import type { UserCustomModel, ModelCapability } from '@/types';
import type {
  ModelFormValues,
  ModelFormErrors,
  ViewMode,
  SubmissionState,
  FilterState,
  CapabilityOption,
  UseModelManagementReturn,
} from './types';

/**
 * 默认表单值
 */
const DEFAULT_FORM_VALUES: ModelFormValues = {
  id: '',
  name: '',
  providerId: '',
  capabilities: ['text'],
  maxTokens: 4096,
  contextWindow: null,
  description: '',
};

/**
 * 默认筛选条件
 */
const DEFAULT_FILTERS: FilterState = {
  providerId: '',
  capability: '',
};

/**
 * 表单验证规则
 */
const VALIDATION_RULES = {
  id: {
    required: true,
    pattern: /^[a-zA-Z0-9_-]+$/,
    maxLength: 100,
  },
  name: {
    required: true,
    maxLength: 100,
  },
  providerId: {
    required: true,
  },
  capabilities: {
    required: true,
    minLength: 1,
  },
  maxTokens: {
    required: true,
    min: 1,
    max: 1000000,
  },
  contextWindow: {
    min: 1,
    max: 10000000,
  },
  description: {
    maxLength: 500,
  },
} as const;

/**
 * ModelManagement Headless Hook
 *
 * @description
 * 封装所有模型管理的状态管理、验证逻辑、CRUD 操作和副作用。
 * 采用 Headless UI 模式，视图层只需调用返回的 handlers 和 state。
 *
 * @architecture
 * - 数据层：useModelStore（Zustand 状态管理）
 * - 逻辑层：本 Hook（业务逻辑封装）
 * - 视图层：index.tsx（纯声明式 UI）
 *
 * @example
 * ```tsx
 * const mgmt = useModelManagement();
 * return (
 *   <div>
 *     {mgmt.filteredModels.map(model => (
 *       <ModelCard key={model.id} model={model} />
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useModelManagement(): UseModelManagementReturn {
  // ==================== Store 依赖 ====================
  const {
    providers,
    userModels,
    createUserModel,
    updateUserModel,
    deleteUserModel,
    isModelIdExists,
  } = useModelStore();
  const { t } = useI18nStore();

  // ==================== Client State ====================
  // UI 状态
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingModel, setEditingModel] = useState<UserCustomModel | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // 筛选状态
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // 表单状态
  const [formValues, setFormValues] = useState<ModelFormValues>(DEFAULT_FORM_VALUES);
  const [formErrors, setFormErrors] = useState<ModelFormErrors>({});
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

  /**
   * 是否显示表单
   */
  const showForm = viewMode === 'form';

  /**
   * 是否正在提交
   */
  const isSubmitting = submissionState === 'submitting';

  /**
   * 能力选项配置
   */
  const capabilityOptions = useMemo<CapabilityOption[]>(() => {
    return [
      {
        value: 'text' as ModelCapability,
        label: t.categories?.text || 'Text',
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      },
      {
        value: 'image' as ModelCapability,
        label: t.categories?.image || 'Image',
        color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      },
      {
        value: 'audio' as ModelCapability,
        label: t.categories?.audio || 'Audio',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      },
      {
        value: 'video' as ModelCapability,
        label: t.categories?.video || 'Video',
        color: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      },
    ];
  }, [t.categories]);

  /**
   * 筛选后的模型列表
   */
  const filteredModels = useMemo(() => {
    return userModels.filter((model) => {
      const matchesProvider = !filters.providerId || model.providerId === filters.providerId;
      const matchesCapability = !filters.capability || model.capabilities.includes(filters.capability);
      return matchesProvider && matchesCapability;
    });
  }, [userModels, filters]);

  // ==================== 验证逻辑 ====================

  /**
   * 验证单个字段
   */
  const validateField = useCallback(
    (field: keyof ModelFormValues, value: any): string | undefined => {
      // 使用 as any 来绕过类型问题
      const rules = VALIDATION_RULES[field] as any;
      if (!rules) return undefined;

      switch (field) {
        case 'id': {
          if (rules.required && !value.trim()) {
            return (t.settings?.modelId || 'Model ID') + ' is required';
          }
          if (rules.pattern && !rules.pattern.test(value)) {
            return 'Model ID can only contain letters, numbers, hyphens and underscores';
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            return `Model ID cannot exceed ${rules.maxLength} characters`;
          }
          return undefined;
        }

        case 'name': {
          if (rules.required && !value.trim()) {
            return (t.settings?.modelName || 'Model Name') + ' is required';
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            return `Model Name cannot exceed ${rules.maxLength} characters`;
          }
          return undefined;
        }

        case 'providerId': {
          if (rules.required && !value) {
            return (t.settings?.provider || 'Provider') + ' is required';
          }
          return undefined;
        }

        case 'capabilities': {
          if (rules.required && (!Array.isArray(value) || value.length < rules.minLength)) {
            return 'At least one capability is required';
          }
          return undefined;
        }

        case 'maxTokens': {
          const num = Number(value);
          if (rules.required && (!num || num <= 0)) {
            return (t.settings?.maxTokens || 'Max Tokens') + ' is required';
          }
          if (rules.min && num < rules.min) {
            return `Max Tokens must be at least ${rules.min}`;
          }
          if (rules.max && num > rules.max) {
            return `Max Tokens cannot exceed ${rules.max}`;
          }
          return undefined;
        }

        case 'contextWindow': {
          if (value === null || value === '') return undefined;
          const num = Number(value);
          if (rules.min && num < rules.min) {
            return `Context Window must be at least ${rules.min}`;
          }
          if (rules.max && num > rules.max) {
            return `Context Window cannot exceed ${rules.max}`;
          }
          return undefined;
        }

        case 'description': {
          if (rules.maxLength && value.length > rules.maxLength) {
            return `Description cannot exceed ${rules.maxLength} characters`;
          }
          return undefined;
        }

        default:
          return undefined;
      }
    },
    [t.settings]
  );

  /**
   * 验证所有字段
   */
  const validateAllFields = useCallback((): ModelFormErrors => {
    const newErrors: ModelFormErrors = {};

    // 验证所有字段
    (Object.keys(formValues) as Array<keyof ModelFormValues>).forEach((field) => {
      const error = validateField(field, formValues[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // 检查 ID 是否已存在（仅新建时）
    if (!editingModel && formValues.id.trim() && isModelIdExists(formValues.id.trim())) {
      newErrors.id = t.settings?.modelIdExists || 'Model ID already exists';
    }

    return newErrors;
  }, [formValues, editingModel, validateField, isModelIdExists, t.settings]);

  // ==================== 筛选操作 ====================

  /**
   * 设置提供商筛选
   */
  const handleProviderFilterChange = useCallback((providerId: string) => {
    setFilters((prev) => ({ ...prev, providerId }));
  }, []);

  /**
   * 设置能力筛选
   */
  const handleCapabilityFilterChange = useCallback((capability: ModelCapability | '') => {
    setFilters((prev) => ({ ...prev, capability }));
  }, []);

  // ==================== 视图操作 ====================

  /**
   * 打开新建表单
   */
  const handleOpenCreateForm = useCallback(() => {
    setEditingModel(null);
    setFormValues(DEFAULT_FORM_VALUES);
    setFormErrors({});
    setErrorMessage(null);
    setViewMode('form');
  }, []);

  /**
   * 打开编辑表单
   */
  const handleOpenEditForm = useCallback((model: UserCustomModel) => {
    setEditingModel(model);
    setFormValues({
      id: model.id,
      name: model.name,
      providerId: model.providerId,
      capabilities: model.capabilities,
      maxTokens: model.maxTokens,
      contextWindow: model.contextWindow || null,
      description: model.description || '',
    });
    setFormErrors({});
    setErrorMessage(null);
    setViewMode('form');
  }, []);

  /**
   * 关闭表单
   */
  const handleCloseForm = useCallback(() => {
    setViewMode('list');
    setEditingModel(null);
    setFormValues(DEFAULT_FORM_VALUES);
    setFormErrors({});
    setErrorMessage(null);
    setSubmissionState('idle');
  }, []);

  // ==================== 删除操作 ====================

  /**
   * 请求删除确认
   */
  const handleRequestDelete = useCallback((id: string) => {
    setDeleteConfirmId(id);
  }, []);

  /**
   * 取消删除
   */
  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmId(null);
  }, []);

  /**
   * 确认删除
   */
  const handleConfirmDelete = useCallback(
    (id: string) => {
      deleteUserModel(id);
      setDeleteConfirmId(null);
    },
    [deleteUserModel]
  );

  // ==================== 表单字段更新 ====================

  /**
   * 更新 ID 字段
   */
  const handleIdChange = useCallback(
    (value: string) => {
      setFormValues((prev) => ({ ...prev, id: value }));
      const error = validateField('id', value);
      setFormErrors((prev) => ({ ...prev, id: error }));
    },
    [validateField]
  );

  /**
   * 更新名称字段
   */
  const handleNameChange = useCallback(
    (value: string) => {
      setFormValues((prev) => ({ ...prev, name: value }));
      const error = validateField('name', value);
      setFormErrors((prev) => ({ ...prev, name: error }));
    },
    [validateField]
  );

  /**
   * 更新提供商字段
   */
  const handleProviderChange = useCallback(
    (value: string) => {
      setFormValues((prev) => ({ ...prev, providerId: value }));
      const error = validateField('providerId', value);
      setFormErrors((prev) => ({ ...prev, providerId: error }));
    },
    [validateField]
  );

  /**
   * 切换能力
   */
  const handleCapabilityToggle = useCallback(
    (capability: ModelCapability) => {
      setFormValues((prev) => {
        const newCapabilities = prev.capabilities.includes(capability)
          ? prev.capabilities.filter((c) => c !== capability)
          : [...prev.capabilities, capability];

        const error = validateField('capabilities', newCapabilities);
        setFormErrors((prev) => ({ ...prev, capabilities: error }));

        return { ...prev, capabilities: newCapabilities };
      });
    },
    [validateField]
  );

  /**
   * 更新最大 Token 字段
   */
  const handleMaxTokensChange = useCallback(
    (value: number) => {
      setFormValues((prev) => ({ ...prev, maxTokens: value }));
      const error = validateField('maxTokens', value);
      setFormErrors((prev) => ({ ...prev, maxTokens: error }));
    },
    [validateField]
  );

  /**
   * 更新上下文窗口字段
   */
  const handleContextWindowChange = useCallback(
    (value: number | null) => {
      setFormValues((prev) => ({ ...prev, contextWindow: value }));
      const error = validateField('contextWindow', value);
      setFormErrors((prev) => ({ ...prev, contextWindow: error }));
    },
    [validateField]
  );

  /**
   * 更新描述字段
   */
  const handleDescriptionChange = useCallback(
    (value: string) => {
      setFormValues((prev) => ({ ...prev, description: value }));
      const error = validateField('description', value);
      setFormErrors((prev) => ({ ...prev, description: error }));
    },
    [validateField]
  );

  // ==================== 表单提交 ====================

  /**
   * 处理表单提交
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // 验证所有字段
      const validationErrors = validateAllFields();
      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        return;
      }

      // 开始提交
      setSubmissionState('submitting');
      setErrorMessage(null);

      try {
        if (editingModel) {
          // 更新现有模型
          await updateUserModel(editingModel.id, {
            name: formValues.name.trim(),
            capabilities: formValues.capabilities,
            maxTokens: formValues.maxTokens,
            contextWindow: formValues.contextWindow || undefined,
            description: formValues.description.trim() || undefined,
          });
        } else {
          // 创建新模型
          await createUserModel({
            id: formValues.id.trim(),
            name: formValues.name.trim(),
            providerId: formValues.providerId,
            capabilities: formValues.capabilities,
            maxTokens: formValues.maxTokens,
            contextWindow: formValues.contextWindow || undefined,
            description: formValues.description.trim() || undefined,
          });
        }

        // 提交成功
        if (isMountedRef.current) {
          setSubmissionState('success');

          // 延迟关闭，让用户看到成功状态
          setTimeout(() => {
            if (isMountedRef.current) {
              handleCloseForm();
            }
          }, 300);
        }
      } catch (error) {
        // 提交失败
        if (isMountedRef.current) {
          setSubmissionState('error');
          setErrorMessage(
            error instanceof Error ? error.message : 'Failed to save model'
          );
        }
      }
    },
    [
      formValues,
      editingModel,
      validateAllFields,
      createUserModel,
      updateUserModel,
      handleCloseForm,
    ]
  );

  // ==================== 工具方法 ====================

  /**
   * 获取提供商名称
   */
  const getProviderName = useCallback(
    (providerId: string) => {
      const provider = providers.find((p) => p.id === providerId);
      return provider?.name || providerId;
    },
    [providers]
  );

  /**
   * 获取能力样式
   */
  const getCapabilityStyle = useCallback(
    (capability: ModelCapability) => {
      return (
        capabilityOptions.find((c) => c.value === capability)?.color ||
        'bg-slate-500/10 text-slate-400 border-slate-500/30'
      );
    },
    [capabilityOptions]
  );

  // ==================== 返回值 ====================

  return {
    // 数据状态
    filteredModels,
    capabilityOptions,

    // UI 状态
    viewMode,
    showForm,
    editingModel,
    deleteConfirmId,

    // 筛选状态
    filters,

    // 表单状态
    formValues,
    formErrors,
    submissionState,
    isSubmitting,
    errorMessage,

    // 筛选操作
    handleProviderFilterChange,
    handleCapabilityFilterChange,

    // 视图操作
    handleOpenCreateForm,
    handleOpenEditForm,
    handleCloseForm,

    // 删除操作
    handleRequestDelete,
    handleCancelDelete,
    handleConfirmDelete,

    // 表单字段更新
    handleIdChange,
    handleNameChange,
    handleProviderChange,
    handleCapabilityToggle,
    handleMaxTokensChange,
    handleContextWindowChange,
    handleDescriptionChange,

    // 表单提交
    handleSubmit,

    // 工具方法
    getProviderName,
    getCapabilityStyle,
  };
}
