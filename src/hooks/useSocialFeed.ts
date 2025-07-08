import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  created_at: string;
  updated_at: string;
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
    created_at: string;
  }>;
}

export const useSocialFeed = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const POSTS_PER_PAGE = 10;

  // Fetch posts with pagination
  const fetchPosts = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('social_posts')
        .select(`
          id,
          user_id,
          content,
          media_url,
          media_type,
          created_at,
          updated_at,
          profiles!social_posts_user_id_fkey (
            first_name,
            last_name,
            display_name,
            avatar_url
          ),
          post_reactions (
            id,
            user_id,
            reaction_type
          ),
          post_comments (
            id,
            content,
            user_id,
            created_at
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(pageNum * POSTS_PER_PAGE, (pageNum + 1) * POSTS_PER_PAGE - 1);

      if (fetchError) {
        throw fetchError;
      }

      const typedData = data as SocialPost[];

      if (append) {
        setPosts(prev => [...prev, ...typedData]);
      } else {
        setPosts(typedData);
      }

      setHasMore(typedData.length === POSTS_PER_PAGE);
      
    } catch (err) {
      console.error('Error fetching social posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      toast({
        title: "Error",
        description: "Failed to load social posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load more posts (infinite scroll)
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, true);
    }
  }, [loading, hasMore, page, fetchPosts]);

  // Create a new post
  const createPost = useCallback(async (content: string, mediaFile?: File) => {
    if (!user) return { error: { message: 'User not authenticated' } };

    try {
      let mediaUrl = null;
      let mediaType = null;

      // Upload media if provided
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('social-posts')
          .upload(fileName, mediaFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('social-posts')
          .getPublicUrl(fileName);

        mediaUrl = publicUrl;
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
      }

      const { data, error } = await supabase
        .from('social_posts')
        .insert({
          user_id: user.id,
          content: content || null,
          media_url: mediaUrl,
          media_type: mediaType,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Refresh posts to include the new one
      await fetchPosts(0, false);
      setPage(0);

      return { data, error: null };
    } catch (err) {
      console.error('Error creating post:', err);
      return { error: err };
    }
  }, [user, fetchPosts]);

  // Add reaction to post
  const addReaction = useCallback(async (postId: string, reactionType: string) => {
    if (!user) return;

    try {
      // First, remove any existing reaction from this user on this post
      await supabase
        .from('post_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      // Then add the new reaction
      const { error } = await supabase
        .from('post_reactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          reaction_type: reactionType as any,
        });

      if (error) {
        throw error;
      }

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          // Remove existing reaction from this user
          const filteredReactions = post.post_reactions.filter(r => r.user_id !== user.id);
          // Add new reaction
          return {
            ...post,
            post_reactions: [
              ...filteredReactions,
              {
                id: Date.now().toString(),
                user_id: user.id,
                reaction_type: reactionType as any,
              }
            ]
          };
        }
        return post;
      }));

    } catch (err) {
      console.error('Error adding reaction:', err);
      toast({
        title: "Error",
        description: "Failed to add reaction. Please try again.",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Add comment to post
  const addComment = useCallback(async (postId: string, content: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            post_comments: [
              ...post.post_comments,
              {
                id: data.id,
                content: data.content,
                user_id: data.user_id,
                created_at: data.created_at,
              }
            ]
          };
        }
        return post;
      }));

    } catch (err) {
      console.error('Error adding comment:', err);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Share post (placeholder - could integrate with Web Share API)
  const sharePost = useCallback(async (postId: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Wedding Social Post',
          text: 'Check out this post from our wedding!',
          url: `${window.location.origin}/social?post=${postId}`,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/social?post=${postId}`);
        toast({
          title: "Link copied!",
          description: "Post link has been copied to clipboard.",
        });
      }
    } catch (err) {
      console.error('Error sharing post:', err);
      toast({
        title: "Error",
        description: "Failed to share post. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('social-posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'social_posts',
          filter: 'is_published=eq.true'
        },
        () => {
          // Refresh posts when new posts are added
          fetchPosts(0, false);
          setPage(0);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_reactions'
        },
        () => {
          // Refresh to get updated reaction counts
          fetchPosts(0, false);
          setPage(0);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments'
        },
        () => {
          // Refresh to get updated comments
          fetchPosts(0, false);
          setPage(0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  // Initial load
  useEffect(() => {
    fetchPosts(0, false);
    setPage(0);
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    createPost,
    addReaction,
    addComment,
    sharePost,
    refresh: () => {
      fetchPosts(0, false);
      setPage(0);
    }
  };
};