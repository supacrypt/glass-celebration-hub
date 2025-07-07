import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Image, Hash } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMessages } from '@/hooks/useWeddingData';
import { useToast } from '@/hooks/use-toast';

const SocialCompose: React.FC = () => {
  const navigate = useNavigate();
  const { postMessage } = useMessages();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);

  const hashtags = [
    '#TimAndKirsten2025',
    '#WeddingBliss',
    '#BenEan',
    '#ForeverLove',
    '#HunterValleyWedding'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setPosting(true);
    const result = await postMessage(message.trim());
    
    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to post message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Your message has been posted.",
      });
      navigate('/social');
    }
    setPosting(false);
  };

  const addHashtag = (hashtag: string) => {
    setMessage(prev => prev + (prev ? ' ' : '') + hashtag);
  };

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/social')}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#7a736b]" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#2d3f51]">Compose Message</h1>
          <p className="text-sm text-[#7a736b]">Share your thoughts with the wedding guests</p>
        </div>
      </div>

      {/* Compose Form */}
      <div className="max-w-2xl space-y-6">
        <GlassCard className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#2d3f51]">
                Your Message
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your excitement, memories, or well wishes..."
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="text-xs text-[#7a736b] text-right">
                {message.length}/500 characters
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-[#7a736b]"
                  disabled
                >
                  <Image className="w-4 h-4 mr-1" />
                  Photo
                  <span className="text-xs ml-1">(Soon)</span>
                </Button>
              </div>

              <Button 
                type="submit"
                disabled={posting || !message.trim()}
                className="bg-wedding-navy hover:bg-wedding-navy-light"
              >
                <Send className="w-4 h-4 mr-2" />
                {posting ? 'Posting...' : 'Post Message'}
              </Button>
            </div>
          </form>
        </GlassCard>

        {/* Suggested Hashtags */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-glass-purple" />
            <h3 className="text-lg font-semibold text-[#2d3f51]">Suggested Hashtags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((hashtag) => (
              <button
                key={hashtag}
                type="button"
                onClick={() => addHashtag(hashtag)}
                className="px-3 py-1 bg-glass-blue/10 text-glass-blue rounded-full text-sm font-medium cursor-pointer hover:bg-glass-blue/20 transition-colors"
              >
                {hashtag}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#7a736b] mt-3">
            Click to add hashtags to your message
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default SocialCompose;