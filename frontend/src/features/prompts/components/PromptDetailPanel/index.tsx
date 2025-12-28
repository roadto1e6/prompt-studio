// 文件路径: frontend/src/features/prompts/components/PromptDetailPanel/index.tsx

/**
 * PromptDetailPanel 视图层
 * 仅负责声明式 UI 结构
 */

import React, { memo } from 'react';
import { Trash2, X, RotateCcw, Share2 } from 'lucide-react';
import { Tabs, TabPanel } from '@/components/ui';
import { PromptEditor } from '../PromptEditor';
import { PromptMetadata } from '../PromptMetadata';
import { PromptVersions } from '../PromptVersions';
import { cn } from '@/utils';
import { usePromptDetailPanel } from './usePromptDetailPanel';
import styles from './index.module.css';

/**
 * PromptDetailPanel 组件
 */
const PromptDetailPanelComponent: React.FC = () => {
  const {
    prompt,
    collection,
    isInTrash,
    localTitle,
    activeTab,
    tabs,
    categoryColors,
    t,
    handleTitleChange,
    handleTitleBlur,
    handleRestore,
    handlePermanentDelete,
    handleShare,
    handleClose,
    handleTabChange,
  } = usePromptDetailPanel();

  // 无选中 prompt 时显示空状态
  if (!prompt) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <p className={styles.emptyStateTitle}>{t.detailPanel.noPromptSelected}</p>
          <p className={styles.emptyStateText}>{t.detailPanel.selectPrompt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        {/* Category Row */}
        <div className={styles.categoryRow}>
          <span className={cn(
            styles.categoryDot,
            categoryColors[prompt.category] || 'bg-slate-500'
          )} />
          <span className={styles.categoryName}>
            {collection?.name || t.detailPanel.uncategorized}
          </span>
        </div>

        {/* Title Row */}
        <div className={styles.titleRow}>
          <div className={styles.titleInputWrapper}>
            <input
              type="text"
              value={localTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              className={styles.titleInput}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            {isInTrash ? (
              <>
                <button
                  onClick={handleRestore}
                  className={cn(styles.actionButton, styles.actionButtonRestore)}
                  title={t.detailPanel.restore}
                >
                  <RotateCcw className={styles.actionIcon} />
                </button>
                <button
                  onClick={handlePermanentDelete}
                  className={cn(styles.actionButton, styles.actionButtonDelete)}
                  title={t.detailPanel.deletePermanently}
                >
                  <Trash2 className={styles.actionIcon} />
                </button>
              </>
            ) : (
              <button
                onClick={handleShare}
                className={cn(styles.actionButton, styles.actionButtonShare)}
                title={t.detailPanel.share}
              >
                <Share2 className={styles.actionIcon} />
              </button>
            )}
            <button
              onClick={handleClose}
              className={cn(styles.actionButton, styles.actionButtonClose)}
            >
              <X className={styles.actionIcon} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={handleTabChange}
        className="px-2 flex-shrink-0"
      />

      {/* Content */}
      <div className={styles.content}>
        <TabPanel id="editor" activeTab={activeTab} className={styles.tabContent}>
          <PromptEditor />
        </TabPanel>
        <TabPanel id="metadata" activeTab={activeTab} className={styles.tabContent}>
          <PromptMetadata />
        </TabPanel>
        <TabPanel id="versions" activeTab={activeTab} className={styles.tabContent}>
          <PromptVersions />
        </TabPanel>
      </div>
    </div>
  );
};

export const PromptDetailPanel = memo(PromptDetailPanelComponent);
