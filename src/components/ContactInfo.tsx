import React from 'react';
import { Phone } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';

const ContactInfo: React.FC = () => {
  const { settings } = useAppSettings();

  return (
    <div className="glass-card responsive-card-padding">
      <div className="text-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-glass-blue/20 flex items-center justify-center ring-2 ring-glass-border mx-auto mb-4">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-glass-blue" />
        </div>
        <h2 className="responsive-heading-lg font-semibold text-wedding-navy">Get in Touch</h2>
        <p className="responsive-text-base text-muted-foreground mt-2 max-w-2xl mx-auto">
          {settings.contact_message || 'For any questions leading up to the day, feel free to reach out. For day-of emergencies, please contact our coordinator.'}
        </p>
      </div>
      
      <div className="mt-6 bg-glass-secondary/50 rounded-lg p-4 max-w-sm mx-auto">
        <div className="space-y-3 text-center">
          <div className="responsive-text-base">
            <strong className="text-wedding-navy">{settings.groom_name}:</strong>
            <span className="text-muted-foreground ml-2">04XX XXX XXX</span>
          </div>
          <div className="responsive-text-base">
            <strong className="text-wedding-navy">{settings.bride_name}:</strong>
            <span className="text-muted-foreground ml-2">04XX XXX XXX</span>
          </div>
          <div className="responsive-text-base">
            <strong className="text-wedding-navy">Coordinator:</strong>
            <span className="text-muted-foreground ml-2">(Details TBC)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;