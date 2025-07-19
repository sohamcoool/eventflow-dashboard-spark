import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import DashboardContent from '../components/dashboard/DashboardContent';

const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const userProfile = {
    name: 'Alex Rivera',
    avatar: undefined
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar userProfile={userProfile} />
      
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Main Content */}
      <main 
        className={`
          transition-all duration-500 ease-in-out pt-20 min-h-screen
          ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}
      >
        <div className="p-6 lg:p-8">
          <DashboardContent 
            activeSection={activeSection}
            userName={userProfile.name}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
