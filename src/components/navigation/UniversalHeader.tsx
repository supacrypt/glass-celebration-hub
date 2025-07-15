import React, { useState } from 'react';
import { Bell, User, ChevronDown, Settings, LogOut, UserCog } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSettings } from '@/hooks/useAppSettings';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '@/components/notifications/NotificationBell';

interface UniversalHeaderProps {
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
}

const UniversalHeader: React.FC<UniversalHeaderProps> = ({
  onProfileClick,
  onNotificationClick
}) => {
  const { user, userRole, profile } = useAuth();
  const { settings } = useAppSettings();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      setShowProfileDropdown(!showProfileDropdown);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setShowProfileDropdown(false);
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleEditProfile = () => {
    setShowProfileDropdown(false);
    navigate('/profile');
  };

  const handleSettings = () => {
    setShowProfileDropdown(false);
    navigate('/settings');
  };

  const getInitials = (name?: string) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'G';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getDisplayName = () => {
    return profile?.display_name || 
           profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` :
           user?.user_metadata?.full_name || 
           'Guest';
  };

  const renderAvatar = (size: 'small' | 'large' = 'small') => {
    const avatarUrl = profile?.avatar_url || profile?.profile_picture_url;
    const sizeClasses = size === 'small' ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-lg';
    
    if (avatarUrl) {
      return (
        <div className={`${sizeClasses} rounded-full relative`}>
          <img 
            src={avatarUrl} 
            alt="Profile"
            className={`${sizeClasses} rounded-full object-cover border-2 border-white/20`}
            onError={(e) => {
              // Hide the image and show the fallback initials
              const imgElement = e.target as HTMLImageElement;
              imgElement.style.display = 'none';
              const fallbackElement = imgElement.nextElementSibling as HTMLElement;
              if (fallbackElement) {
                fallbackElement.style.display = 'flex';
              }
            }}
          />
          <div 
            className={`avatar ${sizeClasses} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold absolute inset-0`}
            style={{ display: 'none' }}
          >
            {getInitials(getDisplayName())}
          </div>
        </div>
      );
    }
    
    return (
      <div className={`avatar ${sizeClasses} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold`}>
        {getInitials(getDisplayName())}
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left: Profile Button */}
        <div className="flex items-center gap-4 relative">
          <button
            onClick={handleProfileClick}
            className="profile-button flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 group"
          >
            {renderAvatar('small')}
            <span className="text-white text-sm font-medium hidden sm:block">
              {getDisplayName()}
            </span>
            <ChevronDown className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-10 overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {renderAvatar('large')}
                  <div>
                    <div className="text-white font-medium">
                      {getDisplayName()}
                    </div>
                    <div className="text-white/60 text-sm">
                      {userRole?.role || 'guest'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button 
                  onClick={handleEditProfile}
                  className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <UserCog className="w-4 h-4" />
                  Edit Profile
                </button>
                <button 
                  onClick={handleSettings}
                  className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center: Wedding Title */}
        <div className="header-center absolute left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-white text-lg sm:text-xl font-semibold font-dolly">
            {settings.app_name || 'Tim & Kirsten'}
          </h1>
          <p className="text-white/60 text-xs sm:text-sm">
            {new Date(settings.wedding_date).toLocaleDateString('en-AU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Right: Notifications */}
        <div className="flex items-center">
          <NotificationBell />
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </header>
  );
};

export default UniversalHeader;
