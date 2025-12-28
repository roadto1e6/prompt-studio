// 文件路径: frontend/src/features/prompts/components/SharePromptModal/types.ts

/**
 * SharePromptModal 类型定义
 * 契约层：定义分享功能的数据结构
 */

import type { CreateShareResponse } from '@/types';

/**
 * 分享状态类型
 */
export type ShareState = 'idle' | 'loading' | 'success' | 'error';

/**
 * 复制目标类型
 */
export type CopyTarget = 'url' | 'code';

/**
 * Hook 返回的状态和方法
 */
export interface UseSharePromptModalReturn {
  /** 是否正在加载 */
  isLoading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 分享结果数据 */
  shareResult: CreateShareResponse | null;
  /** 当前分享状态 */
  shareState: ShareState;

  /** URL 是否已复制 */
  isUrlCopied: boolean;
  /** 分享码是否已复制 */
  isCodeCopied: boolean;

  /** 生成分享链接 */
  generateShare: () => Promise<void>;
  /** 复制分享链接 */
  handleCopyUrl: () => Promise<void>;
  /** 复制分享码 */
  handleCopyCode: () => Promise<void>;
  /** 关闭弹窗 */
  handleClose: () => void;
  /** 重新生成分享链接 */
  handleRetry: () => Promise<void>;
}

/**
 * 组件 Props
 */
export interface SharePromptModalProps {
  /** 自定义类名（可选） */
  className?: string;
}
