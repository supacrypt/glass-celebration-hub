import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, Users } from 'lucide-react';

interface ChatListItemProps {
  chat: {
    id: string;
    title: string | null;
    is_group: boolean;
    updated_at: string;
    members?: Array<{
      user_id: string;
      profiles?: {
        first_name?: string;
        last_name?: string;
        display_name?: string;
        avatar_url?: string;
      };
    }>;
    last_message?: {
      content: string | null;
      created_at: string;
      user_id: string;
    };
  };
  displayName: string;
  currentUserId?: string;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  displayName,
  currentUserId,
  onClick
}) => {
  const getLastMessagePreview = () => {
    if (!chat.last_message) return 'No messages yet';
    
    const isOwnMessage = chat.last_message.user_id === currentUserId;
    const prefix = isOwnMessage ? 'You: ' : '';
    const content = chat.last_message.content || 'Sent an attachment';
    
    return `${prefix}${content}`;
  };

  const getLastMessageTime = () => {
    if (!chat.last_message) return '';
    return formatDistanceToNow(new Date(chat.last_message.created_at), { addSuffix: true });
  };

  const getAvatarContent = () => {
    if (chat.is_group) {
      return <Users className="w-5 h-5 text-white" />;
    }

    // For direct chats, show the other person's avatar
    const otherMember = chat.members?.find(m => m.user_id !== currentUserId);
    if (otherMember?.profiles?.avatar_url) {
      return (
        <img
          src={otherMember.profiles.avatar_url}
          alt={displayName}
          className="w-full h-full rounded-full object-cover"
        />
      );
    }

    return <User className="w-5 h-5 text-white" />;
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-200 cursor-pointer group shadow-sm"
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
        {getAvatarContent()}
      </div>

      {/* Chat info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-[#2d3f51] truncate">
            {displayName}
          </h3>
          <span className="text-xs text-[#7a736b] flex-shrink-0">
            {getLastMessageTime()}
          </span>
        </div>
        
        <p className="text-sm text-[#7a736b] truncate">
          {getLastMessagePreview()}
        </p>

        {/* Participants count for group chats */}
        {chat.is_group && chat.members && (
          <p className="text-xs text-[#7a736b] mt-1">
            {chat.members.length} participants
          </p>
        )}
      </div>

      {/* Unread indicator (placeholder) */}
      <div className="w-2 h-2 bg-[#667eea] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
};

export default ChatListItem;