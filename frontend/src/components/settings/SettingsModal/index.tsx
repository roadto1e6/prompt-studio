/**
 * SettingsModal 组件 - 视图层
 * 文件路径: frontend/src/components/settings/SettingsModal/index.tsx
 *
 * 职责：
 * 1. 纯声明式 UI 渲染
 * 2. 所有逻辑委托给 useSettingsModal Hook
 * 3. 样式通过 CSS Modules 管理
 */

import { memo, useMemo } from 'react';
import { ChevronRight, User, Shield, Cpu, X, Settings } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useI18nStore } from '@/stores';
import { ProfileSettings } from '../ProfileSettings';
import { SecuritySettings } from '../SecuritySettings';
import { ModelManagement } from '../ModelManagement';
import { useSettingsModal } from './useSettingsModal';
import styles from './index.module.css';
import type { SettingsModalProps, TabConfig } from './types';

/**
 * TabButton - 标签页按钮子组件
 */
interface TabButtonProps {
  tab: TabConfig;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = memo<TabButtonProps>(({ tab, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ''}`}
    aria-selected={isActive}
    role="tab"
  >
    <span className={styles.tabIcon}>{tab.icon}</span>
    <span className={styles.tabContent}>
      <span className={styles.tabLabel}>{tab.label}</span>
    </span>
    {isActive && (
      <ChevronRight className={styles.tabArrow} size={16} aria-hidden="true" />
    )}
  </button>
));

TabButton.displayName = 'TabButton';

/**
 * SettingsModal 组件
 *
 * @description 设置模态框，包含多个标签页（Profile、Security、AI Models）
 * @param {SettingsModalProps} props - 组件属性
 * @returns {JSX.Element} 设置模态框组件
 */
const SettingsModal = memo<SettingsModalProps>(({
  isOpen,
  onClose,
  defaultTab = 'profile',
  className = '',
}) => {
  const { t } = useI18nStore();
  const {
    activeTab,
    tabLabels,
    handleTabChange,
    onClose: closeHandler,
  } = useSettingsModal(defaultTab, onClose);

  // 标签页配置 (JSX icons在视图层定义)
  const tabs = useMemo<TabConfig[]>(() => [
    {
      id: 'profile',
      label: tabLabels.profile.label,
      icon: <User className="w-4 h-4" />,
      description: tabLabels.profile.description,
    },
    {
      id: 'security',
      label: tabLabels.security.label,
      icon: <Shield className="w-4 h-4" />,
      description: tabLabels.security.description,
    },
    {
      id: 'aiModels',
      label: tabLabels.aiModels.label,
      icon: <Cpu className="w-4 h-4" />,
      description: tabLabels.aiModels.description,
    },
  ], [tabLabels]);

  // 渲染标签内容 (JSX渲染在视图层)
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings onClose={closeHandler} />;
      case 'aiModels':
        return <ModelManagement />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      className={className}
      showClose={false}
    >
      <div className={styles.container}>
        {/* 标题栏 */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Settings size={16} className={styles.headerIcon} />
            <span>{t.settings.title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label={t.settings.closeSettings}
          >
            <X size={14} />
          </button>
        </div>

        {/* 主体区域 */}
        <div className={styles.body}>
          {/* 侧边导航 */}
          <nav className={styles.sidebar} role="tablist" aria-label={t.settings.settingsTabs}>
            <div className={styles.nav}>
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onClick={() => handleTabChange(tab.id)}
                />
              ))}
            </div>
          </nav>

          {/* 内容区域 */}
          <main className={styles.content} role="tabpanel" aria-label={`${activeTab} settings`}>
            {renderTabContent()}
          </main>
        </div>
      </div>
    </Modal>
  );
});

SettingsModal.displayName = 'SettingsModal';

export { SettingsModal };
export type { SettingsModalProps, SettingsTab } from './types';
