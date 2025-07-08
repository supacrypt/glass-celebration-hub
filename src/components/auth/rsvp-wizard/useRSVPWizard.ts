import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RSVPData, WeddingEvent } from './types';

export const useRSVPWizard = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
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
  
  const updateRSVPData = (data: Partial<RSVPData>) => {
    setRSVPData(prev => ({ ...prev, ...data }));
  };

  return {
    user,
    profile,
    currentStep,
    events,
    rsvpData,
    nextStep,
    prevStep,
    updateRSVPData,
    submitRSVP
  };
};