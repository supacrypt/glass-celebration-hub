import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Database {
  public: {
    Tables: {
      stories: {
        Row: {
          id: string;
          user_id: string;
          media_url: string;
          expires_at: string;
          created_at: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          chat_id: string;
          user_id: string;
          media_url: string | null;
          created_at: string;
        };
      };
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting media cleanup process...');

    // 1. Clean up expired stories
    const now = new Date().toISOString();
    
    // Get expired stories to delete their media files
    const { data: expiredStories, error: storiesError } = await supabase
      .from('stories')
      .select('id, media_url, expires_at')
      .lt('expires_at', now);

    if (storiesError) {
      console.error('Error fetching expired stories:', storiesError);
      throw storiesError;
    }

    console.log(`Found ${expiredStories?.length || 0} expired stories to clean up`);

    // Delete expired story media files from storage
    const storyFilesToDelete: string[] = [];
    
    for (const story of expiredStories || []) {
      if (story.media_url) {
        try {
          // Extract file path from URL
          const url = new URL(story.media_url);
          const pathParts = url.pathname.split('/');
          const bucketIndex = pathParts.findIndex(part => part === 'stories');
          
          if (bucketIndex !== -1 && pathParts.length > bucketIndex + 1) {
            const filePath = pathParts.slice(bucketIndex + 1).join('/');
            storyFilesToDelete.push(filePath);
          }
        } catch (urlError) {
          console.error(`Invalid URL for story ${story.id}:`, story.media_url);
        }
      }
    }

    // Delete files from storage
    if (storyFilesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('stories')
        .remove(storyFilesToDelete);

      if (storageError) {
        console.error('Error deleting story files from storage:', storageError);
      } else {
        console.log(`Successfully deleted ${storyFilesToDelete.length} story files from storage`);
      }
    }

    // Delete expired story records
    const { error: deleteStoriesError } = await supabase
      .from('stories')
      .delete()
      .lt('expires_at', now);

    if (deleteStoriesError) {
      console.error('Error deleting expired stories:', deleteStoriesError);
      throw deleteStoriesError;
    }

    // 2. Clean up old chat media (older than 30 days to save storage)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: oldChatMessages, error: chatError } = await supabase
      .from('chat_messages')
      .select('id, media_url')
      .not('media_url', 'is', null)
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (chatError) {
      console.error('Error fetching old chat messages:', chatError);
      throw chatError;
    }

    console.log(`Found ${oldChatMessages?.length || 0} old chat messages with media to clean up`);

    // Delete old chat media files from storage
    const chatFilesToDelete: string[] = [];
    
    for (const message of oldChatMessages || []) {
      if (message.media_url) {
        try {
          // Extract file path from URL
          const url = new URL(message.media_url);
          const pathParts = url.pathname.split('/');
          const bucketIndex = pathParts.findIndex(part => part === 'direct-chats');
          
          if (bucketIndex !== -1 && pathParts.length > bucketIndex + 1) {
            const filePath = pathParts.slice(bucketIndex + 1).join('/');
            chatFilesToDelete.push(filePath);
          }
        } catch (urlError) {
          console.error(`Invalid URL for message ${message.id}:`, message.media_url);
        }
      }
    }

    // Delete files from storage
    if (chatFilesToDelete.length > 0) {
      const { error: chatStorageError } = await supabase.storage
        .from('direct-chats')
        .remove(chatFilesToDelete);

      if (chatStorageError) {
        console.error('Error deleting chat files from storage:', chatStorageError);
      } else {
        console.log(`Successfully deleted ${chatFilesToDelete.length} chat files from storage`);
      }
    }

    // Clear media URLs from old chat messages (keep the message, remove media reference)
    const { error: updateChatError } = await supabase
      .from('chat_messages')
      .update({ 
        media_url: null, 
        media_type: null, 
        media_thumbnail: null 
      })
      .not('media_url', 'is', null)
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (updateChatError) {
      console.error('Error updating chat messages:', updateChatError);
      throw updateChatError;
    }

    // 3. Clean up orphaned media files in storage buckets
    // This helps maintain the 1GB storage limit
    
    // Get storage usage info
    const buckets = ['stories', 'social-posts', 'direct-chats'];
    const storageStats = [];

    for (const bucket of buckets) {
      try {
        const { data: files, error: listError } = await supabase.storage
          .from(bucket)
          .list('', { limit: 1000 });

        if (!listError && files) {
          const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
          storageStats.push({
            bucket,
            fileCount: files.length,
            totalSize: Math.round(totalSize / 1024 / 1024 * 100) / 100 // MB
          });
        }
      } catch (error) {
        console.error(`Error checking storage for bucket ${bucket}:`, error);
      }
    }

    const totalExpiredStories = expiredStories?.length || 0;
    const totalOldChatMedia = oldChatMessages?.length || 0;
    const totalFilesDeleted = storyFilesToDelete.length + chatFilesToDelete.length;

    console.log('Media cleanup completed successfully');
    console.log(`Storage stats:`, storageStats);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Media cleanup completed successfully',
        stats: {
          expired_stories_removed: totalExpiredStories,
          old_chat_media_cleaned: totalOldChatMedia,
          total_files_deleted: totalFilesDeleted,
          storage_stats: storageStats
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in media cleanup:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
