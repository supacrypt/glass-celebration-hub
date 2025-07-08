import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import AccessRestrictedView from './dashboard/AccessRestrictedView';
import DashboardHeader from './dashboard/DashboardHeader';
import AdminDashboardContent from './dashboard/AdminDashboardContent';
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
      // Prevent body scroll when dashboard opens
      document.body.classList.add('dashboard-open');
    } else {
      // Re-enable body scroll when dashboard closes
      document.body.classList.remove('dashboard-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('dashboard-open');
    };
  }, [isOpen, fetchDashboardData]);

  if (!isOpen) return null;

  // Access restriction check
  if (authUserRole?.role !== 'admin' && authUserRole?.role !== 'couple' && authUserRole?.role !== 'guest') {
    return <AccessRestrictedView onClose={onClose} />;
  }

  return (
    <>
      {/* Mobile-optimized backdrop overlay */}
      <div 
        className="dashboard-overlay"
        onClick={onClose}
      />
      
      {/* Mobile-first Dashboard Popup */}
      <div className="dashboard-popup">
        <div 
          className="dashboard-popup-content flex flex-col max-w-[95vw] w-full sm:max-w-[90vw] lg:max-w-[800px]"
          onClick={(e) => e.stopPropagation()}
        >
          <DashboardHeader userRole={authUserRole?.role} onClose={onClose} />

          {/* Content Container with Mobile-optimized Scrolling */}
          <div className="flex-1 overflow-hidden" style={{ maxHeight: 'calc(80vh - 60px)' }}>
            {loading ? (
              <div className="flex items-center justify-center h-40 p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-navy" />
              </div>
            ) : authUserRole?.role === 'admin' || authUserRole?.role === 'couple' ? (
              <AdminDashboardContent
                stats={stats}
                users={users}
                rsvps={rsvps}
                photos={photos}
                onRefresh={fetchDashboardData}
              />
            ) : (
              <GuestDashboardContent stats={stats} onClose={onClose} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPopup;