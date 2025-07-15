import React from 'react';
import { Button } from '@/components/ui/button';
import { openMessenger, startVideoCall, startAudioCall } from '@/utils/messengerUtils';
import { MessageCircle, Video, Phone } from 'lucide-react';

const MessengerTestButton: React.FC = () => {
  return (
    <div className="fixed bottom-32 right-6 z-50 flex flex-col gap-2">
      <Button
        onClick={() => openMessenger({ center: true })}
        className="bg-wedding-gold text-wedding-navy hover:bg-wedding-gold/90 shadow-lg"
        size="lg"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Open Messenger
      </Button>
      
      <Button
        onClick={() => openMessenger({ center: false, minimized: false })}
        className="bg-wedding-navy text-white hover:bg-wedding-navy/90 shadow-lg"
        size="lg"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Open Corner
      </Button>
    </div>
  );
};

export default MessengerTestButton;