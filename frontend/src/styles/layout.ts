/**
 * Design System - Layout Constants
 * 设计系统 - 布局常量
 *
 * 定义所有布局相关的常量和配置
 * 包括容器宽度、间距、响应式布局等
 */

import { theme } from './theme';

/**
 * 容器宽度配置
 * Container widths for different breakpoints
 */
export const containerWidths = {
  // 最大宽度
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',

  // 内容容器
  content: {
    narrow: '640px',    // 窄内容（文章、表单）
    normal: '1024px',   // 正常内容
    wide: '1280px',     // 宽内容
    full: '100%',       // 全宽
  },
} as const;

/**
 * 侧边栏配置
 * Sidebar dimensions and states
 */
export const sidebar = {
  // 宽度
  width: {
    collapsed: '64px',    // 收起状态
    expanded: '240px',    // 展开状态
    wide: '280px',        // 宽侧边栏
  },

  // 移动端
  mobile: {
    width: '280px',
    overlay: true,
  },

  // 过渡动画
  transition: {
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

/**
 * 顶部导航栏配置
 * Header/Navbar configuration
 */
export const header = {
  // 高度
  height: {
    mobile: '56px',
    desktop: '64px',
    tall: '80px',
  },

  // Z-index
  zIndex: theme.zIndex.sticky,

  // 内边距
  padding: {
    x: {
      mobile: '16px',
      desktop: '24px',
    },
    y: '12px',
  },
} as const;

/**
 * 页脚配置
 * Footer configuration
 */
export const footer = {
  // 高度
  height: {
    compact: '60px',
    normal: '80px',
    expanded: '120px',
  },

  // 内边距
  padding: {
    x: {
      mobile: '16px',
      desktop: '24px',
    },
    y: '20px',
  },
} as const;

/**
 * 主内容区域配置
 * Main content area configuration
 */
export const mainContent = {
  // 内边距
  padding: {
    mobile: '16px',
    tablet: '24px',
    desktop: '32px',
  },

  // 最大宽度（排除侧边栏后）
  maxWidth: {
    withSidebar: `calc(100vw - ${sidebar.width.expanded})`,
    withCollapsedSidebar: `calc(100vw - ${sidebar.width.collapsed})`,
    fullWidth: '100vw',
  },

  // 间距
  gap: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  },
} as const;

/**
 * 网格系统配置
 * Grid system configuration
 */
export const grid = {
  // 列数
  columns: {
    mobile: 4,
    tablet: 8,
    desktop: 12,
  },

  // 间距
  gap: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  // 常用网格类名
  classes: {
    container: 'grid',
    cols2: 'grid-cols-2',
    cols3: 'grid-cols-3',
    cols4: 'grid-cols-4',
    colsAuto: 'grid-cols-auto-fit',
    responsive: {
      cols1: 'grid-cols-1',
      sm2: 'sm:grid-cols-2',
      md3: 'md:grid-cols-3',
      lg4: 'lg:grid-cols-4',
      xl6: 'xl:grid-cols-6',
    },
  },
} as const;

/**
 * Flex 布局配置
 * Flexbox layout patterns
 */
export const flex = {
  // 常用 Flex 组合
  patterns: {
    // 水平居中
    centerX: 'flex justify-center',
    // 垂直居中
    centerY: 'flex items-center',
    // 完全居中
    center: 'flex items-center justify-center',
    // 两端对齐
    between: 'flex items-center justify-between',
    // 均匀分布
    around: 'flex items-center justify-around',
    // 左对齐
    start: 'flex items-center justify-start',
    // 右对齐
    end: 'flex items-center justify-end',
    // 垂直堆叠
    col: 'flex flex-col',
    // 垂直堆叠居中
    colCenter: 'flex flex-col items-center justify-center',
  },

  // 间距
  gap: {
    xs: 'gap-1',    // 4px
    sm: 'gap-2',    // 8px
    md: 'gap-4',    // 16px
    lg: 'gap-6',    // 24px
    xl: 'gap-8',    // 32px
  },
} as const;

/**
 * 卡片布局配置
 * Card layout patterns
 */
export const cardLayout = {
  // 卡片间距
  gap: {
    tight: '12px',
    normal: '16px',
    loose: '24px',
  },

  // 卡片网格
  grid: {
    // 1列（移动端）
    mobile: 'grid grid-cols-1 gap-4',
    // 2列（平板）
    tablet: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
    // 3列（桌面）
    desktop: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    // 4列（大屏）
    wide: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  },

  // 内边距
  padding: {
    compact: 'p-3',
    normal: 'p-4',
    comfortable: 'p-6',
  },
} as const;

/**
 * 模态框/对话框布局
 * Modal/Dialog layout
 */
export const modal = {
  // 尺寸
  sizes: {
    xs: 'max-w-xs',      // ~320px
    sm: 'max-w-sm',      // ~384px
    md: 'max-w-md',      // ~448px
    lg: 'max-w-lg',      // ~512px
    xl: 'max-w-xl',      // ~576px
    '2xl': 'max-w-2xl',  // ~672px
    '3xl': 'max-w-3xl',  // ~768px
    '4xl': 'max-w-4xl',  // ~896px
    '5xl': 'max-w-5xl',  // ~1024px
    full: 'max-w-full',
  },

  // 内边距
  padding: {
    header: 'px-6 py-4',
    body: 'px-6 py-4',
    footer: 'px-6 py-4',
  },

  // 间距
  spacing: {
    header: 'mb-4',
    footer: 'mt-6',
  },
} as const;

/**
 * 表单布局配置
 * Form layout patterns
 */
export const formLayout = {
  // 字段间距
  fieldGap: {
    tight: 'space-y-2',
    normal: 'space-y-4',
    loose: 'space-y-6',
  },

  // 字段组间距
  groupGap: {
    normal: 'space-y-6',
    loose: 'space-y-8',
  },

  // 标签位置
  labelPosition: {
    top: 'flex flex-col gap-1',
    left: 'flex items-center gap-4',
    right: 'flex items-center justify-between',
  },

  // 表单容器宽度
  containerWidth: {
    narrow: 'max-w-sm',   // ~384px
    normal: 'max-w-md',   // ~448px
    wide: 'max-w-lg',     // ~512px
    full: 'w-full',
  },
} as const;

/**
 * 列表布局配置
 * List layout patterns
 */
export const listLayout = {
  // 列表项间距
  itemGap: {
    none: 'space-y-0',
    tight: 'space-y-1',
    normal: 'space-y-2',
    loose: 'space-y-4',
  },

  // 列表项内边距
  itemPadding: {
    compact: 'px-3 py-2',
    normal: 'px-4 py-3',
    comfortable: 'px-6 py-4',
  },

  // 分隔线
  divider: {
    none: '',
    border: 'divide-y divide-[var(--color-border)]',
    space: 'space-y-px bg-[var(--color-border)]',
  },
} as const;

/**
 * 页面布局模式
 * Page layout patterns
 */
export const pageLayout = {
  // 单列布局（居中内容）
  singleColumn: `
    w-full
    max-w-4xl
    mx-auto
    px-4
    sm:px-6
    lg:px-8
    py-8
  `,

  // 双列布局（侧边栏 + 内容）
  twoColumn: {
    container: 'flex gap-6',
    sidebar: 'w-64 flex-shrink-0',
    main: 'flex-1 min-w-0',
  },

  // 三列布局（侧边栏 + 内容 + 侧边栏）
  threeColumn: {
    container: 'flex gap-6',
    leftSidebar: 'w-64 flex-shrink-0',
    main: 'flex-1 min-w-0',
    rightSidebar: 'w-80 flex-shrink-0',
  },

  // 全宽布局
  fullWidth: 'w-full min-h-screen',

  // 固定头部布局
  fixedHeader: {
    header: 'fixed top-0 left-0 right-0 z-sticky',
    main: 'pt-16', // 给header留出空间
  },

  // 固定侧边栏布局
  fixedSidebar: {
    sidebar: 'fixed top-0 left-0 bottom-0 z-sticky overflow-y-auto',
    main: 'ml-64', // 给sidebar留出空间
  },
} as const;

/**
 * 响应式断点工具
 * Responsive breakpoint utilities
 */
export const responsive = {
  // 媒体查询
  mediaQueries: {
    sm: `@media (min-width: ${theme.breakpoints.sm})`,
    md: `@media (min-width: ${theme.breakpoints.md})`,
    lg: `@media (min-width: ${theme.breakpoints.lg})`,
    xl: `@media (min-width: ${theme.breakpoints.xl})`,
    '2xl': `@media (min-width: ${theme.breakpoints['2xl']})`,
  },

  // 隐藏/显示工具类
  hide: {
    mobile: 'hidden sm:block',
    tablet: 'hidden md:block',
    desktop: 'hidden lg:block',
  },

  show: {
    mobileOnly: 'block sm:hidden',
    tabletOnly: 'hidden sm:block lg:hidden',
    desktopOnly: 'hidden lg:block',
  },
} as const;

/**
 * 滚动容器配置
 * Scroll container patterns
 */
export const scrollContainer = {
  // 垂直滚动
  vertical: 'overflow-y-auto overflow-x-hidden',

  // 水平滚动
  horizontal: 'overflow-x-auto overflow-y-hidden',

  // 双向滚动
  both: 'overflow-auto',

  // 平滑滚动
  smooth: 'scroll-smooth',

  // 隐藏滚动条
  hideScrollbar: `
    scrollbar-hide
    [-ms-overflow-style:none]
    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden
  `,

  // 自定义滚动条
  customScrollbar: `
    [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-[var(--color-scrollbar)]
    [&::-webkit-scrollbar-thumb]:rounded-full
    hover:[&::-webkit-scrollbar-thumb]:bg-[var(--color-scrollbar-hover)]
  `,
} as const;

/**
 * 内容区域间距
 * Content section spacing
 */
export const sectionSpacing = {
  // 小节间距
  xs: 'my-4',
  sm: 'my-6',
  md: 'my-8',
  lg: 'my-12',
  xl: 'my-16',
  '2xl': 'my-24',

  // 垂直间距
  vertical: {
    tight: 'space-y-4',
    normal: 'space-y-6',
    loose: 'space-y-8',
    relaxed: 'space-y-12',
  },

  // 水平间距
  horizontal: {
    tight: 'space-x-4',
    normal: 'space-x-6',
    loose: 'space-x-8',
    relaxed: 'space-x-12',
  },
} as const;

/**
 * 分隔线样式
 * Divider styles
 */
export const divider = {
  // 水平分隔线
  horizontal: {
    default: 'border-t border-[var(--color-border)] my-4',
    thick: 'border-t-2 border-[var(--color-border)] my-4',
    dashed: 'border-t border-dashed border-[var(--color-border)] my-4',
    spacing: {
      tight: 'border-t border-[var(--color-border)] my-2',
      normal: 'border-t border-[var(--color-border)] my-4',
      loose: 'border-t border-[var(--color-border)] my-6',
    },
  },

  // 垂直分隔线
  vertical: {
    default: 'border-l border-[var(--color-border)] mx-4',
    thick: 'border-l-2 border-[var(--color-border)] mx-4',
    dashed: 'border-l border-dashed border-[var(--color-border)] mx-4',
    spacing: {
      tight: 'border-l border-[var(--color-border)] mx-2',
      normal: 'border-l border-[var(--color-border)] mx-4',
      loose: 'border-l border-[var(--color-border)] mx-6',
    },
  },
} as const;

/**
 * 辅助函数：构建容器类名
 */
export function getContainerClasses(
  _width: keyof typeof containerWidths.content = 'normal',
  padding: boolean = true
): string {
  // Note: width parameter reserved for future use with inline styles
  // const maxWidth = containerWidths.content[width];
  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  return `w-full mx-auto ${paddingClasses}`.trim();
}

/**
 * 辅助函数：构建网格类名
 */
export function getGridClasses(
  cols: number | 'auto' = 3,
  gap: keyof typeof grid.gap = 'md',
  responsive: boolean = true
): string {
  const gapClass = grid.gap[gap];

  if (cols === 'auto') {
    return `grid grid-cols-auto-fit ${gapClass}`;
  }

  if (responsive) {
    return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} ${gapClass}`;
  }

  return `grid grid-cols-${cols} ${gapClass}`;
}

/**
 * 辅助函数：构建页面布局类名
 */
export function getPageLayoutClasses(
  hasSidebar: boolean = false,
  hasHeader: boolean = true
): string {
  const classes = ['min-h-screen'];

  if (hasHeader) {
    classes.push('pt-16');
  }

  if (hasSidebar) {
    classes.push('md:ml-64');
  }

  return classes.join(' ');
}

/**
 * 类型导出
 */
export type ContainerWidth = keyof typeof containerWidths.content;
export type SidebarWidth = keyof typeof sidebar.width;
export type GridGap = keyof typeof grid.gap;
export type FlexPattern = keyof typeof flex.patterns;
export type ModalSize = keyof typeof modal.sizes;

/**
 * 默认导出所有布局配置
 */
export default {
  containerWidths,
  sidebar,
  header,
  footer,
  mainContent,
  grid,
  flex,
  cardLayout,
  modal,
  formLayout,
  listLayout,
  pageLayout,
  responsive,
  scrollContainer,
  sectionSpacing,
  divider,
} as const;
