/**
 * Modal 组件逻辑 Hook
 */

import { useEffect, useMemo } from 'react';
import { modalSizes } from '@/styles/variants';
import type { ModalSize } from '@/styles/variants';
import type { UseModalKeyboardOptions } from './types';

/**
 * 键盘事件处理 Hook
 */
export function useModalKeyboard(options: UseModalKeyboardOptions): void {
  const { isOpen, onClose, onEnterPress, preventClose = false } = options;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose();
        return;
      }

      if (e.key === 'Enter' && onEnterPress) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          onEnterPress();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, onEnterPress, preventClose]);
}

export interface UseModalOptions {
  size?: ModalSize;
  preventClose?: boolean;
  onClose: () => void;
}

export interface UseModalReturn {
  sizeClasses: string;
  handleBackdropClick: (() => void) | undefined;
}

export function useModal(options: UseModalOptions): UseModalReturn {
  const { size = 'md', preventClose = false, onClose } = options;

  const sizeClasses = useMemo(() => modalSizes[size].base, [size]);

  const handleBackdropClick = useMemo(
    () => (preventClose ? undefined : onClose),
    [preventClose, onClose]
  );

  return {
    sizeClasses,
    handleBackdropClick,
  };
}
