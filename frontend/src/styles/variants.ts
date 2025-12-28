/**
 * Design System - Component Variants Configuration
 * 设计系统 - 组件变体配置
 *
 * 定义所有组件的样式变体，基于 theme.ts 的主题系统
 * 这些配置可以在组件中直接使用，保持一致性并避免硬编码样式
 */

/**
 * Button 按钮变体
 * 包含所有按钮样式的配置
 */
export const buttonVariants = {
  // 主要按钮
  primary: {
    base: `
      bg-[var(--color-accent)]
      text-white
      hover:bg-[var(--color-accent-hover)]
      active:scale-95
      disabled:opacity-50
      disabled:cursor-not-allowed
      disabled:hover:bg-[var(--color-accent)]
    `,
    className: 'btn-primary',
  },

  // 次要按钮
  secondary: {
    base: `
      bg-[var(--button-secondary-bg)]
      text-[var(--button-secondary-text)]
      border
      border-[var(--button-secondary-border)]
      hover:bg-[var(--button-secondary-hover)]
      active:scale-95
      disabled:opacity-50
      disabled:cursor-not-allowed
    `,
    className: 'btn-secondary',
  },

  // 幽灵按钮（透明背景）
  ghost: {
    base: `
      bg-transparent
      text-[var(--color-text-secondary)]
      hover:bg-[var(--button-ghost-hover)]
      hover:text-[var(--color-text-primary)]
      active:scale-95
      disabled:opacity-50
      disabled:cursor-not-allowed
    `,
    className: 'btn-ghost',
  },

  // 描边按钮
  outline: {
    base: `
      bg-transparent
      text-[var(--color-text-primary)]
      border
      border-[var(--button-outline-border)]
      hover:bg-[var(--overlay-bg)]
      active:scale-95
      disabled:opacity-50
      disabled:cursor-not-allowed
    `,
    className: 'btn-outline',
  },

  // 危险操作按钮
  danger: {
    base: `
      bg-red-500
      text-white
      hover:bg-red-600
      active:scale-95
      disabled:opacity-50
      disabled:cursor-not-allowed
    `,
    className: 'btn-danger',
  },

  // 链接样式按钮
  link: {
    base: `
      bg-transparent
      text-[var(--color-accent)]
      hover:text-[var(--color-accent-hover)]
      hover:underline
      disabled:opacity-50
      disabled:cursor-not-allowed
      disabled:no-underline
    `,
    className: 'btn-link',
  },
} as const;

/**
 * Button 尺寸变体
 */
export const buttonSizes = {
  xs: {
    base: 'px-2 py-1 text-xs rounded-md min-h-[24px]',
    className: 'btn-xs',
  },
  sm: {
    base: 'px-3 py-1.5 text-sm rounded-md min-h-[32px]',
    className: 'btn-sm',
  },
  md: {
    base: 'px-4 py-2 text-base rounded-lg min-h-[40px]',
    className: 'btn-md',
  },
  lg: {
    base: 'px-6 py-3 text-lg rounded-lg min-h-[48px]',
    className: 'btn-lg',
  },
  xl: {
    base: 'px-8 py-4 text-xl rounded-xl min-h-[56px]',
    className: 'btn-xl',
  },
} as const;

/**
 * Input 输入框变体
 */
export const inputVariants = {
  // 默认状态
  default: {
    base: `
      w-full
      px-3
      py-2
      bg-[var(--color-bg-primary)]
      text-[var(--color-text-primary)]
      border
      border-[var(--color-border)]
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-[var(--color-accent)]
      focus:border-transparent
      transition-all
      placeholder:text-[var(--color-text-muted)]
    `,
    className: 'input-default',
  },

  // 错误状态
  error: {
    base: `
      w-full
      px-3
      py-2
      bg-[var(--color-bg-primary)]
      text-[var(--color-text-primary)]
      border-2
      border-red-500
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-red-500
      transition-all
      placeholder:text-[var(--color-text-muted)]
    `,
    className: 'input-error',
  },

  // 成功状态
  success: {
    base: `
      w-full
      px-3
      py-2
      bg-[var(--color-bg-primary)]
      text-[var(--color-text-primary)]
      border-2
      border-green-500
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-green-500
      transition-all
      placeholder:text-[var(--color-text-muted)]
    `,
    className: 'input-success',
  },

  // 禁用状态
  disabled: {
    base: `
      w-full
      px-3
      py-2
      bg-[var(--color-bg-tertiary)]
      text-[var(--color-text-muted)]
      border
      border-[var(--color-border-light)]
      rounded-lg
      cursor-not-allowed
      opacity-60
    `,
    className: 'input-disabled',
  },
} as const;

/**
 * Badge/Tag 徽章变体
 */
export const badgeVariants = {
  // 信息
  info: {
    base: `
      inline-flex
      items-center
      px-2.5
      py-0.5
      rounded-full
      text-xs
      font-medium
      bg-blue-100
      text-blue-800
      dark:bg-blue-900
      dark:text-blue-200
    `,
    className: 'badge-info',
  },

  // 成功
  success: {
    base: `
      inline-flex
      items-center
      px-2.5
      py-0.5
      rounded-full
      text-xs
      font-medium
      bg-emerald-500/20
      text-emerald-600
      border
      border-emerald-500/30
      dark:text-emerald-400
    `,
    className: 'badge-success',
  },

  // 警告
  warning: {
    base: `
      inline-flex
      items-center
      px-2.5
      py-0.5
      rounded-full
      text-xs
      font-medium
      bg-amber-500/20
      text-amber-600
      border
      border-amber-500/30
      dark:text-amber-400
    `,
    className: 'badge-warning',
  },

  // 错误
  error: {
    base: `
      inline-flex
      items-center
      px-2.5
      py-0.5
      rounded-full
      text-xs
      font-medium
      bg-red-100
      text-red-800
      dark:bg-red-900
      dark:text-red-200
    `,
    className: 'badge-error',
  },

  // 危险（别名 error）
  danger: {
    base: `
      inline-flex
      items-center
      px-2.5
      py-0.5
      rounded-full
      text-xs
      font-medium
      bg-red-500/20
      text-red-600
      border
      border-red-500/30
      dark:text-red-400
    `,
    className: 'badge-danger',
  },

  // 默认/中性
  default: {
    base: `
      inline-flex
      items-center
      px-2.5
      py-0.5
      rounded-full
      text-xs
      font-medium
      bg-[var(--color-bg-secondary)]
      text-[var(--color-text-secondary)]
      border
      border-[var(--color-border)]
    `,
    className: 'badge-default',
  },

  // 主题色
  primary: {
    base: `
      inline-flex
      items-center
      px-2.5
      py-0.5
      rounded-full
      text-xs
      font-medium
      bg-[var(--color-accent)]/20
      text-[var(--color-accent)]
      border
      border-[var(--color-accent)]/30
    `,
    className: 'badge-primary',
  },
} as const;

/**
 * Badge 尺寸变体
 */
export const badgeSizes = {
  sm: {
    base: 'px-2 py-0.5 text-[10px]',
    className: 'badge-sm',
  },
  md: {
    base: 'px-2.5 py-1 text-xs',
    className: 'badge-md',
  },
  lg: {
    base: 'px-3 py-1.5 text-sm',
    className: 'badge-lg',
  },
} as const;

/**
 * Alert 提示框变体
 */
export const alertVariants = {
  // 信息提示
  info: {
    base: `
      p-4
      rounded-lg
      bg-blue-50
      border
      border-blue-200
      text-blue-800
      dark:bg-blue-900/20
      dark:border-blue-800
      dark:text-blue-200
    `,
    icon: 'text-blue-500',
    className: 'alert-info',
  },

  // 成功提示
  success: {
    base: `
      p-4
      rounded-lg
      bg-green-50
      border
      border-green-200
      text-green-800
      dark:bg-green-900/20
      dark:border-green-800
      dark:text-green-200
    `,
    icon: 'text-green-500',
    className: 'alert-success',
  },

  // 警告提示
  warning: {
    base: `
      p-4
      rounded-lg
      bg-yellow-50
      border
      border-yellow-200
      text-yellow-800
      dark:bg-yellow-900/20
      dark:border-yellow-800
      dark:text-yellow-200
    `,
    icon: 'text-yellow-500',
    className: 'alert-warning',
  },

  // 错误提示
  error: {
    base: `
      p-4
      rounded-lg
      bg-red-50
      border
      border-red-200
      text-red-800
      dark:bg-red-900/20
      dark:border-red-800
      dark:text-red-200
    `,
    icon: 'text-red-500',
    className: 'alert-error',
  },
} as const;

/**
 * Toast 通知变体
 */
export const toastVariants = {
  // 成功通知
  success: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-900 dark:text-green-100',
    description: 'text-green-700 dark:text-green-300',
    progress: 'bg-green-500 dark:bg-green-400',
    className: 'toast-success',
  },

  // 错误通知
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-900 dark:text-red-100',
    description: 'text-red-700 dark:text-red-300',
    progress: 'bg-red-500 dark:bg-red-400',
    className: 'toast-error',
  },

  // 警告通知
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-900 dark:text-yellow-100',
    description: 'text-yellow-700 dark:text-yellow-300',
    progress: 'bg-yellow-500 dark:bg-yellow-400',
    className: 'toast-warning',
  },

  // 信息通知
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-100',
    description: 'text-blue-700 dark:text-blue-300',
    progress: 'bg-blue-500 dark:bg-blue-400',
    className: 'toast-info',
  },
} as const;

/**
 * Card 卡片变体
 */
export const cardVariants = {
  // 默认卡片
  default: {
    base: `
      bg-[var(--color-bg-primary)]
      border
      border-[var(--color-border)]
      rounded-xl
      shadow-sm
      transition-all
    `,
    className: 'card-default',
  },

  // 可悬停卡片
  hover: {
    base: `
      bg-[var(--color-bg-primary)]
      border
      border-[var(--color-border)]
      rounded-xl
      shadow-sm
      transition-all
      hover:shadow-md
      hover:border-[var(--color-accent)]
      cursor-pointer
    `,
    className: 'card-hover',
  },

  // 高亮卡片
  elevated: {
    base: `
      bg-[var(--color-bg-primary)]
      border
      border-[var(--color-border)]
      rounded-xl
      shadow-lg
      transition-all
    `,
    className: 'card-elevated',
  },

  // 扁平卡片（无边框）
  flat: {
    base: `
      bg-[var(--color-bg-secondary)]
      rounded-xl
      transition-all
    `,
    className: 'card-flat',
  },

  // 描边卡片
  outlined: {
    base: `
      bg-transparent
      border-2
      border-[var(--color-border)]
      rounded-xl
      transition-all
    `,
    className: 'card-outlined',
  },
} as const;

/**
 * Select/Dropdown 下拉框变体
 */
export const selectVariants = {
  // 默认状态
  default: {
    trigger: `
      w-full
      px-3
      py-2
      bg-[var(--color-bg-primary)]
      text-[var(--color-text-primary)]
      border
      border-[var(--color-border)]
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-[var(--color-accent)]
      transition-all
      cursor-pointer
    `,
    dropdown: `
      mt-1
      bg-[var(--color-bg-primary)]
      border
      border-[var(--color-border)]
      rounded-lg
      shadow-lg
      overflow-hidden
      z-50
    `,
    option: `
      px-3
      py-2
      text-[var(--color-text-primary)]
      hover:bg-[var(--color-bg-secondary)]
      cursor-pointer
      transition-colors
    `,
    optionSelected: `
      px-3
      py-2
      text-[var(--color-text-primary)]
      bg-[var(--theme-accent-bg)]
      cursor-pointer
    `,
    className: 'select-default',
  },

  // 错误状态
  error: {
    trigger: `
      w-full
      px-3
      py-2
      bg-[var(--color-bg-primary)]
      text-[var(--color-text-primary)]
      border-2
      border-red-500
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-red-500
      transition-all
      cursor-pointer
    `,
    className: 'select-error',
  },
} as const;

/**
 * Checkbox/Radio 复选框变体
 */
export const checkboxVariants = {
  // 默认复选框
  default: {
    base: `
      w-4
      h-4
      rounded
      border
      border-[var(--color-border)]
      bg-[var(--color-bg-primary)]
      checked:bg-[var(--color-accent)]
      checked:border-[var(--color-accent)]
      focus:outline-none
      focus:ring-2
      focus:ring-[var(--color-accent)]
      focus:ring-offset-2
      transition-all
      cursor-pointer
    `,
    className: 'checkbox-default',
  },

  // 单选框（圆形）
  radio: {
    base: `
      w-4
      h-4
      rounded-full
      border
      border-[var(--color-border)]
      bg-[var(--color-bg-primary)]
      checked:bg-[var(--color-accent)]
      checked:border-[var(--color-accent)]
      focus:outline-none
      focus:ring-2
      focus:ring-[var(--color-accent)]
      focus:ring-offset-2
      transition-all
      cursor-pointer
    `,
    className: 'radio-default',
  },

  // 开关样式
  switch: {
    base: `
      relative
      inline-flex
      h-6
      w-11
      items-center
      rounded-full
      bg-[var(--color-bg-tertiary)]
      transition-colors
      focus:outline-none
      focus:ring-2
      focus:ring-[var(--color-accent)]
      focus:ring-offset-2
      cursor-pointer
      checked:bg-[var(--color-accent)]
    `,
    thumb: `
      inline-block
      h-4
      w-4
      transform
      rounded-full
      bg-white
      transition-transform
      translate-x-1
      checked:translate-x-6
    `,
    className: 'switch-default',
  },
} as const;

/**
 * Modal/Dialog 模态框变体
 */
export const modalVariants = {
  // 默认模态框
  default: {
    overlay: `
      fixed
      inset-0
      bg-black/50
      backdrop-blur-sm
      z-[1040]
      flex
      items-center
      justify-center
      p-4
    `,
    container: `
      bg-[var(--color-bg-primary)]
      rounded-2xl
      shadow-2xl
      max-w-lg
      w-full
      max-h-[90vh]
      overflow-hidden
      z-[1050]
    `,
    header: `
      px-6
      py-4
      border-b
      border-[var(--color-border)]
    `,
    body: `
      px-6
      py-4
      overflow-y-auto
    `,
    footer: `
      px-6
      py-4
      border-t
      border-[var(--color-border)]
      flex
      justify-end
      gap-3
    `,
    className: 'modal-default',
  },

  // 全屏模态框
  fullscreen: {
    overlay: `
      fixed
      inset-0
      bg-[var(--color-bg-primary)]
      z-[1040]
    `,
    container: `
      w-full
      h-full
      overflow-y-auto
    `,
    className: 'modal-fullscreen',
  },

  // 抽屉式（侧边栏）
  drawer: {
    overlay: `
      fixed
      inset-0
      bg-black/50
      backdrop-blur-sm
      z-[1040]
    `,
    container: `
      fixed
      top-0
      right-0
      h-full
      w-full
      max-w-md
      bg-[var(--color-bg-primary)]
      shadow-2xl
      z-[1050]
    `,
    className: 'modal-drawer',
  },
} as const;

/**
 * Modal 尺寸变体
 */
export const modalSizes = {
  sm: {
    base: 'max-w-sm',
    className: 'modal-sm',
  },
  md: {
    base: 'max-w-md',
    className: 'modal-md',
  },
  lg: {
    base: 'max-w-lg',
    className: 'modal-lg',
  },
  xl: {
    base: 'max-w-xl',
    className: 'modal-xl',
  },
  '2xl': {
    base: 'max-w-2xl',
    className: 'modal-2xl',
  },
  '3xl': {
    base: 'max-w-3xl',
    className: 'modal-3xl',
  },
  '4xl': {
    base: 'max-w-4xl',
    className: 'modal-4xl',
  },
} as const;

/**
 * Tabs 标签页变体
 */
export const tabVariants = {
  // 默认标签
  default: {
    container: `
      flex
      gap-1
    `,
    tab: `
      px-4
      py-2.5
      text-xs
      font-medium
      transition-all
      flex
      items-center
      gap-2
      rounded-t-md
      text-[var(--color-text-muted)]
      hover:text-[var(--color-text-primary)]
      hover:bg-[var(--color-bg-secondary)]
    `,
    activeTab: `
      text-[var(--color-text-primary)]
      bg-[var(--color-bg-secondary)]
    `,
    className: 'tabs-default',
  },

  // 按钮样式标签
  pills: {
    container: `
      flex
      gap-1
      p-1
      bg-[var(--color-bg-secondary)]
      rounded-lg
    `,
    tab: `
      px-4
      py-2
      text-xs
      font-medium
      transition-all
      flex
      items-center
      gap-2
      rounded-md
      text-[var(--color-text-secondary)]
      hover:text-[var(--color-text-primary)]
      hover:bg-[var(--color-bg-primary)]
    `,
    activeTab: `
      text-[var(--color-text-primary)]
      bg-[var(--color-bg-primary)]
      shadow-sm
    `,
    className: 'tabs-pills',
  },
} as const;

/**
 * Tooltip 提示框变体
 */
export const tooltipVariants = {
  // 默认提示框
  default: {
    base: `
      px-2
      py-1
      text-xs
      bg-gray-900
      text-white
      rounded
      shadow-lg
      z-[1070]
      max-w-xs
      dark:bg-gray-700
    `,
    arrow: 'fill-gray-900 dark:fill-gray-700',
    className: 'tooltip-default',
  },

  // 浅色提示框
  light: {
    base: `
      px-2
      py-1
      text-xs
      bg-white
      text-gray-900
      border
      border-[var(--color-border)]
      rounded
      shadow-lg
      z-[1070]
      max-w-xs
    `,
    arrow: 'fill-white',
    className: 'tooltip-light',
  },
} as const;

/**
 * Loading/Spinner 加载动画变体
 */
export const loadingVariants = {
  // 旋转圆圈
  spinner: {
    base: `
      inline-block
      animate-spin
      rounded-full
      border-2
      border-solid
      border-current
      border-r-transparent
    `,
    sizes: {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    },
    className: 'loading-spinner',
  },

  // 点状加载
  dots: {
    base: `
      flex
      items-center
      gap-1
    `,
    dot: `
      w-2
      h-2
      rounded-full
      bg-current
      animate-pulse
    `,
    className: 'loading-dots',
  },

  // 骨架屏
  skeleton: {
    base: `
      animate-pulse
      bg-[var(--color-bg-secondary)]
      rounded
    `,
    className: 'loading-skeleton',
  },
} as const;

/**
 * 辅助函数：获取按钮完整类名
 */
export function getButtonClasses(
  variant: keyof typeof buttonVariants = 'primary',
  size: keyof typeof buttonSizes = 'md',
  customClasses: string = ''
): string {
  const variantClasses = buttonVariants[variant].base;
  const sizeClasses = buttonSizes[size].base;

  return `${variantClasses} ${sizeClasses} ${customClasses}`.trim().replace(/\s+/g, ' ');
}

/**
 * 辅助函数：获取输入框完整类名
 */
export function getInputClasses(
  variant: keyof typeof inputVariants = 'default',
  customClasses: string = ''
): string {
  const variantClasses = inputVariants[variant].base;

  return `${variantClasses} ${customClasses}`.trim().replace(/\s+/g, ' ');
}

/**
 * 辅助函数：获取徽章完整类名
 */
export function getBadgeClasses(
  variant: keyof typeof badgeVariants = 'default',
  customClasses: string = ''
): string {
  const variantClasses = badgeVariants[variant].base;

  return `${variantClasses} ${customClasses}`.trim().replace(/\s+/g, ' ');
}

/**
 * 辅助函数：获取卡片完整类名
 */
export function getCardClasses(
  variant: keyof typeof cardVariants = 'default',
  customClasses: string = ''
): string {
  const variantClasses = cardVariants[variant].base;

  return `${variantClasses} ${customClasses}`.trim().replace(/\s+/g, ' ');
}

/**
 * 类型导出
 */
export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;
export type InputVariant = keyof typeof inputVariants;
export type BadgeVariant = keyof typeof badgeVariants;
export type BadgeSize = keyof typeof badgeSizes;
export type AlertVariant = keyof typeof alertVariants;
export type ToastVariant = keyof typeof toastVariants;
export type CardVariant = keyof typeof cardVariants;
export type SelectVariant = keyof typeof selectVariants;
export type ModalSize = keyof typeof modalSizes;
export type TabVariant = keyof typeof tabVariants;
export type TooltipVariant = keyof typeof tooltipVariants;
export type LoadingVariant = keyof typeof loadingVariants;

/**
 * 默认导出所有变体
 */
export default {
  button: buttonVariants,
  buttonSizes,
  input: inputVariants,
  badge: badgeVariants,
  badgeSizes,
  alert: alertVariants,
  toast: toastVariants,
  card: cardVariants,
  select: selectVariants,
  checkbox: checkboxVariants,
  modal: modalVariants,
  modalSizes,
  tab: tabVariants,
  tooltip: tooltipVariants,
  loading: loadingVariants,
} as const;
