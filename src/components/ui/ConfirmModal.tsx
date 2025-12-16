import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, Info } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useUIStore, useI18nStore, useThemeStore } from '@/stores';
import { Button } from './Button';
import { cn } from '@/utils';

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-500',
    buttonVariant: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-500',
    buttonVariant: 'primary' as const,
  },
  info: {
    icon: Info,
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-500',
    buttonVariant: 'primary' as const,
  },
};

export const ConfirmModal: React.FC = () => {
  const { confirmConfig, hideConfirm } = useUIStore();
  const { t } = useI18nStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!confirmConfig) return null;

  const {
    title,
    message,
    confirmText = t.common.confirm,
    cancelText = t.common.cancel,
    variant = 'danger',
    onConfirm,
  } = confirmConfig;

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    hideConfirm();
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute inset-0 backdrop-blur-sm',
            isDark ? 'bg-black/60' : 'bg-black/40'
          )}
          onClick={hideConfirm}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-sm mx-4"
        >
          <div className={cn(
            'rounded-xl shadow-2xl overflow-hidden border',
            isDark
              ? 'bg-dark-800 border-slate-700'
              : 'bg-white border-slate-200'
          )}>
            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <span className={cn('inline-flex items-center justify-center p-3 rounded-full', config.iconBg)}>
                  <Icon className={cn('w-6 h-6', config.iconColor)} />
                </span>
              </div>

              {/* Content */}
              <h3 className={cn(
                'text-lg font-semibold text-center mb-2',
                isDark ? 'text-white' : 'text-slate-900'
              )}>
                {title}
              </h3>
              <p className={cn(
                'text-sm text-center',
                isDark ? 'text-slate-400' : 'text-slate-600'
              )}>
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className={cn(
              'flex gap-3 p-4 border-t',
              isDark
                ? 'bg-dark-900 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            )}>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={hideConfirm}
              >
                {cancelText}
              </Button>
              <Button
                variant={config.buttonVariant}
                className="flex-1"
                onClick={handleConfirm}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
