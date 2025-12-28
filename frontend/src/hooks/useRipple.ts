/**
 * useRipple Hook
 * Material Design 波纹效果
 */

import { useCallback, useState } from 'react';

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    // 计算点击位置
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 计算波纹大小（使其覆盖整个元素）
    const size = Math.max(rect.width, rect.height) * 2;

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    // 动画结束后移除波纹
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600); // 与 CSS 动画时长匹配
  }, []);

  return { ripples, addRipple };
}
