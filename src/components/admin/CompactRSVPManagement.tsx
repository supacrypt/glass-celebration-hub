import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface RSVP {
  id: string;
  user_id: string;
  event_id: string;
  status: string;
  guest_count: number;
  created_at: string;
  profiles: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

interface CompactRSVPManagementProps {
  rsvps: RSVP[];
}

const CompactRSVPManagement: React.FC<CompactRSVPManagementProps> = ({ rsvps }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRSVPs = rsvps.filter(rsvp =>
    rsvp.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${rsvp.profiles.first_name} ${rsvp.profiles.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.status === 'attending').length,
    declined: rsvps.filter(r => r.status === 'declined').length,
    pending: rsvps.filter(r => r.status === 'pending').length,
    totalGuests: rsvps.reduce((sum, r) => sum + (r.guest_count || 1), 0),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'attending': return CheckCircle;
      case 'declined': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attending': return 'default';
      case 'declined': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="glass-card p-3 text-center">
          <Calendar className="w-4 h-4 mx-auto text-glass-blue mb-1" />
          <div className="text-sm font-semibold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total RSVPs</div>
        </div>
        <div className="glass-card p-3 text-center">
          <CheckCircle className="w-4 h-4 mx-auto text-glass-green mb-1" />
          <div className="text-sm font-semibold">{stats.attending}</div>
          <div className="text-xs text-muted-foreground">Attending</div>
        </div>
        <div className="glass-card p-3 text-center">
          <XCircle className="w-4 h-4 mx-auto text-glass-pink mb-1" />
          <div className="text-sm font-semibold">{stats.declined}</div>
          <div className="text-xs text-muted-foreground">Declined</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Users className="w-4 h-4 mx-auto text-glass-purple mb-1" />
          <div className="text-sm font-semibold">{stats.totalGuests}</div>
          <div className="text-xs text-muted-foreground">Total Guests</div>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search RSVPs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="glass-secondary border-0"
      />

      {/* RSVP List */}
      <div className="space-y-2 h-72 overflow-y-auto">
        {filteredRSVPs.slice(0, 10).map((rsvp) => {
          const StatusIcon = getStatusIcon(rsvp.status);
          return (
            <div key={rsvp.id} className="glass-card p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <StatusIcon className={`w-4 h-4 flex-shrink-0 ${
                    rsvp.status === 'attending' ? 'text-glass-green' :
                    rsvp.status === 'declined' ? 'text-glass-pink' :
                    'text-glass-blue'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-wedding-navy truncate">
                      {rsvp.profiles.first_name && rsvp.profiles.last_name
                        ? `${rsvp.profiles.first_name} ${rsvp.profiles.last_name}`
                        : rsvp.profiles.email
                      }
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {rsvp.profiles.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Badge variant={getStatusColor(rsvp.status)}>
                    {rsvp.status}
                  </Badge>
                  
                  {rsvp.guest_count > 1 && (
                    <Badge variant="outline" className="text-xs">
                      +{rsvp.guest_count - 1}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredRSVPs.length > 10 && (
          <div className="text-center text-xs text-muted-foreground">
            Showing 10 of {filteredRSVPs.length} RSVPs
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="glass-card p-3 space-y-2">
        <h4 className="text-sm font-medium text-wedding-navy">Summary</h4>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Response Rate: {Math.round((stats.attending + stats.declined) / stats.total * 100)}%</div>
          <div>Average Party Size: {(stats.totalGuests / (stats.attending || 1)).toFixed(1)}</div>
          <div>Pending Responses: {stats.pending}</div>
        </div>
      </div>
    </div>
  );
};

export default CompactRSVPManagement;