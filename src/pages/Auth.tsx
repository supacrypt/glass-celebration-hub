import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Heart, Mail, Lock } from 'lucide-react';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { 
  SignUpFormData, 
  SignInFormData, 
  signUpSchema, 
  signInSchema 
} from '@/lib/auth-validation';

type AuthMode = 'signin' | 'signup' | 'magic-link' | 'forgot-password';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Sign up form
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  });

  // Sign in form  
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  });

  const onSignUpSubmit = async (data: SignUpFormData) => {
    try {
      const { error } = await signUp(data.email, data.password, data.firstName, data.lastName);
      if (error) {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const onSignInSubmit = async (data: SignInFormData) => {
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

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
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-glass-pink mr-2" />
            <h1 className="text-xl sm:text-2xl lg:wedding-heading font-semibold text-wedding-navy">
              Tim & Kirsten
            </h1>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-wedding-navy mb-2">
            {mode === 'signup' ? 'Join Our Celebration' : 'Welcome Back'}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {mode === 'signup' 
              ? 'Create an account to share in our special day' 
              : 'Sign in to access the wedding experience'
            }
          </p>
        </div>

        {mode === 'signup' ? (
          <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  className="glass-input"
                  {...signUpForm.register('firstName')}
                />
                {signUpForm.formState.errors.firstName && (
                  <p className="text-sm text-destructive">
                    {signUpForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  className="glass-input"
                  {...signUpForm.register('lastName')}
                />
                {signUpForm.formState.errors.lastName && (
                  <p className="text-sm text-destructive">
                    {signUpForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="glass-input"
                {...signUpForm.register('email')}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {signUpForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="glass-input pr-10"
                  {...signUpForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {signUpForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
              <PasswordStrengthMeter password={signUpForm.watch('password') || ''} />
            </div>

            <Button
              type="submit"
              className="w-full bg-wedding-navy hover:bg-wedding-navy-light min-h-[44px]"
              disabled={signUpForm.formState.isSubmitting}
            >
              {signUpForm.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        ) : (
          <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="glass-input pl-10"
                  placeholder="Enter your email"
                  {...signInForm.register('email')}
                />
              </div>
              {signInForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {signInForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="glass-input pl-10 pr-10"
                  placeholder="Enter your password"
                  {...signInForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {signInForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
              <button
                type="button"
                onClick={() => setMode('forgot-password')}
                className="text-sm text-glass-blue hover:text-glass-blue/80"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-wedding-navy hover:bg-wedding-navy-light min-h-[44px]"
              disabled={signInForm.formState.isSubmitting}
            >
              {signInForm.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setMode('magic-link')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Sign in with Magic Link
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
            className="text-glass-blue hover:text-glass-blue/80 transition-colors min-h-[44px] text-sm px-2 py-2"
          >
            {mode === 'signup' 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Auth;