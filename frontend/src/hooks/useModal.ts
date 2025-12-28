/**
 * useModal Hook
 * 模态框状态管理 Hook
 *
 * 提供完整的模态框状态管理，包括打开、关闭、数据传递等功能
 * 支持多个模态框同时管理，可以替代 modalStore 的部分功能
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * 模态框配置选项
 */
export interface UseModalOptions<T = any> {
  /**
   * 模态框初始打开状态
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * 模态框初始数据
   */
  initialData?: T;

  /**
   * 打开时的回调
   */
  onOpen?: (data?: T) => void;

  /**
   * 关闭时的回调
   */
  onClose?: (data?: T) => void;

  /**
   * 关闭时是否清空数据
   * @default true
   */
  clearDataOnClose?: boolean;

  /**
   * 是否在关闭时添加延迟（用于退出动画）
   * @default 0
   */
  closeDelay?: number;

  /**
   * 是否在点击遮罩时关闭
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * 是否在按下 ESC 键时关闭
   * @default true
   */
  closeOnEscape?: boolean;
}

/**
 * 模态框状态返回值
 */
export interface UseModalReturn<T = any> {
  /**
   * 模态框是否打开
   */
  isOpen: boolean;

  /**
   * 模态框数据
   */
  data: T | null;

  /**
   * 打开模态框
   * @param data 可选的数据
   */
  open: (data?: T) => void;

  /**
   * 关闭模态框
   * @param returnData 可选的返回数据
   */
  close: (returnData?: T) => void;

  /**
   * 切换模态框状态
   */
  toggle: () => void;

  /**
   * 设置模态框数据
   * @param data 新数据
   */
  setData: (data: T | null) => void;

  /**
   * 更新模态框数据（部分更新）
   * @param updates 要更新的字段
   */
  updateData: (updates: Partial<T>) => void;

  /**
   * 重置模态框（关闭并清空数据）
   */
  reset: () => void;

  /**
   * 模态框属性（可直接传递给 Modal 组件）
   */
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
}

/**
 * useModal Hook
 *
 * @example
 * ```tsx
 * // 基础用法
 * const modal = useModal();
 *
 * return (
 *   <>
 *     <button onClick={modal.open}>打开模态框</button>
 *     <Modal {...modal.modalProps}>
 *       <p>模态框内容</p>
 *     </Modal>
 *   </>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 带数据的模态框
 * interface EditData {
 *   id: string;
 *   name: string;
 * }
 *
 * const editModal = useModal<EditData>({
 *   onOpen: (data) => console.log('编辑:', data),
 *   onClose: (data) => console.log('关闭，数据:', data),
 * });
 *
 * // 打开并传递数据
 * const handleEdit = (item: EditData) => {
 *   editModal.open(item);
 * };
 *
 * // 在模态框中更新数据
 * const handleUpdate = (field: string, value: string) => {
 *   editModal.updateData({ [field]: value });
 * };
 * ```
 */
export function useModal<T = any>(
  options: UseModalOptions<T> = {}
): UseModalReturn<T> {
  const {
    defaultOpen = false,
    initialData = null,
    onOpen,
    onClose,
    clearDataOnClose = true,
    closeDelay = 0,
    // closeOnOverlayClick = true,  // Reserved for future use
    closeOnEscape = true,
  } = options;

  // 状态
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [data, setData] = useState<T | null>(initialData as T | null);

  // 使用 ref 存储最新的回调，避免闭包问题
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
  }, [onOpen, onClose]);

  /**
   * 打开模态框
   */
  const open = useCallback((newData?: T) => {
    if (newData !== undefined) {
      setData(newData);
    }
    setIsOpen(true);
    onOpenRef.current?.(newData);
  }, []);

  /**
   * 关闭模态框
   */
  const close = useCallback((returnData?: T) => {
    const finalData = returnData !== undefined ? returnData : data;

    if (closeDelay > 0) {
      // 如果有延迟，先关闭模态框，延迟后清空数据
      setIsOpen(false);
      setTimeout(() => {
        if (clearDataOnClose) {
          setData(null);
        }
        onCloseRef.current?.(finalData || undefined);
      }, closeDelay);
    } else {
      // 无延迟，直接关闭和清空
      setIsOpen(false);
      if (clearDataOnClose) {
        setData(null);
      }
      onCloseRef.current?.(finalData || undefined);
    }
  }, [data, closeDelay, clearDataOnClose]);

  /**
   * 切换模态框状态
   */
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  /**
   * 更新部分数据
   */
  const updateData = useCallback((updates: Partial<T>) => {
    setData((prev) => (prev ? { ...prev, ...updates } : (updates as T)));
  }, []);

  /**
   * 重置模态框
   */
  const reset = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  /**
   * ESC 键监听
   */
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, close]);

  /**
   * 模态框属性（方便直接传递给 Modal 组件）
   */
  const modalProps = {
    isOpen,
    onClose: close,
  };

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData,
    updateData,
    reset,
    modalProps,
  };
}

/**
 * useModalWithConfirmation Hook
 * 带确认提示的模态框（用于删除等危险操作）
 *
 * @example
 * ```tsx
 * const deleteModal = useModalWithConfirmation({
 *   onConfirm: async (item) => {
 *     await deleteItem(item.id);
 *   },
 *   confirmText: '确定要删除吗？',
 * });
 *
 * <ConfirmModal
 *   {...deleteModal.modalProps}
 *   title="删除确认"
 *   message={deleteModal.confirmText}
 *   onConfirm={deleteModal.confirm}
 * />
 * ```
 */
export interface UseModalWithConfirmationOptions<T = any>
  extends UseModalOptions<T> {
  /**
   * 确认时的回调
   */
  onConfirm?: (data?: T) => void | Promise<void>;

  /**
   * 取消时的回调
   */
  onCancel?: () => void;

  /**
   * 确认提示文本
   */
  confirmText?: string;

  /**
   * 是否需要二次确认（输入文本等）
   */
  requireDoubleConfirm?: boolean;
}

export interface UseModalWithConfirmationReturn<T = any>
  extends UseModalReturn<T> {
  /**
   * 确认操作
   */
  confirm: () => Promise<void>;

  /**
   * 取消操作
   */
  cancel: () => void;

  /**
   * 确认中状态
   */
  isConfirming: boolean;

  /**
   * 确认提示文本
   */
  confirmText?: string;
}

export function useModalWithConfirmation<T = any>(
  options: UseModalWithConfirmationOptions<T> = {}
): UseModalWithConfirmationReturn<T> {
  const { onConfirm, onCancel, confirmText, ...modalOptions } = options;

  const modal = useModal<T>(modalOptions);
  const [isConfirming, setIsConfirming] = useState(false);

  const onConfirmRef = useRef(onConfirm);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onConfirmRef.current = onConfirm;
    onCancelRef.current = onCancel;
  }, [onConfirm, onCancel]);

  const confirm = useCallback(async () => {
    setIsConfirming(true);
    try {
      await onConfirmRef.current?.(modal.data || undefined);
      modal.close();
    } catch (error) {
      console.error('Confirmation failed:', error);
    } finally {
      setIsConfirming(false);
    }
  }, [modal]);

  const cancel = useCallback(() => {
    onCancelRef.current?.();
    modal.close();
  }, [modal]);

  return {
    ...modal,
    confirm,
    cancel,
    isConfirming,
    confirmText,
  };
}

/**
 * useModalStack Hook
 * 管理多个模态框的堆栈（用于嵌套模态框场景）
 *
 * @example
 * ```tsx
 * const modalStack = useModalStack();
 *
 * // 打开第一个模态框
 * modalStack.push({ id: 'edit', data: item });
 *
 * // 在第一个模态框中打开第二个
 * modalStack.push({ id: 'confirm', data: { action: 'delete' } });
 *
 * // 关闭最顶层的模态框
 * modalStack.pop();
 *
 * // 关闭所有模态框
 * modalStack.clear();
 * ```
 */
export interface ModalStackItem<T = any> {
  id: string;
  data?: T;
}

export interface UseModalStackReturn<T = any> {
  /**
   * 模态框堆栈
   */
  stack: ModalStackItem<T>[];

  /**
   * 当前顶层模态框
   */
  current: ModalStackItem<T> | null;

  /**
   * 推入新模态框
   */
  push: (item: ModalStackItem<T>) => void;

  /**
   * 弹出顶层模态框
   */
  pop: () => ModalStackItem<T> | undefined;

  /**
   * 清空所有模态框
   */
  clear: () => void;

  /**
   * 检查某个 ID 的模态框是否打开
   */
  isOpen: (id: string) => boolean;

  /**
   * 关闭指定 ID 的模态框
   */
  close: (id: string) => void;
}

export function useModalStack<T = any>(): UseModalStackReturn<T> {
  const [stack, setStack] = useState<ModalStackItem<T>[]>([]);

  const push = useCallback((item: ModalStackItem<T>) => {
    setStack((prev) => [...prev, item]);
  }, []);

  const pop = useCallback(() => {
    let poppedItem: ModalStackItem<T> | undefined;
    setStack((prev) => {
      if (prev.length === 0) return prev;
      poppedItem = prev[prev.length - 1];
      return prev.slice(0, -1);
    });
    return poppedItem;
  }, []);

  const clear = useCallback(() => {
    setStack([]);
  }, []);

  const isOpen = useCallback(
    (id: string) => {
      return stack.some((item) => item.id === id);
    },
    [stack]
  );

  const close = useCallback((id: string) => {
    setStack((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const current = stack.length > 0 ? stack[stack.length - 1] : null;

  return {
    stack,
    current,
    push,
    pop,
    clear,
    isOpen,
    close,
  };
}

export default useModal;
