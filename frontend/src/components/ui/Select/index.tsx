// 文件路径: frontend/src/components/ui/Select/index.tsx

/**
 * Select 组件 - 视图层
 * 下拉选择器，纯声明式 UI
 *
 * @description
 * 采用 Headless UI 模式的生产级组件。
 * 视图层仅负责声明式 UI 结构，所有业务逻辑封装在 useSelect Hook 中。
 */

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '@/utils';
import { buttonSizes } from '@/styles/variants';
import { useSelect } from './useSelect';
import type { SelectProps, SelectOption, SelectGroup, SelectPosition } from './types';
import styles from './index.module.css';

// ============ 内联子组件（纯展示） ============

/** 触发按钮 */
const SelectTrigger = memo<{
  isOpen: boolean;
  selectedLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  triggerRef?: React.RefObject<HTMLButtonElement>;
}>(({
  isOpen,
  selectedLabel,
  placeholder = 'Select an option...',
  disabled = false,
  error = false,
  size = 'md',
  className,
  onClick,
  onKeyDown,
  triggerRef,
}) => {
  const sizeClasses = {
    sm: buttonSizes.sm.base,
    md: buttonSizes.md.base,
    lg: buttonSizes.lg.base,
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={cn(
        styles.trigger,
        sizeClasses[size],
        isOpen ? styles.triggerOpen : styles.triggerClosed,
        error && !isOpen && styles.triggerError,
        disabled && styles.triggerDisabled,
        className
      )}
    >
      <span className={cn('truncate flex-1', selectedLabel ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]')}>
        {selectedLabel || placeholder}
      </span>
      <ChevronDown className={cn('w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-200 flex-shrink-0 ml-2', isOpen && 'rotate-180', disabled && 'opacity-50')} />
    </button>
  );
});

SelectTrigger.displayName = 'SelectTrigger';

/** 下拉菜单 */
const SelectDropdown = memo<{
  isOpen: boolean;
  position: SelectPosition;
  children: React.ReactNode;
}>(({ isOpen, position, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      data-select-dropdown
      className={styles.dropdown}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        transformOrigin: position.flipUp ? 'bottom center' : 'top center',
      }}
    >
      {children}
    </div>,
    document.body
  );
});

SelectDropdown.displayName = 'SelectDropdown';

/** 搜索框 */
const SelectSearch = memo<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}>(({ value, onChange, placeholder = 'Search...', onKeyDown, inputRef }) => (
  <div className={styles.searchContainer}>
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)] pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={styles.searchInput}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            inputRef?.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-0.5 rounded hover:bg-[var(--color-bg-tertiary)]"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
));

SelectSearch.displayName = 'SelectSearch';

/** 选项项 */
const SelectOptionItem = memo<{
  option: SelectOption;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}>(({ option, isSelected, isHighlighted, onClick, onMouseEnter }) => (
  <button
    type="button"
    data-option
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={cn(
      'group',
      styles.optionItem,
      isHighlighted ? styles.optionHighlighted : isSelected ? styles.optionSelected : styles.optionDefault
    )}
  >
    {option.icon && (
      <span className={cn('flex-shrink-0 transition-colors', isHighlighted || isSelected ? 'text-current' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]')}>
        {option.icon}
      </span>
    )}
    <div className="flex-1 min-w-0">
      <div className={cn('text-sm font-medium truncate', isSelected && !isHighlighted && 'text-[var(--color-accent)]')}>
        {option.label}
      </div>
      {option.description && (
        <div className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
          {option.description}
        </div>
      )}
    </div>
    {isSelected && (
      <Check className={cn('w-4 h-4 flex-shrink-0 transition-colors', isHighlighted ? 'text-current' : 'text-[var(--color-accent)]')} />
    )}
  </button>
));

SelectOptionItem.displayName = 'SelectOptionItem';

/** 分组项 */
const SelectGroupItem = memo<{
  group: SelectGroup;
  value?: string;
  highlightedIndex: number;
  allVisibleOptions: SelectOption[];
  onSelect: (value: string) => void;
  onHighlightChange: (index: number) => void;
}>(({ group, value, highlightedIndex, allVisibleOptions, onSelect, onHighlightChange }) => (
  <div className="space-y-0.5">
    <div className="flex items-center justify-between px-2 py-1">
      <span className={styles.groupLabel}>{group.label}</span>
      <span className={styles.groupCount}>{group.options.length}</span>
    </div>
    <div>
      {group.options.map((option) => {
        const globalIndex = allVisibleOptions.findIndex((o) => o.value === option.value);
        return (
          <SelectOptionItem
            key={option.value}
            option={option}
            isSelected={option.value === value}
            isHighlighted={globalIndex === highlightedIndex}
            onClick={() => onSelect(option.value)}
            onMouseEnter={() => onHighlightChange(globalIndex)}
          />
        );
      })}
    </div>
  </div>
));

SelectGroupItem.displayName = 'SelectGroupItem';

// ============ Select 主组件 ============

/**
 * Select - 下拉选择器组件
 *
 * @example
 * ```tsx
 * <Select
 *   label="Category"
 *   value={selected}
 *   onChange={(e) => setSelected(e.target.value)}
 *   options={[
 *     { value: 'a', label: 'Option A' },
 *     { value: 'b', label: 'Option B' },
 *   ]}
 * />
 * ```
 */
const SelectComponent: React.FC<SelectProps> = ({
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
  // ==================== Hook（所有逻辑） ====================
  const select = useSelect({
    value,
    onChange,
    onValueChange,
    options,
    groups,
    disabled,
    searchable,
    maxHeight,
  });

  // ==================== 纯声明式渲染 ====================
  return (
    <div className="w-full" ref={select.containerRef}>
      {label && <label className={styles.label}>{label}</label>}

      <SelectTrigger
        isOpen={select.isOpen}
        selectedLabel={select.selectedLabel}
        placeholder={placeholder}
        disabled={disabled}
        error={!!error}
        size={size}
        onClick={select.handleToggle}
        onKeyDown={select.handleKeyDown}
        triggerRef={select.buttonRef}
        className={className}
      />

      {error && <p className={styles.errorText}>{error}</p>}

      <SelectDropdown isOpen={select.isOpen} position={select.position}>
        {searchable && (
          <SelectSearch
            value={select.searchQuery}
            onChange={select.setSearchQuery}
            placeholder={searchPlaceholder}
            onKeyDown={select.handleKeyDown}
            inputRef={select.inputRef}
          />
        )}

        <div
          ref={select.listRef}
          className="overflow-y-auto overscroll-contain px-1.5 py-1.5"
          style={{ maxHeight: `${select.position.maxHeight}px` }}
        >
          {select.isEmpty ? (
            <div className={styles.emptyMessage}>{emptyMessage}</div>
          ) : select.hasGroups ? (
            <div className="space-y-2">
              {select.filteredGroups.map((group) => (
                <SelectGroupItem
                  key={group.label}
                  group={group}
                  value={value}
                  highlightedIndex={select.highlightedIndex}
                  allVisibleOptions={select.visibleOptions}
                  onSelect={select.handleSelect}
                  onHighlightChange={select.setHighlightedIndex}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-0.5">
              {select.filteredOptions.map((option, index) => (
                <SelectOptionItem
                  key={option.value}
                  option={option}
                  isSelected={option.value === value}
                  isHighlighted={index === select.highlightedIndex}
                  onClick={() => select.handleSelect(option.value)}
                  onMouseEnter={() => select.setHighlightedIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </SelectDropdown>
    </div>
  );
};

SelectComponent.displayName = 'Select';

export const Select = memo(SelectComponent);

// 导出
export type { SelectProps, SelectOption, SelectGroup } from './types';
export default Select;
