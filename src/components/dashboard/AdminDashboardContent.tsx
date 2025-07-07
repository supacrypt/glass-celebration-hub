import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompactStats from '@/components/admin/CompactStats';
import CompactUserManagement from '@/components/admin/CompactUserManagement';
import CompactPhotoModeration from '@/components/admin/CompactPhotoModeration';
import CompactRSVPManagement from '@/components/admin/CompactRSVPManagement';
import CompactGiftManagement from '@/components/admin/CompactGiftManagement';
import CompactSystemSettings from '@/components/admin/CompactSystemSettings';
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
    { id: 'photos', label: 'Photos' },
    { id: 'gifts', label: 'Gifts' },
    { id: 'rsvps', label: 'RSVPs' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      {/* Compact Tab Navigation */}
      <div className="px-4 pt-2">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 glass-secondary h-8">
          {adminTabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="text-xs px-2"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Tab Content with Scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <TabsContent value="stats" className="mt-0">
          <CompactStats stats={stats} />
        </TabsContent>

        <TabsContent value="users" className="mt-0">
          <CompactUserManagement users={users} onRefresh={onRefresh} />
        </TabsContent>

        <TabsContent value="photos" className="mt-0">
          <CompactPhotoModeration photos={photos} onRefresh={onRefresh} />
        </TabsContent>

        <TabsContent value="gifts" className="mt-0">
          <CompactGiftManagement />
        </TabsContent>

        <TabsContent value="rsvps" className="mt-0">
          <CompactRSVPManagement rsvps={rsvps} />
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <CompactSystemSettings />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default AdminDashboardContent;