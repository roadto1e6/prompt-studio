/**
 * Button 组件逻辑 Hook
 */

import { useState, useEffect, useMemo } from 'react';
import { buttonVariants, buttonSizes } from '@/styles/variants';

export interface UseButtonOptions {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  success?: boolean;
  successDuration?: number;
  disabled?: boolean;
  loading?: boolean;
}

export interface UseButtonReturn {
  showSuccess: boolean;
  isDisabled: boolean;
  variantClasses: string;
  sizeClasses: string;
  iconSize: 'sm' | 'md' | 'lg';
  iconSizeClass: string;
  spinnerSizeClass: string;
}

export function useButton(options: UseButtonOptions): UseButtonReturn {
  const {
    variant = 'primary',
    size = 'md',
    success = false,
    successDuration = 2000,
    disabled = false,
    loading = false,
  } = options;

  const [showSuccess, setShowSuccess] = useState(false);

  // 成功状态自动消失
  useEffect(() => {
    if (success && !showSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), successDuration);
      return () => clearTimeout(timer);
    } else if (!success && showSuccess) {
      setShowSuccess(false);
    }
  }, [success, showSuccess, successDuration]);

  const isDisabled = disabled || loading || showSuccess;

  const variantClasses = useMemo(() => {
    if (showSuccess) {
      return 'buttonSuccess';
    }
    return buttonVariants[variant].base;
  }, [variant, showSuccess]);

  const sizeClasses = useMemo(() => buttonSizes[size].base, [size]);

  // 图标尺寸映射
  const iconSize = useMemo((): 'sm' | 'md' | 'lg' => {
    if (size === 'xs' || size === 'sm') return 'sm';
    if (size === 'xl') return 'lg';
    return 'md';
  }, [size]);

  const iconSizeClass = useMemo(() => {
    const classes = { sm: 'iconSm', md: 'iconMd', lg: 'iconLg' };
    return classes[iconSize];
  }, [iconSize]);

  const spinnerSizeClass = useMemo(() => {
    const classes = { sm: 'spinnerSm', md: 'spinnerMd', lg: 'spinnerLg' };
    return classes[iconSize];
  }, [iconSize]);

  return {
    showSuccess,
    isDisabled,
    variantClasses,
    sizeClasses,
    iconSize,
    iconSizeClass,
    spinnerSizeClass,
  };
}
