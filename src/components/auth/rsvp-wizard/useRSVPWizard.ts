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
      console.log('Fetching wedding events...');
      const { data, error } = await supabase
        .from('wedding_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Events fetched successfully:', data);
      setEvents((data || []).map((event: any) => ({
        id: event.id,
        title: event.title || 'Event',
        event_date: event.event_date || new Date().toISOString(),
        location: event.location || '',
        description: event.description || '',
        is_main_event: event.is_main_event || false,
        venue_name: event.venue_name || '',
        address: event.address || '',
        dress_code: event.dress_code || '',
        notes: event.notes || '',
        created_at: event.created_at || new Date().toISOString(),
        updated_at: event.updated_at || new Date().toISOString()
      })));
      
      // Auto-select main event if available
      const mainEvent = data?.find(event => event.is_main_event);
      if (mainEvent) {
        console.log('Auto-selecting main event:', mainEvent);
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
    if (!user || !rsvpData.eventId) {
      console.log('Cannot submit RSVP - missing user or eventId:', { user: !!user, eventId: rsvpData.eventId });
      return;
    }

    try {
      console.log('Submitting RSVP:', { user: user.id, rsvpData });
      
      // Check if RSVP already exists for this user and event
      const { data: existingRSVP } = await (supabase as any)
        .from('rsvps')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', rsvpData.eventId)
        .maybeSingle();
      
      const rsvpPayload = {
        event_id: rsvpData.eventId,
        user_id: user.id,
        status: rsvpData.status,
        guest_count: rsvpData.guestCount,
        dietary_restrictions: rsvpData.dietaryRestrictions,
        message: rsvpData.message,
      };
      
      let rsvpError;
      if (existingRSVP) {
        console.log('Updating existing RSVP...');
        // Update existing RSVP
        const { error } = await (supabase as any)
          .from('rsvps')
          .update({
            ...rsvpPayload,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRSVP.id);
        rsvpError = error;
      } else {
        console.log('Creating new RSVP...');
        // Insert new RSVP
        const { error } = await (supabase as any)
          .from('rsvps')
          .insert(rsvpPayload);
        rsvpError = error;
      }

      if (rsvpError) {
        console.error('RSVP submission error:', rsvpError);
        throw rsvpError;
      }

      console.log('RSVP submitted successfully, updating profile...');
      
      // Update profile to mark RSVP as completed
      const { error: profileError } = await updateProfile({
        rsvp_completed: true
      });

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      console.log('Profile updated successfully');

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