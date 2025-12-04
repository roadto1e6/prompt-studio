import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  detailPanel?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, detailPanel }) => {
  return (
    <div className="h-screen w-screen flex bg-dark-900 text-sm overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-dark-900 relative">
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
