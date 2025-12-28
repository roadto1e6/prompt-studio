/**
 * useClickOutside Hook
 * 点击外部检测 Hook
 *
 * 检测点击事件是否发生在指定元素外部
 * 常用于关闭下拉菜单、模态框等
 */

import { useEffect, useRef, RefObject } from 'react';

/**
 * useClickOutside Hook
 *
 * @param handler 点击外部时的回调函数
 * @param enabled 是否启用监听，默认为 true
 * @returns ref 对象，需要绑定到目标元素上
 *
 * @example
 * ```tsx
 * const DropdownMenu = () => {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const ref = useClickOutside(() => setIsOpen(false));
 *
 *   return (
 *     <div ref={ref}>
 *       <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
 *       {isOpen && <div className="menu">Menu content</div>}
 *     </div>
 *   );
 * };
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): RefObject<T> {
  const ref = useRef<T>(null);
  const handlerRef = useRef(handler);

  // 更新 handler 引用
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;

      // 如果点击的是元素内部，不触发回调
      if (!element || element.contains(event.target as Node)) {
        return;
      }

      handlerRef.current(event);
    };

    // 使用捕获阶段来确保在其他事件处理器之前执行
    document.addEventListener('mousedown', listener, true);
    document.addEventListener('touchstart', listener, true);

    return () => {
      document.removeEventListener('mousedown', listener, true);
      document.removeEventListener('touchstart', listener, true);
    };
  }, [enabled]);

  return ref;
}

/**
 * useClickOutsideMultiple Hook
 * 支持多个元素的点击外部检测
 *
 * @param handler 点击外部时的回调函数
 * @param enabled 是否启用监听
 * @returns refs 数组
 *
 * @example
 * ```tsx
 * const [triggerRef, menuRef] = useClickOutsideMultiple(() => {
 *   setIsOpen(false);
 * });
 *
 * return (
 *   <>
 *     <button ref={triggerRef}>Open Menu</button>
 *     <div ref={menuRef} className="menu">Menu content</div>
 *   </>
 * );
 * ```
 */
export function useClickOutsideMultiple<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  count: number = 2,
  enabled: boolean = true
): RefObject<T>[] {
  const refs = useRef<RefObject<T>[]>(
    Array.from({ length: count }, () => ({ current: null }))
  ).current;

  const handlerRef = useRef(handler);

  // 更新 handler 引用
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      // 检查是否点击在任意一个元素内部
      const clickedInside = refs.some((ref) => {
        const element = ref.current;
        return element && element.contains(event.target as Node);
      });

      if (!clickedInside) {
        handlerRef.current(event);
      }
    };

    document.addEventListener('mousedown', listener, true);
    document.addEventListener('touchstart', listener, true);

    return () => {
      document.removeEventListener('mousedown', listener, true);
      document.removeEventListener('touchstart', listener, true);
    };
  }, [refs, enabled]);

  return refs;
}

/**
 * useClickOutsideWithExclusions Hook
 * 带排除元素的点击外部检测
 *
 * @param handler 点击外部时的回调函数
 * @param exclusions 要排除的元素选择器或 ref 数组
 * @param enabled 是否启用监听
 * @returns ref 对象
 *
 * @example
 * ```tsx
 * const ref = useClickOutsideWithExclusions(
 *   () => setIsOpen(false),
 *   ['.modal-trigger', '.tooltip'], // 点击这些元素不会触发
 *   isOpen
 * );
 *
 * return <div ref={ref}>Content</div>;
 * ```
 */
export function useClickOutsideWithExclusions<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  exclusions: (string | RefObject<HTMLElement>)[] = [],
  enabled: boolean = true
): RefObject<T> {
  const ref = useRef<T>(null);
  const handlerRef = useRef(handler);
  const exclusionsRef = useRef(exclusions);

  // 更新引用
  useEffect(() => {
    handlerRef.current = handler;
    exclusionsRef.current = exclusions;
  }, [handler, exclusions]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      const target = event.target as Node;

      // 检查是否点击在主元素内部
      if (!element || element.contains(target)) {
        return;
      }

      // 检查是否点击在排除元素内部
      const clickedInExclusion = exclusionsRef.current.some((exclusion) => {
        if (typeof exclusion === 'string') {
          // 选择器字符串
          const excludedElement = document.querySelector(exclusion);
          return excludedElement && excludedElement.contains(target);
        } else {
          // Ref 对象
          return exclusion.current && exclusion.current.contains(target);
        }
      });

      if (clickedInExclusion) {
        return;
      }

      handlerRef.current(event);
    };

    document.addEventListener('mousedown', listener, true);
    document.addEventListener('touchstart', listener, true);

    return () => {
      document.removeEventListener('mousedown', listener, true);
      document.removeEventListener('touchstart', listener, true);
    };
  }, [enabled]);

  return ref;
}

export default useClickOutside;
