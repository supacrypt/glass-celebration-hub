import React from 'react';
import WireframeAdminDashboard from './WireframeAdminDashboard';
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
  return (
    <WireframeAdminDashboard
      stats={stats}
      users={users}
      rsvps={rsvps}
      photos={photos}
      onRefresh={onRefresh}
    />
  );
};

export default AdminDashboardContent;