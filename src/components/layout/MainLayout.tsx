import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useThemeStore } from '@/stores';
import { cn } from '@/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  detailPanel?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, detailPanel }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      'h-screen w-screen flex text-sm overflow-hidden',
      isDark ? 'bg-dark-900' : 'bg-slate-100'
    )}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className={cn(
        'flex-1 flex flex-col min-w-0 relative',
        isDark ? 'bg-dark-900' : 'bg-slate-100'
      )}>
        <Header />
        <div className="flex-1 overflow-hidden flex">
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Detail Panel */}
          {detailPanel}
        </div>
      </main>
    </div>
  );
};
