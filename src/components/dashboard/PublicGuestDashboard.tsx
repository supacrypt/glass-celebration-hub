import React from 'react';
import { Calendar, MapPin, Camera, Gift, Users, Clock, Heart, MessageSquare, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HapticFeedback } from '@/components/mobile/HapticFeedback';
import { QuickActionButton } from '@/components/mobile/QuickActionButton';
import { CollapsibleSection } from '@/components/mobile/CollapsibleSection';

interface PublicGuestDashboardProps {
  onClose: () => void;
}

const PublicGuestDashboard: React.FC<PublicGuestDashboardProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleAuth = (type: 'signin' | 'signup') => {
    onClose();
    navigate('/auth', { state: { mode: type } });
  };

  const publicActions = [
    {
      icon: MessageSquare,
      title: 'FAQ',
      description: 'Common questions',
      path: '/faq',
      color: 'glass-purple'
    },
    {
      icon: Gift,
      title: 'Gifts',
      description: 'Wedding registry',
      action: () => window.open('https://example.com/tim-kirsten-gifts', '_blank'),
      path: '',
      color: 'glass-pink'
    },
    {
      icon: MapPin,
      title: 'Transport',
      description: 'Travel & coaches',
      path: '/transport',
      color: 'glass-green'
    },
    {
      icon: MapPin,
      title: 'Accommodation',
      description: 'Places to stay',
      path: '/accommodation',
      color: 'glass-blue'
    }
  ];

  const authActions = [
    {
      icon: LogIn,
      title: 'Sign In',
      description: 'Access your RSVP',
      action: () => handleAuth('signin'),
      color: 'glass-blue'
    },
    {
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Create account',
      action: () => handleAuth('signup'),
      color: 'glass-green'
    }
  ];

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6 h-full overflow-y-auto">
      {/* Welcome Message */}
      <div className="glass-card p-4 text-center space-y-3">
        <Heart className="w-8 h-8 mx-auto text-glass-pink" />
        <h3 className="text-xl font-semibold text-wedding-navy">
          Tim & Kirsten's Wedding
        </h3>
        <p className="text-sm text-muted-foreground">
          Join us for our magical celebration of love! 💕
        </p>
        <div className="flex items-center justify-center space-x-2 text-wedding-gold">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">5 October 2025</span>
        </div>
      </div>

      {/* Quick Wedding Info */}
      <div className="responsive-grid-3 gap-3">
        <div className="glass-card responsive-card-padding-sm text-center space-y-2">
          <Clock className="w-5 h-5 mx-auto text-glass-blue" />
          <div className="text-sm font-semibold text-wedding-navy">
            3:00 PM
          </div>
          <div className="text-xs text-muted-foreground">
            Ceremony
          </div>
        </div>
        <div className="glass-card responsive-card-padding-sm text-center space-y-2">
          <MapPin className="w-5 h-5 mx-auto text-glass-green" />
          <div className="text-sm font-semibold text-wedding-navy">
            Ben Ean
          </div>
          <div className="text-xs text-muted-foreground">
            Pokolbin
          </div>
        </div>
        <div className="glass-card responsive-card-padding-sm text-center space-y-2">
          <Users className="w-5 h-5 mx-auto text-glass-purple" />
          <div className="text-sm font-semibold text-wedding-navy">
            86
          </div>
          <div className="text-xs text-muted-foreground">
            Days to go
          </div>
        </div>
      </div>

      {/* Authentication Section */}
      <CollapsibleSection 
        title="Join the Celebration" 
        icon={<Heart className="w-5 h-5" />}
        defaultOpen={true}
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Sign in to RSVP, share photos, and connect with other guests
          </p>
          <div className="grid grid-cols-2 gap-3">
            {authActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <HapticFeedback key={index} type="light">
                  <QuickActionButton
                    icon={<Icon className="w-5 h-5" />}
                    label={action.title}
                    onClick={action.action}
                    variant="primary"
                    size="medium"
                    className="w-full justify-center space-y-1 h-auto py-4"
                  />
                </HapticFeedback>
              );
            })}
          </div>
        </div>
      </CollapsibleSection>

      {/* Public Actions */}
      <CollapsibleSection 
        title="Explore" 
        icon={<Camera className="w-5 h-5" />}
        defaultOpen={true}
      >
        <div className="responsive-grid-2 gap-3">
          {publicActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <HapticFeedback key={index} type="light">
                <QuickActionButton
                  icon={<Icon className="w-5 h-5" />}
                  label={action.title}
                  onClick={() => action.action ? action.action() : handleNavigation(action.path)}
                  variant="secondary"
                  size="medium"
                  className="w-full justify-start space-y-1 h-auto py-4"
                />
              </HapticFeedback>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Wedding Timeline Preview */}
      <CollapsibleSection 
        title="Wedding Day Schedule" 
        icon={<Clock className="w-5 h-5" />}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {[
            { time: '2:30 PM', event: 'Guest Arrival', location: 'Ben Ean Entrance' },
            { time: '3:00 PM', event: 'Ceremony', location: 'Garden Terrace Lawn' },
            { time: '4:30 PM', event: 'Cocktail Hour', location: 'Garden Terrace' },
            { time: '6:00 PM', event: 'Reception', location: 'Ben Ean Reception Hall' },
            { time: '11:00 PM', event: 'Celebration End', location: 'Thank you!' },
          ].map((item, i) => (
            <HapticFeedback key={i} type="light">
              <div className="glass-card p-3 flex items-center space-x-4 hover:scale-102 transition-transform">
                <div className="w-16 text-wedding-navy font-dolly font-semibold text-sm">
                  {item.time}
                </div>
                <div className="flex-1">
                  <div className="text-wedding-navy font-dolly font-semibold text-sm">{item.event}</div>
                  <div className="text-xs text-muted-foreground">{item.location}</div>
                </div>
              </div>
            </HapticFeedback>
          ))}
        </div>
      </CollapsibleSection>

      {/* Contact Information */}
      <div className="glass-card p-4 text-center space-y-2">
        <MessageSquare className="w-5 h-5 mx-auto text-glass-purple" />
        <h4 className="text-sm font-semibold text-wedding-navy">Need Help?</h4>
        <p className="text-xs text-muted-foreground">
          Check our FAQ section or contact us through the venue
        </p>
      </div>
    </div>
  );
};

export default PublicGuestDashboard;