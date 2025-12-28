// 文件路径: frontend/src/features/prompts/components/PromptGrid/index.tsx

/**
 * PromptGrid 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePromptStore } from '@/stores';
import { EmptyState } from '@/components/shared';
import { Button } from '@/components/ui';
import { PromptCard } from '../PromptCard';
import { cn } from '@/utils';
import { usePromptGrid } from './usePromptGrid';
import type { PromptGridProps } from './types';
import styles from './index.module.css';

/**
 * PromptGrid - Prompt 网格/列表视图主组件
 *
 * @description
 * 采用 Headless UI 模式的生产级组件。
 * 支持响应式网格/列表布局、分页、加载状态、错误处理、空状态。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：usePromptGrid.ts（Headless Hook）
 * - 视图层：index.tsx（本文件）
 *
 * @performance
 * - 使用 React.memo 防止不必要的重渲染
 * - 所有 handlers 已在 Hook 中使用 useCallback 优化
 * - 派生状态使用 useMemo 缓存
 * - 支持虚拟滚动（大列表优化，可选）
 *
 * @features
 * - 响应式网格/列表布局
 * - 分页支持
 * - 加载/错误/空状态处理
 * - 骨架屏加载效果
 * - 流畅的动画过渡
 * - 无障碍支持
 *
 * @example
 * ```tsx
 * // 默认用法
 * <PromptGrid />
 *
 * // 自定义分页大小
 * <PromptGrid pageSize={30} />
 *
 * // 启用虚拟滚动（大列表）
 * <PromptGrid enableVirtualScroll />
 * ```
 */
export const PromptGrid = React.memo<PromptGridProps>((props) => {
  // ==================== Hook 状态和方法 ====================
  const grid = usePromptGrid(props);
  const { activePromptId, viewMode, filter } = usePromptStore();

  // ==================== 骨架屏数量计算 ====================
  const skeletonCount = useMemo(() => {
    if (grid.gridLayoutConfig.isDetailPanelOpen) {
      return 4; // 紧凑布局显示 4 个骨架屏
    }
    return 8; // 默认布局显示 8 个骨架屏
  }, [grid.gridLayoutConfig.isDetailPanelOpen]);

  // ==================== 分页页码列表 ====================
  const pageNumbers = useMemo(() => {
    const { currentPage, totalPages } = grid.paginationState;
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      // 总页数 <= 7，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 总页数 > 7，显示省略号
      if (currentPage <= 3) {
        // 当前页在前面
        pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 当前页在后面
        pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // 当前页在中间
        pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }

    return pages;
  }, [grid.paginationState]);

  // ==================== 渲染逻辑 ====================

  /**
   * 加载状态
   */
  if (grid.isLoading) {
    return (
      <div className={styles.container}>
        <div className={cn(
          styles.skeletonGrid,
          grid.gridLayoutConfig.isDetailPanelOpen ? styles.compactLayout : styles.defaultLayout
        )}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonHeader}>
                <div className={styles.skeletonIcon} />
                <div className={styles.skeletonActions}>
                  <div className={styles.skeletonAction} />
                  <div className={styles.skeletonAction} />
                </div>
              </div>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonDescription} />
              <div className={styles.skeletonDescriptionShort} />
              <div className={styles.skeletonFooter}>
                <div className={styles.skeletonTag} />
                <div className={styles.skeletonMeta} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /**
   * 错误状态
   */
  if (grid.loadingState === 'error' && grid.errorMessage) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <AlertCircle className={styles.errorIcon} />
            <h3 className={styles.errorTitle}>加载失败</h3>
            <p className={styles.errorMessage}>{grid.errorMessage}</p>
            <div className={styles.errorActions}>
              <Button
                variant="primary"
                size="sm"
                icon={<RefreshCcw className="w-4 h-4" />}
                onClick={grid.handleRetry}
              >
                重试
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 空状态
   */
  if (grid.isEmpty) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyContainer}>
          <EmptyState
            title={grid.emptyStateConfig.title}
            description={grid.emptyStateConfig.description}
            action={grid.emptyStateConfig.showAction ? {
              label: '创建第一个 Prompt',
              onClick: grid.handleCreatePrompt,
            } : undefined}
          />
        </div>
      </div>
    );
  }

  /**
   * 主内容区域
   */
  return (
    <div className={styles.container}>
      {/* 网格/列表容器 */}
      <div
        className={cn(
          grid.gridLayoutConfig.isGridMode
            ? cn(
                styles.gridContainer,
                grid.gridLayoutConfig.isDetailPanelOpen ? styles.compactLayout : styles.defaultLayout
              )
            : styles.listContainer
        )}
      >
        <AnimatePresence mode="popLayout">
          {grid.displayedPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isSelected={activePromptId === prompt.id}
              onClick={() => grid.handleSelectPrompt(prompt.id)}
              viewMode={viewMode}
              onToggleFavorite={grid.handleToggleFavorite}
              onDelete={grid.handleDelete}
              onRestore={grid.handleRestore}
              isTrashView={filter === 'trash'}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* 分页控件 */}
      {grid.paginationState.totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInner}>
            {/* 分页信息 */}
            <div className={styles.paginationInfo}>
              显示 {(grid.paginationState.currentPage - 1) * grid.paginationState.pageSize + 1} -{' '}
              {Math.min(
                grid.paginationState.currentPage * grid.paginationState.pageSize,
                grid.paginationState.totalItems
              )}{' '}
              / 共 {grid.paginationState.totalItems} 项
            </div>

            {/* 分页按钮 */}
            <div className={styles.paginationControls}>
              {/* 上一页 */}
              <button
                className={styles.paginationButton}
                onClick={() => grid.handlePageChange(grid.paginationState.currentPage - 1)}
                disabled={!grid.paginationState.hasPrevious}
                aria-label="上一页"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* 页码按钮 */}
              {pageNumbers.map((page, index) => {
                if (page === 'ellipsis') {
                  return (
                    <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    className={cn(
                      styles.paginationButton,
                      page === grid.paginationState.currentPage && styles.active
                    )}
                    onClick={() => grid.handlePageChange(page)}
                    aria-label={`第 ${page} 页`}
                    aria-current={page === grid.paginationState.currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              })}

              {/* 下一页 */}
              <button
                className={styles.paginationButton}
                onClick={() => grid.handlePageChange(grid.paginationState.currentPage + 1)}
                disabled={!grid.paginationState.hasNext}
                aria-label="下一页"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

PromptGrid.displayName = 'PromptGrid';
