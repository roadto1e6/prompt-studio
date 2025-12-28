// 文件路径: frontend/src/features/prompts/components/PromptCard/usePromptCard.ts

/**
 * PromptCard 逻辑层
 * Headless UI Hook：封装所有状态、副作用和处理器
 */

import { useCallback, useMemo } from 'react';
import { FileText, Image, AudioLines, Video } from 'lucide-react';
import { useI18nStore } from '@/stores';
import type { Category } from '@/types';
import type {
  UsePromptCardReturn,
  UsePromptCardParams,
  CategoryConfigMap,
} from './types';

/**
 * 分类配置常量
 * 定义每个分类的图标、颜色和背景色
 */
const CATEGORY_CONFIG: CategoryConfigMap = {
  text: {
    icon: FileText,
    color: 'text-theme-accent',
    bgColor: 'bg-theme-accent/20',
  },
  image: {
    icon: Image,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
  },
  audio: {
    icon: AudioLines,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
  },
  video: {
    icon: Video,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
  },
} as const;

/**
 * PromptCard Headless Hook
 *
 * @description
 * 封装所有卡片交互逻辑、事件处理和状态管理。
 * 采用 Headless UI 模式，视图层只需调用返回的 handlers 和 state。
 *
 * @architecture
 * - 所有事件处理器使用 useCallback 优化性能
 * - 使用事件冒泡阻止（stopPropagation）避免误触
 * - 分离业务逻辑和 UI 渲染，提高可测试性
 *
 * @example
 * ```tsx
 * const card = usePromptCard({
 *   prompt,
 *   onClick,
 *   onToggleFavorite,
 *   onDelete,
 *   isTrashView: false
 * });
 *
 * return (
 *   <div onClick={card.handleCardClick}>
 *     <button onClick={card.handleFavoriteClick}>...</button>
 *   </div>
 * );
 * ```
 */
export function usePromptCard(params: UsePromptCardParams): UsePromptCardReturn {
  const {
    prompt,
    onClick,
    onToggleFavorite,
    onDelete,
    onRestore,
    isTrashView = false,
  } = params;

  // ==================== Store 依赖 ====================
  const { t } = useI18nStore();

  // ==================== 派生状态（缓存计算） ====================

  /**
   * 获取当前分类的配置
   * 使用 useMemo 避免每次渲染重新计算
   */
  const categoryConfig = useMemo(() => {
    return CATEGORY_CONFIG[prompt.category as Category];
  }, [prompt.category]);

  /**
   * 是否显示收藏按钮
   * 仅在非回收站视图时显示
   */
  const shouldShowFavorite = useMemo(() => {
    return !isTrashView;
  }, [isTrashView]);

  /**
   * 是否显示删除按钮
   * 在所有视图中都显示（回收站中为永久删除）
   */
  const shouldShowDelete = true;

  /**
   * 是否显示恢复按钮
   * 仅在回收站视图且提供了恢复处理器时显示
   */
  const shouldShowRestore = useMemo(() => {
    return isTrashView && !!onRestore;
  }, [isTrashView, onRestore]);

  // ==================== 事件处理器 ====================

  /**
   * 处理卡片点击
   * 直接调用父组件传入的 onClick 处理器
   */
  const handleCardClick = useCallback(() => {
    onClick();
  }, [onClick]);

  /**
   * 处理收藏按钮点击
   * 阻止事件冒泡，避免触发卡片点击
   */
  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite(prompt.id);
    },
    [onToggleFavorite, prompt.id]
  );

  /**
   * 处理删除按钮点击
   * 阻止事件冒泡，避免触发卡片点击
   */
  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(prompt.id);
    },
    [onDelete, prompt.id]
  );

  /**
   * 处理恢复按钮点击
   * 阻止事件冒泡，避免触发卡片点击
   * 仅在回收站视图中可用
   */
  const handleRestoreClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onRestore) {
        onRestore(prompt.id);
      }
    },
    [onRestore, prompt.id]
  );

  // ==================== 返回值 ====================

  return {
    // 状态
    categoryConfig,
    t,

    // 处理器（全部使用 useCallback 优化）
    handleCardClick,
    handleFavoriteClick,
    handleDeleteClick,
    handleRestoreClick,

    // 派生状态
    shouldShowFavorite,
    shouldShowDelete,
    shouldShowRestore,
  };
}
