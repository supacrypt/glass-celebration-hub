import React from 'react';

interface AuthHeaderProps {
  mode: 'signin' | 'signup';
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ mode }) => {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <img 
          src="https://iwmfxcrzzwpmxomydmuq.storage.supabase.co/v1/object/public/home-hero//logo.png" 
          alt="Wedding Logo" 
          className="w-8 h-8 sm:w-10 sm:h-10 mr-3 object-contain"
        />
        <h1 className="text-xl sm:text-2xl lg:wedding-heading font-dolly font-semibold text-wedding-navy">
          Tim & Kirsten
        </h1>
      </div>
      <h2 className="text-lg sm:text-xl font-dolly font-semibold text-wedding-navy mb-2">
        {mode === 'signup' ? 'Join Our Wedding Celebration' : 'Welcome Back'}
      </h2>
      <p className="text-sm sm:text-base text-muted-foreground">
        {mode === 'signup' 
          ? "Create an account to share in our special day" 
          : "Sign in to access the wedding experience"
        }
      </p>
    </div>
  );
};