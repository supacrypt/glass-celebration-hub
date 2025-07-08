import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { RSVPData, WeddingEvent } from './types';

interface RSVPStepOneProps {
  rsvpData: RSVPData;
  events: WeddingEvent[];
  profile: any;
  onUpdateRSVPData: (data: Partial<RSVPData>) => void;
  onNextStep: () => void;
}

export const RSVPStepOne: React.FC<RSVPStepOneProps> = ({
  rsvpData,
  events,
  profile,
  onUpdateRSVPData,
  onNextStep
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="w-12 h-12 mx-auto mb-4 text-wedding-navy" />
        <h2 className="text-xl font-semibold font-dolly mb-2">Attendance Confirmation</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="font-dolly">Event</Label>
          <Select 
            value={rsvpData.eventId} 
            onValueChange={(value) => onUpdateRSVPData({ eventId: value })}
          >
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title} - {new Date(event.event_date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-dolly">Will you be attending?</Label>
          <Select 
            value={rsvpData.status} 
            onValueChange={(value: any) => onUpdateRSVPData({ status: value })}
          >
            <SelectTrigger className="glass-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attending">Yes, I'll be there!</SelectItem>
              <SelectItem value="not_attending">Sorry, can't make it</SelectItem>
              <SelectItem value="maybe">Maybe - will confirm later</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {rsvpData.status === 'attending' && (
          <div className="space-y-2">
            <Label className="font-dolly">Number of Guests</Label>
            <Select 
              value={rsvpData.guestCount.toString()} 
              onValueChange={(value) => onUpdateRSVPData({ guestCount: parseInt(value) })}
            >
              <SelectTrigger className="glass-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Just me</SelectItem>
                <SelectItem value="2">Me + 1 guest</SelectItem>
                {profile.has_plus_one && <SelectItem value="2">Me + my plus one</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button 
        onClick={onNextStep} 
        className="w-full bg-wedding-navy hover:bg-wedding-navy-light font-dolly"
        disabled={!rsvpData.eventId}
      >
        Continue
      </Button>
    </div>
  );
};