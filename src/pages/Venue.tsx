import React from 'react';
import GlassCard from '@/components/GlassCard';
import { MapPin, Clock, Car, Phone } from 'lucide-react';

const Venue: React.FC = () => {
  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up">
        <h1 className="wedding-heading text-wedding-navy mb-3">
          Venue & Location
        </h1>
        <p className="wedding-body text-muted-foreground">
          Everything you need to know about our wedding location
        </p>
      </div>

      {/* Venue Details */}
      <GlassCard className="mb-6 p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-glass-pink/20 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-glass-pink" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-wedding-navy mb-2">
              Sunset Garden Venue
            </h2>
            <p className="text-muted-foreground mb-3">
              123 Garden Lane<br />
              Romantic Valley, CA 90210
            </p>
            <button className="text-glass-blue font-medium hover:underline">
              Get Directions →
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Schedule */}
      <GlassCard className="mb-6 p-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-glass-blue" />
          <h2 className="text-xl font-semibold text-wedding-navy">Schedule</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <div>
              <p className="font-medium text-wedding-navy">Ceremony</p>
              <p className="text-sm text-muted-foreground">Exchange of vows</p>
            </div>
            <div className="text-right">
              <p className="font-medium">4:00 PM</p>
              <p className="text-sm text-muted-foreground">30 min</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <div>
              <p className="font-medium text-wedding-navy">Cocktail Hour</p>
              <p className="text-sm text-muted-foreground">Drinks & appetizers</p>
            </div>
            <div className="text-right">
              <p className="font-medium">4:30 PM</p>
              <p className="text-sm text-muted-foreground">90 min</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <div>
              <p className="font-medium text-wedding-navy">Reception</p>
              <p className="text-sm text-muted-foreground">Dinner & dancing</p>
            </div>
            <div className="text-right">
              <p className="font-medium">6:00 PM</p>
              <p className="text-sm text-muted-foreground">4 hours</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-wedding-navy">After Party</p>
              <p className="text-sm text-muted-foreground">Late night celebration</p>
            </div>
            <div className="text-right">
              <p className="font-medium">10:00 PM</p>
              <p className="text-sm text-muted-foreground">2 hours</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Practical Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <GlassCard 
          className="p-5 text-center animate-fade-up" 
          style={{ animationDelay: '0.4s' }}
          variant="secondary"
        >
          <Car className="w-8 h-8 mx-auto mb-3 text-glass-green" />
          <h3 className="font-semibold mb-2 text-wedding-navy">Parking</h3>
          <p className="text-sm text-muted-foreground">
            Free valet<br />
            parking available
          </p>
        </GlassCard>
        
        <GlassCard 
          className="p-5 text-center animate-fade-up" 
          style={{ animationDelay: '0.5s' }}
          variant="secondary"
        >
          <Phone className="w-8 h-8 mx-auto mb-3 text-glass-purple" />
          <h3 className="font-semibold mb-2 text-wedding-navy">Contact</h3>
          <p className="text-sm text-muted-foreground">
            (555) 123-4567<br />
            Venue coordinator
          </p>
        </GlassCard>
      </div>

      {/* Accommodation */}
      <GlassCard 
        className="p-6 animate-fade-up" 
        style={{ animationDelay: '0.6s' }}
        variant="frosted"
      >
        <h3 className="text-lg font-semibold mb-4 text-wedding-navy">
          Recommended Hotels
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">The Grand Hotel</p>
              <p className="text-muted-foreground">2 miles from venue</p>
            </div>
            <span className="text-glass-blue font-medium">Book Now</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Garden Inn & Suites</p>
              <p className="text-muted-foreground">1.5 miles from venue</p>
            </div>
            <span className="text-glass-blue font-medium">Book Now</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Venue;