import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWeddingEvents, useRSVPs } from '@/hooks/useWeddingData';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, Bus, MapPin, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const RSVPWizard: React.FC = () => {
  const { user } = useAuth();
  const { events, loading: eventsLoading } = useWeddingEvents();
  const { rsvps, submitRSVP, loading: rsvpLoading } = useRSVPs(user?.id);
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [status, setStatus] = useState<'attending' | 'not_attending' | 'maybe'>('attending');
  const [guestCount, setGuestCount] = useState('1');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [coachSeats, setCoachSeats] = useState('0');
  const [pickupLocation, setPickupLocation] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 4;
  const mainEvent = events.find(event => event.is_main_event);

  useEffect(() => {
    if (mainEvent && !selectedEventId) {
      setSelectedEventId(mainEvent.id);
    }
  }, [mainEvent, selectedEventId]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Auto-scroll to top of step
      document.querySelector('.wizard-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      document.querySelector('.wizard-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!selectedEventId) return;

    setSubmitting(true);
    
    const fullMessage = [
      message,
      coachSeats !== '0' ? `Coach seats needed: ${coachSeats}` : '',
      pickupLocation ? `Pickup location: ${pickupLocation}` : '',
      accommodation ? `Accommodation: ${accommodation}` : ''
    ].filter(Boolean).join('\n');


    const result = await submitRSVP(
      selectedEventId,
      status,
      parseInt(guestCount),
      dietaryRestrictions || undefined,
      fullMessage || undefined
    );

    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to submit RSVP. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "RSVP Submitted!",
        description: "Thank you for your response. We can't wait to celebrate with you!",
      });
      
      // Reset form
      setCurrentStep(1);
      setMessage('');
      setCoachSeats('0');
      setPickupLocation('');
      setAccommodation('');
    }
    
    setSubmitting(false);
  };

  const existingRSVP = rsvps.find(r => r.event_id === selectedEventId);

  if (eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
      </div>
    );
  }

  const steps = [
    {
      title: "Event & Response",
      description: "Which event and will you attend?"
    },
    {
      title: "Guest Details", 
      description: "How many guests and dietary needs?"
    },
    {
      title: "Transportation",
      description: "Need coach transportation?"
    },
    {
      title: "Final Details",
      description: "Any message for us?"
    }
  ];

  return (
    <div className="min-h-screen px-3 sm:px-5 pt-6 sm:pt-8 pb-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 animate-fade-up">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-dolly font-medium tracking-tight text-wedding-navy mb-3">
          RSVP
        </h1>
        <p className="text-sm sm:text-base font-normal leading-relaxed text-muted-foreground max-w-2xl mx-auto">
          We can't wait to celebrate with you! Please let us know if you'll be joining us.
        </p>
      </div>

      <GlassCard className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="p-4 sm:p-6 border-b border-border/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-dolly font-semibold text-wedding-navy">
              Step {currentStep} of {totalSteps}
            </h2>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="bg-wedding-navy h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="hidden sm:flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                  index + 1 <= currentStep 
                    ? 'bg-wedding-navy text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <div className="text-xs font-medium text-wedding-navy">{step.title}</div>
                <div className="text-xs text-muted-foreground hidden lg:block">{step.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="wizard-content p-4 sm:p-6 lg:p-8 min-h-[400px] flex flex-col">
          {/* Step 1: Event Selection & Response */}
          {currentStep === 1 && (
            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-xl font-semibold text-wedding-navy mb-4">Select Event & Response</h3>
                
                {/* Event Selection */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event">Event</Label>
                    <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {event.title} - {new Date(event.event_date).toLocaleDateString()}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Response Status */}
                  <div>
                    <Label className="text-base mb-3 block">Will you be attending?</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { value: 'attending', label: 'Yes, I\'ll be there! 🎉', color: 'bg-green-100 text-green-800', icon: '✅' },
                        { value: 'not_attending', label: 'Sorry, can\'t make it 😔', color: 'bg-red-100 text-red-800', icon: '❌' },
                        { value: 'maybe', label: 'Maybe / Not sure yet 🤔', color: 'bg-yellow-100 text-yellow-800', icon: '❓' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setStatus(option.value as any)}
                          className={`p-4 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                            status === option.value 
                              ? option.color + ' border-current scale-[1.02]' 
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{option.icon}</span>
                            {option.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Guest Details */}
          {currentStep === 2 && status === 'attending' && (
            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-xl font-semibold text-wedding-navy mb-4">Guest Details</h3>
                
                <div className="space-y-6">
                  {/* Guest Count */}
                  <div>
                    <Label htmlFor="guestCount">Number of Guests</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <Input
                        id="guestCount"
                        type="number"
                        min="1"
                        max="4"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="max-w-24"
                      />
                      <span className="text-sm text-muted-foreground">including yourself</span>
                    </div>
                  </div>

                  {/* Dietary Restrictions */}
                  <div>
                    <Label htmlFor="dietary">Dietary Requirements</Label>
                    <Textarea
                      id="dietary"
                      value={dietaryRestrictions}
                      onChange={(e) => setDietaryRestrictions(e.target.value)}
                      placeholder="Any allergies or dietary requirements we should know about?"
                      className="mt-2 resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Transportation */}
          {currentStep === 3 && status === 'attending' && (
            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-xl font-semibold text-wedding-navy mb-4">Transportation</h3>
                
                <GlassCard className="p-4 sm:p-6" variant="secondary">
                  <div className="flex items-center gap-3 mb-4">
                    <Bus className="w-5 h-5 text-wedding-navy" />
                    <h4 className="font-semibold text-wedding-navy">Coach Transportation</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Free coach service available from Newcastle City or Hunter Valley accommodation.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="coachSeats">Coach seats needed</Label>
                      <Select value={coachSeats} onValueChange={setCoachSeats}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No coach needed</SelectItem>
                          <SelectItem value="1">1 seat</SelectItem>
                          <SelectItem value="2">2 seats</SelectItem>
                          <SelectItem value="3">3 seats</SelectItem>
                          <SelectItem value="4">4 seats</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {coachSeats !== '0' && (
                      <>
                        <div>
                          <Label htmlFor="pickupLocation">Pickup Location</Label>
                          <Select value={pickupLocation} onValueChange={setPickupLocation}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select pickup location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newcastle">Newcastle City</SelectItem>
                              <SelectItem value="hunter-valley">Hunter Valley Accommodation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="accommodation">Accommodation Details</Label>
                          <div className="flex items-center gap-2 mb-2 mt-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">For coach pickup coordination</span>
                          </div>
                          <Input
                            id="accommodation"
                            value={accommodation}
                            onChange={(e) => setAccommodation(e.target.value)}
                            placeholder="Hotel name or area you're staying"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Step 4: Final Message */}
          {currentStep === 4 && (
            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-xl font-semibold text-wedding-navy mb-4">Final Details</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="message">Message for Tim & Kirsten</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your excitement or any special requests..."
                      className="mt-2 resize-none"
                      rows={6}
                    />
                  </div>

                  {/* Existing RSVP Status */}
                  {existingRSVP && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Current RSVP:</strong> {existingRSVP.status.replace('_', ' ')} 
                        {existingRSVP.guest_count && existingRSVP.guest_count > 1 && ` (${existingRSVP.guest_count} guests)`}
                      </p>
                    </div>
                  )}

                  {/* Summary */}
                  <GlassCard className="p-4" variant="secondary">
                    <h4 className="font-semibold text-wedding-navy mb-3">Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Response:</strong> {status.replace('_', ' ')}</div>
                      {status === 'attending' && (
                        <>
                          <div><strong>Guests:</strong> {guestCount}</div>
                          {coachSeats !== '0' && <div><strong>Coach seats:</strong> {coachSeats}</div>}
                          {dietaryRestrictions && <div><strong>Dietary needs:</strong> Yes</div>}
                        </>
                      )}
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          )}

          {/* Skip step 2-3 for non-attending */}
          {currentStep === 2 && status !== 'attending' && (
            <div className="space-y-6 flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold text-wedding-navy mb-2">We'll miss you!</h3>
                <p className="text-muted-foreground">Would you like to leave a message for Tim & Kirsten?</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-4 sm:p-6 border-t border-border/20">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && !selectedEventId}
                className="bg-wedding-navy hover:bg-wedding-navy-light flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting || !selectedEventId}
                className="bg-wedding-navy hover:bg-wedding-navy-light flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {existingRSVP ? 'Update RSVP' : 'Submit RSVP'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default RSVPWizard;
