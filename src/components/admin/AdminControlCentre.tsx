import React, { useState, useEffect, useCallback } from 'react';
import { X, Shield, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompactStats from './CompactStats';
import CompactGuestManagement from './CompactGuestManagement';
import CompactPhotoModeration from './CompactPhotoModeration';
import CompactRSVPManagement from './CompactRSVPManagement';
import CompactGiftManagement from './CompactGiftManagement';
import CompactSystemSettings from './CompactSystemSettings';
import AnalyticsInsights from './AnalyticsInsights';
import CommunicationCenter from './CommunicationCenter';
import EventTimeline from './EventTimeline';
import NotificationCenter from './NotificationCenter';
import type { AdminStats, User, RSVP, Photo } from '../dashboard/types';

interface AdminControlCentreProps {
  stats: AdminStats;
  users: User[];
  rsvps: RSVP[];
  photos: Photo[];
  loading: boolean;
  onRefresh: () => void;
  onClose: () => void;
  userRole?: 'guest' | 'admin' | 'couple';
}

const AdminControlCentre: React.FC<AdminControlCentreProps> = ({
  stats,
  users,
  rsvps,
  photos,
  loading,
  onRefresh,
  onClose,
  userRole
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  
  const adminTabs = [
    { id: 'stats', label: 'Stats', component: CompactStats },
    { id: 'guests', label: 'Guests', component: CompactGuestManagement },
    { id: 'invitations', label: 'Invitations', component: CommunicationCenter },
    { id: 'photos', label: 'Photos', component: CompactPhotoModeration },
    { id: 'gifts', label: 'Gifts', component: CompactGiftManagement },
    { id: 'rsvps', label: 'RSVPs', component: CompactRSVPManagement },
    { id: 'settings', label: 'Settings', component: CompactSystemSettings },
  ];

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentIndex = adminTabs.findIndex(tab => tab.id === activeTab);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : adminTabs.length - 1;
      setActiveTab(adminTabs[prevIndex].id);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = adminTabs.findIndex(tab => tab.id === activeTab);
      const nextIndex = currentIndex < adminTabs.length - 1 ? currentIndex + 1 : 0;
      setActiveTab(adminTabs[nextIndex].id);
    }
  }, [activeTab, adminTabs, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const goToFullDashboard = () => {
    onClose();
    navigate('/admin/dashboard');
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-navy" />
        </div>
      );
    }

    switch (activeTab) {
      case 'stats':
        return <CompactStats stats={stats} />;
      case 'guests':
        return <CompactGuestManagement users={users} onRefresh={onRefresh} />;
      case 'photos':
        return <CompactPhotoModeration photos={photos} onRefresh={onRefresh} />;
      case 'rsvps':
        return <CompactRSVPManagement rsvps={rsvps} />;
      case 'gifts':
        return <CompactGiftManagement />;
      case 'invitations':
        return <CommunicationCenter />;
      case 'settings':
        return <CompactSystemSettings />;
      default:
        return <div className="p-4 text-center text-muted-foreground">Coming soon...</div>;
    }
  };

  return (
    <div className="admin-control-centre">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-glass-border/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-wedding-navy" />
          <h2 className="text-lg font-semibold text-wedding-navy">
            Admin Control Centre
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {userRole === 'admin' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={goToFullDashboard}
              className="text-xs"
              title="Open full dashboard (Alt+F)"
            >
              <Maximize2 className="w-4 h-4 mr-1" />
              Full View
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="w-8 h-8 p-0"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Responsive Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile: Horizontal scroll tabs */}
        <div className="block sm:hidden px-4 py-2 border-b border-glass-border/30">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {adminTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap flex-shrink-0"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </div>
        </div>

        {/* Tablet: Grid tabs */}
        <div className="hidden sm:block lg:hidden px-4 py-2 border-b border-glass-border/30">
          <div className="grid grid-cols-4 gap-1">
            {adminTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-2 py-2 text-xs font-medium rounded-lg text-center"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </div>
        </div>

        {/* Desktop: Sidebar tabs */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          <div className="w-48 border-r border-glass-border/30 flex-shrink-0">
            <TabsList className="flex flex-col h-full w-full bg-transparent p-2 gap-1">
              {adminTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="w-full justify-start px-3 py-2 text-sm font-medium rounded-lg"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-navy" />
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Content with per-tab scrolling */}
        <div className="flex-1 overflow-hidden lg:hidden">
          <div className="h-full overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-navy" />
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </Tabs>

      {/* Navigation Hint */}
      <div className="px-4 py-2 border-t border-glass-border/30 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>← → Navigate tabs</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
};

export default AdminControlCentre;