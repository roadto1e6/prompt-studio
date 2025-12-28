// 文件路径: frontend/src/features/collections/components/ColorPicker/useColorPicker.ts

/**
 * ColorPicker 逻辑层
 * Headless Hook：封装颜色选择逻辑
 */

import { useCallback } from 'react';
import type { CollectionColorKey } from '../../styles/collectionStyles';
import type { UseColorPickerReturn } from './types';

/**
 * ColorPicker Headless Hook
 *
 * @description
 * 封装颜色选择的事件处理逻辑。
 * 由于组件逻辑简单，Hook 主要负责优化事件处理器。
 *
 * @param onChange - 颜色变化回调
 * @param disabled - 是否禁用
 *
 * @example
 * ```tsx
 * const { handleColorSelect } = useColorPicker(onChange, disabled);
 * ```
 */
export function useColorPicker(
  onChange: (color: CollectionColorKey) => void,
  disabled: boolean = false
): UseColorPickerReturn {
  /**
   * 处理颜色选择
   * 仅在非禁用状态下触发回调
   */
  const handleColorSelect = useCallback(
    (color: CollectionColorKey) => {
      if (!disabled) {
        onChange(color);
      }
    },
    [disabled, onChange]
  );

  return {
    handleColorSelect,
  };
}
