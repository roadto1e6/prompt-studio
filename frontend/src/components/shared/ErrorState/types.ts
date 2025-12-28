// 文件路径: frontend/src/components/shared/ErrorState/types.ts

/**
 * ErrorState 类型定义
 * 契约层：错误状态组件的类型契约
 */

/**
 * 错误状态变体类型
 * - error: 错误状态（红色）
 * - warning: 警告状态（黄色）
 * - offline: 离线/网络错误状态（灰色）
 */
export type ErrorStateVariant = 'error' | 'warning' | 'offline';

/**
 * 变体配置对象
 * 定义每种错误类型的视觉样式
 */
export interface VariantConfig {
  /** 图标颜色类名 */
  iconColor: string;
  /** 背景颜色类名 */
  bgColor: string;
  /** 边框颜色类名 */
  borderColor: string;
}

/**
 * 变体配置映射
 * 键为变体类型，值为对应的样式配置
 */
export type VariantConfigMap = Record<ErrorStateVariant, VariantConfig>;

/**
 * ErrorState 基础 Props
 */
export interface ErrorStateProps {
  /**
   * 错误标题
   * @default '出错了'
   */
  title?: string;

  /**
   * 错误描述信息
   * @default '抱歉，发生了一个错误。请稍后重试。'
   */
  message?: string;

  /**
   * 错误类型变体
   * @default 'error'
   */
  variant?: ErrorStateVariant;

  /**
   * 重试回调函数
   * 存在时显示「重试」按钮
   */
  onRetry?: () => void;

  /**
   * 返回首页回调函数
   * 存在时显示「返回首页」按钮
   */
  onGoHome?: () => void;

  /**
   * 自定义样式类名
   */
  className?: string;
}

/**
 * NetworkErrorState Props
 * 网络错误状态的简化属性接口
 */
export interface NetworkErrorStateProps {
  /**
   * 重试回调函数
   */
  onRetry?: () => void;

  /**
   * 自定义样式类名
   */
  className?: string;
}

/**
 * NotFoundState Props
 * 404错误状态的简化属性接口
 */
export interface NotFoundStateProps {
  /**
   * 返回首页回调函数
   */
  onGoHome?: () => void;

  /**
   * 自定义样式类名
   */
  className?: string;
}

/**
 * Hook 返回值
 */
export interface UseErrorStateReturn {
  /**
   * 当前变体的配置对象
   */
  config: VariantConfig;

  /**
   * 处理重试按钮点击
   */
  handleRetry: () => void;

  /**
   * 处理返回首页按钮点击
   */
  handleGoHome: () => void;
}
