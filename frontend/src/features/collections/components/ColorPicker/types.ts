// 文件路径: frontend/src/features/collections/components/ColorPicker/types.ts

/**
 * ColorPicker 类型定义
 * 契约层：纯展示型组件的类型契约
 */

import type { CollectionColorKey } from '../../styles/collectionStyles';

/**
 * 颜色选择器尺寸
 */
export type ColorPickerSize = 'sm' | 'md' | 'lg';

/**
 * ColorPicker 基础 Props
 */
export interface ColorPickerProps {
  /** 当前选中的颜色键 */
  value: CollectionColorKey;
  /** 颜色变化回调 */
  onChange: (color: CollectionColorKey) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 标签文本 */
  label?: string;
  /** 自定义样式类名 */
  className?: string;
  /** 显示选中图标（默认 true） */
  showCheckIcon?: boolean;
  /** 尺寸（默认 'md'） */
  size?: ColorPickerSize;
}

/**
 * Hook 返回值
 */
export interface UseColorPickerReturn {
  /** 处理颜色选择 */
  handleColorSelect: (color: CollectionColorKey) => void;
}
