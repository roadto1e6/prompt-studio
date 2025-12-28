// 文件路径: frontend/src/features/prompts/components/SharePromptModal/index.tsx

/**
 * SharePromptModal 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React from 'react';
import { Loader2, AlertCircle, RefreshCw, Link2, Copy, Check } from 'lucide-react';
import { useUIStore, useI18nStore, usePromptStore } from '@/stores';
import { Modal, Button } from '@/components/ui';
import { useSharePromptModal } from './useSharePromptModal';
import type { SharePromptModalProps } from './types';
import styles from './index.module.css';

/**
 * SharePromptModal - 分享 Prompt 弹窗主组件
 *
 * @description
 * 采用 Headless UI 模式的生产级组件。
 * 视图层仅负责声明式 UI 结构，所有业务逻辑封装在 useSharePromptModal Hook 中。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：useSharePromptModal.ts（Headless Hook）
 * - 视图层：index.tsx（本文件）
 *
 * @features
 * - 自动生成分享链接
 * - 分享码和完整 URL 双重复制
 * - 复制状态反馈
 * - 错误处理和重试机制
 * - 加载状态动画
 *
 * @performance
 * - 使用 React.memo 防止不必要的重渲染
 * - 所有 handlers 已在 Hook 中使用 useCallback 优化
 *
 * @example
 * ```tsx
 * // 通过 useUIStore 控制显示
 * const { openModal } = useUIStore();
 * openModal('sharePrompt');
 * ```
 */
export const SharePromptModal = React.memo<SharePromptModalProps>(() => {
  // ==================== Store 状态 ====================
  const { modals } = useUIStore();
  const { t } = useI18nStore();
  const { getActivePrompt } = usePromptStore();

  // ==================== Hook 状态和方法 ====================
  const shareModal = useSharePromptModal();

  // ==================== 数据获取 ====================
  const prompt = getActivePrompt();
  const isOpen = modals.sharePrompt;

  // ==================== 早期返回 ====================
  if (!isOpen || !prompt) return null;

  // ==================== 视图渲染 ====================

  return (
    <Modal
      isOpen={isOpen}
      onClose={shareModal.handleClose}
      title={t.share?.title || 'Share Prompt'}
      size="sm"
    >
      <div className={styles.contentContainer}>
        {/* ==================== 加载状态 ==================== */}
        {shareModal.isLoading && (
          <div className={styles.loadingContainer}>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <p className={styles.loadingText}>
              {t.share?.generating || 'Generating share link...'}
            </p>
          </div>
        )}

        {/* ==================== 错误状态 ==================== */}
        {shareModal.error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorIconWrapper}>
              <AlertCircle className={styles.errorIcon} aria-hidden="true" />
            </div>
            <p className={styles.errorText}>{shareModal.error}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={shareModal.handleRetry}
              aria-label={t.share?.retryAriaLabel || 'Retry generating share link'}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              {t.share?.retry || 'Retry'}
            </Button>
          </div>
        )}

        {/* ==================== 成功状态 - 显示分享内容 ==================== */}
        {shareModal.shareResult && !shareModal.isLoading && (
          <div className={`${styles.shareContent} ${styles.fadeInAnimation}`}>
            {/* Prompt 标题预览 */}
            <div className={styles.previewSection}>
              <p className={styles.previewTitle}>{prompt.title}</p>
              <p className={styles.previewModel}>{prompt.model}</p>
            </div>

            {/* 分享码 - 突出显示 */}
            <div className={styles.codeSection}>
              <p className={styles.codeLabel}>
                {t.share?.shareCode || 'Share Code'}
              </p>
              <div
                className={styles.codeBox}
                onClick={shareModal.handleCopyCode}
                role="button"
                tabIndex={0}
                aria-label={`Copy share code: ${shareModal.shareResult.code}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    shareModal.handleCopyCode();
                  }
                }}
              >
                <span className={styles.codeText}>
                  {shareModal.shareResult.code}
                </span>
                {shareModal.isCodeCopied ? (
                  <Check className={styles.copiedIcon} aria-hidden="true" />
                ) : (
                  <Copy className={styles.copyIcon} aria-hidden="true" />
                )}
              </div>
              {shareModal.isCodeCopied && (
                <p className={styles.copiedText} role="status">
                  {t.common?.copied || 'Copied!'}
                </p>
              )}
            </div>

            {/* 完整 URL */}
            <div className={styles.urlSection}>
              <p className={styles.urlLabel}>
                {t.share?.shareLink || 'Share Link'}
              </p>
              <div
                className={styles.urlBox}
                onClick={shareModal.handleCopyUrl}
                role="button"
                tabIndex={0}
                aria-label={`Copy share URL: ${shareModal.shareResult.shareUrl}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    shareModal.handleCopyUrl();
                  }
                }}
              >
                <Link2 className={styles.urlIcon} aria-hidden="true" />
                <span className={styles.urlText}>
                  {shareModal.shareResult.shareUrl}
                </span>
                {shareModal.isUrlCopied ? (
                  <Check className={styles.urlCopiedIcon} aria-hidden="true" />
                ) : (
                  <Copy className={styles.urlCopyIcon} aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== 底部操作按钮 ==================== */}
      {shareModal.shareResult && (
        <div className={styles.footerContainer}>
          <Button
            variant="primary"
            onClick={shareModal.handleClose}
            className="w-full"
            aria-label={t.share?.closeAriaLabel || 'Close share modal'}
          >
            {t.common?.close || 'Close'}
          </Button>
        </div>
      )}
    </Modal>
  );
});

SharePromptModal.displayName = 'SharePromptModal';
