/**
 * PromptCardSkeleton Component
 * 提示词卡片加载骨架
 */

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils';

interface PromptCardSkeletonProps {
  /**
   * 视图模式
   */
  viewMode?: 'grid' | 'list';
  /**
   * 自定义类名
   */
  className?: string;
}

export const PromptCardSkeleton: React.FC<PromptCardSkeletonProps> = ({
  viewMode = 'grid',
  className,
}) => {
  if (viewMode === 'list') {
    // 列表视图骨架
    return (
      <div
        className={cn(
          'flex items-start gap-4 p-4 bg-theme-bg-secondary rounded-lg border border-theme-border',
          className
        )}
      >
        {/* 图标 */}
        <Skeleton variant="circular" width={40} height={40} />

        {/* 内容 */}
        <div className="flex-1 space-y-3">
          {/* 标题和标签 */}
          <div className="flex items-center justify-between gap-4">
            <Skeleton width="200px" height="20px" />
            <div className="flex gap-2">
              <Skeleton width="60px" height="20px" />
              <Skeleton width="60px" height="20px" />
            </div>
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <Skeleton width="100%" height="14px" />
            <Skeleton width="80%" height="14px" />
          </div>

          {/* 底部信息 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Skeleton width="80px" height="18px" />
              <Skeleton width="100px" height="18px" />
            </div>
            <Skeleton width="120px" height="18px" />
          </div>
        </div>
      </div>
    );
  }

  // 网格视图骨架
  return (
    <div
      className={cn(
        'p-5 bg-theme-bg-secondary rounded-lg border border-theme-border space-y-4',
        className
      )}
    >
      {/* 头部：图标和操作 */}
      <div className="flex items-start justify-between">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex gap-2">
          <Skeleton width="24px" height="24px" />
          <Skeleton width="24px" height="24px" />
        </div>
      </div>

      {/* 标题 */}
      <div>
        <Skeleton width="70%" height="20px" className="mb-2" />
        <Skeleton width="50%" height="16px" />
      </div>

      {/* 描述 */}
      <div className="space-y-2">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="90%" height="14px" />
        <Skeleton width="60%" height="14px" />
      </div>

      {/* 标签 */}
      <div className="flex gap-2 flex-wrap">
        <Skeleton width="60px" height="24px" />
        <Skeleton width="80px" height="24px" />
        <Skeleton width="70px" height="24px" />
      </div>

      {/* 底部元信息 */}
      <div className="flex items-center justify-between pt-2 border-t border-theme-border">
        <Skeleton width="100px" height="16px" />
        <Skeleton width="80px" height="16px" />
      </div>
    </div>
  );
};

/**
 * PromptGridSkeleton - 多个卡片骨架的网格/列表
 */
interface PromptGridSkeletonProps {
  /**
   * 骨架数量
   */
  count?: number;
  /**
   * 视图模式
   */
  viewMode?: 'grid' | 'list';
  /**
   * 自定义类名
   */
  className?: string;
}

export const PromptGridSkeleton: React.FC<PromptGridSkeletonProps> = ({
  count = 6,
  viewMode = 'grid',
  className,
}) => {
  const gridClass =
    viewMode === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'
      : 'flex flex-col gap-3';

  return (
    <div className={cn(gridClass, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <PromptCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
};
