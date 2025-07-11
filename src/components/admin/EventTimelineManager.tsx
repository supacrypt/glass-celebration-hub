import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Star,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface WeddingEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  location: string;
  type: 'main' | 'optional' | 'required';
  attendeeCount?: number;
  confirmed_attendees?: number;
  maybe_attendees?: number;
  declined_attendees?: number;
  pending_attendees?: number;
  total_responses?: number;
}

const EventTimelineManager: React.FC = () => {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventsWithAttendance();
  }, []);

  const loadEventsWithAttendance = async () => {
    setLoading(true);
    try {
      // Load events with live attendance data
      const { data: eventsData, error: eventsError } = await supabase
        .from('event_attendance_summary')
        .select('*')
        .order('event_date, event_time');

      if (eventsError) throw eventsError;

      // Transform data to match interface
      const formattedEvents = eventsData?.map(event => ({
        id: event.event_id,
        date: event.event_date,
        time: event.event_time,
        title: event.event_title,
        description: '', // Will need to get from wedding_events table
        location: '', // Will need to get from wedding_events table
        type: event.event_type,
        attendeeCount: event.confirmed_attendees,
        confirmed_attendees: event.confirmed_attendees,
        maybe_attendees: event.maybe_attendees,
        declined_attendees: event.declined_attendees,
        pending_attendees: event.pending_attendees,
        total_responses: event.total_responses
      })) || [];

      // Also load full event details
      const { data: fullEventsData, error: fullEventsError } = await supabase
        .from('wedding_events')
        .select('*')
        .order('date, time');

      if (fullEventsError) throw fullEventsError;

      // Merge the data
      const mergedEvents = fullEventsData?.map(event => {
        const attendanceData = formattedEvents.find(ae => ae.id === event.id);
        return {
          id: event.id,
          date: event.date,
          time: event.time,
          title: event.title,
          description: event.description || '',
          location: event.location || '',
          type: event.type,
          attendeeCount: attendanceData?.confirmed_attendees || 0,
          confirmed_attendees: attendanceData?.confirmed_attendees || 0,
          maybe_attendees: attendanceData?.maybe_attendees || 0,
          declined_attendees: attendanceData?.declined_attendees || 0,
          pending_attendees: attendanceData?.pending_attendees || 0,
          total_responses: attendanceData?.total_responses || 0
        };
      }) || [];

      setEvents(mergedEvents);
    } catch (error) {
      console.error('Error loading events with attendance:', error);
      // Fallback to static data if database query fails
      setEvents([
        {
          id: '1',
          date: '2025-10-04',
          time: '16:00',
          title: 'Pre-Wedding Drinks',
          description: 'Join Tim and Kirsten for casual drinks and mingling',
          location: 'Prince of Merewether Pub',
          type: 'optional',
          attendeeCount: 0,
          confirmed_attendees: 0,
          maybe_attendees: 0,
          declined_attendees: 0,
          pending_attendees: 0,
          total_responses: 0
        },
        {
          id: '2',
          date: '2025-10-05',
          time: '14:30',
          title: 'Guest Arrival',
          description: 'Please arrive for photos and seating',
          location: 'Ben Ean Pokolbin',
          type: 'required',
          attendeeCount: 0,
          confirmed_attendees: 0,
          maybe_attendees: 0,
          declined_attendees: 0,
          pending_attendees: 0,
          total_responses: 0
        },
        {
          id: '3',
          date: '2025-10-05',
          time: '15:00',
          title: 'Wedding Ceremony',
          description: 'Garden Terrace Lawn ceremony',
          location: 'Ben Ean Pokolbin',
          type: 'main',
          attendeeCount: 0,
          confirmed_attendees: 0,
          maybe_attendees: 0,
          declined_attendees: 0,
          pending_attendees: 0,
          total_responses: 0
        },
        {
          id: '4',
          date: '2025-10-05',
          time: '15:30',
          title: 'Cocktail Hour',
          description: 'Drinks and canapés while photos are taken',
          location: 'Ben Ean Winery',
          type: 'main',
          attendeeCount: 0,
          confirmed_attendees: 0,
          maybe_attendees: 0,
          declined_attendees: 0,
          pending_attendees: 0,
          total_responses: 0
        },
        {
          id: '5',
          date: '2025-10-05',
          time: '17:00',
          title: 'Wedding Reception',
          description: 'Dinner, speeches, and dancing until midnight',
          location: 'Ben Ean Function Room',
          type: 'main',
          attendeeCount: 0,
          confirmed_attendees: 0,
          maybe_attendees: 0,
          declined_attendees: 0,
          pending_attendees: 0,
          total_responses: 0
        },
        {
          id: '6',
          date: '2025-10-06',
          time: '11:00',
          title: 'Beach Recovery Day',
          description: 'Optional hangover recovery at Newcastle Beach',
          location: 'Newcastle Beach',
          type: 'optional',
          attendeeCount: 0,
          confirmed_attendees: 0,
          maybe_attendees: 0,
          declined_attendees: 0,
          pending_attendees: 0,
          total_responses: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'main': return 'bg-wedding-gold text-black';
      case 'required': return 'bg-wedding-navy text-white';
      case 'optional': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'main': return <Star className="w-4 h-4" />;
      case 'required': return <Users className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const groupEventsByDate = () => {
    const grouped: Record<string, WeddingEvent[]> = {};
    events.forEach(event => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }
      grouped[event.date].push(event);
    });
    
    // Sort events within each date by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.time.localeCompare(b.time));
    });
    
    return grouped;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toUpperCase();
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const groupedEvents = groupEventsByDate();
  const totalEvents = events.length;
  const mainEvents = events.filter(e => e.type === 'main').length;
  const optionalEvents = events.filter(e => e.type === 'optional').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-wedding-navy border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Events & Timeline Management</h2>
          <p className="text-muted-foreground">
            Manage your wedding weekend schedule and events
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-wedding-purple">{totalEvents}</div>
            <div className="text-sm text-muted-foreground">Total Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-wedding-gold">{mainEvents}</div>
            <div className="text-sm text-muted-foreground">Main Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-500">{optionalEvents}</div>
            <div className="text-sm text-muted-foreground">Optional Events</div>
          </CardContent>
        </Card>
      </div>

      {/* Event Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Wedding Weekend Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {Object.entries(groupedEvents)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, dateEvents]) => (
              <div key={date} className="space-y-4">
                <h3 className={`text-lg font-semibold ${
                  date === '2025-10-05' ? 'text-wedding-gold' : 'text-muted-foreground'
                }`}>
                  {formatDate(date)}
                  {date === '2025-10-05' && ' - THE BIG DAY!'}
                </h3>
                
                <div className="space-y-3">
                  {dateEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={`p-4 rounded-lg border-2 ${
                        event.type === 'main' ? 'border-wedding-gold bg-wedding-gold/5' : 'border-gray-200 bg-gray-50/50'
                      } transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2 text-lg font-bold">
                              <Clock className="w-4 h-4" />
                              {formatTime(event.time)}
                            </div>
                            <h4 className="text-lg font-semibold">{event.title}</h4>
                            <Badge 
                              className={`${getEventTypeColor(event.type)} border-0`}
                            >
                              <div className="flex items-center gap-1">
                                {getEventTypeIcon(event.type)}
                                {event.type}
                              </div>
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-2">{event.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {event.confirmed_attendees || 0} attending
                              </div>
                              {event.maybe_attendees > 0 && (
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <Users className="w-4 h-4" />
                                  {event.maybe_attendees} maybe
                                </div>
                              )}
                              {event.total_responses > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {event.total_responses} total responses
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {event.type === 'optional' && (
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventTimelineManager;