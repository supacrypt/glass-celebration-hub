import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useRSVPRedirect = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rsvpError, setRSVPError] = useState<string | null>(null);
  const [checkingRSVP, setCheckingRSVP] = useState(false);

  useEffect(() => {
    // Only redirect if user is authenticated and we have profile data
    if (!loading && user && profile) {
      checkRSVPStatus();
    }
  }, [user, profile, loading, navigate]);

  const checkRSVPStatus = async () => {
    try {
      setCheckingRSVP(true);
      setRSVPError(null);

      // Check for existing RSVPs
      const { data: rsvps, error: rsvpError } = await supabase
        .from('rsvps')
        .select('id, status, event_id, wedding_events(title)')
        .eq('user_id', user!.id);

      if (rsvpError) {
        throw rsvpError;
      }

      // If user has RSVPs but profile says not completed, update profile
      if (rsvps && rsvps.length > 0 && !profile!.rsvp_completed) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ rsvp_completed: true })
          .eq('user_id', user!.id);

        if (updateError) {
          console.error('Error updating profile RSVP status:', updateError);
        } else {
          toast({
            title: "Welcome back!",
            description: "Your RSVP status has been updated.",
          });
        }
      }

      // If no RSVPs and profile not completed, redirect to RSVP
      if ((!rsvps || rsvps.length === 0) && !profile!.rsvp_completed) {
        navigate('/rsvp', { replace: true });
      }
    } catch (error) {
      console.error('Error checking RSVP status:', error);
      setRSVPError('Failed to check RSVP status. Please try again.');
      
      toast({
        title: "RSVP Check Failed",
        description: "There was an issue checking your RSVP status. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setCheckingRSVP(false);
    }
  };

  const retryRSVPCheck = () => {
    if (user && profile) {
      checkRSVPStatus();
    }
  };

  return {
    shouldRedirectToRSVP: !loading && user && profile && !profile.rsvp_completed,
    rsvpError,
    checkingRSVP,
    retryRSVPCheck,
  };
};