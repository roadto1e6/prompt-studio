// 文件路径: frontend/src/components/ui/KeyboardShortcutsModal/types.ts

/**
 * KeyboardShortcutsModal 类型定义
 * 契约层：定义快捷键数据结构和组件接口
 */

/**
 * 单个快捷键定义
 */
export interface Shortcut {
  /** 快捷键组合（如 ['⌘', 'K']） */
  keys: string[];
  /** 功能描述 */
  description: string;
  /** 所属分类 */
  category: string;
}

/**
 * 快捷键分类
 */
export interface ShortcutCategory {
  /** 分类名称 */
  name: string;
  /** 该分类下的快捷键列表 */
  shortcuts: Shortcut[];
}

/**
 * Hook 返回值
 */
export interface UseKeyboardShortcutsModalReturn {
  /** 分组后的快捷键数据 */
  groupedShortcuts: Record<string, Shortcut[]>;
  /** 是否为 macOS 系统 */
  isMac: boolean;
  /** 格式化快捷键显示（将 ⌘ 替换为 Ctrl on Windows/Linux） */
  formatKeys: (keys: string[]) => string[];
}

/**
 * 组件 Props
 */
export interface KeyboardShortcutsModalProps {
  /** 是否打开 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 自定义类名（可选） */
  className?: string;
}
