/**
 * Skeleton Component
 * 骨架屏基础组件，用于展示加载状态
 */

import React from 'react';
import { cn } from '@/utils';

export interface SkeletonProps {
  /**
   * 骨架形状变体
   */
  variant?: 'text' | 'circular' | 'rectangular';
  /**
   * 宽度
   */
  width?: string | number;
  /**
   * 高度
   */
  height?: string | number;
  /**
   * 动画效果
   */
  animation?: 'pulse' | 'wave' | 'none';
  /**
   * 自定义类名
   */
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
}) => {
  // 变体样式
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  // 动画样式
  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  // 默认尺寸
  const defaultSize = {
    text: { width: '100%', height: '1em' },
    circular: { width: '40px', height: '40px' },
    rectangular: { width: '100%', height: '200px' },
  };

  const finalWidth = width ?? defaultSize[variant].width;
  const finalHeight = height ?? defaultSize[variant].height;

  const style = {
    width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
    height: typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight,
  };

  return (
    <div
      className={cn(
        'bg-theme-border',
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
};

/**
 * 预设的骨架组件
 */

// 文本骨架
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
};

// 头像骨架
export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className,
}) => {
  return <Skeleton variant="circular" width={size} height={size} className={className} />;
};

// 卡片骨架
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('p-4 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar />
        <div className="flex-1">
          <Skeleton width="40%" height="16px" className="mb-2" />
          <Skeleton width="60%" height="14px" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex gap-2">
        <Skeleton width="60px" height="24px" />
        <Skeleton width="80px" height="24px" />
      </div>
    </div>
  );
};
