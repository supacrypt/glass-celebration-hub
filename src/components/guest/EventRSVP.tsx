import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  X,
  HelpCircle,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface WeddingEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  location: string;
  type: 'main' | 'optional' | 'required';
  confirmed_attendees: number;
  maybe_attendees: number;
  total_responses: number;
}

interface EventRSVP {
  id: string;
  event_id: string;
  status: 'attending' | 'declined' | 'pending' | 'maybe';
  guest_count: number;
  dietary_requirements?: string;
  special_requirements?: string;
  notes?: string;
}

const EventRSVP: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [myRSVPs, setMyRSVPs] = useState<Record<string, EventRSVP>>({});
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadEventsAndRSVPs();
    }
  }, [user]);

  const loadEventsAndRSVPs = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load events with attendance data
      const { data: eventsData, error: eventsError } = await (supabase as any)
        .from('event_attendance_summary')
        .select('*')
        .order('event_date, event_time');

      if (eventsError) throw eventsError;

      // Load full event details
      const { data: fullEventsData, error: fullEventsError } = await supabase
        .from('wedding_events')
        .select('*')
        .order('event_date, start_time');

      if (fullEventsError) throw fullEventsError;

      // Merge event data
      const mergedEvents = fullEventsData?.map((event: any) => {
        const attendanceData = eventsData?.find((ae: any) => ae.event_id === event.id);
        return {
          id: event.id,
          date: event.event_date,
          time: event.start_time,
          title: event.title || event.name,
          description: event.description || '',
          location: event.location || '',
          type: event.type,
          confirmed_attendees: attendanceData?.confirmed_attendees || 0,
          maybe_attendees: attendanceData?.maybe_attendees || 0,
          total_responses: attendanceData?.total_responses || 0
        };
      }) || [];

      // Load user's RSVPs
      const { data: rsvpsData, error: rsvpsError } = await (supabase as any)
        .from('rsvps')
        .select('*')
        .eq('user_id', user.id);

      if (rsvpsError) throw rsvpsError;

      // Convert RSVPs to record for easy lookup
      const rsvpsRecord: Record<string, EventRSVP> = {};
      rsvpsData?.forEach((rsvp: any) => {
        rsvpsRecord[rsvp.event_id] = rsvp;
      });

      setEvents(mergedEvents);
      setMyRSVPs(rsvpsRecord);
    } catch (error) {
      console.error('Error loading events and RSVPs:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const updateRSVP = async (eventId: string, status: 'attending' | 'declined' | 'maybe', guestCount: number = 1) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)
        .from('rsvps')
        .upsert({
          user_id: user.id,
          event_id: eventId,
          status,
          guest_count: guestCount
        });

      if (error) throw error;

      toast.success(`RSVP updated for ${events.find(e => e.id === eventId)?.title}`);
      loadEventsAndRSVPs();
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast.error('Failed to update RSVP');
    }
  };

  const updateRSVPDetails = async (eventId: string, details: { dietary_requirements?: string; special_requirements?: string; notes?: string }) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)
        .from('rsvps')
        .update(details)
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (error) throw error;

      toast.success('RSVP details updated');
      loadEventsAndRSVPs();
    } catch (error) {
      console.error('Error updating RSVP details:', error);
      toast.error('Failed to update RSVP details');
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'main': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'required': return <Users className="w-4 h-4 text-red-500" />;
      default: return <Calendar className="w-4 h-4 text-blue-500" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'main': return 'bg-yellow-100 text-yellow-800';
      case 'required': return 'bg-red-100 text-red-800';
      case 'optional': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRSVPStatusColor = (status: string) => {
    switch (status) {
      case 'attending': return 'bg-green-100 text-green-800';
      case 'maybe': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const groupEventsByDate = () => {
    const grouped: Record<string, WeddingEvent[]> = {};
    events.forEach(event => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }
      grouped[event.date].push(event);
    });
    
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.time.localeCompare(b.time));
    });
    
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-wedding-navy border-t-transparent" />
      </div>
    );
  }

  const groupedEvents = groupEventsByDate();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Wedding Weekend Events</h2>
        <p className="text-muted-foreground">
          Please let us know which events you'll be attending so we can plan accordingly
        </p>
      </div>

      {Object.entries(groupedEvents)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, dateEvents]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle className={`text-lg ${
                date === '2025-10-05' ? 'text-wedding-gold' : 'text-muted-foreground'
              }`}>
                {formatDate(date)}
                {date === '2025-10-05' && ' - THE BIG DAY!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dateEvents.map((event) => {
                const myRSVP = myRSVPs[event.id];
                const isExpanded = expandedEvent === event.id;

                return (
                  <div 
                    key={event.id} 
                    className={`border rounded-lg p-4 ${
                      event.type === 'main' ? 'border-wedding-gold bg-wedding-gold/5' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-bold">{formatTime(event.time)}</span>
                          </div>
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <Badge className={getEventTypeColor(event.type)}>
                            <div className="flex items-center gap-1">
                              {getEventTypeIcon(event.type)}
                              {event.type}
                            </div>
                          </Badge>
                          {myRSVP && (
                            <Badge className={getRSVPStatusColor(myRSVP.status)}>
                              {myRSVP.status}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground mb-2">{event.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.confirmed_attendees} attending
                          </div>
                          {event.maybe_attendees > 0 && (
                            <div className="flex items-center gap-1">
                              <HelpCircle className="w-4 h-4" />
                              {event.maybe_attendees} maybe
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RSVP Buttons */}
                    {event.type !== 'main' && ( // Main event RSVP is handled separately
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            variant={myRSVP?.status === 'attending' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateRSVP(event.id, 'attending')}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Attending
                          </Button>
                          <Button
                            variant={myRSVP?.status === 'maybe' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateRSVP(event.id, 'maybe')}
                          >
                            <HelpCircle className="w-4 h-4 mr-1" />
                            Maybe
                          </Button>
                          <Button
                            variant={myRSVP?.status === 'declined' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateRSVP(event.id, 'declined')}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Can't Attend
                          </Button>
                          
                          {myRSVP && myRSVP.status === 'attending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4 mr-1" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4 mr-1" />
                                  Add Details
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Expanded Details Form */}
                        {isExpanded && myRSVP && myRSVP.status === 'attending' && (
                          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                              <Label htmlFor={`dietary-${event.id}`}>Dietary Requirements</Label>
                              <Textarea
                                id={`dietary-${event.id}`}
                                placeholder="Any dietary restrictions or allergies..."
                                value={myRSVP.dietary_requirements || ''}
                                onChange={(e) => updateRSVPDetails(event.id, { 
                                  dietary_requirements: e.target.value 
                                })}
                                rows={2}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`special-${event.id}`}>Special Requirements</Label>
                              <Textarea
                                id={`special-${event.id}`}
                                placeholder="Accessibility needs, transport arrangements, etc..."
                                value={myRSVP.special_requirements || ''}
                                onChange={(e) => updateRSVPDetails(event.id, { 
                                  special_requirements: e.target.value 
                                })}
                                rows={2}
                              />
                            </div>

                            <div>
                              <Label htmlFor={`notes-${event.id}`}>Additional Notes</Label>
                              <Textarea
                                id={`notes-${event.id}`}
                                placeholder="Anything else we should know..."
                                value={myRSVP.notes || ''}
                                onChange={(e) => updateRSVPDetails(event.id, { 
                                  notes: e.target.value 
                                })}
                                rows={2}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Main Event Note */}
                    {event.type === 'main' && (
                      <div className="p-3 bg-wedding-gold/10 rounded-lg border border-wedding-gold/30">
                        <p className="text-sm text-wedding-navy">
                          <Star className="w-4 h-4 inline mr-1" />
                          Main ceremony - RSVP managed through your main wedding invitation
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}

      {events.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No events available</h3>
            <p className="text-muted-foreground">
              Wedding events will appear here when they are published.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventRSVP;