import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Utensils } from 'lucide-react';
import { RSVPData } from './types';

interface RSVPStepTwoProps {
  rsvpData: RSVPData;
  onUpdateRSVPData: (data: Partial<RSVPData>) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const RSVPStepTwo: React.FC<RSVPStepTwoProps> = ({
  rsvpData,
  onUpdateRSVPData,
  onNextStep,
  onPrevStep
}) => {
  return (
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
            onChange={(e) => onUpdateRSVPData({ dietaryRestrictions: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Examples: Vegetarian, Vegan, Gluten-free, Nut allergy, etc.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onPrevStep} 
          className="flex-1 font-dolly"
        >
          Back
        </Button>
        <Button 
          onClick={onNextStep} 
          className="flex-1 bg-wedding-navy hover:bg-wedding-navy-light font-dolly"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};