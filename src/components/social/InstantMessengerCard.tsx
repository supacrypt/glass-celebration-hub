import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Upload,
  Users,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PresenceAvatarStack from './PresenceAvatarStack';
import MediaSendSheet from './MediaSendSheet';
import { 
  openChatThread, 
  startVoiceCall, 
  startVideoCall, 
  sendMedia, 
  openMessenger 
} from '@/utils/chatPlaceholders';

interface InstantMessengerCardProps {
  onChat?: (userId: string) => void;
  onVoice?: (userId: string) => void;
  onVideo?: (userId: string) => void;
  onSendMedia?: (file: File, userId: string) => void;
  className?: string;
}

const InstantMessengerCard: React.FC<InstantMessengerCardProps> = ({
  onChat = openChatThread,
  onVoice = startVoiceCall,
  onVideo = startVideoCall,
  onSendMedia = sendMedia,
  className
}) => {
  const [isMediaSheetOpen, setIsMediaSheetOpen] = useState(false);

  const handleSendMedia = (file: File) => {
    // For now, send to first available user or default
    onSendMedia(file, 'default-user');
  };

  const quickActions = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Chat',
      onClick: () => onChat('default-user'),
      color: 'bg-blue-500 hover:bg-blue-600',
      hoverScale: 1.1
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Voice',
      onClick: () => onVoice('default-user'),
      color: 'bg-green-500 hover:bg-green-600',
      hoverScale: 1.1
    },
    {
      icon: <Video className="w-5 h-5" />,
      label: 'Video',
      onClick: () => onVideo('default-user'),
      color: 'bg-purple-500 hover:bg-purple-600',
      hoverScale: 1.1
    },
    {
      icon: <Upload className="w-5 h-5" />,
      label: 'Media',
      onClick: () => setIsMediaSheetOpen(true),
      color: 'bg-orange-500 hover:bg-orange-600',
      hoverScale: 1.1
    }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-card p-6 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-wedding-navy">
                Instant Messenger
              </h3>
              <p className="text-sm text-muted-foreground">
                Connect with your wedding party
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Users className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>

        {/* Online Users */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Online now
            </span>
            <Badge variant="outline" className="text-xs">
              5 active
            </Badge>
          </div>
          <PresenceAvatarStack maxVisible={6} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: action.hoverScale }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
              className={`${action.color} text-white p-3 rounded-lg transition-colors duration-200 flex flex-col items-center space-y-1`}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Primary CTA */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={openMessenger}
            className="w-full bg-wedding-navy hover:bg-wedding-navy/90 text-white py-3 flex items-center justify-center space-x-2"
            size="lg"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Open Messenger</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Recent Activity Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Last message 2 minutes ago</span>
          </div>
        </div>
      </motion.div>

      {/* Media Send Sheet */}
      <MediaSendSheet
        isOpen={isMediaSheetOpen}
        onOpenChange={setIsMediaSheetOpen}
        onSendMedia={handleSendMedia}
      />
    </>
  );
};

export default InstantMessengerCard;