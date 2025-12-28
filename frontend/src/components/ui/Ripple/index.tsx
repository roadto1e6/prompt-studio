// 文件路径: frontend/src/components/ui/Ripple/index.tsx

/**
 * Ripple 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils';
import { useRipple } from './useRipple';
import type { RippleProps, RippleContainerProps } from './types';
import styles from './index.module.css';

/**
 * Ripple - 单个波纹组件
 *
 * @description
 * 使用纯 CSS 动画实现波纹扩散效果。
 * 通过 CSS 自定义属性传递动画参数。
 *
 * @example
 * ```tsx
 * <Ripple x={100} y={50} size={200} />
 * ```
 */
export const Ripple = React.memo<RippleProps>(({
  x,
  y,
  size,
  onAnimationComplete,
}) => {
  const rippleRef = useRef<HTMLSpanElement>(null);

  // 监听动画结束事件
  useEffect(() => {
    const element = rippleRef.current;
    if (!element || !onAnimationComplete) return;

    const handleAnimationEnd = () => {
      onAnimationComplete();
    };

    element.addEventListener('animationend', handleAnimationEnd);
    return () => {
      element.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [onAnimationComplete]);

  return (
    <span
      ref={rippleRef}
      className={styles.ripple}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        '--ripple-size': `${size}px`,
      } as React.CSSProperties}
      aria-hidden="true"
    />
  );
});

Ripple.displayName = 'Ripple';

/**
 * RippleContainer - 波纹容器组件
 *
 * @description
 * Material Design 波纹效果容器。
 * 采用 Headless UI 模式，逻辑与视图分离。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：useRipple.ts（波纹管理）
 * - 视图层：index.tsx（本文件）
 *
 * @performance
 * - React.memo 防止不必要重渲染
 * - useCallback 优化事件处理器
 * - CSS 动画性能优于 JS 动画
 *
 * @accessibility
 * - 波纹元素设置 aria-hidden="true"
 * - 保留原有 onClick 事件语义
 *
 * @example
 * ```tsx
 * <RippleContainer onClick={handleClick}>
 *   <button>点击我</button>
 * </RippleContainer>
 * ```
 *
 * @example
 * ```tsx
 * // 自定义波纹颜色和时长
 * <RippleContainer
 *   rippleColor="rgba(255, 255, 255, 0.3)"
 *   duration={800}
 * >
 *   <div>内容</div>
 * </RippleContainer>
 * ```
 */
export const RippleContainer = React.memo<RippleContainerProps>(({
  children,
  className,
  disabled = false,
  onClick,
  rippleColor = 'currentColor',
  duration = 600,
}) => {
  // ==================== Hook ====================
  const { ripples, handleClick } = useRipple(disabled, duration, onClick);

  // ==================== 渲染 ====================
  return (
    <div
      className={cn(styles.rippleContainer, className)}
      onClick={handleClick}
      style={{
        color: rippleColor,
        '--ripple-duration': `${duration}ms`,
      } as React.CSSProperties}
    >
      {children}
      {ripples.map((ripple) => (
        <Ripple
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          size={ripple.size}
        />
      ))}
    </div>
  );
});

RippleContainer.displayName = 'RippleContainer';
