// 文件路径: frontend/src/features/prompts/components/PromptDetailPanel/types.ts

/**
 * PromptDetailPanel 类型定义
 */

import type { Prompt, Collection } from '@/types';

/**
 * 组件 Props
 */
export interface PromptDetailPanelProps {
  className?: string;
}

/**
 * Hook 返回类型
 */
export interface UsePromptDetailPanelReturn {
  // 状态
  prompt: Prompt | null;
  collection: Collection | null;
  isInTrash: boolean;
  localTitle: string;
  detailPanelOpen: boolean;
  activeTab: string;
  tabs: Array<{ id: string; label: string }>;
  categoryColors: Record<string, string>;
  t: any;

  // 处理器
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitleBlur: () => void;
  handleRestore: () => void;
  handlePermanentDelete: () => void;
  handleShare: () => void;
  handleClose: () => void;
  handleTabChange: (tab: string) => void;
}
