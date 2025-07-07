import React, { useState } from 'react';
import CompactStats from '@/components/admin/CompactStats';
import CompactUserManagement from '@/components/admin/CompactUserManagement';
import CompactGuestManagement from '@/components/admin/CompactGuestManagement';
import CompactPhotoModeration from '@/components/admin/CompactPhotoModeration';
import CompactRSVPManagement from '@/components/admin/CompactRSVPManagement';
import CompactGiftManagement from '@/components/admin/CompactGiftManagement';
import CompactSystemSettings from '@/components/admin/CompactSystemSettings';
import AnalyticsInsights from '@/components/admin/AnalyticsInsights';
import CommunicationCenter from '@/components/admin/CommunicationCenter';
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
      <div className="px-4 pt-3 pb-2">
        <div className="flex flex-wrap gap-1">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
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

      {/* Tab Content with Scroll */}
      <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {/* Dynamic Content Rendering */}
        <div className="space-y-4">
          {activeTab === 'stats' && <CompactStats stats={stats} />}
          {activeTab === 'users' && <CompactUserManagement users={users} onRefresh={onRefresh} />}
          {activeTab === 'guests' && <CompactGuestManagement users={users} onRefresh={onRefresh} />}
          {activeTab === 'photos' && <CompactPhotoModeration photos={photos} onRefresh={onRefresh} />}
          {activeTab === 'gifts' && <CompactGiftManagement />}
          {activeTab === 'rsvps' && <CompactRSVPManagement rsvps={rsvps} />}
          {activeTab === 'analytics' && <AnalyticsInsights />}
          {activeTab === 'comms' && <CommunicationCenter />}
          {activeTab === 'notifications' && <NotificationCenter />}
          {activeTab === 'timeline' && <EventTimeline />}
          {activeTab === 'settings' && <CompactSystemSettings />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;