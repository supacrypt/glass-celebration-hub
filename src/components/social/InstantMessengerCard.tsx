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
        className={`bg-white/85 backdrop-blur-md border border-white/30 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 ${className}`}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.75) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 33, 71, 0.1), 0 2px 8px rgba(255, 215, 0, 0.1)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-wedding-gold to-yellow-500 flex items-center justify-center shadow-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-wedding-navy">
                Instant Messenger
              </h3>
              <p className="text-sm text-wedding-navy/70">
                Connect with your wedding party
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-green-100/90 to-green-50/90 text-green-700 border border-green-200/30 shadow-sm">
            <Users className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>

        {/* Online Users */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-wedding-navy">
              Online now
            </span>
            <Badge variant="outline" className="text-xs border-wedding-gold/30 text-wedding-gold">
              💍 5 active
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
            className="w-full bg-gradient-to-r from-wedding-gold to-yellow-500 hover:from-wedding-gold/90 hover:to-yellow-500/90 text-white py-3 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Open Messenger</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Recent Activity Indicator */}
        <div className="mt-4 pt-4 border-t border-wedding-gold/20">
          <div className="flex items-center space-x-2 text-sm text-wedding-navy/70">
            <div className="w-2 h-2 bg-wedding-gold rounded-full animate-pulse"></div>
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