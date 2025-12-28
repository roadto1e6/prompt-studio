/**
 * Badge 组件类型定义
 */

import type { BadgeVariant, BadgeSize } from '@/styles/variants';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
}
