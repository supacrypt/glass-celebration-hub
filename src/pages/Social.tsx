import React, { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { MessageCircle, Heart, Share2, Users, Hash, Send } from 'lucide-react';
import { useMessages } from '@/hooks/useWeddingData';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Social: React.FC = () => {
  const { messages, loading, postMessage, likeMessage } = useMessages();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePostMessage = async () => {
    if (!newMessage.trim()) return;
    
    setPosting(true);
    const result = await postMessage(newMessage.trim());
    
    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to post message. Please try again.",
        variant: "destructive",
      });
    } else {
      setNewMessage('');
      toast({
        title: "Success!",
        description: "Your message has been posted.",
      });
    }
    setPosting(false);
  };

  const handleLikeMessage = async (messageId: string) => {
    await likeMessage(messageId);
  };

  const getDisplayName = (profiles: any) => {
    return profiles?.display_name || 
           `${profiles?.first_name || ''} ${profiles?.last_name || ''}`.trim() || 
           'Anonymous Guest';
  };

  const getInitials = (profiles: any) => {
    const firstName = profiles?.first_name || '';
    const lastName = profiles?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'A';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const hashtags = [
    '#TimAndKirsten2025',
    '#WeddingBliss',
    '#BenEan',
    '#ForeverLove',
    '#HunterValleyWedding'
  ];

  return (
    <div className="min-h-screen" style={{ padding: '40px 20px', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
        
        {/* Page Header */}
        <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
          <h1 className="text-[28px] text-[#5a5651] font-normal tracking-tight animate-fade-up">
            Connect and share moments with our guests
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
          <div className="glass-card p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 hover:translate-y-[-3px] sm:hover:translate-y-[-5px] hover:scale-[1.02] animate-fade-up min-h-[120px] flex flex-col justify-center" style={{ animationDelay: '0.1s' }}>
            <div className="text-[28px] sm:text-[32px] mb-2 sm:mb-3 h-8 sm:h-10">💬</div>
            <div className="text-[28px] sm:text-[36px] font-bold text-[#2d3f51] mb-1 leading-none">{messages.length}</div>
            <div className="text-xs sm:text-sm text-[#7a736b] font-medium">Messages</div>
          </div>
          
          <div className="glass-card p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 hover:translate-y-[-3px] sm:hover:translate-y-[-5px] hover:scale-[1.02] animate-fade-up min-h-[120px] flex flex-col justify-center" style={{ animationDelay: '0.2s' }}>
            <div className="text-[28px] sm:text-[32px] mb-2 sm:mb-3 h-8 sm:h-10">❤️</div>
            <div className="text-[28px] sm:text-[36px] font-bold text-[#2d3f51] mb-1 leading-none">
              {messages.reduce((total, msg) => total + msg.message_likes.length, 0)}
            </div>
            <div className="text-xs sm:text-sm text-[#7a736b] font-medium">Likes</div>
          </div>
          
          <div className="glass-card p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 hover:translate-y-[-3px] sm:hover:translate-y-[-5px] hover:scale-[1.02] animate-fade-up min-h-[120px] flex flex-col justify-center" style={{ animationDelay: '0.3s' }}>
            <div className="text-[28px] sm:text-[32px] mb-2 sm:mb-3 h-8 sm:h-10">👥</div>
            <div className="text-[28px] sm:text-[36px] font-bold text-[#2d3f51] mb-1 leading-none">
              {new Set(messages.map(msg => msg.user_id)).size}
            </div>
            <div className="text-xs sm:text-sm text-[#7a736b] font-medium">Contributors</div>
          </div>
        </div>

        {/* Wedding Hashtags Section */}
        <div className="glass-card p-8 mb-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="flex items-center gap-3 text-xl font-semibold text-[#2d3f51] mb-5">
            <span className="text-2xl text-[#667eea]">#</span>
            Wedding Hashtags
          </h2>
          
          <div className="flex flex-wrap gap-3 mb-5">
            {hashtags.map((hashtag, index) => (
              <div 
                key={hashtag}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-4 py-2 rounded-[20px] text-sm font-medium cursor-pointer transition-all duration-300 hover:translate-y-[-2px] hover:scale-105 relative overflow-hidden"
                style={{
                  boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3), 3px 3px 8px rgba(163, 155, 146, 0.2)'
                }}
              >
                {hashtag}
              </div>
            ))}
          </div>
          
          <p className="text-sm text-[#7a736b] italic">
            Use these hashtags when sharing photos and posts about our wedding!
          </p>
        </div>

        {/* Share a Message Section */}
        <div className="glass-card p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-lg sm:text-xl font-semibold text-[#2d3f51] mb-4 sm:mb-5">Share a Message</h2>
          
          <textarea 
            className="w-full min-h-[100px] sm:min-h-[120px] bg-gradient-to-br from-[rgba(230,222,214,0.3)] to-[rgba(245,237,228,0.3)] border border-[rgba(255,255,255,0.5)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 text-sm sm:text-base text-[#2d3f51] resize-y transition-all duration-300 focus:outline-none focus:border-[rgba(102,126,234,0.5)] font-[inherit]"
            style={{
              boxShadow: 'inset 3px 3px 6px rgba(163, 155, 146, 0.2), inset -3px -3px 6px rgba(255, 255, 255, 0.7)'
            }}
            placeholder="Write a message for the happy couple..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          
          <div className="flex items-center justify-between mt-4 sm:mt-5">
            <div className="flex gap-2 sm:gap-4">
              <button className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-[8px] sm:rounded-[10px] flex items-center justify-center text-[#7a736b] text-base sm:text-lg border-none cursor-pointer transition-all duration-300 hover:translate-y-[-2px]"
                style={{
                  boxShadow: '3px 3px 6px rgba(163, 155, 146, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.7)'
                }}>
                #
              </button>
              <button className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-[8px] sm:rounded-[10px] flex items-center justify-center text-[#7a736b] text-base sm:text-lg border-none cursor-pointer transition-all duration-300 hover:translate-y-[-2px]"
                style={{
                  boxShadow: '3px 3px 6px rgba(163, 155, 146, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.7)'
                }}>
                📎
              </button>
            </div>
            <button 
              onClick={handlePostMessage}
              disabled={posting || !newMessage.trim()}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-none px-6 sm:px-8 py-3 rounded-[20px] sm:rounded-[25px] font-semibold text-xs sm:text-sm cursor-pointer flex items-center gap-2 transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              style={{
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3), 5px 5px 10px rgba(163, 155, 146, 0.2)'
              }}
            >
              ✈️ {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {/* Recent Messages Section */}
        <div className="glass-card p-8 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-xl font-semibold text-[#2d3f51] mb-6">Recent Messages</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3f51] mx-auto"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl text-[#667eea] mb-4 block animate-bounce">💬</span>
              <p className="text-base text-[#7a736b]">No messages yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                 <div 
                   key={msg.id}
                   className="glass-card p-4 sm:p-5 animate-fade-up" 
                   style={{ animationDelay: `${0.7 + (index * 0.1)}s` }}
                 >
                   <div className="flex items-start gap-3 sm:gap-4">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2d3f51] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                       {getInitials(msg.profiles)}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-2 flex-wrap">
                         <h4 className="font-semibold text-[#2d3f51] text-sm sm:text-base truncate">{getDisplayName(msg.profiles)}</h4>
                         <span className="text-xs text-[#7a736b] flex-shrink-0">{formatTimeAgo(msg.created_at)}</span>
                       </div>
                       <p className="text-[#7a736b] mb-3 leading-relaxed text-sm sm:text-base break-words">
                         {msg.content}
                       </p>
                       <div className="flex items-center gap-3 sm:gap-4">
                         <button 
                           onClick={() => handleLikeMessage(msg.id)}
                           className={`flex items-center gap-1 transition-colors min-w-[44px] min-h-[44px] justify-center ${
                             msg.message_likes.some(like => like.user_id === user?.id)
                               ? 'text-[#EC4899]'
                               : 'text-[#7a736b] hover:text-[#EC4899]'
                           }`}
                         >
                           <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${
                             msg.message_likes.some(like => like.user_id === user?.id) ? 'fill-current' : ''
                           }`} />
                           <span className="text-sm">{msg.message_likes.length}</span>
                         </button>
                         <button className="text-[#667eea] hover:text-[#667eea]/80 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                           <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                         </button>
                         <button className="text-[#7a736b] hover:text-[#2d3f51] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                           <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Social;