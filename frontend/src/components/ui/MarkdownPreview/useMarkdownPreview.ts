// 文件路径: frontend/src/components/ui/MarkdownPreview/useMarkdownPreview.ts

/**
 * MarkdownPreview 逻辑层
 * Headless Hook：封装所有状态和处理逻辑
 */

import { useMemo } from 'react';
import type { UseMarkdownPreviewProps, UseMarkdownPreviewReturn } from './types';

/**
 * MarkdownPreview Headless Hook
 *
 * @description
 * 封装 Markdown 内容的处理逻辑。
 * 采用 Headless UI 模式，视图层只需调用返回的状态。
 *
 * @param props - Hook 参数
 * @returns Hook 返回值
 */
export function useMarkdownPreview(props: UseMarkdownPreviewProps): UseMarkdownPreviewReturn {
  const { content } = props;

  /**
   * 处理后的内容
   * 使用 useMemo 缓存，仅在 content 变化时重新计算
   */
  const processedContent = useMemo(() => {
    if (!content) return '';
    // 去除首尾空白
    return content.trim();
  }, [content]);

  /**
   * 判断内容是否为空
   */
  const isEmpty = useMemo(() => {
    return !processedContent || processedContent.length === 0;
  }, [processedContent]);

  return {
    processedContent,
    isEmpty,
  };
}
