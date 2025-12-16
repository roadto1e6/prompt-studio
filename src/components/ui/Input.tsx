import React from 'react';
import { cn } from '@/utils';
import { useThemeStore } from '@/stores';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="w-full">
      {label && (
        <label className={cn(
          'block text-xs font-bold uppercase tracking-wider mb-2',
          isDark ? 'text-slate-500' : 'text-slate-600'
        )}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2',
            isDark ? 'text-slate-500' : 'text-slate-400'
          )}>
            {icon}
          </span>
        )}
        <input
          className={cn(
            'w-full rounded-lg px-3 py-2 text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
            isDark
              ? 'bg-dark-800 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500'
              : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500',
            icon ? 'pl-10' : '',
            error ? 'border-red-500' : '',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};
