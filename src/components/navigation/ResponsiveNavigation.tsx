
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
      className="fixed left-1/2 transform -translate-x-1/2 items-end"
      style={{
        bottom: 'max(20px, env(safe-area-inset-bottom, 0px))', // Safe area support
        background: 'transparent', // Keep invisible
        display: 'flex',
        gap: 'clamp(12px, 3vw, 20px)', // Better spacing for icons
        width: 'auto', // Auto width to fit content
        minWidth: 'max-content',
        maxWidth: 'calc(100vw - 2rem)',
        overflowX: 'visible', // Allow icons to be fully visible
        transition: 'all 0.3s ease',
        padding: '8px 12px', // Add padding for better touch targets
        height: 'auto', // Auto height to accommodate icons
        zIndex: 9999, // Ensure it stays above all content
        
      }}
    >
      {routes.map((route) => {
        const isActive = activeRoute === route.id;
        const isCenter = route.isCenter;
        
        return (
          <HapticFeedback key={route.id} type="light">
            <button
              onClick={() => {
                console.log('ResponsiveNavigation button clicked:', route.id);
                console.log('Is center button?', isCenter);
                console.log('Route details:', route);
                onRouteClick(route.id);
              }}
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
                padding: 'clamp(6px, 1.5vw, 8px)',
                background: 'none',
                border: 'none',
                fontFamily: 'inherit',
                minWidth: '56px', // Increased for better touch target
                minHeight: '56px', // Increased for better touch target
                borderRadius: '12px', // Add border radius for better touch feel
                pointerEvents: 'all' // Re-enable pointer events for buttons
              }}
            >
            {/* Responsive Neumorphic Icon with Glass Bubble */}
            <div 
              className="nav-icon"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, hsl(210 30% 15%) 0%, hsl(210 30% 25%) 100%)';
                e.currentTarget.style.transform = isActive && isCenter ? 'scale(1.05)' : 'scale(1.05)';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.style.color = 'hsl(0 0% 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, hsl(var(--wedding-navy)) 0%, hsl(var(--wedding-navy-light)) 100%)';
                e.currentTarget.style.transform = isActive && isCenter ? 'scale(0.98)' : 'scale(1)';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.style.color = 'hsl(0 0% 95%)';
              }}
              style={{
                background: isActive && isCenter 
                  ? 'linear-gradient(135deg, hsl(var(--wedding-navy)) 0%, hsl(var(--wedding-navy-light)) 100%)'
                  : 'linear-gradient(135deg, hsl(var(--wedding-navy)) 0%, hsl(var(--wedding-navy-light)) 100%)',
                width: 'clamp(44px, 10vw, 56px)', // Better sizing for all devices
                height: 'clamp(44px, 10vw, 56px)', // Maintain aspect ratio
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                top: 'clamp(-6px, -1.5vw, -8px)',
                marginBottom: 'clamp(-4px, -1vw, -6px)',
                boxShadow: `
                  0 0 clamp(16px, 4vw, 24px) hsl(var(--wedding-navy) / 0.25),
                  0 clamp(4px, 1vw, 8px) clamp(12px, 3vw, 20px) hsl(var(--wedding-navy) / 0.5),
                  0 clamp(2px, 0.5vw, 4px) clamp(4px, 1vw, 8px) hsl(var(--wedding-navy) / 0.4),
                  inset 0 -2px 4px hsl(var(--glass-black) / 0.4),
                  inset 0 2px 4px hsl(var(--glass-white) / 0.15)
                `,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                transform: isActive && isCenter ? 'scale(0.98)' : 'scale(1)',
                cursor: 'pointer'
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
                  top: 'clamp(1px, 0.25vw, 2px)',
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
                  filter: 'blur(clamp(0.5px, 0.125vw, 1px))',
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
                fontSize: 'clamp(9px, 2.0vw, 10px)',
                marginTop: 'clamp(2px, 0.8vw, 4px)',
                fontWeight: 'bold',
                letterSpacing: '0.2px',
                textShadow: '1px 1px 2px hsl(var(--glass-white) / 0.8)',
                color: 'hsl(0 0% 0%)',
                fontFamily: "'Playfair Display', serif",
                textAlign: 'center',
                lineHeight: '1.1',
                maxWidth: isCenter ? '60px' : '54px', // Increased width for center item (Dashboard)
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
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
