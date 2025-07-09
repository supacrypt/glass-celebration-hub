import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '@/components/GlassCard';
import { MessageCircle, Heart, Share2, Users, Hash, Send, Plus, Image, Video, Mail, BarChart3, Smile, MapPin, Tag, Camera, Paperclip } from 'lucide-react';
import { useMessages } from '@/hooks/useWeddingData';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SocialPostCard } from '@/components/social/SocialPostCard';
import { useSocialFeed } from '@/hooks/useSocialFeed';
import DirectChatContainer from '@/components/chat/DirectChatContainer';
import PollCreator from '@/components/polls/PollCreator';
import PollDisplay from '@/components/polls/PollDisplay';
import { usePolls } from '@/hooks/usePolls';

const Social: React.FC = () => {
  const { messages, loading: messagesLoading, postMessage, likeMessage } = useMessages();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [showDirectChat, setShowDirectChat] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  
  // Social feed functionality
  const { 
    posts, 
    loading: postsLoading, 
    hasMore, 
    loadMore, 
    createPost, 
    addReaction, 
    addComment, 
    sharePost 
  } = useSocialFeed();
  
  // Polls functionality
  const {
    polls,
    loading: pollsLoading,
    createPoll,
    votePoll
  } = usePolls();
  
  // Create post state
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [creatingPost, setCreatingPost] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !postsLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, postsLoading, loadMore]);

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

  // Handle media file selection
  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      setSelectedMedia(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle create post
  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedMedia) return;

    setCreatingPost(true);
    try {
      const result = await createPost(newPostContent, selectedMedia || undefined);
      
      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to create post. Please try again.",
          variant: "destructive"
        });
      } else {
        setNewPostContent('');
        setSelectedMedia(null);
        setMediaPreview(null);
        setShowCreatePost(false);
        toast({
          title: "Success!",
          description: "Your post has been created.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCreatingPost(false);
    }
  };

  // Clear media selection
  const clearMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

        {/* Direct Chat Section */}
        <div className="glass-card p-8 mb-8 animate-fade-up" style={{ animationDelay: '0.45s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-[#2d3f51]">
              <Mail className="w-6 h-6 text-[#667eea]" />
              Direct Messages
            </h2>
            <Button
              onClick={() => setShowDirectChat(!showDirectChat)}
              variant="outline"
              className="bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 text-[#2d3f51]"
            >
              {showDirectChat ? 'Hide Messages' : 'Open Messages'}
            </Button>
          </div>
          
          {showDirectChat ? (
            <div className="h-[500px] bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
              <DirectChatContainer />
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[#667eea]" />
              </div>
              <p className="text-[#7a736b] mb-4">
                Start conversations with other wedding guests
              </p>
              <Button
                onClick={() => setShowDirectChat(true)}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#667eea]/90 hover:to-[#764ba2]/90 text-white"
              >
                Open Direct Messages
              </Button>
            </div>
          )}
        </div>

        {/* Create Post Button */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={() => setShowCreatePost(true)}
            className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:opacity-90 h-12 text-base font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Post
          </Button>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-up">
            <div className="glass-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-[#2d3f51] mb-4">Create New Post</h2>
              
              <div className="space-y-4">
                <textarea 
                  className="w-full min-h-[120px] bg-gradient-to-br from-[rgba(230,222,214,0.3)] to-[rgba(245,237,228,0.3)] border border-[rgba(255,255,255,0.5)] rounded-lg p-4 text-[#2d3f51] resize-none focus:outline-none focus:border-[rgba(102,126,234,0.5)]"
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />

                {/* Media Preview */}
                {mediaPreview && (
                  <div className="relative">
                    {selectedMedia?.type.startsWith('image/') ? (
                      <img src={mediaPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    ) : (
                      <video src={mediaPreview} className="w-full h-48 object-cover rounded-lg" controls />
                    )}
                    <Button
                      onClick={clearMedia}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                    >
                      ×
                    </Button>
                  </div>
                )}

                {/* Media Upload */}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Image className="w-4 h-4" />
                    Photo
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Video
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => {
                      setShowCreatePost(false);
                      setNewPostContent('');
                      clearMedia();
                    }}
                    variant="outline"
                    disabled={creatingPost}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={creatingPost || (!newPostContent.trim() && !selectedMedia)}
                    className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:opacity-90"
                  >
                    {creatingPost ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Posts Feed */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-xl font-semibold text-[#2d3f51] mb-6">Social Feed</h2>
          
          {postsLoading && posts.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3f51] mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl text-[#667eea] mb-4 block animate-bounce">📱</span>
              <p className="text-base text-[#7a736b]">No posts yet. Create the first post!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <SocialPostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id}
                  onReaction={addReaction}
                  onComment={addComment}
                  onShare={sharePost}
                />
              ))}
              
              {/* Load More Trigger */}
              <div ref={observerRef} className="h-4">
                {postsLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2d3f51] mx-auto"></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Facebook-Style Post Creator */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-white rounded-2xl border border-[#dadde1] shadow-sm p-4">
            {/* What's on your mind? */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1877f2] to-[#42a5f5] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user ? (user.email?.charAt(0).toUpperCase() || 'U') : 'G'}
                </span>
              </div>
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex-1 bg-[#f0f2f5] hover:bg-[#e4e6ea] rounded-full px-4 py-3 text-left text-[#65676b] transition-colors"
              >
                What's on your mind?
              </button>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-[#dadde1] pt-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center justify-center space-x-2 p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
                >
                  <Camera className="w-5 h-5 text-[#45bd62]" />
                  <span className="text-[#65676b] font-medium text-sm">Photo/Video</span>
                </button>
                
                <button
                  onClick={() => setShowPollCreator(true)}
                  className="flex items-center justify-center space-x-2 p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-[#f3425f]" />
                  <span className="text-[#65676b] font-medium text-sm">Poll</span>
                </button>
                
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center justify-center space-x-2 p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
                >
                  <Smile className="w-5 h-5 text-[#f7b928]" />
                  <span className="text-[#65676b] font-medium text-sm">Feeling</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Poll Creator Modal */}
        <PollCreator
          isOpen={showPollCreator}
          onClose={() => setShowPollCreator(false)}
          onCreatePoll={async (pollData) => {
            try {
              await createPoll(pollData);
              toast({
                title: "Success!",
                description: "Your poll has been created.",
              });
              setShowPollCreator(false);
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to create poll. Please try again.",
                variant: "destructive"
              });
            }
          }}
        />

        {/* Active Polls Section */}
        {polls.length > 0 && (
          <div className="mb-8 animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-xl font-semibold text-[#2d3f51] mb-6 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-[#1877f2]" />
              <span>Active Polls</span>
            </h2>
            
            {pollsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1877f2] mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {polls.map((poll) => (
                  <PollDisplay
                    key={poll.id}
                    poll={poll}
                    onVote={votePoll}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Messages Section */}
        <div className="glass-card p-8 animate-fade-up" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-xl font-semibold text-[#2d3f51] mb-6">Recent Messages</h2>
          
          {messagesLoading ? (
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
                   style={{ animationDelay: `${0.8 + (index * 0.1)}s` }}
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