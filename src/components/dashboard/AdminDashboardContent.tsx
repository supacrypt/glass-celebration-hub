import React, { useState } from 'react';
import { SwipeableTabsNavigation } from '@/components/mobile/SwipeableTabsNavigation';
import CompactStats from '@/components/admin/CompactStats';
import UnifiedAccountsManagement from '@/components/admin/UnifiedAccountsManagement';
import WeddingGuestManagement from '@/components/admin/WeddingGuestManagement';
import EnhancedPhotoModeration from '@/components/admin/EnhancedPhotoModeration';
import EnhancedRSVPManagement from '@/components/admin/EnhancedRSVPManagement';
import CompactGiftManagement from '@/components/admin/CompactGiftManagement';
import CompactSystemSettings from '@/components/admin/CompactSystemSettings';
import AnalyticsInsights from '@/components/admin/AnalyticsInsights';
import EnhancedAnalytics from '@/components/admin/EnhancedAnalytics';
import ThemeCustomization from '@/components/admin/ThemeCustomization';
import EventTimeline from '@/components/admin/EventTimeline';
import NotificationCenter from '@/components/admin/NotificationCenter';
import type { AdminStats, User, RSVP, Photo } from './types';

interface AdminDashboardContentProps {
  stats: AdminStats;
  users: User[];
  rsvps: RSVP[];
  photos: Photo[];
  onRefresh: () => void;
}

const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({
  stats,
  users,
  rsvps,
  photos,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState('stats');

  const adminTabs = [
    { 
      id: 'stats', 
      label: 'Stats',
      component: <CompactStats stats={stats} />
    },
    { 
      id: 'accounts', 
      label: 'Accounts',
      component: <UnifiedAccountsManagement users={users} onRefresh={onRefresh} />
    },
    { 
      id: 'photos', 
      label: 'Photos',
      component: <EnhancedPhotoModeration photos={photos as any} onRefresh={onRefresh} />
    },
    { 
      id: 'gifts', 
      label: 'Gifts',
      component: <CompactGiftManagement />
    },
    { 
      id: 'rsvps', 
      label: 'RSVPs',
      component: <EnhancedRSVPManagement rsvps={rsvps} onRefresh={onRefresh} />
    },
    { 
      id: 'analytics', 
      label: 'Analytics',
      component: <EnhancedAnalytics />
    },
    // Messages and Alerts removed from dashboard popup - moved to notification bell
    { 
      id: 'timeline', 
      label: 'Timeline',
      component: <EventTimeline />
    },
    { 
      id: 'settings', 
      label: 'Settings',
      component: <ThemeCustomization />
    },
  ];

  return (
    <div className="h-full">
      <SwipeableTabsNavigation
        tabs={adminTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default AdminDashboardContent;