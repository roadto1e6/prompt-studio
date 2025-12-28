// 文件路径: frontend/src/features/prompts/components/ModelPicker/index.tsx

/**
 * ModelPicker 组件 - 视图层
 * 模型选择器 - 使用浮动面板设计
 *
 * @description
 * 纯声明式 UI，零业务逻辑。
 * 所有状态管理和计算逻辑委托给 useModelPicker Hook。
 */

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '@/utils';
import { useModelPicker } from './useModelPicker';
import type { ModelPickerProps } from './types';
import styles from './index.module.css';

/**
 * ModelPicker - 模型选择器组件
 *
 * @example
 * ```tsx
 * // 分组模式
 * <ModelPicker
 *   label="Model"
 *   value={selectedModel}
 *   onChange={setSelectedModel}
 *   groups={modelGroups}
 * />
 *
 * // 简单模式
 * <ModelPicker
 *   value={selectedOption}
 *   onChange={setSelectedOption}
 *   options={simpleOptions}
 * />
 * ```
 */
const ModelPickerComponent: React.FC<ModelPickerProps> = ({
  label,
  value,
  onChange,
  groups,
  options,
  disabled = false,
  placeholder = 'Select...',
}) => {
  const {
    isExpanded,
    position,
    searchQuery,
    triggerRef,
    panelRef,
    searchInputRef,
    isGroupMode,
    hasSearch,
    selectedItem,
    filteredGroups,
    filteredOptions,
    handleToggle,
    handleSelect,
    setSearchQuery,
    handleClose,
  } = useModelPicker({ value, onChange, groups, options, disabled });

  return (
    <div className="w-full">
      {/* 标签 */}
      {label && <label className={styles.label}>{label}</label>}

      {/* 触发器按钮 */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          styles.trigger,
          isExpanded && styles.triggerExpanded,
          disabled && styles.triggerDisabled
        )}
      >
        <span
          className={cn(
            styles.triggerText,
            selectedItem ? styles.triggerTextSelected : styles.triggerTextPlaceholder
          )}
        >
          {selectedItem?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            styles.chevron,
            isExpanded && styles.chevronRotated
          )}
        />
      </button>

      {/* 浮动面板 - 使用 Portal */}
      {isExpanded && position && createPortal(
        <>
          {/* 遮罩层 */}
          <div className={styles.overlay} onClick={handleClose} />

          {/* 下拉面板 */}
          <div
            ref={panelRef}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              width: position.width,
              zIndex: 9999,
            }}
            className={styles.panel}
          >
            {/* 搜索框 - 仅分组模式 */}
            {hasSearch && (
              <div className={styles.searchContainer}>
                <div className={styles.searchWrapper}>
                  <Search className={styles.searchIcon} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={styles.searchInput}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      className={styles.clearButton}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 选项列表 */}
            <div
              className={cn(
                styles.listContainer,
                isGroupMode ? styles.listContainerGroup : styles.listContainerSimple
              )}
            >
              {isGroupMode ? (
                // 分组模式
                filteredGroups.length === 0 ? (
                  <div className={styles.emptyState}>No results found</div>
                ) : (
                  filteredGroups.map((group, groupIndex) => (
                    <div key={group.providerName}>
                      <div
                        className={cn(
                          styles.groupHeader,
                          groupIndex > 0 && styles.groupHeaderWithBorder
                        )}
                      >
                        <span className={styles.groupLabel}>{group.providerName}</span>
                        <span className={styles.groupCount}>{group.options.length}</span>
                      </div>
                      <div className={styles.optionsWrapper}>
                        {group.options.map((option) => {
                          const isSelected = option.value === value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleSelect(option.value)}
                              className={cn(
                                styles.option,
                                isSelected ? styles.optionSelected : styles.optionDefault
                              )}
                            >
                              <span className={styles.optionLabel}>{option.label}</span>
                              {isSelected && <Check className={styles.optionCheck} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )
              ) : (
                // 简单选项模式
                <div className={styles.optionsWrapper}>
                  {filteredOptions.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                          styles.option,
                          styles.optionSimple,
                          isSelected ? styles.optionSelected : styles.optionDefault
                        )}
                      >
                        <span className={styles.optionLabel}>{option.label}</span>
                        {isSelected && <Check className={styles.optionCheck} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export const ModelPicker = memo(ModelPickerComponent);

ModelPicker.displayName = 'ModelPicker';

// 导出类型
export type { ModelPickerProps, SimpleOption } from './types';
export default ModelPicker;
