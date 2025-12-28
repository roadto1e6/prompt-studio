/**
 * useAsync Hook
 * 异步操作管理 Hook
 *
 * 提供统一的异步操作状态管理，包括加载、成功、失败状态
 * 支持自动重试、取消、缓存等功能
 */

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * 异步状态
 */
export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

/**
 * 异步操作配置选项
 */
export interface UseAsyncOptions<T = any> {
  /**
   * 初始数据
   */
  initialData?: T;

  /**
   * 是否立即执行
   * @default false
   */
  immediate?: boolean;

  /**
   * 成功回调
   */
  onSuccess?: (data: T) => void;

  /**
   * 失败回调
   */
  onError?: (error: Error) => void;

  /**
   * 最终回调（无论成功失败都会执行）
   */
  onFinally?: () => void;

  /**
   * 失败时自动重试次数
   * @default 0
   */
  retryCount?: number;

  /**
   * 重试延迟（毫秒）
   * @default 1000
   */
  retryDelay?: number;

  /**
   * 缓存时间（毫秒），0 表示不缓存
   * @default 0
   */
  cacheTime?: number;

  /**
   * 缓存键（用于多个相同 Hook 实例共享缓存）
   */
  cacheKey?: string;

  /**
   * 是否在组件卸载时取消请求
   * @default true
   */
  cancelOnUnmount?: boolean;
}

/**
 * 异步操作返回值
 */
export interface UseAsyncReturn<T = any, Args extends any[] = any[]> {
  /**
   * 数据
   */
  data: T | undefined;

  /**
   * 错误
   */
  error: Error | undefined;

  /**
   * 状态
   */
  status: AsyncStatus;

  /**
   * 是否空闲（未开始）
   */
  isIdle: boolean;

  /**
   * 是否加载中
   */
  isLoading: boolean;

  /**
   * 是否成功
   */
  isSuccess: boolean;

  /**
   * 是否失败
   */
  isError: boolean;

  /**
   * 执行异步操作
   */
  execute: (...args: Args) => Promise<T>;

  /**
   * 重置状态
   */
  reset: () => void;

  /**
   * 取消操作
   */
  cancel: () => void;

  /**
   * 手动设置数据
   */
  setData: (data: T | undefined) => void;

  /**
   * 手动设置错误
   */
  setError: (error: Error | undefined) => void;
}

/**
 * 简单的缓存管理
 */
const asyncCache = new Map<string, { data: any; timestamp: number }>();

/**
 * useAsync Hook
 *
 * @example
 * ```tsx
 * // 基础用法
 * const fetchUser = async (id: string) => {
 *   const response = await fetch(`/api/users/${id}`);
 *   return response.json();
 * };
 *
 * const { data, isLoading, error, execute } = useAsync(fetchUser);
 *
 * // 调用
 * <button onClick={() => execute('123')}>Load User</button>
 * {isLoading && <Spinner />}
 * {error && <Error message={error.message} />}
 * {data && <UserProfile user={data} />}
 * ```
 *
 * @example
 * ```tsx
 * // 立即执行
 * const { data, isLoading } = useAsync(fetchUserList, {
 *   immediate: true,
 *   onSuccess: (users) => console.log('Loaded users:', users),
 * });
 * ```
 *
 * @example
 * ```tsx
 * // 自动重试
 * const { execute, isLoading } = useAsync(fetchData, {
 *   retryCount: 3,
 *   retryDelay: 2000,
 *   onError: (err) => console.error('Failed after retries:', err),
 * });
 * ```
 */
export function useAsync<T = any, Args extends any[] = any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T, Args> {
  const {
    initialData,
    immediate = false,
    onSuccess,
    onError,
    onFinally,
    retryCount = 0,
    retryDelay = 1000,
    cacheTime = 0,
    cacheKey,
    cancelOnUnmount = true,
  } = options;

  // 状态
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [status, setStatus] = useState<AsyncStatus>('idle');

  // Refs
  const asyncFunctionRef = useRef(asyncFunction);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onFinallyRef = useRef(onFinally);

  // 更新 refs
  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onFinallyRef.current = onFinally;
  }, [asyncFunction, onSuccess, onError, onFinally]);

  // 计算派生状态
  const isIdle = status === 'idle';
  const isLoading = status === 'pending';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  /**
   * 取消操作
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    cancel();
    setData(initialData);
    setError(undefined);
    setStatus('idle');
    retryCountRef.current = 0;
  }, [cancel, initialData]);

  /**
   * 执行异步操作
   */
  const execute = useCallback(
    async (...args: Args): Promise<T> => {
      // 取消之前的请求
      cancel();

      // 检查缓存
      if (cacheKey && cacheTime > 0) {
        const cached = asyncCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < cacheTime) {
          setData(cached.data);
          setStatus('success');
          setError(undefined);
          onSuccessRef.current?.(cached.data);
          return cached.data;
        }
      }

      // 创建新的 AbortController
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // 设置加载状态
      setStatus('pending');
      setError(undefined);

      try {
        // 执行异步函数
        const result = await asyncFunctionRef.current(...args);

        // 检查是否已取消或卸载
        if (!mountedRef.current || abortController.signal.aborted) {
          return result;
        }

        // 更新成功状态
        setData(result);
        setStatus('success');
        setError(undefined);
        retryCountRef.current = 0;

        // 缓存结果
        if (cacheKey && cacheTime > 0) {
          asyncCache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
        }

        // 调用成功回调
        onSuccessRef.current?.(result);
        onFinallyRef.current?.();

        return result;
      } catch (err) {
        // 检查是否已取消或卸载
        if (!mountedRef.current || abortController.signal.aborted) {
          throw err;
        }

        const error = err instanceof Error ? err : new Error(String(err));

        // 自动重试
        if (retryCountRef.current < retryCount) {
          retryCountRef.current++;

          // 等待后重试
          await new Promise((resolve) => setTimeout(resolve, retryDelay));

          // 再次检查是否已卸载
          if (!mountedRef.current) {
            throw error;
          }

          // 递归重试
          return execute(...args);
        }

        // 更新失败状态
        setError(error);
        setStatus('error');
        retryCountRef.current = 0;

        // 调用失败回调
        onErrorRef.current?.(error);
        onFinallyRef.current?.();

        throw error;
      }
    },
    [cancel, cacheKey, cacheTime, retryCount, retryDelay]
  );

  // 立即执行
  useEffect(() => {
    if (immediate) {
      (execute as () => Promise<T>)();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (cancelOnUnmount) {
        cancel();
      }
    };
  }, [cancel, cancelOnUnmount]);

  return {
    data,
    error,
    status,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    execute,
    reset,
    cancel,
    setData,
    setError,
  };
}

/**
 * useAsyncCallback Hook
 * 与 useAsync 类似，但不自动管理状态，只提供包装后的回调函数
 *
 * @example
 * ```tsx
 * const [handleSave, { isLoading }] = useAsyncCallback(
 *   async (data) => {
 *     await saveData(data);
 *   },
 *   {
 *     onSuccess: () => showToast('保存成功'),
 *     onError: (err) => showToast('保存失败'),
 *   }
 * );
 *
 * <button onClick={() => handleSave(formData)} disabled={isLoading}>
 *   保存
 * </button>
 * ```
 */
export function useAsyncCallback<T = any, Args extends any[] = any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): [(...args: Args) => Promise<T>, Omit<UseAsyncReturn<T, Args>, 'execute'>] {
  const asyncState = useAsync(asyncFunction, options);
  const { execute, ...rest } = asyncState;

  return [execute, rest];
}

/**
 * useAsyncRetry Hook
 * 带重试功能的异步操作 Hook
 *
 * @example
 * ```tsx
 * const { data, isLoading, retry, retryCount } = useAsyncRetry(
 *   fetchData,
 *   { immediate: true }
 * );
 *
 * {isError && (
 *   <div>
 *     <p>加载失败 (已重试 {retryCount} 次)</p>
 *     <button onClick={retry}>手动重试</button>
 *   </div>
 * )}
 * ```
 */
export interface UseAsyncRetryReturn<T, Args extends any[]>
  extends UseAsyncReturn<T, Args> {
  /**
   * 手动重试
   */
  retry: (...args: Args) => Promise<T>;

  /**
   * 已重试次数
   */
  retryCount: number;
}

export function useAsyncRetry<T = any, Args extends any[] = any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncRetryReturn<T, Args> {
  const [currentRetryCount, setCurrentRetryCount] = useState(0);
  const lastArgsRef = useRef<Args | null>(null);

  const asyncState = useAsync(asyncFunction, {
    ...options,
    onSuccess: (data) => {
      setCurrentRetryCount(0);
      options.onSuccess?.(data);
    },
    onError: (error) => {
      setCurrentRetryCount((prev) => prev + 1);
      options.onError?.(error);
    },
  });

  const executeWithArgs = useCallback(
    async (...args: Args) => {
      lastArgsRef.current = args;
      return asyncState.execute(...args);
    },
    [asyncState.execute] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const retry = useCallback(
    async (...args: Args) => {
      const retryArgs = args.length > 0 ? args : lastArgsRef.current || ([] as unknown as Args);
      return executeWithArgs(...retryArgs);
    },
    [executeWithArgs]
  );

  return {
    ...asyncState,
    execute: executeWithArgs,
    retry,
    retryCount: currentRetryCount,
  };
}

/**
 * 清除所有缓存
 */
export function clearAsyncCache(cacheKey?: string): void {
  if (cacheKey) {
    asyncCache.delete(cacheKey);
  } else {
    asyncCache.clear();
  }
}

export default useAsync;
