import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showClose?: boolean;
  className?: string;
  /**
   * Callback when Enter key is pressed (useful for form submission)
   */
  onEnterPress?: () => void;
  /**
   * Prevent closing the modal via backdrop click or Escape key
   */
  preventClose?: boolean;
  /**
   * Z-index override for multi-layer modals
   */
  zIndex?: number;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  className,
  onEnterPress,
  preventClose = false,
  zIndex = 50,
}) => {

  // Handle keyboard events (Escape to close, Enter for form submission)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose();
      }
      if (e.key === 'Enter' && onEnterPress) {
        // Don't trigger if user is typing in a textarea
        const target = e.target as HTMLElement;
        if (target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          onEnterPress();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onEnterPress, preventClose]);

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
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 backdrop-blur-lg bg-theme-overlay-backdrop"
            onClick={preventClose ? undefined : onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative w-full mx-4 max-h-[90vh] flex flex-col',
              sizes[size],
              className
            )}
          >
            <div className="rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-full border bg-theme-card-bg border-theme-card-border">
              {/* Header */}
              {(title || showClose) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-theme-border flex-shrink-0">
                  {title && (
                    <h2 className="text-lg font-semibold text-theme-text-primary">{title}</h2>
                  )}
                  {showClose && (
                    <button
                      onClick={onClose}
                      className="p-1 rounded-lg transition-colors text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-overlay"
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
