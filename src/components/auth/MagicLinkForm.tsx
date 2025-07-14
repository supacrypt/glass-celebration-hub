import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { MagicLinkFormData, magicLinkSchema } from '@/lib/auth-validation';
import { Mail } from 'lucide-react';

interface MagicLinkFormProps {
  onBack: () => void;
}

export const MagicLinkForm: React.FC<MagicLinkFormProps> = ({ onBack }) => {
  const { signInWithMagicLink } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema)
  });

  const onSubmit = async (data: MagicLinkFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signInWithMagicLink(data.email);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Magic link sent!",
          description: "Check your email for a sign-in link.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-glass-blue" />
        </div>
        <h2 className="text-xl font-semibold text-wedding-navy mb-2">
          Sign in with Magic Link
        </h2>
        <p className="text-sm text-muted-foreground">
          We'll send you a secure link to sign in without a password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="glass-input"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-wedding-navy hover:bg-wedding-navy-light"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Magic Link'}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBack}
        >
          Back to Sign In
        </Button>
      </form>
    </div>
  );
};