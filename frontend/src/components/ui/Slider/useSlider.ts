// 文件路径: frontend/src/components/ui/Slider/useSlider.ts

/**
 * Slider 逻辑层
 * Headless UI Hook：封装所有拖拽逻辑、值计算和键盘控制
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { SliderValue, DragState, UseSliderReturn } from './types';

/**
 * useSlider Hook 参数接口
 */
interface UseSliderParams {
  /** 当前值 */
  value: SliderValue;
  /** 值变化回调 */
  onChange: (value: SliderValue) => void;
  /** 最小值 */
  min: number;
  /** 最大值 */
  max: number;
  /** 步进值 */
  step: number;
  /** 值格式化函数 */
  formatValue: (value: SliderValue) => string;
  /** 是否禁用 */
  disabled: boolean;
}

/**
 * 将值限制在最小值和最大值之间
 */
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 将值调整到最接近的步进值
 * 修复浮点数精度问题
 */
const roundToStep = (value: number, step: number): number => {
  // 计算步进值的小数位数
  const stepDecimals = step.toString().split('.')[1]?.length || 0;
  const result = Math.round(value / step) * step;
  // 使用 toFixed 修复浮点数精度问题，然后转回数字
  return Number(result.toFixed(stepDecimals));
};

/**
 * 计算百分比位置（0-100）
 */
const calculatePercentage = (value: number, min: number, max: number): number => {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
};

/**
 * 从鼠标/触摸位置计算值
 */
const calculateValueFromPosition = (
  clientX: number,
  rect: DOMRect,
  min: number,
  max: number,
  step: number
): number => {
  const percentage = clamp((clientX - rect.left) / rect.width, 0, 1);
  const rawValue = min + percentage * (max - min);
  const steppedValue = roundToStep(rawValue, step);
  return clamp(steppedValue, min, max);
};

/**
 * Slider Headless Hook
 *
 * @description
 * 封装滑块的所有交互逻辑：
 * - 鼠标拖拽
 * - 触摸拖拽
 * - 键盘控制（方向键、Home/End、PageUp/PageDown）
 * - 轨道点击快速跳转
 * - 值计算和格式化
 *
 * @architecture
 * 采用 Headless UI 模式，视图层只需调用返回的 handlers 和 state。
 *
 * @performance
 * - 所有事件处理器使用 useCallback 优化
 * - 计算属性使用 useMemo 缓存
 * - 使用 ref 避免闭包陷阱
 *
 * @accessibility
 * - 完整的键盘导航支持
 * - ARIA 属性支持
 * - 焦点管理
 *
 * @example
 * ```tsx
 * const slider = useSlider({
 *   value,
 *   onChange,
 *   min: 0,
 *   max: 100,
 *   step: 1,
 *   formatValue: (v) => `${v}%`,
 *   disabled: false,
 * });
 * ```
 */
export function useSlider({
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
  disabled,
}: UseSliderParams): UseSliderReturn {
  // ==================== Client State ====================
  const [dragState, setDragState] = useState<DragState>('idle');

  // ==================== Refs ====================
  // 用于存储拖拽时的滑块引用
  const sliderRef = useRef<HTMLDivElement | null>(null);
  // 用于存储最新的值（避免闭包陷阱）
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // ==================== 派生状态（缓存计算） ====================

  /**
   * 是否正在拖拽
   */
  const isDragging = dragState === 'dragging';

  /**
   * 计算百分比位置（0-100）
   */
  const percentage = useMemo(() => {
    return calculatePercentage(value, min, max);
  }, [value, min, max]);

  /**
   * 格式化后的显示值
   */
  const displayValue = useMemo(() => {
    return formatValue(value);
  }, [value, formatValue]);

  // ==================== 值更新逻辑 ====================

  /**
   * 更新值（带验证和步进处理）
   */
  const updateValue = useCallback(
    (newValue: number) => {
      if (disabled) return;

      const clampedValue = clamp(newValue, min, max);
      const steppedValue = roundToStep(clampedValue, step);

      // 仅在值实际改变时触发回调
      if (steppedValue !== valueRef.current) {
        onChange(steppedValue);
      }
    },
    [disabled, min, max, step, onChange]
  );

  // ==================== 鼠标拖拽处理 ====================

  /**
   * 鼠标移动处理（拖拽中）
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const newValue = calculateValueFromPosition(e.clientX, rect, min, max, step);
      updateValue(newValue);
    },
    [min, max, step, updateValue]
  );

  /**
   * 鼠标释放处理（结束拖拽）
   */
  const handleMouseUp = useCallback(() => {
    setDragState('idle');
  }, []);

  /**
   * 鼠标按下处理（开始拖拽）
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      e.preventDefault();
      setDragState('dragging');

      // 保存轨道容器引用（thumb 的父元素）
      const trackContainer = e.currentTarget.parentElement as HTMLDivElement;
      sliderRef.current = trackContainer;

      // 立即更新值到点击位置
      if (trackContainer) {
        const rect = trackContainer.getBoundingClientRect();
        const newValue = calculateValueFromPosition(e.clientX, rect, min, max, step);
        updateValue(newValue);
      }
    },
    [disabled, min, max, step, updateValue]
  );

  // ==================== 触摸拖拽处理 ====================

  /**
   * 触摸移动处理（拖拽中）
   */
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!sliderRef.current || e.touches.length === 0) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const newValue = calculateValueFromPosition(touch.clientX, rect, min, max, step);
      updateValue(newValue);
    },
    [min, max, step, updateValue]
  );

  /**
   * 触摸结束处理（结束拖拽）
   */
  const handleTouchEnd = useCallback(() => {
    setDragState('idle');
  }, []);

  /**
   * 触摸开始处理（开始拖拽）
   */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (disabled || e.touches.length === 0) return;

      e.preventDefault();
      setDragState('dragging');

      // 保存轨道容器引用（thumb 的父元素）
      const trackContainer = e.currentTarget.parentElement as HTMLDivElement;
      sliderRef.current = trackContainer;

      // 立即更新值到触摸位置
      if (trackContainer) {
        const rect = trackContainer.getBoundingClientRect();
        const touch = e.touches[0];
        const newValue = calculateValueFromPosition(touch.clientX, rect, min, max, step);
        updateValue(newValue);
      }
    },
    [disabled, min, max, step, updateValue]
  );

  // ==================== 键盘控制处理 ====================

  /**
   * 键盘事件处理
   * 支持：方向键、Home/End、PageUp/PageDown
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      let handled = false;
      let newValue = value;

      // 计算大步进（10% 的范围）
      const largeStep = Math.max(step, (max - min) / 10);

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          // 增加一个步进
          newValue = value + step;
          handled = true;
          break;

        case 'ArrowLeft':
        case 'ArrowDown':
          // 减少一个步进
          newValue = value - step;
          handled = true;
          break;

        case 'PageUp':
          // 增加大步进
          newValue = value + largeStep;
          handled = true;
          break;

        case 'PageDown':
          // 减少大步进
          newValue = value - largeStep;
          handled = true;
          break;

        case 'Home':
          // 跳到最小值
          newValue = min;
          handled = true;
          break;

        case 'End':
          // 跳到最大值
          newValue = max;
          handled = true;
          break;
      }

      if (handled) {
        e.preventDefault();
        setDragState('keyboard');
        updateValue(newValue);

        // 延迟重置键盘状态
        setTimeout(() => {
          setDragState('idle');
        }, 150);
      }
    },
    [disabled, value, min, max, step, updateValue]
  );

  // ==================== 原生 Input 处理 ====================

  /**
   * 原生 input[type=range] 变化处理
   * 作为备用方案，确保兼容性
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      updateValue(parseFloat(e.target.value));
    },
    [disabled, updateValue]
  );

  // ==================== 轨道点击处理 ====================

  /**
   * 轨道点击处理（快速跳转）
   */
  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const newValue = calculateValueFromPosition(e.clientX, rect, min, max, step);
      updateValue(newValue);
    },
    [disabled, min, max, step, updateValue]
  );

  // ==================== 副作用：拖拽事件监听 ====================

  /**
   * 监听全局鼠标/触摸事件（拖拽中）
   */
  useEffect(() => {
    if (dragState !== 'dragging') return;

    // 添加全局事件监听
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    // 清理函数
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragState, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  /**
   * 防止拖拽时文本选择
   */
  useEffect(() => {
    if (dragState === 'dragging') {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    } else {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    }

    return () => {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [dragState]);

  // ==================== 返回值 ====================

  return {
    // 状态
    value,
    dragState,
    isDragging,
    percentage,
    displayValue,

    // 处理器（全部使用 useCallback 优化）
    handleMouseDown,
    handleTouchStart,
    handleKeyDown,
    handleInputChange,
    handleTrackClick,
  };
}
