/**
 * Skeleton 组件逻辑 Hook
 */

import { useMemo } from 'react';
import type { SkeletonVariant, SkeletonAnimation } from './types';

export interface UseSkeletonOptions {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
}

export interface UseSkeletonReturn {
  variantClass: string;
  animationClass: string;
  style: React.CSSProperties;
}

export function useSkeleton(options: UseSkeletonOptions): UseSkeletonReturn {
  const { variant = 'text', animation = 'pulse', width, height } = options;

  const variantClass = useMemo(() => {
    const classes = {
      text: 'variantText',
      circular: 'variantCircular',
      rectangular: 'variantRectangular',
    };
    return classes[variant];
  }, [variant]);

  const animationClass = useMemo(() => {
    const classes = {
      pulse: 'animationPulse',
      wave: 'animationWave',
      none: '',
    };
    return classes[animation];
  }, [animation]);

  const defaultSize = useMemo(() => {
    const sizes = {
      text: { width: '100%', height: '1em' },
      circular: { width: '40px', height: '40px' },
      rectangular: { width: '100%', height: '200px' },
    };
    return sizes[variant];
  }, [variant]);

  const finalWidth = width ?? defaultSize.width;
  const finalHeight = height ?? defaultSize.height;

  const style = useMemo(() => ({
    width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
    height: typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight,
  }), [finalWidth, finalHeight]);

  return {
    variantClass,
    animationClass,
    style,
  };
}
