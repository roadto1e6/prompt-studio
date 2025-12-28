/**
 * Design System - Theme Configuration
 * 设计系统 - 主题配置
 *
 * 统一管理所有主题相关的配置，包括颜色、间距、圆角、阴影等
 * 这是整个设计系统的基石
 */

/**
 * 颜色系统
 * 基于 CSS 变量，支持深色/浅色主题切换
 */
export const colors = {
  // 主色调
  accent: {
    DEFAULT: 'var(--color-accent)',
    hover: 'var(--color-accent-hover)',
    muted: 'var(--theme-accent-muted)',
    light: 'var(--theme-accent-bg)',
  },

  // 文本颜色
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    muted: 'var(--color-text-muted)',
    label: 'var(--color-text-label)',
    inverse: 'var(--color-text-inverse)',
  },

  // 背景颜色
  bg: {
    primary: 'var(--color-bg-primary)',
    secondary: 'var(--color-bg-secondary)',
    tertiary: 'var(--color-bg-tertiary)',
    overlay: 'var(--overlay-bg)',
  },

  // 边框颜色
  border: {
    DEFAULT: 'var(--color-border)',
    muted: 'var(--color-border-light)',
    focus: 'var(--color-accent)',
  },

  // 按钮颜色（特殊处理）
  button: {
    primary: {
      bg: 'var(--color-accent)',
      hover: 'var(--color-accent-hover)',
      text: 'white',
    },
    secondary: {
      bg: 'var(--button-secondary-bg)',
      hover: 'var(--button-secondary-hover)',
      text: 'var(--button-secondary-text)',
      border: 'var(--button-secondary-border)',
    },
    ghost: {
      bg: 'transparent',
      hover: 'var(--button-ghost-hover)',
      text: 'var(--color-text-secondary)',
      textHover: 'var(--color-text-primary)',
    },
    outline: {
      bg: 'transparent',
      hover: 'var(--overlay-bg)',
      border: 'var(--button-outline-border)',
      text: 'var(--color-text-primary)',
    },
    danger: {
      bg: '#ef4444',
      hover: '#dc2626',
      text: 'white',
    },
  },

  // 状态颜色
  status: {
    success: {
      DEFAULT: '#10b981',
      light: 'rgba(16, 185, 129, 0.1)',
      dark: '#059669',
    },
    error: {
      DEFAULT: '#ef4444',
      light: 'rgba(239, 68, 68, 0.1)',
      dark: '#dc2626',
    },
    warning: {
      DEFAULT: '#f59e0b',
      light: 'rgba(245, 158, 11, 0.1)',
      dark: '#d97706',
    },
    info: {
      DEFAULT: '#3b82f6',
      light: 'rgba(59, 130, 246, 0.1)',
      dark: '#2563eb',
    },
  },

  // 语义化颜色
  semantic: {
    link: 'var(--color-accent)',
    linkHover: 'var(--color-accent-hover)',
    selection: 'var(--theme-accent-muted)',
    focus: 'var(--color-accent)',
  },
} as const;

/**
 * 间距系统
 * 基于 4px 网格系统（4, 8, 12, 16, 20, 24, 32, 40, 48, 64）
 */
export const spacing = {
  // 固定间距
  none: '0',
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  '4xl': '2.5rem',  // 40px
  '5xl': '3rem',    // 48px
  '6xl': '4rem',    // 64px

  // 组件间距
  component: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },

  // 内边距
  padding: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },

  // 外边距
  margin: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
  },
} as const;

/**
 * 圆角系统
 */
export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // 完全圆角

  // 组件圆角
  button: '0.5rem',     // 8px
  input: '0.5rem',      // 8px
  card: '0.75rem',      // 12px
  modal: '1rem',        // 16px
  dialog: '1rem',       // 16px
} as const;

/**
 * 阴影系统
 */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // 组件阴影
  button: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
} as const;

/**
 * 字体系统
 */
export const typography = {
  // 字体家族
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },

  // 字体大小
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  // 字体粗细
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // 行高
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // 字间距
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

/**
 * 过渡和动画
 */
export const transitions = {
  // 时长
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // 缓动函数
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
    // 自定义缓动
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // 常用过渡
  default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Z-index 层级
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 9999,
} as const;

/**
 * 断点系统（响应式）
 */
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * 主题配置（整合所有配置）
 */
export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  transitions,
  zIndex,
  breakpoints,
} as const;

// 类型导出
export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type Typography = typeof typography;
export type Transitions = typeof transitions;
export type ZIndex = typeof zIndex;
export type Breakpoints = typeof breakpoints;

/**
 * 主题辅助函数
 */

// 获取颜色值
export function getColor(path: string): string {
  const keys = path.split('.');
  let value: any = colors;
  for (const key of keys) {
    value = value[key];
  }
  return value || path;
}

// 获取间距值
export function getSpacing(size: keyof typeof spacing): typeof spacing[keyof typeof spacing] {
  return spacing[size];
}

// 获取圆角值
export function getBorderRadius(size: keyof typeof borderRadius): string {
  return borderRadius[size];
}

// 获取阴影值
export function getShadow(size: keyof typeof shadows): string {
  return shadows[size];
}

export default theme;
