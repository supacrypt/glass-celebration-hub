import React from 'react';
import DashboardStats from '../DashboardStats';
import RecentActivity from '../RecentActivity';
import { StatItem, ActivityItem } from '../types';

interface OverviewTabProps {
  stats: StatItem[];
  activities: ActivityItem[];
  userRole: 'guest' | 'admin' | 'couple';
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats, activities, userRole }) => {
  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} userRole={userRole} />
      <RecentActivity activities={activities} />
    </div>
  );
};

export default OverviewTab;