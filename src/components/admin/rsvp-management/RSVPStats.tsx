import React from 'react';
import { Target, CheckCircle, Users, MapPin, Utensils, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { RSVPStats } from './types';

interface RSVPStatsProps {
  stats: RSVPStats;
}

const RSVPStatsComponent: React.FC<RSVPStatsProps> = ({ stats }) => {
  return (
    <>
      {/* Main Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="glass-card p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-4 h-4 text-glass-blue" />
            <span className="text-xs text-muted-foreground">Response Rate</span>
          </div>
          <div className="text-sm font-semibold">{stats.responseRate}%</div>
          <Progress value={stats.responseRate} className="h-1 mt-1" />
        </div>
        <div className="glass-card p-3 text-center">
          <CheckCircle className="w-4 h-4 mx-auto text-glass-green mb-1" />
          <div className="text-sm font-semibold">{stats.attending}</div>
          <div className="text-xs text-muted-foreground">Attending</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Users className="w-4 h-4 mx-auto text-glass-purple mb-1" />
          <div className="text-sm font-semibold">{stats.totalGuests}</div>
          <div className="text-xs text-muted-foreground">Total Guests</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MapPin className="w-4 h-4 text-glass-pink" />
            <span className="text-xs text-muted-foreground">Capacity</span>
          </div>
          <div className="text-sm font-semibold">{stats.capacityUsed}%</div>
          <Progress value={stats.capacityUsed} className="h-1 mt-1" />
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="glass-card p-2 text-center">
          <Utensils className="w-3 h-3 mx-auto text-glass-green mb-1" />
          <div className="text-xs font-semibold">{stats.dietaryRestrictions}</div>
          <div className="text-xs text-muted-foreground">Dietary</div>
        </div>
        <div className="glass-card p-2 text-center">
          <Users className="w-3 h-3 mx-auto text-glass-blue mb-1" />
          <div className="text-xs font-semibold">{stats.plusOnes}</div>
          <div className="text-xs text-muted-foreground">Plus Ones</div>
        </div>
        <div className="glass-card p-2 text-center">
          <MapPin className="w-3 h-3 mx-auto text-glass-purple mb-1" />
          <div className="text-xs font-semibold">{stats.needAccommodation}</div>
          <div className="text-xs text-muted-foreground">Accommodation</div>
        </div>
        <div className="glass-card p-2 text-center">
          <Clock className="w-3 h-3 mx-auto text-glass-pink mb-1" />
          <div className="text-xs font-semibold">{stats.pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
      </div>
    </>
  );
};

export default RSVPStatsComponent;