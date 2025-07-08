import React, { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { SignInForm } from '@/components/auth/SignInForm';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

type AuthMode = 'signin' | 'signup' | 'magic-link' | 'forgot-password';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');

  if (mode === 'magic-link') {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-5 py-6 sm:py-12">
        <GlassCard className="w-full max-w-md p-4 sm:p-8">
          <MagicLinkForm onBack={() => setMode('signin')} />
        </GlassCard>
      </div>
    );
  }

  if (mode === 'forgot-password') {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-5 py-6 sm:py-12">
        <GlassCard className="w-full max-w-md p-4 sm:p-8">
          <ForgotPasswordForm onBack={() => setMode('signin')} />
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-5 py-6 sm:py-12">
      <GlassCard className="w-full max-w-md p-4 sm:p-8">
        <AuthHeader mode={mode} />
        
        {mode === 'signup' ? (
          <SignUpForm onSwitchToSignIn={() => setMode('signin')} />
        ) : (
          <SignInForm 
            onSwitchToSignUp={() => setMode('signup')}
            onSwitchToMagicLink={() => setMode('magic-link')}
            onSwitchToForgotPassword={() => setMode('forgot-password')}
          />
        )}
      </GlassCard>
    </div>
  );
};

export default Auth;