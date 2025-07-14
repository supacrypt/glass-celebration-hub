import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PresenceProvider } from '@/hooks/usePresence';
import { useSocialPosts } from '@/hooks/useSocialPosts';
import { useWeddingStories } from '@/hooks/useWeddingStories';
import SocialHeader from './SocialHeader';
import StoriesStrip from './StoriesStrip';
import FeedCard from './FeedCard';
import ComposerBar from './ComposerBar';
import CallFab from './CallFab';
import InstantMessengerCard from '@/components/social/InstantMessengerCard';

interface SocialPageProps {
  isPopup?: boolean;
  onClose?: () => void;
}

const SocialPage: React.FC<SocialPageProps> = ({ isPopup = false, onClose }) => {
  const { user } = useAuth();
  const { posts, loading: postsLoading, createPost, addReaction, loadMore } = useSocialPosts();
  const { stories, loading: storiesLoading, createStory } = useWeddingStories();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Transform Supabase posts to match FeedCard interface
  const transformedPosts = posts.map(post => ({
    id: post.id,
    user_id: post.user_id,
    user_name: post.profiles?.display_name || 
              `${post.profiles?.first_name || ''} ${post.profiles?.last_name || ''}`.trim() || 
              'Anonymous User',
    user_avatar: post.profiles?.avatar_url,
    content: post.content || '',
    created_at: post.created_at,
    media_attachments: post.media_url ? [{
      id: post.id,
      type: post.media_type?.includes('video') ? 'video' as const : 'image' as const,
      url: post.media_url,
      thumbnail_url: post.media_thumbnail,
      alt_text: 'User uploaded media'
    }] : [],
    reactions: Object.entries(post.reaction_counts).map(([emoji, count]) => ({
      emoji: emoji === 'like' ? '❤️' : 
             emoji === 'love' ? '😍' : 
             emoji === 'laugh' ? '😂' : 
             emoji === 'wow' ? '😲' : 
             emoji === 'sad' ? '😢' : 
             emoji === 'angry' ? '😠' : '❤️',
      count: count as number,
      hasReacted: post.user_reaction === emoji
    })),
    comment_count: post.comment_count,
    is_wedding_related: true, // All posts in wedding app are wedding related
  }));

  // Transform Supabase stories to match StoriesStrip interface
  const transformedStories = stories.map(story => ({
    id: story.id,
    user_id: story.user_id,
    user_name: story.profiles?.display_name || 
              `${story.profiles?.first_name || ''} ${story.profiles?.last_name || ''}`.trim() || 
              'Anonymous User',
    user_avatar: story.profiles?.avatar_url,
    media_url: story.media_url,
    media_type: story.media_type as 'image' | 'video',
    created_at: story.created_at,
    expires_at: story.expires_at,
    is_viewed: story.is_viewed
  }));

  const handlePost = async (content: string, media: File[], location?: string, tags?: string[]) => {
    if (!content.trim() && media.length === 0) return;
    
    // For now, handle single media file
    const mediaFile = media.length > 0 ? media[0] : undefined;
    await createPost(content, mediaFile);
  };

  const handleLike = async (postId: string, emoji: string) => {
    // Map emoji to reaction type
    const reactionType = emoji === '❤️' ? 'like' :
                        emoji === '😍' ? 'love' :
                        emoji === '😂' ? 'laugh' :
                        emoji === '😲' ? 'wow' :
                        emoji === '😢' ? 'sad' :
                        emoji === '😠' ? 'angry' : 'like';
    
    await addReaction(postId, reactionType);
  };

  const handleComment = async (postId: string, content: string) => {
    
  };

  const handleShare = async (postId: string) => {
    
  };

  const handleStartVideoCall = () => {
    
  };

  const handleStartAudioCall = () => {
    
  };

  const handleAddStory = async () => {
    
  };

  const handleViewStory = (story: any) => {
    
  };

  // Set up infinite scroll
  useEffect(() => {
    const scrollableElement = isPopup ? scrollContainerRef.current : window;
    if (!scrollableElement) return;

    const handleScroll = () => {
      if (postsLoading) return;
      let scrollCondition = false;

      if (isPopup && scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        // Trigger load more when 80% of the container is scrolled
        scrollCondition = scrollTop + clientHeight >= scrollHeight * 0.8;
      } else {
        scrollCondition = 
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000;
      }

      if (scrollCondition) {
        loadMore();
      }
    };

    scrollableElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollableElement.removeEventListener('scroll', handleScroll);
    };
  }, [isPopup, loadMore, postsLoading]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please sign in to access Wedding Social</h2>
          <p className="text-gray-600">Connect with your wedding party and share special moments</p>
        </div>
      </div>
    );
  }

  return (
    <PresenceProvider>
      <div className={`${isPopup ? 'h-full flex flex-col' : 'min-h-screen'} bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50`}>
        <SocialHeader
          isPopup={isPopup}
          onClose={onClose}
          onVideoCall={handleStartVideoCall}
          onAudioCall={handleStartAudioCall}
          onSearch={() => console.log('Search clicked')}
          onNotifications={() => console.log('Notifications clicked')}
          onSettings={() => console.log('Settings clicked')}
        />

        {isPopup ? (
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4"
            style={{ height: 'calc(100vh - 140px)' }}
          >
            <div className="max-w-3xl mx-auto space-y-6">
              <InstantMessengerCard className="mb-6" />
              <StoriesStrip 
                stories={transformedStories}
                onAddStory={handleAddStory}
                onViewStory={handleViewStory}
              />
              <ComposerBar onPost={handlePost} />
              
              {postsLoading && transformedPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-navy mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading posts...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transformedPosts.map(post => (
                    <FeedCard 
                      key={post.id}
                      post={post}
                      onLike={(emoji) => handleLike(post.id, emoji)}
                      onComment={(content) => handleComment(post.id, content)}
                      onShare={() => handleShare(post.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            className="grid max-w-7xl w-full mx-auto px-4 lg:grid-cols-12 pb-44 pt-6 gap-8"
          >
            {/* Left Sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6 space-y-6">
              <div className="glass-card p-4">
                <h3 className="font-bold text-lg mb-4">Navigation</h3>
                {/* Placeholder */}
              </div>
              <div className="glass-card p-4">
                <h3 className="font-bold text-lg mb-4">Upcoming Events</h3>
                {/* Placeholder */}
              </div>
            </div>
          </aside>

            {/* Main Content */}
            <main className="lg:col-span-6 space-y-6">
            <StoriesStrip 
              stories={transformedStories}
              onAddStory={handleAddStory}
              onViewStory={handleViewStory}
            />
            <ComposerBar onPost={handlePost} />
            
            {postsLoading && transformedPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-navy mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading posts...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transformedPosts.map(post => (
                  <FeedCard 
                    key={post.id}
                    post={post}
                    onLike={(emoji) => handleLike(post.id, emoji)}
                    onComment={(content) => handleComment(post.id, content)}
                    onShare={() => handleShare(post.id)}
                  />
                ))}
              </div>
            )}
            </main>

            {/* Right Sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6 space-y-6">
              <div className="glass-card p-4">
                <h3 className="font-bold text-lg mb-4">Guest List</h3>
                {/* Placeholder */}
              </div>
              <div className="glass-card p-4">
                <h3 className="font-bold text-lg mb-4">Photo Albums</h3>
                {/* Placeholder */}
              </div>
            </div>
            </aside>
          </div>
        )}

        {!isPopup && (
          <CallFab
            onStartVideoCall={handleStartVideoCall}
            onStartAudioCall={handleStartAudioCall}
          />
        )}
      </div>
    </PresenceProvider>
  );
};

export default SocialPage;