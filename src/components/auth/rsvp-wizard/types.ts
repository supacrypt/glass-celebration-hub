export interface RSVPData {
  eventId: string;
  status: 'attending' | 'not_attending' | 'maybe';
  guestCount: number;
  dietaryRestrictions?: string;
  message?: string;
}

export interface WeddingEvent {
  id: string;
  title: string;
  event_date: string;
  is_main_event?: boolean;
}

export interface RSVPWizardProps {
  currentStep: number;
  rsvpData: RSVPData;
  events: WeddingEvent[];
  profile: any;
  onUpdateRSVPData: (data: Partial<RSVPData>) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmitRSVP: () => void;
}