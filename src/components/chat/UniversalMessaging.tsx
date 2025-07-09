import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DirectChatContainer from './DirectChatContainer';
import GuestDirectory from './GuestDirectory';

interface UniversalMessagingProps {
  onClose: () => void;
}

const UniversalMessaging: React.FC<UniversalMessagingProps> = ({ onClose }) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('chats');

  const handleStartChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setActiveTab('chats');
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
  };

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="glass-secondary hover:glass-primary"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4 glass-secondary">
            <TabsTrigger value="chats" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Chats</span>
            </TabsTrigger>
            <TabsTrigger value="directory" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>All Guests</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="chats" className="h-full m-0">
              <DirectChatContainer 
                selectedChatId={selectedChatId}
                onChatSelect={setSelectedChatId}
                onBackToList={handleBackToList}
              />
            </TabsContent>
            
            <TabsContent value="directory" className="h-full m-0">
              <GuestDirectory onStartChat={handleStartChat} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UniversalMessaging;