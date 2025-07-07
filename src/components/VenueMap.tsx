import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, ExternalLink } from 'lucide-react';

interface VenueMapProps {
  venue: {
    name: string;
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
    description?: string;
  };
  className?: string;
}

const VenueMap: React.FC<VenueMapProps> = ({ venue, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    // Check if we have a stored token
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
      setShowTokenInput(false);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: venue.coordinates,
        zoom: 15,
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add marker for venue
      new mapboxgl.Marker({
        color: '#2C3E50',
        scale: 1.2
      })
        .setLngLat(venue.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #2C3E50;">${venue.name}</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">${venue.address}</p>
                ${venue.description ? `<p style="margin: 8px 0 0 0; color: #666; font-size: 12px;">${venue.description}</p>` : ''}
              </div>
            `)
        )
        .addTo(map.current);

      // Show popup by default
      map.current.on('load', () => {
        const markers = document.querySelectorAll('.mapboxgl-marker');
        if (markers.length > 0) {
          (markers[0] as HTMLElement).click();
        }
      });

      // Cleanup
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
    }
  }, [mapboxToken, venue]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken.trim());
      setShowTokenInput(false);
    }
  };

  const openInGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`;
    window.open(googleMapsUrl, '_blank');
  };

  if (showTokenInput) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-glass-blue" />
          <h3 className="text-lg font-semibold mb-2 text-wedding-navy">Interactive Map</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To show the interactive map, please enter your Mapbox public token:
          </p>
          <div className="flex flex-col gap-3">
            <Input
              type="text"
              placeholder="Mapbox public token (pk.ey...)"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="glass-input"
            />
            <div className="flex gap-2">
              <Button onClick={handleTokenSubmit} className="flex-1">
                Load Map
              </Button>
              <Button variant="outline" onClick={openInGoogleMaps}>
                <ExternalLink className="w-4 h-4 mr-1" />
                Google Maps
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Get your free token at{' '}
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-glass-blue hover:underline">
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-80 rounded-glass shadow-lg border border-border/20" />
      <div className="absolute top-4 left-4 z-10">
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={openInGoogleMaps}
          className="shadow-lg bg-white/90 hover:bg-white"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Google Maps
        </Button>
      </div>
    </div>
  );
};

export default VenueMap;