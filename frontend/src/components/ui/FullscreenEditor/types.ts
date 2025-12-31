// 文件路径: frontend/src/components/ui/FullscreenEditor/types.ts

/**
 * FullscreenEditor 类型定义
 * 全屏编辑器组件的契约层
 */

/**
 * 编辑器模式
 */
export type EditorMode = 'edit' | 'preview';

/**
 * 组件 Props
 */
export interface FullscreenEditorProps {
  /** 是否显示全屏编辑器 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 编辑器内容 */
  value: string;
  /** 内容变化回调 */
  onChange: (value: string) => void;
  /** 编辑器标题 */
  title?: string;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否禁用编辑 */
  disabled?: boolean;
  /** 保存回调（可选，如果提供则显示保存按钮） */
  onSave?: () => void;
  /** 是否有未保存的更改 */
  isDirty?: boolean;
}

/**
 * Hook 返回类型
 */
export interface UseFullscreenEditorReturn {
  // 状态
  mode: EditorMode;
  charCount: number;
  tokenCount: number;
  localValue: string;
  t: any;

  // 处理器
  handleModeChange: (mode: EditorMode) => void;
  handleValueChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleClose: () => void;
  handleSave: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}
