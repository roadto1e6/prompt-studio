// 文件路径: frontend/src/components/ui/MarkdownPreview/index.tsx

/**
 * MarkdownPreview 视图层
 * 仅负责声明式 UI 结构
 */

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils';
import { useMarkdownPreview } from './useMarkdownPreview';
import type { MarkdownPreviewProps } from './types';
import styles from './index.module.css';

/**
 * MarkdownPreview 组件
 *
 * @description
 * 渲染 Markdown 内容为格式化的 HTML。
 * 支持 GitHub Flavored Markdown (表格、任务列表、删除线等)。
 *
 * @example
 * ```tsx
 * <MarkdownPreview content="# Hello\n**World**" />
 * <MarkdownPreview content={systemPrompt} compact maxHeight="200px" />
 * ```
 */
const MarkdownPreviewComponent: React.FC<MarkdownPreviewProps> = ({
  content,
  className,
  maxHeight,
  compact = false,
}) => {
  const { processedContent, isEmpty } = useMarkdownPreview({ content });

  if (isEmpty) {
    return (
      <div className={cn(styles.container, styles.empty, className)}>
        No content
      </div>
    );
  }

  return (
    <div
      className={cn(
        styles.container,
        compact && styles.compact,
        maxHeight && styles.scrollable,
        className
      )}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export const MarkdownPreview = memo(MarkdownPreviewComponent);

// 导出类型
export type { MarkdownPreviewProps } from './types';
export { useMarkdownPreview } from './useMarkdownPreview';
export default MarkdownPreview;
