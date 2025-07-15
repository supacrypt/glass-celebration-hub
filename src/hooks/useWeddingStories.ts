import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WeddingStory {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  expires_at: string;
  is_viewed: boolean;
  profiles?: {
    display_name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export const useWeddingStories = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<WeddingStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      // Get all active stories (not expired)
      const { data: storiesData, error: storiesError } = await supabase
        .from('social_stories')
        .select(`
          *,
          profiles!social_stories_user_id_fkey (
            display_name,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (storiesError) throw storiesError;

      if (storiesData) {
        // Check which stories the current user has viewed
        const storyIds = storiesData.map(story => story.id);
        const { data: viewedStories } = await supabase
          .from('social_story_views')
          .select('story_id')
          .eq('user_id', user.id)
          .in('story_id', storyIds);

        const viewedStoryIds = new Set(viewedStories?.map(v => v.story_id) || []);

        const storiesWithViewStatus = storiesData.map(story => ({
          ...story,
          is_viewed: viewedStoryIds.has(story.id)
        }));

        setStories(storiesWithViewStatus);
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createStory = useCallback(async (mediaFile: File) => {
    if (!user || !mediaFile) return;

    try {
      // Upload media
      const fileExt = mediaFile.name.split('.').pop();
      const fileName = `story-${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `social-stories/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('social-media')
        .upload(filePath, mediaFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('social-media')
        .getPublicUrl(filePath);

      // Create story (expires in 24 hours)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { data, error } = await supabase
        .from('social_stories')
        .insert([
          {
            user_id: user.id,
            media_url: urlData.publicUrl,
            media_type: mediaFile.type.startsWith('video/') ? 'video' : 'image',
            expires_at: expiresAt.toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Refresh stories
      await fetchStories();
    } catch (err) {
      console.error('Error creating story:', err);
      throw err;
    }
  }, [user, fetchStories]);

  const markAsViewed = useCallback(async (storyId: string) => {
    if (!user) return;

    try {
      // Check if already viewed
      const { data: existingView } = await supabase
        .from('social_story_views')
        .select('*')
        .eq('story_id', storyId)
        .eq('user_id', user.id)
        .single();

      if (!existingView) {
        // Mark as viewed
        await supabase
          .from('social_story_views')
          .insert([
            {
              story_id: storyId,
              user_id: user.id,
            },
          ]);

        // Update local state
        setStories(prev => prev.map(story => 
          story.id === storyId ? { ...story, is_viewed: true } : story
        ));
      }
    } catch (err) {
      console.error('Error marking story as viewed:', err);
    }
  }, [user]);

  const deleteStory = useCallback(async (storyId: string) => {
    if (!user) return;

    try {
      // Get story details first
      const { data: story } = await supabase
        .from('social_stories')
        .select('*')
        .eq('id', storyId)
        .eq('user_id', user.id) // Only allow deleting own stories
        .single();

      if (!story) throw new Error('Story not found or not authorized');

      // Delete from storage
      if (story.media_url) {
        const fileName = story.media_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('social-media')
            .remove([`social-stories/${fileName}`]);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('social_stories')
        .delete()
        .eq('id', storyId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh stories
      await fetchStories();
    } catch (err) {
      console.error('Error deleting story:', err);
      throw err;
    }
  }, [user, fetchStories]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return {
    stories,
    loading,
    error,
    createStory,
    markAsViewed,
    deleteStory,
    refresh: fetchStories,
  };
};