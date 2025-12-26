import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  /**
   * Text to display when loading (e.g., "Saving...", "登录中...")
   */
  loadingText?: string;
  /**
   * Success state - shows checkmark and green color for 2 seconds
   */
  success?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  loadingText,
  success = false,
  className,
  disabled,
  ...props
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-hide success state after 2 seconds
  useEffect(() => {
    if (success && !showSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, showSuccess]);

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-theme-accent hover:bg-theme-accent-hover text-white shadow-lg',
    secondary: 'bg-theme-button-secondary hover:bg-theme-button-secondary-hover text-theme-button-secondary-text border border-theme-button-secondary-border shadow-sm',
    ghost: 'bg-transparent hover:bg-theme-button-ghost-hover text-theme-text-secondary hover:text-theme-text-primary',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20',
    outline: 'bg-transparent border border-theme-button-outline-border text-theme-text-primary hover:bg-theme-overlay',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  const spinnerSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const checkSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const isDisabled = disabled || loading || showSuccess;

  return (
    <button
      className={cn(
        baseStyles,
        showSuccess ? 'bg-green-600 hover:bg-green-600 text-white' : variants[variant],
        sizes[size],
        loading && 'pointer-events-none',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {showSuccess ? (
        <>
          <Check className={checkSizes[size]} />
          {children}
        </>
      ) : loading ? (
        <>
          <svg className={cn('animate-spin', spinnerSizes[size])} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {loadingText || children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
};
