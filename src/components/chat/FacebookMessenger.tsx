import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Smile, Plus, Search, Phone, Video, Info, X, MoreHorizontal, Paperclip, Camera, Minimize2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HapticFeedback } from '@/components/mobile/HapticFeedback';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'emoji';
  reactions?: { emoji: string; userId: string }[];
}

interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
}

interface FacebookMessengerProps {
  isMinimized?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
  className?: string;
  isMobile?: boolean;
}

const FacebookMessenger: React.FC<FacebookMessengerProps> = ({ 
  isMinimized = false, 
  onMinimize, 
  onClose,
  className = "",
  isMobile = false
}) => {
  const [isMobileView, setIsMobileView] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768 || isMobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);
  const { user, profile } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - in real implementation, this would come from hooks
  const [onlineUsers] = useState<User[]>([
    { id: '1', name: 'Sarah M.', avatar: '👰', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'Mike R.', avatar: '🤵', status: 'online', lastSeen: 'now' },
    { id: '3', name: 'Emma J.', avatar: '👩', status: 'away', lastSeen: '5 min ago' },
    { id: '4', name: 'David K.', avatar: '👨', status: 'online', lastSeen: 'now' },
    { id: '5', name: 'Lisa C.', avatar: '👩‍🦰', status: 'offline', lastSeen: '2 hours ago' },
    { id: '6', name: 'Tom B.', avatar: '👨‍🦲', status: 'online', lastSeen: 'now' }
  ]);

  const [chats] = useState<Chat[]>([
    {
      id: '1',
      participants: [onlineUsers[0], onlineUsers[1]],
      lastMessage: {
        id: '1',
        senderId: '1',
        content: 'So excited for the wedding! 🎉',
        timestamp: new Date(Date.now() - 300000),
        type: 'text'
      },
      unreadCount: 2,
      isActive: false
    },
    {
      id: '2',
      participants: [onlineUsers[2]],
      lastMessage: {
        id: '2',
        senderId: '3',
        content: 'What time should we arrive?',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text'
      },
      unreadCount: 0,
      isActive: true
    }
  ]);

  const [chatMessages] = useState<{ [chatId: string]: Message[] }>({
    '1': [
      {
        id: '1',
        senderId: '1',
        content: 'Hey! Are you excited for Tim & Kirsten\'s wedding?',
        timestamp: new Date(Date.now() - 600000),
        type: 'text'
      },
      {
        id: '2',
        senderId: user?.id || 'current',
        content: 'Absolutely! I can\'t wait to see them tie the knot 💕',
        timestamp: new Date(Date.now() - 500000),
        type: 'text'
      },
      {
        id: '3',
        senderId: '1',
        content: 'So excited for the wedding! 🎉',
        timestamp: new Date(Date.now() - 300000),
        type: 'text'
      },
      {
        id: '4',
        senderId: '1',
        content: 'Did you see the venue photos they posted?',
        timestamp: new Date(Date.now() - 180000),
        type: 'text'
      }
    ],
    '2': [
      {
        id: '1',
        senderId: '3',
        content: 'What time should we arrive?',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text'
      }
    ]
  });

  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  const currentMessages = selectedChatId ? chatMessages[selectedChatId] || [] : [];

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChatId) return;
    
    // In real implementation, this would call an API
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getChatTitle = (chat: Chat) => {
    if (chat.participants.length === 1) {
      return chat.participants[0].name;
    }
    return chat.participants.map(p => p.name.split(' ')[0]).join(', ');
  };

  const getChatAvatar = (chat: Chat) => {
    return chat.participants[0]?.avatar || '👤';
  };

  if (isMinimized) {
    const buttonPosition = isMobileView ? 'bottom-20 right-4' : 'bottom-16 right-6';
    const buttonClasses = isMobileView 
      ? 'rounded-full w-16 h-16 p-0' 
      : 'rounded-t-2xl rounded-b-none h-14 px-6';
    
    return (
      <div className={`fixed ${buttonPosition} z-[200] ${className}`}>
        <HapticFeedback type="light">
          <Button
            onClick={onMinimize}
            className={`glass-card bg-gradient-to-br from-wedding-navy/95 via-wedding-navy-light/90 to-wedding-navy/95 backdrop-blur-xl border border-white/30 text-wedding-cream shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${buttonClasses}`}
            style={{
              background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(52, 73, 94, 0.9) 50%, rgba(44, 62, 80, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 12px 40px rgba(44, 62, 80, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), 6px 6px 12px rgba(44, 62, 80, 0.15), -1px -1px 3px rgba(255, 255, 255, 0.1)'
            }}
          >
            <MessageCircle className={`${isMobileView ? 'w-7 h-7' : 'w-6 h-6 mr-3'} text-wedding-gold drop-shadow-sm`} />
            {!isMobileView && <span className="font-bold text-base font-dolly drop-shadow-sm">Wedding Chat</span>}
            {chats.reduce((sum, chat) => sum + chat.unreadCount, 0) > 0 && (
              <div className={`bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse border-2 border-white/30 ${
                isMobileView 
                  ? 'absolute -top-2 -right-2 w-6 h-6' 
                  : 'w-6 h-6 ml-3'
              }`}
               style={{
                 boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
               }}>
                {chats.reduce((sum, chat) => sum + chat.unreadCount, 0)}
              </div>
            )}
          </Button>
        </HapticFeedback>
      </div>
    );
  }

  // Mobile fullscreen mode with glassmorphic styling
  if (isMobileView) {
    return (
      <div className={`fixed inset-0 flex flex-col z-[200] ${className}`}
           style={{
             background: 'linear-gradient(135deg, rgba(245, 242, 237, 0.98) 0%, rgba(255, 255, 255, 0.95) 30%, rgba(245, 242, 237, 0.98) 100%)',
             backdropFilter: 'blur(30px)'
           }}>
        {/* Mobile Header */}
        <div className="bg-[#1877f2] text-white p-4 flex items-center justify-between safe-area-top">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => selectedChatId ? setSelectedChatId(null) : onClose?.()}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <MessageCircle className="w-6 h-6 text-wedding-gold" />
            <div>
              <h3 className="font-bold text-base font-dolly">
                {selectedChatId ? getChatTitle(selectedChat!) : 'Wedding Messenger'}
              </h3>
              {selectedChatId && selectedChat && (
                <div className="text-xs opacity-80 flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedChat.participants[0]?.status)}`} />
                  <span>
                    {selectedChat.participants[0]?.status === 'online' ? 'Active now' : selectedChat.participants[0]?.lastSeen}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedChatId && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-wedding-cream hover:bg-white/20 p-2 h-auto rounded-full transition-all duration-200 hover:scale-110"
                >
                  <Phone className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-2 h-auto"
                >
                  <Video className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {selectedChatId ? (
          // Mobile Chat View
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {currentMessages.map((message, index) => {
                const isCurrentUser = message.senderId === user?.id || message.senderId === 'current';
                const showAvatar = index === 0 || currentMessages[index - 1].senderId !== message.senderId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex items-end space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    {!isCurrentUser && showAvatar && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                        {getChatAvatar(selectedChat!)}
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${isCurrentUser
                          ? 'bg-[#1877f2] text-white rounded-br-md'
                          : 'bg-white text-gray-800 rounded-bl-md shadow-sm border'
                        }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    {isCurrentUser && showAvatar && <div className="w-8" />}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Mobile Message Input */}
            <div className="p-4 border-t bg-white safe-area-bottom">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <Plus className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Message..."
                    className="rounded-full border-gray-300 pr-12 h-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 p-1 h-auto"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 p-1 h-auto"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-full p-2 h-10 w-10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Mobile Chat List View
          <>
            {/* Mobile Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 h-10"
                />
              </div>
            </div>

            {/* Mobile Online Users */}
            <div className="p-4 border-b">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Online ({onlineUsers.filter(u => u.status === 'online').length})
              </h4>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {onlineUsers
                  .filter(user => user.status === 'online')
                  .map(user => (
                    <HapticFeedback key={user.id} type="light">
                      <button className="flex-shrink-0 flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-gray-100 transition-colors min-w-[80px]">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                            {user.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-white`} />
                        </div>
                        <span className="text-xs text-gray-600 text-center leading-tight">
                          {user.name.split(' ')[0]}
                        </span>
                      </button>
                    </HapticFeedback>
                  ))}
              </div>
            </div>

            {/* Mobile Chat List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                  Recent Chats
                </h4>
                {chats.map(chat => (
                  <HapticFeedback key={chat.id} type="light">
                    <button
                      onClick={() => setSelectedChatId(chat.id)}
                      className="w-full p-4 hover:bg-gray-100 transition-colors flex items-center space-x-4 text-left"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                          {getChatAvatar(chat)}
                        </div>
                        {chat.participants[0]?.status === 'online' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-base text-gray-900 truncate">
                            {getChatTitle(chat)}
                          </h4>
                          {chat.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTime(chat.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">
                            {chat.lastMessage?.content || 'No messages yet'}
                          </p>
                          {chat.unreadCount > 0 && (
                            <div className="bg-[#1877f2] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center ml-2">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </HapticFeedback>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop version with luxury glassmorphic styling
  return (
    <div className={`fixed bottom-16 right-6 w-96 h-[650px] flex flex-col z-[200] overflow-hidden ${className}`}
         style={{
           background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 242, 237, 0.92) 30%, rgba(255, 255, 255, 0.95) 100%)',
           backdropFilter: 'blur(25px)',
           borderRadius: '24px 24px 0 0',
           border: '1px solid rgba(255, 255, 255, 0.4)',
           boxShadow: `
             0 25px 50px rgba(44, 62, 80, 0.25),
             0 8px 32px rgba(0, 0, 0, 0.15),
             inset 0 1px 0 rgba(255, 255, 255, 0.4),
             12px 12px 24px rgba(44, 62, 80, 0.1),
             -4px -4px 12px rgba(255, 255, 255, 0.6)
           `
         }}>
      {/* Luxury Header */}
      <div className="p-5 rounded-t-2xl flex items-center justify-between text-wedding-cream"
           style={{
             background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(52, 73, 94, 0.9) 50%, rgba(44, 62, 80, 0.95) 100%)',
             backdropFilter: 'blur(25px)',
             borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
             boxShadow: '0 4px 20px rgba(44, 62, 80, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
           }}>
        <div className="flex items-center space-x-4">
          <MessageCircle className="w-6 h-6 text-wedding-gold" />
          <div>
            <h3 className="font-bold text-lg font-dolly">
              {selectedChatId ? getChatTitle(selectedChat!) : 'Wedding Messenger'}
            </h3>
            {selectedChatId && selectedChat && (
              <div className="text-sm opacity-90 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedChat.participants[0]?.status)} shadow-sm`} />
                <span className="font-medium">
                  {selectedChat.participants[0]?.status === 'online' ? 'Active now' : selectedChat.participants[0]?.lastSeen}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {selectedChatId && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-wedding-cream hover:bg-white/20 p-2 h-auto rounded-full transition-all duration-200 hover:scale-110"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-wedding-cream hover:bg-white/20 p-2 h-auto rounded-full transition-all duration-200 hover:scale-110"
              >
                <Video className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-wedding-cream hover:bg-white/20 p-2 h-auto rounded-full transition-all duration-200 hover:scale-110"
                onClick={() => setSelectedChatId(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '2px 2px 4px rgba(44, 62, 80, 0.2), -1px -1px 2px rgba(255, 255, 255, 0.1)'
                }}
              >
                <Info className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-wedding-cream hover:bg-white/20 p-2 h-auto rounded-full transition-all duration-200 hover:scale-110"
            onClick={onMinimize}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '2px 2px 4px rgba(44, 62, 80, 0.2), -1px -1px 2px rgba(255, 255, 255, 0.1)'
            }}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-wedding-cream hover:bg-white/20 p-2 h-auto rounded-full transition-all duration-200 hover:scale-110"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '2px 2px 4px rgba(44, 62, 80, 0.2), -1px -1px 2px rgba(255, 255, 255, 0.1)'
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {selectedChatId ? (
        // Chat View
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{
            background: 'linear-gradient(135deg, rgba(245, 242, 237, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
            backdropFilter: 'blur(15px)'
          }}>
            {currentMessages.map((message, index) => {
              const isCurrentUser = message.senderId === user?.id || message.senderId === 'current';
              const showAvatar = index === 0 || currentMessages[index - 1].senderId !== message.senderId;
              
              return (
                <div
                  key={message.id}
                  className={`flex items-end space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {!isCurrentUser && showAvatar && (
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                      {getChatAvatar(selectedChat!)}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                      isCurrentUser
                        ? 'bg-[#1877f2] text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm border'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  {isCurrentUser && showAvatar && <div className="w-6" />}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 border-t" style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 242, 237, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <Camera className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Aa"
                  className="rounded-full border-gray-300 pr-10 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-full p-2 h-8 w-8"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        // Chat List View
        <>
          {/* Search */}
          <div className="p-3 border-b" style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 242, 237, 0.6) 100%)',
            backdropFilter: 'blur(15px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 text-sm"
              />
            </div>
          </div>

          {/* Online Users */}
          <div className="p-3 border-b" style={{
            background: 'linear-gradient(135deg, rgba(245, 242, 237, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Online ({onlineUsers.filter(u => u.status === 'online').length})
            </h4>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {onlineUsers
                .filter(user => user.status === 'online')
                .map(user => (
                  <HapticFeedback key={user.id} type="light">
                    <button className="flex-shrink-0 flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                          {user.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`} />
                      </div>
                      <span className="text-xs text-gray-600 text-center leading-tight">
                        {user.name.split(' ')[0]}
                      </span>
                    </button>
                  </HapticFeedback>
                ))}
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto" style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(245, 242, 237, 0.2) 100%)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="p-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                Recent Chats
              </h4>
              {chats.map(chat => (
                <HapticFeedback key={chat.id} type="light">
                  <button
                    onClick={() => setSelectedChatId(chat.id)}
                    className="w-full p-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3 text-left"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                        {getChatAvatar(chat)}
                      </div>
                      {chat.participants[0]?.status === 'online' && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {getChatTitle(chat)}
                        </h4>
                        {chat.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatTime(chat.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate">
                          {chat.lastMessage?.content || 'No messages yet'}
                        </p>
                        {chat.unreadCount > 0 && (
                          <div className="bg-[#1877f2] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </HapticFeedback>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FacebookMessenger;