import React from 'react';
import { CheckCircle, Clock, XCircle, Utensils, MapPin, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { EnhancedRSVP } from './types';

interface RSVPListProps {
  rsvps: EnhancedRSVP[];
}

const RSVPList: React.FC<RSVPListProps> = ({ rsvps }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'attending': return CheckCircle;
      case 'declined': return XCircle;
      case 'maybe': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attending': return 'default';
      case 'declined': return 'destructive';
      case 'maybe': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-2 h-64 overflow-y-auto">
      {rsvps.slice(0, 10).map((rsvp) => {
        const StatusIcon = getStatusIcon(rsvp.status);
        return (
          <div key={rsvp.id} className="glass-card p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <StatusIcon className={`w-4 h-4 flex-shrink-0 mt-1 ${
                  rsvp.status === 'attending' ? 'text-glass-green' :
                  rsvp.status === 'declined' ? 'text-glass-pink' :
                  rsvp.status === 'maybe' ? 'text-glass-blue' :
                  'text-muted-foreground'
                }`} />
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-wedding-navy truncate">
                    {rsvp.profiles.first_name && rsvp.profiles.last_name
                      ? `${rsvp.profiles.first_name} ${rsvp.profiles.last_name}`
                      : rsvp.profiles.email
                    }
                    {rsvp.plus_one_name && (
                      <span className="text-xs text-glass-pink ml-2">+{rsvp.plus_one_name}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {rsvp.profiles.email}
                  </div>
                  
                  {/* Enhanced details */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rsvp.dietary_restrictions && (
                      <Badge variant="outline" className="text-xs">
                        <Utensils className="w-2 h-2 mr-1" />
                        {rsvp.dietary_restrictions}
                      </Badge>
                    )}
                    {rsvp.table_assignment && (
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="w-2 h-2 mr-1" />
                        Table {rsvp.table_assignment}
                      </Badge>
                    )}
                    {rsvp.accommodation_needed && (
                      <Badge variant="outline" className="text-xs bg-glass-blue">
                        Accommodation
                      </Badge>
                    )}
                    {rsvp.transportation_needed && (
                      <Badge variant="outline" className="text-xs bg-glass-purple">
                        Transport
                      </Badge>
                    )}
                  </div>
                  
                  {rsvp.message && (
                    <div className="text-xs text-muted-foreground mt-1 italic">
                      <MessageSquare className="w-2 h-2 inline mr-1" />
                      {rsvp.message.substring(0, 50)}...
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-1">
                <Badge variant={getStatusColor(rsvp.status)}>
                  {rsvp.status}
                </Badge>
                
                {rsvp.guest_count > 1 && (
                  <Badge variant="outline" className="text-xs">
                    {rsvp.guest_count} guests
                  </Badge>
                )}
                
                <div className="text-xs text-muted-foreground">
                  {new Date(rsvp.updated_at || rsvp.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {rsvps.length > 10 && (
        <div className="text-center text-xs text-muted-foreground">
          Showing 10 of {rsvps.length} RSVPs
        </div>
      )}
    </div>
  );
};

export default RSVPList;