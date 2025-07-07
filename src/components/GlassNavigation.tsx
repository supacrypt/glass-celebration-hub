import React, { useState } from 'react';
import DashboardPopup from './DashboardPopup';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const GlassNavigation: React.FC<NavigationProps> = ({ activeRoute, onNavigate }) => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const { userRole } = useAuth();
  const routes = [
    { id: 'home', label: 'Home' },
    { id: 'venue', label: 'Venue' },
    { id: 'dashboard', label: 'Dashboard', isCenter: true },
    { id: 'social', label: 'Social' },
    { id: 'gallery', label: 'Gallery' },
  ];

  return (
    <nav 
      className="fixed left-1/2 transform -translate-x-1/2 flex items-end z-50"
      style={{
        bottom: '30px',
        background: 'linear-gradient(145deg, #f5ede4, #e8e0d7)',
        borderRadius: '30px',
        padding: '5px 40px 6px 40px',
        boxShadow: `
          12px 12px 24px rgba(163, 155, 146, 0.4),
          -12px -12px 24px rgba(255, 255, 255, 0.7),
          inset 2px 2px 5px rgba(255, 255, 255, 0.6),
          inset -2px -2px 5px rgba(163, 155, 146, 0.2)
        `,
        gap: '55px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        width: 'max-content'
      }}
    >
      {routes.map((route) => {
        const isActive = activeRoute === route.id;
        const isCenter = route.isCenter;
        
        return (
          <button
            key={route.id}
            onClick={() => route.id === 'dashboard' ? setIsDashboardOpen(true) : onNavigate(route.id)}
            className="flex flex-col items-center text-decoration-none transition-all duration-300 cursor-pointer relative"
            style={{
              color: '#7a736b',
              padding: '4px 0',
              margin: isCenter ? '0 8px' : '0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#5a5651';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#7a736b';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(1px)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Dashboard Center Button */}
            {isCenter && (
              <div 
                className="flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, #2d3f51 0%, #1e2b3a 100%)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  top: '-10px',
                  marginBottom: '-8px',
                  boxShadow: `
                    0 0 25px rgba(45, 63, 81, 0.2),
                    0 8px 20px rgba(45, 63, 81, 0.4),
                    0 4px 8px rgba(45, 63, 81, 0.3),
                    inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                    inset 0 2px 4px rgba(255, 255, 255, 0.1)
                  `,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Glass bubble effect overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-25%',
                    left: '-25%',
                    width: '150%',
                    height: '150%',
                    background: `radial-gradient(
                      ellipse at 30% 25%,
                      rgba(255, 255, 255, 0.5) 0%,
                      rgba(255, 255, 255, 0.3) 25%,
                      rgba(255, 255, 255, 0.15) 45%,
                      transparent 65%
                    )`,
                    borderRadius: '50%',
                    transform: 'rotate(-20deg)',
                    pointerEvents: 'none'
                  }}
                />
                
                {/* Glass reflection highlight */}
                <div
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '65%',
                    height: '35%',
                    background: `linear-gradient(
                      to bottom,
                      rgba(255, 255, 255, 0.6) 0%,
                      rgba(255, 255, 255, 0.3) 40%,
                      rgba(255, 255, 255, 0.1) 70%,
                      transparent 100%
                    )`,
                    borderRadius: '50% 50% 50% 50% / 100% 100% 0% 0%',
                    filter: 'blur(2px)',
                    pointerEvents: 'none'
                  }}
                />
                
                {/* 4-dot grid - raised through the glass */}
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '8px 8px',
                    gridTemplateRows: '8px 8px',
                    gap: '4px',
                    position: 'relative',
                    zIndex: 1,
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <span 
                      key={i}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '2px',
                        display: 'block',
                        boxShadow: `
                          0 2px 3px rgba(0, 0, 0, 0.3),
                          inset 0 1px 2px rgba(255, 255, 255, 0.6)
                        `
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Home Icon */}
            {route.id === 'home' && !isCenter && (
              <div 
                className="w-6 h-6 mb-1 flex items-center justify-center" 
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(163, 155, 146, 0.3))'
                }}
              >
                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
            )}

            {/* Venue Icon */}
            {route.id === 'venue' && !isCenter && (
              <div 
                className="w-6 h-6 mb-1 flex items-center justify-center" 
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(163, 155, 146, 0.3))'
                }}
              >
                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v1h20V7L12 2zM4 18v-7h2v7H4zm5 0v-7h2v7H9zm4 0v-7h2v7h-2zm5 0v-7h2v7h-2zM3 21h18v-2H3v2z"/>
                </svg>
              </div>
            )}

            {/* Social Icon */}
            {route.id === 'social' && !isCenter && (
              <div 
                className="w-6 h-6 mb-1 flex items-center justify-center" 
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(163, 155, 146, 0.3))'
                }}
              >
                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            )}

            {/* Gallery Icon */}
            {route.id === 'gallery' && !isCenter && (
              <div 
                className="w-6 h-6 mb-1 flex items-center justify-center" 
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(163, 155, 146, 0.3))'
                }}
              >
                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}
            
            {/* Label */}
            <span 
              style={{
                fontSize: '9.5px',
                marginTop: isCenter ? '6px' : '2px',
                fontWeight: '500',
                letterSpacing: '0.3px',
                color: '#7a736b',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
              }}
            >
              {route.label}
            </span>
          </button>
        );
      })}
      
      <DashboardPopup
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        userRole={userRole?.role || 'guest'}
      />
    </nav>
  );
};

export default GlassNavigation;