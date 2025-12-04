import React from 'react';
import { cn } from '@/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div className={cn('flex border-b border-slate-800', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-3 text-xs font-medium transition-colors flex items-center gap-2',
            activeTab === tab.id
              ? 'text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-400 border-b-2 border-transparent hover:text-slate-200'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  activeTab,
  children,
  className,
}) => {
  if (id !== activeTab) return null;
  
  return (
    <div className={cn('h-full', className)}>
      {children}
    </div>
  );
};
