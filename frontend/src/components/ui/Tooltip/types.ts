/**
 * Tooltip 组件类型定义
 */

import type { TooltipVariant } from '@/styles/variants';
import type { MutableRefObject } from 'react';

/** Tooltip 位置 */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Tooltip 坐标 */
export interface TooltipPosition {
  x: number;
  y: number;
}

/** useTooltip 配置 */
export interface UseTooltipOptions {
  /** 位置 */
  placement: TooltipPlacement;
  /** 与触发元素的距离（像素） */
  offset?: number;
  /** 延迟显示时间（毫秒） */
  delay?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 样式变体 */
  variant?: TooltipVariant;
}

/** useTooltip 返回值 */
export interface UseTooltipReturn {
  /** 触发元素的 ref */
  triggerRef: MutableRefObject<HTMLElement | null>;
  /** 是否可见 */
  isVisible: boolean;
  /** 鼠标进入处理 */
  handleMouseEnter: () => void;
  /** 鼠标离开处理 */
  handleMouseLeave: () => void;
  /** 获取 Tooltip 样式 */
  getTooltipStyle: () => React.CSSProperties;
  /** 变体样式类名 */
  variantClasses: string;
}

/** Tooltip Props */
export interface TooltipProps {
  /** 提示内容 */
  content: React.ReactNode;
  /** 子元素（触发元素） */
  children: React.ReactElement;
  /** 提示位置 */
  placement?: TooltipPlacement;
  /** 延迟显示时间（毫秒） */
  delay?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 样式变体 */
  variant?: TooltipVariant;
  /** 自定义类名 */
  className?: string;
  /** 与触发元素的距离（像素） */
  offset?: number;
}

/** SimpleTooltip Props */
export interface SimpleTooltipProps {
  /** 提示文本 */
  title: string;
  /** 子元素（触发元素） */
  children: React.ReactElement;
  /** 提示位置 */
  placement?: TooltipPlacement;
  /** 样式变体 */
  variant?: TooltipVariant;
}
