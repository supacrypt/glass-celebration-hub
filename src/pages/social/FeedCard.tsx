import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal, 
  MapPin,
  Clock,
  Play,
  Volume2,
  VolumeX,
  Send,
  Smile,
  Camera,
  Video
} from 'lucide-react';
import { usePresence } from '@/hooks/usePresence';
import { formatDistanceToNow } from 'date-fns';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
  hasReacted: boolean;
}

interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
  reply_to?: string;
}

interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail_url?: string;
  duration?: number; // for video/audio
  size?: number;
  alt_text?: string;
}

interface FeedPost {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
  location?: string;
  media_attachments: MediaAttachment[];
  reactions: Reaction[];
  comments: Comment[];
  comment_count: number;
  share_count: number;
  is_wedding_related: boolean;
  tags: string[];
}

interface FeedCardProps {
  post: FeedPost;
  onLike?: (postId: string, emoji: string) => void;
  onComment?: (postId: string, content: string, replyTo?: string) => void;
  onShare?: (postId: string) => void;
  onUserClick?: (userId: string) => void;
  className?: string;
}

const FeedCard: React.FC<FeedCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onUserClick,
  className = ''
}) => {
  const { onlineUsers } = usePresence();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const isUserOnline = (userId: string) => {
    return onlineUsers.some(user => user.user_id === userId);
  };

  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleReaction = (emoji: string) => {
    onLike?.(post.id, emoji);
    setShowReactionPicker(false);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      onComment?.(post.id, newComment.trim());
      setNewComment('');
    }
  };

  const toggleVideoPlay = (mediaId: string) => {
    setPlayingVideo(playingVideo === mediaId ? null : mediaId);
  };

  const toggleVideoMute = (mediaId: string) => {
    const newMuted = new Set(mutedVideos);
    if (newMuted.has(mediaId)) {
      newMuted.delete(mediaId);
    } else {
      newMuted.add(mediaId);
    }
    setMutedVideos(newMuted);
  };

  const popularReactions = ['❤️', '😍', '🎉', '💍', '👏', '😂'];

  return (
    <Card className={`w-full bg-white/80 backdrop-blur-md border border-white/30 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ${className}`}>
      {/* Post Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-white/50 to-white/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar 
                className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-wedding-gold transition-all"
                onClick={() => onUserClick?.(post.user_id)}
              >
                <AvatarImage src={post.user_avatar} alt={post.user_name} />
                <AvatarFallback className="bg-gradient-to-br from-wedding-gold to-yellow-500 text-white font-bold">
                  {post.user_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {isUserOnline(post.user_id) && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span 
                  className="font-semibold text-wedding-navy cursor-pointer hover:underline"
                  onClick={() => onUserClick?.(post.user_id)}
                >
                  {post.user_name}
                </span>
                {post.is_wedding_related && (
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-wedding-gold/20 to-yellow-400/20 text-wedding-gold border border-wedding-gold/30">
                    💍 Wedding
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{getTimeAgo(post.created_at)}</span>
                {post.location && (
                  <>
                    <span>•</span>
                    <MapPin className="w-3 h-3" />
                    <span>{post.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 rounded-full"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Post Content */}
        {post.content && (
          <div className="text-sm leading-relaxed">
            <p>{post.content}</p>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="text-blue-600 hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Media Attachments */}
        {post.media_attachments.length > 0 && (
          <div className={`grid gap-2 ${
            post.media_attachments.length === 1 ? 'grid-cols-1' :
            post.media_attachments.length === 2 ? 'grid-cols-2' :
            'grid-cols-2 md:grid-cols-3'
          }`}>
            {post.media_attachments.map((media, index) => (
              <div key={media.id} className="relative rounded-lg overflow-hidden bg-gray-100">
                {media.type === 'image' && (
                  <img
                    src={media.url}
                    alt={media.alt_text || `Image ${index + 1}`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                )}
                
                {media.type === 'video' && (
                  <div className="relative">
                    <video
                      src={media.url}
                      poster={media.thumbnail_url}
                      className="w-full h-48 object-cover"
                      muted={mutedVideos.has(media.id)}
                      autoPlay={playingVideo === media.id}
                      loop
                    />
                    
                    {/* Video controls overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                        onClick={() => toggleVideoPlay(media.id)}
                        aria-label={playingVideo === media.id ? 'Pause video' : 'Play video'}
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                    
                    {/* Mute button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-2 right-2 w-8 h-8 p-0 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={() => toggleVideoMute(media.id)}
                      aria-label={mutedVideos.has(media.id) ? 'Unmute video' : 'Mute video'}
                    >
                      {mutedVideos.has(media.id) ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                    
                    {/* Video duration */}
                    {media.duration && (
                      <Badge 
                        variant="secondary" 
                        className="absolute bottom-2 left-2 bg-black/50 text-white"
                      >
                        {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reactions Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-wedding-gold/20">
          <div className="flex items-center gap-4">
            {/* Like/Reaction Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-red-50 hover:text-red-600 transition-colors group"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                onMouseLeave={() => setTimeout(() => setShowReactionPicker(false), 200)}
              >
                <Heart className={`w-4 h-4 ${
                  post.reactions.some(r => r.hasReacted) 
                    ? 'fill-red-500 text-red-500' 
                    : 'group-hover:text-red-500'
                }`} />
                <span className="text-sm">
                  {post.reactions.reduce((acc, r) => acc + r.count, 0) || 'Like'}
                </span>
              </Button>
              
              {/* Reaction Picker */}
              {showReactionPicker && (
                <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-white/50 p-2 z-10">
                  {popularReactions.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 text-lg hover:scale-125 transition-transform"
                      onClick={() => handleReaction(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Button */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.comment_count || 'Comment'}</span>
            </Button>

            {/* Share Button */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-green-50 hover:text-green-600 transition-colors"
              onClick={() => onShare?.(post.id)}
            >
              <Share className="w-4 h-4" />
              <span className="text-sm">{post.share_count || 'Share'}</span>
            </Button>
          </div>

          {/* Reaction Summary */}
          {post.reactions.length > 0 && (
            <div className="flex items-center gap-1">
              {post.reactions.slice(0, 3).map((reaction, index) => (
                <span key={index} className="text-sm">
                  {reaction.emoji}
                </span>
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                {post.reactions.reduce((acc, r) => acc + r.count, 0)}
              </span>
            </div>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-3 pt-3 border-t border-wedding-gold/20">
            {/* Comment Input */}
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-gradient-to-br from-wedding-gold to-yellow-500 text-white font-semibold">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleComment}
                    disabled={!newComment.trim()}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Post
                  </Button>
                </div>
              </div>
            </div>

            {/* Existing Comments */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user_avatar} alt={comment.user_name} />
                  <AvatarFallback className="text-xs">
                    {comment.user_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-gray-50/80 to-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{comment.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 ml-3">
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedCard;