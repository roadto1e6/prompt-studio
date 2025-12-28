// 文件路径: frontend/src/components/ui/Ripple/useRipple.ts

/**
 * Ripple 逻辑层
 * Headless Hook：封装波纹创建与移除逻辑
 */

import { useState, useCallback, useRef } from 'react';
import type { RippleItem, UseRippleReturn } from './types';

/**
 * Ripple Headless Hook
 *
 * @description
 * 封装波纹效果的状态管理和生命周期控制。
 * 使用 useCallback 优化所有事件处理器，防止不必要的重渲染。
 *
 * @param disabled - 是否禁用波纹效果
 * @param duration - 波纹动画时长（ms，默认 600）
 * @param onClick - 外部点击事件回调
 *
 * @example
 * ```tsx
 * const { ripples, handleClick } = useRipple(false, 600, handleExternalClick);
 * ```
 */
export function useRipple(
  disabled: boolean = false,
  duration: number = 600,
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
): UseRippleReturn {
  // ==================== 状态管理 ====================

  /** 波纹列表 */
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  /** 波纹 ID 计数器（使用 ref 避免重渲染） */
  const rippleIdRef = useRef(0);

  // ==================== 波纹操作 ====================

  /**
   * 创建新波纹
   * @param x - 波纹中心 X 坐标
   * @param y - 波纹中心 Y 坐标
   * @param size - 波纹直径大小
   */
  const createRipple = useCallback((x: number, y: number, size: number) => {
    const id = rippleIdRef.current++;
    const newRipple: RippleItem = { x, y, size, id };

    setRipples((prev) => [...prev, newRipple]);

    // 动画结束后自动移除波纹
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, duration);
  }, [duration]);

  /**
   * 移除指定波纹
   * @param id - 波纹唯一标识
   */
  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // ==================== 事件处理 ====================

  /**
   * 处理点击事件
   * 计算波纹位置和大小，创建新波纹
   */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 禁用状态不创建波纹
      if (disabled) {
        onClick?.(e);
        return;
      }

      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();

      // 计算波纹中心点（相对于容器）
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 计算波纹大小（容器最大边长的 2 倍，确保覆盖整个容器）
      const size = Math.max(rect.width, rect.height) * 2;

      createRipple(x, y, size);

      // 触发外部点击回调
      onClick?.(e);
    },
    [disabled, createRipple, onClick]
  );

  // ==================== 返回值 ====================

  return {
    ripples,
    createRipple,
    removeRipple,
    handleClick,
  };
}
