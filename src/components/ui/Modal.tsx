import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils';
import { useThemeStore } from '@/stores';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showClose?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  className,
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative w-full mx-4 max-h-[90vh] flex flex-col',
              sizes[size],
              className
            )}
          >
            <div className={cn(
              'rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-full border',
              isDark
                ? 'bg-dark-800 border-slate-700'
                : 'bg-white border-slate-200'
            )}>
              {/* Header */}
              {(title || showClose) && (
                <div className={cn(
                  'flex items-center justify-between px-6 py-4 border-b flex-shrink-0',
                  isDark ? 'border-slate-700' : 'border-slate-200'
                )}>
                  {title && (
                    <h2 className={cn(
                      'text-lg font-semibold',
                      isDark ? 'text-white' : 'text-slate-900'
                    )}>{title}</h2>
                  )}
                  {showClose && (
                    <button
                      onClick={onClose}
                      className={cn(
                        'p-1 rounded-lg transition-colors',
                        isDark
                          ? 'text-slate-400 hover:text-white hover:bg-white/5'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      )}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
