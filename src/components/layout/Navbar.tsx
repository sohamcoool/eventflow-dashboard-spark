import React from 'react';
import { Bell, Search, User } from 'lucide-react';

interface NavbarProps {
  userProfile: {
    name: string;
    avatar?: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({ userProfile }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50 animate-slide-down">
      <div className="max-w-full px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Course Provider
              </h1>
              <p className="text-xs text-muted-foreground">Events Platform</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search events, analytics..."
                className="w-full pl-10 pr-4 py-2 bg-input/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center text-xs text-white animate-pulse">
                3
              </span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 p-2 hover:bg-primary/5 rounded-xl cursor-pointer transition-all duration-300 group">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform duration-300">
                {userProfile.avatar ? (
                  <img 
                    src={userProfile.avatar} 
                    alt={userProfile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-foreground">{userProfile.name}</p>
                <p className="text-xs text-muted-foreground">Provider</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;