import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    image_url: string;
    address: string | null;
    caption: string | null;
  };
  onClick: (venueId: string) => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, onClick }) => {
  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <Card 
      className="glass-card overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onClick(venue.id)}
    >
      <div className="aspect-video relative">
        <img
          src={venue.image_url}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick actions overlay */}
        {venue.address && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                window.open(getGoogleMapsUrl(venue.address!), '_blank');
              }}
              className="bg-white/90 hover:bg-white text-black"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Maps
            </Button>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-2 font-dolly">
          {venue.name}
        </h3>
        
        {venue.caption && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {venue.caption}
          </p>
        )}
        
        {venue.address && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{venue.address}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VenueCard;