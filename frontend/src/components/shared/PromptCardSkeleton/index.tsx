/**
 * PromptCardSkeleton 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React from 'react';
import { cn } from '@/utils';
import { usePromptCardSkeleton, usePromptGridSkeleton } from './usePromptCardSkeleton';
import type { PromptCardSkeletonProps, PromptGridSkeletonProps } from './types';
import styles from './index.module.css';

/**
 * PromptCardSkeleton - 提示词卡片骨架屏
 */
export const PromptCardSkeleton = React.memo<PromptCardSkeletonProps>(({
  viewMode = 'grid',
  className,
}) => {
  const { isListView } = usePromptCardSkeleton({ viewMode });

  // ==================== 列表视图骨架 ====================
  if (isListView) {
    return (
      <div className={cn(styles.listCard, className)}>
        {/* 图标骨架 */}
        <div className={styles.listIconSkeleton} aria-hidden="true" />

        {/* 内容骨架 */}
        <div className={styles.listContent}>
          {/* 标题和标签行 */}
          <div className={styles.listTopRow}>
            <div className={styles.listTitleSkeleton} aria-hidden="true" />
            <div className={styles.listBadgeGroup}>
              <div className={styles.listBadgeSkeleton} aria-hidden="true" />
              <div className={styles.listBadgeSkeleton} aria-hidden="true" />
            </div>
          </div>

          {/* 描述区域 */}
          <div className={styles.listDescriptionArea}>
            <div
              className={cn(styles.listDescriptionLine, styles.full)}
              aria-hidden="true"
            />
            <div
              className={cn(styles.listDescriptionLine, styles.partial)}
              aria-hidden="true"
            />
          </div>

          {/* 底部信息 */}
          <div className={styles.listFooter}>
            <div className={styles.listFooterLeft}>
              <div
                className={cn(styles.listFooterSkeleton, styles.sm)}
                aria-hidden="true"
              />
              <div
                className={cn(styles.listFooterSkeleton, styles.md)}
                aria-hidden="true"
              />
            </div>
            <div
              className={cn(styles.listFooterSkeleton, styles.lg)}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    );
  }

  // ==================== 网格视图骨架 ====================
  return (
    <div className={cn(styles.gridCard, className)}>
      {/* 头部：图标和操作按钮 */}
      <div className={styles.gridHeader}>
        <div className={styles.gridIconSkeleton} aria-hidden="true" />
        <div className={styles.gridActionGroup}>
          <div className={styles.gridActionSkeleton} aria-hidden="true" />
          <div className={styles.gridActionSkeleton} aria-hidden="true" />
        </div>
      </div>

      {/* 标题区域 */}
      <div className={styles.gridTitleArea}>
        <div className={styles.gridTitleSkeleton} aria-hidden="true" />
        <div className={styles.gridSubtitleSkeleton} aria-hidden="true" />
      </div>

      {/* 描述区域 */}
      <div className={styles.gridDescriptionArea}>
        <div
          className={cn(styles.gridDescriptionLine, styles.full)}
          aria-hidden="true"
        />
        <div
          className={cn(styles.gridDescriptionLine, styles.medium)}
          aria-hidden="true"
        />
        <div
          className={cn(styles.gridDescriptionLine, styles.short)}
          aria-hidden="true"
        />
      </div>

      {/* 标签区域 */}
      <div className={styles.gridTagArea}>
        <div
          className={cn(styles.gridTagSkeleton, styles.sm)}
          aria-hidden="true"
        />
        <div
          className={cn(styles.gridTagSkeleton, styles.md)}
          aria-hidden="true"
        />
        <div
          className={cn(styles.gridTagSkeleton, styles.lg)}
          aria-hidden="true"
        />
      </div>

      {/* 底部元信息 */}
      <div className={styles.gridFooter}>
        <div
          className={cn(styles.gridFooterSkeleton, styles.left)}
          aria-hidden="true"
        />
        <div
          className={cn(styles.gridFooterSkeleton, styles.right)}
          aria-hidden="true"
        />
      </div>
    </div>
  );
});

PromptCardSkeleton.displayName = 'PromptCardSkeleton';

/**
 * PromptGridSkeleton - 多个卡片骨架的网格/列表
 */
export const PromptGridSkeleton = React.memo<PromptGridSkeletonProps>(({
  count = 6,
  viewMode = 'grid',
  className,
}) => {
  const { containerStyleKey, items } = usePromptGridSkeleton({ count, viewMode });

  return (
    <div className={cn(styles[containerStyleKey], className)}>
      {items.map((index) => (
        <PromptCardSkeleton key={index} viewMode={viewMode} />
      ))}
    </div>
  );
});

PromptGridSkeleton.displayName = 'PromptGridSkeleton';

// 导出
export type { ViewMode, PromptCardSkeletonProps, PromptGridSkeletonProps } from './types';
