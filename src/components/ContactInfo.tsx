import React from 'react';
import GlassCard from '@/components/GlassCard';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
    <GlassCard className="p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-wedding-navy/10 flex items-center justify-center mx-auto mb-4">
        <MessageCircle className="w-6 h-6 text-wedding-navy" />
      </div>
      <h3 className="font-semibold text-wedding-navy mb-2">Need to Get in Touch?</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Don't hesitate to reach out to Tim & Kirsten directly if you have any questions or need clarification about the wedding details.
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
        <HelpCircle className="w-4 h-4" />
        <span>Contact through your RSVP or check the FAQ section</span>
      </div>
    </GlassCard>
  );
};

export default ContactInfo;