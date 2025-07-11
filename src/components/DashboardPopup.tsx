import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import AccessRestrictedView from './dashboard/AccessRestrictedView';
import DashboardHeader from './dashboard/DashboardHeader';
import AdminDashboardContent from './dashboard/AdminDashboardContent';
import GuestDashboard from './dashboard/GuestDashboard';

interface DashboardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'guest' | 'admin' | 'couple';
}

const DashboardPopup: React.FC<DashboardPopupProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { userRole: authUserRole } = useAuth();
  
  // Determine user access level
  const effectiveRole = authUserRole?.role;
  const isAdmin = effectiveRole === 'admin' || effectiveRole === 'couple';
  
  // Always use the hook, but conditionally fetch data
  const { stats, users, rsvps, photos, loading, fetchDashboardData } = useDashboardData();
  
  useKeyboardShortcuts({ isOpen, onClose });


  useEffect(() => {
    if (isOpen) {
      // Check if user is authenticated, if not redirect to auth
      if (!authUserRole) {
        onClose();
        navigate('/auth', { state: { mode: 'signin' } });
        return;
      }
      
      // Only fetch admin data if user is admin
      if (isAdmin) {
        fetchDashboardData();
      }
      
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
  }, [isOpen, fetchDashboardData, authUserRole, navigate, onClose, isAdmin]);

  if (!isOpen) {
    return null;
  }
  
  // Only show dashboard if user is authenticated
  if (!authUserRole) {
    return null; // This shouldn't render as the redirect happens in useEffect
  }

  
  return (
    <>
      {/* Enhanced backdrop overlay with proper z-index */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ 
          zIndex: 9999,
          display: 'block',
          pointerEvents: 'auto'
        }}
        onClick={onClose}
        role="button"
        aria-label="Close dashboard"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
      />
      
      {/* Fixed positioned dashboard popup - properly centered */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ 
          zIndex: 10000,
          pointerEvents: 'none'
        }}
      >
        <div 
          className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
          style={{
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dashboard-title"
        >
          {/* Header with improved touch targets */}
          <DashboardHeader userRole={effectiveRole} onClose={onClose} />

          {/* Content container with proper scrolling */}
          <div className="flex-1 overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(90vh - 60px)' }}>
            {loading && isAdmin ? (
              <div className="flex items-center justify-center h-40 p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-wedding-navy border-t-transparent" />
              </div>
            ) : effectiveRole === 'admin' || effectiveRole === 'couple' ? (
              <AdminDashboardContent
                stats={stats}
                users={users}
                rsvps={rsvps}
                photos={photos}
                onRefresh={fetchDashboardData}
              />
            ) : (
              <GuestDashboard />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPopup;