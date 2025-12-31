// 文件路径: frontend/src/components/ui/MarkdownPreview/types.ts

/**
 * MarkdownPreview 组件类型定义
 */

export interface MarkdownPreviewProps {
  /** Markdown 内容 */
  content: string;
  /** 自定义容器类名 */
  className?: string;
  /** 最大高度（支持滚动） */
  maxHeight?: string;
  /** 是否使用紧凑样式 */
  compact?: boolean;
}

export interface UseMarkdownPreviewProps {
  content: string;
}

export interface UseMarkdownPreviewReturn {
  /** 处理后的内容 */
  processedContent: string;
  /** 内容是否为空 */
  isEmpty: boolean;
}
