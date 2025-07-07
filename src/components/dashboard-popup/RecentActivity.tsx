import React from 'react';
import { ActivityItem } from './types';

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="glass-card p-4">
      <h3 className="text-base font-semibold text-foreground mb-3">Recent Activity</h3>
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 glass-button text-sm cursor-pointer"
          >
            <span className="text-base">{activity.icon}</span>
            <span className="flex-1 text-[#5a5651]">{activity.text}</span>
            <span className="text-xs text-[#8a8580]">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;