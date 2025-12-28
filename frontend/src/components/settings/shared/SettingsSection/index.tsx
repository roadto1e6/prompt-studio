/**
 * SettingsSection 组件 - 视图层
 * 文件路径: frontend/src/components/settings/shared/SettingsSection/index.tsx
 *
 * 职责：
 * 1. 纯声明式 UI 渲染
 * 2. 所有逻辑委托给 useSettingsSection Hook
 * 3. 样式通过 CSS Modules 管理
 */

import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSettingsSection } from './useSettingsSection';
import styles from './index.module.css';
import type { SettingsSectionProps } from './types';

/**
 * SettingsSection 组件
 *
 * @description 设置页面的通用节组件，支持标题、描述、折叠功能
 * @param {SettingsSectionProps} props - 组件属性
 * @returns {JSX.Element} 设置节组件
 */
const SettingsSection = memo<SettingsSectionProps>(({
  title,
  description,
  children,
  className = '',
  action,
  noPadding = false,
  collapsible = false,
  defaultExpanded = true,
  expanded,
  onExpandedChange,
  showDivider = false,
}) => {
  const {
    isExpanded,
    hasHeader,
    isCollapsible,
    toggleExpanded,
    handleKeyDown,
  } = useSettingsSection({
    title,
    description,
    collapsible,
    defaultExpanded,
    expanded,
    onExpandedChange,
    children,
  });

  return (
    <section className={`${styles.container} ${className}`}>
      {/* 头部区域 */}
      {hasHeader && (
        <div
          className={`${styles.header} ${isCollapsible ? styles.collapsible : ''}`}
          onClick={isCollapsible ? toggleExpanded : undefined}
          onKeyDown={isCollapsible ? handleKeyDown : undefined}
          role={isCollapsible ? 'button' : undefined}
          tabIndex={isCollapsible ? 0 : undefined}
          aria-expanded={isCollapsible ? isExpanded : undefined}
        >
          <div className={styles.headerContent}>
            {title && (
              <h3 className={`${styles.title} ${isCollapsible ? styles.collapsible : ''}`}>
                {isCollapsible && (
                  <ChevronDown
                    className={`${styles.collapseIcon} ${isExpanded ? styles.expanded : ''}`}
                    aria-hidden="true"
                  />
                )}
                {title}
              </h3>
            )}
            {description && (
              <p className={styles.description}>{description}</p>
            )}
          </div>

          {/* 操作区域 */}
          {action && (
            <div
              className={styles.headerAction}
              onClick={(e) => e.stopPropagation()}
            >
              {action}
            </div>
          )}
        </div>
      )}

      {/* 分隔线 */}
      {showDivider && hasHeader && <div className={styles.divider} />}

      {/* 内容区域 */}
      <div
        className={`${styles.content} ${noPadding ? styles.noPadding : ''} ${
          isCollapsible && !isExpanded ? styles.collapsed : ''
        } ${isCollapsible && isExpanded ? styles.animate : ''}`}
        aria-hidden={isCollapsible && !isExpanded}
      >
        {children}
      </div>
    </section>
  );
});

SettingsSection.displayName = 'SettingsSection';

export { SettingsSection };
export type { SettingsSectionProps } from './types';
