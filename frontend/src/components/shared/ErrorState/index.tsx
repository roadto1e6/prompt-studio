// 文件路径: frontend/src/components/shared/ErrorState/index.tsx

/**
 * ErrorState 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { cn } from '@/utils';
import { useI18nStore } from '@/stores';
import { Button } from '@/components/ui';
import { useErrorState } from './useErrorState';
import type {
  ErrorStateProps,
  NetworkErrorStateProps,
  NotFoundStateProps,
} from './types';
import styles from './index.module.css';

/**
 * 动画配置常量
 */
const ANIMATION_CONFIG = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  icon: {
    initial: { scale: 0.8, rotate: -10 },
    animate: { scale: 1, rotate: 0 },
    transition: {
      duration: 0.5,
      delay: 0.1,
      type: 'spring' as const,
      stiffness: 200,
      damping: 15,
    },
  },
  content: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, delay: 0.2 },
  },
  actions: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: 0.3 },
  },
} as const;

/**
 * ErrorState - 错误状态展示组件
 *
 * @description
 * 生产级错误状态组件，支持多种错误类型、重试逻辑、无障碍访问。
 * 采用 Headless UI 模式，逻辑与视图分离。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：useErrorState.ts（业务逻辑）
 * - 视图层：index.tsx（本文件）
 *
 * @performance
 * - React.memo 防止不必要重渲染
 * - useCallback 优化事件处理器
 * - useMemo 缓存变体配置
 * - Framer Motion 动画按需加载
 *
 * @accessibility
 * - 语义化 HTML 结构
 * - 适当的 ARIA 属性
 * - 焦点管理和键盘导航
 *
 * @example
 * ```tsx
 * <ErrorState
 *   title="网络错误"
 *   message="无法连接到服务器"
 *   variant="offline"
 *   onRetry={handleRetry}
 * />
 * ```
 */
export const ErrorState = React.memo<ErrorStateProps>(({
  title,
  message,
  variant = 'error',
  onRetry,
  onGoHome,
  className,
}) => {
  // ==================== Hook ====================
  const { handleRetry, handleGoHome } = useErrorState(variant, onRetry, onGoHome);
  const { t } = useI18nStore();

  // Use default values from i18n if not provided
  const displayTitle = title || t.errorState?.defaultTitle || '出错了';
  const displayMessage = message || t.errorState?.defaultMessage || '抱歉，发生了一个错误。请稍后重试。';

  // ==================== 派生状态 ====================
  const hasActions = Boolean(onRetry || onGoHome);

  // ==================== 渲染 ====================
  return (
    <motion.div
      initial={ANIMATION_CONFIG.container.initial}
      animate={ANIMATION_CONFIG.container.animate}
      transition={ANIMATION_CONFIG.container.transition}
      className={cn(styles.container, className)}
      role="alert"
      aria-live="polite"
    >
      {/* 错误图标 */}
      <motion.div
        initial={ANIMATION_CONFIG.icon.initial}
        animate={ANIMATION_CONFIG.icon.animate}
        transition={ANIMATION_CONFIG.icon.transition}
        className={cn(styles.iconContainer, styles[variant])}
        aria-hidden="true"
      >
        <AlertCircle className={cn(styles.icon, styles[variant])} />
      </motion.div>

      {/* 错误信息 */}
      <motion.div
        initial={ANIMATION_CONFIG.content.initial}
        animate={ANIMATION_CONFIG.content.animate}
        transition={ANIMATION_CONFIG.content.transition}
        className={styles.content}
      >
        <h3 className={styles.title}>
          {displayTitle}
        </h3>
        <p className={styles.message}>
          {displayMessage}
        </p>
      </motion.div>

      {/* 操作按钮 */}
      {hasActions && (
        <motion.div
          initial={ANIMATION_CONFIG.actions.initial}
          animate={ANIMATION_CONFIG.actions.animate}
          transition={ANIMATION_CONFIG.actions.transition}
          className={styles.actions}
        >
          {onRetry && (
            <Button
              variant="primary"
              size="sm"
              icon={<RefreshCw className={styles.buttonIcon} aria-hidden="true" />}
              onClick={handleRetry}
              aria-label={t.errorState?.retryAriaLabel || '重试操作'}
            >
              {t.errorState?.retry || '重试'}
            </Button>
          )}
          {onGoHome && (
            <Button
              variant="outline"
              size="sm"
              icon={<Home className={styles.buttonIcon} aria-hidden="true" />}
              onClick={handleGoHome}
              aria-label={t.errorState?.goHomeAriaLabel || '返回首页'}
            >
              {t.errorState?.goHome || '返回首页'}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
});

ErrorState.displayName = 'ErrorState';

/**
 * NetworkErrorState - 网络错误状态组件
 *
 * @description
 * ErrorState 的预设变体，用于显示网络连接错误。
 * 封装了固定的标题、消息和离线变体样式。
 *
 * @example
 * ```tsx
 * <NetworkErrorState onRetry={handleRetry} />
 * ```
 */
export const NetworkErrorState = React.memo<NetworkErrorStateProps>(({
  onRetry,
  className,
}) => {
  const { t } = useI18nStore();
  return (
    <ErrorState
      title={t.errorState?.networkTitle || '网络连接失败'}
      message={t.errorState?.networkMessage || '无法连接到服务器。请检查您的网络连接，然后重试。'}
      variant="offline"
      onRetry={onRetry}
      className={className}
    />
  );
});

NetworkErrorState.displayName = 'NetworkErrorState';

/**
 * NotFoundState - 404错误状态组件
 *
 * @description
 * ErrorState 的预设变体，用于显示页面未找到错误。
 * 封装了固定的标题、消息和警告变体样式。
 *
 * @example
 * ```tsx
 * <NotFoundState onGoHome={handleGoHome} />
 * ```
 */
export const NotFoundState = React.memo<NotFoundStateProps>(({
  onGoHome,
  className,
}) => {
  const { t } = useI18nStore();
  return (
    <ErrorState
      title={t.errorState?.notFoundTitle || '页面未找到'}
      message={t.errorState?.notFoundMessage || '抱歉，您访问的页面不存在或已被删除。'}
      variant="warning"
      onGoHome={onGoHome}
      className={className}
    />
  );
});

NotFoundState.displayName = 'NotFoundState';
