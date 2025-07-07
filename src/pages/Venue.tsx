import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { MapPin, Clock, Car, Phone, ArrowRight, Calendar, Heart } from 'lucide-react';
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
    <div className="min-h-screen px-4 sm:px-5 pt-8 sm:pt-12 pb-20 sm:pb-24">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up max-w-4xl mx-auto">
        <h1 className="wedding-heading text-wedding-navy mb-3">
          Venues & Locations
        </h1>
        <p className="wedding-body text-muted-foreground">
          All the places where we'll be celebrating
        </p>
      </div>

      {/* Venue Cards */}
      <div className="space-y-6 mb-8 max-w-4xl mx-auto">
        {venues.map((venue, index) => (
          <GlassCard 
            key={venue.id}
            className="p-6 animate-fade-up cursor-pointer hover:scale-[1.02] transition-all duration-300 glass-animated" 
            style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
            onClick={() => navigate(venue.path)}
            variant="secondary"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-4 h-4 rounded-full bg-hsl(var(--glass-${venue.color.split('-')[1]}-tint))`} />
                  <h2 className="text-xl font-semibold text-wedding-navy">
                    {venue.title}
                  </h2>
                </div>
                <p className="text-hsl(var(--glass-blue-tint)) font-medium mb-3">{venue.subtitle}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-wedding-navy">{venue.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{venue.time}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {venue.description}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <div className="w-10 h-10 rounded-full glass-secondary flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-hsl(var(--glass-blue-tint))" />
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Venue Details */}
      <div className="max-w-4xl mx-auto space-y-6">
        <GlassCard className="mb-6 p-6 sm:p-8 animate-fade-up glass-shimmer" style={{ animationDelay: '0.2s' }} variant="frosted">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-hsl(var(--glass-pink-tint) / 0.2) flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-hsl(var(--glass-pink-tint))" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-wedding-navy mb-3">
                Ben Ean
              </h2>
              <div className="space-y-2 mb-4">
                <p className="text-muted-foreground">
                  119 McDonalds Rd<br />
                  Pokolbin NSW 2320
                </p>
                <p className="text-sm text-muted-foreground">
                  Approximately 1 hr drive from Newcastle
                </p>
              </div>
              <a 
                href="https://www.benean.com.au/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-hsl(var(--glass-blue-tint)) font-medium hover:underline transition-colors"
              >
                Visit Website 
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </GlassCard>

        {/* Schedule */}
        <GlassCard className="mb-6 p-6 animate-fade-up" style={{ animationDelay: '0.3s' }} variant="secondary">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-hsl(var(--glass-blue-tint))" />
            <h2 className="text-xl font-semibold text-wedding-navy">Schedule</h2>
          </div>
          
          <div className="space-y-4">
            <div className="mb-4 p-4 bg-hsl(var(--glass-blue-tint) / 0.1) rounded-xl">
              <p className="text-sm font-medium text-wedding-navy">
                Arrive at Ben Ean at 2:30 PM for a 3:00 PM start
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-4 px-4 glass-secondary rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-hsl(var(--glass-pink-tint))"></div>
                  <div>
                    <p className="font-medium text-wedding-navy">Ceremony</p>
                    <p className="text-sm text-muted-foreground">Garden Terrace Lawn</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-wedding-navy">3:00 PM</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-4 px-4 glass-secondary rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-hsl(var(--glass-blue-tint))"></div>
                  <div>
                    <p className="font-medium text-wedding-navy">Cocktail Hour</p>
                    <p className="text-sm text-muted-foreground">After ceremony</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-wedding-navy">After Ceremony</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-4 px-4 glass-secondary rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-hsl(var(--glass-green-tint))"></div>
                  <div>
                    <p className="font-medium text-wedding-navy">Reception</p>
                    <p className="text-sm text-muted-foreground">At Ben Ean - conclude at midnight</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-wedding-navy">Until 12:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Transport & Practical Info */}
        <GlassCard className="mb-6 p-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Car className="w-6 h-6 text-hsl(var(--glass-green-tint))" />
            <h3 className="text-xl font-semibold text-wedding-navy">Transport</h3>
          </div>
          <div className="space-y-6 text-sm">
            <div className="p-4 sm:p-6 bg-hsl(var(--glass-green-tint) / 0.1) rounded-xl">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-hsl(var(--glass-green-tint) / 0.2) flex items-center justify-center flex-shrink-0">
                  <Car className="w-4 h-4 text-hsl(var(--glass-green-tint))" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-wedding-navy mb-2">Coach Service Available</p>
                  <p className="text-muted-foreground mb-3">
                    Two coaches will transport guests to and from the wedding:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2 mb-3">
                    <li>One coach from Newcastle City</li>
                    <li>One coach from Hunter Valley accommodation</li>
                  </ul>
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-hsl(var(--glass-green-tint) / 0.1) rounded-lg">
                    <div className="w-2 h-2 bg-hsl(var(--glass-green-tint)) rounded-full"></div>
                    <span className="text-xs font-medium text-hsl(var(--glass-green-tint))">
                      First-come, first-served basis - indicate in RSVP
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 glass-secondary rounded-lg">
                <Car className="w-5 h-5 text-hsl(var(--glass-blue-tint))" />
                <div>
                  <p className="font-medium text-wedding-navy">Driving?</p>
                  <p className="text-muted-foreground text-sm">Plenty of on-site parking available</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-amber-50/50 border border-amber-200/50 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="font-medium text-amber-800 text-sm">Limited Uber</p>
                  <p className="text-amber-700 text-xs">Consider coach service</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Dress Code */}
        <GlassCard className="mb-6 p-6 animate-fade-up glass-animated" style={{ animationDelay: '0.5s' }} variant="secondary">
          <h3 className="text-xl font-semibold mb-6 text-wedding-navy flex items-center gap-3">
            <Heart className="w-6 h-6 text-hsl(var(--glass-pink-tint))" />
            Dress Code
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
            <div className="p-4 glass-secondary rounded-lg">
              <p className="font-semibold text-wedding-navy mb-3 flex items-center gap-2">
                <span className="text-hsl(var(--glass-blue-tint))">👔</span>
                For Him:
              </p>
              <p className="text-muted-foreground leading-relaxed">Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief!</p>
            </div>
            <div className="p-4 glass-secondary rounded-lg">
              <p className="font-semibold text-wedding-navy mb-3 flex items-center gap-2">
                <span className="text-hsl(var(--glass-pink-tint))">👗</span>
                For Her:
              </p>
              <p className="text-muted-foreground leading-relaxed">Classy dress, pantsuit or jumpsuit.</p>
            </div>
          </div>
          <div className="text-center p-4 bg-hsl(var(--glass-pink-tint) / 0.1) rounded-xl">
            <p className="font-semibold text-hsl(var(--glass-pink-tint)) text-lg">Dapper/Cocktail Attire</p>
          </div>
        </GlassCard>

        {/* Accommodation */}
        <GlassCard 
          className="p-6 sm:p-8 animate-fade-up glass-shimmer" 
          style={{ animationDelay: '0.6s' }}
          variant="frosted"
        >
          <h3 className="text-xl font-semibold mb-6 text-wedding-navy flex items-center gap-3">
            <MapPin className="w-6 h-6 text-hsl(var(--glass-green-tint))" />
            Accommodation Recommendations
          </h3>
          
          <div className="space-y-8 text-sm">
            <div>
              <h4 className="font-semibold text-wedding-navy mb-4 text-lg">Newcastle Area</h4>
              <p className="text-muted-foreground mb-4">Cooks Hill and Newcastle (East/West) are the most central suburbs.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Ibis Newcastle', 'Holiday Inn Newcastle', 'Kingsley Crystalbrook', 'QT Newcastle'].map((hotel, i) => (
                  <div key={hotel} className="flex items-center justify-between p-3 glass-secondary rounded-lg hover:bg-secondary/30 transition-colors">
                    <span className="font-medium text-wedding-navy">{hotel}</span>
                    <div className="w-2 h-2 rounded-full bg-hsl(var(--glass-blue-tint))"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-wedding-navy mb-4 text-lg">Hunter Valley</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Elfin Hill Vineyard Accommodation', 'Oaks Cypress Lakes Resort', 'Chateau Elan'].map((hotel, i) => (
                  <div key={hotel} className="flex items-center justify-between p-3 glass-secondary rounded-lg hover:bg-secondary/30 transition-colors">
                    <span className="font-medium text-wedding-navy">{hotel}</span>
                    <div className="w-2 h-2 rounded-full bg-hsl(var(--glass-green-tint))"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-hsl(var(--glass-blue-tint) / 0.1) rounded-xl">
              <p className="text-muted-foreground text-center">
                <span className="font-medium">💡 Tip:</span> For houses or apartments, check Stayz, Airbnb, or Follow
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Venue;