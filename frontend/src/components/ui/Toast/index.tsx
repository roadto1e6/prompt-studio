/**
 * Toast 组件
 * 全局通知提示
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/utils';
import { toastVariants } from '@/styles/variants';
import { useToastStore } from '@/stores/toastStore';
import { useToastTimer } from './useToast';
import type { ToastItemProps, ToastIconMap } from './types';
import styles from './index.module.css';

// ============ 内联子组件 ============

/** Toast 图标映射 */
const TOAST_ICONS: ToastIconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

/** Toast 图标 */
const ToastIcon: React.FC<{ type: keyof typeof TOAST_ICONS; className?: string }> = ({
  type,
  className,
}) => {
  const Icon = TOAST_ICONS[type];
  return <Icon className={cn(styles.icon, className)} aria-hidden="true" />;
};

/** Toast 进度条 */
const ToastProgress: React.FC<{ progress: number; className?: string }> = ({
  progress,
  className,
}) => (
  <motion.div
    className={cn(styles.progress, className)}
    initial={{ width: '100%' }}
    style={{ width: `${progress}%` }}
    transition={{ duration: 0.1, ease: 'linear' }}
  />
);

/** Toast 操作按钮 */
const ToastAction: React.FC<{ label: string; onClick: () => void; className?: string }> = ({
  label,
  onClick,
  className,
}) => (
  <button onClick={onClick} className={cn(styles.action, className)}>
    {label}
  </button>
);

/** Toast 关闭按钮 */
const ToastCloseButton: React.FC<{ onClick: () => void; className?: string }> = ({
  onClick,
  className,
}) => (
  <button onClick={onClick} className={cn(styles.closeButton, className)} aria-label="Close notification">
    <X className={styles.closeIcon} />
  </button>
);

// ============ 主组件 ============

/**
 * 单个 Toast 项
 */
const ToastItem = React.memo<ToastItemProps>(({ toast, onClose }) => {
  const [isPaused, setIsPaused] = useState(false);

  const { progress } = useToastTimer({
    duration: toast.duration,
    onClose,
    isPaused,
  });

  const variantStyles = toastVariants[toast.type];

  const handleActionClick = () => {
    toast.action?.onClick();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(styles.toast, variantStyles.container)}
      role="alert"
      aria-live="polite"
    >
      {/* 进度条 */}
      {toast.duration && toast.duration > 0 && (
        <ToastProgress progress={progress} className={variantStyles.progress} />
      )}

      {/* 图标 */}
      <ToastIcon type={toast.type} className={variantStyles.icon} />

      {/* 内容 */}
      <div className={styles.content}>
        <p className={cn(styles.message, variantStyles.text)}>{toast.message}</p>
        {toast.description && (
          <p className={cn(styles.description, variantStyles.description)}>{toast.description}</p>
        )}
        {toast.action && (
          <ToastAction
            label={toast.action.label}
            onClick={handleActionClick}
            className={variantStyles.text}
          />
        )}
      </div>

      {/* 关闭按钮 */}
      <ToastCloseButton onClick={onClose} className={variantStyles.icon} />
    </motion.div>
  );
});

ToastItem.displayName = 'ToastItem';

/**
 * Toast 容器
 * 在 App.tsx 根组件中引入
 */
const ToastContainerComponent: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.2, delay: index * 0.05 },
            }}
            exit={{ opacity: 0, x: 100, scale: 0.95, transition: { duration: 0.15 } }}
          >
            <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const ToastContainer = memo(ToastContainerComponent);

ToastContainer.displayName = 'ToastContainer';

// 导出
export type { ToastItemProps } from './types';
export type { Toast as ToastType } from '@/stores/toastStore';
export default ToastContainer;
