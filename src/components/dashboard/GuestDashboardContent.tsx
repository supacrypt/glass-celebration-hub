import React from 'react';
import { Calendar, MapPin, Camera, Gift, Users, Clock, Heart, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HapticFeedback } from '@/components/mobile/HapticFeedback';
import { QuickActionButton } from '@/components/mobile/QuickActionButton';
import { CollapsibleSection } from '@/components/mobile/CollapsibleSection';
import type { AdminStats } from './types';

interface GuestDashboardContentProps {
  stats: AdminStats;
  onClose: () => void;
}

const GuestDashboardContent: React.FC<GuestDashboardContentProps> = ({ 
  stats, 
  onClose 
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  const guestActions = [
    {
      icon: Calendar,
      title: 'RSVP',
      description: 'Confirm attendance',
      path: '/rsvp',
      color: 'glass-blue'
    },
    {
      icon: Camera,
      title: 'Gallery',
      description: 'View & share photos',
      path: '/gallery',
      color: 'glass-purple'
    },
    {
      icon: Gift,
      title: 'Gifts',
      description: 'Wedding registry',
      path: '/gifts',
      color: 'glass-pink'
    },
    {
      icon: MapPin,
      title: 'Venue',
      description: 'Location details',
      path: '/venue',
      color: 'glass-green'
    },
    {
      icon: Users,
      title: 'Social',
      description: 'Connect with others',
      path: '/social',
      color: 'glass-blue'
    },
    {
      icon: MessageSquare,
      title: 'FAQ',
      description: 'Common questions',
      path: '/faq',
      color: 'glass-purple'
    }
  ];

  const quickStats = [
    {
      icon: Calendar,
      label: 'Days to Go',
      value: '42', // Would be calculated from wedding date
      color: 'glass-pink'
    },
    {
      icon: Users,
      label: 'Guests',
      value: stats.totalRSVPs.toString(),
      color: 'glass-blue'
    },
    {
      icon: Camera,
      label: 'Photos',
      value: stats.approvedPhotos.toString(),
      color: 'glass-purple'
    },
    {
      icon: Heart,
      label: 'Memories',
      value: stats.totalMessages.toString(),
      color: 'glass-green'
    }
  ];

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6 h-full overflow-y-auto">
      {/* Welcome Message */}
      <div className="glass-card p-3 sm:p-4 text-center space-y-2">
        <Heart className="w-6 h-6 mx-auto text-glass-pink" />
        <h3 className="text-lg font-semibold text-wedding-navy">
          Welcome to Our Wedding
        </h3>
        <p className="text-sm text-muted-foreground">
          We're so excited to celebrate with you!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="responsive-grid-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card responsive-card-padding-sm text-center space-y-2">
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto text-${stat.color}`} />
              <div className="text-base sm:text-lg font-semibold text-wedding-navy">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions with Haptic Feedback */}
      <CollapsibleSection 
        title="Quick Actions" 
        icon={<Heart className="w-5 h-5" />}
        defaultOpen={true}
      >
        <div className="responsive-grid-2 gap-3">
          {guestActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <HapticFeedback key={index} type="light">
                <QuickActionButton
                  icon={<Icon className="w-5 h-5" />}
                  label={action.title}
                  onClick={() => handleNavigation(action.path)}
                  variant="secondary"
                  size="medium"
                  className="w-full justify-start space-y-1 h-auto py-4"
                />
              </HapticFeedback>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Wedding Timeline Preview with Mobile Optimization */}
      <CollapsibleSection 
        title="Upcoming Events" 
        icon={<Clock className="w-5 h-5" />}
        defaultOpen={true}
      >
        <div className="space-y-3">
          {[
            { time: '3:00 PM', event: 'Ceremony', location: 'Main Chapel' },
            { time: '4:30 PM', event: 'Cocktail Hour', location: 'Garden Terrace' },
            { time: '6:00 PM', event: 'Reception', location: 'Grand Ballroom' },
          ].map((item, i) => (
            <HapticFeedback key={i} type="light">
              <div className="glass-card p-3 flex items-center space-x-4 hover:scale-102 transition-transform">
                <div className="w-16 text-wedding-navy font-dolly font-semibold text-sm">
                  {item.time}
                </div>
                <div className="flex-1">
                  <div className="text-wedding-navy font-dolly font-semibold">{item.event}</div>
                  <div className="text-xs text-muted-foreground">{item.location}</div>
                </div>
              </div>
            </HapticFeedback>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default GuestDashboardContent;