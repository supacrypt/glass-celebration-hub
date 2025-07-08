import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { RSVPData } from './types';

interface RSVPStepThreeProps {
  rsvpData: RSVPData;
  currentStep: number;
  onUpdateRSVPData: (data: Partial<RSVPData>) => void;
  onPrevStep: () => void;
  onSubmitRSVP: () => void;
}

export const RSVPStepThree: React.FC<RSVPStepThreeProps> = ({
  rsvpData,
  currentStep,
  onUpdateRSVPData,
  onPrevStep,
  onSubmitRSVP
}) => {
  const shouldShowBackButton = currentStep === 3 || rsvpData.status === 'attending';

  return (
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
            onChange={(e) => onUpdateRSVPData({ message: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-3">
        {shouldShowBackButton && (
          <Button 
            variant="outline" 
            onClick={onPrevStep} 
            className="flex-1 font-dolly"
          >
            Back
          </Button>
        )}
        <Button 
          onClick={onSubmitRSVP} 
          className="flex-1 bg-wedding-navy hover:bg-wedding-navy-light font-dolly"
        >
          Complete RSVP
        </Button>
      </div>
    </div>
  );
};