// 文件路径: frontend/src/features/prompts/components/ImportPromptModal/index.tsx

/**
 * ImportPromptModal 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  FileText,
  Image,
  AudioLines,
  Video,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  User,
} from 'lucide-react';
import { useUIStore, useI18nStore } from '@/stores';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/utils';
import type { Category } from '@/types';
import { useImportPromptModal } from './useImportPromptModal';
import type { ImportPromptModalProps } from './types';
import styles from './index.module.css';

/**
 * 分类配置
 * 定义每个分类的图标、颜色和背景
 */
const categoryConfig: Record<
  Category,
  { icon: React.FC<{ className?: string }>; color: string; bg: string }
> = {
  text: { icon: FileText, color: 'text-theme-accent', bg: 'bg-theme-accent/20' },
  image: { icon: Image, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  audio: { icon: AudioLines, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  video: { icon: Video, color: 'text-rose-400', bg: 'bg-rose-500/20' },
};

/**
 * ImportPromptModal - 导入提示词弹窗主组件
 *
 * @description
 * 采用 Headless UI 模式的生产级组件。
 * 视图层仅负责声明式 UI 结构，所有业务逻辑封装在 useImportPromptModal Hook 中。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：useImportPromptModal.ts（Headless Hook）
 * - 视图层：index.tsx（本文件）
 *
 * @features
 * 1. 分享码导入：支持 URL 或纯短码
 * 2. 导入前预览：完整显示提示词信息
 * 3. 重复检测：警告已存在的提示词
 * 4. 异步导入：带 Loading/Error/Success 状态
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
 * openModal('importPrompt');
 * ```
 */
export const ImportPromptModal = React.memo<ImportPromptModalProps>(() => {
  // ==================== Store 状态 ====================
  const { modals } = useUIStore();
  const { t } = useI18nStore();

  // ==================== Hook 状态和方法 ====================
  const modal = useImportPromptModal();

  // ==================== 早期返回（模态框未打开） ====================
  if (!modals.importPrompt) return null;

  // ==================== 分类样式配置 ====================
  const CategoryIcon = modal.displayData
    ? categoryConfig[modal.displayData.category]?.icon
    : null;
  const categoryStyle = modal.displayData
    ? categoryConfig[modal.displayData.category]
    : null;

  // ==================== 视图渲染 ====================

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={modal.handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-theme-card-bg border border-theme-border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ==================== Header ==================== */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-theme-border">
            <div className="flex items-center gap-2.5">
              {modal.viewState === 'preview' ? (
                <button
                  onClick={modal.handleBack}
                  className="p-1.5 text-theme-text-secondary hover:text-theme-text-primary rounded-lg hover:bg-theme-overlay transition-colors"
                  aria-label={t.import?.backToInput || 'Back to input'}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                  <Download className="w-4 h-4 text-emerald-400" />
                </div>
              )}
              <h3 className="text-theme-text-primary font-medium">
                {t.import?.title || 'Import Prompt'}
              </h3>
            </div>
            <button
              onClick={modal.handleClose}
              className="p-1.5 text-theme-text-secondary hover:text-theme-text-primary rounded-lg hover:bg-theme-overlay transition-colors"
              aria-label={t.import?.closeModal || 'Close modal'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ==================== Content ==================== */}
          <div className="p-5">
            <div className={styles.container}>
              {/* ==================== 输入视图 ==================== */}
              {modal.viewState === 'input' && (
                <div className={styles.inputSection}>
                  {/* 输入字段 */}
                  <div>
                    <label className={styles.inputLabel}>
                      {t.import?.pasteLabel || 'Paste share code or link'}
                    </label>
                    <input
                      type="text"
                      value={modal.formState.inputCode}
                      onChange={(e) => modal.handleInputChange(e.target.value)}
                      placeholder={t.import?.pastePlaceholder || 'e.g., ABC12345 or https://...?s=ABC12345'}
                      autoFocus
                      className={styles.inputField}
                      disabled={modal.isLoading}
                      aria-label={t.import?.shareCodeInput || 'Share code input'}
                      aria-invalid={modal.hasError}
                      aria-describedby={modal.hasError ? 'input-error' : undefined}
                    />
                    {modal.hasError && (
                      <p id="input-error" className={styles.inputError} role="alert">
                        {modal.formState.errorMessage}
                      </p>
                    )}
                  </div>

                  {/* 获取按钮 */}
                  <Button
                    variant="primary"
                    onClick={modal.handleFetchShare}
                    disabled={!modal.formState.inputCode.trim() || modal.isLoading}
                    className="w-full"
                  >
                    {modal.isFetching ? (
                      <>
                        <Loader2 className={cn(styles.buttonIcon, 'mr-2 animate-spin')} />
                        <span>{t.import?.fetching || 'Fetching...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className={cn(styles.buttonIcon, 'mr-2')} />
                        <span>{t.import?.parseButton || 'Parse & Preview'}</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* ==================== 预览视图 ==================== */}
              {modal.viewState === 'preview' && modal.displayData && (
                <div className={cn(styles.container, styles.animateFadeIn)}>
                  {/* 重复警告 */}
                  {modal.isDuplicate && modal.duplicatePrompt && (
                    <div className={styles.warningAlert}>
                      <AlertTriangle className={styles.warningIcon} />
                      <div className={styles.warningContent}>
                        <p className={styles.warningTitle}>
                          {t.import?.duplicateTitle || 'Duplicate Detected'}
                        </p>
                        <p className={styles.warningMessage}>
                          {t.import?.duplicateMessage ||
                            'A similar prompt already exists in your library.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 预览卡片 */}
                  <div className={styles.previewCard}>
                    {/* Header with category */}
                    <div className={styles.previewHeader}>
                      {CategoryIcon && categoryStyle && (
                        <div className={cn(styles.categoryIconWrapper, categoryStyle.bg)}>
                          <CategoryIcon className={cn(styles.categoryIcon, categoryStyle.color)} />
                        </div>
                      )}
                      <div className={styles.previewContent}>
                        <h4 className={styles.previewTitle}>{modal.displayData.title}</h4>
                        <p className={styles.previewDescription}>
                          {modal.displayData.description ||
                            t.promptCard?.noDescription ||
                            'No description'}
                        </p>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className={styles.previewMeta}>
                      <span className={styles.metaBadge}>{modal.displayData.model}</span>
                      <span className={styles.metaText}>T: {modal.displayData.temperature}</span>
                      <span className={styles.metaText}>
                        Max: {modal.displayData.maxTokens}
                      </span>
                    </div>

                    {/* Tags */}
                    {modal.displayData.tags.length > 0 && (
                      <div className={styles.tagsContainer}>
                        {modal.displayData.tags.slice(0, 5).map((tag) => (
                          <Badge key={tag} variant="default" size="sm">
                            #{tag}
                          </Badge>
                        ))}
                        {modal.displayData.tags.length > 5 && (
                          <span className={styles.tagsOverflow}>
                            +{modal.displayData.tags.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    {/* System Prompt Preview */}
                    {modal.displayData.systemPrompt && (
                      <div className={styles.systemPromptSection}>
                        <p className={styles.systemPromptLabel}>
                          {t.import?.preview?.systemPrompt || 'System Prompt'}
                        </p>
                        <p className={styles.systemPromptContent}>
                          {modal.displayData.systemPrompt}
                        </p>
                      </div>
                    )}

                    {/* Shared by */}
                    <div className={styles.sharedBySection}>
                      <User className={styles.sharedByIcon} />
                      <span>{modal.displayData.sharedBy}</span>
                    </div>
                  </div>

                  {/* 导入按钮 */}
                  <Button
                    variant={modal.isDuplicate ? 'secondary' : 'primary'}
                    onClick={modal.handleImport}
                    disabled={modal.isLoading}
                    className="w-full"
                  >
                    {modal.isImporting ? (
                      <>
                        <Loader2 className={cn(styles.buttonIcon, 'mr-2 animate-spin')} />
                        <span>{t.import?.importing || 'Importing...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className={cn(styles.buttonIcon, 'mr-2')} />
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

ImportPromptModal.displayName = 'ImportPromptModal';
