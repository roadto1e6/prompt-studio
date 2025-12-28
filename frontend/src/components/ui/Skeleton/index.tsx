/**
 * Skeleton 组件 - 视图层
 * 骨架屏组件集合
 */

import { memo } from 'react';
import { cn } from '@/utils';
import { useSkeleton } from './useSkeleton';
import type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonCardProps,
} from './types';
import styles from './index.module.css';

// ============ Skeleton 主组件 ============

export const Skeleton = memo<SkeletonProps>(({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
}) => {
  const { variantClass, animationClass, style } = useSkeleton({
    variant,
    animation,
    width,
    height,
  });

  return (
    <div
      className={cn(styles.skeleton, styles[variantClass], styles[animationClass], className)}
      style={style}
      aria-hidden="true"
    />
  );
});

Skeleton.displayName = 'Skeleton';

// ============ SkeletonText 组件 ============

export const SkeletonText = memo<SkeletonTextProps>(({
  lines = 1,
  className,
  lineHeight = '1em',
}) => (
  <div className={cn(styles.textContainer, className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '80%' : '100%'}
        height={lineHeight}
      />
    ))}
  </div>
));

SkeletonText.displayName = 'SkeletonText';

// ============ SkeletonAvatar 组件 ============

export const SkeletonAvatar = memo<SkeletonAvatarProps>(({
  size = 40,
  className,
}) => (
  <Skeleton variant="circular" width={size} height={size} className={className} />
));

SkeletonAvatar.displayName = 'SkeletonAvatar';

// ============ SkeletonCard 组件 ============

export const SkeletonCard = memo<SkeletonCardProps>(({
  className,
  showAvatar = true,
  textLines = 3,
}) => (
  <div className={cn(styles.cardContainer, className)}>
    <div className={styles.cardHeader}>
      {showAvatar && <SkeletonAvatar />}
      <div className={styles.cardHeaderContent}>
        <Skeleton width="40%" height="16px" className={styles.cardHeaderTitle} />
        <Skeleton width="60%" height="14px" />
      </div>
    </div>
    <SkeletonText lines={textLines} />
    <div className={styles.cardActions}>
      <Skeleton width="60px" height="24px" />
      <Skeleton width="80px" height="24px" />
    </div>
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

// 导出
export type {
  SkeletonVariant,
  SkeletonAnimation,
  SkeletonProps,
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonCardProps,
} from './types';
export default Skeleton;
