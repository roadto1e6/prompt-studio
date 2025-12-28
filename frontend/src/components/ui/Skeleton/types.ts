/**
 * Skeleton 组件类型定义
 */

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  animation?: SkeletonAnimation;
  className?: string;
}

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineHeight?: string | number;
}

export interface SkeletonAvatarProps {
  size?: number;
  className?: string;
}

export interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
  textLines?: number;
}
