import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, MapPin, ExternalLink, Edit, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import VenueCard from '@/components/venue/VenueCard';

interface Venue {
  id: string;
  name: string;
  image_url: string;
  image_path: string;
  caption: string | null;
  address: string | null;
  quick_facts: any;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface VenueFormData {
  name: string;
  caption: string;
  address: string;
  quick_facts: Record<string, string>;
}

const Venue: React.FC = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    caption: '',
    address: '',
    quick_facts: {}
  });
  const [quickFactKey, setQuickFactKey] = useState('');
  const [quickFactValue, setQuickFactValue] = useState('');
  const [uploading, setUploading] = useState(false);

  const isAdmin = userRole?.role === 'admin';

  const handleVenueClick = (venueId: string) => {
    navigate(`/venue/detail/${venueId}`);
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast.error('Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  const nextVenue = () => {
    setCurrentIndex((prev) => (prev + 1) % venues.length);
  };

  const prevVenue = () => {
    setCurrentIndex((prev) => (prev - 1 + venues.length) % venues.length);
  };

  const openEditDialog = (venue: Venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      caption: venue.caption || '',
      address: venue.address || '',
      quick_facts: venue.quick_facts || {}
    });
  };

  const handleUpdateVenue = async () => {
    if (!editingVenue) return;

    try {
      const { error } = await supabase
        .from('venues')
        .update({
          name: formData.name,
          caption: formData.caption || null,
          address: formData.address || null,
          quick_facts: Object.keys(formData.quick_facts).length > 0 ? formData.quick_facts : null
        })
        .eq('id', editingVenue.id);

      if (error) throw error;

      toast.success('Venue updated successfully');
      setEditingVenue(null);
      fetchVenues();
    } catch (error) {
      console.error('Error updating venue:', error);
      toast.error('Failed to update venue');
    }
  };

  const handleImageUpload = async (venue: Venue, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${venue.name.toLowerCase().replace(/\s+/g, '-')}.${fileExt}`;
      
      // Determine bucket based on venue name
      let bucketName = 'venue-ben-ean';
      if (venue.name.includes('Prince')) bucketName = 'venue-pub';
      if (venue.name.includes('Beach')) bucketName = 'venue-beach';

      // Delete old image
      if (venue.image_path) {
        await supabase.storage
          .from(bucketName)
          .remove([venue.image_path.split('/').pop() || '']);
      }

      // Upload new image
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      // Update venue record
      const { error: dbError } = await supabase
        .from('venues')
        .update({
          image_url: publicUrl,
          image_path: `${bucketName}/${fileName}`
        })
        .eq('id', venue.id);

      if (dbError) throw dbError;

      toast.success('Venue image updated successfully');
      fetchVenues();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const addQuickFact = () => {
    if (quickFactKey && quickFactValue) {
      setFormData({
        ...formData,
        quick_facts: {
          ...formData.quick_facts,
          [quickFactKey]: quickFactValue
        }
      });
      setQuickFactKey('');
      setQuickFactValue('');
    }
  };

  const removeQuickFact = (key: string) => {
    const newQuickFacts = { ...formData.quick_facts };
    delete newQuickFacts[key];
    setFormData({
      ...formData,
      quick_facts: newQuickFacts
    });
  };

  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading venues...</p>
        </div>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl">📍</div>
              <h3 className="text-xl font-semibold">No venues configured</h3>
              <p className="text-muted-foreground">Venue information will be available soon!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentVenue = venues[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 pt-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-dolly">
                Wedding Venues
              </h1>
              <p className="text-muted-foreground mt-2">
                Discover the beautiful locations for our special day
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} of {venues.length}
            </div>
          </div>
        </div>

        {/* Main Venue Carousel */}
        <div className="glass-card overflow-hidden">
          <div className="relative">
            {/* Image */}
            <div className="aspect-video relative">
              <img
                src={currentVenue.image_url}
                alt={currentVenue.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {venues.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                    onClick={prevVenue}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                    onClick={nextVenue}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}

              {/* Admin Controls */}
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <label htmlFor={`venue-upload-${currentVenue.id}`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={uploading}
                      className="cursor-pointer"
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4" />
                      </span>
                    </Button>
                    <input
                      id={`venue-upload-${currentVenue.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(currentVenue, e)}
                      className="hidden"
                    />
                  </label>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEditDialog(currentVenue)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground font-dolly">
                      {currentVenue.name}
                    </h2>
                    {currentVenue.caption && (
                      <p className="text-muted-foreground mt-2 leading-relaxed">
                        {currentVenue.caption}
                      </p>
                    )}
                  </div>

                  {currentVenue.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{currentVenue.address}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => window.open(getGoogleMapsUrl(currentVenue.address!), '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in Maps
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Quick Facts */}
                {currentVenue.quick_facts && Object.keys(currentVenue.quick_facts).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Quick Facts</h3>
                    <div className="space-y-2">
                      {Object.entries(currentVenue.quick_facts).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                          <span className="text-sm font-medium text-muted-foreground">{key}</span>
                          <span className="text-sm text-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Venue Cards Grid */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-foreground font-dolly mb-6">
            All Venues
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onClick={handleVenueClick}
              />
            ))}
          </div>
        </div>

        {/* Edit Venue Dialog */}
        {isAdmin && editingVenue && (
          <Dialog open={!!editingVenue} onOpenChange={() => setEditingVenue(null)}>
            <DialogContent className="glass-popup max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Venue</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Venue name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Caption</label>
                  <Textarea
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    placeholder="Describe this beautiful venue"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address for maps"
                  />
                </div>
                
                {/* Quick Facts Section */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Quick Facts</label>
                  
                  {/* Add New Quick Fact */}
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Fact name"
                      value={quickFactKey}
                      onChange={(e) => setQuickFactKey(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Fact value"
                      value={quickFactValue}
                      onChange={(e) => setQuickFactValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addQuickFact} disabled={!quickFactKey || !quickFactValue}>
                      Add
                    </Button>
                  </div>

                  {/* Existing Quick Facts */}
                  {Object.entries(formData.quick_facts).length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {Object.entries(formData.quick_facts).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                          <span className="text-sm">{key}: {value}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuickFact(key)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleUpdateVenue} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingVenue(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Venue;
