import React from 'react';
import { Home, MapPin, Users, Image } from 'lucide-react';

interface NavigationProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const DashboardIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="relative w-6 h-6 flex items-center justify-center">
    <div className="grid grid-cols-2 gap-1 w-4 h-4">
      <div className={`w-1.5 h-1.5 rounded-sm transition-all duration-300 ${
        isActive ? 'bg-white shadow-sm' : 'bg-current'
      }`} />
      <div className={`w-1.5 h-1.5 rounded-sm transition-all duration-300 ${
        isActive ? 'bg-white shadow-sm' : 'bg-current'
      }`} />
      <div className={`w-1.5 h-1.5 rounded-sm transition-all duration-300 ${
        isActive ? 'bg-white shadow-sm' : 'bg-current'
      }`} />
      <div className={`w-1.5 h-1.5 rounded-sm transition-all duration-300 ${
        isActive ? 'bg-white shadow-sm' : 'bg-current'
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
        {/* Enhanced Glass Navigation Container with Perfect Curve */}
        <div className="absolute inset-0 glass-primary rounded-glass-xl shadow-glass-lg backdrop-blur-glass-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-glass-blue/5 via-transparent to-glass-purple/5 rounded-glass-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-glass-xl" />
        </div>
        
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
                  transition-all duration-500 ease-out relative group
                  ${isCenter ? '-mb-6' : ''}
                  ${isActive && !isCenter ? 'text-wedding-navy scale-110' : 'text-muted-foreground hover:text-wedding-navy-light'}
                  hover:scale-105 active:scale-95
                `}
              >
                {/* Enhanced Center Button with Glass Effect */}
                {isCenter && isActive && (
                  <>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-wedding-navy rounded-full shadow-glass-lg animate-scale-in" />
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-t from-wedding-navy to-wedding-navy-light rounded-full opacity-90" />
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 border border-white/20 rounded-full" />
                  </>
                )}
                
                {/* Hover Effect for Non-Center Items */}
                {!isCenter && (
                  <div className="absolute inset-0 bg-white/5 rounded-glass opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                
                {/* Icon */}
                <div className={`relative z-10 transition-all duration-300 ${
                  isActive && isCenter ? 'text-white transform scale-110' : ''
                }`}>
                  {route.icon === 'custom' ? (
                    <DashboardIcon isActive={isActive} />
                  ) : IconComponent ? (
                    <IconComponent size={24} strokeWidth={isActive ? 2 : 1.5} />
                  ) : null}
                </div>
                
                {/* Enhanced Label with Glass Background */}
                {(!isActive || !isCenter) && (
                  <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${
                    isActive ? 'opacity-100 font-semibold' : 'opacity-70 group-hover:opacity-100'
                  }`}>
                    {route.label}
                  </span>
                )}
                
                {/* Active Indicator */}
                {isActive && !isCenter && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-wedding-navy rounded-full animate-scale-in" />
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