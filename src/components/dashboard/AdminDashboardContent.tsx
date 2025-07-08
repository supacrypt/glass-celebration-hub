import React, { useState } from 'react';
import CompactStats from '@/components/admin/CompactStats';
import CompactUserManagement from '@/components/admin/CompactUserManagement';
import EnhancedGuestManagement from '@/components/admin/EnhancedGuestManagement';
import EnhancedPhotoModeration from '@/components/admin/EnhancedPhotoModeration';
import EnhancedRSVPManagement from '@/components/admin/EnhancedRSVPManagement';
import CompactGiftManagement from '@/components/admin/CompactGiftManagement';
import CompactSystemSettings from '@/components/admin/CompactSystemSettings';
import AnalyticsInsights from '@/components/admin/AnalyticsInsights';
import EnhancedCommunicationCenter from '@/components/admin/EnhancedCommunicationCenter';
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
    { id: 'stats', label: 'Stats' },
    { id: 'users', label: 'Users' },
    { id: 'guests', label: 'Guests' },
    { id: 'photos', label: 'Photos' },
    { id: 'gifts', label: 'Gifts' },
    { id: 'rsvps', label: 'RSVPs' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'comms', label: 'Messages' },
    { id: 'notifications', label: 'Alerts' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Tab Navigation */}
      <div className="px-2 sm:px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 sm:px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-wedding-navy text-white shadow-md'
                  : 'text-wedding-navy hover:bg-wedding-navy/10 glass-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content with Proper Scrolling */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-2 sm:px-4 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {/* Dynamic Content Rendering */}
          <div className="space-y-4">
            {activeTab === 'stats' && <CompactStats stats={stats} />}
            {activeTab === 'users' && <CompactUserManagement users={users} onRefresh={onRefresh} />}
            {activeTab === 'guests' && <EnhancedGuestManagement users={users} onRefresh={onRefresh} />}
            {activeTab === 'photos' && <EnhancedPhotoModeration photos={photos as any} onRefresh={onRefresh} />}
            {activeTab === 'gifts' && <CompactGiftManagement />}
            {activeTab === 'rsvps' && <EnhancedRSVPManagement rsvps={rsvps} onRefresh={onRefresh} />}
            {activeTab === 'analytics' && <AnalyticsInsights />}
            {activeTab === 'comms' && <EnhancedCommunicationCenter />}
            {activeTab === 'notifications' && <NotificationCenter />}
            {activeTab === 'timeline' && <EventTimeline />}
            {activeTab === 'settings' && <CompactSystemSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;