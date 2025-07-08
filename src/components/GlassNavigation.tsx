import React, { useState } from 'react';
import DashboardPopup from './DashboardPopup';
import ResponsiveNavigation from './navigation/ResponsiveNavigation';
import { useAuth } from '@/hooks/useAuth';
import { NAVIGATION_ROUTES } from './navigation/constants';
import type { NavigationProps } from './navigation/types';

const GlassNavigation: React.FC<NavigationProps> = ({ activeRoute, onNavigate }) => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const { userRole } = useAuth();

  const handleRouteClick = (routeId: string) => {
    if (routeId === 'dashboard') {
      setIsDashboardOpen(true);
    } else {
      onNavigate(routeId);
    }
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
        onClose={() => setIsDashboardOpen(false)}
        userRole={userRole?.role || 'guest'}
      />
    </>
  );
};

export default GlassNavigation;