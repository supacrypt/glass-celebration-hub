import React from 'react';
import { Users, Calendar, Image, MessageSquare, CheckCircle, Activity } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalRSVPs: number;
  pendingPhotos: number;
  totalMessages: number;
  approvedPhotos: number;
  activeUsers: number;
}

interface CompactStatsProps {
  stats: AdminStats;
}

const CompactStats: React.FC<CompactStatsProps> = ({ stats }) => {
  const statItems = [
    {
      icon: Users,
      label: 'Users',
      value: stats.totalUsers,
      color: 'glass-blue',
    },
    {
      icon: Calendar,
      label: 'RSVPs',
      value: stats.totalRSVPs,
      color: 'glass-green',
    },
    {
      icon: Image,
      label: 'Pending',
      value: stats.pendingPhotos,
      color: 'glass-pink',
      urgent: stats.pendingPhotos > 0,
    },
    {
      icon: CheckCircle,
      label: 'Approved',
      value: stats.approvedPhotos,
      color: 'glass-green',
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      value: stats.totalMessages,
      color: 'glass-purple',
    },
    {
      icon: Activity,
      label: 'Active',
      value: stats.activeUsers,
      color: 'glass-blue',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`glass-card p-3 text-center space-y-2 transition-all duration-200 hover:scale-105 ${
              item.urgent ? 'ring-2 ring-destructive/20' : ''
            }`}
          >
            <Icon className={`w-5 h-5 mx-auto text-${item.color}`} />
            <div className="text-lg font-semibold text-wedding-navy">
              {item.value}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {item.label}
            </div>
            {item.urgent && (
              <div className="w-2 h-2 bg-destructive rounded-full mx-auto animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CompactStats;