// 文件路径: frontend/src/components/settings/shared/SettingsRow/useSettingsRow.ts

/**
 * useSettingsRow Hook
 * 逻辑层：封装所有状态和计算逻辑
 */

import { useMemo } from 'react';
import { cn } from '@/utils';
import type { UseSettingsRowReturn, UseSettingsRowOptions } from './types';
import styles from './index.module.css';

/**
 * SettingsRow 组件的业务逻辑 Hook
 *
 * @description
 * 采用 Headless UI 思路，将样式计算逻辑与视图分离。
 *
 * @param options - Hook 配置选项
 * @returns 计算后的样式类名
 */
export const useSettingsRow = ({
  vertical,
  className,
}: UseSettingsRowOptions): UseSettingsRowReturn => {
  /**
   * 计算容器样式类名
   */
  const containerClassName = useMemo(() => {
    return cn(
      vertical ? styles.containerVertical : styles.containerHorizontal,
      className
    );
  }, [vertical, className]);

  /**
   * 计算标签区域样式类名
   */
  const labelClassName = useMemo(() => {
    return vertical ? styles.labelWrapperVertical : styles.labelWrapper;
  }, [vertical]);

  /**
   * 描述样式类名
   */
  const descriptionClassName = styles.description;

  /**
   * 计算内容区域样式类名
   */
  const contentClassName = useMemo(() => {
    return vertical ? styles.contentVertical : styles.contentHorizontal;
  }, [vertical]);

  return {
    containerClassName,
    labelClassName,
    descriptionClassName,
    contentClassName,
  };
};
