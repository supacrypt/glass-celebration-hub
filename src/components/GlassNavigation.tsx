import React from 'react';
import { Home, MapPin, Users, Image } from 'lucide-react';

interface NavigationProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const DashboardIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="relative w-6 h-6 flex items-center justify-center">
    <div className="grid grid-cols-2 gap-1 w-4 h-4 place-items-center">
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
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <div className="relative h-20">
        {/* Curved Glass Container */}
        <div className="absolute inset-0 glass-primary backdrop-blur-2xl border border-white/20 shadow-2xl"
             style={{
               clipPath: 'path("M 20 60 Q 20 20 40 20 L 130 20 Q 150 20 160 8 Q 170 -4 187.5 -4 Q 205 -4 215 8 Q 225 20 245 20 L 335 20 Q 355 20 355 60 L 355 60 Q 355 80 335 80 L 40 80 Q 20 80 20 60 Z")',
               background: 'rgba(255, 255, 255, 0.1)',
               backdropFilter: 'blur(20px)'
             }}>
          <div className="absolute inset-0 bg-gradient-to-r from-glass-blue/10 via-transparent to-glass-purple/10" />
        </div>
        
        {/* Navigation Items */}
        <div className="relative h-full flex items-center justify-around px-6">
          {routes.map((route) => {
            const isActive = activeRoute === route.id;
            const isCenter = route.isCenter;
            const IconComponent = route.icon === 'custom' ? null : route.icon;
            
            return (
              <button
                key={route.id}
                onClick={() => onNavigate(route.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                  isCenter ? 'mt-[-16px]' : 'mt-2'
                }`}
              >
                {/* Center Button Background */}
                {isCenter && (
                  <div className="absolute w-14 h-14 bg-wedding-navy rounded-full shadow-lg -top-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <DashboardIcon isActive={isActive} />
                  </div>
                )}
                
                {/* Regular Icons */}
                {!isCenter && IconComponent && (
                  <IconComponent 
                    size={24} 
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-wedding-navy' : 'text-muted-foreground'
                    }`}
                  />
                )}
                
                {/* Labels */}
                {!isCenter && (
                  <span className={`text-xs font-medium transition-colors duration-300 ${
                    isActive ? 'text-wedding-navy' : 'text-muted-foreground'
                  }`}>
                    {route.label}
                  </span>
                )}
                
                {/* Center Label */}
                {isCenter && (
                  <span className="text-xs font-medium text-muted-foreground mt-8">
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