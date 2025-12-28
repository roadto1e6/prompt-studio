/**
 * Modal 组件类型定义
 */

import type { ModalSize } from '@/styles/variants';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  showClose?: boolean;
  className?: string;
  onEnterPress?: () => void;
  preventClose?: boolean;
  zIndex?: number;
  containerClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
}

export interface ModalBackdropProps {
  onClick?: () => void;
  className?: string;
}

export interface UseModalKeyboardOptions {
  isOpen: boolean;
  onClose: () => void;
  onEnterPress?: () => void;
  preventClose?: boolean;
}

export { type ModalSize } from '@/styles/variants';
