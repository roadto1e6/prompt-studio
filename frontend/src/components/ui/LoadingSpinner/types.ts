/**
 * LoadingSpinner 组件类型定义
 */

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoadingVariant = 'spinner' | 'dots';

export interface LoadingSpinnerProps {
  size?: LoadingSize;
  text?: string;
  fullscreen?: boolean;
  variant?: LoadingVariant;
  className?: string;
  textClassName?: string;
}

export interface ButtonLoadingProps {
  size?: string;
  className?: string;
}

export interface InlineLoadingProps {
  text?: string;
  className?: string;
  iconSize?: string;
}

export interface PageLoadingProps {
  text?: string;
  size?: LoadingSize;
  variant?: LoadingVariant;
  minHeight?: string;
}
