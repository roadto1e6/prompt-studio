/**
 * ModelManagement 组件 - 视图层
 * 文件路径: frontend/src/components/settings/ModelManagement/index.tsx
 *
 * 职责：
 * 1. 纯声明式 UI 渲染
 * 2. 所有逻辑委托给 useModelManagement Hook
 * 3. 样式通过 CSS Modules 管理
 */

import { memo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Cpu,
  AlertCircle,
  Database,
  ArrowLeft,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import type { SelectOption } from '@/components/ui/Select';
import { useModelStore, useI18nStore } from '@/stores';
import { useModelManagement } from './useModelManagement';
import styles from './index.module.css';
import type { ModelManagementProps } from './types';
import type { UserCustomModel, ModelCapability } from '@/types';

/**
 * ModelCard - 模型卡片子组件
 */
interface ModelCardProps {
  model: UserCustomModel;
  isDeleting: boolean;
  onEdit: () => void;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  getProviderName: (id: string) => string;
  getCapabilityStyle: (cap: ModelCapability) => string;
  t: {
    customBadge: string;
    maxTokensInfo: string;
    contextInfo: string;
    confirmDelete: string;
    cancelDelete: string;
    edit: string;
    delete: string;
  };
}

const ModelCard = memo<ModelCardProps>(({
  model,
  isDeleting,
  onEdit,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
  getProviderName,
  getCapabilityStyle,
  t,
}) => (
  <div className={styles.modelCard}>
    <div className={styles.modelCardContent}>
      <div className={styles.modelCardMain}>
        <div className={styles.modelHeader}>
          <span className={styles.modelTitle}>{model.name}</span>
          <span className={styles.customBadge}>{t.customBadge}</span>
        </div>
        <div className={styles.modelId}>{model.id}</div>
        <div className={styles.modelInfo}>
          <span className={styles.modelInfoItem}>
            <Database size={12} aria-hidden="true" />
            {getProviderName(model.providerId)}
          </span>
          <span className={styles.modelInfoDivider}>|</span>
          <span className={styles.modelInfoItem}>
            {t.maxTokensInfo.replace('{count}', model.maxTokens.toLocaleString())}
          </span>
          {model.contextWindow && (
            <>
              <span className={styles.modelInfoDivider}>|</span>
              <span className={styles.modelInfoItem}>
                {t.contextInfo.replace('{size}', (model.contextWindow / 1000).toFixed(0))}
              </span>
            </>
          )}
        </div>
        <div className={styles.capabilitiesRow}>
          {model.capabilities.map((cap) => (
            <span key={cap} className={`${styles.capabilityBadge} ${getCapabilityStyle(cap)}`}>
              {cap}
            </span>
          ))}
        </div>
        {model.description && (
          <p className={styles.modelDescription}>{model.description}</p>
        )}
      </div>

      <div className={styles.modelActions}>
        {isDeleting ? (
          <>
            <button
              type="button"
              onClick={onConfirmDelete}
              className={`${styles.actionButton} ${styles.actionButtonConfirm}`}
              title={t.confirmDelete}
              aria-label={t.confirmDelete}
            >
              <Check size={16} />
            </button>
            <button
              type="button"
              onClick={onCancelDelete}
              className={styles.actionButton}
              title={t.cancelDelete}
              aria-label={t.cancelDelete}
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onEdit}
              className={styles.actionButton}
              title={t.edit}
              aria-label={t.edit}
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              onClick={onRequestDelete}
              className={`${styles.actionButton} ${styles.actionButtonDelete}`}
              title={t.delete}
              aria-label={t.delete}
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  </div>
));

ModelCard.displayName = 'ModelCard';

/**
 * ModelManagement 组件
 *
 * @description AI 模型管理页面，支持添加、编辑、删除自定义模型
 * @param {ModelManagementProps} props - 组件属性
 * @returns {JSX.Element} 模型管理组件
 */
const ModelManagement = memo<ModelManagementProps>(({ className = '' }) => {
  const { providers } = useModelStore();
  const { t } = useI18nStore();

  const {
    // 数据状态
    filteredModels,
    capabilityOptions,

    // UI 状态
    showForm,
    editingModel,
    deleteConfirmId,

    // 筛选状态
    filters,

    // 表单状态
    formValues,
    formErrors,
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
  } = useModelManagement();

  // 构建选项
  const providerOptions: SelectOption[] = [
    { value: '', label: t.settings.allProviders },
    ...providers.map((p) => ({ value: p.id, label: p.name })),
  ];

  const capabilityFilterOptions: SelectOption[] = [
    { value: '', label: t.settings.allCapabilities },
    ...capabilityOptions.map((opt) => ({ value: opt.value, label: opt.label })),
  ];

  const providerFormOptions: SelectOption[] = [
    { value: '', label: t.settings.selectAProvider },
    ...providers.map((p) => ({ value: p.id, label: p.name })),
  ];

  /**
   * 渲染模型列表视图
   */
  const renderListView = () => (
    <>
      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <div className={styles.filterSelectWrapper}>
          <Select
            value={filters.providerId}
            onValueChange={handleProviderFilterChange}
            options={providerOptions}
            placeholder={t.settings.allProviders}
            size="sm"
          />
        </div>

        <div className={styles.filterSelectWrapper}>
          <Select
            value={filters.capability}
            onValueChange={(val) => handleCapabilityFilterChange(val as ModelCapability | '')}
            options={capabilityFilterOptions}
            placeholder={t.settings.allCapabilities}
            size="sm"
          />
        </div>

        <Button onClick={handleOpenCreateForm} variant="primary" size="sm">
          <Plus size={16} aria-hidden="true" />
          {t.settings.addModel}
        </Button>
      </div>

      {/* 统计信息 */}
      <p className={styles.statsText}>
        {t.settings.showingCustomModels.replace('{count}', String(filteredModels.length))}
      </p>

      {/* 模型列表 */}
      {filteredModels.length > 0 ? (
        <div className={styles.modelsGrid}>
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isDeleting={deleteConfirmId === model.id}
              onEdit={() => handleOpenEditForm(model)}
              onRequestDelete={() => handleRequestDelete(model.id)}
              onConfirmDelete={() => handleConfirmDelete(model.id)}
              onCancelDelete={handleCancelDelete}
              getProviderName={getProviderName}
              getCapabilityStyle={getCapabilityStyle}
              t={{
                customBadge: t.settings.customBadge,
                maxTokensInfo: t.settings.maxTokensInfo,
                contextInfo: t.settings.contextInfo,
                confirmDelete: t.settings.confirmDelete,
                cancelDelete: t.settings.cancelDelete,
                edit: t.settings.edit,
                delete: t.settings.delete,
              }}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <Cpu size={24} className="text-theme-text-muted" aria-hidden="true" />
          </div>
          <p className={styles.emptyStateTitle}>{t.settings.noCustomModelsTitle}</p>
          <p className={styles.emptyStateDescription}>
            {t.settings.noCustomModelsDesc}
          </p>
          <Button onClick={handleOpenCreateForm} variant="primary" size="sm">
            <Plus size={16} aria-hidden="true" />
            {t.settings.addFirstModel}
          </Button>
        </div>
      )}
    </>
  );

  /**
   * 渲染表单视图
   */
  const renderFormView = () => (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {/* 错误提示 */}
      {errorMessage && (
        <div className={styles.errorAlert} role="alert">
          <AlertCircle className={styles.errorAlertIcon} aria-hidden="true" />
          <div className={styles.errorAlertContent}>
            <div className={styles.errorAlertTitle}>{t.settings.error}</div>
            <div className={styles.errorAlertMessage}>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Model ID 和 Name */}
      <div className={styles.formGrid}>
        <div className={styles.formSection}>
          <label htmlFor="model-id" className={styles.formSectionLabel}>
            {t.settings.modelIdLabel} *
          </label>
          <Input
            id="model-id"
            type="text"
            value={formValues.id}
            onChange={(e) => handleIdChange(e.target.value)}
            placeholder={t.settings.modelIdFormPlaceholder}
            error={formErrors.id}
            disabled={!!editingModel || isSubmitting}
          />
        </div>

        <div className={styles.formSection}>
          <label htmlFor="model-name" className={styles.formSectionLabel}>
            {t.settings.displayNameLabel} *
          </label>
          <Input
            id="model-name"
            type="text"
            value={formValues.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={t.settings.displayNameFormPlaceholder}
            error={formErrors.name}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Provider */}
      <div className={styles.formSection}>
        <label className={styles.formSectionLabel}>
          {t.settings.providerLabel} *
        </label>
        <Select
          value={formValues.providerId}
          onValueChange={handleProviderChange}
          options={providerFormOptions}
          placeholder={t.settings.selectAProvider}
          disabled={!!editingModel || isSubmitting}
          error={formErrors.providerId}
          size="md"
        />
      </div>

      {/* Capabilities */}
      <div className={styles.formSection}>
        <label className={styles.formSectionLabel}>
          {t.settings.capabilitiesLabel} *
        </label>
        <div className={styles.capabilityButtons}>
          {capabilityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleCapabilityToggle(opt.value)}
              className={`${styles.capabilityButton} ${
                formValues.capabilities.includes(opt.value) ? styles.capabilityButtonActive : ''
              }`}
              disabled={isSubmitting}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {formErrors.capabilities && (
          <span className="text-xs text-red-400 mt-1">{formErrors.capabilities}</span>
        )}
      </div>

      {/* Max Tokens 和 Context Window */}
      <div className={styles.formGrid}>
        <div className={styles.formSection}>
          <label htmlFor="model-max-tokens" className={styles.formSectionLabel}>
            {t.settings.maxOutputTokens} *
          </label>
          <Input
            id="model-max-tokens"
            type="number"
            value={formValues.maxTokens.toString()}
            onChange={(e) => handleMaxTokensChange(parseInt(e.target.value) || 0)}
            placeholder={t.settings.maxTokensFormPlaceholder}
            error={formErrors.maxTokens}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formSection}>
          <label htmlFor="model-context" className={styles.formSectionLabel}>
            {t.settings.contextWindowLabel}
          </label>
          <Input
            id="model-context"
            type="number"
            value={formValues.contextWindow?.toString() || ''}
            onChange={(e) => handleContextWindowChange(e.target.value ? parseInt(e.target.value) : null)}
            placeholder={t.settings.contextFormPlaceholder}
            error={formErrors.contextWindow}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Description */}
      <div className={styles.formSection}>
        <label htmlFor="model-description" className={styles.formSectionLabel}>
          {t.settings.descriptionLabel}
        </label>
        <textarea
          id="model-description"
          value={formValues.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder={t.settings.descriptionFormPlaceholder}
          className={styles.formTextarea}
          rows={3}
          disabled={isSubmitting}
        />
        {formErrors.description && (
          <span className="text-xs text-red-400 mt-1">{formErrors.description}</span>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actionsContainer}>
        <Button
          type="button"
          onClick={handleCloseForm}
          variant="ghost"
          disabled={isSubmitting}
        >
          {t.common.cancel}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              {t.settings.saving}
            </>
          ) : editingModel ? (
            t.settings.updateModel
          ) : (
            t.settings.createModel
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <div className={`${styles.container} ${className}`}>
      {/* 头部 */}
      {showForm && (
        <div className={styles.header}>
          <button
            type="button"
            onClick={handleCloseForm}
            className={styles.backButton}
            aria-label={t.settings.backToList}
          >
            <ArrowLeft size={16} />
          </button>
          <h3 className={styles.headerTitle}>
            {editingModel ? t.settings.editModelTitle : t.settings.addNewModelTitle}
          </h3>
        </div>
      )}

      {/* 内容 */}
      {showForm ? renderFormView() : renderListView()}
    </div>
  );
});

ModelManagement.displayName = 'ModelManagement';

export { ModelManagement };
export type { ModelManagementProps } from './types';
