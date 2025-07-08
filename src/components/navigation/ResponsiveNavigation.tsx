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
      className="fixed left-1/2 transform -translate-x-1/2 items-end z-50"
      style={{
        bottom: '20px',
        background: 'transparent',
        display: 'flex',
        gap: 'clamp(10px, 2.5vw, 16px)',
        width: 'max-content',
        maxWidth: 'calc(100vw - 2rem)',
        transition: 'all 0.3s ease'
      }}
    >
      {routes.map((route) => {
        const isActive = activeRoute === route.id;
        const isCenter = route.isCenter;
        
        return (
          <HapticFeedback key={route.id} type="light">
            <button
              onClick={() => onRouteClick(route.id)}
              className={`nav-item ${isCenter ? 'dashboard' : ''} ${isActive ? 'active' : ''} touch-target`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'hsl(var(--wedding-navy) / 0.7)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                padding: 'clamp(4px, 1vw, 6px) 0',
                background: 'none',
                border: 'none',
                fontFamily: 'inherit',
                minWidth: '48px',
                minHeight: '48px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'hsl(var(--wedding-navy) / 0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'hsl(var(--wedding-navy) / 0.7)';
              }}
            >
            {/* Responsive Neumorphic Icon with Glass Bubble */}
            <div 
              className="nav-icon"
              style={{
                background: isActive && isCenter 
                  ? 'linear-gradient(135deg, hsl(var(--wedding-navy)) 0%, hsl(var(--wedding-navy-light)) 100%)'
                  : 'linear-gradient(135deg, hsl(var(--wedding-navy)) 0%, hsl(var(--wedding-navy-light)) 100%)',
                width: 'clamp(40px, 9vw, 56px)',
                height: 'clamp(40px, 9vw, 56px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                top: 'clamp(-8px, -2vw, -12px)',
                marginBottom: 'clamp(-6px, -1.5vw, -10px)',
                boxShadow: `
                  0 0 clamp(20px, 5vw, 30px) hsl(var(--wedding-navy) / 0.25),
                  0 clamp(6px, 1.5vw, 10px) clamp(16px, 4vw, 24px) hsl(var(--wedding-navy) / 0.5),
                  0 clamp(3px, 0.75vw, 5px) clamp(6px, 1.5vw, 10px) hsl(var(--wedding-navy) / 0.4),
                  inset 0 -3px 6px hsl(var(--glass-black) / 0.4),
                  inset 0 3px 6px hsl(var(--glass-white) / 0.15)
                `,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                transform: isActive && isCenter ? 'scale(0.98)' : 'scale(1)'
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
                    hsl(var(--glass-white) / 0.5) 0%,
                    hsl(var(--glass-white) / 0.3) 25%,
                    hsl(var(--glass-white) / 0.15) 45%,
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
                  top: 'clamp(2px, 0.5vw, 3px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '65%',
                  height: '35%',
                  background: `linear-gradient(
                    to bottom,
                    hsl(var(--glass-white) / 0.6) 0%,
                    hsl(var(--glass-white) / 0.3) 40%,
                    hsl(var(--glass-white) / 0.1) 70%,
                    transparent 100%
                  )`,
                  borderRadius: '50% 50% 50% 50% / 100% 100% 0% 0%',
                  filter: 'blur(clamp(1px, 0.25vw, 2px))',
                  pointerEvents: 'none'
                }}
              />

              <NavigationIcon 
                route={route} 
                isActive={isActive} 
                size={window.innerWidth < 768 ? 'small' : 'medium'} 
              />
            </div>
            
            {/* Responsive Label */}
            <span 
              className="nav-label"
              style={{
                fontSize: 'clamp(11px, 2.5vw, 12px)',
                marginTop: 'clamp(3px, 1.2vw, 7px)',
                fontWeight: 'bold',
                letterSpacing: '0.3px',
                textShadow: '1px 1px 2px hsl(var(--glass-white) / 0.8)',
                color: 'hsl(0 0% 0%)',
                fontFamily: "'Playfair Display', serif"
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