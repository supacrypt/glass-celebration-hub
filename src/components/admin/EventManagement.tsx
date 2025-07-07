import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, Users, Plus, Edit2, Trash2, Heart } from 'lucide-react';

interface WeddingEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  venue_name: string | null;
  location: string | null;
  address: string | null;
  dress_code: string | null;
  notes: string | null;
  is_main_event: boolean | null;
  created_at: string;
  updated_at: string;
}

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  venue_name: string;
  location: string;
  address: string;
  dress_code: string;
  notes: string;
  is_main_event: boolean;
}

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<WeddingEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    event_date: '',
    venue_name: '',
    location: '',
    address: '',
    dress_code: '',
    notes: '',
    is_main_event: false,
  });
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wedding_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      venue_name: '',
      location: '',
      address: '',
      dress_code: '',
      notes: '',
      is_main_event: false,
    });
    setEditingEvent(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (event: WeddingEvent) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date.replace('Z', '').slice(0, 16), // Format for datetime-local input
      venue_name: event.venue_name || '',
      location: event.location || '',
      address: event.address || '',
      dress_code: event.dress_code || '',
      notes: event.notes || '',
      is_main_event: event.is_main_event || false,
    });
    setEditingEvent(event);
    setIsCreateDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const eventData = {
        ...formData,
        event_date: new Date(formData.event_date).toISOString(),
      };

      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('wedding_events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;

        toast({
          title: "Event Updated",
          description: "The event has been updated successfully",
        });
      } else {
        // Create new event
        const { error } = await supabase
          .from('wedding_events')
          .insert([eventData]);

        if (error) throw error;

        toast({
          title: "Event Created",
          description: "New event has been created successfully",
        });
      }

      setIsCreateDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('wedding_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Event Deleted",
        description: "The event has been deleted successfully",
      });

      fetchEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-wedding-navy">Event Management</h2>
          <p className="text-muted-foreground">Create and manage wedding events</p>
        </div>
        <Button onClick={openCreateDialog} className="glass-button">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Card key={event.id} className="glass-card relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  {event.is_main_event && (
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(event)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{event.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(event.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              {event.is_main_event && (
                <Badge variant="secondary" className="w-fit">
                  Main Event
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.event_date)}</span>
              </div>
              
              {event.venue_name && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{event.venue_name}</span>
                </div>
              )}

              {event.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
              )}

              {event.dress_code && (
                <div className="text-xs">
                  <span className="font-medium">Dress Code: </span>
                  <span className="text-muted-foreground">{event.dress_code}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && !loading && (
        <Card className="glass-card text-center py-12">
          <CardContent>
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Events Created</h3>
            <p className="text-muted-foreground mb-4">
              Create your first wedding event to get started.
            </p>
            <Button onClick={openCreateDialog} className="glass-button">
              <Plus className="w-4 h-4 mr-2" />
              Create First Event
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update the event details below.' : 'Fill in the details to create a new wedding event.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Wedding Ceremony"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Date & Time *</Label>
                <Input
                  id="event_date"
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue_name">Venue Name</Label>
                <Input
                  id="venue_name"
                  value={formData.venue_name}
                  onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                  placeholder="Ben Ean"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Hunter Valley"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="119 McDonalds Rd, Pokolbin NSW 2320"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dress_code">Dress Code</Label>
              <Input
                id="dress_code"
                value={formData.dress_code}
                onChange={(e) => setFormData({ ...formData, dress_code: e.target.value })}
                placeholder="Cocktail attire"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional information for guests..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_main_event"
                checked={formData.is_main_event}
                onCheckedChange={(checked) => setFormData({ ...formData, is_main_event: checked })}
              />
              <Label htmlFor="is_main_event">Mark as main event</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="glass-button">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingEvent ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingEvent ? 'Update Event' : 'Create Event'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManagement;