/**
 * Toast 逻辑层
 * 封装定时器、进度条、暂停/恢复逻辑
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import type { ToastTimerOptions, ToastTimerReturn } from './types';

/**
 * Toast 定时器 Hook
 * 处理自动关闭倒计时和进度条动画
 */
export function useToastTimer(options: ToastTimerOptions): ToastTimerReturn {
  const { duration = 3000, onClose, isPaused } = options;

  const [progress, setProgress] = useState(100);
  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);

  /** 清理所有定时器 */
  const clearTimers = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /** 启动定时器 */
  const startTimer = useCallback(() => {
    if (duration <= 0) return;

    startTimeRef.current = Date.now();
    const timeLeft = remainingTimeRef.current;

    // 进度条动画（60fps）
    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, timeLeft - elapsed);
      setProgress((remaining / duration) * 100);
    }, 16);

    // 自动关闭
    timerRef.current = window.setTimeout(() => {
      clearTimers();
      onClose();
    }, timeLeft);

    return clearTimers;
  }, [duration, onClose, clearTimers]);

  /** 暂停定时器 */
  const pauseTimer = useCallback(() => {
    clearTimers();
    // 计算剩余时间
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  }, [clearTimers]);

  // 根据暂停状态启动或暂停
  useEffect(() => {
    if (!isPaused) {
      const cleanup = startTimer();
      return cleanup;
    } else {
      pauseTimer();
    }
  }, [isPaused, startTimer, pauseTimer]);

  return { progress };
}
