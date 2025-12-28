/**
 * useToggle Hook
 * 布尔值切换 Hook
 *
 * 提供简单的布尔值状态管理和切换功能
 */

import { useState, useCallback, Dispatch, SetStateAction } from 'react';

/**
 * useToggle 返回值类型
 */
export type UseToggleReturn = [
  boolean,
  {
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
    set: Dispatch<SetStateAction<boolean>>;
  }
];

/**
 * useToggle Hook
 *
 * @param initialValue 初始值，默认为 false
 * @returns [value, { toggle, setTrue, setFalse, set }]
 *
 * @example
 * ```tsx
 * const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false);
 *
 * return (
 *   <>
 *     <button onClick={toggle}>Toggle</button>
 *     <button onClick={setTrue}>Open</button>
 *     <button onClick={setFalse}>Close</button>
 *     {isOpen && <Modal />}
 *   </>
 * );
 * ```
 */
export function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, { toggle, setTrue, setFalse, set: setValue }];
}

export default useToggle;
