import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Video, 
  Phone, 
  MessageSquare, 
  Bell, 
  Search,
  Settings,
  Heart,
  X
} from 'lucide-react';
import { usePresence } from '@/hooks/usePresence';
import { useAuth } from '@/hooks/useAuth';

interface SocialHeaderProps {
  className?: string;
  isPopup?: boolean;
  onClose?: () => void;
  onVideoCall?: () => void;
  onAudioCall?: () => void;
  onSearch?: () => void;
  onNotifications?: () => void;
  onSettings?: () => void;
}

const SocialHeader: React.FC<SocialHeaderProps> = ({
  className = '',
  isPopup = false,
  onClose,
  onVideoCall,
  onAudioCall,
  onSearch,
  onNotifications,
  onSettings
}) => {
  const { onlineCount, onlineUsers, isLoading } = usePresence();
  const { profile } = useAuth();

  return (
    <header 
      className={`sticky top-0 z-50 w-full ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 33, 71, 0.05), 0 1px 3px rgba(255, 215, 0, 0.1)'
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Left Section - Wedding Social Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-wedding-gold to-yellow-500 flex items-center justify-center shadow-lg">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-wedding-navy hidden sm:block">
              Wedding Social
            </h1>
          </div>
          
          {/* Online Count Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gradient-to-r from-green-100/90 to-green-50/90 backdrop-blur-sm text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200/30 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>
                {isLoading ? '...' : `${onlineCount} online`}
              </span>
            </div>
          </div>
        </div>

        {/* Center Section - Online Users Preview */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-center max-w-md">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-wedding-navy/70" />
            <span className="text-sm text-wedding-navy/70">Active now:</span>
          </div>
          <div className="flex -space-x-2 overflow-hidden">
            {onlineUsers.slice(0, 6).map((user, index) => (
              <Avatar 
                key={user.user_id} 
                className="w-8 h-8 border-2 border-white/90 relative shadow-md hover:shadow-lg transition-shadow"
                title={user.name}
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-wedding-gold to-yellow-500 text-white">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
              </Avatar>
            ))}
            {onlineCount > 6 && (
              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white rounded-full flex items-center justify-center text-xs font-medium text-gray-600 shadow-md">
                +{onlineCount - 6}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSearch}
            className="w-9 h-9 p-0 rounded-full hover:bg-white/30 backdrop-blur-sm text-wedding-navy/70 hover:text-wedding-navy transition-all"
            aria-label="Search wedding posts"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Video Call Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onVideoCall}
            className="w-9 h-9 p-0 rounded-full hover:bg-blue-50/80 backdrop-blur-sm text-blue-600 hover:text-blue-700 transition-all"
            aria-label="Start video call"
          >
            <Video className="h-4 w-4" />
          </Button>

          {/* Audio Call Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onAudioCall}
            className="w-9 h-9 p-0 rounded-full hover:bg-green-50/80 backdrop-blur-sm text-green-600 hover:text-green-700 transition-all"
            aria-label="Start audio call"
          >
            <Phone className="h-4 w-4" />
          </Button>

          {/* Messages Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-9 h-9 p-0 rounded-full hover:bg-purple-50/80 backdrop-blur-sm text-purple-600 hover:text-purple-700 relative transition-all"
            aria-label="Messages"
          >
            <MessageSquare className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 border-0 shadow-lg"
            >
              3
            </Badge>
          </Button>

          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onNotifications}
            className="w-9 h-9 p-0 rounded-full hover:bg-wedding-gold/10 backdrop-blur-sm text-wedding-gold hover:text-wedding-gold/80 relative transition-all"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-gradient-to-r from-wedding-gold to-yellow-500 border-0 shadow-lg"
            >
              2
            </Badge>
          </Button>

          {/* User Avatar & Settings */}
          <div className="flex items-center gap-2 ml-2">
            {isPopup ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-9 h-9 p-0 rounded-full hover:bg-red-50/80 backdrop-blur-sm text-red-600 hover:text-red-700 transition-all"
                aria-label="Close popup"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSettings}
                  className="w-9 h-9 p-0 rounded-full hover:bg-gray-50/80 backdrop-blur-sm text-gray-600 hover:text-gray-700 transition-all"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Avatar className="w-8 h-8 border-2 border-white/60 shadow-lg hover:shadow-xl transition-shadow">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || 'User'} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-wedding-gold to-yellow-500 text-white font-semibold">
                    {profile?.first_name ? profile.first_name[0] : 'U'}
                  </AvatarFallback>
                </Avatar>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Online Users Strip */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Active:</span>
          {onlineUsers.slice(0, 8).map((user) => (
            <div key={user.user_id} className="flex items-center gap-1 whitespace-nowrap">
              <Avatar className="w-6 h-6 border border-white relative">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-white rounded-full" />
              </Avatar>
              <span className="text-xs text-muted-foreground">{user.name.split(' ')[0]}</span>
            </div>
          ))}
          {onlineCount > 8 && (
            <span className="text-xs text-muted-foreground">+{onlineCount - 8} more</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default SocialHeader;