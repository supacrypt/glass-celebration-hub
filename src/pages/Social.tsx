import React from 'react';
import GlassCard from '@/components/GlassCard';
import { MessageCircle, Heart, Share2, Users, Hash, Send } from 'lucide-react';

const Social: React.FC = () => {
  const messages = [
    {
      id: 1,
      name: 'Emma Johnson',
      time: '2h ago',
      message: 'So excited for the big day! Can\'t wait to celebrate with you both! 💕',
      likes: 12,
      avatar: 'EJ'
    },
    {
      id: 2,
      name: 'Michael Smith',
      time: '4h ago',
      message: 'The venue looks absolutely stunning! Perfect choice for your special day.',
      likes: 8,
      avatar: 'MS'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      time: '6h ago',
      message: 'Thank you for including us in your celebration. It means the world! ✨',
      likes: 15,
      avatar: 'SW'
    },
  ];

  const hashtags = [
    '#SarahAndJames2024',
    '#WeddingBliss',
    '#SunsetGarden',
    '#ForeverLove',
    '#WeddingDay'
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
          <div className="text-lg font-light text-wedding-navy">24</div>
          <div className="text-xs text-muted-foreground">Messages</div>
        </GlassCard>
        
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.2s' }}
          variant="secondary"
        >
          <Heart className="w-6 h-6 mx-auto mb-2 text-glass-pink" />
          <div className="text-lg font-light text-wedding-navy">187</div>
          <div className="text-xs text-muted-foreground">Likes</div>
        </GlassCard>
        
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.3s' }}
          variant="secondary"
        >
          <Users className="w-6 h-6 mx-auto mb-2 text-glass-green" />
          <div className="text-lg font-light text-wedding-navy">67</div>
          <div className="text-xs text-muted-foreground">Active</div>
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
            <button className="px-6 py-2 bg-wedding-navy text-white rounded-glass hover:bg-wedding-navy-light transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" />
              Post
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Recent Messages */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-wedding-navy animate-fade-up" style={{ animationDelay: '0.6s' }}>
          Recent Messages
        </h2>
        
        {messages.map((msg, index) => (
          <GlassCard 
            key={msg.id}
            className="p-5 animate-fade-up" 
            style={{ animationDelay: `${0.7 + (index * 0.1)}s` }}
            variant="secondary"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-wedding-navy text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {msg.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-wedding-navy">{msg.name}</h4>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {msg.message}
                </p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-glass-pink hover:text-glass-pink/80 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{msg.likes}</span>
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
        ))}
      </div>
    </div>
  );
};

export default Social;