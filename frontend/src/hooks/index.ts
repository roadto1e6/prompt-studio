// ============================================================================
// Hooks - 统一导出
// ============================================================================

// -------------------- 交互相关 --------------------
export { useKeyboardShortcut, useKeyPress } from './useKeyboardShortcut';
export { useClickOutside, useClickOutsideMultiple, useClickOutsideWithExclusions } from './useClickOutside';
export { useRipple } from './useRipple';

// -------------------- 工具函数 --------------------
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useThrottle, useThrottleCallback, useThrottleFn } from './useThrottle';
export { useToggle } from './useToggle';
export { useCopyToClipboard, useCopyToClipboardWithFallback, useCopyWithNotification } from './useCopyToClipboard';

// -------------------- 存储相关 --------------------
export { useLocalStorage } from './useLocalStorage';

// -------------------- UI 状态管理 --------------------
export { useModal, useModalWithConfirmation, useModalStack } from './useModal';
export { useToast } from './useToast';
export { useScrollLock, useScrollLockWithCount, usePreventScroll, useBodyScrollLock } from './useScrollLock';

// -------------------- 表单管理 --------------------
export { useForm } from './useForm';
export type { UseFormOptions, UseFormReturn, FormValues, FormErrors, FormTouched, ValidationRules, FieldValidationRule } from './useForm';

// -------------------- 异步操作 --------------------
export { useAsync, useAsyncCallback, useAsyncRetry, clearAsyncCache } from './useAsync';
export type { UseAsyncOptions, UseAsyncReturn, AsyncStatus, UseAsyncRetryReturn } from './useAsync';

// -------------------- 分页 --------------------
export { usePagination, usePaginationWithData, useInfinitePagination } from './usePagination';
export type { UsePaginationOptions, UsePaginationReturn, UsePaginationWithDataReturn, UseInfinitePaginationOptions, UseInfinitePaginationReturn } from './usePagination';

// -------------------- 其他 --------------------
export { useGlobalShortcuts } from './useGlobalShortcuts';
