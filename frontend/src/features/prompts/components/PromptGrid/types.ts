// 文件路径: frontend/src/features/prompts/components/PromptGrid/types.ts

/**
 * PromptGrid 类型定义
 * 契约层：先设计数据结构，后写逻辑
 */

import type { Prompt } from '@/types';

/**
 * 空状态内容配置
 */
export interface EmptyStateConfig {
  /** 标题文本 */
  title: string;
  /** 描述文本 */
  description: string;
  /** 是否显示创建按钮 */
  showAction: boolean;
}

/**
 * 网格布局配置
 */
export interface GridLayoutConfig {
  /** 是否为网格模式（vs 列表模式） */
  isGridMode: boolean;
  /** 详情面板是否打开（影响列数） */
  isDetailPanelOpen: boolean;
  /** 网格列数类名 */
  gridColsClass: string;
  /** 网格间距类名 */
  gridGapClass: string;
}

/**
 * 分页状态
 */
export interface PaginationState {
  /** 当前页码（从 1 开始） */
  currentPage: number;
  /** 每页显示数量 */
  pageSize: number;
  /** 总条目数 */
  totalItems: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有上一页 */
  hasPrevious: boolean;
  /** 是否有下一页 */
  hasNext: boolean;
}

/**
 * 加载状态类型
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Hook 返回的状态和方法
 */
export interface UsePromptGridReturn {
  /** 当前显示的 prompts 列表（已过滤、排序、分页） */
  displayedPrompts: Prompt[];
  /** 原始 prompts 列表（已过滤、排序，未分页） */
  filteredPrompts: Prompt[];
  /** 加载状态 */
  loadingState: LoadingState;
  /** 错误信息 */
  errorMessage: string | null;
  /** 是否为空列表 */
  isEmpty: boolean;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 空状态配置 */
  emptyStateConfig: EmptyStateConfig;
  /** 网格布局配置 */
  gridLayoutConfig: GridLayoutConfig;
  /** 分页状态 */
  paginationState: PaginationState;

  /** 选择 Prompt */
  handleSelectPrompt: (id: string) => void;
  /** 删除 Prompt */
  handleDelete: (id: string) => void;
  /** 切换收藏 */
  handleToggleFavorite: (id: string) => void;
  /** 从回收站恢复 */
  handleRestore: (id: string) => void;
  /** 创建新 Prompt */
  handleCreatePrompt: () => void;
  /** 切换页码 */
  handlePageChange: (page: number) => void;
  /** 重试加载 */
  handleRetry: () => void;
}

/**
 * 组件 Props
 */
export interface PromptGridProps {
  /** 自定义类名（可选） */
  className?: string;
  /** 是否启用虚拟滚动（可选，用于大列表优化） */
  enableVirtualScroll?: boolean;
  /** 每页显示数量（可选，默认 20） */
  pageSize?: number;
}

/**
 * 虚拟滚动配置
 */
export interface VirtualScrollConfig {
  /** 是否启用 */
  enabled: boolean;
  /** 每项高度（px） */
  itemHeight: number;
  /** 缓冲区项目数 */
  overscan: number;
}
