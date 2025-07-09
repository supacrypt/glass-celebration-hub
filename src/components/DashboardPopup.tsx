import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { ScrollArea } from '@/components/ui/scroll-area';
import AccessRestrictedView from './dashboard/AccessRestrictedView';
import DashboardHeader from './dashboard/DashboardHeader';
import AdminDashboardContent from './dashboard/AdminDashboardContent';
import GuestDashboardContent from './dashboard/GuestDashboardContent';
import MobileOptimizedComponent from './mobile/MobileOptimizedComponent';

interface DashboardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'guest' | 'admin' | 'couple';
}

const DashboardPopup: React.FC<DashboardPopupProps> = ({ isOpen, onClose }) => {
  const { userRole: authUserRole } = useAuth();
  const { stats, users, rsvps, photos, loading, fetchDashboardData } = useDashboardData();
  const device = useResponsiveDesign();
  
  useKeyboardShortcuts({ isOpen, onClose });

  useEffect(() => {
    if (isOpen) {
      fetchDashboardData();
      // Prevent body scroll when dashboard opens - but allow dashboard content to scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when dashboard closes
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, fetchDashboardData]);

  if (!isOpen) return null;

  // Access restriction check
  if (authUserRole?.role !== 'admin' && authUserRole?.role !== 'couple' && authUserRole?.role !== 'guest') {
    return <AccessRestrictedView onClose={onClose} />;
  }

  return (
    <MobileOptimizedComponent>
      {/* Enhanced backdrop overlay with improved blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9998]"
        onClick={onClose}
      />
      
      {/* Centered Dashboard Popup with Enhanced Glass Effect */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div 
          className={`glass-popup flex flex-col w-full ${
            device.isSmallMobile 
              ? 'max-w-[95vw] max-h-[90vh]' 
              : device.isTinyMobile 
                ? 'max-w-[92vw] max-h-[88vh]'
                : device.isMobile 
                  ? 'max-w-[90vw] max-h-[85vh]'
                  : 'max-w-[800px] max-h-[80vh]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <DashboardHeader userRole={authUserRole?.role} onClose={onClose} />

          {/* Scrollable Content Container */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
          </ScrollArea>
        </div>
      </div>
    </MobileOptimizedComponent>
  );
};

export default DashboardPopup;