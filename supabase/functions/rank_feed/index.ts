import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Database {
  public: {
    Tables: {
      social_posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
      };
      post_reactions: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          reaction_type: string;
          created_at: string;
        };
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
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

    console.log('Starting feed ranking process...');

    // Get all posts from the last 7 days for feed ranking
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: posts, error: postsError } = await supabase
      .from('social_posts')
      .select(`
        id,
        user_id,
        content,
        created_at,
        updated_at
      `)
      .gte('created_at', sevenDaysAgo.toISOString())
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      throw postsError;
    }

    console.log(`Processing ${posts?.length || 0} posts for ranking...`);

    // Calculate engagement scores for each post
    const rankedPosts = await Promise.all(
      (posts || []).map(async (post) => {
        // Get reaction count
        const { count: reactionCount, error: reactionError } = await supabase
          .from('post_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);

        if (reactionError) {
          console.error(`Error counting reactions for post ${post.id}:`, reactionError);
        }

        // Get comment count
        const { count: commentCount, error: commentError } = await supabase
          .from('post_comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);

        if (commentError) {
          console.error(`Error counting comments for post ${post.id}:`, commentError);
        }

        // Calculate engagement score
        const reactions = reactionCount || 0;
        const comments = commentCount || 0;
        const hoursOld = Math.max(1, Math.floor(
          (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60)
        ));

        // Engagement score formula: (reactions * 1 + comments * 2) / age_hours
        // Comments are weighted more heavily than reactions
        const engagementScore = (reactions * 1 + comments * 2) / Math.log(hoursOld + 1);

        return {
          ...post,
          engagement_score: engagementScore,
          reaction_count: reactions,
          comment_count: comments,
        };
      })
    );

    // Sort by engagement score (descending)
    rankedPosts.sort((a, b) => b.engagement_score - a.engagement_score);

    console.log(`Ranked ${rankedPosts.length} posts by engagement score`);

    // For Supabase free tier optimization, we'll store the ranking logic
    // but not create a materialized view table to save storage
    // Instead, we'll log the top performers for monitoring
    const topPosts = rankedPosts.slice(0, 10);
    
    console.log('Top 10 posts by engagement:');
    topPosts.forEach((post, index) => {
      console.log(`${index + 1}. Post ${post.id}: Score ${post.engagement_score.toFixed(2)} (${post.reaction_count} reactions, ${post.comment_count} comments)`);
    });

    // Clean up old ranking data if needed (for storage optimization)
    // This helps stay within the 500MB free tier limit
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // You could implement cleanup logic here if you decide to store rankings
    // For now, we're keeping it stateless for free tier optimization

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully ranked ${rankedPosts.length} posts`,
        top_posts: topPosts.map(p => ({
          id: p.id,
          engagement_score: p.engagement_score,
          reactions: p.reaction_count,
          comments: p.comment_count
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in feed ranking:', error);
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
