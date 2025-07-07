import React from 'react';
import { Home, MapPin, Users, Image } from 'lucide-react';

interface NavigationProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const DashboardIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="relative w-6 h-6 flex items-center justify-center">
    <div className="grid grid-cols-2 gap-1">
      <div className={`w-2 h-2 rounded-sm transition-colors duration-300 ${
        isActive ? 'bg-white' : 'bg-current'
      }`} />
      <div className={`w-2 h-2 rounded-sm transition-colors duration-300 ${
        isActive ? 'bg-white' : 'bg-current'
      }`} />
      <div className={`w-2 h-2 rounded-sm transition-colors duration-300 ${
        isActive ? 'bg-white' : 'bg-current'
      }`} />
      <div className={`w-2 h-2 rounded-sm transition-colors duration-300 ${
        isActive ? 'bg-white' : 'bg-current'
      }`} />
    </div>
  </div>
);

const GlassNavigation: React.FC<NavigationProps> = ({ activeRoute, onNavigate }) => {
  const routes = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'venue', icon: MapPin, label: 'Venue' },
    { id: 'dashboard', icon: 'custom', label: 'Dashboard', isCenter: true },
    { id: 'social', icon: Users, label: 'Social' },
    { id: 'gallery', icon: Image, label: 'Gallery' },
  ];

  return (
    <div className="fixed bottom-6 left-5 right-5 z-50 pointer-events-none">
      <div className="relative h-20 pointer-events-auto">
        {/* Glass Navigation Container with Custom Shape */}
        <div 
          className="absolute inset-0 glass-primary rounded-glass-xl"
          style={{
            clipPath: `path('M 24 80 L 24 44 Q 24 24 44 24 L 120 24 Q 140 24 150 16 Q 160 8 50% 8 Q calc(50% + 10px) 8 calc(50% + 20px) 16 Q calc(50% + 30px) 24 calc(100% - 120px) 24 L calc(100% - 44px) 24 Q calc(100% - 24px) 24 calc(100% - 24px) 44 L calc(100% - 24px) 80 Z')`
          }}
        />
        
        {/* Navigation Items */}
        <div className="relative h-full flex items-end justify-around px-6 pb-3">
          {routes.map((route) => {
            const isActive = activeRoute === route.id;
            const isCenter = route.isCenter;
            const IconComponent = route.icon === 'custom' ? null : route.icon;
            
            return (
              <button
                key={route.id}
                onClick={() => onNavigate(route.id)}
                className={`
                  flex flex-col items-center justify-center gap-1 h-12 flex-1 
                  transition-all duration-300 ease-out relative
                  ${isCenter ? '-mb-4' : ''}
                  ${isActive && !isCenter ? 'text-wedding-navy' : 'text-muted-foreground'}
                  hover:scale-105 active:scale-95
                `}
              >
                {/* Center Button Special Background */}
                {isCenter && isActive && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-wedding-navy rounded-full shadow-glass-lg animate-scale-in" />
                )}
                
                {/* Icon */}
                <div className={`relative z-10 transition-colors duration-300 ${
                  isActive && isCenter ? 'text-white' : ''
                }`}>
                  {route.icon === 'custom' ? (
                    <DashboardIcon isActive={isActive} />
                  ) : IconComponent ? (
                    <IconComponent size={24} strokeWidth={1.5} />
                  ) : null}
                </div>
                
                {/* Label - Hidden for active center item */}
                {(!isActive || !isCenter) && (
                  <span className="text-xs font-medium tracking-wide opacity-80">
                    {route.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GlassNavigation;