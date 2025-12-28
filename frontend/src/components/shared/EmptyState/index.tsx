// 文件路径: frontend/src/components/shared/EmptyState/index.tsx

/**
 * EmptyState 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/utils';
import { useEmptyState } from './useEmptyState';
import type { EmptyStateProps } from './types';
import styles from './index.module.css';

/**
 * EmptyState - 空状态展示组件
 *
 * @description
 * 采用 Headless UI 模式的生产级组件，用于展示各种空状态场景。
 * 视图层仅负责声明式 UI 结构，所有业务逻辑封装在 useEmptyState Hook 中。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：useEmptyState.ts（Headless Hook）
 * - 视图层：index.tsx（本文件）
 *
 * @features
 * - 支持 4 种空状态变体：empty（空数据）、error（错误）、noResults（无搜索结果）、noData（无内容）
 * - 每种变体有独特的图标、颜色和背景
 * - 支持自定义图标、标题、描述和操作按钮
 * - 内置优雅的 Framer Motion 动画
 * - 完全无障碍支持（ARIA 属性）
 * - 响应式设计，移动端适配
 *
 * @performance
 * - 使用 React.memo 防止不必要的重渲染
 * - 所有 handlers 已在 Hook 中使用 useCallback 优化
 * - 派生状态使用 useMemo 缓存
 * - 动画遵循用户的 prefers-reduced-motion 偏好
 *
 * @accessibility
 * - 使用语义化 HTML 标签
 * - 图标添加 aria-hidden 属性
 * - 按钮有明确的 aria-label
 * - 支持键盘导航
 * - 支持屏幕阅读器
 *
 * @example
 * ```tsx
 * // 基础用法
 * <EmptyState
 *   variant="empty"
 *   title="No prompts yet"
 *   description="Create your first prompt to get started"
 * />
 *
 * // 带操作按钮
 * <EmptyState
 *   variant="empty"
 *   title="No collections"
 *   description="Organize your prompts by creating a collection"
 *   action={{
 *     label: 'Create Collection',
 *     onClick: handleCreateCollection,
 *   }}
 * />
 *
 * // 错误状态
 * <EmptyState
 *   variant="error"
 *   title="Something went wrong"
 *   description="We couldn't load your data. Please try again."
 *   action={{
 *     label: 'Retry',
 *     onClick: handleRetry,
 *   }}
 * />
 *
 * // 无搜索结果
 * <EmptyState
 *   variant="noResults"
 *   title="No results found"
 *   description={`No prompts match "${searchQuery}"`}
 * />
 *
 * // 自定义图标
 * <EmptyState
 *   icon={<CustomIcon className="w-12 h-12" />}
 *   title="Custom Empty State"
 *   description="With a custom icon"
 * />
 * ```
 */
export const EmptyState = React.memo<EmptyStateProps>((props) => {
  const { icon, title, description, action, variant = 'empty', className } = props;

  // ==================== Hook 状态和方法 ====================
  const emptyState = useEmptyState(props);

  // ==================== 视图渲染 ====================

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(styles.container, styles.animateContainer, className)}
      role="status"
      aria-live="polite"
    >
      {/* ==================== 图标容器 ==================== */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
        className={cn(
          styles.iconContainer,
          styles.animateIcon,
          styles[variant]
        )}
      >
        {icon ? (
          icon
        ) : (
          <emptyState.IconComponent
            className={cn(styles.icon, styles[variant])}
            aria-hidden="true"
          />
        )}
      </motion.div>

      {/* ==================== 文本内容 ==================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={cn(styles.textContent, styles.animateText)}
      >
        <h3 className={styles.title}>{title}</h3>
        {emptyState.hasDescription && description && (
          <p className={styles.description}>{description}</p>
        )}
      </motion.div>

      {/* ==================== 操作按钮 ==================== */}
      {emptyState.hasAction && action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={cn(styles.actionContainer, styles.animateAction)}
        >
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" aria-hidden="true" />}
            onClick={emptyState.handleActionClick}
            aria-label={action.label}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
});

EmptyState.displayName = 'EmptyState';
