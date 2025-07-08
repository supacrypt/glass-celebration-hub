import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Users, Utensils, MessageSquare } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

interface RSVPData {
  eventId: string;
  status: 'attending' | 'not_attending' | 'maybe';
  guestCount: number;
  dietaryRestrictions?: string;
  message?: string;
}

export const RSVPIntegratedWizard: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [events, setEvents] = useState<any[]>([]);
  const [rsvpData, setRSVPData] = useState<RSVPData>({
    eventId: '',
    status: 'attending',
    guestCount: 1,
    dietaryRestrictions: '',
    message: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
      
      // Auto-select main event if available
      const mainEvent = data?.find(event => event.is_main_event);
      if (mainEvent) {
        setRSVPData(prev => ({ ...prev, eventId: mainEvent.id }));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load wedding events.",
        variant: "destructive",
      });
    }
  };

  const submitRSVP = async () => {
    if (!user || !rsvpData.eventId) return;

    try {
      // Submit RSVP
      const { error: rsvpError } = await supabase
        .from('rsvps')
        .upsert({
          event_id: rsvpData.eventId,
          user_id: user.id,
          status: rsvpData.status,
          guest_count: rsvpData.guestCount,
          dietary_restrictions: rsvpData.dietaryRestrictions,
          message: rsvpData.message,
        }, {
          onConflict: 'user_id,event_id'
        });

      if (rsvpError) throw rsvpError;

      // Update profile to mark RSVP as completed
      const { error: profileError } = await updateProfile({
        rsvp_completed: true
      });

      if (profileError) throw profileError;

      toast({
        title: "RSVP Submitted!",
        description: "Thank you for confirming your attendance.",
      });

      navigate('/home');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast({
        title: "Error",
        description: "Failed to submit RSVP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-5 py-6 sm:py-12">
      <GlassCard className="w-full max-w-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-dolly mb-2">Welcome, {profile.first_name}!</h1>
          <p className="text-muted-foreground">Please complete your RSVP to continue</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-wedding-navy text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 3 && <div className={`w-12 h-0.5 ${
                  currentStep > step ? 'bg-wedding-navy' : 'bg-muted'
                }`} />}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-wedding-navy" />
              <h2 className="text-xl font-semibold font-dolly mb-2">Attendance Confirmation</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-dolly">Event</Label>
                <Select value={rsvpData.eventId} onValueChange={(value) => setRSVPData(prev => ({ ...prev, eventId: value }))}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title} - {new Date(event.event_date).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-dolly">Will you be attending?</Label>
                <Select value={rsvpData.status} onValueChange={(value: any) => setRSVPData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="glass-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attending">Yes, I'll be there!</SelectItem>
                    <SelectItem value="not_attending">Sorry, can't make it</SelectItem>
                    <SelectItem value="maybe">Maybe - will confirm later</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {rsvpData.status === 'attending' && (
                <div className="space-y-2">
                  <Label className="font-dolly">Number of Guests</Label>
                  <Select 
                    value={rsvpData.guestCount.toString()} 
                    onValueChange={(value) => setRSVPData(prev => ({ ...prev, guestCount: parseInt(value) }))}
                  >
                    <SelectTrigger className="glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Just me</SelectItem>
                      <SelectItem value="2">Me + 1 guest</SelectItem>
                      {profile.has_plus_one && <SelectItem value="2">Me + my plus one</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Button 
              onClick={nextStep} 
              className="w-full bg-wedding-navy hover:bg-wedding-navy-light font-dolly"
              disabled={!rsvpData.eventId}
            >
              Continue
            </Button>
          </div>
        )}

        {currentStep === 2 && rsvpData.status === 'attending' && (
          <div className="space-y-6">
            <div className="text-center">
              <Utensils className="w-12 h-12 mx-auto mb-4 text-wedding-navy" />
              <h2 className="text-xl font-semibold font-dolly mb-2">Dietary Requirements</h2>
              <p className="text-muted-foreground">Help us cater to your needs</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dietary" className="font-dolly">Dietary Restrictions or Allergies</Label>
                <Textarea
                  id="dietary"
                  className="glass-input resize-none font-dolly"
                  placeholder="Please list any dietary restrictions, allergies, or special requirements..."
                  rows={4}
                  value={rsvpData.dietaryRestrictions}
                  onChange={(e) => setRSVPData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Examples: Vegetarian, Vegan, Gluten-free, Nut allergy, etc.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={prevStep} 
                className="flex-1 font-dolly"
              >
                Back
              </Button>
              <Button 
                onClick={nextStep} 
                className="flex-1 bg-wedding-navy hover:bg-wedding-navy-light font-dolly"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {(currentStep === 3) || (currentStep === 2 && rsvpData.status !== 'attending') ? (
          <div className="space-y-6">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-wedding-navy" />
              <h2 className="text-xl font-semibold font-dolly mb-2">Final Message</h2>
              <p className="text-muted-foreground">Any message for the happy couple?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message" className="font-dolly">Message (Optional)</Label>
                <Textarea
                  id="message"
                  className="glass-input resize-none font-dolly"
                  placeholder="Share your excitement, well wishes, or any questions..."
                  rows={4}
                  value={rsvpData.message}
                  onChange={(e) => setRSVPData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3">
              {(currentStep === 3 || rsvpData.status === 'attending') && (
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  className="flex-1 font-dolly"
                >
                  Back
                </Button>
              )}
              <Button 
                onClick={submitRSVP} 
                className="flex-1 bg-wedding-navy hover:bg-wedding-navy-light font-dolly"
              >
                Complete RSVP
              </Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};