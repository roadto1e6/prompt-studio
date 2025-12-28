// 文件路径: frontend/src/features/prompts/components/ImportPromptModal/types.ts

/**
 * ImportPromptModal 类型定义
 * 契约层：先设计数据结构，后写逻辑
 */

import type { SharedPromptData } from '@/types';

/**
 * 导入视图状态
 * - input: 显示输入框（粘贴分享码）
 * - preview: 显示预览（解析成功后）
 */
export type ImportViewState = 'input' | 'preview';

/**
 * 异步操作状态
 * - idle: 空闲状态
 * - fetching: 正在获取分享数据
 * - importing: 正在导入到本地
 * - success: 操作成功
 * - error: 操作失败
 */
export type AsyncState = 'idle' | 'fetching' | 'importing' | 'success' | 'error';

/**
 * 表单状态
 */
export interface FormState {
  /** 用户输入的分享码或链接 */
  inputCode: string;
  /** 解析后的提示词数据 */
  parsedData: SharedPromptData | null;
  /** 错误信息 */
  errorMessage: string;
  /** 当前异步操作状态 */
  asyncState: AsyncState;
}

/**
 * 导入数据（从外部传入或内部解析）
 */
export interface ImportData {
  /** 提示词数据 */
  data: SharedPromptData;
  /** 数据来源（用于追踪） */
  source: 'url' | 'manual' | 'pending';
}

/**
 * Hook 返回的状态和方法
 */
export interface UseImportModalReturn {
  // ==================== 状态 ====================
  /** 当前视图状态 */
  viewState: ImportViewState;
  /** 表单状态 */
  formState: FormState;
  /** 是否正在获取数据 */
  isFetching: boolean;
  /** 是否正在导入 */
  isImporting: boolean;
  /** 是否有任何加载状态 */
  isLoading: boolean;
  /** 是否有错误 */
  hasError: boolean;
  /** 显示的数据（解析数据或待导入数据） */
  displayData: SharedPromptData | null;
  /** 是否存在重复提示词 */
  isDuplicate: boolean;
  /** 重复的提示词信息 */
  duplicatePrompt: {
    id: string;
    title: string;
  } | null;

  // ==================== 处理器 ====================
  /** 处理输入框变化 */
  handleInputChange: (value: string) => void;
  /** 处理获取分享数据 */
  handleFetchShare: () => Promise<void>;
  /** 处理导入提示词 */
  handleImport: () => Promise<void>;
  /** 返回到输入状态 */
  handleBack: () => void;
  /** 关闭模态框 */
  handleClose: () => void;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 组件 Props
 */
export interface ImportPromptModalProps {
  /** 自定义类名（可选） */
  className?: string;
}
