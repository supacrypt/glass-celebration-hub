import React, { useState } from 'react';
import DashboardPopup from './DashboardPopup';
import ResponsiveNavigation from './navigation/ResponsiveNavigation';
import { useAuth } from '@/hooks/useAuth';
import { NAVIGATION_ROUTES } from './navigation/constants';
import type { NavigationProps } from './navigation/types';

interface EnhancedNavigationProps extends NavigationProps {
  onDashboardToggle?: (isOpen: boolean) => void;
}

const GlassNavigation: React.FC<EnhancedNavigationProps> = ({ activeRoute, onNavigate, onDashboardToggle }) => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const { userRole } = useAuth();

  const handleRouteClick = (routeId: string) => {
    if (routeId === 'dashboard') {
      const newState = !isDashboardOpen;
      setIsDashboardOpen(newState);
      onDashboardToggle?.(newState);
      
      // Dispatch global event for messenger
      window.dispatchEvent(new CustomEvent('dashboardToggle', {
        detail: { isOpen: newState }
      }));
    } else {
      onNavigate(routeId);
    }
  };

  const handleDashboardClose = () => {
    setIsDashboardOpen(false);
    onDashboardToggle?.(false);
    
    // Dispatch global event for messenger
    window.dispatchEvent(new CustomEvent('dashboardToggle', {
      detail: { isOpen: false }
    }));
  };

  return (
    <>
      <ResponsiveNavigation 
        routes={NAVIGATION_ROUTES}
        activeRoute={activeRoute}
        onRouteClick={handleRouteClick}
      />

      <DashboardPopup
        isOpen={isDashboardOpen}
        onClose={handleDashboardClose}
        userRole={userRole?.role || 'guest'}
      />
    </>
  );
};

export default GlassNavigation;