import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
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

  // Update dropdown position when opened
  const updatePosition = useCallback(() => {
    if (buttonRef.current && isOpen) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        // Check if click is not on the portal dropdown
        !(event.target as Element).closest('[data-select-dropdown]')
      ) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

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
        <label className="block text-xs font-bold text-theme-text-label uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Trigger Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between',
            'bg-theme-select-bg border rounded-lg',
            'transition-colors',
            'text-left cursor-pointer',
            sizeClasses[size],
            isOpen
              ? 'border-theme-accent'
              : 'border-theme-select-border hover:border-theme-border-light',
            error && 'border-red-500',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          <span className={cn(
            'truncate',
            selectedLabel ? 'text-theme-text-primary' : 'text-theme-text-muted'
          )}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-theme-text-muted transition-transform duration-200 flex-shrink-0 ml-2',
              isOpen && 'rotate-180'
            )}
          />
        </button>

      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}

      {/* Dropdown Portal */}
      {isOpen && createPortal(
        <div
          data-select-dropdown
          className={cn(
            'fixed z-[9999]',
            'bg-theme-card-bg',
            'border border-theme-card-border',
            'rounded-xl shadow-2xl',
            'overflow-hidden'
          )}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-theme-border/80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
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
                    'bg-theme-input-bg border border-theme-input-border',
                    'rounded-lg',
                    'text-theme-input-text',
                    'placeholder:text-theme-text-muted',
                    'focus:outline-none focus:border-theme-accent transition-colors'
                  )}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      inputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-text-primary transition-colors"
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
                <div className="px-3 py-8 text-center text-sm text-theme-text-muted">
                  {emptyMessage}
                </div>
              ) : hasGroups ? (
                // Render grouped options
                <div className="space-y-3">
                  {filteredGroups.map((group) => (
                    <div key={group.label}>
                      {/* Group Header */}
                      <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                        <span className="text-xs font-semibold text-theme-text-label uppercase tracking-wider">
                          {group.label}
                        </span>
                        <span className="text-[10px] text-theme-text-muted bg-theme-bg-tertiary px-1.5 py-0.5 rounded">
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
                                    ? 'bg-theme-select-option-selected text-theme-text-primary'
                                    : 'text-theme-text-secondary hover:bg-theme-select-option-hover hover:text-theme-text-primary'
                              )}
                            >
                              {option.icon && (
                                <span className="flex-shrink-0 text-theme-text-muted group-hover:text-theme-text-secondary">
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
                                  <div className="text-xs text-theme-text-muted truncate mt-0.5">
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
                              ? 'bg-theme-select-option-selected text-theme-text-primary'
                              : 'text-theme-text-secondary hover:bg-theme-select-option-hover hover:text-theme-text-primary'
                        )}
                      >
                        {option.icon && (
                          <span className="flex-shrink-0 text-theme-text-muted group-hover:text-theme-text-secondary">
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
                            <div className="text-xs text-theme-text-muted truncate mt-0.5">
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
          </div>,
        document.body
      )}
    </div>
  );
};
