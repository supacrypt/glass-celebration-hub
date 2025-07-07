import React from 'react';

interface NavigationProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const GlassNavigation: React.FC<NavigationProps> = ({ activeRoute, onNavigate }) => {
  const routes = [
    { id: 'home', label: 'Home' },
    { id: 'venue', label: 'Venue' },
    { id: 'dashboard', label: 'Dashboard', isCenter: true },
    { id: 'social', label: 'Social' },
    { id: 'gallery', label: 'Gallery' },
  ];

  return (
    <div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-end gap-11 z-50"
      style={{
        backgroundColor: '#f8f5f0',
        borderRadius: '40px',
        padding: '8px 30px 10px 30px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.04)'
      }}
    >
      {routes.map((route) => {
        const isActive = activeRoute === route.id;
        const isCenter = route.isCenter;
        
        return (
          <button
            key={route.id}
            onClick={() => onNavigate(route.id)}
            className={`flex flex-col items-center text-decoration-none transition-all duration-300 cursor-pointer relative ${
              isCenter ? 'mx-1' : ''
            }`}
            style={{
              color: '#8a8580',
              padding: '5px 0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#5a5651';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8a8580';
            }}
          >
            {/* Dashboard Center Button */}
            {isCenter && (
              <div 
                className="flex items-center justify-center relative"
                style={{
                  backgroundColor: '#2d3f51',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  top: '-28px',
                  marginBottom: '-24px',
                  boxShadow: '0 6px 20px rgba(45, 63, 81, 0.3), 0 2px 8px rgba(45, 63, 81, 0.2)'
                }}
              >
                <div 
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: '10px 10px',
                    gridTemplateRows: '10px 10px'
                  }}
                >
                  <span className="block bg-white rounded-sm"></span>
                  <span className="block bg-white rounded-sm"></span>
                  <span className="block bg-white rounded-sm"></span>
                  <span className="block bg-white rounded-sm"></span>
                </div>
              </div>
            )}

            {/* Home Icon */}
            {route.id === 'home' && !isCenter && (
              <div className="w-6 h-6 mb-1.5 flex items-center justify-center">
                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
            )}

            {/* Venue Icon */}
            {route.id === 'venue' && !isCenter && (
              <div className="w-6 h-6 mb-1.5 flex items-center justify-center">
                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v1h20V7L12 2zM4 18v-7h2v7H4zm5 0v-7h2v7H9zm4 0v-7h2v7h-2zm5 0v-7h2v7h-2zM3 21h18v-2H3v2z"/>
                </svg>
              </div>
            )}

            {/* Social Icon */}
            {route.id === 'social' && !isCenter && (
              <div className="w-6 h-6 mb-1.5 flex items-center justify-center">
                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            )}

            {/* Gallery Icon */}
            {route.id === 'gallery' && !isCenter && (
              <div className="w-6 h-6 mb-1.5 flex items-center justify-center">
                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a1 1 0 002 2z"/>
                </svg>
              </div>
            )}
            
            {/* Label */}
            <span 
              className="text-xs font-normal"
              style={{
                marginTop: isCenter ? '10px' : '2px',
                fontWeight: '400',
                letterSpacing: '0.2px',
                fontSize: '11px',
                color: '#8a8580'
              }}
            >
              {route.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default GlassNavigation;