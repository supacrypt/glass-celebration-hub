import React from 'react';
import CompactStats from '@/components/admin/CompactStats';
import type { AdminStats } from './types';

interface GuestDashboardContentProps {
  stats: AdminStats;
  onClose: () => void;
}

const GuestDashboardContent: React.FC<GuestDashboardContentProps> = ({ 
  stats, 
  onClose 
}) => {
  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      <CompactStats stats={stats} />
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onClose}
          className="glass-card p-3 text-center space-y-1 hover:scale-105 transition-transform"
        >
          <div className="text-sm font-medium text-wedding-navy">RSVP</div>
          <div className="text-xs text-muted-foreground">Update status</div>
        </button>
        <button
          onClick={onClose}
          className="glass-card p-3 text-center space-y-1 hover:scale-105 transition-transform"
        >
          <div className="text-sm font-medium text-wedding-navy">Gallery</div>
          <div className="text-xs text-muted-foreground">View photos</div>
        </button>
      </div>
    </div>
  );
};

export default GuestDashboardContent;