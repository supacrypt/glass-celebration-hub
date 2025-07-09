
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
          <span className="text-xl sm:text-2xl">📅</span>
          Wedding Events
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
          {/* Pre-Wedding Drinks */}
          <div className="glass-secondary responsive-card-padding rounded-xl transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-start mb-3">
              <h3 className="responsive-text-lg font-semibold text-wedding-navy">
                Pre-Wedding Drinks
              </h3>
              {isAdmin && (
                <div className="text-xs text-muted-foreground">
                  Event ID: 449f062c...
                </div>
              )}
            </div>
            <div className="responsive-text-base text-glass-blue font-medium mb-2">
              Saturday 4 October 2025 at 04:00 pm
            </div>
            <p className="responsive-text-base text-muted-foreground leading-relaxed mb-3">
              Tim and Kirsten will be at the Prince of Mereweather pub. Stop in to have a drink and grab yourself a meal if you are hungry.
            </p>
            <div className="flex items-center gap-2 responsive-text-base text-muted-foreground mb-3">
              <div className="glass-primary w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-sm">
                📍
              </div>
              <span>Prince of Mereweather Pub</span>
            </div>
            <div className="glass-primary responsive-card-padding-sm rounded-lg text-center">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Dress Code: Casual
              </span>
            </div>
          </div>

          {/* Dynamic Events from Database */}
          {events && events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="glass-secondary responsive-card-padding rounded-xl transition-all duration-300 hover:scale-105">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="responsive-text-lg font-semibold text-wedding-navy flex items-center gap-2">
                    {event.is_main_event && <span className="text-glass-pink text-sm">❤️</span>}
                    {event.title}
                  </h3>
                  {isAdmin && (
                    <div className="text-xs text-muted-foreground">
                      Event ID: {event.id.slice(0, 8)}...
                    </div>
                  )}
                </div>
                <div className="responsive-text-base text-glass-blue font-medium mb-2">
                  {new Date(event.event_date).toLocaleDateString('en-AU', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                {event.description && (
                  <p className="responsive-text-base text-muted-foreground leading-relaxed mb-3">
                    {event.description}
                  </p>
                )}
                {(event.venue_name || event.location || event.address) && (
                  <div className="flex items-center gap-2 responsive-text-base text-muted-foreground mb-3">
                    <div className="glass-primary w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-sm">
                      📍
                    </div>
                    <span>{event.venue_name || event.location}{event.address && `, ${event.address}`}</span>
                  </div>
                )}
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
              <p>No events configured yet.</p>
              {isAdmin && (
                <p className="text-xs mt-2">Add events through the admin panel.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsSection;
