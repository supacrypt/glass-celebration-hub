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
    <div style={{ minHeight: '100vh', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '30px',
          padding: '60px 40px',
          marginBottom: '40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '20px 20px 40px rgba(163, 155, 146, 0.3), -20px -20px 40px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.6), inset -1px -1px 3px rgba(163, 155, 146, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          animation: 'fadeIn 0.6s ease-out'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '10px'
          }}>
            💕
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#2d3f51',
            marginBottom: '15px',
            letterSpacing: '-1px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Tim & Kirsten
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#667eea',
            marginBottom: '15px',
            fontWeight: '500'
          }}>
            October 5, 2025
          </p>
          <p style={{
            fontSize: '16px',
            color: '#7a736b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Join us as we celebrate our love and commitment surrounded by family and friends
          </p>
        </div>
        {/* Countdown Section */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '30px',
          padding: '40px',
          marginBottom: '40px',
          position: 'relative' as const,
          overflow: 'hidden',
          boxShadow: '20px 20px 40px rgba(163, 155, 146, 0.3), -20px -20px 40px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.6), inset -1px -1px 3px rgba(163, 155, 146, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          textAlign: 'center' as const,
          animation: 'fadeIn 0.6s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
            <span style={{ fontSize: '28px', animation: 'rotate 3s linear infinite' }}>⏰</span>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3f51', letterSpacing: '-0.5px' }}>
              Countdown to Forever
            </h1>
          </div>
          <p style={{ fontSize: '16px', color: '#7a736b', marginBottom: '30px' }}>
            Every second brings us closer to celebrating with you!
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '20px', 
            marginBottom: '20px' 
          }}>
            <div style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
              borderRadius: '20px',
              padding: '25px 15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '8px 8px 16px rgba(163, 155, 146, 0.25), -8px -8px 16px rgba(255, 255, 255, 0.7), inset 1px 1px 2px rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#2d3f51',
                lineHeight: '1',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {timeToWedding.days}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#7a736b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '500'
              }}>
                DAYS
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
              borderRadius: '20px',
              padding: '25px 15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '8px 8px 16px rgba(163, 155, 146, 0.25), -8px -8px 16px rgba(255, 255, 255, 0.7), inset 1px 1px 2px rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#2d3f51',
                lineHeight: '1',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {timeToWedding.hours}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#7a736b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '500'
              }}>
                HOURS
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
              borderRadius: '20px',
              padding: '25px 15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '8px 8px 16px rgba(163, 155, 146, 0.25), -8px -8px 16px rgba(255, 255, 255, 0.7), inset 1px 1px 2px rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#2d3f51',
                lineHeight: '1',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {timeToWedding.minutes}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#7a736b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '500'
              }}>
                MINUTES
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
              borderRadius: '20px',
              padding: '25px 15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '8px 8px 16px rgba(163, 155, 146, 0.25), -8px -8px 16px rgba(255, 255, 255, 0.7), inset 1px 1px 2px rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#2d3f51',
                lineHeight: '1',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {timeToWedding.seconds}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#7a736b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '500'
              }}>
                SECONDS
              </div>
            </div>
          </div>
          
          <div style={{
            fontSize: '14px',
            color: '#11998e',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            position: 'relative' as const,
            display: 'inline-block'
          }}>
            <span style={{
              position: 'absolute' as const,
              left: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '8px',
              height: '8px',
              background: '#38ef7d',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></span>
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
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '20px', 
          marginBottom: '40px' 
        }}>
          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderRadius: '25px',
            padding: '30px',
            textAlign: 'center' as const,
            position: 'relative' as const,
            overflow: 'hidden',
            boxShadow: '15px 15px 30px rgba(163, 155, 146, 0.3), -15px -15px 30px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.6), inset -1px -1px 3px rgba(163, 155, 146, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.6s ease-out 0.3s backwards'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 15px',
              background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '5px 5px 10px rgba(163, 155, 146, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.7), inset 2px 2px 4px rgba(255, 255, 255, 0.6)',
              fontSize: '28px'
            }}>
              📅
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3f51', marginBottom: '8px' }}>
              When
            </h3>
            <div style={{ fontSize: '14px', color: '#7a736b', lineHeight: '1.5' }}>
              <div style={{ color: '#667eea', fontWeight: '500' }}>October 5, 2025</div>
              <div>Arrive 2:30 PM</div>
            </div>
          </div>

          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderRadius: '25px',
            padding: '30px',
            textAlign: 'center' as const,
            position: 'relative' as const,
            overflow: 'hidden',
            boxShadow: '15px 15px 30px rgba(163, 155, 146, 0.3), -15px -15px 30px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.6), inset -1px -1px 3px rgba(163, 155, 146, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.6s ease-out 0.4s backwards'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 15px',
              background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '5px 5px 10px rgba(163, 155, 146, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.7), inset 2px 2px 4px rgba(255, 255, 255, 0.6)',
              fontSize: '28px'
            }}>
              📍
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3f51', marginBottom: '8px' }}>
              Where
            </h3>
            <div style={{ fontSize: '14px', color: '#7a736b', lineHeight: '1.5' }}>
              <div style={{ color: '#667eea', fontWeight: '500' }}>Ben Ean</div>
              <div>Pokolbin, NSW</div>
            </div>
          </div>

          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderRadius: '25px',
            padding: '30px',
            textAlign: 'center' as const,
            position: 'relative' as const,
            overflow: 'hidden',
            boxShadow: '15px 15px 30px rgba(163, 155, 146, 0.3), -15px -15px 30px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.6), inset -1px -1px 3px rgba(163, 155, 146, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.6s ease-out 0.5s backwards'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 15px',
              background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '5px 5px 10px rgba(163, 155, 146, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.7), inset 2px 2px 4px rgba(255, 255, 255, 0.6)',
              fontSize: '28px'
            }}>
              👫
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3f51', marginBottom: '8px' }}>
              Who
            </h3>
            <div style={{ fontSize: '14px', color: '#7a736b', lineHeight: '1.5' }}>
              <div style={{ color: '#667eea', fontWeight: '500' }}>Family & Friends</div>
              <div>{isAdmin ? 'You have admin access' : 'You\'re invited!'}</div>
            </div>
          </div>
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