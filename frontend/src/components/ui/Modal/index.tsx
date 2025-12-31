/**
 * Modal 组件 - 视图层
 * 模态对话框组件集合
 */

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { cn } from '@/utils';
import { useI18nStore } from '@/stores';
import { useModal, useModalKeyboard } from './useModal';
import type { ModalProps, ModalBackdropProps } from './types';
import styles from './index.module.css';

// ============ ModalBackdrop 组件 (导出供 ConfirmModal 使用) ============

export const ModalBackdrop = memo<ModalBackdropProps>(({ onClick, className }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    onClick={onClick}
    className={className || styles.backdrop}
  />
));

ModalBackdrop.displayName = 'ModalBackdrop';

// ============ 内联子组件 ============

// ModalHeader
const ModalHeader: React.FC<{
  title?: string;
  showClose?: boolean;
  showBackButton?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  className?: string;
  closeAriaLabel?: string;
  backAriaLabel?: string;
}> = ({ title, showClose = true, showBackButton = false, onClose, onBack, className, closeAriaLabel, backAriaLabel }) => {
  if (!title && !showClose && !showBackButton) return null;

  return (
    <div className={cn(styles.header, className)}>
      <div className={styles.headerLeft}>
        {showBackButton && (
          <button
            onClick={onBack}
            className={styles.backButton}
            aria-label={backAriaLabel || 'Go back'}
          >
            <ArrowLeft className={styles.backIcon} />
          </button>
        )}
        {title && <h2 className={styles.title}>{title}</h2>}
      </div>
      {showClose && (
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label={closeAriaLabel || 'Close modal'}
        >
          <X className={styles.closeIcon} />
        </button>
      )}
    </div>
  );
};

// ModalContent
const ModalContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn(styles.content, className)}>
    {children}
  </div>
);

// ============ Modal 主组件 ============

export const Modal = memo<ModalProps>(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  showBackButton = false,
  onBack,
  className,
  onEnterPress,
  preventClose = false,
  zIndex = 50,
  containerClassName,
  contentClassName,
  headerClassName,
}) => {
  const { t } = useI18nStore();
  useModalKeyboard({ isOpen, onClose, onEnterPress, preventClose });
  const { sizeClasses, handleBackdropClick } = useModal({ size, preventClose, onClose });

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} style={{ zIndex }}>
          <ModalBackdrop onClick={handleBackdropClick} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(styles.container, sizeClasses, containerClassName)}
          >
            <div className={cn(styles.modal, className)}>
              <ModalHeader
                title={title}
                showClose={showClose}
                showBackButton={showBackButton}
                onClose={onClose}
                onBack={onBack}
                className={headerClassName}
                closeAriaLabel={t.common?.closeModal}
              />
              <ModalContent className={contentClassName}>{children}</ModalContent>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
});

Modal.displayName = 'Modal';

// 导出
export type { ModalProps, ModalBackdropProps, ModalSize, UseModalKeyboardOptions } from './types';
export { useModalKeyboard } from './useModal';
export default Modal;
