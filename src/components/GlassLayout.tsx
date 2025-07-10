import React, { ReactNode, useState, useEffect } from 'react';
import GlassNavigation from './GlassNavigation';
import ProfileDropdown from './ProfileDropdown';
import NotificationBell from './NotificationBell';
import EnhancedMessenger from './chat/EnhancedMessenger';

interface GlassLayoutProps {
  children: ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
  showNavigation?: boolean;
}

interface MessengerState {
  isOpen: boolean;
  isMinimized: boolean;
  isCenter: boolean;
}

const GlassLayout: React.FC<GlassLayoutProps> = ({ 
  children, 
  activeRoute, 
  onNavigate, 
  showNavigation = true 
}) => {
  // Messenger state management
  const [messengerState, setMessengerState] = useState<MessengerState>({
    isOpen: false,
    isMinimized: false,
    isCenter: false
  });
  
  // Dashboard state (will be passed from GlassNavigation)
  const [isDashboardActive, setIsDashboardActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for global messenger events (can be triggered from any page)
  useEffect(() => {
    const handleOpenMessenger = (event: CustomEvent) => {
      setMessengerState({
        isOpen: true,
        isMinimized: false,
        isCenter: event.detail?.center ?? true
      });
    };

    const handleDashboardToggle = (event: CustomEvent) => {
      setIsDashboardActive(event.detail?.isOpen ?? false);
    };

    // Global event listeners
    window.addEventListener('openMessenger' as any, handleOpenMessenger);
    window.addEventListener('dashboardToggle' as any, handleDashboardToggle);

    return () => {
      window.removeEventListener('openMessenger' as any, handleOpenMessenger);
      window.removeEventListener('dashboardToggle' as any, handleDashboardToggle);
    };
  }, []);

  const handleMessengerMinimize = () => {
    setMessengerState(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized,
      isCenter: false // When minimized, move to corner
    }));
  };

  const handleMessengerClose = () => {
    setMessengerState({
      isOpen: false,
      isMinimized: false,
      isCenter: false
    });
  };

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
          onDashboardToggle={setIsDashboardActive}
        />
      )}

      {/* Enhanced Messenger - Global Instance */}
      {(messengerState.isOpen || messengerState.isMinimized) && (
        <EnhancedMessenger
          isMinimized={messengerState.isMinimized}
          isMobile={isMobile}
          isCenter={messengerState.isCenter}
          isDashboardActive={isDashboardActive}
          onMinimize={handleMessengerMinimize}
          onClose={handleMessengerClose}
        />
      )}
    </div>
  );
};

export default GlassLayout;