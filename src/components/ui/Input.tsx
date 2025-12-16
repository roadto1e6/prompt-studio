import React from 'react';
import { cn } from '@/utils';

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
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-theme-text-label uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-muted">
            {icon}
          </span>
        )}
        <input
          className={cn(
            'w-full rounded-lg px-3 py-2 text-sm transition-colors',
            'bg-theme-input-bg border border-theme-input-border text-theme-input-text',
            'placeholder:text-theme-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-theme-accent',
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
