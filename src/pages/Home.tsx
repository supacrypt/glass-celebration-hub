import React from 'react';
import { useWeddingEvents } from '@/hooks/useWeddingData';
import { useAuth } from '@/hooks/useAuth';
import HeroSection from '@/components/home/HeroSection';
import CountdownSection from '@/components/home/CountdownSection';
import InfoCards from '@/components/home/InfoCards';
import EventsSection from '@/components/home/EventsSection';

const Home: React.FC = () => {
  const { events, loading: eventsLoading } = useWeddingEvents();
  const { userRole } = useAuth();
  const isAdmin = userRole?.role === 'admin' || userRole?.role === 'couple';

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <HeroSection />
        <CountdownSection />
        <EventsSection 
          isAdmin={isAdmin} 
          events={events} 
          eventsLoading={eventsLoading} 
        />
        <InfoCards isAdmin={isAdmin} />
        
        {/* Welcome Section */}
        <div className="glass-card responsive-card-padding mb-6 sm:mb-8 lg:mb-10 text-center animate-fade-up">
          <div className="text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-5 animate-pulse">
            💕
          </div>
          <h2 className="responsive-heading-lg font-bold text-wedding-navy mb-3 sm:mb-4 tracking-tight">
            We Can't Wait to Celebrate With You!
          </h2>
          <p className="responsive-text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your presence is the greatest gift we could ask for. Join us for a day filled with love, 
            laughter, and unforgettable memories as we begin our new chapter together.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 mt-6 sm:mt-8 border-t border-glass-border">
          <div className="responsive-text-base text-muted-foreground mb-2 sm:mb-0">
            With love, Tim & Kirsten
          </div>
          <div className="responsive-text-base text-muted-foreground">
            October 5, 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;