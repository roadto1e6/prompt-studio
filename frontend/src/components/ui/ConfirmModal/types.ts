/**
 * ConfirmModal 组件类型定义
 */

import type { LucideIcon } from 'lucide-react';
import type { ButtonVariant } from '@/styles/variants';

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'success' | 'error';

export interface VariantConfig {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  buttonVariant: ButtonVariant;
}

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
}

export interface ConfirmModalProps {
  // Props are managed via store, no external props needed
}
