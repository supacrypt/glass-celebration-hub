import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { Calendar, MapPin, Users, Clock, Heart, Crown, Settings } from 'lucide-react';
import { useWeddingEvents } from '@/hooks/useWeddingData';
import { useAuth } from '@/hooks/useAuth';
import weddingHero from '@/assets/wedding-hero.jpg';

const Home: React.FC = () => {
  const { events, loading: eventsLoading } = useWeddingEvents();
  const { userRole, profile } = useAuth();
  const [timeToWedding, setTimeToWedding] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Tim & Kirsten's Wedding Date - October 5th, 2025
  const weddingDate = new Date('2025-10-05T15:00:00');
  const isAdmin = userRole?.role === 'admin' || userRole?.role === 'couple';
  const mainEvent = events.find(event => event.is_main_event);
  
  // Get user's display name
  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) return profile.first_name;
    return 'Wedding Guest';
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance > 0) {
        setTimeToWedding({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-screen flex items-center justify-center px-4 sm:px-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${weddingHero})` }}
      >
        {/* Glass Overlay */}
        <div className="absolute inset-0 glass-frosted" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center animate-fade-up max-w-4xl mx-auto">
          {/* Welcome Message */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              {isAdmin ? (
                <Crown className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
              ) : (
                <Heart className="w-6 h-6 text-pink-400 drop-shadow-lg" />
              )}
              <span className="text-white/90 text-lg font-medium drop-shadow-md">
                Welcome, {getDisplayName()}!
              </span>
            </div>
            {isAdmin && (
              <p className="text-white/70 text-sm drop-shadow-md">
                Admin Dashboard Access Available
              </p>
            )}
          </div>

          <h1 className="wedding-display text-white mb-4 animate-glass-float drop-shadow-lg">
            Tim & Kirsten
          </h1>
          <p className="wedding-subheading text-white/90 mb-6 drop-shadow-md">
            October 5, 2025
          </p>
          <p className="wedding-body text-white/80 max-w-md mx-auto drop-shadow-md">
            Yes, we are that couple stuffing up your long weekend plans!
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 sm:px-5 py-8 sm:py-12 max-w-6xl mx-auto">
        {/* Enhanced Countdown Timer */}
        <GlassCard className="mb-8 p-6 sm:p-8 animate-fade-up glass-animated" style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-6 h-6 text-hsl(var(--glass-pink-tint))" />
              <h2 className="text-xl sm:text-2xl font-semibold text-wedding-navy">
                Countdown to Forever
              </h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Every second brings us closer to celebrating with you!
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div className="glass-secondary rounded-xl p-4 hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-4xl font-light text-wedding-navy mb-1 tabular-nums">
                {timeToWedding.days}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">
                Days
              </div>
            </div>
            <div className="glass-secondary rounded-xl p-4 hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-4xl font-light text-wedding-navy mb-1 tabular-nums">
                {timeToWedding.hours}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">
                Hours
              </div>
            </div>
            <div className="glass-secondary rounded-xl p-4 hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-4xl font-light text-wedding-navy mb-1 tabular-nums">
                {timeToWedding.minutes}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">
                Minutes
              </div>
            </div>
            <div className="glass-secondary rounded-xl p-4 hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-4xl font-light text-wedding-navy mb-1 tabular-nums">
                {timeToWedding.seconds}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">
                Seconds
              </div>
            </div>
          </div>

          {/* Real-time pulse effect for the seconds */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-hsl(var(--glass-pink-tint) / 0.1) rounded-full">
              <div className="w-2 h-2 bg-hsl(var(--glass-pink-tint)) rounded-full animate-pulse"></div>
              <span className="text-xs text-hsl(var(--glass-pink-tint)) font-medium">Live</span>
            </div>
          </div>
        </GlassCard>

        {/* Wedding Events Information */}
        {!eventsLoading && events.length > 0 && (
          <GlassCard className="mb-8 p-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-hsl(var(--glass-blue-tint))" />
              <h2 className="text-xl font-semibold text-wedding-navy">Wedding Events</h2>
              {isAdmin && (
                <div className="ml-auto">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {events.map((event, index) => (
                <div 
                  key={event.id}
                  className="glass-secondary rounded-xl p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {event.is_main_event && (
                          <Heart className="w-4 h-4 text-hsl(var(--glass-pink-tint))" />
                        )}
                        <h3 className="font-semibold text-wedding-navy">{event.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(event.event_date).toLocaleDateString('en-AU', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      )}
                      {event.venue_name && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-hsl(var(--glass-green-tint))" />
                          <span className="text-hsl(var(--glass-green-tint)) font-medium">
                            {event.venue_name}
                          </span>
                        </div>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="text-xs text-muted-foreground ml-4">
                        Event ID: {event.id.slice(0, 8)}...
                      </div>
                    )}
                  </div>
                  
                  {event.dress_code && (
                    <div className="mt-3 px-3 py-2 bg-hsl(var(--glass-purple-tint) / 0.1) rounded-lg">
                      <span className="text-xs font-medium text-hsl(var(--glass-purple-tint))">
                        Dress Code: {event.dress_code}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <GlassCard 
            className="p-6 text-center animate-fade-up hover:scale-105 transition-transform" 
            style={{ animationDelay: '0.4s' }}
            variant="secondary"
          >
            <Calendar className="w-8 h-8 mx-auto mb-3 text-hsl(var(--glass-blue-tint))" />
            <h3 className="font-semibold mb-2 text-wedding-navy">When</h3>
            <p className="text-sm text-muted-foreground">
              October 5, 2025<br />
              Arrive 2:30 PM
            </p>
          </GlassCard>
          
          <GlassCard 
            className="p-6 text-center animate-fade-up hover:scale-105 transition-transform" 
            style={{ animationDelay: '0.5s' }}
            variant="secondary"
          >
            <MapPin className="w-8 h-8 mx-auto mb-3 text-hsl(var(--glass-pink-tint))" />
            <h3 className="font-semibold mb-2 text-wedding-navy">Where</h3>
            <p className="text-sm text-muted-foreground">
              Ben Ean<br />
              Pokolbin, NSW
            </p>
          </GlassCard>

          <GlassCard 
            className="p-6 text-center animate-fade-up hover:scale-105 transition-transform sm:col-span-2 lg:col-span-1" 
            style={{ animationDelay: '0.6s' }}
            variant="secondary"
          >
            <Users className="w-8 h-8 mx-auto mb-3 text-hsl(var(--glass-green-tint))" />
            <h3 className="font-semibold mb-2 text-wedding-navy">Who</h3>
            <p className="text-sm text-muted-foreground">
              Family & Friends<br />
              {isAdmin ? 'You have admin access' : 'You\'re invited!'}
            </p>
          </GlassCard>
        </div>

        {/* Welcome Message */}
        <GlassCard 
          className="p-6 sm:p-8 animate-fade-up glass-shimmer" 
          style={{ animationDelay: '0.7s' }}
          variant="frosted"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Heart className="w-8 h-8 text-hsl(var(--glass-pink-tint))" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-wedding-navy">
                Welcome to Our Wedding
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Why spend your long weekend somewhere relaxing when you can watch two people who have been together for well over a decade tell you that they still love each other? There'll be top-shelf bevies, good tunes, and more love than you can poke a stick at!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-hsl(var(--glass-green-tint) / 0.1) rounded-lg">
                  <Clock className="w-5 h-5 text-hsl(var(--glass-green-tint))" />
                  <span className="text-sm font-medium text-hsl(var(--glass-green-tint))">
                    Don't forget to RSVP!
                  </span>
                </div>
                
                {isAdmin && (
                  <div className="flex items-center gap-2 p-3 bg-hsl(var(--glass-blue-tint) / 0.1) rounded-lg">
                    <Settings className="w-5 h-5 text-hsl(var(--glass-blue-tint))" />
                    <span className="text-sm font-medium text-hsl(var(--glass-blue-tint))">
                      Admin tools available
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Home;