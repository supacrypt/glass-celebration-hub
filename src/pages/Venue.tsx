import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { MapPin, Clock, Car, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Venue: React.FC = () => {
  const navigate = useNavigate();

  const venues = [
    {
      id: 'ben-ean',
      title: 'Ben Ean',
      subtitle: 'Wedding Ceremony & Reception',
      date: 'October 5, 2025',
      time: '2:30 PM arrival for 3:00 PM start',
      description: 'Ceremony on Garden Terrace Lawn, followed by cocktails and reception until midnight',
      color: 'glass-pink',
      path: '/venue/ben-ean'
    },
    {
      id: 'prince-pub',
      title: 'Prince of Mereweather',
      subtitle: 'Pre-Wedding Drinks',
      date: 'October 4, 2025',
      time: '4:00 PM - 8:00 PM',
      description: 'Casual drinks and dinner at the pub. Come and go as you please!',
      color: 'glass-blue',
      path: '/venue/prince-of-mereweather'
    },
    {
      id: 'beach',
      title: 'Newcastle Beach',
      subtitle: 'Recovery Beach Day',
      date: 'October 6, 2025',
      time: 'From 11:00 AM onwards',
      description: 'Casual beach hangout with coffee and food from the kiosk',
      color: 'glass-green',
      path: '/venue/newcastle-beach'
    }
  ];

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up">
        <h1 className="wedding-heading text-wedding-navy mb-3">
          Venues & Locations
        </h1>
        <p className="wedding-body text-muted-foreground">
          All the places where we'll be celebrating
        </p>
      </div>

      {/* Venue Cards */}
      <div className="space-y-6 mb-8">
        {venues.map((venue, index) => (
          <GlassCard 
            key={venue.id}
            className="p-6 animate-fade-up cursor-pointer hover:bg-secondary/20 transition-all" 
            style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
            onClick={() => navigate(venue.path)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-${venue.color}`} />
                  <h2 className="text-xl font-semibold text-wedding-navy">
                    {venue.title}
                  </h2>
                </div>
                <p className="text-glass-blue font-medium mb-2">{venue.subtitle}</p>
                <div className="space-y-1 mb-3">
                  <p className="text-sm font-medium text-wedding-navy">{venue.date}</p>
                  <p className="text-sm text-muted-foreground">{venue.time}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {venue.description}
                </p>
              </div>
              <div className="ml-4">
                <ArrowRight className="w-5 h-5 text-glass-blue" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Venue Details */}
      <GlassCard className="mb-6 p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-glass-pink/20 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-glass-pink" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-wedding-navy mb-2">
              Ben Ean
            </h2>
            <p className="text-muted-foreground mb-3">
              119 McDonalds Rd<br />
              Pokolbin NSW 2320<br />
              <span className="text-sm">Approximately 1 hr drive from Newcastle</span>
            </p>
            <a 
              href="https://www.benean.com.au/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-glass-blue font-medium hover:underline"
            >
              Visit Website →
            </a>
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
          <div className="mb-4 p-3 bg-glass-blue/10 rounded-lg">
            <p className="text-sm font-medium text-wedding-navy">
              Arrive at Ben Ean at 2:30 PM for a 3:00 PM start
            </p>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <div>
              <p className="font-medium text-wedding-navy">Ceremony</p>
              <p className="text-sm text-muted-foreground">Garden Terrace Lawn</p>
            </div>
            <div className="text-right">
              <p className="font-medium">3:00 PM</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <div>
              <p className="font-medium text-wedding-navy">Cocktail Hour</p>
              <p className="text-sm text-muted-foreground">After ceremony</p>
            </div>
            <div className="text-right">
              <p className="font-medium">After Ceremony</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-wedding-navy">Reception</p>
              <p className="text-sm text-muted-foreground">At Ben Ean - conclude at midnight</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Until 12:00 AM</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Transport & Practical Info */}
      <GlassCard className="mb-6 p-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-lg font-semibold mb-4 text-wedding-navy">Transport</h3>
        <div className="space-y-4 text-sm">
          <div className="p-4 bg-glass-green/10 rounded-lg">
            <p className="font-medium text-wedding-navy mb-2">Coach Service Available</p>
            <p className="text-muted-foreground mb-2">
              Two coaches will transport guests to and from the wedding:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>One coach from Newcastle City</li>
              <li>One coach from Hunter Valley accommodation</li>
            </ul>
            <p className="text-sm text-glass-green font-medium mt-2">
              First-come, first-served basis - indicate in RSVP
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Car className="w-5 h-5 text-glass-blue" />
            <div>
              <p className="font-medium text-wedding-navy">Driving?</p>
              <p className="text-muted-foreground">Plenty of on-site parking available</p>
            </div>
          </div>
          
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Uber availability is limited in Hunter Valley. Consider coach service or carpooling.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Dress Code */}
      <GlassCard className="mb-6 p-6 animate-fade-up" style={{ animationDelay: '0.5s' }} variant="secondary">
        <h3 className="text-lg font-semibold mb-4 text-wedding-navy">Dress Code</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-wedding-navy mb-2">For Him:</p>
            <p className="text-muted-foreground">Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief!</p>
          </div>
          <div>
            <p className="font-medium text-wedding-navy mb-2">For Her:</p>
            <p className="text-muted-foreground">Classy dress, pantsuit or jumpsuit.</p>
          </div>
        </div>
        <div className="mt-3 p-2 bg-glass-pink/10 rounded text-center">
          <p className="text-sm font-medium text-wedding-navy">Dapper/Cocktail Attire</p>
        </div>
      </GlassCard>

      {/* Accommodation */}
      <GlassCard 
        className="p-6 animate-fade-up" 
        style={{ animationDelay: '0.6s' }}
        variant="frosted"
      >
        <h3 className="text-lg font-semibold mb-4 text-wedding-navy">
          Accommodation Recommendations
        </h3>
        
        <div className="space-y-6 text-sm">
          <div>
            <h4 className="font-semibold text-wedding-navy mb-3">Newcastle Area</h4>
            <p className="text-muted-foreground mb-3">Cooks Hill and Newcastle (East/West) are the most central suburbs.</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Ibis Newcastle</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Holiday Inn Newcastle</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Kingsley Crystalbrook</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">QT Newcastle</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-wedding-navy mb-3">Hunter Valley</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Elfin Hill Vineyard Accommodation</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Oaks Cypress Lakes Resort</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Chateau Elan</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-glass-blue/10 rounded-lg">
            <p className="text-xs text-muted-foreground">
              For houses or apartments, check Stayz, Airbnb, or Follow
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Venue;