// 文件路径: frontend/src/components/shared/PromptCardSkeleton/types.ts

/**
 * PromptCardSkeleton 类型定义
 * 契约层：提示词卡片骨架屏的类型契约
 */

/**
 * 视图模式
 */
export type ViewMode = 'grid' | 'list';

/**
 * PromptCardSkeleton Props
 * 单个提示词卡片骨架屏的属性
 */
export interface PromptCardSkeletonProps {
  /**
   * 视图模式
   * @default 'grid'
   */
  viewMode?: ViewMode;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * PromptGridSkeleton Props
 * 多个卡片骨架的网格/列表属性
 */
export interface PromptGridSkeletonProps {
  /**
   * 骨架数量
   * @default 6
   */
  count?: number;

  /**
   * 视图模式
   * @default 'grid'
   */
  viewMode?: ViewMode;

  /**
   * 自定义类名
   */
  className?: string;
}
