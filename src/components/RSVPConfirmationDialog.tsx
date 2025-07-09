import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Calendar, Users, UtensilsCrossed, MessageSquare, Heart } from 'lucide-react';
import { RSVPFormData } from './RSVPFormValidation';

interface RSVPConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: RSVPFormData;
  loading?: boolean;
  eventTitle?: string;
  isUpdate?: boolean;
}

const RSVPConfirmationDialog: React.FC<RSVPConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  formData,
  loading = false,
  eventTitle = 'Wedding Event',
  isUpdate = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attending': return 'bg-green-100 text-green-800';
      case 'not_attending': return 'bg-red-100 text-red-800';
      case 'maybe': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'attending': return "Yes, I'll be there! 🎉";
      case 'not_attending': return "Sorry, can't make it 😔";
      case 'maybe': return "Maybe / Not sure yet 🤔";
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-wedding-navy" />
            {isUpdate ? 'Update RSVP' : 'Confirm Your RSVP'}
          </DialogTitle>
          <DialogDescription>
            Please review your RSVP details before {isUpdate ? 'updating' : 'submitting'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Event Information */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <Calendar className="w-5 h-5 text-wedding-navy" />
            <div>
              <div className="font-medium text-wedding-navy">{eventTitle}</div>
              <div className="text-sm text-muted-foreground">Wedding Event</div>
            </div>
          </div>

          <Separator />

          {/* Response Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-wedding-navy" />
              <span className="font-medium">Response</span>
            </div>
            <Badge className={getStatusColor(formData.status)}>
              {getStatusText(formData.status)}
            </Badge>
          </div>

          {/* Guest Count (if attending) */}
          {formData.status === 'attending' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-wedding-navy" />
                <span className="font-medium">Number of Guests</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formData.guestCount} guest{parseInt(formData.guestCount) !== 1 ? 's' : ''} (including yourself)
              </div>
            </div>
          )}

          {/* Dietary Requirements (if attending and specified) */}
          {formData.status === 'attending' && (formData.dietaryRequirements || formData.customDietaryRequirements?.length > 0) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-wedding-navy" />
                <span className="font-medium">Dietary Requirements</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                {formData.dietaryRequirements && (
                  <div>{formData.dietaryRequirements}</div>
                )}
                {formData.customDietaryRequirements?.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{req}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message (if provided) */}
          {formData.message?.trim() && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-wedding-navy" />
                <span className="font-medium">Your Message</span>
              </div>
              <div className="text-sm text-muted-foreground p-3 bg-secondary/30 rounded-lg italic">
                "{formData.message.trim()}"
              </div>
            </div>
          )}

          {/* Transportation info (if applicable) */}
          {formData.coachSeats && formData.coachSeats !== '0' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-center">🚌</span>
                <span className="font-medium">Transportation</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formData.coachSeats} coach seat{formData.coachSeats !== '1' ? 's' : ''} requested
                {formData.pickupLocation && ` from ${formData.pickupLocation}`}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Review Again
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {isUpdate ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                {isUpdate ? 'Update RSVP' : 'Confirm RSVP'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RSVPConfirmationDialog;