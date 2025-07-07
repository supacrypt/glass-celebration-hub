import React, { ReactNode } from 'react';
import GlassNavigation from './GlassNavigation';
import ProfileDropdown from './ProfileDropdown';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';

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
  // Initialize real-time notifications
  useRealTimeNotifications();
  return (
    <div className="min-h-screen relative">
      {/* Background Mesh Gradient - Applied globally in CSS */}
      
      {/* Profile Dropdown */}
      <ProfileDropdown />
      
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