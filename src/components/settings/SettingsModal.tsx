/**
 * Settings Modal
 * 用户设置和个人资料模态框
 *
 * 设计原则：
 * 1. 模块化组件架构
 * 2. 清晰的视觉层次
 * 3. 一致的交互反馈
 */

import { useState, useEffect } from 'react';
import { User, Shield, Cpu, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui';
import { ProfileSettings } from './ProfileSettings';
import { SecuritySettings } from './SecuritySettings';
import { ModelManagement } from './ModelManagement';
import { useI18nStore } from '@/stores/i18nStore';
import { useThemeStore } from '@/stores/themeStore';
import { useModelStore } from '@/stores/modelStore';
import { cn } from '@/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'profile' | 'security' | 'aiModels';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { t } = useI18nStore();
  const { theme } = useThemeStore();
  const { initialize: initModels, initialized: modelsInitialized } = useModelStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const isDark = theme === 'dark';

  // Initialize models when AI Models tab is selected
  useEffect(() => {
    if (activeTab === 'aiModels' && !modelsInitialized) {
      initModels();
    }
  }, [activeTab, modelsInitialized, initModels]);

  // Tab 配置
  const tabs: {
    id: SettingsTab;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: 'profile',
      label: t.settings?.profile || 'Profile',
      icon: <User className="w-4 h-4" />,
      description: t.settings?.profileDescription || 'Manage your profile',
    },
    {
      id: 'security',
      label: t.settings?.security || 'Security',
      icon: <Shield className="w-4 h-4" />,
      description: t.settings?.securityDescription || 'Password & security',
    },
    {
      id: 'aiModels',
      label: t.settings?.aiModels || 'AI Models',
      icon: <Cpu className="w-4 h-4" />,
      description: t.settings?.aiModelsDescription || 'Manage AI models',
    },
  ];

  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings onClose={onClose} />;
      case 'aiModels':
        return <ModelManagement />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.settings?.title || 'Settings'} size="3xl">
      <div className="flex gap-0 -m-6">
        {/* 侧边导航 */}
        <div
          className={cn(
            'w-56 flex-shrink-0 border-r p-4',
            isDark ? 'bg-slate-900/30 border-slate-800/50' : 'bg-slate-50 border-slate-200'
          )}
        >
          <div
            className={cn(
              'px-1 pb-3 text-xs font-semibold uppercase tracking-wide',
              isDark ? 'text-slate-500' : 'text-slate-500'
            )}
          >
            {t.settings?.navigation || 'Navigation'}
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70',
                  activeTab === tab.id
                    ? isDark
                      ? 'bg-indigo-500/10 text-white'
                      : 'bg-indigo-500/10 text-indigo-700'
                    : isDark
                      ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
                aria-current={activeTab === tab.id}
              >
                <div
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    activeTab === tab.id
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : isDark
                        ? 'bg-slate-800/50 text-slate-500 group-hover:text-slate-400'
                        : 'bg-slate-200 text-slate-500 group-hover:text-slate-600'
                  )}
                >
                  {tab.icon}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold truncate">{tab.label}</p>
                </div>
                {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
              </button>
            ))}
          </nav>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 p-6 min-h-[520px] max-h-[70vh] overflow-y-auto">
          {/* Tab 内容 */}
          {renderTabContent()}
        </div>
      </div>
    </Modal>
  );
}

export default SettingsModal;
