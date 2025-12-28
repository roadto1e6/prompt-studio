// 文件路径: frontend/src/features/prompts/components/PromptGrid/usePromptGrid.ts

/**
 * PromptGrid 逻辑层
 * Headless UI Hook：封装所有状态、副作用和处理器
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { usePromptStore, useUIStore, useI18nStore } from '@/stores';
import type {
  UsePromptGridReturn,
  EmptyStateConfig,
  GridLayoutConfig,
  PaginationState,
  LoadingState,
  PromptGridProps,
} from './types';

/**
 * 默认配置
 */
const DEFAULT_PAGE_SIZE = 20;
// 虚拟滚动配置（预留，暂未使用）
// const VIRTUAL_SCROLL_ITEM_HEIGHT = 224;
// const VIRTUAL_SCROLL_OVERSCAN = 3;

/**
 * PromptGrid Headless Hook
 *
 * @description
 * 封装所有业务逻辑：过滤、排序、分页、状态管理、事件处理。
 * 采用 Headless UI 模式，视图层只需调用返回的 handlers 和 state。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：usePromptGrid.ts（本文件）
 * - 视图层：index.tsx
 *
 * @example
 * ```tsx
 * const grid = usePromptGrid({ pageSize: 20 });
 * return (
 *   <div className={grid.gridLayoutConfig.gridColsClass}>
 *     {grid.displayedPrompts.map(prompt => <PromptCard key={prompt.id} prompt={prompt} />)}
 *   </div>
 * );
 * ```
 */
export function usePromptGrid(props: PromptGridProps = {}): UsePromptGridReturn {
  const { pageSize = DEFAULT_PAGE_SIZE, enableVirtualScroll = false } = props;

  // ==================== Store 依赖 ====================
  const {
    prompts,
    getFilteredPrompts,
    setActivePrompt,
    viewMode,
    toggleFavorite,
    moveToTrash,
    permanentDelete,
    restoreFromTrash,
    filter,
    categoryFilter,
    collectionFilter,
    searchQuery,
    sortBy,
    sortOrder,
    isLoading: storeIsLoading,
    initialized,
    error: storeError,
    reset,
    initialize,
  } = usePromptStore();
  const { openModal, openDetailPanel, detailPanelOpen, showConfirm } = useUIStore();
  const { t } = useI18nStore();

  // ==================== Client State ====================
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * 派生的加载状态：根据 store 状态计算
   * - 'loading': 正在加载或未初始化
   * - 'error': store 有错误
   * - 'success': 其他情况
   */
  const loadingState: LoadingState = useMemo(() => {
    if (storeError) return 'error';
    if (storeIsLoading || !initialized) return 'loading';
    return 'success';
  }, [storeError, storeIsLoading, initialized]);

  /**
   * 错误消息：直接使用 store 的 error
   */
  const errorMessage = storeError;

  // ==================== Refs ====================
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ==================== 数据获取和过滤 ====================

  /**
   * 获取过滤后的 prompts
   * 来自 Store 的 getFilteredPrompts，已经应用了所有过滤条件
   * 依赖所有过滤相关状态以确保正确响应变化
   *
   * 注意：useMemo 必须是纯函数，不能有副作用（如 setState）
   */
  const filteredPrompts = useMemo(() => {
    try {
      return getFilteredPrompts();
    } catch (error) {
      console.error('Error filtering prompts:', error);
      return [];
    }
  }, [getFilteredPrompts, prompts, filter, categoryFilter, collectionFilter, searchQuery, sortBy, sortOrder]);


  // ==================== 分页逻辑 ====================

  /**
   * 计算分页状态
   */
  const paginationState = useMemo<PaginationState>(() => {
    const totalItems = filteredPrompts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    // 确保当前页在有效范围内
    const validPage = Math.min(Math.max(1, currentPage), totalPages);

    return {
      currentPage: validPage,
      pageSize,
      totalItems,
      totalPages,
      hasPrevious: validPage > 1,
      hasNext: validPage < totalPages,
    };
  }, [filteredPrompts.length, pageSize, currentPage]);

  /**
   * 当前页显示的 prompts（分页后）
   */
  const displayedPrompts = useMemo(() => {
    // 如果启用虚拟滚动，不进行分页（虚拟滚动自己处理）
    if (enableVirtualScroll) {
      return filteredPrompts;
    }

    const startIndex = (paginationState.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPrompts.slice(startIndex, endIndex);
  }, [filteredPrompts, paginationState.currentPage, pageSize, enableVirtualScroll]);

  /**
   * 当过滤条件变化时，重置到第一页
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, filteredPrompts.length]);

  // ==================== 派生状态 ====================

  /**
   * 加载状态：store 正在加载或尚未初始化时显示加载状态
   */
  const isLoading = storeIsLoading || !initialized;

  /**
   * 空状态：仅在已初始化且过滤后无数据时显示空状态
   */
  const isEmpty = initialized && filteredPrompts.length === 0;

  /**
   * 空状态配置
   * 根据当前过滤器类型返回不同的空状态文案
   */
  const emptyStateConfig = useMemo<EmptyStateConfig>(() => {
    if (filter === 'favorites') {
      return {
        title: t.promptGrid?.emptyFavoritesTitle || 'No Favorites Yet',
        description: t.promptGrid?.emptyFavoritesDescription || 'Star your favorite prompts to see them here.',
        showAction: false,
      };
    }

    if (filter === 'trash') {
      return {
        title: t.promptGrid?.emptyTrashTitle || 'Trash is Empty',
        description: t.promptGrid?.emptyTrashDescription || 'Deleted prompts will appear here.',
        showAction: false,
      };
    }

    return {
      title: t.promptGrid?.emptyTitle || 'No Prompts Yet',
      description: t.promptGrid?.emptyDescription || 'Create your first prompt to get started.',
      showAction: true,
    };
  }, [filter, t]);

  /**
   * 网格布局配置
   * 根据 viewMode 和 detailPanelOpen 计算网格类名
   */
  const gridLayoutConfig = useMemo<GridLayoutConfig>(() => {
    const isGridMode = viewMode === 'grid';
    const isDetailPanelOpen = detailPanelOpen;

    let gridColsClass = '';
    if (isGridMode) {
      gridColsClass = isDetailPanelOpen
        ? 'grid-cols-1 lg:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }

    return {
      isGridMode,
      isDetailPanelOpen,
      gridColsClass,
      gridGapClass: isGridMode ? 'gap-5' : 'gap-3',
    };
  }, [viewMode, detailPanelOpen]);

  // ==================== 事件处理器 ====================

  /**
   * 选择 Prompt
   * 设置为当前激活项并打开详情面板
   */
  const handleSelectPrompt = useCallback((id: string) => {
    setActivePrompt(id);
    openDetailPanel();
  }, [setActivePrompt, openDetailPanel]);

  /**
   * 切换收藏状态
   */
  const handleToggleFavorite = useCallback((id: string) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  /**
   * 删除 Prompt
   * 根据当前是否在回收站显示不同的确认对话框
   */
  const handleDelete = useCallback((id: string) => {
    const prompt = filteredPrompts.find(p => p.id === id);
    if (!prompt) return;

    const isTrash = filter === 'trash';

    showConfirm({
      title: isTrash
        ? t.confirm?.deletePermanently?.title || 'Delete Permanently?'
        : t.confirm?.moveToTrash?.title || 'Move to Trash?',
      message: isTrash
        ? `${t.confirm?.deletePermanently?.message?.replace('this prompt', `"${prompt.title}"`) || `Are you sure you want to permanently delete "${prompt.title}"? This action cannot be undone.`}`
        : `${t.confirm?.moveToTrash?.message?.replace('this prompt', `"${prompt.title}"`) || `Move "${prompt.title}" to trash?`}`,
      confirmText: isTrash
        ? t.confirm?.deletePermanently?.confirmText || 'Delete'
        : t.metadata?.moveToTrash || 'Move to Trash',
      variant: 'danger',
      onConfirm: () => {
        if (isTrash) {
          permanentDelete(id);
        } else {
          moveToTrash(id);
        }
      },
    });
  }, [filteredPrompts, filter, t, showConfirm, permanentDelete, moveToTrash]);

  /**
   * 从回收站恢复
   */
  const handleRestore = useCallback((id: string) => {
    restoreFromTrash(id);
  }, [restoreFromTrash]);

  /**
   * 创建新 Prompt
   */
  const handleCreatePrompt = useCallback(() => {
    openModal('createPrompt');
  }, [openModal]);

  /**
   * 切换页码
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * 重试加载
   * 重置 store 状态并重新初始化
   */
  const handleRetry = useCallback(() => {
    reset();
    initialize();
    setCurrentPage(1);
  }, [reset, initialize]);

  // ==================== 返回值 ====================

  return {
    // 数据状态
    displayedPrompts,
    filteredPrompts,
    loadingState,
    errorMessage,
    isEmpty,
    isLoading,
    emptyStateConfig,
    gridLayoutConfig,
    paginationState,

    // 事件处理器（全部使用 useCallback 优化）
    handleSelectPrompt,
    handleDelete,
    handleToggleFavorite,
    handleRestore,
    handleCreatePrompt,
    handlePageChange,
    handleRetry,
  };
}
