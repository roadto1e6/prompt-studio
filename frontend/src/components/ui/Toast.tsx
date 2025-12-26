/**
 * Toast Component
 * 全局 Toast 通知组件
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToastStore, type Toast as ToastType } from '@/stores/toastStore';
import { cn } from '@/utils';

// Toast 图标映射
const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

// Toast 样式映射
const toastStyles = {
  success: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-900 dark:text-green-100',
    description: 'text-green-700 dark:text-green-300',
  },
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-900 dark:text-red-100',
    description: 'text-red-700 dark:text-red-300',
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-900 dark:text-yellow-100',
    description: 'text-yellow-700 dark:text-yellow-300',
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-100',
    description: 'text-blue-700 dark:text-blue-300',
  },
};

interface ToastItemProps {
  toast: ToastType;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const Icon = toastIcons[toast.type];
  const styles = toastStyles[toast.type];

  useEffect(() => {
    // 设置自动关闭（防御性检查）
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(onClose, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
        'min-w-[320px] max-w-[420px]',
        styles.container
      )}
    >
      {/* Icon */}
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', styles.icon)} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium', styles.text)}>{toast.message}</p>
        {toast.description && (
          <p className={cn('text-xs mt-1', styles.description)}>{toast.description}</p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onClose();
            }}
            className={cn(
              'text-xs font-medium mt-2 hover:underline',
              styles.text
            )}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className={cn(
          'flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
          styles.icon
        )}
        aria-label="关闭通知"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

/**
 * ToastContainer - 渲染所有 Toast
 * 应该在 App.tsx 的根组件中引入
 */
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// 导出 Toast 类型供外部使用
export type { ToastType } from '@/stores/toastStore';
