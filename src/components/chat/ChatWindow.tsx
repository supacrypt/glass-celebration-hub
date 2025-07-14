import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  UserCheck,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'file';
  media_url?: string;
  created_at: string;
  sender_profile?: {
    display_name: string;
    avatar_url?: string;
    first_name: string;
    last_name: string;
  };
  reactions?: Array<{
    emoji: string;
    user_id: string;
    user_name: string;
  }>;
  read_by?: string[];
}

interface ChatThread {
  id: string;
  name?: string;
  type: 'direct' | 'group';
  participants: Array<{
    user_id: string;
    display_name: string;
    avatar_url?: string;
    is_online: boolean;
  }>;
  last_message?: ChatMessage;
  created_at: string;
  updated_at: string;
}

interface ChatWindowProps {
  thread: ChatThread | null;
  onBack?: () => void;
  onStartVideoCall?: (threadId: string) => void;
  onStartAudioCall?: (threadId: string) => void;
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  thread,
  onBack,
  onStartVideoCall,
  onStartAudioCall,
  className
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load messages when thread changes
  useEffect(() => {
    if (thread) {
      loadMessages();
      setupRealtimeSubscription();
    }
    return () => {
      // Cleanup subscription
    };
  }, [thread]);

  const loadMessages = async () => {
    if (!thread) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender_profile:profiles!chat_messages_sender_id_fkey (
            display_name,
            avatar_url,
            first_name,
            last_name
          )
        `)
        .eq('thread_id', thread.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!thread) return;

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel(`chat_messages:${thread.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `thread_id=eq.${thread.id}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
          
          // Play sound for new messages (not from current user)
          if (newMessage.sender_id !== user?.id && soundEnabled) {
            playNotificationSound();
          }
        }
      )
      .subscribe();

    // Subscribe to typing indicators
    const typingSubscription = supabase
      .channel(`typing:${thread.id}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { user_id, is_typing, user_name } = payload.payload;
        
        if (user_id !== user?.id) {
          setTypingUsers(prev => {
            if (is_typing) {
              return prev.includes(user_name) ? prev : [...prev, user_name];
            } else {
              return prev.filter(name => name !== user_name);
            }
          });
        }
      })
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
      typingSubscription.unsubscribe();
    };
  };

  const playNotificationSound = () => {
    // Simple notification sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LFeSUGLIHO8tiJOQcZaLvt559NESYpPR5LYE8');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore audio play errors (browser restrictions)
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !thread || !user) return;

    try {
      const messageData = {
        thread_id: thread.id,
        sender_id: user.id,
        content: newMessage.trim(),
        message_type: 'text'
      };

      const { error } = await supabase
        .from('chat_messages')
        .insert([messageData]);

      if (error) throw error;

      setNewMessage('');
      setTyping(false);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = useCallback(() => {
    if (!thread || !user) return;

    setTyping(true);

    // Broadcast typing status
    supabase
      .channel(`typing:${thread.id}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { 
          user_id: user.id, 
          is_typing: true, 
          user_name: user.email 
        }
      });

    // Stop typing after 3 seconds
    setTimeout(() => {
      setTyping(false);
      supabase
        .channel(`typing:${thread.id}`)
        .send({
          type: 'broadcast',
          event: 'typing',
          payload: { 
            user_id: user.id, 
            is_typing: false, 
            user_name: user.email 
          }
        });
    }, 3000);
  }, [thread, user]);

  const addReaction = async (messageId: string, emoji: string) => {
    // TODO: Implement message reactions
    console.log('Add reaction:', messageId, emoji);
  };

  const getOtherParticipants = () => {
    if (!thread || !user) return [];
    return thread.participants.filter(p => p.user_id !== user.id);
  };

  const getThreadTitle = () => {
    if (!thread) return 'Chat';
    
    if (thread.name) return thread.name;
    
    const others = getOtherParticipants();
    if (others.length === 1) {
      return others[0].display_name || 'Unknown User';
    }
    
    return `Group Chat (${thread.participants.length})`;
  };

  const getOnlineCount = () => {
    return getOtherParticipants().filter(p => p.is_online).length;
  };

  if (!thread) {
    return (
      <div className={`flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-wedding-navy/10 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-wedding-navy" />
          </div>
          <h3 className="text-xl font-semibold text-wedding-navy mb-2">
            Welcome to Wedding Chat
          </h3>
          <p className="text-muted-foreground">
            Select a conversation to start messaging with your wedding party
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white/95 backdrop-blur-md ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="lg:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            {/* Avatar Stack for participants */}
            <div className="flex -space-x-2">
              {getOtherParticipants().slice(0, 3).map((participant, index) => (
                <div
                  key={participant.user_id}
                  className="relative w-8 h-8 rounded-full border-2 border-white"
                  style={{ zIndex: 10 - index }}
                >
                  {participant.avatar_url ? (
                    <img
                      src={participant.avatar_url}
                      alt={participant.display_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-wedding-navy flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {participant.display_name[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {participant.is_online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="font-semibold text-wedding-navy">
                {getThreadTitle()}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {getOnlineCount() > 0 ? (
                  <>
                    <UserCheck className="w-3 h-3 text-green-500" />
                    <span>{getOnlineCount()} online</span>
                  </>
                ) : (
                  <span>Offline</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStartAudioCall?.(thread.id)}
            className="text-green-600 hover:bg-green-50"
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStartVideoCall?.(thread.id)}
            className="text-blue-600 hover:bg-blue-50"
          >
            <Video className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={soundEnabled ? 'text-wedding-navy' : 'text-gray-400'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Chat Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                View Participants
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Leave Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-navy"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === user?.id}
                onAddReaction={addReaction}
              />
            ))}
          </AnimatePresence>
        )}
        
        {/* Typing Indicator */}
        <AnimatePresence>
          {typingUsers.length > 0 && (
            <TypingIndicator users={typingUsers} />
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200/50">
        <div className="flex items-end space-x-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                if (e.target.value && !typing) {
                  handleTyping();
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-wedding-navy hover:bg-wedding-navy/90"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;