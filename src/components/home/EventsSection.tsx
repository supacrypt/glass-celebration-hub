import React from 'react';
import { Settings, MapPin, Clock } from 'lucide-react';

// Define a specific type for a wedding event for type safety
interface WeddingEvent {
  id: string;
  title: string;
  start_time: string;
  end_time?: string;
  venue_name?: string;
  location?: string;
  description?: string;
}

interface EventsSectionProps {
  isAdmin: boolean;
  events: WeddingEvent[];
  eventsLoading: boolean;
}

const EventsSection: React.FC<EventsSectionProps> = ({ isAdmin, events, eventsLoading }) => {
  // Sort events by start time to ensure chronological order
  const sortedEvents = [...events].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
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
                      <span>
                        {formatTime(event.start_time)}
                        {event.end_time && ` - ${formatTime(event.end_time)}`}
                      </span>
                    </div>
                    {(event.venue_name || event.location) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-glass-purple" />
                        <span>{event.venue_name || event.location}</span>
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
