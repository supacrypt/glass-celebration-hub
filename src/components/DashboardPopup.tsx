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
    }
  }, [isOpen, fetchDashboardData]);

  if (!isOpen) return null;

  // Access restriction check
  if (authUserRole?.role !== 'admin' && authUserRole?.role !== 'couple' && authUserRole?.role !== 'guest') {
    return <AccessRestrictedView onClose={onClose} />;
  }

  return (
    <>
      {/* Invisible Backdrop */}
      <div 
        className="fixed inset-0 z-[100] transition-all duration-300 ease-out"
        onClick={onClose}
      />
      
      {/* Enhanced Dashboard Modal - Positioned close to bottom navigation */}
      <div className="fixed left-1/2 transform -translate-x-1/2 z-[110]" style={{ bottom: 'calc(30px + 80px + 10px)' }}>
        <div 
          className="glass-popup animate-scale-in shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 'min(98vw, 700px)',
            maxHeight: 'min(85vh, 900px)',
            minHeight: '700px'
          }}
        >
          <DashboardHeader userRole={authUserRole?.role} onClose={onClose} />

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-navy" />
              </div>
            ) : authUserRole?.role === 'admin' ? (
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