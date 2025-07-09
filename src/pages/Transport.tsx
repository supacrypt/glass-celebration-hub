import React from 'react';
import GlassCard from '@/components/GlassCard';
import { Bus, Car, AlertTriangle, Users, MapPin, Clock } from 'lucide-react';

const Transport: React.FC = () => {
  return (
    <div className="min-h-screen px-3 sm:px-5 pt-8 sm:pt-12 pb-20">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 animate-fade-up">
        <h1 className="text-2xl sm:text-3xl lg:wedding-heading font-semibold text-wedding-navy mb-2 sm:mb-3">
          Transportation
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Getting to and from Ben Ean for our wedding celebration
        </p>
      </div>

      {/* Coach Transport - Primary Option */}
      <div className="mb-8 animate-fade-up">
        <GlassCard className="p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Bus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-wedding-navy">Free Coach Service</h2>
              <p className="text-sm text-muted-foreground">Recommended transport option</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">Newcastle City Pickup</span>
              </div>
              <p className="text-sm text-muted-foreground">
                For guests staying in Newcastle city center and surrounding areas.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm">Hunter Valley Pickup</span>
              </div>
              <p className="text-sm text-muted-foreground">
                For guests staying in Hunter Valley accommodation.
              </p>
            </div>
          </div>

          <GlassCard className="p-4 bg-blue-50 border border-blue-200" variant="secondary">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">First Come, First Served</p>
                <p className="text-xs text-blue-700">
                  Coach seats are limited and allocated on a first-come, first-served basis. 
                  Please indicate in your RSVP how many seats you need and your pickup location.
                </p>
              </div>
            </div>
          </GlassCard>
        </GlassCard>
      </div>

      {/* Driving Option */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Car className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-wedding-navy">Driving to the Venue</h2>
              <p className="text-sm text-muted-foreground">Approximately 1 hour from Newcastle</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-wedding-navy mb-2">Parking Available</h3>
              <p className="text-sm text-muted-foreground">
                There is plenty of on-site parking available at Ben Ean for guests who choose to drive.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-wedding-navy mb-2">Carpooling</h3>
              <p className="text-sm text-muted-foreground">
                Let us know in your RSVP if you're planning to drive and would like to carpool or are looking for a seat. 
                We'll connect guests whose travel plans align.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Uber Warning */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <GlassCard className="p-4 sm:p-6 border-l-4 border-amber-400">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-wedding-navy mb-2 text-sm sm:text-base">
                Important: Uber Not Recommended
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                We do not recommend using Uber as there is limited availability, particularly in the Hunter Valley area. 
                Please plan to use the coach service or arrange alternative transport.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Venue Address */}
      <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <GlassCard className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-wedding-navy/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-wedding-navy" />
          </div>
          <h3 className="font-semibold text-wedding-navy mb-2">Venue Address</h3>
          <p className="text-muted-foreground">
            Ben Ean<br />
            119 McDonalds Rd, Pokolbin NSW 2320
          </p>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=119+McDonalds+Rd+Pokolbin+NSW+2320"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Open in Google Maps →
          </a>
        </GlassCard>
      </div>
    </div>
  );
};

export default Transport;