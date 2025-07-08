import React from 'react';
import GlassCard from '@/components/GlassCard';
import { useRSVPWizard } from './useRSVPWizard';
import { RSVPProgressSteps } from './RSVPProgressSteps';
import { RSVPStepOne } from './RSVPStepOne';
import { RSVPStepTwo } from './RSVPStepTwo';
import { RSVPStepThree } from './RSVPStepThree';

export const RSVPIntegratedWizard: React.FC = () => {
  const {
    user,
    profile,
    currentStep,
    events,
    rsvpData,
    nextStep,
    prevStep,
    updateRSVPData,
    submitRSVP
  } = useRSVPWizard();

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RSVPStepOne
            rsvpData={rsvpData}
            events={events}
            profile={profile}
            onUpdateRSVPData={updateRSVPData}
            onNextStep={nextStep}
          />
        );
      case 2:
        if (rsvpData.status === 'attending') {
          return (
            <RSVPStepTwo
              rsvpData={rsvpData}
              onUpdateRSVPData={updateRSVPData}
              onNextStep={nextStep}
              onPrevStep={prevStep}
            />
          );
        }
        // Fall through to step 3 for non-attending users
      case 3:
      default:
        return (
          <RSVPStepThree
            rsvpData={rsvpData}
            currentStep={currentStep}
            onUpdateRSVPData={updateRSVPData}
            onPrevStep={prevStep}
            onSubmitRSVP={submitRSVP}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-5 py-6 sm:py-12">
      <GlassCard className="w-full max-w-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-dolly mb-2">Welcome, {profile.first_name}!</h1>
          <p className="text-muted-foreground">Please complete your RSVP to continue</p>
        </div>

        <RSVPProgressSteps currentStep={currentStep} />
        
        {renderCurrentStep()}
      </GlassCard>
    </div>
  );
};