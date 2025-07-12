import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Heart, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { submitSimpleRSVP } from '@/utils/simpleRsvpService';
import GlassCard from '@/components/GlassCard';

interface SimpleRSVPPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const SimpleRSVPPopup: React.FC<SimpleRSVPPopupProps> = ({ isOpen, onClose, onComplete }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRSVPResponse = async (response: 'yes' | 'no' | 'maybe') => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your RSVP.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await submitSimpleRSVP({
        userId: user.id,
        attendance: response,
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        email: profile?.email || user?.email || ''
      });

      if (result.success) {
        const messages = {
          yes: "Thank you! We can't wait to celebrate with you! 🎉",
          no: "Thank you for letting us know. We'll miss you on our special day! 💕",
          maybe: "Thank you for your response. We hope you can make it! 🤞"
        };

        toast({
          title: "RSVP Completed!",
          description: messages[response],
        });

        onComplete();
        onClose();
      } else {
        toast({
          title: "RSVP Error",
          description: result.error || "There was an issue submitting your RSVP. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('💥 RSVP error:', error);
      toast({
        title: "RSVP Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm modal-overlay transition-opacity duration-300 z-[9998]"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
        <GlassCard className="w-full max-w-md modal-content">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="w-6" /> {/* Spacer */}
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-wedding-navy transition-colors"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="text-center space-y-6">
              <Heart className="w-16 h-16 mx-auto text-glass-pink" />
              
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-wedding-navy">
                  Tim & Kirsten's Wedding
                </h2>
                <p className="text-muted-foreground">
                  October 5, 2025 • 3:00 PM
                </p>
                <p className="text-sm text-muted-foreground">
                  Ben Ean, Pokolbin
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-wedding-navy">
                  Will you be attending?
                </h3>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => handleRSVPResponse('yes')}
                    disabled={loading}
                    className="w-full h-auto py-4 glass-button-primary group"
                    variant="default"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <div className="font-medium">Yes, I'll be there!</div>
                        <div className="text-sm opacity-80">Can't wait to celebrate</div>
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={() => handleRSVPResponse('maybe')}
                    disabled={loading}
                    className="w-full h-auto py-4 glass-button-secondary group"
                    variant="outline"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <AlertCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <div className="font-medium">Maybe</div>
                        <div className="text-sm opacity-80">Still checking my schedule</div>
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={() => handleRSVPResponse('no')}
                    disabled={loading}
                    className="w-full h-auto py-4 glass-button-secondary group"
                    variant="outline"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <XCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <div className="font-medium">Can't make it</div>
                        <div className="text-sm opacity-80">Wish I could be there</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {loading && (
                <div className="text-center text-muted-foreground">
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting your RSVP...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
};

export default SimpleRSVPPopup;