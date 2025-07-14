import React, { useState, useEffect } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useWeddingEvents } from '@/hooks/useWeddingData';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, MapPin, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface Venue {
  id: string;
  name: string;
  image_url: string;
  caption: string | null;
  address: string | null;
  quick_facts: Record<string, string> | null;
}

interface EventsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const EventsPopup: React.FC<EventsPopupProps> = ({ isOpen, onClose }) => {
  useKeyboardShortcuts({ isOpen, onClose });
  const { events, loading: eventsLoading } = useWeddingEvents();
  const navigate = useNavigate();
  
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [currentMainVenue, setCurrentMainVenue] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('events-popup-open');
      fetchVenues();
    } else {
      document.body.classList.remove('events-popup-open');
    }
    return () => {
      document.body.classList.remove('events-popup-open');
    };
  }, [isOpen]);

  const fetchVenues = async () => {
    setVenuesLoading(true);
    console.log('EventsPopup: Starting to fetch venues...');
    
    // Fallback venue data matching the screenshot
    const fallbackVenues: Venue[] = [
      {
        id: '1',
        name: 'Ben Ean Winery',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        caption: 'Wedding ceremony and reception venue in the beautiful Hunter Valley. Join us for the main celebration on Sunday, October 5th, 2025.',
        address: '119 McDonalds Rd, Pokolbin NSW 2320',
        quick_facts: {
          "Ceremony": "3:00 PM on Garden Terrace",
          "End Time": "12:00 PM",
          "Reception": "5:00 PM cocktails, 7:00 PM dinner",
          "Dress Code": "Cocktail/Dapper"
        }
      },
      {
        id: '2',
        name: 'The Prince Hotel, Mereweather',
        image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
        caption: 'Pre-wedding drinks and casual dinner. Stop in to have a drink and grab yourself a meal if you are hungry.',
        address: 'Mereweather, NSW 2291',
        quick_facts: {
          "Event": "Pre-wedding drinks",
          "Date": "October 4th, 4-8 PM", 
          "Dress Code": "Casual",
          "Food": "Full pub menu available"
        }
      },
      {
        id: '3',
        name: 'Newcastle Beach',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        caption: 'Recovery beach day with coffee and excellent food. Good for sobbing up... hair of the dog perhaps?',
        address: 'Newcastle Beach, NSW 2300',
        quick_facts: {
          "Event": "Recovery Day",
          "Date": "October 6th, 11 AM",
          "Activities": "Beach, coffee, food",
          "Vibe": "Relaxed recovery"
        }
      }
    ];
    
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('EventsPopup: Error fetching venues, using fallback:', error);
        setVenues(fallbackVenues);
      } else if (!data || data.length === 0) {
        console.log('EventsPopup: No venues in database, using fallback data');
        setVenues(fallbackVenues);
      } else {
        console.log('EventsPopup: Venues fetched successfully:', data);
        setVenues((data as Venue[]) || []);
      }
    } catch (error) {
      console.error('EventsPopup: Exception while fetching venues, using fallback:', error);
      setVenues(fallbackVenues);
    } finally {
      setVenuesLoading(false);
    }
  };

  const nextMainVenue = () => {
    setCurrentMainVenue((prev) => (prev + 1) % venues.length);
  };

  const prevMainVenue = () => {
    setCurrentMainVenue((prev) => (prev - 1 + venues.length) % venues.length);
  };

  const getVenueRoute = (venueName?: string) => {
    if (!venueName) return null;
    
    const normalizedName = venueName.toLowerCase();
    if (normalizedName.includes('ben ean')) {
      return '/venue/ben-ean';
    } else if (normalizedName.includes('prince') || normalizedName.includes('mereweather')) {
      return '/venue/prince-of-mereweather';
    } else if (normalizedName.includes('newcastle') || normalizedName.includes('beach')) {
      return '/venue/newcastle-beach';
    }
    return null;
  };

  const handleVenueClick = (venue: Venue) => {
    const route = getVenueRoute(venue.name);
    if (route) {
      onClose();
      navigate(route);
    }
  };

  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  if (!isOpen) {
    return null;
  }

  const mainVenue = venues[currentMainVenue];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      />
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 10000 }}
        onClick={onClose}
      >
        <div 
          className="glass-popup bg-white/95 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="venue-title"
        >
          <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-200/50">
            <div>
              <CardTitle id="venue-title" className="text-2xl font-bold text-wedding-navy">
                Wedding Venues
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Discover the beautiful locations for our special day
              </p>
              {venues.length > 1 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {currentMainVenue + 1} of {venues.length}
                </p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>

          <CardContent className="p-0 flex-grow overflow-y-auto">
            {venuesLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy" />
              </div>
            ) : venues.length > 0 && mainVenue ? (
              <div className="flex flex-col">
                {/* Main Featured Venue Card */}
                <div className="relative">
                  <div className="relative w-full h-80 md:h-96 cursor-pointer group" onClick={() => handleVenueClick(mainVenue)}>
                    <img 
                      src={mainVenue.image_url} 
                      alt={mainVenue.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Navigation arrows */}
                    {venues.length > 1 && (
                      <>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            prevMainVenue();
                          }} 
                          variant="ghost" 
                          size="icon" 
                          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            nextMainVenue();
                          }} 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Button>
                      </>
                    )}

                    {/* Venue name overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                        {mainVenue.name}
                      </h2>
                      <p className="text-white/90 text-lg max-w-2xl">
                        {mainVenue.caption}
                      </p>
                    </div>
                  </div>

                  {/* Venue Details Section */}
                  <div className="bg-white p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left Column - Address and Details */}
                      <div className="space-y-4">
                        {mainVenue.address && (
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-glass-purple mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-gray-800 font-medium">{mainVenue.address}</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(getGoogleMapsUrl(mainVenue.address!), '_blank');
                                }}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open in Maps
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <Button
                          variant="default"
                          size="lg"
                          className="w-full bg-wedding-navy hover:bg-wedding-navy/90"
                          onClick={() => handleVenueClick(mainVenue)}
                        >
                          View Full Details & Map
                        </Button>
                      </div>

                      {/* Right Column - Quick Facts */}
                      {mainVenue.quick_facts && Object.keys(mainVenue.quick_facts).length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-wedding-navy mb-3">Quick Facts</h4>
                          <div className="space-y-3">
                            {Object.entries(mainVenue.quick_facts).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                                <span className="font-medium text-gray-700">{key}</span>
                                <span className="text-gray-600 text-right">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Small Venue Cards Row */}
                {venues.length > 1 && (
                  <div className="bg-gray-50 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {venues.map((venue, index) => (
                        <div 
                          key={venue.id} 
                          className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                          onClick={() => handleVenueClick(venue)}
                        >
                          <div className="relative h-32 overflow-hidden">
                            <img 
                              src={venue.image_url} 
                              alt={venue.name} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Currently Viewing Badge */}
                            {index === currentMainVenue && (
                              <div className="absolute top-2 left-2 bg-wedding-navy text-white text-xs px-2 py-1 rounded-full">
                                Currently Viewing
                              </div>
                            )}
                            
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h4 className="text-white font-semibold text-sm mb-1">{venue.name}</h4>
                              <p className="text-white/80 text-xs line-clamp-2">{venue.caption}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>No venues available</p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </>
  );
};

export default EventsPopup;