import React from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import ProfileDropdown from '../ProfileDropdown';
import NotificationBell from '../NotificationBell';

const UniversalHeader: React.FC = () => {
  const { settings } = useAppSettings();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-lg border-b border-white/10 z-[100] px-4 sm:px-6 flex items-center justify-between">
      <div className="font-dolly text-xl sm:text-2xl font-bold text-white tracking-wider">
        {settings.app_name || 'Our Wedding'}
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default UniversalHeader;
