import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

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
  poll_options: PollOption[];
  user_votes?: string[]; // Option IDs the user has voted for
}

interface PollDisplayProps {
  poll: Poll;
  onVote: (pollId: string, optionIds: string[]) => Promise<void>;
  showResults?: boolean;
}

const PollDisplay: React.FC<PollDisplayProps> = ({
  poll,
  onVote,
  showResults = false
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [showResultsMode, setShowResultsMode] = useState(showResults);
  const { user } = useAuth();

  // Calculate vote percentages
  const totalVotes = poll.vote_count || 0;
  const optionsWithPercentages = poll.poll_options.map(option => ({
    ...option,
    percentage: totalVotes > 0 ? ((option.vote_count || 0) / totalVotes) * 100 : 0
  }));

  useEffect(() => {
    setHasVoted(poll.user_votes && poll.user_votes.length > 0);
    if (poll.user_votes) {
      setSelectedOptions(poll.user_votes);
    }
  }, [poll.user_votes]);

  const handleOptionSelect = (optionId: string) => {
    if (hasVoted || poll.poll_status === 'closed') return;

    if (poll.allow_multiple_selections) {
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = async () => {
    if (selectedOptions.length === 0 || voting) return;

    setVoting(true);
    try {
      await onVote(poll.id, selectedOptions);
      setHasVoted(true);
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setVoting(false);
    }
  };

  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();
  const isPollClosed = poll.poll_status === 'closed' || isExpired;

  const getTimeRemaining = () => {
    if (!poll.expires_at) return null;
    const now = new Date();
    const expiry = new Date(poll.expires_at);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Less than 1h remaining';
  };

  return (
    <div className="bg-white rounded-2xl border border-[#dadde1] shadow-sm p-4 mb-4">
      {/* Poll Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-5 h-5 text-[#1877f2]" />
            <span className="text-sm font-medium text-[#65676b]">Poll</span>
            {isPollClosed && (
              <span className="text-xs bg-[#f0f2f5] text-[#65676b] px-2 py-1 rounded-full">
                Closed
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-[#1c1e21] mb-2">
            {poll.question}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-[#65676b]">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{totalVotes} votes</span>
            </div>
            {poll.expires_at && (
              <div className="flex items-center space-x-1">
                <span>{getTimeRemaining()}</span>
              </div>
            )}
          </div>
        </div>
        
        {(hasVoted || totalVotes > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResultsMode(!showResultsMode)}
            className="text-[#1877f2] hover:bg-[#e7f3ff]"
          >
            <Eye className="w-4 h-4 mr-1" />
            {showResultsMode ? 'Hide' : 'Show'} Results
          </Button>
        )}
      </div>

      {/* Poll Options */}
      <div className="space-y-3">
        {optionsWithPercentages.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const userVotedThis = poll.user_votes?.includes(option.id);
          
          return (
            <div key={option.id} className="relative">
              {showResultsMode ? (
                // Results view
                <div className="relative">
                  <div 
                    className="absolute inset-0 bg-[#e7f3ff] rounded-lg transition-all duration-500"
                    style={{ width: `${option.percentage}%` }}
                  />
                  <div className="relative flex items-center justify-between p-3 rounded-lg border border-[#dadde1] bg-white">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#1c1e21] font-medium">
                        {option.option_text}
                      </span>
                      {userVotedThis && (
                        <CheckCircle className="w-4 h-4 text-[#42b883]" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-[#65676b]">
                        {option.vote_count || 0}
                      </span>
                      <span className="text-sm font-medium text-[#1877f2]">
                        {option.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // Voting view
                <button
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={hasVoted || isPollClosed}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-[#1877f2] bg-[#e7f3ff]'
                      : hasVoted || isPollClosed
                      ? 'border-[#dadde1] bg-[#f0f2f5] cursor-not-allowed'
                      : 'border-[#dadde1] hover:border-[#8a8d91] hover:bg-[#f8f9fa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      hasVoted || isPollClosed ? 'text-[#65676b]' : 'text-[#1c1e21]'
                    }`}>
                      {option.option_text}
                    </span>
                    {isSelected && !hasVoted && (
                      <CheckCircle className="w-5 h-5 text-[#1877f2]" />
                    )}
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Vote Button */}
      {!hasVoted && !isPollClosed && !showResultsMode && (
        <div className="mt-4 pt-4 border-t border-[#dadde1]">
          <Button
            onClick={handleVote}
            disabled={selectedOptions.length === 0 || voting}
            className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white"
          >
            {voting ? 'Voting...' : 'Vote'}
          </Button>
        </div>
      )}

      {/* Poll Settings Info */}
      {(poll.anonymous_voting || poll.allow_multiple_selections) && (
        <div className="mt-3 pt-3 border-t border-[#dadde1]">
          <div className="flex flex-wrap gap-2 text-xs text-[#65676b]">
            {poll.anonymous_voting && (
              <span className="bg-[#f0f2f5] px-2 py-1 rounded-full">
                Anonymous voting
              </span>
            )}
            {poll.allow_multiple_selections && (
              <span className="bg-[#f0f2f5] px-2 py-1 rounded-full">
                Multiple selections allowed
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PollDisplay;