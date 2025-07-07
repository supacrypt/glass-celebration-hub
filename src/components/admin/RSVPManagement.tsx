import React from 'react';
import GlassCard from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

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

interface RSVPManagementProps {
  rsvps: RSVP[];
}

const RSVPManagement: React.FC<RSVPManagementProps> = ({ rsvps }) => {
  return (
    <GlassCard className="p-4">
      <h3 className="font-semibold mb-4 text-wedding-navy">RSVP Management</h3>
      <div className="space-y-3">
        {rsvps.map((rsvp) => (
          <div key={rsvp.id} className="flex items-center justify-between p-3 rounded-glass bg-secondary/30">
            <div className="flex-1">
              <div className="font-medium text-wedding-navy">
                {rsvp.profiles?.first_name} {rsvp.profiles?.last_name}
              </div>
              <div className="text-sm text-muted-foreground">{rsvp.profiles?.email}</div>
              <div className="text-xs text-muted-foreground">
                {rsvp.guest_count} guest{rsvp.guest_count !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={rsvp.status === 'attending' ? 'default' : 'secondary'}>
                {rsvp.status}
              </Badge>
              <div className="text-xs text-muted-foreground">
                {new Date(rsvp.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      {rsvps.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No RSVPs received yet</p>
        </div>
      )}
    </GlassCard>
  );
};

export default RSVPManagement;