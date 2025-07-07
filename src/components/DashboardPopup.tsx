import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import AccessRestrictedView from './dashboard/AccessRestrictedView';
import AdminControlCentre from './admin/AdminControlCentre';
import GuestDashboardContent from './dashboard/GuestDashboardContent';

interface DashboardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'guest' | 'admin' | 'couple';
}

const DashboardPopup: React.FC<DashboardPopupProps> = ({ isOpen, onClose }) => {
  const { userRole: authUserRole } = useAuth();
  const { stats, users, rsvps, photos, loading, fetchDashboardData } = useDashboardData();
  
  useKeyboardShortcuts({ isOpen, onClose });

  useEffect(() => {
    if (isOpen) {
      fetchDashboardData();
    }
  }, [isOpen, fetchDashboardData]);

  if (!isOpen) return null;

  // Access restriction check
  if (authUserRole?.role !== 'admin' && authUserRole?.role !== 'couple' && authUserRole?.role !== 'guest') {
    return <AccessRestrictedView onClose={onClose} />;
  }

  // Responsive container dimensions based on breakpoints
  const getContainerStyles = () => {
    return {
      // Mobile < 640px: 60vh/400px max, 90vw
      width: 'min(90vw, 800px)',
      height: 'min(60vh, 400px)',
      maxHeight: '400px',
      // Tablet 640-1024px: 55vh/450px max, 80vw  
      '@media (min-width: 640px)': {
        width: 'min(80vw, 800px)',
        height: 'min(55vh, 450px)',
        maxHeight: '450px'
      },
      // Desktop > 1024px: 50vh/500px max, 800px
      '@media (min-width: 1024px)': {
        width: 'min(800px, 90vw)',
        height: 'min(50vh, 500px)',
        maxHeight: '500px'
      }
    };
  };

  return (
    <>
      {/* Invisible Backdrop */}
      <div 
        className="fixed inset-0 z-[100] transition-all duration-300 ease-out bg-black/20"
        onClick={onClose}
      />
      
      {/* Enhanced Control Centre - Positioned close to bottom navigation */}
      <div 
        className="fixed left-1/2 transform -translate-x-1/2 z-[110]" 
        style={{ bottom: 'calc(24px + 80px + 12px)' }}
      >
        <div 
          className="glass-popup animate-scale-in shadow-2xl flex flex-col rounded-xl overflow-hidden
                     w-[90vw] h-[60vh] max-h-[400px]
                     sm:w-[80vw] sm:h-[55vh] sm:max-h-[450px]
                     lg:w-[800px] lg:h-[50vh] lg:max-h-[500px]"
          onClick={(e) => e.stopPropagation()}
        >
          {authUserRole?.role === 'admin' || authUserRole?.role === 'couple' ? (
            <AdminControlCentre
              stats={stats}
              users={users}
              rsvps={rsvps}
              photos={photos}
              loading={loading}
              onRefresh={fetchDashboardData}
              onClose={onClose}
              userRole={authUserRole?.role}
            />
          ) : (
            <GuestDashboardContent stats={stats} onClose={onClose} />
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPopup;