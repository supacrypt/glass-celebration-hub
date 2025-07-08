import React from 'react';
import { Link } from 'react-router-dom';

const Venue: React.FC = () => {
  const venues = [
    {
      id: 'ben-ean',
      title: 'Ben Ean',
      subtitle: 'Wedding Ceremony & Reception',
      date: 'October 5, 2025',
      time: '2:30 PM arrival for 3:00 PM start',
      description: 'Ceremony on Garden Terrace Lawn, followed by cocktails and reception until midnight',
      dotColor: 'dot-pink',
      path: '/venue/ben-ean'
    },
    {
      id: 'prince-pub',
      title: 'Prince of Mereweather',
      subtitle: 'Pre-Wedding Drinks',
      date: 'October 4, 2025',
      time: '4:00 PM - 8:00 PM',
      description: 'Casual drinks and dinner at the pub. Come and go as you please!',
      dotColor: 'dot-blue',
      path: '/venue/prince-of-mereweather'
    },
    {
      id: 'beach',
      title: 'Newcastle Beach',
      subtitle: 'Recovery Beach Day',
      date: 'October 6, 2025',
      time: 'From 11:00 AM onwards',
      description: 'Casual beach hangout with coffee and food from the kiosk',
      dotColor: 'dot-green',
      path: '/venue/newcastle-beach'
    }
  ];

  return (
    <div className="min-h-screen px-3 sm:px-5 pt-8 sm:pt-12 pb-6 relative">
      <div className="container max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-wedding-navy mb-2 sm:mb-3 tracking-tight">
            Venues & Locations
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-normal">
            All the places where we'll be celebrating
          </p>
        </div>

        {/* Venue Cards */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 lg:mb-10">
          {venues.map((venue, index) => (
            <Link 
              key={venue.id}
              to={venue.path}
              className="glass-card responsive-card-padding block transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-fade-up"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                animationDelay: `${0.1 + index * 0.1}s`
              }}
            >
              {/* Glass shine effect */}
              <div 
                className="shine-effect"
                style={{
                  content: '',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                  transform: 'rotate(45deg)',
                  transition: 'all 0.6s',
                  opacity: 0,
                  pointerEvents: 'none'
                }}
              />
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="flex-1 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full relative flex-shrink-0"
                      style={{
                        background: venue.dotColor === 'dot-pink' 
                          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                          : venue.dotColor === 'dot-blue'
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                      }}
                    />
                    <h3 className="responsive-heading-md font-semibold text-wedding-navy">
                      {venue.title}
                    </h3>
                  </div>
                  <p className="responsive-text-lg text-glass-blue font-medium">
                    {venue.subtitle}
                  </p>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="glass-secondary w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm sm:text-base flex-shrink-0">
                        📅
                      </div>
                      <span className="responsive-text-base text-muted-foreground">{venue.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="glass-secondary w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm sm:text-base flex-shrink-0">
                        🕐
                      </div>
                      <span className="responsive-text-base text-muted-foreground">{venue.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="glass-secondary w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 hover:translate-x-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="text-glass-blue">
                    <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              </div>
              
              <div className="glass-secondary responsive-card-padding-sm rounded-xl">
                <p className="responsive-text-base text-muted-foreground leading-relaxed">
                  {venue.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Dress Code Card */}
        <div className="glass-card responsive-card-padding mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-glass-pink to-glass-purple rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
              💗
            </div>
            <h2 className="responsive-heading-lg font-semibold text-wedding-navy tracking-tight">
              Dress Code
            </h2>
          </div>

          <div className="responsive-grid-2 mb-4 sm:mb-6">
            {[
              {
                icon: '👔',
                title: 'For Him:',
                description: 'Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief!'
              },
              {
                icon: '👗', 
                title: 'For Her:',
                description: 'Classy dress, pantsuit or jumpsuit.'
              }
            ].map((item, index) => (
              <div key={index} className="glass-secondary responsive-card-padding rounded-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <div className="glass-primary w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base flex-shrink-0">
                    {item.icon}
                  </div>
                  <h3 className="responsive-text-lg font-semibold text-wedding-navy">
                    {item.title}
                  </h3>
                </div>
                <p className="responsive-text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="glass-secondary responsive-card-padding-sm rounded-xl text-center bg-gradient-to-r from-glass-pink/10 to-glass-purple/10 border border-glass-pink/20">
            <p className="responsive-text-lg font-semibold text-glass-pink tracking-wide">
              ✨ Dapper/Cocktail Attire ✨
            </p>
          </div>
        </div>

        {/* Accommodation Card */}
        <div className="glass-card responsive-card-padding mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-glass-green to-glass-blue rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
              📍
            </div>
            <h2 className="responsive-heading-lg font-semibold text-wedding-navy tracking-tight">
              Accommodation Recommendations
            </h2>
          </div>

          {/* Newcastle Area */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#2d3f51',
              marginBottom: '12px',
              paddingBottom: '10px',
              borderBottom: '2px solid rgba(163, 155, 146, 0.2)',
              position: 'relative' as const
            }}>
              Newcastle Area
              <span style={{
                position: 'absolute' as const,
                bottom: '-2px',
                left: '0',
                width: '60px',
                height: '2px',
                background: 'linear-gradient(90deg, #667eea 0%, transparent 100%)',
                content: '""',
                display: 'block'
              }}></span>
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#7a736b',
              marginBottom: '20px',
              fontStyle: 'italic'
            }}>
              Cooks Hill and Newcastle (East/West) are the most central suburbs.
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '15px' 
            }}>
              {['Ibis Newcastle', 'Holiday Inn Newcastle', 'Kingsley Crystalbrook', 'QT Newcastle'].map((hotel, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  borderRadius: '15px',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '5px 5px 10px rgba(163, 155, 146, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <span style={{ fontSize: '14px', color: '#2d3f51', fontWeight: '500' }}>
                    {hotel}
                  </span>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
                    position: 'relative' as const
                  }}>
                    <span style={{
                      position: 'absolute' as const,
                      top: '-3px',
                      left: '-3px',
                      right: '-3px',
                      bottom: '-3px',
                      borderRadius: '50%',
                      background: 'inherit',
                      opacity: '0.3',
                      animation: 'pulse 2s infinite'
                    }}></span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hunter Valley */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#2d3f51',
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid rgba(163, 155, 146, 0.2)',
              position: 'relative' as const
            }}>
              Hunter Valley
              <span style={{
                position: 'absolute' as const,
                bottom: '-2px',
                left: '0',
                width: '60px',
                height: '2px',
                background: 'linear-gradient(90deg, #667eea 0%, transparent 100%)',
                content: '""',
                display: 'block'
              }}></span>
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '15px' 
            }}>
              {['Elfin Hill Vineyard Accommodation', 'Oaks Cypress Lakes Resort'].map((hotel, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  borderRadius: '15px',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '5px 5px 10px rgba(163, 155, 146, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <span style={{ fontSize: '14px', color: '#2d3f51', fontWeight: '500' }}>
                    {hotel}
                  </span>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
                    position: 'relative' as const
                  }}>
                    <span style={{
                      position: 'absolute' as const,
                      top: '-3px',
                      left: '-3px',
                      right: '-3px',
                      bottom: '-3px',
                      borderRadius: '50%',
                      background: 'inherit',
                      opacity: '0.3',
                      animation: 'pulse 2s infinite'
                    }}></span>
                  </span>
                </div>
              ))}
              <div style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                borderRadius: '15px',
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '5px 5px 10px rgba(163, 155, 146, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                gridColumn: 'span 2'
              }}>
                <span style={{ fontSize: '14px', color: '#2d3f51', fontWeight: '500' }}>
                  Chateau Elan
                </span>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
                  position: 'relative' as const
                }}>
                  <span style={{
                    position: 'absolute' as const,
                    top: '-3px',
                    left: '-3px',
                    right: '-3px',
                    bottom: '-3px',
                    borderRadius: '50%',
                    background: 'inherit',
                    opacity: '0.3',
                    animation: 'pulse 2s infinite'
                  }}></span>
                </span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(230, 225, 255, 0.3) 0%, rgba(230, 225, 255, 0.15) 100%)',
            borderRadius: '20px',
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'inset 3px 3px 6px rgba(102, 126, 234, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(102, 126, 234, 0.2)'
          }}>
            <span style={{ fontSize: '24px' }}>💡</span>
            <p style={{ fontSize: '14px', color: '#5a5651', lineHeight: '1.5' }}>
              <strong>Tip:</strong> For houses or apartments, check Stayz, Airbnb, or Follow
            </p>
          </div>
        </div>

        {/* Location Details Card */}
        <div className="location-card" style={{
          background: 'linear-gradient(135deg, rgba(240, 230, 255, 0.25) 0%, rgba(240, 230, 255, 0.15) 100%)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '25px',
          padding: '30px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `
            20px 20px 40px rgba(163, 155, 146, 0.3),
            -20px -20px 40px rgba(255, 255, 255, 0.8),
            inset 1px 1px 3px rgba(255, 255, 255, 0.6),
            inset -1px -1px 3px rgba(163, 155, 146, 0.15)
          `,
          border: '1px solid rgba(255, 255, 255, 0.4)',
          transition: 'all 0.3s ease',
          animation: 'fadeIn 0.6s ease-out 0.4s backwards'
        }}>
          <div className="location-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div className="location-icon" style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '5px 5px 10px rgba(240, 87, 108, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.7), inset 2px 2px 5px rgba(255, 255, 255, 0.3)'
            }}>
              📍
            </div>
            <h2 className="location-title" style={{ fontSize: '22px', fontWeight: '600', color: '#2d3f51' }}>
              Ben Ean
            </h2>
          </div>
          
          <div className="address-info" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <span className="address-line" style={{ color: '#5a5651', fontSize: '15px', lineHeight: '1.5' }}>
              119 McDonalds Rd
            </span>
            <span className="address-line" style={{ color: '#5a5651', fontSize: '15px', lineHeight: '1.5' }}>
              Pokolbin NSW 2320
            </span>
          </div>
          
          <div className="distance-info" style={{
            background: 'linear-gradient(135deg, rgba(245, 237, 228, 0.5) 0%, rgba(230, 222, 214, 0.5) 100%)',
            borderRadius: '15px',
            padding: '12px 16px',
            fontSize: '14px',
            color: '#7a736b',
            textAlign: 'center',
            marginBottom: '20px',
            boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.7)'
          }}>
            Approximately 1 hr drive from Newcastle
          </div>
          
          <a 
            href="https://www.benean.com.au/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="website-btn" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '20px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '14px',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3), 5px 5px 10px rgba(163, 155, 146, 0.2)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4), 7px 7px 14px rgba(163, 155, 146, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3), 5px 5px 10px rgba(163, 155, 146, 0.2)';
            }}
          >
            Visit Website
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </a>
        </div>
      </div>

    </div>
  );
};

export default Venue;