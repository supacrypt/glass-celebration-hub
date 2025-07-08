import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { SignUpFormData, signUpSchema } from '@/lib/auth-validation';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToSignIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
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

  return (
    <>
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="glass-input pr-10"
              {...signUpForm.register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {signUpForm.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {signUpForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-wedding-navy hover:bg-wedding-navy-light min-h-[44px] font-dolly"
          disabled={signUpForm.formState.isSubmitting || !signUpForm.formState.isValid}
        >
          {signUpForm.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-glass-blue hover:text-glass-blue/80 transition-colors min-h-[44px] text-sm px-2 py-2 font-dolly"
        >
          Already have an account? Sign in
        </button>
      </div>
    </>
  );
};