/**
 * Button 组件 - 视图层
 * 按钮组件，支持多种变体、尺寸、加载状态和图标
 */

import React, { forwardRef, memo } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils';
import { useButton } from './useButton';
import type { ButtonProps } from './types';
import styles from './index.module.css';

// ============ 内联子组件 ============

// Spinner 组件
const Spinner: React.FC<{ sizeClass: string }> = ({ sizeClass }) => (
  <svg
    className={cn(styles.spinner, styles[sizeClass])}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

// ============ Button 主组件 ============

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      loadingText,
      success = false,
      successDuration = 2000,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const {
      showSuccess,
      isDisabled,
      variantClasses,
      sizeClasses,
      iconSizeClass,
      spinnerSizeClass,
    } = useButton({
      variant,
      size,
      success,
      successDuration,
      disabled,
      loading,
    });

    const renderContent = () => {
      if (showSuccess) {
        return (
          <>
            <Check className={styles[iconSizeClass]} />
            {children}
          </>
        );
      }

      if (loading) {
        return (
          <>
            <Spinner sizeClass={spinnerSizeClass} />
            {loadingText || children}
          </>
        );
      }

      return (
        <>
          {icon && iconPosition === 'left' && (
            <span className={cn(styles.iconWrapper, styles[iconSizeClass])}>
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className={cn(styles.iconWrapper, styles[iconSizeClass])}>
              {icon}
            </span>
          )}
        </>
      );
    };

    return (
      <button
        ref={ref}
        className={cn(
          styles.button,
          showSuccess ? styles.buttonSuccess : variantClasses,
          sizeClasses,
          fullWidth && styles.buttonFullWidth,
          loading && styles.buttonLoading,
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

ButtonComponent.displayName = 'Button';

export const Button = memo(ButtonComponent);

// 导出
export type { ButtonProps } from './types';
export default Button;
