import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="glass-card mb-6 sm:mb-8 lg:mb-10 text-center relative overflow-hidden animate-fade-up"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '40px 20px',
        boxShadow: '20px 20px 40px rgba(163, 155, 146, 0.3), -20px -20px 40px rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.4)'
      }}>
      <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-5 flex justify-center gap-2">
        💕
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-wedding-navy mb-3 sm:mb-4 tracking-tight bg-gradient-to-r from-glass-blue to-glass-purple bg-clip-text text-transparent">
        Tim & Kirsten
      </h1>
      <p className="text-base sm:text-lg lg:text-xl text-glass-blue mb-3 sm:mb-4 font-medium">
        October 5, 2025
      </p>
      <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
        Join us as we celebrate our love and commitment surrounded by family and friends
      </p>
    </div>
  );
};

export default HeroSection;