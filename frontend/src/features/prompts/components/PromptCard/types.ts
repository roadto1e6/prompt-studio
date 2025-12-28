// 文件路径: frontend/src/features/prompts/components/PromptCard/types.ts

/**
 * PromptCard 类型定义
 * 契约层：先设计数据结构，后写逻辑
 */

import type { Prompt, Category, ViewMode } from '@/types';
import type { LucideIcon } from 'lucide-react';

/**
 * 分类配置项
 */
export interface CategoryConfig {
  /** 分类图标组件 */
  icon: LucideIcon;
  /** 文本颜色类名 */
  color: string;
  /** 背景颜色类名 */
  bgColor: string;
}

/**
 * 分类配置映射表
 */
export type CategoryConfigMap = Record<Category, CategoryConfig>;

/**
 * PromptCard 组件 Props
 */
export interface PromptCardProps {
  /** Prompt 数据对象 */
  prompt: Prompt;
  /** 是否被选中 */
  isSelected: boolean;
  /** 卡片点击处理器 */
  onClick: () => void;
  /** 视图模式（网格/列表） */
  viewMode: ViewMode;
  /** 切换收藏状态处理器 */
  onToggleFavorite: (id: string) => void;
  /** 删除处理器 */
  onDelete: (id: string) => void;
  /** 恢复处理器（可选，回收站视图时使用） */
  onRestore?: (id: string) => void;
  /** 是否为回收站视图 */
  isTrashView?: boolean;
}

/**
 * Hook 返回的状态和方法
 */
export interface UsePromptCardReturn {
  /** 当前分类配置 */
  categoryConfig: CategoryConfig;
  /** 国际化文本 */
  t: any;

  /** 处理卡片点击 */
  handleCardClick: () => void;
  /** 处理收藏按钮点击 */
  handleFavoriteClick: (e: React.MouseEvent) => void;
  /** 处理删除按钮点击 */
  handleDeleteClick: (e: React.MouseEvent) => void;
  /** 处理恢复按钮点击 */
  handleRestoreClick: (e: React.MouseEvent) => void;

  /** 是否显示收藏按钮（用于动态判断） */
  shouldShowFavorite: boolean;
  /** 是否显示删除按钮 */
  shouldShowDelete: boolean;
  /** 是否显示恢复按钮 */
  shouldShowRestore: boolean;
}

/**
 * Hook 参数
 */
export interface UsePromptCardParams {
  /** Prompt 数据对象 */
  prompt: Prompt;
  /** 卡片点击处理器 */
  onClick: () => void;
  /** 切换收藏状态处理器 */
  onToggleFavorite: (id: string) => void;
  /** 删除处理器 */
  onDelete: (id: string) => void;
  /** 恢复处理器（可选） */
  onRestore?: (id: string) => void;
  /** 是否为回收站视图 */
  isTrashView?: boolean;
}
