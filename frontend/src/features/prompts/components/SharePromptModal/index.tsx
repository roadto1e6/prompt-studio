// 文件路径: frontend/src/features/prompts/components/SharePromptModal/index.tsx

/**
 * SharePromptModal 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React, { useMemo } from 'react';
import { Loader2, AlertCircle, RefreshCw, Link2, Copy, Check, Share2, FileText } from 'lucide-react';
import { useUIStore, useI18nStore, usePromptStore } from '@/stores';
import { Modal, Button } from '@/components/ui';
import { useSharePromptModal } from './useSharePromptModal';
import type { SharePromptModalProps } from './types';
import styles from './index.module.css';

/**
 * 格式化过期时间
 */
function formatExpiry(expiresAt?: string): string {
  if (!expiresAt) return '';

  const expiry = new Date(expiresAt);
  const now = new Date();
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Expired';
  if (diffDays === 1) return '1 day left';
  if (diffDays <= 7) return `${diffDays} days left`;

  return expiry.toLocaleDateString();
}

/**
 * SharePromptModal - 分享 Prompt 弹窗主组件
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

  // ==================== 派生数据 ====================
  const expiryText = useMemo(() => {
    return formatExpiry(shareModal.shareResult?.expiresAt);
  }, [shareModal.shareResult?.expiresAt]);

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
            <Loader2 className={styles.loadingSpinner} aria-hidden="true" />
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

        {/* ==================== 成功状态 ==================== */}
        {shareModal.shareResult && !shareModal.isLoading && (
          <div className={styles.shareContent}>
            {/* 成功头部 */}
            <div className={styles.successHeader}>
              <div className={styles.successIconWrapper}>
                <Share2 className={styles.successIcon} aria-hidden="true" />
              </div>
              <p className={styles.successTitle}>
                {t.share?.readyTitle || 'Ready to share!'}
              </p>
              <p className={styles.successSubtitle}>
                {t.share?.readySubtitle || 'Anyone with this code can view your prompt'}
              </p>
            </div>

            {/* Prompt 预览卡片 */}
            <div className={styles.previewSection}>
              <div className={styles.previewIcon}>
                <FileText className={styles.previewIconInner} aria-hidden="true" />
              </div>
              <div className={styles.previewInfo}>
                <p className={styles.previewTitle}>{prompt.title}</p>
                <div className={styles.previewMeta}>
                  <span className={styles.previewModel}>{prompt.model}</span>
                  {expiryText && (
                    <>
                      <span className={styles.previewDot} />
                      <span className={styles.previewExpiry}>{expiryText}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 分享码 - 主要操作 */}
            <div className={styles.codeSection}>
              <p className={styles.codeLabel}>
                <span>{t.share?.shareCode || 'Share Code'}</span>
                <span>{t.share?.clickToCopy || 'Click to copy'}</span>
              </p>
              <div
                className={`${styles.codeBox} ${shareModal.isCodeCopied ? styles.codeBoxCopied : ''}`}
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
                <div className={styles.copyIconWrapper}>
                  {shareModal.isCodeCopied ? (
                    <Check className={styles.copiedIcon} aria-hidden="true" />
                  ) : (
                    <Copy className={styles.copyIcon} aria-hidden="true" />
                  )}
                </div>
                {shareModal.isCodeCopied && (
                  <span className={styles.copiedBadge}>
                    {t.common?.copied || 'Copied!'}
                  </span>
                )}
              </div>
            </div>

            {/* 完整链接 - 次要操作 */}
            <div className={styles.urlSection}>
              <p className={styles.urlLabel}>
                <span>{t.share?.shareLink || 'Share Link'}</span>
              </p>
              <div
                className={`${styles.urlBox} ${shareModal.isUrlCopied ? styles.urlBoxCopied : ''}`}
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
    </Modal>
  );
});

SharePromptModal.displayName = 'SharePromptModal';
