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
 * 使用 Tailwind 主题类以确保亮/暗模式正确切换
 */
export const buttonVariants = {
  // 主要按钮
  primary: {
    base: `
      bg-theme-accent
      text-white
      hover:bg-theme-accent-hover
      active:scale-95
      disabled:opacity-50
      disabled:cursor-not-allowed
      disabled:hover:bg-theme-accent
    `,
    className: 'btn-primary',
  },

  // 次要按钮
  secondary: {
    base: `
      bg-theme-button-secondary
      text-theme-button-secondary-text
      border
      border-theme-button-secondary-border
      hover:bg-theme-button-secondary-hover
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
      text-theme-text-secondary
      hover:bg-theme-button-ghost-hover
      hover:text-theme-text-primary
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
      text-theme-text-primary
      border
      border-theme-button-outline-border
      hover:bg-theme-overlay-bg
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
      text-theme-accent
      hover:text-theme-accent-hover
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
 * 使用 CSS 变量确保亮/暗模式正确切换
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
      badge-info
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
      badge-success
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
      badge-warning
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
      badge-error
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
      badge-danger
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
      bg-[var(--badge-default-bg)]
      text-[var(--badge-default-text)]
      border
      border-[var(--badge-default-border)]
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
      bg-[var(--theme-accent-bg)]
      text-[var(--color-accent)]
      border
      border-[var(--theme-accent-border)]
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
 * 使用 CSS 类名实现主题适配
 */
export const alertVariants = {
  // 信息提示
  info: {
    base: `
      p-4
      rounded-lg
      alert-info
    `,
    icon: 'alert-icon-info',
    className: 'alert-info',
  },

  // 成功提示
  success: {
    base: `
      p-4
      rounded-lg
      alert-success
    `,
    icon: 'alert-icon-success',
    className: 'alert-success',
  },

  // 警告提示
  warning: {
    base: `
      p-4
      rounded-lg
      alert-warning
    `,
    icon: 'alert-icon-warning',
    className: 'alert-warning',
  },

  // 错误提示
  error: {
    base: `
      p-4
      rounded-lg
      alert-error
    `,
    icon: 'alert-icon-error',
    className: 'alert-error',
  },
} as const;

/**
 * Toast 通知变体
 * 使用 CSS 类名实现主题适配
 */
export const toastVariants = {
  // 成功通知
  success: {
    container: 'toast-success-container',
    icon: 'toast-success-icon',
    text: 'toast-success-text',
    description: 'toast-success-description',
    progress: 'toast-success-progress',
    className: 'toast-success',
  },

  // 错误通知
  error: {
    container: 'toast-error-container',
    icon: 'toast-error-icon',
    text: 'toast-error-text',
    description: 'toast-error-description',
    progress: 'toast-error-progress',
    className: 'toast-error',
  },

  // 警告通知
  warning: {
    container: 'toast-warning-container',
    icon: 'toast-warning-icon',
    text: 'toast-warning-text',
    description: 'toast-warning-description',
    progress: 'toast-warning-progress',
    className: 'toast-warning',
  },

  // 信息通知
  info: {
    container: 'toast-info-container',
    icon: 'toast-info-icon',
    text: 'toast-info-text',
    description: 'toast-info-description',
    progress: 'toast-info-progress',
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
 * 使用 CSS 类名实现主题适配
 */
export const tooltipVariants = {
  // 默认提示框
  default: {
    base: `
      px-2
      py-1
      text-xs
      tooltip-default-base
      rounded
      shadow-lg
      z-[1070]
      max-w-xs
    `,
    arrow: 'tooltip-default-arrow',
    className: 'tooltip-default',
  },

  // 浅色提示框
  light: {
    base: `
      px-2
      py-1
      text-xs
      tooltip-light-base
      border
      border-[var(--color-border)]
      rounded
      shadow-lg
      z-[1070]
      max-w-xs
    `,
    arrow: 'tooltip-light-arrow',
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
