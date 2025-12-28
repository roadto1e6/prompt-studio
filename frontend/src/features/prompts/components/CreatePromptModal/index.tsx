// 文件路径: frontend/src/features/prompts/components/CreatePromptModal/index.tsx

/**
 * CreatePromptModal 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React, { useMemo } from 'react';
import { FileText, Image, AudioLines, Video, AlertCircle, Loader2 } from 'lucide-react';
import { useUIStore, useI18nStore, useCollectionStore, useModelStore } from '@/stores';
import { Modal, Input, Textarea, Button } from '@/components/ui';
import { CATEGORIES } from '@/constants';
import { cn } from '@/utils';
import type { Category } from '@/types';
import { useCreatePromptModal } from './useCreatePromptModal';
import { ModelPicker } from '../ModelPicker';
import type { CreatePromptModalProps } from './types';
import styles from './index.module.css';

/**
 * 分类图标映射
 */
const categoryIcons: Record<Category, React.FC<{ className?: string }>> = {
  text: FileText,
  image: Image,
  audio: AudioLines,
  video: Video,
};

/**
 * CreatePromptModal - 创建 Prompt 弹窗主组件
 *
 * @description
 * 采用 Headless UI 模式的生产级组件。
 * 视图层仅负责声明式 UI 结构，所有业务逻辑封装在 useCreatePromptModal Hook 中。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：useCreatePromptModal.ts（Headless Hook）
 * - 视图层：index.tsx（本文件）
 *
 * @performance
 * - 使用 React.memo 防止不必要的重渲染
 * - 所有 handlers 已在 Hook 中使用 useCallback 优化
 * - 派生状态使用 useMemo 缓存
 *
 * @example
 * ```tsx
 * // 通过 useUIStore 控制显示
 * const { openModal } = useUIStore();
 * openModal('createPrompt');
 * ```
 */
export const CreatePromptModal = React.memo<CreatePromptModalProps>(() => {
  // ==================== Store 状态 ====================
  const { modals } = useUIStore();
  const { t } = useI18nStore();
  const { collections } = useCollectionStore();
  const { getModelOptions } = useModelStore();

  // ==================== Hook 状态和方法 ====================
  const modal = useCreatePromptModal();

  // ==================== 派生状态（缓存计算） ====================

  /**
   * 是否禁用表单（提交中状态）
   */
  const isFormDisabled = modal.isSubmitting;

  /**
   * 准备模型选项（基于选中的分类）
   */
  const modelGroups = useMemo(() => {
    return getModelOptions(modal.values.category);
  }, [modal.values.category, getModelOptions]);

  /**
   * 准备集合选项
   */
  const collectionOptions = useMemo(() => [
    { value: '', label: t.metadata?.noCollection || 'No collection' },
    ...collections.map(c => ({ value: c.id, label: c.name })),
  ], [collections, t.metadata]);

  // ==================== 视图渲染 ====================

  return (
    <Modal
      isOpen={modals.createPrompt}
      onClose={modal.handleClose}
      title={t.createPrompt?.title || 'Create Prompt'}
      size="xl"
    >
      <form onSubmit={modal.handleSubmit} className={styles.formContainer}>
        {/* ==================== 全局错误提示 ==================== */}
        {modal.errorMessage && (
          <div className={styles.errorAlert} role="alert">
            <AlertCircle className={styles.errorAlertIcon} aria-hidden="true" />
            <div className={styles.errorAlertContent}>
              <h4 className={styles.errorAlertTitle}>{t.common?.submitFailed || 'Submit Failed'}</h4>
              <p className={styles.errorAlertMessage}>{modal.errorMessage}</p>
            </div>
          </div>
        )}

        {/* ==================== 标题 ==================== */}
        <div className={styles.formSection}>
          <Input
            label={t.createPrompt?.titleLabel || 'Title'}
            value={modal.values.title}
            onChange={(e) => modal.handleTitleChange(e.target.value)}
            placeholder={t.createPrompt?.titlePlaceholder || 'Give your prompt a name...'}
            error={modal.errors.title}
            disabled={isFormDisabled}
            maxLength={100}
            autoFocus
          />
        </div>

        {/* ==================== 系统提示词 ==================== */}
        <div className={styles.formSection}>
          <Textarea
            label={t.editor?.systemPrompt || 'System Prompt'}
            value={modal.values.systemPrompt}
            onChange={(e) => modal.handleSystemPromptChange(e.target.value)}
            placeholder={t.editor?.systemPromptPlaceholder || 'Enter system instructions...'}
            error={modal.errors.systemPrompt}
            className={styles.systemPromptTextarea}
            disabled={isFormDisabled}
            maxLength={5000}
          />
        </div>

        {/* ==================== 分类选择 ==================== */}
        <div className={styles.formSection}>
          <label className={styles.formSectionLabel}>
            {t.createPrompt?.categoryLabel || 'Category'}
          </label>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat.id as Category];
              const isSelected = modal.values.category === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => modal.handleCategoryChange(cat.id as Category)}
                  disabled={isFormDisabled}
                  className={cn(
                    styles.categoryButton,
                    isSelected ? styles.categoryButtonSelected : styles.categoryButtonUnselected
                  )}
                  aria-pressed={isSelected}
                  aria-label={t.createPrompt?.selectCategoryAriaLabel?.replace('{category}', cat.id) || `Select ${cat.id} category`}
                >
                  <Icon className={cn(styles.categoryIcon, cat.color)} />
                  <span className={cn(
                    styles.categoryLabel,
                    isSelected ? styles.categoryLabelSelected : styles.categoryLabelUnselected
                  )}>
                    {t.categories?.[cat.id as keyof typeof t.categories] || cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== 模型和集合选择（两列） ==================== */}
        <div className={styles.twoColumnGrid}>
          <ModelPicker
            label={t.editor?.model || 'Model'}
            value={modal.values.model}
            onChange={modal.handleModelChange}
            groups={modelGroups}
            disabled={isFormDisabled}
          />
          <ModelPicker
            label={t.createPrompt?.collectionLabel || 'Collection'}
            value={modal.values.collectionId}
            onChange={modal.handleCollectionIdChange}
            options={collectionOptions}
            disabled={isFormDisabled}
            placeholder={t.metadata?.noCollection || 'No collection'}
          />
        </div>

        {/* ==================== 操作按钮区域 ==================== */}
        <div className={styles.actionsContainer}>
          <Button
            type="button"
            variant="ghost"
            onClick={modal.handleClose}
            disabled={isFormDisabled}
            aria-label={t.createPrompt?.cancelAriaLabel || 'Cancel and close modal'}
          >
            {t.common?.cancel || 'Cancel'}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isFormDisabled || modal.submissionState === 'submitting'}
            aria-label={t.createPrompt?.createAriaLabel || 'Create new prompt'}
          >
            {modal.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                <span>{t.createPrompt?.creating || 'Creating...'}</span>
              </>
            ) : (
              t.createPrompt?.createButton || 'Create Prompt'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
});

CreatePromptModal.displayName = 'CreatePromptModal';
