import React from 'react';
import { useWeddingEvents } from '@/hooks/useWeddingData';
import { useAuth } from '@/hooks/useAuth';
import { useAppSettings } from '@/hooks/useAppSettings';
import EnhancedHeroSection from '@/components/home/EnhancedHeroSection';
import DynamicCountdownSection from '@/components/home/DynamicCountdownSection';

import EventsSection from '@/components/home/EventsSection';
import DressCodeCard from '@/components/DressCodeCard';
import ContactInfo from '@/components/ContactInfo';

const Home: React.FC = () => {
  const { events, loading: eventsLoading } = useWeddingEvents();
  const { userRole } = useAuth();
  const { settings } = useAppSettings();
  const isAdmin = userRole?.role === 'admin' || userRole?.role === 'couple';

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <EnhancedHeroSection />
        <DynamicCountdownSection />
        <EventsSection 
          isAdmin={isAdmin} 
          events={events} 
          eventsLoading={eventsLoading} 
        />
        
        
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
          <a href="/accommodation" className="glass-card p-4 text-center hover:scale-105 transition-transform duration-200">
            <div className="text-2xl mb-2">🏨</div>
            <span className="text-sm font-medium text-wedding-navy">Stay</span>
          </a>
          <a href="/transport" className="glass-card p-4 text-center hover:scale-105 transition-transform duration-200">
            <div className="text-2xl mb-2">🚌</div>
            <span className="text-sm font-medium text-wedding-navy">Transport</span>
          </a>
          <a href={settings.external_gift_registry_url} target="_blank" rel="noopener noreferrer" className="glass-card p-4 text-center hover:scale-105 transition-transform duration-200">
            <div className="text-2xl mb-2">🎁</div>
            <span className="text-sm font-medium text-wedding-navy">Gifts</span>
          </a>
          <a href="/faq" className="glass-card p-4 text-center hover:scale-105 transition-transform duration-200">
            <div className="text-2xl mb-2">❓</div>
            <span className="text-sm font-medium text-wedding-navy">FAQ</span>
          </a>
        </div>
        
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
    </div>
  );
};

export default Home;