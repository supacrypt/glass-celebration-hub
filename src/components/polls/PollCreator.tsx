import React, { useState } from 'react';
import { Plus, X, BarChart3, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface PollOption {
  id: string;
  text: string;
}

interface PollCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePoll: (pollData: any) => Promise<void>;
}

const PollCreator: React.FC<PollCreatorProps> = ({
  isOpen,
  onClose,
  onCreatePoll
}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ]);
  const [pollType, setPollType] = useState<'multiple_choice' | 'yes_no'>('multiple_choice');
  const [anonymousVoting, setAnonymousVoting] = useState(false);
  const [allowMultipleSelections, setAllowMultipleSelections] = useState(false);
  const [expiresIn, setExpiresIn] = useState<number>(24); // hours
  const [creating, setCreating] = useState(false);

  const addOption = () => {
    if (options.length < 4) {
      const newId = (options.length + 1).toString();
      setOptions([...options, { id: newId, text: '' }]);
    }
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleCreatePoll = async () => {
    if (!question.trim() || options.some(opt => !opt.text.trim())) return;

    setCreating(true);
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiresIn);

      await onCreatePoll({
        question: question.trim(),
        options: options.map(opt => opt.text.trim()),
        poll_type: pollType,
        anonymous_voting: anonymousVoting,
        allow_multiple_selections: allowMultipleSelections,
        expires_at: expiresAt.toISOString()
      });

      // Reset form
      setQuestion('');
      setOptions([{ id: '1', text: '' }, { id: '2', text: '' }]);
      setPollType('multiple_choice');
      setAnonymousVoting(false);
      setAllowMultipleSelections(false);
      setExpiresIn(24);
      onClose();
    } catch (error) {
      console.error('Failed to create poll:', error);
    } finally {
      setCreating(false);
    }
  };

  const isValid = question.trim() && options.every(opt => opt.text.trim());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1877f2] to-[#42a5f5] rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#1c1e21]">Create Poll</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-[#f0f2f5] rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Question Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#65676b] mb-2">
            Ask a question
          </label>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask?"
            className="bg-[#f0f2f5] border-none focus:bg-white focus:ring-2 focus:ring-[#1877f2] rounded-lg text-[#1c1e21]"
            maxLength={280}
          />
          <div className="text-xs text-[#65676b] mt-1 text-right">
            {question.length}/280
          </div>
        </div>

        {/* Poll Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#65676b] mb-3">
            Poll type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPollType('multiple_choice')}
              className={`p-3 rounded-lg border-2 transition-all ${
                pollType === 'multiple_choice'
                  ? 'border-[#1877f2] bg-[#e7f3ff]'
                  : 'border-[#dadde1] hover:border-[#8a8d91]'
              }`}
            >
              <BarChart3 className="w-5 h-5 mx-auto mb-1 text-[#1877f2]" />
              <div className="text-sm font-medium text-[#1c1e21]">Multiple Choice</div>
            </button>
            <button
              onClick={() => setPollType('yes_no')}
              className={`p-3 rounded-lg border-2 transition-all ${
                pollType === 'yes_no'
                  ? 'border-[#1877f2] bg-[#e7f3ff]'
                  : 'border-[#dadde1] hover:border-[#8a8d91]'
              }`}
            >
              <Users className="w-5 h-5 mx-auto mb-1 text-[#1877f2]" />
              <div className="text-sm font-medium text-[#1c1e21]">Yes/No</div>
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#65676b] mb-3">
            Poll options
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="bg-[#f0f2f5] border-none focus:bg-white focus:ring-2 focus:ring-[#1877f2] rounded-lg text-[#1c1e21]"
                  />
                </div>
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                    className="p-2 hover:bg-[#f0f2f5] rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 4 && (
            <Button
              variant="ghost"
              onClick={addOption}
              className="mt-3 text-[#1877f2] hover:bg-[#e7f3ff] rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add option
            </Button>
          )}
        </div>

        {/* Settings */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-[#1c1e21]">Anonymous voting</div>
              <div className="text-xs text-[#65676b]">Hide who voted for what</div>
            </div>
            <Switch
              checked={anonymousVoting}
              onCheckedChange={setAnonymousVoting}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-[#1c1e21]">Multiple selections</div>
              <div className="text-xs text-[#65676b]">Allow choosing multiple options</div>
            </div>
            <Switch
              checked={allowMultipleSelections}
              onCheckedChange={setAllowMultipleSelections}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1c1e21] mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Expires in
            </label>
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(Number(e.target.value))}
              className="w-full bg-[#f0f2f5] border-none rounded-lg p-2 text-[#1c1e21] focus:bg-white focus:ring-2 focus:ring-[#1877f2]"
            >
              <option value={1}>1 hour</option>
              <option value={6}>6 hours</option>
              <option value={24}>1 day</option>
              <option value={72}>3 days</option>
              <option value={168}>1 week</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={creating}
            className="flex-1 border-[#dadde1] text-[#1c1e21] hover:bg-[#f0f2f5]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreatePoll}
            disabled={!isValid || creating}
            className="flex-1 bg-[#1877f2] hover:bg-[#166fe5] text-white"
          >
            {creating ? 'Creating...' : 'Create Poll'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PollCreator;