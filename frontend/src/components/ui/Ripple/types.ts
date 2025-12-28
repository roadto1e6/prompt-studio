// 文件路径: frontend/src/components/ui/Ripple/types.ts

/**
 * Ripple 类型定义
 * 契约层：波纹效果组件的类型契约
 */

/**
 * 波纹项数据结构
 */
export interface RippleItem {
  /** 波纹中心 X 坐标（相对于容器） */
  x: number;
  /** 波纹中心 Y 坐标（相对于容器） */
  y: number;
  /** 波纹直径大小 */
  size: number;
  /** 唯一标识符 */
  id: number;
}

/**
 * 单个波纹组件 Props
 */
export interface RippleProps {
  /** 波纹中心 X 坐标 */
  x: number;
  /** 波纹中心 Y 坐标 */
  y: number;
  /** 波纹直径大小 */
  size: number;
  /** 动画完成回调 */
  onAnimationComplete?: () => void;
}

/**
 * 波纹容器组件 Props
 */
export interface RippleContainerProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 自定义样式类名 */
  className?: string;
  /** 是否禁用波纹效果 */
  disabled?: boolean;
  /** 点击事件回调 */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** 波纹颜色（默认 currentColor） */
  rippleColor?: string;
  /** 波纹动画时长（ms，默认 600） */
  duration?: number;
}

/**
 * useRipple Hook 返回值
 */
export interface UseRippleReturn {
  /** 当前波纹列表 */
  ripples: RippleItem[];
  /** 创建新波纹 */
  createRipple: (x: number, y: number, size: number) => void;
  /** 移除指定波纹 */
  removeRipple: (id: number) => void;
  /** 处理点击事件（封装逻辑） */
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}
