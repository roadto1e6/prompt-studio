// 文件路径: frontend/src/features/prompts/components/ImportPromptModal/index.tsx

/**
 * ImportPromptModal 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React from 'react';
import {
  Download,
  FileText,
  Image,
  AudioLines,
  Video,
  AlertTriangle,
  Loader2,
  User,
  AlertCircle,
} from 'lucide-react';
import { useUIStore, useI18nStore } from '@/stores';
import { Modal, Button, MarkdownPreview } from '@/components/ui';
import type { Category } from '@/types';
import { useImportPromptModal } from './useImportPromptModal';
import type { ImportPromptModalProps } from './types';
import styles from './index.module.css';

/**
 * 分类配置
 */
const categoryConfig: Record<
  Category,
  { icon: React.FC<{ className?: string }>; color: string; bgColor: string }
> = {
  text: {
    icon: FileText,
    color: 'text-theme-accent',
    bgColor: 'rgba(99, 102, 241, 0.1)',
  },
  image: {
    icon: Image,
    color: 'text-emerald-400',
    bgColor: 'rgba(16, 185, 129, 0.1)',
  },
  audio: {
    icon: AudioLines,
    color: 'text-amber-400',
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
  video: {
    icon: Video,
    color: 'text-rose-400',
    bgColor: 'rgba(244, 63, 94, 0.1)',
  },
};

/**
 * ImportPromptModal - 导入提示词弹窗主组件
 */
export const ImportPromptModal = React.memo<ImportPromptModalProps>(() => {
  // ==================== Store 状态 ====================
  const { modals } = useUIStore();
  const { t } = useI18nStore();

  // ==================== Hook 状态和方法 ====================
  const modal = useImportPromptModal();

  // ==================== 早期返回 ====================
  if (!modals.importPrompt) return null;

  // ==================== 分类样式 ====================
  const categoryStyle = modal.displayData
    ? categoryConfig[modal.displayData.category]
    : null;
  const CategoryIcon = categoryStyle?.icon || FileText;

  // ==================== 视图渲染 ====================

  return (
    <Modal
      isOpen={modals.importPrompt}
      onClose={modal.handleClose}
      title={t.import?.title || 'Import Prompt'}
      size="sm"
      showBackButton={modal.viewState === 'preview'}
      onBack={modal.handleBack}
    >
      <div className={styles.contentContainer}>
        {/* ==================== 输入视图 ==================== */}
        {modal.viewState === 'input' && (
          <div className={styles.inputSection}>
            {/* 头部图标和标题 */}
            <div className={styles.inputHeader}>
              <div className={styles.inputIconWrapper}>
                <Download className={styles.inputIcon} aria-hidden="true" />
              </div>
              <p className={styles.inputTitle}>
                {t.import?.title || 'Import Prompt'}
              </p>
              <p className={styles.inputSubtitle}>
                {t.import?.subtitle || 'Import a shared prompt to your library'}
              </p>
            </div>

            {/* 输入框 */}
            <div className={styles.inputFieldWrapper}>
              <label className={styles.inputLabel}>
                {t.import?.pasteLabel || 'Paste Share Link or Code'}
              </label>
              <input
                type="text"
                value={modal.formState.inputCode}
                onChange={(e) => modal.handleInputChange(e.target.value)}
                placeholder={t.import?.pastePlaceholder || 'e.g., ABC12345 or https://...?s=ABC12345'}
                autoFocus
                className={`${styles.inputField} ${modal.hasError ? styles.inputFieldError : ''}`}
                disabled={modal.isLoading}
                aria-label={t.import?.shareCodeInput || 'Share code input'}
                aria-invalid={modal.hasError}
              />
              {modal.hasError && (
                <p className={styles.inputError} role="alert">
                  <AlertCircle className={styles.inputErrorIcon} aria-hidden="true" />
                  {modal.formState.errorMessage}
                </p>
              )}
            </div>

            {/* 获取按钮 */}
            <Button
              variant="primary"
              onClick={modal.handleFetchShare}
              disabled={!modal.formState.inputCode.trim() || modal.isLoading}
              className={styles.fetchButton}
            >
              {modal.isFetching ? (
                <>
                  <Loader2 className={`${styles.buttonIcon} mr-2 animate-spin`} aria-hidden="true" />
                  <span>{t.import?.fetching || 'Fetching...'}</span>
                </>
              ) : (
                <>
                  <Download className={`${styles.buttonIcon} mr-2`} aria-hidden="true" />
                  <span>{t.import?.parseButton || 'Fetch Share'}</span>
                </>
              )}
            </Button>

            {/* 提示文字 */}
            <p className={styles.inputHint}>
              {t.import?.hint || 'Enter 8-character code or full share URL'}
            </p>
          </div>
        )}

        {/* ==================== 预览视图 ==================== */}
        {modal.viewState === 'preview' && modal.displayData && (
          <div className={styles.previewSection}>
            {/* 重复警告 */}
            {modal.isDuplicate && modal.duplicatePrompt && (
              <div className={styles.warningAlert}>
                <AlertTriangle className={styles.warningIcon} aria-hidden="true" />
                <div className={styles.warningContent}>
                  <p className={styles.warningTitle}>
                    {t.import?.duplicateTitle || 'Duplicate Detected'}
                  </p>
                  <p className={styles.warningMessage}>
                    {t.import?.duplicateMessage || 'A similar prompt already exists in your library.'}
                  </p>
                </div>
              </div>
            )}

            {/* 预览卡片 */}
            <div className={styles.previewCard}>
              {/* 头部 */}
              <div className={styles.cardHeader}>
                <div
                  className={styles.categoryIconWrapper}
                  style={{ backgroundColor: categoryStyle?.bgColor }}
                >
                  <CategoryIcon className={`${styles.categoryIcon} ${categoryStyle?.color || ''}`} />
                </div>
                <div className={styles.cardInfo}>
                  <h4 className={styles.cardTitle}>{modal.displayData.title}</h4>
                  <p className={styles.cardDescription}>
                    {modal.displayData.description || t.promptCard?.noDescription || 'No description'}
                  </p>
                </div>
              </div>

              {/* Meta 信息 */}
              <div className={styles.cardMeta}>
                <span className={styles.metaBadge}>{modal.displayData.model}</span>
                <span className={styles.metaDot} />
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{t.import?.preview?.temp || 'Temp'}:</span>
                  <span className={styles.metaValue}>{modal.displayData.temperature}</span>
                </div>
                <span className={styles.metaDot} />
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{t.import?.preview?.maxTokens || 'Max'}:</span>
                  <span className={styles.metaValue}>{modal.displayData.maxTokens}</span>
                </div>
              </div>

              {/* 标签 */}
              {modal.displayData.tags && modal.displayData.tags.length > 0 && (
                <div className={styles.tagsSection}>
                  {modal.displayData.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                  {modal.displayData.tags.length > 5 && (
                    <span className={styles.tagsMore}>+{modal.displayData.tags.length - 5}</span>
                  )}
                </div>
              )}

              {/* 系统提示词预览 */}
              {modal.displayData.systemPrompt && (
                <div className={styles.systemPromptSection}>
                  <p className={styles.systemPromptLabel}>
                    {t.import?.preview?.systemPrompt || 'System Prompt'}
                  </p>
                  <div className={styles.systemPromptContent}>
                    <MarkdownPreview
                      content={modal.displayData.systemPrompt}
                      compact
                      maxHeight="200px"
                    />
                  </div>
                </div>
              )}

              {/* 分享者 */}
              {modal.displayData.sharedBy && (
                <div className={styles.sharedBySection}>
                  <User className={styles.sharedByIcon} aria-hidden="true" />
                  <span>{t.import?.preview?.sharedBy || 'Shared by'}: {modal.displayData.sharedBy}</span>
                </div>
              )}
            </div>

            {/* 导入按钮 */}
            <Button
              variant={modal.isDuplicate ? 'secondary' : 'primary'}
              onClick={modal.handleImport}
              disabled={modal.isLoading}
              className={styles.importButton}
            >
              {modal.isImporting ? (
                <>
                  <Loader2 className={`${styles.buttonIcon} mr-2 animate-spin`} aria-hidden="true" />
                  <span>{t.import?.importing || 'Importing...'}</span>
                </>
              ) : (
                <>
                  <Download className={`${styles.buttonIcon} mr-2`} aria-hidden="true" />
                  <span>
                    {modal.isDuplicate
                      ? t.import?.importAnyway || 'Import Anyway'
                      : t.import?.importButton || 'Import to Library'}
                  </span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
});

ImportPromptModal.displayName = 'ImportPromptModal';
