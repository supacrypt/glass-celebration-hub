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
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up">
        <h1 className="wedding-heading text-wedding-navy mb-3">
          Social Hub
        </h1>
        <p className="wedding-body text-muted-foreground">
          Connect and share moments with our guests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.1s' }}
          variant="secondary"
        >
          <MessageCircle className="w-6 h-6 mx-auto mb-2 text-glass-blue" />
          <div className="text-lg font-light text-wedding-navy">{messages.length}</div>
          <div className="text-xs text-muted-foreground">Messages</div>
        </GlassCard>
        
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.2s' }}
          variant="secondary"
        >
          <Heart className="w-6 h-6 mx-auto mb-2 text-glass-pink" />
          <div className="text-lg font-light text-wedding-navy">
            {messages.reduce((total, msg) => total + msg.message_likes.length, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Likes</div>
        </GlassCard>
        
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.3s' }}
          variant="secondary"
        >
          <Users className="w-6 h-6 mx-auto mb-2 text-glass-green" />
          <div className="text-lg font-light text-wedding-navy">
            {new Set(messages.map(msg => msg.user_id)).size}
          </div>
          <div className="text-xs text-muted-foreground">Contributors</div>
        </GlassCard>
      </div>

      {/* Wedding Hashtags */}
      <GlassCard className="mb-8 p-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-5 h-5 text-glass-purple" />
          <h2 className="text-lg font-semibold text-wedding-navy">Wedding Hashtags</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((hashtag, index) => (
            <span 
              key={hashtag}
              className="px-3 py-1 bg-glass-blue/10 text-glass-blue rounded-full text-sm font-medium cursor-pointer hover:bg-glass-blue/20 transition-colors"
            >
              {hashtag}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Use these hashtags when sharing photos and posts about our wedding!
        </p>
      </GlassCard>

      {/* Post Message */}
      <GlassCard className="mb-8 p-6 animate-fade-up" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-lg font-semibold mb-4 text-wedding-navy">Share a Message</h3>
        <div className="space-y-4">
          <textarea 
            placeholder="Write a message for the happy couple..."
            className="w-full p-4 bg-secondary/30 border border-border/50 rounded-glass resize-none focus:outline-none focus:ring-2 focus:ring-glass-blue/50 transition-all"
            rows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button className="p-2 rounded-glass bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <Hash className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-glass bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <Share2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <Button 
              onClick={handlePostMessage}
              disabled={posting || !newMessage.trim()}
              className="bg-wedding-navy hover:bg-wedding-navy-light"
            >
              <Send className="w-4 h-4 mr-2" />
              {posting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Recent Messages */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-wedding-navy animate-fade-up" style={{ animationDelay: '0.6s' }}>
          Recent Messages
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy mx-auto"></div>
          </div>
        ) : messages.length === 0 ? (
          <GlassCard className="p-8 text-center" variant="secondary">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No messages yet. Be the first to share!</p>
          </GlassCard>
        ) : (
          messages.map((msg, index) => (
            <GlassCard 
              key={msg.id}
              className="p-5 animate-fade-up" 
              style={{ animationDelay: `${0.7 + (index * 0.1)}s` }}
              variant="secondary"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-wedding-navy text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {getInitials(msg.profiles)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-wedding-navy">{getDisplayName(msg.profiles)}</h4>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(msg.created_at)}</span>
                  </div>
                  <p className="text-muted-foreground mb-3 leading-relaxed">
                    {msg.content}
                  </p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLikeMessage(msg.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        msg.message_likes.some(like => like.user_id === user?.id)
                          ? 'text-glass-pink'
                          : 'text-muted-foreground hover:text-glass-pink'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${
                        msg.message_likes.some(like => like.user_id === user?.id) ? 'fill-current' : ''
                      }`} />
                      <span className="text-sm">{msg.message_likes.length}</span>
                    </button>
                    <button className="text-glass-blue hover:text-glass-blue/80 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

export default Social;