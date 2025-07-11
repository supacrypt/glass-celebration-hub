import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, Heart, X, AlertCircle, CheckCircle, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import GlassCard from '@/components/GlassCard';

interface RSVPPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  mobile: string;
  dietaryRequirements?: string;
  plusOneName?: string;
  plusOneEmail?: string;
  plusOneDietary?: string;
}

const RSVPPopup: React.FC<RSVPPopupProps> = ({ isOpen, onClose, onComplete }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [attendance, setAttendance] = useState<'yes' | 'no' | 'maybe' | null>(null);
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: profile?.email || user?.email || '',
    address: profile?.address || '',
    mobile: profile?.mobile || profile?.phone || '',
    dietaryRequirements: '',
    plusOneName: profile?.plus_one_name || '',
    plusOneEmail: profile?.plus_one_email || '',
    plusOneDietary: ''
  });
  const [hasPlusOne, setHasPlusOne] = useState(profile?.has_plus_one || false);
  const [loading, setLoading] = useState(false);
  const [importantInfo, setImportantInfo] = useState([
    {
      icon: Users,
      title: "Adults Only Celebration",
      description: "Although we love your little ones, we probably met you before children and we would love to spend the night celebrating with just you! Babes in arms excepted.",
      acknowledged: false
    },
    {
      icon: MapPin,
      title: "Coaches Available",
      description: "We have organized coaches to and from Newcastle. Details will be sent closer to the date.",
      acknowledged: false
    },
    {
      icon: Clock,
      title: "Timing is Important",
      description: "Please arrive 15 minutes early for the 3:00 PM ceremony. The day will conclude at 11:00 PM.",
      acknowledged: false
    }
  ]);

  useEffect(() => {
    if (profile) {
      setGuestDetails(prev => ({
        ...prev,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || user?.email || '',
        address: profile.address || '',
        mobile: profile.mobile || profile.phone || '',
        plusOneName: profile.plus_one_name || '',
        plusOneEmail: profile.plus_one_email || ''
      }));
      setHasPlusOne(profile.has_plus_one || false);
    }
  }, [profile, user]);

  if (!isOpen) return null;

  const handleAttendanceResponse = (response: 'yes' | 'no' | 'maybe') => {
    setAttendance(response);
    if (response === 'yes') {
      setStep(2); // Go to important info
    } else if (response === 'maybe') {
      // For maybe, we still collect basic info but mark as tentative
      setStep(2);
    } else {
      // For no, we can skip straight to final step with minimal info
      setStep(4);
    }
  };

  const handleInfoAcknowledged = (index: number, acknowledged: boolean) => {
    setImportantInfo(prev => prev.map((info, i) => 
      i === index ? { ...info, acknowledged } : info
    ));
  };

  const allInfoAcknowledged = importantInfo.every(info => info.acknowledged);

  const handleDetailsSubmit = async () => {
    setLoading(true);
    try {
      // Update profile with guest details
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: guestDetails.firstName,
          last_name: guestDetails.lastName,
          address: guestDetails.address,
          mobile: guestDetails.mobile,
          plus_one_name: hasPlusOne ? guestDetails.plusOneName : null,
          plus_one_email: hasPlusOne ? guestDetails.plusOneEmail : null,
          rsvp_completed: true
        })
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

      // Get the main wedding event ID first
      const { data: mainEvent } = await supabase
        .from('wedding_events')
        .select('id')
        .eq('is_main_event', true)
        .single();

      if (!mainEvent) {
        throw new Error('No main wedding event found');
      }

      // Use safe upsert function to handle RSVP conflicts properly
      const { data: rsvpData, error: rsvpError } = await supabase
        .rpc('safe_upsert_rsvp', {
          p_user_id: user?.id,
          p_event_id: mainEvent.id,
          p_status: attendance === 'yes' ? 'attending' : attendance === 'no' ? 'declined' : 'maybe',
          p_guest_count: attendance === 'yes' ? (hasPlusOne ? 2 : 1) : 0,
          p_dietary_restrictions: guestDetails.dietaryRequirements || null,
          p_message: attendance === 'maybe' ? 'Guest responded maybe - follow up needed' : null
        });

      if (rsvpError) throw rsvpError;

      toast({
        title: "RSVP Completed!",
        description: "Thank you for your response. We're excited to celebrate with you!",
      });

      onComplete();
      onClose();
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast({
        title: "Error",
        description: "There was an issue submitting your RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Heart className="w-12 h-12 mx-auto text-glass-pink" />
        <h2 className="text-2xl font-semibold text-wedding-navy">
          Tim & Kirsten's Wedding
        </h2>
        <p className="text-muted-foreground">
          We'd love to know if you can join us for our special day!
        </p>
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center justify-center space-x-2 text-wedding-gold">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">5 October 2025 • 3:00 PM</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Ben Ean, Pokolbin</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-center text-wedding-navy">
          Will you be attending?
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => handleAttendanceResponse('yes')}
            className="h-auto py-4 glass-button-primary"
            variant="default"
          >
            <div className="text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Yes, I'll be there!</div>
              <div className="text-sm opacity-80">Can't wait to celebrate</div>
            </div>
          </Button>
          
          <Button
            onClick={() => handleAttendanceResponse('maybe')}
            className="h-auto py-4 glass-button-secondary"
            variant="outline"
          >
            <div className="text-center">
              <AlertCircle className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Maybe</div>
              <div className="text-sm opacity-80">Still checking my schedule</div>
            </div>
          </Button>
          
          <Button
            onClick={() => handleAttendanceResponse('no')}
            className="h-auto py-4 glass-button-secondary"
            variant="outline"
          >
            <div className="text-center">
              <X className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Can't make it</div>
              <div className="text-sm opacity-80">Wish I could be there</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-wedding-navy mb-2">
          Important Information
        </h2>
        <p className="text-sm text-muted-foreground">
          Please read and acknowledge these important details about our wedding
        </p>
      </div>

      <div className="space-y-4">
        {importantInfo.map((info, index) => {
          const Icon = info.icon;
          return (
            <div key={index} className="glass-card p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Icon className="w-6 h-6 mt-1 text-wedding-gold flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium text-wedding-navy">{info.title}</h3>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={info.acknowledged}
                      onChange={(e) => handleInfoAcknowledged(index, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">I understand and acknowledge</span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setStep(1)}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={() => setStep(3)}
          disabled={!allInfoAcknowledged}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-wedding-navy mb-2">
          Your Details
        </h2>
        <p className="text-sm text-muted-foreground">
          Please provide your contact information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={guestDetails.firstName}
            onChange={(e) => setGuestDetails(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={guestDetails.lastName}
            onChange={(e) => setGuestDetails(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={guestDetails.email}
            onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={guestDetails.address}
            onChange={(e) => setGuestDetails(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Full address including postcode"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="mobile">Mobile *</Label>
          <Input
            id="mobile"
            type="tel"
            value={guestDetails.mobile}
            onChange={(e) => setGuestDetails(prev => ({ ...prev, mobile: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="dietary">Dietary Requirements</Label>
          <Input
            id="dietary"
            value={guestDetails.dietaryRequirements}
            onChange={(e) => setGuestDetails(prev => ({ ...prev, dietaryRequirements: e.target.value }))}
            placeholder="Optional"
          />
        </div>
      </div>

      {hasPlusOne && (
        <div className="glass-card p-4 space-y-4">
          <h3 className="font-medium text-wedding-navy">Plus One Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plusOneName">Plus One Name</Label>
              <Input
                id="plusOneName"
                value={guestDetails.plusOneName}
                onChange={(e) => setGuestDetails(prev => ({ ...prev, plusOneName: e.target.value }))}
                placeholder="Full name"
              />
            </div>
            
            <div>
              <Label htmlFor="plusOneEmail">Plus One Email</Label>
              <Input
                id="plusOneEmail"
                type="email"
                value={guestDetails.plusOneEmail}
                onChange={(e) => setGuestDetails(prev => ({ ...prev, plusOneEmail: e.target.value }))}
                placeholder="Optional"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="plusOneDietary">Plus One Dietary Requirements</Label>
              <Input
                id="plusOneDietary"
                value={guestDetails.plusOneDietary}
                onChange={(e) => setGuestDetails(prev => ({ ...prev, plusOneDietary: e.target.value }))}
                placeholder="Optional"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={() => setStep(2)}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleDetailsSubmit}
          disabled={loading || !guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.address || !guestDetails.mobile}
          className="flex-1"
        >
          {loading ? 'Submitting...' : 'Complete RSVP'}
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <Heart className="w-12 h-12 mx-auto text-glass-pink" />
        <h2 className="text-xl font-semibold text-wedding-navy">
          {attendance === 'no' ? "We'll Miss You!" : "Thank You!"}
        </h2>
        <p className="text-muted-foreground">
          {attendance === 'no' 
            ? "We're sorry you can't make it, but we understand. We'll be thinking of you on our special day!"
            : "Your RSVP has been recorded. We'll send you more details closer to the date."
          }
        </p>
      </div>

      <Button
        onClick={handleDetailsSubmit}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Submitting...' : 'Complete'}
      </Button>
    </div>
  );

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                {[1, 2, 3].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`w-3 h-3 rounded-full ${
                      stepNum <= step ? 'bg-wedding-gold' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-wedding-navy"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>
        </GlassCard>
      </div>
    </>
  );
};

export default RSVPPopup;