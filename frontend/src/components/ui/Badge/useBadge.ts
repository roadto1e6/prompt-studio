/**
 * Badge 组件逻辑 Hook
 */

import { useMemo } from 'react';
import { badgeVariants, badgeSizes } from '@/styles/variants';
import type { BadgeVariant, BadgeSize } from '@/styles/variants';

export interface UseBadgeOptions {
  variant?: BadgeVariant;
  size?: BadgeSize;
  onClick?: () => void;
}

export interface UseBadgeReturn {
  variantClasses: string;
  sizeClasses: string;
  isClickable: boolean;
  removeIconClass: string;
}

export function useBadge(options: UseBadgeOptions): UseBadgeReturn {
  const { variant = 'default', size = 'sm', onClick } = options;

  const variantClasses = useMemo(() => badgeVariants[variant].base, [variant]);
  const sizeClasses = useMemo(() => badgeSizes[size].base, [size]);
  const isClickable = !!onClick;

  const removeIconClass = useMemo(() => {
    const iconClasses = {
      sm: 'removeIconSm',
      md: 'removeIconMd',
      lg: 'removeIconLg',
    };
    return iconClasses[size];
  }, [size]);

  return {
    variantClasses,
    sizeClasses,
    isClickable,
    removeIconClass,
  };
}
