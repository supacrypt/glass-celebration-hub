import React from 'react';
import { CheckCircle } from 'lucide-react';

interface RSVPProgressStepsProps {
  currentStep: number;
}

export const RSVPProgressSteps: React.FC<RSVPProgressStepsProps> = ({ currentStep }) => {
  return (
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
  );
};