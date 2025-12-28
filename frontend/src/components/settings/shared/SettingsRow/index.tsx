// 文件路径: frontend/src/components/settings/shared/SettingsRow/index.tsx

/**
 * SettingsRow 组件 - 视图层
 * 设置行组件，用于展示单个设置项
 *
 * @description
 * 纯声明式 UI，零业务逻辑。
 * 所有样式计算逻辑委托给 useSettingsRow Hook。
 */

import React, { memo } from 'react';
import { useSettingsRow } from './useSettingsRow';
import type { SettingsRowProps } from './types';
import styles from './index.module.css';

/**
 * SettingsRow - 设置行组件
 *
 * @example
 * ```tsx
 * // 水平布局
 * <SettingsRow label="Dark Mode" description="Enable dark theme">
 *   <Switch checked={isDark} onChange={toggleDark} />
 * </SettingsRow>
 *
 * // 垂直布局
 * <SettingsRow label="Bio" description="Tell us about yourself" vertical>
 *   <Textarea value={bio} onChange={setBio} />
 * </SettingsRow>
 * ```
 */
const SettingsRowComponent: React.FC<SettingsRowProps> = ({
  label,
  description,
  children,
  className,
  vertical = false,
}) => {
  const {
    containerClassName,
    labelClassName,
    contentClassName,
  } = useSettingsRow({ vertical, className });

  return (
    <div className={containerClassName}>
      <div className={labelClassName}>
        <p className={styles.label}>{label}</p>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>
      <div className={contentClassName}>{children}</div>
    </div>
  );
};

export const SettingsRow = memo(SettingsRowComponent);

SettingsRow.displayName = 'SettingsRow';

// 导出类型
export type { SettingsRowProps } from './types';
export default SettingsRow;
