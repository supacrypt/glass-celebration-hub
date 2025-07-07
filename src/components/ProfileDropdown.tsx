import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ProfileDropdownProps {
  className?: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) return profile.first_name;
    return 'Guest';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      buttonRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuAction = (action: string) => {
    setIsOpen(false);
    
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'help':
        navigate('/help');
        break;
      case 'logout':
        signOut();
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed top-5 right-5 w-11 h-11 rounded-full 
          transition-all duration-200 ease-in-out z-[1001]
          glass-button hover:scale-105 active:scale-95
          ${isOpen ? 'scale-95' : ''}
        `}
        style={{
          background: 'linear-gradient(145deg, hsl(var(--glass-white) / 0.8), hsl(var(--glass-white) / 0.6))',
          boxShadow: isOpen 
            ? `
              inset 2px 2px 5px hsl(var(--glass-black) / 0.15),
              inset -2px -2px 5px hsl(var(--glass-white) / 0.7)
            `
            : `
              8px 8px 16px hsl(var(--glass-black) / 0.12),
              -8px -8px 16px hsl(var(--glass-white) / 0.7),
              inset 1px 1px 3px hsl(var(--glass-white) / 0.6),
              inset -1px -1px 3px hsl(var(--glass-black) / 0.08)
            `
        }}
      >
        <div 
          className="w-9 h-9 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-sm"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--glass-blue-tint)) 0%, hsl(var(--glass-purple-tint)) 100%)'
          }}
        >
          {getInitials()}
        </div>
      </button>

      {/* Profile Dropdown */}
      <div
        ref={dropdownRef}
        className={`
          fixed top-20 right-5 min-w-[200px] z-[1000]
          glass-popup transition-all duration-200 ease-in-out
          ${isOpen 
            ? 'opacity-100 visible translate-y-0 scale-100' 
            : 'opacity-0 invisible -translate-y-2 scale-95'
          }
        `}
        style={{
          transformOrigin: 'top right'
        }}
      >
        {/* Arrow pointer */}
        <div 
          className="absolute -top-2 right-5 w-4 h-4 rotate-45"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--glass-white) / 0.9) 0%, hsl(var(--glass-white) / 0.7) 100%)',
            border: '1px solid hsl(var(--glass-white) / 0.3)',
            borderBottom: 'none',
            borderRight: 'none'
          }}
        />

        {/* Profile Info */}
        <div className="p-3 border-b border-hsl(var(--glass-white) / 0.2) text-center">
          <div className="font-semibold text-wedding-navy text-base mb-1">
            {getDisplayName()}
          </div>
          <div className="text-xs text-muted-foreground">
            {profile?.email || 'No email'}
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-1">
          <button
            onClick={() => handleMenuAction('profile')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm
                     hover:bg-hsl(var(--glass-white) / 0.3) rounded-xl transition-all duration-200
                     hover:translate-x-1 text-wedding-navy"
          >
            <User className="w-[18px] h-[18px] flex-shrink-0" />
            My Profile
          </button>

          <button
            onClick={() => handleMenuAction('settings')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm
                     hover:bg-hsl(var(--glass-white) / 0.3) rounded-xl transition-all duration-200
                     hover:translate-x-1 text-wedding-navy"
          >
            <Settings className="w-[18px] h-[18px] flex-shrink-0" />
            Settings
          </button>

          <button
            onClick={() => handleMenuAction('help')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm
                     hover:bg-hsl(var(--glass-white) / 0.3) rounded-xl transition-all duration-200
                     hover:translate-x-1 text-wedding-navy"
          >
            <HelpCircle className="w-[18px] h-[18px] flex-shrink-0" />
            Help & Support
          </button>

          <div className="my-1 border-t border-hsl(var(--glass-white) / 0.2)" />

          <button
            onClick={() => handleMenuAction('logout')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm
                     hover:bg-hsl(var(--glass-white) / 0.3) rounded-xl transition-all duration-200
                     hover:translate-x-1 text-red-600"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;