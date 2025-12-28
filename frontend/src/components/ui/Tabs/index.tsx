/**
 * Tabs 组件
 * 标签页切换
 */

import React, { useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { tabVariants } from '@/styles/variants';
import { useTabs } from './useTabs';
import type { Tab, TabsProps, TabPanelProps } from './types';
import styles from './index.module.css';

// ============ 内联子组件 ============

/** Tab 按钮 */
const TabButton = memo<{
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  tabClassName?: string;
  activeTabClassName?: string;
}>(({ tab, isActive, onClick, tabClassName, activeTabClassName }) => (
  <button
    onClick={onClick}
    disabled={tab.disabled}
    className={cn(styles.tabButton, tabClassName, isActive && activeTabClassName)}
    role="tab"
    aria-selected={isActive}
    aria-controls={`tabpanel-${tab.id}`}
    id={`tab-${tab.id}`}
  >
    {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
    <span>{tab.label}</span>
  </button>
));

TabButton.displayName = 'TabButton';

// ============ 主组件 ============

/**
 * Tabs 组件
 */
const TabsComponent: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  className,
  tabClassName,
  activeTabClassName,
}) => {
  const { handleKeyDown } = useTabs({ tabs, activeTab, onChange });

  const variantStyles = useMemo(() => tabVariants[variant], [variant]);

  return (
    <div className={cn(variantStyles.container, className)} role="tablist" onKeyDown={handleKeyDown}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTab}
          onClick={() => !tab.disabled && onChange(tab.id)}
          tabClassName={cn(variantStyles.tab, tabClassName)}
          activeTabClassName={cn(variantStyles.activeTab, activeTabClassName)}
        />
      ))}
    </div>
  );
};

TabsComponent.displayName = 'Tabs';

export const Tabs = memo(TabsComponent);

/**
 * TabPanel 组件
 */
const TabPanelComponent: React.FC<TabPanelProps> = ({
  id,
  activeTab,
  children,
  className,
  animated = false,
  keepMounted = false,
}) => {
  const isActive = id === activeTab;

  // 不活动且不保持挂载，直接返回 null
  if (!isActive && !keepMounted) {
    return null;
  }

  // 带动画的面板
  if (animated) {
    return (
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(styles.tabPanel, className)}
            role="tabpanel"
            id={`tabpanel-${id}`}
            aria-labelledby={`tab-${id}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // 静态面板
  return (
    <div
      className={cn(styles.tabPanel, !isActive && styles.tabPanelHidden, className)}
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
    >
      {children}
    </div>
  );
};

TabPanelComponent.displayName = 'TabPanel';

export const TabPanel = memo(TabPanelComponent);

// 导出
export type { Tab, TabsProps, TabPanelProps } from './types';
export default Tabs;
