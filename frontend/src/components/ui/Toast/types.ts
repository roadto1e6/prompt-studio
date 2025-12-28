/**
 * Toast 组件类型定义
 */

import type { Toast as ToastData } from '@/stores/toastStore';
import type { ToastVariant } from '@/styles/variants';

/**
 * Toast 定时器配置
 */
export interface ToastTimerOptions {
  /** 持续时间（毫秒） */
  duration?: number;
  /** 关闭回调 */
  onClose: () => void;
  /** 是否暂停 */
  isPaused: boolean;
}

/**
 * Toast 定时器返回值
 */
export interface ToastTimerReturn {
  /** 进度百分比（0-100） */
  progress: number;
}

/**
 * 单个 Toast 项 Props
 */
export interface ToastItemProps {
  /** Toast 数据 */
  toast: ToastData;
  /** 关闭回调 */
  onClose: () => void;
}

/**
 * Toast 图标映射类型
 */
export type ToastIconMap = Record<ToastVariant, React.ComponentType<{ className?: string }>>;
