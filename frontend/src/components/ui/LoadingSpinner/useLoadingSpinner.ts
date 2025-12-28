/**
 * LoadingSpinner 组件逻辑 Hook
 */

import { useMemo } from 'react';
import type { LoadingSize, LoadingVariant } from './types';

export interface UseLoadingSpinnerOptions {
  size?: LoadingSize;
  variant?: LoadingVariant;
}

export interface UseLoadingSpinnerReturn {
  sizeClass: string;
}

export function useLoadingSpinner(options: UseLoadingSpinnerOptions): UseLoadingSpinnerReturn {
  const { size = 'md', variant = 'spinner' } = options;

  const sizeClass = useMemo(() => {
    if (variant === 'dots') return '';

    const sizeClasses = {
      sm: 'spinnerSm',
      md: 'spinnerMd',
      lg: 'spinnerLg',
      xl: 'spinnerXl',
    };
    return sizeClasses[size];
  }, [size, variant]);

  return {
    sizeClass,
  };
}
