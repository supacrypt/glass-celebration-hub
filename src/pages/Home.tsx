import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useWeddingEvents } from '@/hooks/useWeddingData';
import { useAuth } from '@/hooks/useAuth';

const Home: React.FC = () => {
  const { events, loading: eventsLoading } = useWeddingEvents();
  const { userRole, profile } = useAuth();
  const [timeToWedding, setTimeToWedding] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Tim & Kirsten's Wedding Date - October 5th, 2025
  const weddingDate = new Date('2025-10-05T16:00:00');
  const isAdmin = userRole?.role === 'admin' || userRole?.role === 'couple';

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance > 0) {
        setTimeToWedding({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="glass-card mb-6 sm:mb-8 lg:mb-10 text-center relative overflow-hidden animate-fade-up"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderRadius: '20px',
            padding: '40px 20px',
            boxShadow: '20px 20px 40px rgba(163, 155, 146, 0.3), -20px -20px 40px rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}>
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-5 flex justify-center gap-2">
            💕
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-wedding-navy mb-3 sm:mb-4 tracking-tight bg-gradient-to-r from-glass-blue to-glass-purple bg-clip-text text-transparent">
            Tim & Kirsten
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-glass-blue mb-3 sm:mb-4 font-medium">
            October 5, 2025
          </p>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Join us as we celebrate our love and commitment surrounded by family and friends
          </p>
        </div>
        {/* Countdown Section */}
        <div className="glass-card responsive-card-padding mb-6 sm:mb-8 lg:mb-10 text-center animate-fade-up">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
            <span className="text-xl sm:text-2xl lg:text-3xl animate-glass-float">⏰</span>
            <h1 className="responsive-heading-lg font-bold text-wedding-navy tracking-tight">
              Countdown to Forever
            </h1>
          </div>
          <p className="responsive-text-lg text-muted-foreground mb-6 sm:mb-8">
            Every second brings us closer to celebrating with you!
          </p>
          
          <div className="responsive-grid-4 force-mobile-single-col mb-6">
            {[
              { value: timeToWedding.days, label: 'DAYS' },
              { value: timeToWedding.hours, label: 'HOURS' },
              { value: timeToWedding.minutes, label: 'MINUTES' },
              { value: timeToWedding.seconds, label: 'SECONDS' }
            ].map((item, index) => (
              <div 
                key={item.label}
                className="glass-secondary responsive-card-padding-sm mobile-countdown-card text-center transition-all duration-300 hover:scale-105"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl mobile-countdown-number font-bold text-wedding-navy leading-none mb-2 bg-gradient-to-r from-glass-blue to-glass-purple bg-clip-text text-transparent">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm mobile-countdown-label text-muted-foreground uppercase tracking-wider font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
          
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-glass-green font-semibold uppercase tracking-wider">
            <div className="w-2 h-2 bg-glass-green rounded-full animate-pulse"></div>
            Live
          </div>
        </div>

        {/* Events Card */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '30px',
          padding: '30px',
          marginBottom: '40px',
          position: 'relative' as const,
          overflow: 'hidden',
          boxShadow: '20px 20px 40px rgba(163, 155, 146, 0.3), -20px -20px 40px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.6), inset -1px -1px 3px rgba(163, 155, 146, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          animation: 'fadeIn 0.6s ease-out 0.2s backwards'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
            <h2 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '22px',
              fontWeight: '600',
              color: '#2d3f51'
            }}>
              <span style={{ fontSize: '24px' }}>📅</span>
              Wedding Events
            </h2>
            {isAdmin && (
              <button style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '3px 3px 6px rgba(163, 155, 146, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 'none',
                color: '#7a736b'
              }}>
                <Settings size={16} />
              </button>
            )}
          </div>

          {/* Pre-Wedding Drinks */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '8px 8px 16px rgba(163, 155, 146, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.6), inset 1px 1px 2px rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
            position: 'relative' as const,
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3f51' }}>
                Pre-Wedding Drinks
              </h3>
              {isAdmin && (
                <div style={{ fontSize: '11px', color: '#8a8580', textAlign: 'right' as const }}>
                  Event ID: 449f062c...
                </div>
              )}
            </div>
            <div style={{ fontSize: '14px', color: '#667eea', marginBottom: '8px', fontWeight: '500' }}>
              Saturday 4 October 2025 at 04:00 pm
            </div>
            <p style={{ fontSize: '14px', color: '#5a5651', lineHeight: '1.6', marginBottom: '12px' }}>
              Tim and Kirsten will be at the Prince of Mereweather pub. Stop in to have a drink and grab yourself a meal if you are hungry.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#7a736b', marginBottom: '15px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                📍
              </div>
              <span>Prince of Mereweather Pub</span>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(230, 222, 214, 0.3) 0%, rgba(245, 237, 228, 0.3) 100%)',
              borderRadius: '12px',
              padding: '10px 15px',
              fontSize: '13px',
              color: '#5a5651',
              boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.15), inset -2px -2px 4px rgba(255, 255, 255, 0.6)'
            }}>
              Dress Code: Casual
            </div>
          </div>

          {/* Wedding Ceremony */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '8px 8px 16px rgba(163, 155, 146, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.6), inset 1px 1px 2px rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
            position: 'relative' as const,
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3f51', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#f5576c', fontSize: '16px' }}>❤️</span>
                Wedding Ceremony
              </h3>
              {isAdmin && (
                <div style={{ fontSize: '11px', color: '#8a8580', textAlign: 'right' as const }}>
                  Event ID: a7e3722b...
                </div>
              )}
            </div>
            <div style={{ fontSize: '14px', color: '#667eea', marginBottom: '8px', fontWeight: '500' }}>
              Sunday 5 October 2025 at 04:00 pm
            </div>
            <p style={{ fontSize: '14px', color: '#5a5651', lineHeight: '1.6', marginBottom: '12px' }}>
              Tim & Kirsten exchange vows on the Garden Terrace Lawn
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#7a736b', marginBottom: '15px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                📍
              </div>
              <span>Ben Ean</span>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(230, 222, 214, 0.3) 0%, rgba(245, 237, 228, 0.3) 100%)',
              borderRadius: '12px',
              padding: '10px 15px',
              fontSize: '13px',
              color: '#5a5651',
              boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.15), inset -2px -2px 4px rgba(255, 255, 255, 0.6)'
            }}>
              Dress Code: Dapper/Cocktail: Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief! Classy dress, pantsuit or jumpsuit.
            </div>
          </div>

          {/* Wedding Reception */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '8px 8px 16px rgba(163, 155, 146, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.6), inset 1px 1px 2px rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
            position: 'relative' as const,
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3f51', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#f5576c', fontSize: '16px' }}>❤️</span>
                Wedding Reception
              </h3>
              {isAdmin && (
                <div style={{ fontSize: '11px', color: '#8a8580', textAlign: 'right' as const }}>
                  Event ID: eaa5cb7a...
                </div>
              )}
            </div>
            <div style={{ fontSize: '14px', color: '#667eea', marginBottom: '8px', fontWeight: '500' }}>
              Sunday 5 October 2025 at 06:00 pm
            </div>
            <p style={{ fontSize: '14px', color: '#5a5651', lineHeight: '1.6', marginBottom: '12px' }}>
              Join us for dinner, dancing, and celebration! Reception to conclude at 12:00 AM.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#7a736b', marginBottom: '15px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                📍
              </div>
              <span>Ben Ean</span>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(230, 222, 214, 0.3) 0%, rgba(245, 237, 228, 0.3) 100%)',
              borderRadius: '12px',
              padding: '10px 15px',
              fontSize: '13px',
              color: '#5a5651',
              boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.15), inset -2px -2px 4px rgba(255, 255, 255, 0.6)'
            }}>
              Dress Code: Dapper/Cocktail: Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief! Classy dress, pantsuit or jumpsuit.
            </div>
          </div>

          {/* Recovery Beach Day */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '8px 8px 16px rgba(163, 155, 146, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.6), inset 1px 1px 2px rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
            position: 'relative' as const,
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3f51' }}>
                Recovery Beach Day
              </h3>
              {isAdmin && (
                <div style={{ fontSize: '11px', color: '#8a8580', textAlign: 'right' as const }}>
                  Event ID: 309e0df2...
                </div>
              )}
            </div>
            <div style={{ fontSize: '14px', color: '#667eea', marginBottom: '8px', fontWeight: '500' }}>
              Monday 6 October 2025 at 12:00 pm
            </div>
            <p style={{ fontSize: '14px', color: '#5a5651', lineHeight: '1.6', marginBottom: '12px' }}>
              While we do not have a formal recovery breakfast planned, we will be at Newcastle Beach from 11 am onwards. There is a kiosk that serves good coffee and excellent food. Good for soaking up the libations!
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#7a736b', marginBottom: '15px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                📍
              </div>
              <span>Newcastle Beach</span>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(230, 222, 214, 0.3) 0%, rgba(245, 237, 228, 0.3) 100%)',
              borderRadius: '12px',
              padding: '10px 15px',
              fontSize: '13px',
              color: '#5a5651',
              boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.15), inset -2px -2px 4px rgba(255, 255, 255, 0.6)'
            }}>
              Dress Code: Casual beach wear
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="responsive-grid-3 mb-6 sm:mb-8 lg:mb-10">
          {[
            {
              icon: '📅',
              title: 'When',
              primary: 'October 5, 2025',
              secondary: 'Arrive 2:30 PM'
            },
            {
              icon: '📍',
              title: 'Where',
              primary: 'Ben Ean',
              secondary: 'Pokolbin, NSW'
            },
            {
              icon: '👫',
              title: 'Who',
              primary: 'Family & Friends',
              secondary: isAdmin ? 'You have admin access' : 'You\'re invited!'
            }
          ].map((card, index) => (
            <div key={card.title} className="glass-card responsive-card-padding text-center transition-all duration-300 hover:scale-105 animate-fade-up">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 glass-secondary rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl">
                {card.icon}
              </div>
              <h3 className="responsive-text-lg font-semibold text-wedding-navy mb-2">
                {card.title}
              </h3>
              <div className="space-y-1">
                <div className="responsive-text-base text-glass-blue font-medium">
                  {card.primary}
                </div>
                <div className="responsive-text-base text-muted-foreground">
                  {card.secondary}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Welcome Section */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(240, 230, 255, 0.25) 0%, rgba(240, 230, 255, 0.15) 100%)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '30px',
          padding: '40px',
          marginBottom: '30px',
          textAlign: 'center' as const,
          position: 'relative' as const,
          overflow: 'hidden',
          boxShadow: '20px 20px 40px rgba(163, 155, 146, 0.3), -20px -20px 40px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.6), inset -1px -1px 3px rgba(163, 155, 146, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          animation: 'fadeIn 0.6s ease-out 0.6s backwards'
        }}>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#2d3f51',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px', animation: 'heartbeat 1.5s ease-in-out infinite' }}>💕</span>
            Welcome to Our Wedding
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#5a5651',
            lineHeight: '1.8',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Why spend your long weekend somewhere relaxing when you can watch two people who have been together for well over a decade tell you that they still love each other? There'll be top-shelf bevies, good tunes, and more love than you can poke a stick at!
          </p>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          padding: '20px',
          fontSize: '14px',
          color: '#7a736b',
          animation: 'fadeIn 0.6s ease-out 0.7s backwards'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>⏰</span>
            <span>Don't forget to RSVP!</span>
          </div>
          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>⚙️</span>
              <span>Admin tools available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;