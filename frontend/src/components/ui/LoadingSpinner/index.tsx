/**
 * LoadingSpinner 组件 - 视图层
 * 加载指示器组件集合
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';
import { useLoadingSpinner } from './useLoadingSpinner';
import type {
  LoadingSpinnerProps,
  ButtonLoadingProps,
  InlineLoadingProps,
  PageLoadingProps,
} from './types';
import styles from './index.module.css';

// ============ LoadingSpinner 主组件 ============

export const LoadingSpinner = memo<LoadingSpinnerProps>(({
  size = 'md',
  text,
  fullscreen = false,
  variant = 'spinner',
  className,
  textClassName,
}) => {
  const { sizeClass } = useLoadingSpinner({ size, variant });

  const SpinnerContent = () => {
    if (variant === 'dots') {
      return (
        <div className={cn(styles.dotsContainer, className)}>
          <span className={cn(styles.dot, styles.dotDelay1)} />
          <span className={cn(styles.dot, styles.dotDelay2)} />
          <span className={cn(styles.dot, styles.dotDelay3)} />
        </div>
      );
    }

    return (
      <Loader2
        className={cn(styles.spinner, styles[sizeClass], className)}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(styles.container, fullscreen && styles.fullscreen)}
    >
      <SpinnerContent />
      {text && (
        <p className={cn(styles.text, textClassName)}>
          {text}
        </p>
      )}
    </motion.div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// ============ ButtonLoading 组件 ============

export const ButtonLoading = memo<ButtonLoadingProps>(({
  size = 'w-4 h-4',
  className,
}) => (
  <Loader2 className={cn(size, styles.buttonSpinner, className)} aria-label="Loading" />
));

ButtonLoading.displayName = 'ButtonLoading';

// ============ InlineLoading 组件 ============

export const InlineLoading = memo<InlineLoadingProps>(({
  text,
  className,
  iconSize = 'w-4 h-4',
}) => (
  <div className={cn(styles.inlineContainer, className)}>
    <Loader2 className={cn(iconSize, styles.inlineSpinner)} />
    {text && <span className={styles.inlineText}>{text}</span>}
  </div>
));

InlineLoading.displayName = 'InlineLoading';

// ============ PageLoading 组件 ============

export const PageLoading = memo<PageLoadingProps>(({
  text = '加载中...',
  size = 'lg',
  variant = 'spinner',
  minHeight = 'min-h-[400px]',
}) => (
  <div className={cn(styles.pageContainer, minHeight)}>
    <LoadingSpinner size={size} text={text} variant={variant} />
  </div>
));

PageLoading.displayName = 'PageLoading';

// 导出
export type {
  LoadingSize,
  LoadingVariant,
  LoadingSpinnerProps,
  ButtonLoadingProps,
  InlineLoadingProps,
  PageLoadingProps,
} from './types';
export default LoadingSpinner;
