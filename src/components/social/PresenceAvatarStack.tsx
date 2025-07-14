import React from 'react';
import { usePresence } from '@/hooks/usePresence';
import AnimatedTooltip from '@/ui/aceternity/animated-tooltip';

interface PresenceUser {
  user_id: string;
  name: string;
  avatar?: string;
  last_seen: string;
  status: 'online' | 'away' | 'offline';
}

interface PresenceAvatarStackProps {
  className?: string;
  maxVisible?: number;
}

// Dummy users for when presence is not yet connected
const dummyUsers: PresenceUser[] = [
  {
    user_id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
    last_seen: new Date().toISOString(),
    status: 'online'
  },
  {
    user_id: '2', 
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    last_seen: new Date().toISOString(),
    status: 'online'
  },
  {
    user_id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    last_seen: new Date().toISOString(), 
    status: 'online'
  },
  {
    user_id: '4',
    name: 'James Miller',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    last_seen: new Date().toISOString(),
    status: 'online'
  },
  {
    user_id: '5',
    name: 'Lisa Davis',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    last_seen: new Date().toISOString(),
    status: 'online'
  }
];

const PresenceAvatarStack: React.FC<PresenceAvatarStackProps> = ({ 
  className, 
  maxVisible = 5 
}) => {
  const { onlineUsers, isLoading } = usePresence();

  // Use dummy data if no real users or loading
  const usersToShow = onlineUsers.length > 0 ? onlineUsers : dummyUsers;
  const visibleUsers = usersToShow.slice(0, maxVisible);
  const remainingCount = Math.max(0, usersToShow.length - maxVisible);

  const tooltipItems = visibleUsers.map(user => ({
    id: user.user_id,
    name: user.name,
    designation: user.status === 'online' ? 'Online now' : 'Away',
    image: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
  }));

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-gray-200 animate-pulse border-2 border-white"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center -space-x-2">
        <AnimatedTooltip items={tooltipItems} />
        {remainingCount > 0 && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default PresenceAvatarStack;