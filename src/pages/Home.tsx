import React, { useState, useEffect } from 'react';
import { useWeddingEvents } from '@/hooks/useWeddingData';
import { useAuth } from '@/hooks/useAuth';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useRSVPStatus } from '@/hooks/useRSVPStatus';
import EnhancedHeroSection from '@/components/home/EnhancedHeroSection';

import DynamicFAQSection from '@/components/home/DynamicFAQSection';
import EventsSection from '@/components/home/EventsSection';
import DressCodeCard from '@/components/DressCodeCard';
import ContactInfo from '@/components/ContactInfo';
import RSVPPopup from '@/components/RSVPPopup';
import DatabaseDiagnostics from '@/components/debug/DatabaseDiagnostics';

const Home: React.FC = () => {
  const { events, loading: eventsLoading } = useWeddingEvents();
  const { userRole } = useAuth();
  const { settings } = useAppSettings();
  const { needsRSVP, markRSVPComplete } = useRSVPStatus();
  const [showRSVPPopup, setShowRSVPPopup] = useState(false);
  const isAdmin = userRole?.role === 'admin' || userRole?.role === 'couple';

  // Show RSVP popup after a short delay for guests who need to RSVP
  useEffect(() => {
    if (needsRSVP && !isAdmin) {
      const timer = setTimeout(() => {
        setShowRSVPPopup(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [needsRSVP, isAdmin]);

  const handleRSVPComplete = () => {
    markRSVPComplete();
    setShowRSVPPopup(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <EnhancedHeroSection />
        <EventsSection 
          isAdmin={isAdmin} 
          events={events} 
          eventsLoading={eventsLoading} 
        />
        
        
        {/* Dynamic FAQ Section - Admin Controlled */}
        <DynamicFAQSection />
        
        {/* Dress Code */}
        <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
          <DressCodeCard />
        </div>

        {/* Contact Info */}
        <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
          <ContactInfo />
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 mt-6 sm:mt-8 border-t border-glass-border">
          <div className="responsive-text-base text-muted-foreground mb-2 sm:mb-0">
            {settings.footer_message}
          </div>
          <div className="responsive-text-base text-muted-foreground">
            {new Date(settings.wedding_date).toLocaleDateString('en-AU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* RSVP Popup for guests who haven't RSVP'd */}
      <RSVPPopup
        isOpen={showRSVPPopup}
        onClose={() => setShowRSVPPopup(false)}
        onComplete={handleRSVPComplete}
      />
      
      {/* Debug component - remove in production */}
      {process.env.NODE_ENV === 'development' && <DatabaseDiagnostics />}
    </div>
  );
};

export default Home;