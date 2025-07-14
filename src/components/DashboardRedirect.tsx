import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const DashboardRedirect: React.FC = () => {
  const { userRole, user, loading } = useAuth();
  const navigate = useNavigate();
  
  

  useEffect(() => {
    
    
    // For guests, trigger the dashboard popup by dispatching a custom event
    if (userRole?.role !== 'admin') {
      
      // Navigate to home first
      navigate('/', { replace: true });
      
      // Then trigger dashboard popup after a brief delay
      setTimeout(() => {
        
        const event = new CustomEvent('openDashboard');
        window.dispatchEvent(event);
      }, 100);
    }
  }, [userRole, navigate]);

  // Redirect admin users to admin dashboard
  if (userRole?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Redirect regular users to home (the dashboard popup will open via the event)
  return <Navigate to="/" replace />;
};