// 文件路径: frontend/src/features/prompts/components/SharePromptModal/useSharePromptModal.ts

/**
 * SharePromptModal 逻辑层
 * Headless UI Hook：封装分享链接生成、复制逻辑和状态管理
 */

import { useState, useCallback, useEffect } from 'react';
import { usePromptStore, useUIStore, useI18nStore } from '@/stores';
import { shareService } from '@/services';
import { useCopyToClipboard } from '@/hooks';
import type { CreateShareResponse } from '@/types';
import type { ShareState, UseSharePromptModalReturn } from './types';

/**
 * SharePromptModal Headless Hook
 *
 * @description
 * 封装分享功能的所有业务逻辑：
 * - 分享链接自动生成
 * - 复制到剪贴板（URL 和分享码）
 * - 错误处理和重试
 * - 状态管理和生命周期
 *
 * @example
 * ```tsx
 * const shareModal = useSharePromptModal();
 *
 * return (
 *   <div>
 *     {shareModal.isLoading && <Spinner />}
 *     {shareModal.shareResult && (
 *       <button onClick={shareModal.handleCopyUrl}>
 *         {shareModal.isUrlCopied ? 'Copied!' : 'Copy URL'}
 *       </button>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useSharePromptModal(): UseSharePromptModalReturn {
  // ==================== Store 依赖 ====================
  const { getActivePrompt } = usePromptStore();
  const { modals, closeModal } = useUIStore();
  const { t } = useI18nStore();

  // ==================== Client State ====================
  const [shareState, setShareState] = useState<ShareState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [shareResult, setShareResult] = useState<CreateShareResponse | null>(null);

  // ==================== Copy Hooks ====================
  const {
    isCopied: isUrlCopied,
    copy: copyUrl,
  } = useCopyToClipboard(2000);

  const {
    isCopied: isCodeCopied,
    copy: copyCode,
  } = useCopyToClipboard(2000);

  // ==================== 派生状态 ====================
  const isLoading = shareState === 'loading';
  const prompt = getActivePrompt();
  const isOpen = modals.sharePrompt;

  // ==================== 生成分享链接 ====================

  /**
   * 生成分享链接
   * 调用后端 API 创建分享记录
   */
  const generateShare = useCallback(async () => {
    if (!prompt?.id) {
      setError('No prompt selected');
      setShareState('error');
      return;
    }

    // 防止重复请求
    if (shareState === 'loading') {
      return;
    }

    setShareState('loading');
    setError(null);

    try {
      const result = await shareService.create({ promptId: prompt.id });

      // 验证响应数据
      if (!result?.code) {
        throw new Error('Invalid response: missing share code');
      }

      // 更新状态
      setShareResult(result);
      setShareState('success');
    } catch (err) {
      // 错误处理
      const errorMessage = err instanceof Error
        ? err.message
        : t.share?.generateError || 'Failed to generate share link';
      setError(errorMessage);
      setShareState('error');
    }
  }, [prompt?.id, shareState, t.share]);

  // ==================== 复制操作 ====================

  /**
   * 复制分享链接
   */
  const handleCopyUrl = useCallback(async () => {
    if (!shareResult) return;

    try {
      await copyUrl(shareResult.shareUrl);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }, [shareResult, copyUrl]);

  /**
   * 复制分享码
   */
  const handleCopyCode = useCallback(async () => {
    if (!shareResult) return;

    try {
      await copyCode(shareResult.code);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [shareResult, copyCode]);

  // ==================== 重试操作 ====================

  /**
   * 重新生成分享链接
   */
  const handleRetry = useCallback(async () => {
    await generateShare();
  }, [generateShare]);

  // ==================== 关闭模态框 ====================

  /**
   * 关闭模态框并重置所有状态
   */
  const handleClose = useCallback(() => {
    closeModal('sharePrompt');

    // 延迟重置状态，避免关闭动画时看到状态变化
    setTimeout(() => {
      setShareResult(null);
      setError(null);
      setShareState('idle');
    }, 300);
  }, [closeModal]);

  // ==================== 副作用：自动生成分享链接 ====================

  /**
   * 当模态框打开且没有分享结果时，自动生成分享链接
   */
  useEffect(() => {
    if (isOpen && prompt && !shareResult && shareState === 'idle') {
      generateShare();
    }
  }, [isOpen, prompt, shareResult, shareState, generateShare]);

  // ==================== 返回值 ====================

  return {
    // 状态
    isLoading,
    error,
    shareResult,
    shareState,

    // 复制状态
    isUrlCopied,
    isCodeCopied,

    // 处理器（全部使用 useCallback 优化）
    generateShare,
    handleCopyUrl,
    handleCopyCode,
    handleClose,
    handleRetry,
  };
}
