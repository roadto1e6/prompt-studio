// 文件路径: frontend/src/components/ui/Slider/index.tsx

/**
 * Slider 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React, { useMemo } from 'react';
import { cn } from '@/utils';
import { useSlider } from './useSlider';
import type { SliderProps } from './types';
import styles from './index.module.css';

/**
 * Slider - 滑块组件主组件
 *
 * @description
 * 采用 Headless UI 模式的生产级滑块组件。
 * 视图层仅负责声明式 UI 结构，所有交互逻辑封装在 useSlider Hook 中。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：useSlider.ts（Headless Hook）
 * - 视图层：index.tsx（本文件）
 *
 * @features
 * - 鼠标拖拽控制
 * - 触摸拖拽控制
 * - 完整键盘导航（方向键、Home/End、PageUp/PageDown）
 * - 轨道点击快速跳转
 * - 实时值显示和格式化
 * - 完整无障碍支持（ARIA）
 *
 * @performance
 * - 使用 React.memo 防止不必要的重渲染
 * - 所有 handlers 已在 Hook 中使用 useCallback 优化
 * - 派生状态使用 useMemo 缓存
 *
 * @accessibility
 * - role="slider" - 滑块角色
 * - aria-valuemin/max/now - 值范围描述
 * - aria-valuetext - 值文本描述
 * - aria-label - 标签描述
 * - aria-disabled - 禁用状态
 * - 完整键盘导航支持
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Volume"
 *   value={volume}
 *   onChange={setVolume}
 *   min={0}
 *   max={100}
 *   step={1}
 *   formatValue={(v) => `${v}%`}
 *   showValue
 * />
 * ```
 */
export const Slider = React.memo<SliderProps>(({
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
  disabled = false,
  className,
  ariaLabel,
  ariaValueText,
}) => {
  // ==================== Hook 状态和方法 ====================
  const slider = useSlider({
    value,
    onChange,
    min,
    max,
    step,
    formatValue,
    disabled,
  });

  // ==================== 派生状态（缓存计算） ====================

  /**
   * 是否显示头部区域（标签或值）
   */
  const showHeader = useMemo(() => {
    return label || showValue;
  }, [label, showValue]);

  /**
   * 是否显示底部标签区域
   */
  const showLabels = useMemo(() => {
    return minLabel || maxLabel;
  }, [minLabel, maxLabel]);

  /**
   * 计算轨道填充宽度（百分比）
   */
  const fillWidth = useMemo(() => {
    return `${slider.percentage}%`;
  }, [slider.percentage]);

  /**
   * 计算滑块手柄位置（百分比）
   */
  const thumbPosition = useMemo(() => {
    return `${slider.percentage}%`;
  }, [slider.percentage]);

  /**
   * ARIA 值文本（优先使用自定义，否则使用格式化值）
   */
  const computedAriaValueText = useMemo(() => {
    return ariaValueText || slider.displayValue;
  }, [ariaValueText, slider.displayValue]);

  /**
   * ARIA 标签（优先使用自定义，否则使用 label）
   */
  const computedAriaLabel = useMemo(() => {
    return ariaLabel || label || 'Slider';
  }, [ariaLabel, label]);

  // ==================== 视图渲染 ====================

  return (
    <div className={cn(styles.container, className)}>
      {/* ==================== 标签和值显示区域 ==================== */}
      {showHeader && (
        <div className={styles.headerRow}>
          {label && (
            <label className={styles.label}>
              {label}
            </label>
          )}
          {showValue && (
            <span
              className={cn(
                styles.valueDisplay,
                slider.isDragging && styles.active
              )}
              aria-live="polite"
              aria-atomic="true"
            >
              {slider.displayValue}
            </span>
          )}
        </div>
      )}

      {/* ==================== 滑块轨道区域 ==================== */}
      <div
        className={cn(
          styles.trackContainer,
          disabled && styles.disabled
        )}
        onClick={slider.handleTrackClick}
      >
        {/* 轨道背景 */}
        <div className={styles.track}>
          {/* 进度填充 */}
          <div
            className={cn(
              styles.trackFill,
              slider.isDragging && styles.dragging
            )}
            style={{ width: fillWidth }}
          />
        </div>

        {/* 滑块手柄 */}
        <div
          className={cn(
            styles.thumb,
            slider.isDragging && styles.dragging,
            slider.dragState === 'keyboard' && styles.keyboard
          )}
          style={{ left: thumbPosition }}
          onMouseDown={slider.handleMouseDown}
          onTouchStart={slider.handleTouchStart}
          onKeyDown={slider.handleKeyDown}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={computedAriaValueText}
          aria-label={computedAriaLabel}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        />

        {/* 隐藏的原生 Input（辅助功能和兼容性） */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={slider.handleInputChange}
          disabled={disabled}
          className={styles.hiddenInput}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* ==================== 最小/最大值标签 ==================== */}
      {showLabels && (
        <div className={styles.labelsRow}>
          <span className={styles.minMaxLabel}>{minLabel}</span>
          <span className={styles.minMaxLabel}>{maxLabel}</span>
        </div>
      )}
    </div>
  );
});

Slider.displayName = 'Slider';
