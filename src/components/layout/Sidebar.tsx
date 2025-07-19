import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X,
  Plus
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'create-event', label: 'Create Event', icon: Plus },
  { id: 'my-events', label: 'My Events', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  activeSection, 
  onSectionChange 
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={handleMobileToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-xl shadow-lg border border-border"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={handleMobileToggle}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full bg-card border-r border-border z-40
          transition-all duration-500 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          animate-slide-in-left
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-foreground">Menu</h2>
                <p className="text-sm text-muted-foreground">Provider Dashboard</p>
              </div>
            )}
            <button
              onClick={onToggle}
              className="hidden lg:block p-2 hover:bg-muted rounded-lg transition-all duration-300 group"
            >
              <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  sidebar-link w-full text-left
                  ${activeSection === item.id ? 'active' : ''}
                  stagger-delay-${index + 1} animate-slide-in-left
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="animate-fade-in">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button className="sidebar-link w-full text-left text-destructive hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="animate-fade-in">Logout</span>
            )}
          </button>
        </div>

        {/* Resize Handle */}
        <div 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-border hover:bg-primary cursor-col-resize transition-colors duration-300"
          onClick={onToggle}
        />
      </aside>
    </>
  );
};

export default Sidebar;