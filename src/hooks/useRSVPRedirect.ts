import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRSVPRedirect = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if user is authenticated and we have profile data
    if (!loading && user && profile) {
      // Check if user hasn't completed RSVP
      if (!profile.rsvp_completed) {
        // Redirect to RSVP page
        navigate('/rsvp', { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  return {
    shouldRedirectToRSVP: !loading && user && profile && !profile.rsvp_completed,
  };
};