import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageBubble from './MessageBubble';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useAuth } from '@/hooks/useAuth';

interface ChatWindowProps {
  chatId: string;
  chatTitle: string;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  chatTitle,
  onBack
}) => {
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const {
    messages,
    loading,
    sending,
    sendMessage,
    getMessageSenderName
  } = useChatMessages(chatId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedFile) return;

    try {
      await sendMessage({
        content: messageText.trim() || undefined,
        file: selectedFile || undefined
      });
      setMessageText('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Group messages by sender and time proximity
  const groupedMessages = messages.reduce((acc, message, index) => {
    const prevMessage = messages[index - 1];
    const shouldGroup = prevMessage &&
      prevMessage.user_id === message.user_id &&
      new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() < 60000; // 1 minute

    acc.push({
      ...message,
      showAvatar: !shouldGroup,
      isOwn: message.user_id === user?.id
    });
    return acc;
  }, [] as Array<any>);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h3 className="font-semibold text-[#2d3f51]">{chatTitle}</h3>
            <p className="text-sm text-[#7a736b]">
              {messages.length === 0 ? 'No messages yet' : `${messages.length} messages`}
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-[#667eea] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : groupedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-[#667eea]" />
            </div>
            <p className="text-[#7a736b] text-lg font-medium">Start the conversation</p>
            <p className="text-[#7a736b] text-sm mt-1">Send your first message to begin chatting</p>
          </div>
        ) : (
          groupedMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.isOwn}
              showAvatar={message.showAvatar}
              getSenderName={getMessageSenderName}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File preview */}
      {selectedFile && (
        <div className="p-3 mx-4 bg-white/60 backdrop-blur-md rounded-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Paperclip className="w-4 h-4 text-[#667eea]" />
              <span className="text-sm text-[#2d3f51] truncate">
                {selectedFile.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeSelectedFile}
              className="p-1 hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-white/20">
        <div className="flex items-end space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*"
            className="hidden"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-white/20 flex-shrink-0"
            disabled={sending}
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={sending}
              className="bg-white/60 backdrop-blur-sm border-white/30 focus:border-[#667eea] focus:ring-[#667eea] resize-none"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={(!messageText.trim() && !selectedFile) || sending}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#667eea]/90 hover:to-[#764ba2]/90 text-white flex-shrink-0"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;