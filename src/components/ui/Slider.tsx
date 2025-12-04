import React from 'react';
import { cn } from '@/utils';

interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  minLabel,
  maxLabel,
  showValue = true,
  formatValue = (v) => v.toString(),
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between mb-2">
          {label && (
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-xs text-indigo-400 font-mono">
              {formatValue(value)}
            </span>
          )}
        </div>
      )}
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={cn(
          'w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer',
          'accent-indigo-500',
          '[&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
          '[&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:cursor-pointer',
          '[&::-webkit-slider-thumb]:transition-transform',
          '[&::-webkit-slider-thumb]:hover:scale-110'
        )}
      />
      
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
};
