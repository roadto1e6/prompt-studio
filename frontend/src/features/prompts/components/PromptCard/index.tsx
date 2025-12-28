// 文件路径: frontend/src/features/prompts/components/PromptCard/index.tsx

/**
 * PromptCard 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, RotateCcw } from 'lucide-react';
import { formatRelativeTime, cn } from '@/utils';
import { Badge } from '@/components/ui';
import { usePromptCard } from './usePromptCard';
import type { PromptCardProps } from './types';
import styles from './index.module.css';

/**
 * PromptCard - Prompt 卡片主组件
 *
 * @description
 * 采用 Headless UI 模式的生产级组件。
 * 视图层仅负责声明式 UI 结构，所有业务逻辑封装在 usePromptCard Hook 中。
 * 支持网格视图和列表视图两种展示模式。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：usePromptCard.ts（Headless Hook）
 * - 视图层：index.tsx（本文件）
 *
 * @performance
 * - 使用 React.memo 防止不必要的重渲染
 * - 所有 handlers 已在 Hook 中使用 useCallback 优化
 * - 使用 framer-motion 实现流畅的过渡动画
 *
 * @accessibility
 * - 完整的键盘导航支持
 * - ARIA 标签和语义化 HTML
 * - 悬停和焦点状态视觉反馈
 *
 * @example
 * ```tsx
 * <PromptCard
 *   prompt={promptData}
 *   isSelected={false}
 *   viewMode="grid"
 *   onClick={handleClick}
 *   onToggleFavorite={handleFavorite}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const PromptCard = React.memo(
  React.forwardRef<HTMLDivElement, PromptCardProps>(
    (
      {
        prompt,
        isSelected,
        onClick,
        viewMode,
        onToggleFavorite,
        onDelete,
        onRestore,
        isTrashView = false,
      },
      ref
    ) => {
    // ==================== Hook 状态和方法 ====================
    const card = usePromptCard({
      prompt,
      onClick,
      onToggleFavorite,
      onDelete,
      onRestore,
      isTrashView,
    });

    const Icon = card.categoryConfig.icon;

    // ==================== 列表视图渲染 ====================
    if (viewMode === 'list') {
      return (
        <motion.div
          ref={ref}
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          onClick={card.handleCardClick}
          className={cn(
            styles.listCard,
            isSelected ? styles.listCardSelected : styles.listCardUnselected
          )}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected}
          aria-label={`${prompt.title} - ${prompt.category} prompt`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              card.handleCardClick();
            }
          }}
        >
          {/* ==================== 图标 ==================== */}
          <span
            className={cn(styles.listIconContainer, card.categoryConfig.bgColor)}
            aria-hidden="true"
          >
            <Icon className={cn(styles.listIcon, card.categoryConfig.color)} />
          </span>

          {/* ==================== 内容区域 ==================== */}
          <div className={styles.listContent}>
            <div className={styles.listContentMain}>
              <h3 className={styles.listTitle}>{prompt.title}</h3>
              <p className={styles.listDescription}>
                {prompt.description || card.t.promptCard.noDescription}
              </p>
            </div>

            {/* 标签区域 */}
            {prompt.tags.length > 0 && (
              <div className={styles.listTags} aria-label="Tags">
                {prompt.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* ==================== 元数据区域 ==================== */}
          <div className={styles.listMeta} aria-label="Metadata">
            <span className={styles.listModel}>{prompt.model}</span>
            <span className={styles.listMetaDivider} />
            <time className={styles.listTime} dateTime={prompt.updatedAt}>
              {formatRelativeTime(prompt.updatedAt)} {card.t.promptCard?.ago || 'ago'}
            </time>
          </div>

          {/* ==================== 操作按钮区域 ==================== */}
          <div className={styles.listActions} role="group" aria-label="Actions">
            {card.shouldShowRestore && (
              <button
                onClick={card.handleRestoreClick}
                className={cn(styles.actionButton, styles.actionButtonRestore)}
                title={card.t.promptCard.restore}
                aria-label={card.t.promptCard?.restoreAriaLabel?.replace('{title}', prompt.title) || `Restore ${prompt.title}`}
              >
                <RotateCcw className={styles.actionButtonIcon} aria-hidden="true" />
              </button>
            )}

            {card.shouldShowFavorite && (
              <button
                onClick={card.handleFavoriteClick}
                className={cn(
                  styles.actionButton,
                  prompt.favorite
                    ? styles.actionButtonFavorite
                    : styles.actionButtonFavoriteInactive
                )}
                title={
                  prompt.favorite
                    ? card.t.promptCard.unfavorite
                    : card.t.promptCard.favorite
                }
                aria-label={
                  prompt.favorite
                    ? (card.t.promptCard?.removeFavoriteAriaLabel?.replace('{title}', prompt.title) || `Remove ${prompt.title} from favorites`)
                    : (card.t.promptCard?.addFavoriteAriaLabel?.replace('{title}', prompt.title) || `Add ${prompt.title} to favorites`)
                }
                aria-pressed={prompt.favorite}
              >
                <Star
                  className={cn(
                    styles.actionButtonIcon,
                    prompt.favorite && styles.actionIconFilled
                  )}
                  aria-hidden="true"
                />
              </button>
            )}

            {card.shouldShowDelete && (
              <button
                onClick={card.handleDeleteClick}
                className={cn(styles.actionButton, styles.actionButtonDelete)}
                title={
                  isTrashView
                    ? card.t.promptCard.deletePermanently
                    : card.t.promptCard.moveToTrash
                }
                aria-label={
                  isTrashView
                    ? (card.t.promptCard?.deletePermanentlyAriaLabel?.replace('{title}', prompt.title) || `Permanently delete ${prompt.title}`)
                    : (card.t.promptCard?.deleteAriaLabel?.replace('{title}', prompt.title) || `Move ${prompt.title} to trash`)
                }
              >
                <Trash2 className={styles.actionButtonIcon} aria-hidden="true" />
              </button>
            )}
          </div>
        </motion.div>
      );
    }

    // ==================== 网格视图渲染 ====================
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        onClick={card.handleCardClick}
        className={cn(
          styles.gridCard,
          isSelected ? styles.gridCardSelected : styles.gridCardUnselected
        )}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        aria-label={card.t.promptCard?.categoryPrompt?.replace('{title}', prompt.title).replace('{category}', prompt.category) || `${prompt.title} - ${prompt.category} prompt`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.handleCardClick();
          }
        }}
      >
        {/* ==================== 头部区域（图标 + 操作按钮） ==================== */}
        <div className={styles.gridHeader}>
          <span
            className={cn(styles.gridIconContainer, card.categoryConfig.bgColor)}
            aria-hidden="true"
          >
            <Icon className={cn(styles.gridIcon, card.categoryConfig.color)} />
          </span>
          <div className={styles.gridActions} role="group" aria-label="Actions">
            {card.shouldShowRestore && (
              <button
                onClick={card.handleRestoreClick}
                className={cn(styles.actionButton, styles.actionButtonRestore)}
                title={card.t.promptCard.restore}
                aria-label={card.t.promptCard?.restoreAriaLabel?.replace('{title}', prompt.title) || `Restore ${prompt.title}`}
              >
                <RotateCcw className={styles.actionButtonIcon} aria-hidden="true" />
              </button>
            )}

            {card.shouldShowFavorite && (
              <button
                onClick={card.handleFavoriteClick}
                className={cn(
                  styles.actionButton,
                  prompt.favorite
                    ? styles.actionButtonFavorite
                    : styles.actionButtonFavoriteInactive
                )}
                title={
                  prompt.favorite
                    ? card.t.promptCard.unfavorite
                    : card.t.promptCard.favorite
                }
                aria-label={
                  prompt.favorite
                    ? (card.t.promptCard?.removeFavoriteAriaLabel?.replace('{title}', prompt.title) || `Remove ${prompt.title} from favorites`)
                    : (card.t.promptCard?.addFavoriteAriaLabel?.replace('{title}', prompt.title) || `Add ${prompt.title} to favorites`)
                }
                aria-pressed={prompt.favorite}
              >
                <Star
                  className={cn(
                    styles.actionButtonIcon,
                    prompt.favorite && styles.actionIconFilled
                  )}
                  aria-hidden="true"
                />
              </button>
            )}

            {card.shouldShowDelete && (
              <button
                onClick={card.handleDeleteClick}
                className={cn(styles.actionButton, styles.actionButtonDelete)}
                title={
                  isTrashView
                    ? card.t.promptCard.deletePermanently
                    : card.t.promptCard.moveToTrash
                }
                aria-label={
                  isTrashView
                    ? (card.t.promptCard?.deletePermanentlyAriaLabel?.replace('{title}', prompt.title) || `Permanently delete ${prompt.title}`)
                    : (card.t.promptCard?.deleteAriaLabel?.replace('{title}', prompt.title) || `Move ${prompt.title} to trash`)
                }
              >
                <Trash2 className={styles.actionButtonIcon} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* ==================== 标题 ==================== */}
        <h3 className={styles.gridTitle}>{prompt.title}</h3>

        {/* ==================== 描述 ==================== */}
        <p className={styles.gridDescription}>
          {prompt.description || card.t.promptCard.noDescription}
        </p>

        {/* ==================== 标签和底部区域 ==================== */}
        <div className={styles.gridFooter}>
          <div className={styles.gridTags} aria-label="Tags">
            {prompt.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                #{tag}
              </Badge>
            ))}
            {prompt.tags.length > 2 && (
              <Badge variant="default" size="sm" aria-label={card.t.promptCard?.moreTagsAriaLabel?.replace('{count}', String(prompt.tags.length - 2)) || `${prompt.tags.length - 2} more tags`}>
                +{prompt.tags.length - 2}
              </Badge>
            )}
          </div>

          <div className={styles.gridMeta} aria-label="Metadata">
            <div className={styles.gridModel}>
              <span className={styles.gridModelDot} aria-hidden="true" />
              <span className={styles.gridModelText}>{prompt.model}</span>
            </div>
            <time className={styles.gridTime} dateTime={prompt.updatedAt}>
              {formatRelativeTime(prompt.updatedAt)} {card.t.promptCard?.ago || 'ago'}
            </time>
          </div>
        </div>
      </motion.div>
    );
  })
);

PromptCard.displayName = 'PromptCard';
