
import React from 'react';
import NavigationIcon from './NavigationIcon';
import { HapticFeedback } from '@/components/mobile/HapticFeedback';
import { NavigationRoute } from './types';

interface ResponsiveNavigationProps {
  routes: NavigationRoute[];
  activeRoute: string;
  onRouteClick: (routeId: string) => void;
}

const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  routes,
  activeRoute,
  onRouteClick
}) => {
  return (
    <nav 
      className="fixed bottom-0 left-0 w-full z-50 overflow-hidden"
      style={{
        height: '72px', // 48px icon + 2×8px padding + arch overlap
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end', // icons sit on the arch
        background: 'hsl(var(--wedding-navy))',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'calc(12px + env(safe-area-inset-left, 0px))',
        paddingRight: 'calc(12px + env(safe-area-inset-right, 0px))',
        paddingTop: '8px'
      }}
    >
      {/* Rainbow arch background */}
      <div
        style={{
          content: '',
          position: 'absolute',
          top: '-48px', // raises the curve
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120%',
          height: '120px',
          background: 'hsl(var(--wedding-navy))',
          borderBottomLeftRadius: '60% 100%',
          borderBottomRightRadius: '60% 100%',
          zIndex: -1
        }}
      />
      
      {/* Glass overlay for modern effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, hsl(var(--glass-white) / 0.1) 0%, transparent 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: -1
        }}
      />

      {routes.map((route) => {
        const isActive = activeRoute === route.id;
        const isCenter = route.isCenter;
        
        return (
          <HapticFeedback key={route.id} type="light">
            <button
              onClick={() => onRouteClick(route.id)}
              className="nav-item touch-target"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                background: 'none',
                border: 'none',
                fontFamily: 'inherit',
                minWidth: '48px',
                minHeight: '48px',
                padding: '8px 4px',
                color: isActive 
                  ? 'hsl(var(--wedding-cream))' 
                  : 'hsl(var(--wedding-cream) / 0.7)'
              }}
              aria-label={route.label}
            >
              {/* Enhanced Icon Container with Glass Effect */}
              <div 
                className="nav-icon"
                style={{
                  background: isActive && isCenter 
                    ? 'linear-gradient(135deg, hsl(var(--wedding-cream)) 0%, hsl(var(--wedding-cream-dark)) 100%)'
                    : isActive 
                    ? 'linear-gradient(135deg, hsl(var(--wedding-navy-light)) 0%, hsl(var(--wedding-navy)) 100%)'
                    : 'transparent',
                  width: isCenter ? '56px' : '48px',
                  height: isCenter ? '56px' : '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  top: isCenter ? '-12px' : '0',
                  marginBottom: isCenter ? '-8px' : '0',
                  boxShadow: isActive ? `
                    0 0 20px hsl(var(--wedding-cream) / 0.3),
                    0 4px 12px hsl(var(--glass-black) / 0.2),
                    inset 0 -2px 4px hsl(var(--glass-black) / 0.1),
                    inset 0 2px 4px hsl(var(--glass-white) / 0.1)
                  ` : 'none',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isActive && isCenter ? 'scale(1.05)' : 'scale(1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'hsl(var(--wedding-navy-light) / 0.3)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {/* Glass bubble effect for active center icon */}
                {isActive && isCenter && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-25%',
                      left: '-25%',
                      width: '150%',
                      height: '150%',
                      background: `radial-gradient(
                        ellipse at 30% 25%,
                        hsl(var(--glass-white) / 0.4) 0%,
                        hsl(var(--glass-white) / 0.2) 25%,
                        hsl(var(--glass-white) / 0.1) 45%,
                        transparent 65%
                      )`,
                      borderRadius: '50%',
                      transform: 'rotate(-20deg)',
                      pointerEvents: 'none'
                    }}
                  />
                )}
                
                {/* Glass reflection highlight */}
                {isActive && (
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
                        hsl(var(--glass-white) / 0.5) 0%,
                        hsl(var(--glass-white) / 0.2) 40%,
                        hsl(var(--glass-white) / 0.05) 70%,
                        transparent 100%
                      )`,
                      borderRadius: '50% 50% 50% 50% / 100% 100% 0% 0%',
                      filter: 'blur(1px)',
                      pointerEvents: 'none'
                    }}
                  />
                )}

                <NavigationIcon 
                  route={route} 
                  isActive={isActive} 
                  size="medium"
                  style={{
                    color: isActive && isCenter 
                      ? 'hsl(var(--wedding-navy))' 
                      : 'inherit'
                  }}
                />
              </div>
              
              {/* Navigation Label */}
              <span 
                className="nav-label"
                style={{
                  fontSize: '11px',
                  marginTop: '4px',
                  fontWeight: isActive ? '600' : '500',
                  letterSpacing: '0.2px',
                  textShadow: '0 1px 2px hsl(var(--glass-black) / 0.3)',
                  color: 'inherit',
                  fontFamily: "'Playfair Display', serif",
                  opacity: isActive && isCenter ? 0.8 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {route.label}
              </span>
            </button>
          </HapticFeedback>
        );
      })}
    </nav>
  );
};

export default ResponsiveNavigation;
