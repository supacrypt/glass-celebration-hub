import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWeddingEvents, useRSVPs } from '@/hooks/useWeddingData';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, Bus, MapPin } from 'lucide-react';

const RSVP: React.FC = () => {
  const { user } = useAuth();
  const { events, loading: eventsLoading } = useWeddingEvents();
  const { rsvps, submitRSVP, loading: rsvpLoading } = useRSVPs(user?.id);
  const { toast } = useToast();
  
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [status, setStatus] = useState<'attending' | 'not_attending' | 'maybe'>('attending');
  const [guestCount, setGuestCount] = useState('1');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [coachSeats, setCoachSeats] = useState('0');
  const [pickupLocation, setPickupLocation] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const mainEvent = events.find(event => event.is_main_event);

  useEffect(() => {
    if (mainEvent && !selectedEventId) {
      setSelectedEventId(mainEvent.id);
    }
  }, [mainEvent, selectedEventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;

    setSubmitting(true);
    
    const fullMessage = [
      message,
      coachSeats !== '0' ? `Coach seats needed: ${coachSeats}` : '',
      pickupLocation ? `Pickup location: ${pickupLocation}` : '',
      accommodation ? `Accommodation: ${accommodation}` : ''
    ].filter(Boolean).join('\n');


    const result = await submitRSVP(
      selectedEventId,
      status,
      parseInt(guestCount),
      dietaryRestrictions || undefined,
      fullMessage || undefined
    );

    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to submit RSVP. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "RSVP Submitted!",
        description: "Thank you for your response. We can't wait to celebrate with you!",
      });
      
      // Reset form
      setMessage('');
      setCoachSeats('0');
      setPickupLocation('');
      setAccommodation('');
    }
    
    setSubmitting(false);
  };

  const existingRSVP = rsvps.find(r => r.event_id === selectedEventId);

  if (eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up">
        <h1 className="wedding-heading text-wedding-navy mb-3">
          RSVP
        </h1>
        <p className="wedding-body text-muted-foreground">
          We can't wait to celebrate with you! Please let us know if you'll be joining us.
        </p>
      </div>

      <GlassCard className="max-w-2xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Selection */}
          <div className="space-y-2">
            <Label htmlFor="event">Event</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {event.title} - {new Date(event.event_date).toLocaleDateString()}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Response Status */}
          <div className="space-y-2">
            <Label>Will you be attending?</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'attending', label: 'Yes, I\'ll be there!', color: 'bg-green-100 text-green-800' },
                { value: 'not_attending', label: 'Sorry, can\'t make it', color: 'bg-red-100 text-red-800' },
                { value: 'maybe', label: 'Maybe', color: 'bg-yellow-100 text-yellow-800' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value as any)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    status === option.value 
                      ? option.color + ' scale-105' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {status === 'attending' && (
            <>
              {/* Guest Count */}
              <div className="space-y-2">
                <Label htmlFor="guestCount">Number of Guests</Label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="guestCount"
                    type="number"
                    min="1"
                    max="4"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="glass-input max-w-20"
                  />
                  <span className="text-sm text-muted-foreground">including yourself</span>
                </div>
              </div>

              {/* Coach Transportation */}
              <GlassCard className="p-4" variant="secondary">
                <h3 className="font-semibold mb-3 text-wedding-navy flex items-center gap-2">
                  <Bus className="w-4 h-4" />
                  Coach Transportation
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Free coach service available from Newcastle City or Hunter Valley accommodation.
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coachSeats">Coach seats needed</Label>
                    <Select value={coachSeats} onValueChange={setCoachSeats}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No coach needed</SelectItem>
                        <SelectItem value="1">1 seat</SelectItem>
                        <SelectItem value="2">2 seats</SelectItem>
                        <SelectItem value="3">3 seats</SelectItem>
                        <SelectItem value="4">4 seats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {coachSeats !== '0' && (
                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation">Pickup Location</Label>
                      <Select value={pickupLocation} onValueChange={setPickupLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pickup location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newcastle">Newcastle City</SelectItem>
                          <SelectItem value="hunter-valley">Hunter Valley Accommodation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Accommodation Details */}
              <div className="space-y-2">
                <Label htmlFor="accommodation">Accommodation Details</Label>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">For coach pickup coordination</span>
                </div>
                <Input
                  id="accommodation"
                  value={accommodation}
                  onChange={(e) => setAccommodation(e.target.value)}
                  placeholder="Hotel name or area you're staying"
                  className="glass-input"
                />
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-2">
                <Label htmlFor="dietary">Dietary Requirements</Label>
                <Textarea
                  id="dietary"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  placeholder="Any allergies or dietary requirements we should know about?"
                  className="glass-input resize-none"
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message for Tim & Kirsten</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your excitement or any special requests..."
              className="glass-input resize-none"
              rows={4}
            />
          </div>

          {/* Existing RSVP Status */}
          {existingRSVP && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Current RSVP:</strong> {existingRSVP.status.replace('_', ' ')} 
                {existingRSVP.guest_count && existingRSVP.guest_count > 1 && ` (${existingRSVP.guest_count} guests)`}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-wedding-navy hover:bg-wedding-navy-light"
            disabled={submitting || !selectedEventId}
          >
            {submitting ? 'Submitting...' : (existingRSVP ? 'Update RSVP' : 'Submit RSVP')}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
};

export default RSVP;
