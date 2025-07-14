import React from 'react';
import { Settings, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define a specific type for a wedding event for type safety
interface WeddingEvent {
  id: string;
  title: string;
  start_time?: string | null;
  end_time?: string | null;
  venue_name?: string;
  location?: string;
  description?: string;
  event_date?: string;
}

interface EventsSectionProps {
  isAdmin: boolean;
  events: WeddingEvent[];
  eventsLoading: boolean;
}

const EventsSection: React.FC<EventsSectionProps> = ({ isAdmin, events, eventsLoading }) => {
  const navigate = useNavigate();
  
  // Sort events by event_date to ensure chronological order
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.event_date ? new Date(a.event_date).getTime() : 0;
    const dateB = b.event_date ? new Date(b.event_date).getTime() : 0;
    return dateA - dateB;
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatEventDateTime = (event: WeddingEvent) => {
    if (!event.event_date) return 'Time TBA';
    
    const eventDate = new Date(event.event_date);
    const dateStr = eventDate.toLocaleDateString('en-AU', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    if (event.start_time) {
      const timeStr = formatTime(event.start_time);
      const endTimeStr = event.end_time ? ` - ${formatTime(event.end_time)}` : '';
      return `${dateStr}, ${timeStr}${endTimeStr}`;
    }
    
    return dateStr;
  };

  const getVenueRoute = (venueName: string | undefined, location: string | undefined): string | null => {
    const venue = venueName || location || '';
    const lowerVenue = venue.toLowerCase();
    
    if (lowerVenue.includes('ben ean')) {
      return '/venue/ben-ean';
    } else if (lowerVenue.includes('prince of mereweather') || lowerVenue.includes('mereweather')) {
      return '/venue/prince-of-mereweather';
    } else if (lowerVenue.includes('newcastle beach')) {
      return '/venue/newcastle-beach';
    }
    
    return null;
  };

  const handleVenueClick = (venueName: string | undefined, location: string | undefined) => {
    const route = getVenueRoute(venueName, location);
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="glass-card responsive-card-padding mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="flex items-center gap-2 sm:gap-3 responsive-heading-lg font-semibold text-wedding-navy">
          <span className="text-xl sm:text-2xl">🎉</span>
          Schedule of Events
        </h2>
        {isAdmin && (
          <button className="glass-secondary w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 text-muted-foreground">
            <Settings size={16} />
          </button>
        )}
      </div>

      {eventsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy" />
        </div>
      ) : sortedEvents.length > 0 ? (
        <div className="relative pl-8 sm:pl-12">
          {/* The vertical timeline bar */}
          <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-0.5 bg-glass-border rounded-full"></div>

          <div className="space-y-10">
            {sortedEvents.map((event, index) => (
              <div key={event.id} className="relative">
                <div className="absolute -left-[2.1rem] sm:-left-[2.7rem] top-1.5 w-6 h-6 sm:w-8 sm:h-8 bg-glass-blue rounded-full flex items-center justify-center ring-4 ring-glass-bg shadow-md">
                  <span className="text-sm sm:text-base">{['🎉', '🥂', '🍽️', '💃', '🕺'][index % 5]}</span>
                </div>
                <div className="ml-4">
                  <h3 className="responsive-text-lg font-bold text-wedding-navy">{event.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-muted-foreground mt-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-glass-blue" />
                      <span>{formatEventDateTime(event)}</span>
                    </div>
                    {(event.venue_name || event.location) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-glass-purple" />
                        {getVenueRoute(event.venue_name, event.location) ? (
                          <button
                            onClick={() => handleVenueClick(event.venue_name, event.location)}
                            className="text-wedding-navy hover:text-wedding-gold transition-colors underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-wedding-gold focus:ring-opacity-50 rounded"
                          >
                            {event.venue_name || event.location}
                            <ExternalLink className="w-3 h-3 ml-1 inline" />
                          </button>
                        ) : (
                          <span>{event.venue_name || event.location}</span>
                        )}
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <p className="mt-2 responsive-text-base text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>The event schedule will be posted soon. Stay tuned!</p>
          {isAdmin && (
            <p className="text-xs mt-2">Add events through the admin panel.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsSection;
