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
    <div className="min-h-screen venue-page" style={{ background: '#e6ded4', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div 
        style={{
          content: '',
          position: 'fixed',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `
            radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(240, 147, 251, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(250, 112, 154, 0.1) 0%, transparent 50%)
          `,
          animation: 'float 20s infinite ease-in-out',
          zIndex: -1
        }}
      />
      
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Page Header */}
        <div className="page-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 className="page-title" style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            color: '#2d3f51', 
            marginBottom: '10px', 
            letterSpacing: '-1px' 
          }}>
            Venues & Locations
          </h1>
          <p className="page-subtitle" style={{ 
            fontSize: '16px', 
            color: '#7a736b', 
            fontWeight: '400' 
          }}>
            All the places where we'll be celebrating
          </p>
        </div>

        {/* Venue Cards */}
        <div className="venues-container" style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '40px' }}>
          {venues.map((venue, index) => (
            <Link 
              key={venue.id}
              to={venue.path}
              className="venue-card"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                borderRadius: '25px',
                padding: '28px',
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
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                animation: `fadeIn 0.6s ease-out ${0.1 + index * 0.1}s backwards`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                e.currentTarget.style.boxShadow = `
                  25px 25px 50px rgba(163, 155, 146, 0.35),
                  -25px -25px 50px rgba(255, 255, 255, 0.85),
                  inset 1px 1px 3px rgba(255, 255, 255, 0.7),
                  inset -1px -1px 3px rgba(163, 155, 146, 0.2)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `
                  20px 20px 40px rgba(163, 155, 146, 0.3),
                  -20px -20px 40px rgba(255, 255, 255, 0.8),
                  inset 1px 1px 3px rgba(255, 255, 255, 0.6),
                  inset -1px -1px 3px rgba(163, 155, 146, 0.15)
                `;
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
              
              <div className="card-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div className="card-content" style={{ flex: 1 }}>
                  <div className="venue-name" style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: '#2d3f51', 
                    marginBottom: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px' 
                  }}>
                    <span 
                      className={`venue-dot ${venue.dotColor}`}
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        display: 'inline-block',
                        position: 'relative',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        background: venue.dotColor === 'dot-pink' 
                          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                          : venue.dotColor === 'dot-blue'
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                      }}
                    />
                    {venue.title}
                  </div>
                  <div className="event-type" style={{ 
                    fontSize: '15px', 
                    color: '#667eea', 
                    fontWeight: '500', 
                    marginBottom: '15px' 
                  }}>
                    {venue.subtitle}
                  </div>
                  
                  <div className="info-row" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    marginBottom: '12px', 
                    fontSize: '14px', 
                    color: '#5a5651' 
                  }}>
                    <div className="info-icon" style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.8)',
                      fontSize: '16px'
                    }}>
                      📅
                    </div>
                    <span>{venue.date}</span>
                  </div>
                  
                  <div className="info-row" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    marginBottom: '12px', 
                    fontSize: '14px', 
                    color: '#5a5651' 
                  }}>
                    <div className="info-icon" style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.8)',
                      fontSize: '16px'
                    }}>
                      🕐
                    </div>
                    <span>{venue.time}</span>
                  </div>
                </div>
                
                <div className="arrow-btn" style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '5px 5px 10px rgba(163, 155, 146, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#667eea">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              </div>
              
              <div className="description" style={{
                marginTop: '20px',
                padding: '15px',
                background: 'linear-gradient(135deg, rgba(230, 222, 214, 0.3) 0%, rgba(245, 237, 228, 0.3) 100%)',
                borderRadius: '15px',
                fontSize: '14px',
                color: '#5a5651',
                lineHeight: '1.6',
                boxShadow: 'inset 3px 3px 6px rgba(163, 155, 146, 0.15), inset -3px -3px 6px rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(5px)'
              }}>
                {venue.description}
              </div>
            </Link>
          ))}
        </div>

        {/* Dress Code Card */}
        <div className="glass-card" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '30px',
          padding: '30px',
          position: 'relative' as const,
          overflow: 'hidden',
          boxShadow: '20px 20px 40px rgba(163, 155, 146, 0.3), -20px -20px 40px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.6), inset -1px -1px 3px rgba(163, 155, 146, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          transition: 'all 0.3s ease',
          animation: 'fadeIn 0.6s ease-out 0.1s backwards'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '5px 5px 10px rgba(240, 87, 108, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.7), inset 2px 2px 5px rgba(255, 255, 255, 0.3)',
              position: 'relative' as const,
              overflow: 'hidden'
            }}>
              💗
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#2d3f51', letterSpacing: '-0.5px' }}>
              Dress Code
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px', 
            marginBottom: '25px' 
          }}>
            <div style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
              borderRadius: '20px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '8px 8px 16px rgba(163, 155, 146, 0.25), -8px -8px 16px rgba(255, 255, 255, 0.7), inset 1px 1px 2px rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease',
              position: 'relative' as const,
              overflow: 'hidden'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                marginBottom: '12px',
                fontWeight: '600',
                color: '#2d3f51',
                fontSize: '16px'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
                  borderRadius: '50%',
                  textAlign: 'center' as const,
                  lineHeight: '30px',
                  fontSize: '16px',
                  marginBottom: '12px',
                  boxShadow: '3px 3px 6px rgba(163, 155, 146, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.8)'
                }}>
                  👔
                </span>
                For Him:
              </div>
              <p style={{ fontSize: '14px', color: '#5a5651', lineHeight: '1.6' }}>
                Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief!
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
              borderRadius: '20px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '8px 8px 16px rgba(163, 155, 146, 0.25), -8px -8px 16px rgba(255, 255, 255, 0.7), inset 1px 1px 2px rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease',
              position: 'relative' as const,
              overflow: 'hidden'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                marginBottom: '12px',
                fontWeight: '600',
                color: '#2d3f51',
                fontSize: '16px'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  background: 'linear-gradient(145deg, #e8e0d7, #f5ede4)',
                  borderRadius: '50%',
                  textAlign: 'center' as const,
                  lineHeight: '30px',
                  fontSize: '16px',
                  marginBottom: '12px',
                  boxShadow: '3px 3px 6px rgba(163, 155, 146, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.8)'
                }}>
                  👗
                </span>
                For Her:
              </div>
              <p style={{ fontSize: '14px', color: '#5a5651', lineHeight: '1.6' }}>
                Classy dress, pantsuit or jumpsuit.
              </p>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 220, 235, 0.4) 0%, rgba(255, 220, 235, 0.2) 100%)',
            borderRadius: '20px',
            padding: '15px',
            textAlign: 'center' as const,
            fontWeight: '600',
            color: '#f5576c',
            fontSize: '16px',
            letterSpacing: '0.5px',
            boxShadow: 'inset 3px 3px 6px rgba(245, 87, 108, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(245, 87, 108, 0.2)',
            position: 'relative' as const,
            overflow: 'hidden'
          }}>
            ✨ Dapper/Cocktail Attire ✨
          </div>
        </div>

        {/* Accommodation Card */}
        <div className="glass-card" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '30px',
          padding: '30px',
          position: 'relative' as const,
          overflow: 'hidden',
          boxShadow: '20px 20px 40px rgba(163, 155, 146, 0.3), -20px -20px 40px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.6), inset -1px -1px 3px rgba(163, 155, 146, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          transition: 'all 0.3s ease',
          animation: 'fadeIn 0.6s ease-out 0.3s backwards'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '5px 5px 10px rgba(17, 153, 142, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.7), inset 2px 2px 5px rgba(255, 255, 255, 0.3)',
              position: 'relative' as const,
              overflow: 'hidden'
            }}>
              📍
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#2d3f51', letterSpacing: '-0.5px' }}>
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