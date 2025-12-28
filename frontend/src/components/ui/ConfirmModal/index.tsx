/**
 * ConfirmModal 组件 - 视图层
 * 全局确认对话框
 */

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '@/utils';
import { ModalBackdrop } from '../Modal';
import { Button } from '../Button';
import { useConfirmModal } from './useConfirmModal';
import type { ConfirmModalProps } from './types';
import styles from './index.module.css';

// ============ ConfirmModal 主组件 ============

export const ConfirmModal = memo<ConfirmModalProps>(() => {
  const {
    isVisible,
    title,
    message,
    confirmText,
    cancelText,
    config,
    buttonVariant,
    handleConfirm,
    handleCancel,
  } = useConfirmModal();

  if (!isVisible) return null;

  const Icon = config.icon;

  return createPortal(
    <AnimatePresence>
      <div className={styles.container}>
        <ModalBackdrop onClick={handleCancel} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={styles.modal}
        >
          <div className={styles.content}>
            {/* 内容区域 */}
            <div className={styles.body}>
              {/* 图标 */}
              <div className={styles.iconWrapper}>
                <span className={cn(styles.iconContainer, styles[config.iconBg])}>
                  <Icon className={cn(styles.icon, styles[config.iconColor])} />
                </span>
              </div>

              {/* 标题和消息 */}
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.message}>{message}</p>
            </div>

            {/* 操作按钮 */}
            <div className={styles.footer}>
              <Button variant="ghost" className={styles.footerButton} onClick={handleCancel}>
                {cancelText}
              </Button>
              <Button variant={buttonVariant} className={styles.footerButton} onClick={handleConfirm}>
                {confirmText}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
});

ConfirmModal.displayName = 'ConfirmModal';

// 导出
export type { ConfirmVariant, ConfirmConfig, ConfirmModalProps } from './types';
export default ConfirmModal;
