// 文件路径: frontend/src/features/prompts/components/PromptEditor/types.ts

/**
 * PromptEditor 类型定义
 */

import type { Prompt } from '@/types';

/**
 * 组件 Props
 */
export interface PromptEditorProps {
  className?: string;
}

/**
 * 版本类型
 */
export type VersionType = 'major' | 'minor';

/**
 * Hook 返回类型
 */
export interface UsePromptEditorReturn {
  // 状态
  prompt: Prompt | null;
  systemPrompt: string;
  userTemplate: string;
  isDirty: boolean;
  copied: boolean;
  showVersionModal: boolean;
  changeNote: string;
  versionType: VersionType;
  charCount: number;
  tokenCount: number;
  currentVersion: { versionNumber: string } | null;
  t: any;

  // 处理器
  handleSystemPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleUserTemplateChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSave: () => void;
  handleCopy: () => Promise<void>;
  handleCreateVersion: () => Promise<void>;
  handleSkipVersion: () => void;
  setChangeNote: (note: string) => void;
  setVersionType: (type: VersionType) => void;
  setShowVersionModal: (show: boolean) => void;

  // 版本号计算
  getNextVersionNumber: (type: VersionType) => string;
  getCurrentVersionNumber: () => string;
}
