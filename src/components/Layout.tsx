import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';

export default function Layout():React.ReactElement {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  console.log("Iam layout");
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        
        <div className="flex-1 lg:ml-64">
          <Navbar onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}