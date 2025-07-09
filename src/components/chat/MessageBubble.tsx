import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, ImageIcon, VideoIcon, FileIcon } from 'lucide-react';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string | null;
    media_url: string | null;
    media_type: string | null;
    created_at: string;
    user_id: string;
    profiles?: {
      first_name?: string;
      last_name?: string;
      display_name?: string;
      avatar_url?: string;
    };
  };
  isOwn: boolean;
  showAvatar: boolean;
  getSenderName: (message: any) => string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar,
  getSenderName
}) => {
  const renderMedia = () => {
    if (!message.media_url) return null;

    switch (message.media_type) {
      case 'image':
        return (
          <img
            src={message.media_url}
            alt="Shared image"
            className="max-w-xs rounded-lg shadow-md"
          />
        );
      case 'video':
        return (
          <video
            src={message.media_url}
            controls
            className="max-w-xs rounded-lg shadow-md"
          />
        );
      default:
        return (
          <div className="flex items-center space-x-2 p-3 bg-black/10 rounded-lg">
            <FileIcon className="w-5 h-5 text-[#2d3f51]" />
            <span className="text-sm text-[#2d3f51]">File attachment</span>
          </div>
        );
    }
  };

  return (
    <div className={`flex items-start space-x-3 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      {showAvatar && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center flex-shrink-0">
          {message.profiles?.avatar_url ? (
            <img
              src={message.profiles.avatar_url}
              alt={getSenderName(message)}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
      )}

      {/* Message bubble */}
      <div className={`max-w-[70%] ${showAvatar ? '' : 'ml-11'} ${isOwn ? 'mr-11' : ''}`}>
        {/* Sender name (only for group chats and non-own messages) */}
        {!isOwn && showAvatar && (
          <p className="text-xs text-[#7a736b] mb-1 px-3">
            {getSenderName(message)}
          </p>
        )}

        {/* Message content */}
        <div
          className={`relative p-3 rounded-2xl backdrop-blur-md ${
            isOwn
              ? 'bg-gradient-to-r from-[#667eea]/90 to-[#764ba2]/90 text-white ml-auto'
              : 'bg-white/80 text-[#2d3f51] border border-white/20'
          } shadow-lg`}
        >
          {/* Media content */}
          {message.media_url && (
            <div className="mb-2">
              {renderMedia()}
            </div>
          )}

          {/* Text content */}
          {message.content && (
            <p className="text-sm leading-relaxed break-words">
              {message.content}
            </p>
          )}

          {/* Timestamp */}
          <p
            className={`text-xs mt-1 ${
              isOwn ? 'text-white/70' : 'text-[#7a736b]'
            }`}
          >
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </p>

          {/* Message tail */}
          <div
            className={`absolute top-4 w-3 h-3 transform rotate-45 ${
              isOwn
                ? 'right-[-6px] bg-gradient-to-r from-[#667eea]/90 to-[#764ba2]/90'
                : 'left-[-6px] bg-white/80 border-l border-t border-white/20'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;