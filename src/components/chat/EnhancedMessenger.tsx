import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MessageCircle, Send, Smile, Plus, Search, Phone, Video, Info, X, 
  Minimize2, Camera, Paperclip, Mic, MicOff, VideoOff, PhoneOff,
  Upload, ImageIcon, Film, FileText, MoreHorizontal, Volume2, VolumeX
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HapticFeedback } from '@/components/mobile/HapticFeedback';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  content?: string;
  timestamp: Date;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'call';
  mediaUrl?: string;
  mediaThumbnail?: string;
  mediaType?: string;
  callDuration?: number;
  callType?: 'audio' | 'video';
  reactions?: { emoji: string; userId: string }[];
  isRead?: boolean;
}

interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
  isTyping?: boolean;
}

interface CallState {
  isActive: boolean;
  isIncoming: boolean;
  isOutgoing: boolean;
  callType: 'audio' | 'video';
  participantId?: string;
  participantName?: string;
  duration: number;
  isConnected: boolean;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

interface EnhancedMessengerProps {
  isMinimized?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
  className?: string;
  isMobile?: boolean;
  isCenter?: boolean; // New prop for center positioning
  isDashboardActive?: boolean; // New prop for dashboard interaction
}

const EnhancedMessenger: React.FC<EnhancedMessengerProps> = ({ 
  isMinimized = false, 
  onMinimize, 
  onClose,
  className = "",
  isMobile = false,
  isCenter = false,
  isDashboardActive = false
}) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  // Chat state
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  // Media state
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Call state
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isIncoming: false,
    isOutgoing: false,
    callType: 'audio',
    duration: 0,
    isConnected: false,
    isAudioEnabled: true,
    isVideoEnabled: true
  });
  
  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768 || isMobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  // Mock data - replace with real data from Supabase
  const [onlineUsers] = useState<User[]>([
    { id: '1', name: 'Sarah M.', avatar: '👰', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'Mike R.', avatar: '🤵', status: 'online', lastSeen: 'now' },
    { id: '3', name: 'Emma J.', avatar: '👩', status: 'away', lastSeen: '5 min ago' },
    { id: '4', name: 'David K.', avatar: '👨', status: 'online', lastSeen: 'now' },
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
      isActive: false,
      isTyping: false
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
      }
    ]
  });

  // WebRTC Configuration
  const rtcConfiguration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Initialize WebRTC
  const initializePeerConnection = useCallback(() => {
    const peerConnection = new RTCPeerConnection(rtcConfiguration);
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer via Supabase
        console.log('ICE candidate:', event.candidate);
      }
    };
    
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setCallState(prev => ({ ...prev, remoteStream: event.streams[0] }));
      }
    };
    
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        setCallState(prev => ({ ...prev, isConnected: true }));
      } else if (peerConnection.connectionState === 'disconnected' || 
                 peerConnection.connectionState === 'failed') {
        endCall();
      }
    };
    
    peerConnectionRef.current = peerConnection;
    return peerConnection;
  }, []);

  // Start call
  const startCall = async (callType: 'audio' | 'video', participantId: string) => {
    try {
      const constraints = {
        audio: true,
        video: callType === 'video'
      };
      
      const localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      
      const peerConnection = initializePeerConnection();
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
      
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      setCallState({
        isActive: true,
        isOutgoing: true,
        isIncoming: false,
        callType,
        participantId,
        participantName: onlineUsers.find(u => u.id === participantId)?.name,
        duration: 0,
        isConnected: false,
        localStream,
        isAudioEnabled: true,
        isVideoEnabled: callType === 'video'
      });
      
      // Send offer to participant via Supabase real-time
      // Implementation would go here
      
      toast({
        title: `Starting ${callType} call...`,
        description: `Calling ${onlineUsers.find(u => u.id === participantId)?.name}`,
      });
      
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Call Failed",
        description: "Could not access camera/microphone",
        variant: "destructive"
      });
    }
  };

  // End call
  const endCall = () => {
    if (callState.localStream) {
      callState.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    setCallState({
      isActive: false,
      isIncoming: false,
      isOutgoing: false,
      callType: 'audio',
      duration: 0,
      isConnected: false,
      isAudioEnabled: true,
      isVideoEnabled: true
    });
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  // Toggle audio/video
  const toggleAudio = () => {
    if (callState.localStream) {
      const audioTrack = callState.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setCallState(prev => ({ ...prev, isAudioEnabled: audioTrack.enabled }));
      }
    }
  };

  const toggleVideo = () => {
    if (callState.localStream) {
      const videoTrack = callState.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCallState(prev => ({ ...prev, isVideoEnabled: videoTrack.enabled }));
      }
    }
  };

  // Media handling
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Supabase storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('direct-chats')
        .upload(fileName, file);

      if (error) throw error;

      // Create preview for images/videos
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => setMediaPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }

      setSelectedMedia(file);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('direct-chats')
        .getPublicUrl(fileName);

      // Send message with media
      await sendMediaMessage(urlData.publicUrl, file.type, file.name);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Could not upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setSelectedMedia(null);
      setMediaPreview(null);
    }
  };

  const sendMediaMessage = async (mediaUrl: string, mediaType: string, fileName?: string) => {
    if (!selectedChatId) return;

    // Implementation would save to Supabase chat_messages table
    console.log('Sending media message:', { mediaUrl, mediaType, fileName });
    
    toast({
      title: "Media sent!",
      description: `${mediaType.startsWith('image/') ? 'Image' : 
                    mediaType.startsWith('video/') ? 'Video' : 'File'} uploaded successfully.`,
    });
  };

  // Camera capture
  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            await handleFileSelect({ target: { files: [file] } } as any);
          }
          stream.getTracks().forEach(track => track.stop());
        }, 'image/jpeg', 0.9);
      });
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Could not access camera for photo capture.",
        variant: "destructive"
      });
    }
  };

  // Typing indicators
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      // Send typing start via Supabase real-time
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Send typing stop via Supabase real-time
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChatId) return;
    
    // Stop typing
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Implementation would save to Supabase
    console.log('Sending message:', messageText);
    setMessageText('');
    
    toast({
      title: "Message sent!",
      description: "Your message was delivered.",
    });
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  const currentMessages = selectedChatId ? chatMessages[selectedChatId] || [] : [];

  // Position calculation
  const getPositionClasses = () => {
    if (isCenter) {
      return isMobileView 
        ? 'fixed inset-4 z-[100]' 
        : 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100]';
    }
    
    const basePosition = isMobileView ? 'bottom-20 right-4' : 'bottom-16 right-6';
    return `fixed ${basePosition} z-[${isDashboardActive ? '50' : '200'}]`;
  };

  if (isMinimized) {
    const buttonPosition = getPositionClasses();
    const buttonClasses = isMobileView 
      ? 'rounded-full w-16 h-16 p-0' 
      : 'rounded-t-2xl rounded-b-none h-14 px-6';
    
    return (
      <div className={`${buttonPosition} ${className} ${isDashboardActive ? 'opacity-30' : ''}`}>
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

  // Call overlay
  if (callState.isActive) {
    return (
      <div className="fixed inset-0 bg-black z-[400] flex flex-col">
        {/* Call header */}
        <div className="p-6 text-center text-white">
          <h2 className="text-xl font-semibold">{callState.participantName}</h2>
          <p className="text-sm opacity-80">
            {callState.isConnected ? `${Math.floor(callState.duration / 60)}:${(callState.duration % 60).toString().padStart(2, '0')}` : 'Connecting...'}
          </p>
        </div>

        {/* Video area */}
        <div className="flex-1 relative">
          {callState.callType === 'video' && (
            <>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute top-4 right-4 w-32 h-24 object-cover rounded-lg border-2 border-white/30"
              />
            </>
          )}
        </div>

        {/* Call controls */}
        <div className="p-6 flex justify-center space-x-4">
          <Button
            onClick={toggleAudio}
            variant="ghost"
            size="lg"
            className={`rounded-full w-16 h-16 ${!callState.isAudioEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'}`}
          >
            {callState.isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>
          
          {callState.callType === 'video' && (
            <Button
              onClick={toggleVideo}
              variant="ghost"
              size="lg"
              className={`rounded-full w-16 h-16 ${!callState.isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'}`}
            >
              {callState.isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
          )}
          
          <Button
            onClick={endCall}
            variant="ghost"
            size="lg"
            className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </div>
    );
  }

  // Main messenger interface
  const containerClasses = isCenter 
    ? `${getPositionClasses()} ${isMobileView ? 'w-full h-full' : 'w-96 h-[650px]'} flex flex-col overflow-hidden ${className} ${isDashboardActive ? 'opacity-60 pointer-events-none' : ''}`
    : `${getPositionClasses()} w-96 h-[650px] flex flex-col overflow-hidden ${className} ${isDashboardActive ? 'opacity-60 pointer-events-none' : ''}`;

  return (
    <div className={containerClasses}
         style={{
           background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 242, 237, 0.92) 30%, rgba(255, 255, 255, 0.95) 100%)',
           backdropFilter: 'blur(25px)',
           borderRadius: isCenter ? '24px' : '24px 24px 0 0',
           border: '1px solid rgba(255, 255, 255, 0.4)',
           boxShadow: `
             0 25px 50px rgba(44, 62, 80, 0.25),
             0 8px 32px rgba(0, 0, 0, 0.15),
             inset 0 1px 0 rgba(255, 255, 255, 0.4),
             12px 12px 24px rgba(44, 62, 80, 0.1),
             -4px -4px 12px rgba(255, 255, 255, 0.6)
           `
         }}>
      
      {/* Header */}
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
              {selectedChatId ? selectedChat?.participants.map(p => p.name.split(' ')[0]).join(', ') : 'Wedding Messenger'}
            </h3>
            {selectedChatId && selectedChat && (
              <div className="text-sm opacity-90 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  selectedChat.participants[0]?.status === 'online' ? 'bg-green-500' : 
                  selectedChat.participants[0]?.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                } shadow-sm`} />
                <span className="font-medium">
                  {selectedChat.participants[0]?.status === 'online' ? 'Active now' : selectedChat.participants[0]?.lastSeen}
                </span>
                {selectedChat.isTyping && (
                  <span className="text-xs animate-pulse">typing...</span>
                )}
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
                onClick={() => startCall('audio', selectedChat?.participants[0]?.id || '')}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '2px 2px 4px rgba(44, 62, 80, 0.2), -1px -1px 2px rgba(255, 255, 255, 0.1)'
                }}
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-wedding-cream hover:bg-white/20 p-2 h-auto rounded-full transition-all duration-200 hover:scale-110"
                onClick={() => startCall('video', selectedChat?.participants[0]?.id || '')}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '2px 2px 4px rgba(44, 62, 80, 0.2), -1px -1px 2px rgba(255, 255, 255, 0.1)'
                }}
              >
                <Video className="w-4 h-4" />
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
                      {selectedChat?.participants[0]?.avatar || '👤'}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                      isCurrentUser
                        ? 'bg-[#1877f2] text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm border'
                    }`}
                  >
                    {message.type === 'text' && (
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    )}
                    {message.type === 'image' && (
                      <img src={message.mediaUrl} alt="Shared" className="max-w-full rounded" />
                    )}
                    {message.type === 'video' && (
                      <video src={message.mediaUrl} controls className="max-w-full rounded" />
                    )}
                    <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </div>
                  </div>
                  {isCurrentUser && showAvatar && <div className="w-6" />}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Media Menu */}
          {showMediaMenu && (
            <div className="p-3 border-t border-gray-200 bg-white/90">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Photo</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={capturePhoto}
                  className="flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Camera</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <Film className="w-4 h-4" />
                  <span>Video</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>File</span>
                </Button>
              </div>
            </div>
          )}

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
                onClick={() => setShowMediaMenu(!showMediaMenu)}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    handleTyping();
                  }}
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
                disabled={!messageText.trim() || isUploading}
                className="bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-full p-2 h-8 w-8"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        // Chat List View with existing implementation
        <div className="flex-1 p-3">
          <p className="text-center text-gray-500">Select a chat to start messaging</p>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default EnhancedMessenger;