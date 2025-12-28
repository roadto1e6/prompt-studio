/**
 * useScrollLock Hook
 * 滚动锁定 Hook
 *
 * 锁定页面滚动，常用于模态框、抽屉等场景
 * 防止背景页面滚动，同时保持滚动条宽度避免布局偏移
 */

import { useEffect, useCallback, useRef } from 'react';

/**
 * 获取滚动条宽度
 */
function getScrollbarWidth(): number {
  if (typeof window === 'undefined') return 0;

  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
}

/**
 * useScrollLock Hook
 *
 * @param enabled 是否启用滚动锁定
 * @param target 要锁定的目标元素，默认为 document.body
 *
 * @example
 * ```tsx
 * const Modal = ({ isOpen }) => {
 *   useScrollLock(isOpen);
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div className="modal">
 *       Modal content
 *     </div>
 *   );
 * };
 * ```
 */
export function useScrollLock(
  enabled: boolean = true,
  target?: HTMLElement | null
): void {
  const originalStyleRef = useRef<{
    overflow: string;
    paddingRight: string;
  } | null>(null);

  const lock = useCallback(() => {
    if (typeof window === 'undefined') return;

    const element = target || document.body;
    if (!element) return;

    // 保存原始样式
    if (!originalStyleRef.current) {
      originalStyleRef.current = {
        overflow: element.style.overflow,
        paddingRight: element.style.paddingRight,
      };
    }

    // 检查是否已有滚动条
    const hasScrollbar = element.scrollHeight > element.clientHeight;

    // 锁定滚动
    element.style.overflow = 'hidden';

    // 添加 padding 来补偿滚动条宽度，避免布局偏移
    if (hasScrollbar && element === document.body) {
      const scrollbarWidth = getScrollbarWidth();
      element.style.paddingRight = `${scrollbarWidth}px`;
    }
  }, [target]);

  const unlock = useCallback(() => {
    if (typeof window === 'undefined') return;

    const element = target || document.body;
    if (!element || !originalStyleRef.current) return;

    // 恢复原始样式
    element.style.overflow = originalStyleRef.current.overflow;
    element.style.paddingRight = originalStyleRef.current.paddingRight;

    originalStyleRef.current = null;
  }, [target]);

  useEffect(() => {
    if (enabled) {
      lock();
    } else {
      unlock();
    }

    return () => {
      unlock();
    };
  }, [enabled, lock, unlock]);
}

/**
 * useScrollLockWithCount Hook
 * 带计数器的滚动锁定（支持多个组件同时锁定）
 *
 * @example
 * ```tsx
 * // 即使有多个模态框，也能正确管理滚动锁定
 * const Modal1 = () => {
 *   const { lock, unlock } = useScrollLockWithCount();
 *   useEffect(() => {
 *     lock();
 *     return unlock;
 *   }, []);
 *   return <div>Modal 1</div>;
 * };
 *
 * const Modal2 = () => {
 *   const { lock, unlock } = useScrollLockWithCount();
 *   useEffect(() => {
 *     lock();
 *     return unlock;
 *   }, []);
 *   return <div>Modal 2</div>;
 * };
 * ```
 */
let lockCount = 0;
let originalBodyStyle: { overflow: string; paddingRight: string } | null = null;

export function useScrollLockWithCount() {
  const isLockedRef = useRef(false);

  const lock = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (isLockedRef.current) return;

    lockCount++;
    isLockedRef.current = true;

    if (lockCount === 1) {
      // 第一个锁定，保存原始样式
      originalBodyStyle = {
        overflow: document.body.style.overflow,
        paddingRight: document.body.style.paddingRight,
      };

      const hasScrollbar = document.documentElement.scrollHeight > window.innerHeight;
      document.body.style.overflow = 'hidden';

      if (hasScrollbar) {
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
  }, []);

  const unlock = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!isLockedRef.current) return;

    lockCount = Math.max(0, lockCount - 1);
    isLockedRef.current = false;

    if (lockCount === 0 && originalBodyStyle) {
      // 最后一个解锁，恢复原始样式
      document.body.style.overflow = originalBodyStyle.overflow;
      document.body.style.paddingRight = originalBodyStyle.paddingRight;
      originalBodyStyle = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (isLockedRef.current) {
        unlock();
      }
    };
  }, [unlock]);

  return { lock, unlock };
}

/**
 * usePreventScroll Hook
 * 阻止特定元素的滚动传播
 *
 * @param ref 目标元素的 ref
 * @param enabled 是否启用
 *
 * @example
 * ```tsx
 * const menuRef = useRef<HTMLDivElement>(null);
 * usePreventScroll(menuRef, isOpen);
 *
 * return (
 *   <div ref={menuRef} className="scrollable-menu">
 *     // 滚动不会传播到父元素
 *   </div>
 * );
 * ```
 */
export function usePreventScroll(
  ref: React.RefObject<HTMLElement>,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const element = ref.current;
    if (!element) return;

    const preventScroll = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;

      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;

      // 阻止滚动传播
      if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
        e.preventDefault();
      }
    };

    element.addEventListener('wheel', preventScroll, { passive: false });

    return () => {
      element.removeEventListener('wheel', preventScroll);
    };
  }, [ref, enabled]);
}

/**
 * useBodyScrollLock Hook
 * 简化版的 body 滚动锁定
 *
 * @param enabled 是否锁定
 *
 * @example
 * ```tsx
 * const [isModalOpen, setIsModalOpen] = useState(false);
 * useBodyScrollLock(isModalOpen);
 * ```
 */
export function useBodyScrollLock(enabled: boolean = true): void {
  useScrollLock(enabled, document.body);
}

export default useScrollLock;
