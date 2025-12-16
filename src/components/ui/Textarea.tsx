import React from 'react';
import { cn } from '@/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  showCount = false,
  maxLength,
  className,
  value,
  ...props
}) => {
  const charCount = typeof value === 'string' ? value.length : 0;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-theme-text-label uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          className={cn(
            'w-full bg-theme-textarea-bg border border-theme-textarea-border text-theme-textarea-text rounded-lg p-3',
            'font-mono text-sm leading-relaxed resize-none',
            'focus:outline-none focus:border-theme-accent transition-colors',
            'placeholder:text-theme-text-muted',
            error && 'border-red-500',
            className
          )}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        {showCount && (
          <div className="absolute bottom-3 right-3 text-[10px] text-theme-text-muted bg-theme-bg-primary/80 px-2 py-1 rounded backdrop-blur-sm">
            {charCount}{maxLength && ` / ${maxLength}`}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};
