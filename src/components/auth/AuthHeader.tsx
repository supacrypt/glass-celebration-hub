import React from 'react';

interface AuthHeaderProps {
  mode: 'signin' | 'signup';
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ mode }) => {
  return (
    <div className="text-center mb-6 sm:mb-8">
      {/* Logo positioned above heading */}
      <div className="flex justify-center mb-4">
        <img 
          src="https://iwmfxcrzzwpmxomydmuq.storage.supabase.co/v1/object/public/home-hero//logo.png" 
          alt="Wedding Logo" 
          className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
        />
      </div>
      
      {/* Main couple heading */}
      <h1 className="text-2xl sm:text-3xl lg:wedding-heading font-dolly font-bold text-wedding-navy mb-4">
        Tim & Kirsten
      </h1>
      
      {/* Welcome text */}
      <h2 className="text-lg sm:text-xl font-dolly font-semibold text-wedding-navy mb-2">
        Welcome Back To Tim & Kirsten's Wedding Day
      </h2>
      <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
        Sign in to interact with Tim, Kirsten, and their guests.
      </p>
    </div>
  );
};