// 文件路径: frontend/src/features/prompts/components/CreatePromptModal/index.tsx

/**
 * CreatePromptModal 视图层
 * 左右分栏布局，系统提示词支持 Markdown 预览
 */

import React, { useMemo, useState, useCallback } from 'react';
import { FileText, Image, AudioLines, Video, AlertCircle, Loader2, Edit3, Eye, Maximize2 } from 'lucide-react';
import { useUIStore, useI18nStore, useCollectionStore, useModelStore } from '@/stores';
import { Modal, Input, Button, Badge, Select, MarkdownPreview, FullscreenEditor } from '@/components/ui';
import { CATEGORIES } from '@/constants';
import { cn } from '@/utils';
import type { Category } from '@/types';
import { useCreatePromptModal } from './useCreatePromptModal';
import type { CreatePromptModalProps } from './types';
import styles from './index.module.css';

const categoryIcons: Record<Category, React.FC<{ className?: string }>> = {
  text: FileText,
  image: Image,
  audio: AudioLines,
  video: Video,
};

export const CreatePromptModal = React.memo<CreatePromptModalProps>(() => {
  const { modals } = useUIStore();
  const { t } = useI18nStore();
  const { collections } = useCollectionStore();
  const { getModelOptions, initialized, providers } = useModelStore();
  const modal = useCreatePromptModal();
  const [newTag, setNewTag] = useState('');

  const isFormDisabled = modal.isSubmitting;

  const modelGroups = useMemo(() => {
    if (!initialized) return [];
    const options = getModelOptions(modal.values.category);
    // Transform GroupedModelOptions to SelectGroup format
    return options.map(group => ({
      label: group.providerName,
      options: group.options.map(opt => ({ value: opt.value, label: opt.label })),
    }));
  }, [modal.values.category, getModelOptions, initialized, providers]);

  const collectionOptions = useMemo(() => [
    { value: '', label: t.metadata?.noCollection || 'No collection' },
    ...collections.map(c => ({ value: c.id, label: c.name })),
  ], [collections, t.metadata]);

  const handleAddTag = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = newTag.trim();
      if (value && !modal.values.tags.includes(value)) {
        modal.handleTagsChange([...modal.values.tags, value]);
        setNewTag('');
      }
    }
  }, [newTag, modal]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    modal.handleTagsChange(modal.values.tags.filter(tag => tag !== tagToRemove));
  }, [modal]);

  return (
    <Modal
      isOpen={modals.createPrompt}
      onClose={modal.handleClose}
      title={t.createPrompt?.title || 'Create New Prompt'}
      size="4xl"
    >
      <form onSubmit={modal.handleSubmit} className={styles.form}>
        {/* 错误提示 */}
        {modal.errorMessage && (
          <div className={styles.errorAlert}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{modal.errorMessage}</span>
          </div>
        )}

        {/* 主体区域：左右分栏 */}
        <div className={styles.mainContent}>
          {/* 左侧：基本信息 */}
          <div className={styles.leftPanel}>
            {/* 标题 */}
            <Input
              label={t.createPrompt?.titleLabel || 'Title'}
              value={modal.values.title}
              onChange={(e) => modal.handleTitleChange(e.target.value)}
              placeholder={t.createPrompt?.titlePlaceholder || 'Give your prompt a name...'}
              error={modal.errors.title}
              disabled={isFormDisabled}
              autoFocus
            />

            {/* 分类 */}
            <div className={styles.field}>
              <label className={styles.label}>{t.createPrompt?.categoryLabel || 'Category'}</label>
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
                      className={cn(styles.categoryBtn, isSelected && styles.categoryBtnActive)}
                    >
                      <Icon className={cn('w-3.5 h-3.5', cat.color)} />
                      <span>{t.categories?.[cat.id as keyof typeof t.categories] || cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 模型 & 集合 */}
            <div className={styles.row}>
              <Select
                label={t.editor?.model || 'Model'}
                value={modal.values.model}
                onValueChange={modal.handleModelChange}
                groups={modelGroups}
                disabled={isFormDisabled}
                searchable
                searchPlaceholder={t.metadata?.searchModels || 'Search...'}
              />
              <Select
                label={t.createPrompt?.collectionLabel || 'Collection'}
                value={modal.values.collectionId}
                onValueChange={modal.handleCollectionIdChange}
                options={collectionOptions}
                disabled={isFormDisabled}
              />
            </div>

            {/* 标签 */}
            <div className={styles.field}>
              <label className={styles.label}>{t.metadata?.tags || 'Tags'}</label>
              {modal.values.tags.length > 0 && (
                <div className={styles.tags}>
                  {modal.values.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="primary"
                      size="sm"
                      removable
                      onRemove={() => handleRemoveTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={t.metadata?.addTag || 'Press Enter to add tag...'}
                disabled={isFormDisabled}
              />
            </div>
          </div>

          {/* 右侧：系统提示词 */}
          <div className={styles.rightPanel}>
            <div className={styles.promptSection}>
              {/* 头部：标签和切换按钮 */}
              <div className={styles.promptHeader}>
                <label className={styles.promptLabel}>
                  {t.editor?.systemPrompt || 'System Prompt'}
                </label>
                <div className={styles.headerActions}>
                  <div className={styles.modeToggle}>
                    <button
                      type="button"
                      onClick={modal.togglePreviewMode}
                      className={cn(styles.modeButton, !modal.isPreviewMode && styles.modeButtonActive)}
                    >
                      <Edit3 className={styles.modeIcon} />
                      {t.editor?.edit || 'Edit'}
                    </button>
                    <button
                      type="button"
                      onClick={modal.togglePreviewMode}
                      className={cn(styles.modeButton, modal.isPreviewMode && styles.modeButtonActive)}
                    >
                      <Eye className={styles.modeIcon} />
                      {t.editor?.preview || 'Preview'}
                    </button>
                  </div>
                  {/* 全屏按钮 */}
                  <button
                    type="button"
                    onClick={modal.openFullscreen}
                    className={styles.fullscreenButton}
                    title={t.fullscreen?.openFullscreen || 'Fullscreen'}
                  >
                    <Maximize2 className={styles.fullscreenIcon} />
                  </button>
                </div>
              </div>

              {/* 编辑器/预览 */}
              <div className={styles.editorContainer}>
                {modal.isPreviewMode ? (
                  <div className={styles.previewContainer}>
                    <MarkdownPreview content={modal.values.systemPrompt} />
                  </div>
                ) : (
                  <textarea
                    value={modal.values.systemPrompt}
                    onChange={(e) => modal.handleSystemPromptChange(e.target.value)}
                    placeholder={t.editor?.systemPromptPlaceholder || 'Define how the AI should behave...'}
                    disabled={isFormDisabled}
                    className={styles.promptTextarea}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={modal.handleClose} disabled={isFormDisabled}>
            {t.common?.cancel || 'Cancel'}
          </Button>
          <Button type="submit" variant="primary" disabled={isFormDisabled}>
            {modal.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.createPrompt?.creating || 'Creating...'}
              </>
            ) : (
              t.createPrompt?.createButton || 'Create'
            )}
          </Button>
        </div>
      </form>

      {/* 全屏编辑器 */}
      <FullscreenEditor
        isOpen={modal.isFullscreen}
        onClose={modal.closeFullscreen}
        value={modal.values.systemPrompt}
        onChange={modal.handleSystemPromptChange}
        title={t.editor?.systemPrompt || 'System Prompt'}
        placeholder={t.editor?.systemPromptPlaceholder}
        disabled={isFormDisabled}
      />
    </Modal>
  );
});

CreatePromptModal.displayName = 'CreatePromptModal';
