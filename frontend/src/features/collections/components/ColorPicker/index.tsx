// 文件路径: frontend/src/features/collections/components/ColorPicker/index.tsx

/**
 * ColorPicker 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/utils';
import { useI18nStore } from '@/stores';
import {
  COLLECTION_COLOR_KEYS,
  getColorConfig,
  ANIMATION_CONFIG,
} from '../../styles/collectionStyles';
import { useColorPicker } from './useColorPicker';
import type { ColorPickerProps } from './types';
import styles from './index.module.css';

/**
 * ColorPicker - 颜色选择器组件
 *
 * @description
 * 生产级颜色选择器，支持多种尺寸、禁用状态、无障碍访问。
 * 采用 Headless UI 模式，逻辑与视图分离。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：useColorPicker.ts（事件处理）
 * - 视图层：index.tsx（本文件）
 *
 * @performance
 * - React.memo 防止不必要重渲染
 * - useCallback 优化事件处理器
 * - Framer Motion 动画按需加载
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   value="blue"
 *   onChange={setColor}
 *   label="选择颜色"
 *   size="md"
 * />
 * ```
 */
export const ColorPicker = React.memo<ColorPickerProps>(({
  value,
  onChange,
  disabled = false,
  label,
  className,
  showCheckIcon = true,
  size = 'md',
}) => {
  // ==================== Hook ====================
  const { handleColorSelect } = useColorPicker(onChange, disabled);
  const { t } = useI18nStore();

  // ==================== 渲染 ====================
  return (
    <div className={cn(styles.container, className)}>
      {/* 标签 */}
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      {/* 颜色网格 */}
      <div
        className={styles.colorGrid}
        role="radiogroup"
        aria-label={label || t.createCollection?.selectColor || 'Select color'}
      >
        {COLLECTION_COLOR_KEYS.map((colorKey) => {
          const colorConfig = getColorConfig(colorKey);
          const isSelected = value === colorKey;

          return (
            <motion.button
              key={colorKey}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={colorConfig.name}
              onClick={() => handleColorSelect(colorKey)}
              disabled={disabled}
              className={cn(
                styles.colorButton,
                styles[size],
                isSelected ? styles.selected : styles.unselected,
                disabled && styles.disabled
              )}
              style={{
                backgroundColor: colorConfig.value,
              }}
              whileHover={!disabled && !isSelected ? {
                scale: ANIMATION_CONFIG.colorPicker.scale.hover
              } : undefined}
              whileTap={!disabled ? {
                scale: ANIMATION_CONFIG.colorPicker.scale.tap
              } : undefined}
              transition={ANIMATION_CONFIG.colorPicker.transition}
            >
              {/* 选中图标 */}
              {isSelected && showCheckIcon && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                  className={styles.checkIconContainer}
                >
                  <Check className={cn(styles.checkIcon, styles[size])} aria-hidden="true" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

ColorPicker.displayName = 'ColorPicker';

// Re-export types
export type { ColorPickerProps } from './types';
