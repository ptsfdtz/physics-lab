import React from 'react';

import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden text-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">{children}</main>
    </div>
  );
};

export default MainLayout;
