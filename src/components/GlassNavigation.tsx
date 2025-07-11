import React, { useState, useCallback, useEffect } from 'react';
import DashboardPopup from './DashboardPopup';
import ResponsiveNavigation from './navigation/ResponsiveNavigation';
import { useAuth } from '@/hooks/useAuth';
import { NAVIGATION_ROUTES } from './navigation/constants';
import type { NavigationProps } from './navigation/types';



const GlassNavigation: React.FC<NavigationProps> = ({ activeRoute, onNavigate = () => {} }) => {
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const { userRole } = useAuth();

  // Debug state changes
  useEffect(() => {
    console.log('GlassNavigation isDashboardOpen changed:', isDashboardOpen);
  }, [isDashboardOpen]);

  useEffect(() => {
    console.log('GlassNavigation userRole changed:', userRole);
  }, [userRole]);

  const handleRouteClick = (routeId: string) => {
    console.log('Route clicked:', routeId);
    if (routeId === 'dashboard') {
      console.log('Dashboard clicked, current state:', isDashboardOpen);
      const newState = !isDashboardOpen;
      setIsDashboardOpen(newState);
      // Force update with timeout if needed
      if (newState && !isDashboardOpen) {
        setTimeout(() => {
          console.log('[FORCE UPDATE] Ensuring dashboard is open');
          setIsDashboardOpen(true);
        }, 10);
      }
    } else {
      console.log('Navigating to:', routeId);
      onNavigate(routeId);
    }
  };

  const handleDashboardClose = useCallback(() => {
    setIsDashboardOpen(false);
  }, []);

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