/**
 * useThrottle Hook
 * 节流 Hook
 *
 * 限制函数执行频率，在指定时间内最多执行一次
 * 与 useDebounce 的区别：
 * - Throttle：固定时间间隔执行
 * - Debounce：延迟执行，每次触发重新计时
 */

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useThrottle Hook - 节流值
 *
 * @param value 要节流的值
 * @param delay 节流延迟（毫秒）
 * @returns 节流后的值
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const throttledSearchTerm = useThrottle(searchTerm, 500);
 *
 * useEffect(() => {
 *   // 每 500ms 最多触发一次
 *   searchAPI(throttledSearchTerm);
 * }, [throttledSearchTerm]);
 * ```
 */
export function useThrottle<T>(value: T, delay: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}

/**
 * useThrottleCallback Hook - 节流回调函数
 *
 * @param callback 要节流的回调函数
 * @param delay 节流延迟（毫秒）
 * @param deps 依赖数组
 * @returns 节流后的回调函数
 *
 * @example
 * ```tsx
 * const handleScroll = useThrottleCallback(
 *   (event) => {
 *     console.log('Scroll position:', event.target.scrollTop);
 *   },
 *   200
 * );
 *
 * <div onScroll={handleScroll}>
 *   // Content here
 * </div>
 * ```
 */
export function useThrottleCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  deps: React.DependencyList = []
): T {
  const lastRan = useRef(Date.now());
  const timeoutRef = useRef<number | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const timeSinceLastRan = Date.now() - lastRan.current;

      if (timeSinceLastRan >= delay) {
        callback(...args);
        lastRan.current = Date.now();
      } else {
        // 清除之前的定时器
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // 设置新的定时器
        timeoutRef.current = window.setTimeout(() => {
          callback(...args);
          lastRan.current = Date.now();
        }, delay - timeSinceLastRan);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, delay, ...deps]
  ) as T;

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
}

/**
 * useThrottleFn Hook - 节流函数（带 leading 和 trailing 选项）
 *
 * @param fn 要节流的函数
 * @param options 选项
 * @returns { run, cancel, flush } 控制对象
 *
 * @example
 * ```tsx
 * const { run: handleResize } = useThrottleFn(
 *   () => {
 *     console.log('Window resized');
 *   },
 *   { wait: 300, leading: true, trailing: false }
 * );
 *
 * useEffect(() => {
 *   window.addEventListener('resize', handleResize);
 *   return () => window.removeEventListener('resize', handleResize);
 * }, [handleResize]);
 * ```
 */
export interface ThrottleOptions {
  /**
   * 等待时间（毫秒）
   * @default 500
   */
  wait?: number;

  /**
   * 是否在开始时立即执行
   * @default true
   */
  leading?: boolean;

  /**
   * 是否在结束后执行
   * @default true
   */
  trailing?: boolean;
}

export interface ThrottledFunction<T extends (...args: any[]) => any> {
  /**
   * 执行节流函数
   */
  run: (...args: Parameters<T>) => void;

  /**
   * 取消挂起的执行
   */
  cancel: () => void;

  /**
   * 立即执行挂起的调用
   */
  flush: () => void;
}

export function useThrottleFn<T extends (...args: any[]) => any>(
  fn: T,
  options: ThrottleOptions = {}
): ThrottledFunction<T> {
  const {
    wait = 500,
    leading = true,
    trailing = true,
  } = options;

  const lastCallTime = useRef<number>(0);
  const lastArgs = useRef<Parameters<T> | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const fnRef = useRef(fn);

  // 更新函数引用
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const invokeFunc = useCallback(() => {
    if (lastArgs.current) {
      fnRef.current(...lastArgs.current);
      lastArgs.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    lastArgs.current = null;
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    invokeFunc();
  }, [invokeFunc]);

  const run = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTime.current;

      lastArgs.current = args;

      // 首次调用或超过等待时间
      if (lastCallTime.current === 0 || timeSinceLastCall >= wait) {
        if (leading) {
          invokeFunc();
          lastCallTime.current = now;
        }

        // 设置 trailing 调用
        if (trailing) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = window.setTimeout(() => {
            if (!leading) {
              invokeFunc();
            }
            lastCallTime.current = Date.now();
            timeoutRef.current = null;
          }, wait);
        }
      } else if (trailing) {
        // 在等待期间的调用
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        const remainingWait = wait - timeSinceLastCall;
        timeoutRef.current = window.setTimeout(() => {
          invokeFunc();
          lastCallTime.current = Date.now();
          timeoutRef.current = null;
        }, remainingWait);
      }
    },
    [wait, leading, trailing, invokeFunc]
  );

  // 清理
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return { run, cancel, flush };
}

export default useThrottle;
