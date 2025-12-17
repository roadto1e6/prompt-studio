import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  detailPanel?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, detailPanel }) => {
  return (
    <div className="h-screen w-screen flex text-sm overflow-hidden bg-theme-bg-secondary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-theme-bg-secondary">
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
