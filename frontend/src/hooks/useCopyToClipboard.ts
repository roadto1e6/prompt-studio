/**
 * useCopyToClipboard Hook
 * 复制到剪贴板 Hook
 *
 * 提供复制文本到剪贴板的功能，支持成功/失败回调
 */

import { useState, useCallback } from 'react';

/**
 * useCopyToClipboard 返回值类型
 */
export interface UseCopyToClipboardReturn {
  /**
   * 复制的值
   */
  copiedText: string | null;

  /**
   * 是否复制成功
   */
  isCopied: boolean;

  /**
   * 复制函数
   */
  copy: (text: string) => Promise<boolean>;

  /**
   * 重置状态
   */
  reset: () => void;
}

/**
 * useCopyToClipboard Hook
 *
 * @param timeout 复制成功状态持续时间（毫秒），默认 2000ms
 * @returns { copiedText, isCopied, copy, reset }
 *
 * @example
 * ```tsx
 * const { isCopied, copy } = useCopyToClipboard();
 *
 * return (
 *   <button onClick={() => copy('Hello World')}>
 *     {isCopied ? 'Copied!' : 'Copy'}
 *   </button>
 * );
 * ```
 */
export function useCopyToClipboard(
  timeout: number = 2000
): UseCopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        setIsCopied(true);

        // 自动重置状态
        if (timeout > 0) {
          setTimeout(() => {
            setIsCopied(false);
          }, timeout);
        }

        return true;
      } catch (error) {
        console.error('Failed to copy text:', error);
        setCopiedText(null);
        setIsCopied(false);
        return false;
      }
    },
    [timeout]
  );

  const reset = useCallback(() => {
    setCopiedText(null);
    setIsCopied(false);
  }, []);

  return {
    copiedText,
    isCopied,
    copy,
    reset,
  };
}

/**
 * useCopyToClipboardWithFallback Hook
 * 带降级方案的剪贴板复制（支持旧浏览器）
 *
 * @example
 * ```tsx
 * const { copy, isCopied } = useCopyToClipboardWithFallback();
 *
 * <button onClick={() => copy('Text to copy')}>
 *   {isCopied ? '✓ Copied' : 'Copy'}
 * </button>
 * ```
 */
export function useCopyToClipboardWithFallback(
  timeout: number = 2000
): UseCopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyWithFallback = useCallback(
    async (text: string): Promise<boolean> => {
      // 尝试使用现代 API
      if (navigator?.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          setCopiedText(text);
          setIsCopied(true);

          if (timeout > 0) {
            setTimeout(() => setIsCopied(false), timeout);
          }

          return true;
        } catch (error) {
          console.warn('Clipboard API failed, using fallback');
        }
      }

      // 降级方案：使用 execCommand (已废弃但兼容性好)
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          setCopiedText(text);
          setIsCopied(true);

          if (timeout > 0) {
            setTimeout(() => setIsCopied(false), timeout);
          }

          return true;
        }
      } catch (error) {
        console.error('Fallback copy failed:', error);
      }

      return false;
    },
    [timeout]
  );

  const reset = useCallback(() => {
    setCopiedText(null);
    setIsCopied(false);
  }, []);

  return {
    copiedText,
    isCopied,
    copy: copyWithFallback,
    reset,
  };
}

/**
 * useCopyWithNotification Hook
 * 带通知的复制功能
 *
 * @param onCopy 复制成功回调
 * @param onError 复制失败回调
 * @param timeout 复制成功状态持续时间
 *
 * @example
 * ```tsx
 * const { copy, isCopied } = useCopyWithNotification(
 *   () => toast.success('Copied to clipboard!'),
 *   () => toast.error('Failed to copy'),
 * );
 *
 * <button onClick={() => copy(codeSnippet)}>
 *   {isCopied ? 'Copied' : 'Copy Code'}
 * </button>
 * ```
 */
export function useCopyWithNotification(
  onCopy?: (text: string) => void,
  onError?: (error: Error) => void,
  timeout: number = 2000
): UseCopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        const error = new Error('Clipboard not supported');
        onError?.(error);
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        setIsCopied(true);
        onCopy?.(text);

        if (timeout > 0) {
          setTimeout(() => setIsCopied(false), timeout);
        }

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        onError?.(error);
        setCopiedText(null);
        setIsCopied(false);
        return false;
      }
    },
    [onCopy, onError, timeout]
  );

  const reset = useCallback(() => {
    setCopiedText(null);
    setIsCopied(false);
  }, []);

  return {
    copiedText,
    isCopied,
    copy,
    reset,
  };
}

export default useCopyToClipboard;
