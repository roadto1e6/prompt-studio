/**
 * useToast Hook
 * 提供便捷的 Toast 调用方法
 */

import { useToastStore, type Toast, type ToastType } from '@/stores/toastStore';

type ToastOptions = Omit<Toast, 'id' | 'type'>;

export function useToast() {
  const { addToast, removeToast, clearAll } = useToastStore();

  const showToast = (type: ToastType, options: ToastOptions | string) => {
    const toastOptions: ToastOptions =
      typeof options === 'string' ? { message: options } : options;

    return addToast({
      type,
      ...toastOptions,
    });
  };

  return {
    toast: {
      success: (options: ToastOptions | string) => showToast('success', options),
      error: (options: ToastOptions | string) => showToast('error', options),
      warning: (options: ToastOptions | string) => showToast('warning', options),
      info: (options: ToastOptions | string) => showToast('info', options),
    },
    dismiss: removeToast,
    dismissAll: clearAll,
  };
}

// 使用示例：
// const { toast } = useToast();
// toast.success('保存成功！');
// toast.error({ message: '删除失败', description: '请稍后重试' });
// toast.info({
//   message: '有新版本',
//   action: { label: '更新', onClick: () => console.log('update') }
// });
