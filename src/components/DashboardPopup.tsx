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
      {/* Enhanced Backdrop with proper blur */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-all duration-300 ease-out"
        onClick={onClose}
        style={{ backdropFilter: 'blur(8px)' }}
      />
      
      {/* Enhanced Dashboard Modal - Fully Responsive */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 lg:p-6">
        <div 
          className="glass-popup animate-scale-in shadow-2xl flex flex-col w-full max-w-[95vw] max-h-[95vh] sm:max-w-[90vw] sm:max-h-[90vh] lg:max-w-[700px] lg:max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <DashboardHeader userRole={authUserRole?.role} onClose={onClose} />

          {/* Content Container with Proper Scrolling */}
          <div className="flex-1 overflow-hidden">
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