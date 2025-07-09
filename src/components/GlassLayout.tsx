import React, { ReactNode } from 'react';
import GlassNavigation from './GlassNavigation';
import ProfileDropdown from './ProfileDropdown';
import NotificationBell from './NotificationBell';

interface GlassLayoutProps {
  children: ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
  showNavigation?: boolean;
}

const GlassLayout: React.FC<GlassLayoutProps> = ({ 
  children, 
  activeRoute, 
  onNavigate, 
  showNavigation = true 
}) => {
  return (
    <div className="min-h-screen relative">
      {/* Background Mesh Gradient - Applied globally in CSS */}
      
      {/* Profile Dropdown */}
      <ProfileDropdown />
      
      {/* Notification Bell - positioned in top-right */}
      <div className="fixed top-4 right-14 z-50">
        <NotificationBell />
      </div>
      
      {/* Main Content Area */}
      <main className={`relative ${showNavigation ? 'pb-glass-nav' : ''}`}>
        {children}
      </main>
      
      {/* Glass Navigation */}
      {showNavigation && (
        <GlassNavigation 
          activeRoute={activeRoute} 
          onNavigate={onNavigate} 
        />
      )}
    </div>
  );
};

export default GlassLayout;