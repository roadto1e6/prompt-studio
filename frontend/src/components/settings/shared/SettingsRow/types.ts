// 文件路径: frontend/src/components/settings/shared/SettingsRow/types.ts

/**
 * SettingsRow 组件类型定义
 * 契约层：定义严格的 TypeScript 类型
 */

import { ReactNode } from 'react';

/**
 * SettingsRow 组件 Props
 */
export interface SettingsRowProps {
  /** 设置项标签 */
  label: string;
  /** 设置项描述（可选） */
  description?: string;
  /** 设置项内容（控件） */
  children: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否垂直布局，默认水平布局 */
  vertical?: boolean;
}

/**
 * useSettingsRow Hook 返回值类型
 */
export interface UseSettingsRowReturn {
  /** 容器样式类名 */
  containerClassName: string;
  /** 标签样式类名 */
  labelClassName: string;
  /** 描述样式类名 */
  descriptionClassName: string;
  /** 内容区域样式类名 */
  contentClassName: string;
}

/**
 * useSettingsRow Hook 参数类型
 */
export interface UseSettingsRowOptions {
  /** 是否垂直布局 */
  vertical: boolean;
  /** 自定义类名 */
  className?: string;
}
