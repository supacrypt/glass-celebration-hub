import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Camera, Gift, Users, Clock, Heart, MessageSquare, Bell, CheckCircle, AlertCircle, Target, UserPlus, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { HapticFeedback } from '@/components/mobile/HapticFeedback';
import { QuickActionButton } from '@/components/mobile/QuickActionButton';
import { CollapsibleSection } from '@/components/mobile/CollapsibleSection';
import { Button } from '@/components/ui/button';
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
  const { user, profile } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([
    { id: 1, name: 'Sarah M.', avatar: '👰', status: 'online', lastSeen: 'now' },
    { id: 2, name: 'Mike R.', avatar: '🤵', status: 'online', lastSeen: 'now' },
    { id: 3, name: 'Emma J.', avatar: '👩', status: 'away', lastSeen: '5 min ago' },
    { id: 4, name: 'David K.', avatar: '👨', status: 'online', lastSeen: 'now' }
  ]);
  
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'New Transport Details', message: 'Coach times updated for Newcastle pickup', time: '2 hours ago', read: false },
    { id: 2, type: 'social', title: 'Sarah posted in Social', message: 'Shared excitement about the upcoming celebration!', time: '4 hours ago', read: false },
    { id: 3, type: 'reminder', title: 'FAQ Quiz Available', message: 'Test your knowledge about the wedding details', time: '1 day ago', read: true }
  ]);
  
  const [pendingActions, setPendingActions] = useState([
    { id: 1, title: 'Complete FAQ Quiz', description: 'Learn important wedding details', icon: MessageSquare, completed: false, points: 50 },
    { id: 2, title: 'Make First Social Post', description: 'Share your excitement!', icon: Sparkles, completed: false, points: 30 },
    { id: 3, title: 'Update Plus One Details', description: 'Add your guest information', icon: UserPlus, completed: profile?.plus_one_name ? true : false, points: 20 }
  ]);
  
  // Latest reactions to user posts (new personalized feature)
  const [latestReactions, setLatestReactions] = useState([
    { id: 1, type: 'like', postSnippet: 'So excited for the wedding!', reactorName: 'Sarah M.', reactorAvatar: '👰', time: '2 hours ago' },
    { id: 2, type: 'comment', postSnippet: 'Looking forward to the celebration', reactorName: 'Mike R.', reactorAvatar: '🤵', time: '4 hours ago', comment: 'Me too! It\'s going to be amazing!' }
  ]);
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const completedActions = pendingActions.filter(a => a.completed).length;
  const totalPoints = pendingActions.filter(a => a.completed).reduce((sum, a) => sum + a.points, 0);

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  const coreActions = [
    {
      icon: Calendar,
      title: 'RSVP',
      description: 'Confirm attendance',
      path: '/rsvp',
      color: 'glass-blue',
      badge: undefined
    },
    {
      icon: MessageSquare,
      title: 'FAQ Quiz',
      description: 'Test your knowledge',
      path: '/faq',
      color: 'glass-purple',
      badge: undefined
    },
    {
      icon: MapPin,
      title: 'Transport',
      description: 'Coaches & travel',
      path: '/transport',
      color: 'glass-green',
      badge: undefined
    },
    {
      icon: MapPin,
      title: 'Accommodation',
      description: 'Places to stay',
      path: '/accommodation',
      color: 'glass-blue',
      badge: undefined
    }
  ];

  const quickStats = [
    {
      icon: Calendar,
      label: 'Days to Go',
      value: '42',
      color: 'glass-pink'
    },
    {
      icon: Bell,
      label: 'Notifications',
      value: unreadNotifications.toString(),
      color: 'glass-blue',
      highlight: unreadNotifications > 0
    },
    {
      icon: Target,
      label: 'Goals Done',
      value: `${completedActions}/${pendingActions.length}`,
      color: 'glass-purple'
    },
    {
      icon: Sparkles,
      label: 'Points',
      value: totalPoints.toString(),
      color: 'glass-green'
    }
  ];

  const handleNotificationClick = (notificationId: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };
  
  const handleActionComplete = (actionId: number) => {
    setPendingActions(prev => prev.map(a => 
      a.id === actionId ? { ...a, completed: true } : a
    ));
  };

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6 h-full overflow-y-auto">
      {/* Welcome Message with Activity Status */}
      <div className="glass-card p-3 sm:p-4 text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Heart className="w-6 h-6 text-glass-pink" />
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">{onlineUsers.filter(u => u.status === 'online').length} online</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-wedding-navy">
          Welcome Back, {profile?.first_name || 'Guest'}!
        </h3>
        <p className="text-sm text-muted-foreground">
          {unreadNotifications > 0 ? `${unreadNotifications} new updates • ${onlineUsers.filter(u => u.status === 'online').length} friends online` : `You\'re all caught up! • ${onlineUsers.filter(u => u.status === 'online').length} friends online`}
        </p>
      </div>

      {/* Activity Stats */}
      <div className="responsive-grid-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`glass-card responsive-card-padding-sm text-center space-y-2 ${stat.highlight ? 'ring-2 ring-wedding-gold/30' : ''}`}>
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

      {/* Notifications */}
      <CollapsibleSection 
        title={`Notifications ${unreadNotifications > 0 ? `(${unreadNotifications})` : ''}`}
        icon={<Bell className="w-5 h-5" />}
        defaultOpen={unreadNotifications > 0}
      >
        <div className="space-y-2">
          {notifications.slice(0, 3).map((notification) => (
            <HapticFeedback key={notification.id} type="light">
              <div 
                className={`glass-card p-3 cursor-pointer hover:scale-102 transition-transform ${
                  !notification.read ? 'ring-2 ring-wedding-gold/30' : 'opacity-70'
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'info' ? 'bg-blue-500' :
                    notification.type === 'social' ? 'bg-green-500' :
                    'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-wedding-navy text-sm">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            </HapticFeedback>
          ))}
        </div>
      </CollapsibleSection>

      {/* Pending Actions & Goals */}
      <CollapsibleSection 
        title="Your Goals"
        icon={<Target className="w-5 h-5" />}
        defaultOpen={true}
      >
        <div className="space-y-3">
          {pendingActions.map((action) => {
            const Icon = action.icon;
            return (
              <HapticFeedback key={action.id} type="light">
                <div className={`glass-card p-3 ${action.completed ? 'opacity-70' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      action.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {action.completed ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-wedding-navy text-sm">{action.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-wedding-gold font-medium">+{action.points}</span>
                          {action.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </div>
              </HapticFeedback>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Who's Online */}
      <CollapsibleSection 
        title="Who's Online"
        icon={<Users className="w-5 h-5" />}
        defaultOpen={true}
      >
        <div className="space-y-2">
          {onlineUsers.slice(0, 4).map((user) => (
            <HapticFeedback key={user.id} type="light">
              <div className="glass-card p-3 flex items-center space-x-3 hover:scale-102 transition-transform">
                <div className="relative">
                  <span className="text-lg">{user.avatar}</span>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-wedding-navy text-sm">{user.name}</span>
                    <button 
                      className="text-xs text-wedding-gold hover:text-wedding-gold/80"
                      onClick={() => handleNavigation('/social')}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground">{user.lastSeen}</span>
                </div>
              </div>
            </HapticFeedback>
          ))}
        </div>
      </CollapsibleSection>

      {/* Latest Reactions to Your Posts */}
      {latestReactions.length > 0 && (
        <CollapsibleSection 
          title="Recent Activity"
          icon={<Heart className="w-5 h-5" />}
          defaultOpen={true}
        >
          <div className="space-y-2">
            {latestReactions.map((reaction) => (
              <HapticFeedback key={reaction.id} type="light">
                <div className="glass-card p-3 cursor-pointer hover:scale-102 transition-transform"
                     onClick={() => handleNavigation('/social')}>
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{reaction.reactorAvatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-wedding-navy text-sm">{reaction.reactorName}</span>
                        <span className="text-xs text-muted-foreground">{reaction.time}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {reaction.type === 'like' ? '❤️ liked' : '💬 commented on'}: "{reaction.postSnippet}"
                      </div>
                      {reaction.comment && (
                        <div className="text-xs text-wedding-navy mt-1 italic">"{reaction.comment}"</div>
                      )}
                    </div>
                  </div>
                </div>
              </HapticFeedback>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Quick Actions */}
      <CollapsibleSection 
        title="Quick Actions" 
        icon={<Heart className="w-5 h-5" />}
        defaultOpen={true}
      >
        <div className="space-y-3">
          {/* Gift Registry - External Link */}
          <HapticFeedback type="light">
            <Button
              onClick={() => window.open('https://example.com/tim-kirsten-gifts', '_blank')}
              className="w-full glass-button-secondary h-auto py-4 justify-between"
              variant="outline"
            >
              <div className="flex items-center space-x-3">
                <Gift className="w-5 h-5 text-glass-pink" />
                <div className="text-left">
                  <div className="font-medium">Gift Registry</div>
                  <div className="text-xs text-muted-foreground">View our wishes</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </HapticFeedback>
          
          {/* Core Actions Grid */}
          <div className="responsive-grid-2 gap-3">
            {coreActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <HapticFeedback key={index} type="light">
                  <div className="relative">
                    <QuickActionButton
                      icon={<Icon className="w-5 h-5" />}
                      label={action.title}
                      onClick={() => handleNavigation(action.path)}
                      variant="secondary"
                      size="medium"
                      className="w-full justify-start space-y-1 h-auto py-4"
                    />
                    {action.badge && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-wedding-gold text-white text-xs rounded-full flex items-center justify-center">
                        {action.badge}
                      </div>
                    )}
                  </div>
                </HapticFeedback>
              );
            })}
          </div>
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