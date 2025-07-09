import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface PollOption {
  id: string;
  option_text: string;
  option_order: number;
  vote_count?: number;
}

interface Poll {
  id: string;
  question: string;
  poll_type: 'multiple_choice' | 'yes_no' | 'rating';
  anonymous_voting: boolean;
  allow_multiple_selections: boolean;
  poll_status: 'active' | 'closed' | 'draft';
  vote_count: number;
  expires_at: string | null;
  created_at: string;
  post_id: string;
  poll_options: PollOption[];
  user_votes?: string[];
}

interface CreatePollData {
  question: string;
  options: string[];
  poll_type: 'multiple_choice' | 'yes_no';
  anonymous_voting: boolean;
  allow_multiple_selections: boolean;
  expires_at: string;
}

export const usePolls = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch polls with options and user votes
  const fetchPolls = async () => {
    try {
      setLoading(true);
      
      // Get polls with their options
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options(*)
        `)
        .eq('poll_status', 'active')
        .order('created_at', { ascending: false });

      if (pollsError) throw pollsError;

      // Get user votes for these polls if user is authenticated
      let userVotesData: any[] = [];
      if (user && pollsData && pollsData.length > 0) {
        const pollIds = pollsData.map(p => p.id);
        const { data: votesData, error: votesError } = await supabase
          .from('poll_votes')
          .select(`
            option_id,
            poll_options!inner(poll_id)
          `)
          .eq('user_id', user.id)
          .in('poll_options.poll_id', pollIds);

        if (!votesError) {
          userVotesData = votesData || [];
        }
      }

      // Get vote counts for each option
      const pollsWithVotes = await Promise.all(
        (pollsData || []).map(async (poll) => {
          const optionsWithCounts = await Promise.all(
            poll.poll_options.map(async (option: any) => {
              const { count } = await supabase
                .from('poll_votes')
                .select('*', { count: 'exact', head: true })
                .eq('option_id', option.id);
              
              return {
                ...option,
                vote_count: count || 0
              };
            })
          );

          // Get user votes for this poll
          const userVotes = userVotesData
            .filter(vote => vote.poll_options.poll_id === poll.id)
            .map(vote => vote.option_id);

          return {
            ...poll,
            poll_options: optionsWithCounts,
            user_votes: userVotes
          };
        })
      );

      setPolls(pollsWithVotes);
    } catch (err) {
      console.error('Error fetching polls:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  };

  // Create a new poll (simplified for demo - normally would create a post first)
  const createPoll = async (pollData: CreatePollData) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // For demo purposes, create a dummy post first
      const { data: postData, error: postError } = await supabase
        .from('social_posts')
        .insert({
          user_id: user.id,
          content: `Poll: ${pollData.question}`,
          is_published: true
        })
        .select()
        .single();

      if (postError) throw postError;

      // Create the poll
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({
          post_id: postData.id,
          question: pollData.question,
          poll_type: pollData.poll_type,
          anonymous_voting: pollData.anonymous_voting,
          allow_multiple_selections: pollData.allow_multiple_selections,
          expires_at: pollData.expires_at,
          poll_status: 'active'
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Create poll options
      const optionInserts = pollData.options.map((option, index) => ({
        poll_id: poll.id,
        option_text: option,
        option_order: index
      }));

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionInserts);

      if (optionsError) throw optionsError;

      // Refresh polls
      await fetchPolls();
      
      return poll;
    } catch (err) {
      console.error('Error creating poll:', err);
      throw err;
    }
  };

  // Vote on a poll
  const votePoll = async (pollId: string, optionIds: string[]) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Remove existing votes for this poll if it doesn't allow multiple selections
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('allow_multiple_selections')
        .eq('id', pollId)
        .single();

      if (pollError) throw pollError;

      if (!pollData.allow_multiple_selections) {
        // Delete existing votes for this poll
        await supabase
          .from('poll_votes')
          .delete()
          .eq('user_id', user.id)
          .in('option_id', (await supabase
            .from('poll_options')
            .select('id')
            .eq('poll_id', pollId)
          ).data?.map(opt => opt.id) || []);
      }

      // Insert new votes
      const voteInserts = optionIds.map(optionId => ({
        user_id: user.id,
        option_id: optionId
      }));

      const { error: voteError } = await supabase
        .from('poll_votes')
        .insert(voteInserts);

      if (voteError) throw voteError;

      // Refresh polls to get updated counts
      await fetchPolls();
    } catch (err) {
      console.error('Error voting on poll:', err);
      throw err;
    }
  };

  // Setup real-time subscription
  useEffect(() => {
    fetchPolls();

    // Subscribe to poll changes
    const channel = supabase
      .channel('polls_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'polls'
        },
        () => {
          fetchPolls();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'poll_votes'
        },
        () => {
          fetchPolls();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    polls,
    loading,
    error,
    createPoll,
    votePoll,
    refetch: fetchPolls
  };
};