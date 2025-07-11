import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useWeddingEvents } from '@/hooks/useWeddingData';
import { useAuth } from '@/hooks/useAuth';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useRSVPStatus } from '@/hooks/useRSVPStatus';
import UniversalHeader from '@/components/navigation/UniversalHeader';
import ResponsiveNavigation from '@/components/navigation/ResponsiveNavigation';
import { NAVIGATION_ROUTES } from '@/components/navigation/constants';
import DashboardPopup from '@/components/DashboardPopup';
import EnhancedHeroSection from '@/components/home/EnhancedHeroSection';
import DynamicFAQSection from '@/components/home/DynamicFAQSection';
import EventsSection from '@/components/home/EventsSection';
import DressCodeCard from '@/components/DressCodeCard';
import ContactInfo from '@/components/ContactInfo';
import SimpleRSVPPopup from '@/components/SimpleRSVPPopup';
import RSVPCallToAction from '@/components/home/RSVPCallToAction';
import DatabaseDiagnostics from '@/components/debug/DatabaseDiagnostics';
import RSVPDebugModal from '@/components/debug/RSVPDebugModal';
import { FixWeddingData } from '@/components/FixWeddingData';
import { FixSupabaseSecurity } from '@/components/FixSupabaseSecurity';

const Home: React.FC = () => {
  const { events, loading: eventsLoading } = useWeddingEvents();
  const { userRole } = useAuth();
  const { settings } = useAppSettings();
  const { needsRSVP, markRSVPComplete } = useRSVPStatus();
  const [showRSVPPopup, setShowRSVPPopup] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
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

  const handleOpenRSVP = () => {
    setShowRSVPPopup(true);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'dashboard') {
      setShowDashboard(true);
    }
  };

  const handleNotificationClick = () => {
    // TODO: Implement notification popup
    console.log('Notifications clicked');
  };

  return (
    <>
      {/* Universal Header */}
      <UniversalHeader 
        onNotificationClick={handleNotificationClick}
      />

      <div className="min-h-screen pt-20 pb-20 p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <EnhancedHeroSection />
          <EventsSection 
            isAdmin={isAdmin} 
            events={events} 
            eventsLoading={eventsLoading} 
          />
          
          {/* Dynamic FAQ Section - Admin Controlled */}
          <DynamicFAQSection />
          
          {/* RSVP Call to Action */}
          <RSVPCallToAction onRSVPClick={handleOpenRSVP} />
          
          {/* Debug Button for authenticated users */}
          {userRole && (
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
              <div className="glass-card p-4 text-center">
                <h3 className="text-lg font-semibold text-wedding-navy mb-2">
                  🔧 RSVP Debug Tool
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Having issues with RSVP submission? Use this tool to diagnose problems.
                </p>
                <Button 
                  onClick={() => setShowDebugModal(true)}
                  variant="outline"
                  className="flex items-center gap-2 mx-auto"
                >
                  <Settings className="w-4 h-4" />
                  Open Debug Tool
                </Button>
              </div>
            </div>
          )}
          
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
        <SimpleRSVPPopup
          isOpen={showRSVPPopup}
          onClose={() => setShowRSVPPopup(false)}
          onComplete={handleRSVPComplete}
        />

        {/* Dashboard Popup - Shows guest or admin based on user role */}
        <DashboardPopup
          isOpen={showDashboard}
          onClose={() => setShowDashboard(false)}
          userRole={userRole?.role || 'guest'}
        />

        {/* RSVP Debug Modal */}
        <RSVPDebugModal
          isOpen={showDebugModal}
          onClose={() => setShowDebugModal(false)}
        />
        
        {/* Debug component - remove in production */}
        {process.env.NODE_ENV === 'development' && <DatabaseDiagnostics />}
        
        {/* Fix Wedding Data Component */}
        <FixWeddingData />
        
        {/* Fix Supabase Security Issues */}
        {isAdmin && <FixSupabaseSecurity />}
      </div>

      {/* Bottom Navigation - Same for all users */}
      <ResponsiveNavigation 
        routes={NAVIGATION_ROUTES}
        activeRoute={activeTab}
        onRouteClick={handleTabChange}
      />
    </>
  );
};

export default Home;