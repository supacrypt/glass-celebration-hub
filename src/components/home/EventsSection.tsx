
import React from 'react';
import { Settings } from 'lucide-react';

interface EventsSectionProps {
  isAdmin: boolean;
  events: any[];
  eventsLoading: boolean;
}

const EventsSection: React.FC<EventsSectionProps> = ({ isAdmin, events, eventsLoading }) => {
  return (
    <div className="glass-card responsive-card-padding mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="flex items-center gap-2 sm:gap-3 responsive-heading-lg font-semibold text-wedding-navy">
          <span className="text-xl sm:text-2xl">🎉</span>
          The Big Day
        </h2>
        {isAdmin && (
          <button className="glass-secondary w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 text-muted-foreground">
            <Settings size={16} />
          </button>
        )}
      </div>

      {eventsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-navy" />
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {/* Main Wedding Event Only */}
          {events && events.length > 0 ? (
            events
              .filter(event => event.is_main_event) // Only show main wedding event
              .map((event) => (
                <div key={event.id} className="glass-secondary responsive-card-padding rounded-xl transition-all duration-300 hover:scale-105">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="responsive-text-lg font-semibold text-wedding-navy flex items-center gap-2">
                      <span className="text-glass-pink text-lg">💕</span>
                      {event.title}
                    </h3>
                    {isAdmin && (
                      <div className="text-xs text-muted-foreground">
                        Event ID: {event.id.slice(0, 8)}...
                      </div>
                    )}
                  </div>
                  <div className="responsive-text-base text-glass-blue font-medium mb-3">
                    {new Date(event.event_date).toLocaleDateString('en-AU', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {new Date(event.event_date).toLocaleTimeString('en-AU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {event.description && (
                    <p className="responsive-text-base text-muted-foreground leading-relaxed mb-4">
                      {event.description}
                    </p>
                  )}
                  {(event.venue_name || event.location || event.address) && (
                    <div className="flex items-center gap-2 responsive-text-base text-muted-foreground mb-4">
                      <div className="glass-primary w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-sm">
                        📍
                      </div>
                      <span>{event.venue_name || event.location}{event.address && `, ${event.address}`}</span>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3 mb-4">
                    <button className="glass-primary px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-wedding-navy hover:scale-105 transition-transform">
                      📍 View Map
                    </button>
                    <button className="glass-primary px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-wedding-navy hover:scale-105 transition-transform">
                      🧭 Directions
                    </button>
                  </div>
                  
                  {event.dress_code && (
                    <div className="glass-primary responsive-card-padding-sm rounded-lg text-center">
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Dress Code: {event.dress_code}
                      </span>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Main wedding event not configured yet.</p>
              {isAdmin && (
                <p className="text-xs mt-2">Add the main wedding event through the admin panel.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsSection;
