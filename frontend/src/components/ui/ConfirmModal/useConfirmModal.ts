/**
 * ConfirmModal 组件逻辑 Hook
 */

import { useMemo, useCallback } from 'react';
import { AlertTriangle, Trash2, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { useUIStore, useI18nStore } from '@/stores';
import type { ConfirmVariant, VariantConfig } from './types';
import type { ButtonVariant } from '@/styles/variants';

// 变体配置
const variantConfig: Record<ConfirmVariant, VariantConfig> = {
  danger: {
    icon: Trash2,
    iconBg: 'iconBgDanger',
    iconColor: 'iconColorDanger',
    buttonVariant: 'danger',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'iconBgWarning',
    iconColor: 'iconColorWarning',
    buttonVariant: 'primary',
  },
  info: {
    icon: Info,
    iconBg: 'iconBgInfo',
    iconColor: 'iconColorInfo',
    buttonVariant: 'primary',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'iconBgSuccess',
    iconColor: 'iconColorSuccess',
    buttonVariant: 'primary',
  },
  error: {
    icon: AlertCircle,
    iconBg: 'iconBgError',
    iconColor: 'iconColorError',
    buttonVariant: 'danger',
  },
};

export interface UseConfirmModalReturn {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  config: VariantConfig;
  buttonVariant: ButtonVariant;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export function useConfirmModal(): UseConfirmModalReturn {
  const { confirmConfig, hideConfirm } = useUIStore();
  const { t } = useI18nStore();

  const isVisible = !!confirmConfig;

  const title = confirmConfig?.title || '';
  const message = confirmConfig?.message || '';
  const confirmText = confirmConfig?.confirmText || t.common.confirm;
  const cancelText = confirmConfig?.cancelText || t.common.cancel;
  const variant = confirmConfig?.variant || 'danger';

  const config = useMemo(() => variantConfig[variant], [variant]);
  const buttonVariant = config.buttonVariant;

  const handleConfirm = useCallback(() => {
    confirmConfig?.onConfirm();
    hideConfirm();
  }, [confirmConfig, hideConfirm]);

  const handleCancel = useCallback(() => {
    hideConfirm();
  }, [hideConfirm]);

  return {
    isVisible,
    title,
    message,
    confirmText,
    cancelText,
    config,
    buttonVariant,
    handleConfirm,
    handleCancel,
  };
}
