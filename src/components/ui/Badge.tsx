import React from 'react';
import { cn } from '@/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  removable = false,
  onRemove,
  className,
}) => {
  const variants = {
    default: 'bg-theme-badge-bg text-theme-badge-text border-theme-badge-border',
    primary: 'bg-theme-accent/20 text-theme-accent border-theme-accent/30',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded border font-medium whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1.5 transition-colors hover:text-theme-text-primary"
        >
          ×
        </button>
      )}
    </span>
  );
};
