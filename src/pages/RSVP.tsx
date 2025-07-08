import React from 'react';
import RSVPWizard from '@/components/RSVPWizard';
import { useRSVPRedirect } from '@/hooks/useRSVPRedirect';

const RSVP: React.FC = () => {
  // This hook will automatically redirect users who haven't completed RSVP
  const { shouldRedirectToRSVP } = useRSVPRedirect();
  
  return <RSVPWizard />;
};

export default RSVP;
