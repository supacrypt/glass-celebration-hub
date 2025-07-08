import React from 'react';
import NavigationIcon from './NavigationIcon';
import { NavigationRoute } from './types';

interface MobileNavigationProps {
  routes: NavigationRoute[];
  activeRoute: string;
  onRouteClick: (routeId: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  routes,
  activeRoute,
  onRouteClick
}) => {
  return (
    <nav 
      className="md:hidden fixed left-1/2 transform -translate-x-1/2 items-end z-50 px-2"
      style={{
        bottom: '20px',
        background: 'linear-gradient(145deg, #f5ede4, #e8e0d7)',
        borderRadius: '24px',
        padding: '3px 8px 4px 8px',
        boxShadow: `
          6px 6px 12px rgba(163, 155, 146, 0.4),
          -6px -6px 12px rgba(255, 255, 255, 0.7),
          inset 1px 1px 3px rgba(255, 255, 255, 0.6),
          inset -1px -1px 3px rgba(163, 155, 146, 0.2)
        `,
        display: 'flex',
        gap: '12px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        width: 'max-content',
        maxWidth: 'calc(100vw - 2rem)',
        transition: 'all 0.3s ease'
      }}
    >
      {routes.map((route) => {
        const isActive = activeRoute === route.id;
        const isCenter = route.isCenter;
        
        return (
          <button
            key={route.id}
            onClick={() => onRouteClick(route.id)}
            className={`nav-item ${isCenter ? 'dashboard' : ''} ${isActive ? 'active' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#7a736b',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              padding: '3px 0',
              background: 'none',
              border: 'none',
              fontFamily: 'inherit'
            }}
          >
            {/* Mobile Neumorphic Icon with Glass Bubble */}
            <div 
              className="nav-icon"
              style={{
                background: isActive && isCenter 
                  ? 'linear-gradient(135deg, #3d5f81 0%, #2e3b4a 100%)'
                  : 'linear-gradient(135deg, #2d3f51 0%, #1e2b3a 100%)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                top: '-6px',
                marginBottom: '-4px',
                boxShadow: `
                  0 0 15px rgba(45, 63, 81, 0.2),
                  0 4px 12px rgba(45, 63, 81, 0.4),
                  0 2px 4px rgba(45, 63, 81, 0.3),
                  inset 0 -1px 3px rgba(0, 0, 0, 0.3),
                  inset 0 1px 3px rgba(255, 255, 255, 0.1)
                `,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                transform: isActive && isCenter ? 'scale(0.95)' : 'scale(1)'
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
                  top: '2px',
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
                  filter: 'blur(1px)',
                  pointerEvents: 'none'
                }}
              />

              <NavigationIcon route={route} isActive={isActive} size="small" />
            </div>
            
            {/* Label */}
            <span 
              className="nav-label"
              style={{
                fontSize: '8px',
                marginTop: '4px',
                fontWeight: '500',
                letterSpacing: '0.3px',
                textShadow: '1px 1px 1px rgba(255, 255, 255, 0.8)',
                color: '#7a736b'
              }}
            >
              {route.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNavigation;