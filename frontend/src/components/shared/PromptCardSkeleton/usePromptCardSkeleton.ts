/**
 * PromptCardSkeleton Hook
 * 提示词卡片骨架屏逻辑层
 */

import { useMemo } from 'react';
import type { ViewMode } from './types';

export interface UsePromptCardSkeletonOptions {
  viewMode?: ViewMode;
}

export interface UsePromptCardSkeletonReturn {
  isListView: boolean;
}

/**
 * usePromptCardSkeleton
 * 单个骨架卡片的逻辑 Hook
 */
export function usePromptCardSkeleton(
  options: UsePromptCardSkeletonOptions
): UsePromptCardSkeletonReturn {
  const { viewMode = 'grid' } = options;

  const isListView = useMemo(() => viewMode === 'list', [viewMode]);

  return {
    isListView,
  };
}

export interface UsePromptGridSkeletonOptions {
  count?: number;
  viewMode?: ViewMode;
}

export interface UsePromptGridSkeletonReturn {
  containerStyleKey: 'gridContainer' | 'listContainer';
  items: number[];
}

/**
 * usePromptGridSkeleton
 * 骨架网格的逻辑 Hook
 */
export function usePromptGridSkeleton(
  options: UsePromptGridSkeletonOptions
): UsePromptGridSkeletonReturn {
  const { count = 6, viewMode = 'grid' } = options;

  const containerStyleKey = useMemo(
    (): 'gridContainer' | 'listContainer' => (viewMode === 'grid' ? 'gridContainer' : 'listContainer'),
    [viewMode]
  );

  const items = useMemo(
    () => Array.from({ length: count }, (_, i) => i),
    [count]
  );

  return {
    containerStyleKey,
    items,
  };
}
