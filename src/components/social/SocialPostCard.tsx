import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface SocialPost {
  id: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  created_at: string;
  user_id: string;
  profiles: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    avatar_url?: string;
  };
  post_reactions: Array<{
    id: string;
    user_id: string;
    reaction_type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  }>;
  post_comments: Array<{
    id: string;
    content: string;
    user_id: string;
  }>;
}

interface SocialPostCardProps {
  post: SocialPost;
  currentUserId?: string;
  onReaction: (postId: string, reactionType: string) => void;
  onComment: (postId: string, content: string) => void;
  onShare: (postId: string) => void;
}

const REACTION_EMOJIS = {
  like: '👍',
  love: '❤️',
  laugh: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😡'
};

export const SocialPostCard: React.FC<SocialPostCardProps> = ({
  post,
  currentUserId,
  onReaction,
  onComment,
  onShare
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  const getDisplayName = () => {
    if (post.profiles?.display_name) {
      return post.profiles.display_name;
    }
    if (post.profiles?.first_name && post.profiles?.last_name) {
      return `${post.profiles.first_name} ${post.profiles.last_name}`;
    }
    return 'Anonymous User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

  const handleReaction = (reactionType: string) => {
    onReaction(post.id, reactionType);
    setShowReactions(false);
    toast({
      title: "Reaction added!",
      description: `You reacted with ${REACTION_EMOJIS[reactionType as keyof typeof REACTION_EMOJIS]}`,
    });
  };

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText.trim());
      setCommentText('');
      toast({
        title: "Comment posted!",
        description: "Your comment has been added to the post.",
      });
    }
  };

  const handleShare = () => {
    onShare(post.id);
    toast({
      title: "Post shared!",
      description: "The post has been shared.",
    });
  };

  const userReaction = post.post_reactions.find(r => r.user_id === currentUserId);
  const reactionCounts = post.post_reactions.reduce((acc, reaction) => {
    acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="glass-card mb-4 sm:mb-6 animate-fade-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
              <AvatarImage src={post.profiles?.avatar_url} />
              <AvatarFallback className="bg-[#2d3f51] text-white text-sm font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-[#2d3f51] text-sm sm:text-base">
                {getDisplayName()}
              </h4>
              <p className="text-xs text-[#7a736b]">
                {formatTimeAgo(post.created_at)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-[#7a736b] hover:text-[#2d3f51]">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Post Content */}
        {post.content && (
          <p className="text-[#2d3f51] mb-4 leading-relaxed text-sm sm:text-base">
            {post.content}
          </p>
        )}

        {/* Media Content */}
        {post.media_url && (
          <div className="mb-4 rounded-lg overflow-hidden">
            {post.media_type === 'image' ? (
              <img 
                src={post.media_url} 
                alt="Post media"
                className="w-full h-auto max-h-96 object-cover"
              />
            ) : post.media_type === 'video' ? (
              <video 
                src={post.media_url}
                controls
                className="w-full h-auto max-h-96"
              >
                Your browser doesn't support video playback.
              </video>
            ) : null}
          </div>
        )}

        {/* Reaction Summary */}
        {post.post_reactions.length > 0 && (
          <div className="flex items-center gap-2 mb-3 text-sm text-[#7a736b]">
            <div className="flex -space-x-1">
              {Object.entries(reactionCounts).slice(0, 3).map(([type, count]) => (
                <span key={type} className="text-base">
                  {REACTION_EMOJIS[type as keyof typeof REACTION_EMOJIS]}
                </span>
              ))}
            </div>
            <span>{post.post_reactions.length} reaction{post.post_reactions.length !== 1 ? 's' : ''}</span>
            {post.post_comments.length > 0 && (
              <>
                <span>•</span>
                <span>{post.post_comments.length} comment{post.post_comments.length !== 1 ? 's' : ''}</span>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.2)] pt-3">
          <div className="flex items-center gap-1">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReactions(!showReactions)}
                className={`flex items-center gap-2 transition-colors ${
                  userReaction 
                    ? 'text-[#EC4899] hover:text-[#EC4899]/80' 
                    : 'text-[#7a736b] hover:text-[#2d3f51]'
                }`}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${userReaction ? 'fill-current' : ''}`} />
                <span className="text-xs sm:text-sm">
                  {userReaction ? REACTION_EMOJIS[userReaction.reaction_type] : 'Like'}
                </span>
              </Button>
              
              {/* Reaction Picker */}
              {showReactions && (
                <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-lg border flex gap-1 animate-fade-up">
                  {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => (
                    <button
                      key={type}
                      onClick={() => handleReaction(type)}
                      className="text-2xl hover:scale-110 transition-transform p-1 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-[#7a736b] hover:text-[#2d3f51]"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm">Comment</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2 text-[#7a736b] hover:text-[#2d3f51]"
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm">Share</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 border-t border-[rgba(255,255,255,0.2)] pt-4">
            {/* Comment Input */}
            <div className="flex gap-2 mb-4">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-[#2d3f51] text-white text-xs">
                  You
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 bg-gradient-to-br from-[rgba(230,222,214,0.3)] to-[rgba(245,237,228,0.3)] border border-[rgba(255,255,255,0.5)] rounded-lg text-sm text-[#2d3f51] placeholder-[#7a736b] focus:outline-none focus:border-[rgba(102,126,234,0.5)]"
                  maxLength={280}
                />
                <Button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:opacity-90"
                >
                  Post
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {post.post_comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-[#2d3f51] text-white text-xs">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gradient-to-br from-[rgba(230,222,214,0.3)] to-[rgba(245,237,228,0.3)] border border-[rgba(255,255,255,0.3)] rounded-lg p-3">
                      <p className="text-sm text-[#2d3f51]">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};