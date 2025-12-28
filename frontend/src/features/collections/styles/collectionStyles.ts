/**
 * Collection Styles Configuration
 * 集合组件样式配置 - 组件和样式分离
 */

// 颜色配置 - 完整的颜色值映射
export const COLLECTION_COLOR_CONFIG = {
  pink: {
    name: 'Pink',
    value: '#ec4899',
    textClass: 'text-pink-500',
    bgClass: 'bg-pink-500',
    hoverBgClass: 'hover:bg-pink-500',
    ringClass: 'ring-pink-500',
  },
  emerald: {
    name: 'Emerald',
    value: '#10b981',
    textClass: 'text-emerald-500',
    bgClass: 'bg-emerald-500',
    hoverBgClass: 'hover:bg-emerald-500',
    ringClass: 'ring-emerald-500',
  },
  blue: {
    name: 'Blue',
    value: '#3b82f6',
    textClass: 'text-blue-500',
    bgClass: 'bg-blue-500',
    hoverBgClass: 'hover:bg-blue-500',
    ringClass: 'ring-blue-500',
  },
  amber: {
    name: 'Amber',
    value: '#f59e0b',
    textClass: 'text-amber-500',
    bgClass: 'bg-amber-500',
    hoverBgClass: 'hover:bg-amber-500',
    ringClass: 'ring-amber-500',
  },
  purple: {
    name: 'Purple',
    value: '#a855f7',
    textClass: 'text-purple-500',
    bgClass: 'bg-purple-500',
    hoverBgClass: 'hover:bg-purple-500',
    ringClass: 'ring-purple-500',
  },
  cyan: {
    name: 'Cyan',
    value: '#06b6d4',
    textClass: 'text-cyan-500',
    bgClass: 'bg-cyan-500',
    hoverBgClass: 'hover:bg-cyan-500',
    ringClass: 'ring-cyan-500',
  },
  red: {
    name: 'Red',
    value: '#ef4444',
    textClass: 'text-red-500',
    bgClass: 'bg-red-500',
    hoverBgClass: 'hover:bg-red-500',
    ringClass: 'ring-red-500',
  },
  lime: {
    name: 'Lime',
    value: '#84cc16',
    textClass: 'text-lime-500',
    bgClass: 'bg-lime-500',
    hoverBgClass: 'hover:bg-lime-500',
    ringClass: 'ring-lime-500',
  },
} as const;

export type CollectionColorKey = keyof typeof COLLECTION_COLOR_CONFIG;
export type CollectionColor = typeof COLLECTION_COLOR_CONFIG[CollectionColorKey];

// 导出颜色键数组
export const COLLECTION_COLOR_KEYS = Object.keys(COLLECTION_COLOR_CONFIG) as CollectionColorKey[];

// 根据 textClass 获取颜色配置
export function getColorConfigByTextClass(textClass: string): CollectionColor | undefined {
  return Object.values(COLLECTION_COLOR_CONFIG).find(config => config.textClass === textClass);
}

// 根据颜色键获取配置
export function getColorConfig(key: CollectionColorKey): CollectionColor {
  return COLLECTION_COLOR_CONFIG[key];
}

// 组件样式常量
export const COMPONENT_STYLES = {
  // ColorPicker 样式
  colorPicker: {
    container: 'flex gap-2 flex-wrap',
    colorButton: {
      base: 'w-10 h-10 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-theme-accent',
      selected: 'ring-2 ring-offset-2 ring-offset-theme-bg-secondary ring-theme-text-primary scale-110 shadow-lg',
      unselected: 'hover:scale-105 opacity-80 hover:opacity-100',
    },
  },

  // CollectionPreview 样式
  preview: {
    container: 'flex items-center gap-3 p-4 bg-theme-bg-primary rounded-lg border border-theme-border transition-colors',
    icon: 'w-8 h-8 transition-colors',
    content: 'flex-1 min-w-0',
    title: 'font-medium text-theme-text-primary truncate',
    description: 'text-xs text-theme-text-muted mt-0.5 truncate',
    count: 'text-xs text-theme-text-muted',
  },

  // Form 样式
  form: {
    container: 'space-y-6',
    section: 'space-y-2',
    label: 'block text-xs font-bold text-theme-text-label uppercase tracking-wider',
    error: 'text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1',
    actions: 'flex justify-end gap-3 pt-4 border-t border-theme-border',
  },
} as const;

// 动画配置
export const ANIMATION_CONFIG = {
  colorPicker: {
    scale: {
      selected: 1.1,
      hover: 1.05,
      tap: 0.95,
    },
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  preview: {
    transition: {
      duration: 0.15,
    },
  },
} as const;
