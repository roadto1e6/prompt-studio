import React from 'react';
import { cn } from '@/utils';
import { useThemeStore } from '@/stores';

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
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const variants = {
    default: isDark
      ? 'bg-slate-800 text-slate-400 border-slate-700'
      : 'bg-slate-100 text-slate-600 border-slate-200',
    primary: isDark
      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
      : 'bg-indigo-50 text-indigo-600 border-indigo-200',
    success: isDark
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    warning: isDark
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      : 'bg-amber-50 text-amber-600 border-amber-200',
    danger: isDark
      ? 'bg-red-500/20 text-red-300 border-red-500/30'
      : 'bg-red-50 text-red-600 border-red-200',
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
          className={cn(
            'ml-1.5 transition-colors',
            isDark ? 'hover:text-white' : 'hover:text-slate-900'
          )}
        >
          ×
        </button>
      )}
    </span>
  );
};
