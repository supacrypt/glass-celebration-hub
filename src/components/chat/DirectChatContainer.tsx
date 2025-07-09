import React, { useState } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatListItem from './ChatListItem';
import ChatWindow from './ChatWindow';
import { useDirectChats } from '@/hooks/useDirectChats';
import { useAuth } from '@/hooks/useAuth';

interface DirectChatContainerProps {
  selectedChatId?: string | null;
  onChatSelect?: (chatId: string) => void;
  onBackToList?: () => void;
}

const DirectChatContainer: React.FC<DirectChatContainerProps> = ({ 
  selectedChatId, 
  onChatSelect, 
  onBackToList 
}) => {
  const [internalSelectedChatId, setInternalSelectedChatId] = useState<string | null>(null);
  const { user } = useAuth();
  const {
    chats,
    loading,
    error,
    getChatDisplayName
  } = useDirectChats();

  // Use external state if provided, otherwise internal state
  const currentSelectedChatId = selectedChatId !== undefined ? selectedChatId : internalSelectedChatId;
  const handleChatSelect = onChatSelect || setInternalSelectedChatId;
  const handleBackToList = onBackToList || (() => setInternalSelectedChatId(null));

  const selectedChat = chats.find(chat => chat.id === currentSelectedChatId);

  const handleChatSelectLocal = (chatId: string) => {
    handleChatSelect(chatId);
  };

  const handleBackToListLocal = () => {
    handleBackToList();
  };

  // If a chat is selected, show the chat window
  if (currentSelectedChatId && selectedChat) {
    return (
      <ChatWindow
        chatId={currentSelectedChatId}
        chatTitle={getChatDisplayName(selectedChat)}
        onBack={handleBackToListLocal}
      />
    );
  }

  // Show chat list
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2d3f51]">Messages</h2>
              <p className="text-sm text-[#7a736b]">
                {chats.length === 0 ? 'No conversations yet' : `${chats.length} conversations`}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-white/20 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#667eea] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="bg-white/60 backdrop-blur-sm border-white/30"
            >
              Try Again
            </Button>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-[#667eea]" />
            </div>
            <h3 className="text-lg font-semibold text-[#2d3f51] mb-2">
              No conversations yet
            </h3>
            <p className="text-[#7a736b] mb-6 max-w-sm">
              Start chatting with other wedding guests by creating a new conversation
            </p>
            <Button
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#667eea]/90 hover:to-[#764ba2]/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                displayName={getChatDisplayName(chat)}
                currentUserId={user?.id}
                onClick={() => handleChatSelectLocal(chat.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectChatContainer;