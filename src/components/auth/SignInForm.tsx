import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { SignInFormData, signInSchema } from '@/lib/auth-validation';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToMagicLink: () => void;
  onSwitchToForgotPassword: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ 
  onSwitchToSignUp, 
  onSwitchToMagicLink, 
  onSwitchToForgotPassword 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  });

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
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
        
        // Check if user is admin and redirect accordingly
        // Wait a moment for the auth context to update
        setTimeout(async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', user.id)
                .eq('role', 'admin')
                .maybeSingle();
              
              if (roleData) {
                toast({
                  title: "Admin Access",
                  description: "Welcome back, admin!",
                });
                navigate('/');
              } else {
                toast({
                  title: "Welcome!",
                  description: "You're now signed in as a guest.",
                });
                navigate('/');
              }
            } else {
              navigate('/');
            }
          } catch (redirectError) {
            console.error('Error checking admin role for redirect:', redirectError);
            navigate('/');
          }
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-dolly">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              className="glass-input pl-10 font-dolly"
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
          <Label htmlFor="password" className="font-dolly">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="glass-input pl-10 pr-10 font-dolly"
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
            <Label htmlFor="remember" className="text-sm font-dolly">Remember me</Label>
          </div>
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-sm text-glass-blue hover:text-glass-blue/80"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-wedding-navy hover:bg-wedding-navy-light min-h-[44px] font-dolly"
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
          className="w-full font-dolly"
          onClick={onSwitchToMagicLink}
        >
          <Mail className="w-4 h-4 mr-2" />
          Sign in with Magic Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-glass-blue hover:text-glass-blue/80 transition-colors min-h-[44px] text-sm px-2 py-2 font-dolly"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </>
  );
};