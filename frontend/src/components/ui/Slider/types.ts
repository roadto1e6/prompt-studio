// 文件路径: frontend/src/components/ui/Slider/types.ts

/**
 * Slider 类型定义
 * 契约层：先设计数据结构，后写逻辑
 */

/**
 * 滑块值类型
 */
export type SliderValue = number;

/**
 * 滑块拖拽状态
 */
export type DragState = 'idle' | 'dragging' | 'keyboard';

/**
 * Hook 返回的状态和方法
 */
export interface UseSliderReturn {
  /** 当前值 */
  value: SliderValue;
  /** 拖拽状态 */
  dragState: DragState;
  /** 是否正在拖拽 */
  isDragging: boolean;
  /** 计算百分比位置（用于样式） */
  percentage: number;
  /** 格式化后的显示值 */
  displayValue: string;

  /** 鼠标按下事件 */
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** 触摸开始事件 */
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  /** 键盘事件 */
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  /** 输入变化事件（用于 input[type=range]） */
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 轨道点击事件（快速跳转） */
  handleTrackClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * 组件 Props
 */
export interface SliderProps {
  /** 标签文本（可选） */
  label?: string;
  /** 当前值 */
  value: SliderValue;
  /** 值变化回调 */
  onChange: (value: SliderValue) => void;
  /** 最小值（默认 0） */
  min?: number;
  /** 最大值（默认 100） */
  max?: number;
  /** 步进值（默认 1） */
  step?: number;
  /** 最小值标签（可选） */
  minLabel?: string;
  /** 最大值标签（可选） */
  maxLabel?: string;
  /** 是否显示当前值（默认 true） */
  showValue?: boolean;
  /** 值格式化函数（可选） */
  formatValue?: (value: SliderValue) => string;
  /** 是否禁用（默认 false） */
  disabled?: boolean;
  /** 自定义类名（可选） */
  className?: string;
  /** ARIA 标签（无障碍支持） */
  ariaLabel?: string;
  /** ARIA 描述（无障碍支持） */
  ariaValueText?: string;
}
