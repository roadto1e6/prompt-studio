import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '@/utils';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  maxHeight?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  emptyMessage?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  onValueChange,
  options = [],
  groups = [],
  placeholder = 'Select an option...',
  error,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  maxHeight = 320,
  className,
  size = 'md',
  emptyMessage = 'No options found',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Flatten all options for keyboard navigation
  const allOptions = useMemo(() => {
    if (groups.length > 0) {
      return groups.flatMap(g => g.options);
    }
    return options;
  }, [options, groups]);

  // Filter options based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups;
    const query = searchQuery.toLowerCase();
    return groups
      .map(group => ({
        ...group,
        options: group.options.filter(opt =>
          opt.label.toLowerCase().includes(query) ||
          opt.value.toLowerCase().includes(query) ||
          opt.description?.toLowerCase().includes(query)
        ),
      }))
      .filter(group => group.options.length > 0);
  }, [groups, searchQuery]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(opt =>
      opt.label.toLowerCase().includes(query) ||
      opt.value.toLowerCase().includes(query) ||
      opt.description?.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Get all visible options for keyboard navigation
  const visibleOptions = useMemo(() => {
    if (groups.length > 0 || filteredGroups.length > 0) {
      return filteredGroups.flatMap(g => g.options);
    }
    return filteredOptions;
  }, [filteredGroups, filteredOptions, groups.length]);

  // Find selected option label
  const selectedLabel = useMemo(() => {
    const found = allOptions.find(opt => opt.value === value);
    return found?.label || '';
  }, [allOptions, value]);

  // Handle option selection
  const handleSelect = useCallback((optionValue: string) => {
    if (onChange) {
      onChange({ target: { value: optionValue } });
    }
    if (onValueChange) {
      onValueChange(optionValue);
    }
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  }, [onChange, onValueChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-option]');
      const item = items[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightedIndex >= 0 && visibleOptions[highlightedIndex]) {
          handleSelect(visibleOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev =>
            prev < visibleOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev =>
            prev > 0 ? prev - 1 : visibleOptions.length - 1
          );
        }
        break;
      case 'Home':
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      case 'End':
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(visibleOptions.length - 1);
        }
        break;
    }
  }, [disabled, isOpen, highlightedIndex, visibleOptions, handleSelect]);

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  };

  const hasGroups = groups.length > 0 || filteredGroups.length > 0;
  const isEmpty = hasGroups ? filteredGroups.length === 0 : filteredOptions.length === 0;

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between',
            'bg-dark-800 border rounded-lg',
            'transition-colors',
            'text-left cursor-pointer',
            sizeClasses[size],
            isOpen
              ? 'border-indigo-500'
              : 'border-slate-700 hover:border-slate-600',
            error && 'border-red-500',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          <span className={cn(
            'truncate',
            selectedLabel ? 'text-slate-300' : 'text-slate-500'
          )}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ml-2',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={cn(
              'absolute z-50 w-full mt-1',
              'bg-dark-800',
              'border border-slate-700',
              'rounded-xl shadow-xl',
              'overflow-hidden'
            )}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-slate-700/80">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={searchPlaceholder}
                    className={cn(
                      'w-full pl-9 pr-9 py-2 text-sm',
                      'bg-dark-900 border border-slate-700',
                      'rounded-lg',
                      'text-slate-300',
                      'placeholder:text-slate-500',
                      'focus:outline-none focus:border-indigo-500 transition-colors'
                    )}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        inputRef.current?.focus();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              ref={listRef}
              className="overflow-y-auto overscroll-contain px-2 py-2"
              style={{ maxHeight }}
            >
              {isEmpty ? (
                <div className="px-3 py-8 text-center text-sm text-slate-500">
                  {emptyMessage}
                </div>
              ) : hasGroups ? (
                // Render grouped options
                <div className="space-y-3">
                  {filteredGroups.map((group) => (
                    <div key={group.label}>
                      {/* Group Header */}
                      <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {group.label}
                        </span>
                        <span className="text-[10px] text-slate-600 bg-dark-700 px-1.5 py-0.5 rounded">
                          {group.options.length}
                        </span>
                      </div>
                      {/* Group Options */}
                      <div className="space-y-0.5">
                        {group.options.map((option) => {
                          const globalIndex = visibleOptions.findIndex(o => o.value === option.value);
                          const isHighlighted = globalIndex === highlightedIndex;
                          const isSelected = option.value === value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              data-option
                              onClick={() => handleSelect(option.value)}
                              onMouseEnter={() => setHighlightedIndex(globalIndex)}
                              className={cn(
                                'group w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors',
                                isHighlighted
                                  ? 'bg-indigo-500/10 text-indigo-400'
                                  : isSelected
                                    ? 'bg-dark-700 text-slate-200'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                              )}
                            >
                              {option.icon && (
                                <span className="flex-shrink-0 text-slate-500 group-hover:text-slate-400">
                                  {option.icon}
                                </span>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className={cn(
                                  'text-sm font-medium truncate',
                                  isSelected && 'text-indigo-400'
                                )}>
                                  {option.label}
                                </div>
                                {option.description && (
                                  <div className="text-xs text-slate-500 truncate mt-0.5">
                                    {option.description}
                                  </div>
                                )}
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Render flat options
                <div className="space-y-0.5">
                  {filteredOptions.map((option, index) => {
                    const isHighlighted = index === highlightedIndex;
                    const isSelected = option.value === value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        data-option
                        onClick={() => handleSelect(option.value)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={cn(
                          'group w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors',
                          isHighlighted
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : isSelected
                              ? 'bg-dark-700 text-slate-200'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        )}
                      >
                        {option.icon && (
                          <span className="flex-shrink-0 text-slate-500 group-hover:text-slate-400">
                            {option.icon}
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            'text-sm font-medium truncate',
                            isSelected && 'text-indigo-400'
                          )}>
                            {option.label}
                          </div>
                          {option.description && (
                            <div className="text-xs text-slate-500 truncate mt-0.5">
                              {option.description}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};
