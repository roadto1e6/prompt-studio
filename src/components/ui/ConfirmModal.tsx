import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, Info } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useUIStore, useI18nStore } from '@/stores';
import { Button } from './Button';
import { cn } from '@/utils';

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    buttonVariant: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    buttonVariant: 'primary' as const,
  },
  info: {
    icon: Info,
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
    buttonVariant: 'primary' as const,
  },
};

export const ConfirmModal: React.FC = () => {
  const { confirmConfig, hideConfirm } = useUIStore();
  const { t } = useI18nStore();

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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
          <div className="bg-dark-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <span className={cn('inline-flex items-center justify-center p-3 rounded-full', config.iconBg)}>
                  <Icon className={cn('w-6 h-6', config.iconColor)} />
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white text-center mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-400 text-center">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 bg-dark-900 border-t border-slate-800">
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
