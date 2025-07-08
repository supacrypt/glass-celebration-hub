import React from 'react';
import { RSVPIntegratedWizard } from '@/components/auth/rsvp-wizard';
import { useRSVPRedirect } from '@/hooks/useRSVPRedirect';

const RSVP: React.FC = () => {
  // This hook will automatically redirect users who haven't completed RSVP
  const { shouldRedirectToRSVP } = useRSVPRedirect();
  
  return <RSVPIntegratedWizard />;
};

export default RSVP;
