import React from 'react';
import GlassCard from '@/components/GlassCard';
import VenueMap from '@/components/VenueMap';
import { MapPin, Clock, Car, Phone, Globe, Users, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BenEan: React.FC = () => {
  const venueData = {
    name: 'Ben Ean',
    address: '119 McDonalds Rd, Pokolbin NSW 2320',
    coordinates: [151.3167, -32.7833] as [number, number], // Ben Ean coordinates
    description: 'Ceremony on Garden Terrace Lawn, Reception indoors'
  };

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up">
        <h1 className="wedding-heading text-wedding-navy mb-3">
          Ben Ean Venue
        </h1>
        <p className="wedding-body text-muted-foreground">
          Tim & Kirsten's Wedding Ceremony & Reception
        </p>
      </div>

      {/* Hero Image Placeholder */}
      <GlassCard className="mb-8 p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="w-full h-48 bg-gradient-to-br from-glass-green/20 to-glass-blue/20 rounded-glass flex items-center justify-center mb-4">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-glass-green" />
            <p className="text-wedding-navy font-medium">Venue Photo Coming Soon</p>
          </div>
        </div>
      </GlassCard>

      {/* Venue Details */}
      <GlassCard className="mb-6 p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-glass-pink/20 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-glass-pink" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-wedding-navy mb-2">
              Ben Ean Winery & Restaurant
            </h2>
            <p className="text-muted-foreground mb-3">
              119 McDonalds Rd<br />
              Pokolbin NSW 2320<br />
              <span className="text-sm">Hunter Valley Wine Country</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('https://www.benean.com.au/', '_blank')}
              >
                <Globe className="w-4 h-4 mr-1" />
                Website
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('tel:+61249983088', '_blank')}
              >
                <Phone className="w-4 h-4 mr-1" />
                Call Venue
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Map */}
      <VenueMap 
        venue={venueData} 
        className="mb-8 animate-fade-up" 
      />

      {/* Wedding Events at Ben Ean */}
      <GlassCard className="mb-6 p-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-glass-blue" />
          <h2 className="text-xl font-semibold text-wedding-navy">Wedding Schedule</h2>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-glass-blue/10 rounded-lg">
            <p className="font-medium text-wedding-navy mb-1">Arrival Time</p>
            <p className="text-muted-foreground">Please arrive at 2:30 PM for a 3:00 PM start</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <div>
                <p className="font-medium text-wedding-navy">Wedding Ceremony</p>
                <p className="text-sm text-muted-foreground">Garden Terrace Lawn (Outdoor)</p>
              </div>
              <div className="text-right">
                <p className="font-medium">3:00 PM</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <div>
                <p className="font-medium text-wedding-navy">Cocktail Hour</p>
                <p className="text-sm text-muted-foreground">Outdoor terrace area</p>
              </div>
              <div className="text-right">
                <p className="font-medium">After Ceremony</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-wedding-navy">Reception</p>
                <p className="text-sm text-muted-foreground">Indoor venue - until midnight</p>
              </div>
              <div className="text-right">
                <p className="font-medium">5:00 PM - 12:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Venue Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <GlassCard className="p-5 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3 mb-3">
            <Car className="w-5 h-5 text-glass-green" />
            <h3 className="font-semibold text-wedding-navy">Parking</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Plenty of on-site parking available for all guests
          </p>
        </GlassCard>

        <GlassCard className="p-5 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-glass-blue" />
            <h3 className="font-semibold text-wedding-navy">Capacity</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Indoor and outdoor spaces for ceremony and reception
          </p>
        </GlassCard>
      </div>

      {/* Travel Information */}
      <GlassCard className="p-6 animate-fade-up" style={{ animationDelay: '0.7s' }} variant="secondary">
        <h3 className="text-lg font-semibold mb-4 text-wedding-navy">Getting There</h3>
        <div className="space-y-4 text-sm">
          <div className="p-4 bg-glass-green/10 rounded-lg">
            <p className="font-medium text-wedding-navy mb-2">Coach Service Available</p>
            <p className="text-muted-foreground mb-2">
              Free transportation provided:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Newcastle City pickup</li>
              <li>Hunter Valley accommodation pickup</li>
            </ul>
            <p className="text-sm text-glass-green font-medium mt-2">
              Book your seat via RSVP - first-come, first-served
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Car className="w-5 h-5 text-glass-blue mt-1" />
            <div>
              <p className="font-medium text-wedding-navy">Driving Directions</p>
              <p className="text-muted-foreground">
                Approximately 1 hour drive from Newcastle via M1 Pacific Motorway and Wine Country Drive
              </p>
            </div>
          </div>
          
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Uber availability is very limited in Hunter Valley. We strongly recommend using the coach service or carpooling.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default BenEan;