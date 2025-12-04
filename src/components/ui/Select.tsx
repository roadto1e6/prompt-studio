import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options?: SelectOption[];
  groups?: SelectGroup[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  groups,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            'w-full bg-dark-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm',
            'focus:outline-none focus:border-indigo-500 transition-colors',
            'appearance-none cursor-pointer',
            error && 'border-red-500',
            className
          )}
          {...props}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {groups?.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};
