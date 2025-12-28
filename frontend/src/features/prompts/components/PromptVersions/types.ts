// 文件路径: frontend/src/features/prompts/components/PromptVersions/types.ts

/**
 * PromptVersions 类型定义
 */

import type { PromptVersion } from '@/types';

/**
 * 组件 Props
 */
export interface PromptVersionsProps {
  className?: string;
}

/**
 * Diff 行类型
 */
export interface DiffLine {
  type: 'same' | 'added' | 'removed';
  text: string;
}

/**
 * 版本 Diff 统计
 */
export interface VersionDiffStats {
  added: number;
  removed: number;
}

/**
 * Hook 返回类型
 */
export interface UsePromptVersionsReturn {
  // 状态
  prompt: ReturnType<any> | null;
  activeVersions: PromptVersion[];
  deletedVersions: PromptVersion[];
  versionDiffs: Map<string, VersionDiffStats>;
  viewingVersion: PromptVersion | null;
  showDiff: boolean;
  copied: boolean;
  showDeletedVersions: boolean;
  t: any;

  // 处理器
  setViewingVersion: (version: PromptVersion | null) => void;
  setShowDiff: (show: boolean) => void;
  setShowDeletedVersions: (show: boolean) => void;
  handleRestore: (versionId: string, versionNumber: string) => void;
  handleDelete: (versionId: string, versionNumber: string) => void;
  handleRestoreDeleted: (versionId: string, versionNumber: string) => void;
  handlePermanentDelete: (versionId: string, versionNumber: string) => void;
  handleCopy: (text: string) => Promise<void>;
  handleCloseModal: () => void;
  toggleDiff: () => void;
}

/**
 * 版本模态框 Props
 */
export interface VersionModalProps {
  viewingVersion: PromptVersion | null;
  versions: PromptVersion[];
  currentVersionId: string;
  showDiff: boolean;
  copied: boolean;
  versionDiffs: Map<string, VersionDiffStats>;
  t: any;
  onClose: () => void;
  onToggleDiff: () => void;
  onRestore: (versionId: string, versionNumber: string) => void;
  onCopy: (text: string) => void;
}
