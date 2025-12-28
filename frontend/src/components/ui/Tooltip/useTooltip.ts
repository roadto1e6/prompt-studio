/**
 * Tooltip 逻辑层
 * 合并位置计算和延迟显示逻辑
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { tooltipVariants } from '@/styles/variants';
import type { UseTooltipOptions, UseTooltipReturn, TooltipPosition } from './types';

/**
 * Tooltip Hook
 * 处理位置计算、延迟显示、暂停/恢复
 */
export function useTooltip(options: UseTooltipOptions): UseTooltipReturn {
  const { placement, offset = 8, delay = 200, disabled = false, variant = 'default' } = options;

  // 触发元素的 ref（使用 null 类型使 current 可赋值）
  const triggerRef = useRef<HTMLElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  const timeoutRef = useRef<number | null>(null);

  /** 更新位置 */
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    let x = 0;
    let y = 0;

    switch (placement) {
      case 'top':
        x = rect.left + rect.width / 2;
        y = rect.top - offset;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2;
        y = rect.bottom + offset;
        break;
      case 'left':
        x = rect.left - offset;
        y = rect.top + rect.height / 2;
        break;
      case 'right':
        x = rect.right + offset;
        y = rect.top + rect.height / 2;
        break;
    }

    setPosition({ x, y });
  }, [triggerRef, placement, offset]);

  /** 获取 Tooltip 样式 */
  const getTooltipStyle = useCallback((): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      pointerEvents: 'none',
    };

    switch (placement) {
      case 'top':
        return { ...baseStyle, left: position.x, top: position.y, transform: 'translate(-50%, -100%)' };
      case 'bottom':
        return { ...baseStyle, left: position.x, top: position.y, transform: 'translate(-50%, 0)' };
      case 'left':
        return { ...baseStyle, left: position.x, top: position.y, transform: 'translate(-100%, -50%)' };
      case 'right':
        return { ...baseStyle, left: position.x, top: position.y, transform: 'translate(0, -50%)' };
    }
  }, [placement, position]);

  /** 鼠标进入 */
  const handleMouseEnter = useCallback(() => {
    if (disabled) return;

    timeoutRef.current = window.setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delay);
  }, [disabled, delay, updatePosition]);

  /** 鼠标离开 */
  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  /** 清理定时器 */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /** 变体样式类名 */
  const variantClasses = useMemo(() => tooltipVariants[variant].base, [variant]);

  return {
    triggerRef,
    isVisible,
    handleMouseEnter,
    handleMouseLeave,
    getTooltipStyle,
    variantClasses,
  };
}
