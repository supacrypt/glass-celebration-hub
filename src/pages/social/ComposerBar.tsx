import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Image, 
  Video, 
  MapPin, 
  Smile, 
  X, 
  Play,
  Users,
  Calendar,
  Gift,
  Camera,
  Mic,
  FileText,
  Heart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'audio';
  preview: string;
  size: number;
}

interface ComposerBarProps {
  onPost?: (content: string, media: File[], location?: string, tags?: string[]) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const ComposerBar: React.FC<ComposerBarProps> = ({
  onPost,
  placeholder = "What's happening with your wedding planning?",
  maxLength = 280,
  className = ''
}) => {
  const { profile } = useAuth();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [location, setLocation] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Wedding-themed emoji categories
  const weddingEmojis = {
    hearts: ['💍', '💕', '💖', '💗', '💘', '💝', '💞', '💟', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤'],
    celebration: ['🎉', '🥳', '🎊', '✨', '🎈', '🎆', '🎇', '🌟', '⭐', '💫', '🎁', '🎀', '🌸', '🌺', '🌻', '🌹'],
    wedding: ['👰', '🤵', '💒', '⛪', '🕊️', '🦋', '🌿', '🍾', '🥂', '🍰', '💐', '💒', '👑', '💎', '🎭', '🎼']
  };

  const popularEmojis = [
    ...weddingEmojis.hearts.slice(0, 5),
    ...weddingEmojis.celebration.slice(0, 5),
    ...weddingEmojis.wedding.slice(0, 6)
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(event.target.files || []);
    
    files.forEach((file) => {
      if (mediaFiles.length >= 4) return; // Max 4 media files
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMedia: MediaFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          preview: e.target?.result as string,
          size: file.size
        };
        
        setMediaFiles(prev => [...prev, newMedia]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    event.target.value = '';
  };

  const removeMedia = (id: string) => {
    setMediaFiles(prev => prev.filter(media => media.id !== id));
  };

  const handleEmojiClick = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handlePost = () => {
    if (!content.trim() && mediaFiles.length === 0) return;
    
    const tags = extractHashtags(content);
    onPost?.(content, mediaFiles.map(m => m.file), location || undefined, tags);
    
    // Reset form
    setContent('');
    setMediaFiles([]);
    setLocation('');
    setIsExpanded(false);
    setShowLocationInput(false);
  };

  const extractHashtags = (text: string): string[] => {
    const hashtags = text.match(/#\w+/g) || [];
    return hashtags.map(tag => tag.slice(1)); // Remove # symbol
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRemainingChars = () => maxLength - content.length;
  const isNearLimit = getRemainingChars() <= 20;
  const isOverLimit = getRemainingChars() < 0;

  return (
    <Card 
      className={`fixed bottom-20 left-0 right-0 z-50 border-t border-white/20 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 100%)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        boxShadow: '0 -8px 32px rgba(0, 33, 71, 0.1), 0 -4px 16px rgba(255, 215, 0, 0.1)',
        borderTop: '1px solid rgba(255, 215, 0, 0.3)',
      }}
    >
      <CardContent className="p-4 max-w-4xl mx-auto">
        {/* Main Composer */}
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 border-2 border-white/50">
            <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || 'User'} />
            <AvatarFallback className="bg-wedding-gold text-white">
              {profile?.first_name ? profile.first_name[0] : 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            {/* Text Input */}
            <div className="relative">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className={`min-h-[60px] resize-none border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 ${
                  isExpanded ? 'min-h-[120px]' : ''
                }`}
                onFocus={() => setIsExpanded(true)}
                maxLength={maxLength + 50} // Allow slight overflow for better UX
              />
              
              {/* Character Counter */}
              {isExpanded && (
                <div className="absolute bottom-2 right-2">
                  <Badge 
                    variant={isOverLimit ? 'destructive' : isNearLimit ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {getRemainingChars()}
                  </Badge>
                </div>
              )}
            </div>

            {/* Location Input */}
            {showLocationInput && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <MapPin className="w-4 h-4 text-blue-600" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Add a location..."
                  className="flex-1 bg-transparent border-0 outline-none text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLocationInput(false)}
                  className="w-6 h-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* Media Preview */}
            {mediaFiles.length > 0 && (
              <div className={`grid gap-2 ${
                mediaFiles.length === 1 ? 'grid-cols-1' :
                mediaFiles.length === 2 ? 'grid-cols-2' :
                'grid-cols-2 md:grid-cols-3'
              }`}>
                {mediaFiles.map((media) => (
                  <div key={media.id} className="relative group">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100">
                      {media.type === 'image' ? (
                        <img
                          src={media.preview}
                          alt="Preview"
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="relative">
                          <video
                            src={media.preview}
                            className="w-full h-32 object-cover"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Remove button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMedia(media.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    
                    {/* File info */}
                    <div className="absolute bottom-1 left-1 right-1">
                      <Badge variant="secondary" className="text-xs bg-black/50 text-white">
                        {formatFileSize(media.size)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-80">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Wedding Emojis</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmojiPicker(false)}
                      className="w-6 h-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {/* Popular */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Popular</p>
                    <div className="grid grid-cols-8 gap-1">
                      {popularEmojis.map((emoji, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 text-lg hover:bg-blue-50"
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  {Object.entries(weddingEmojis).map(([category, emojis]) => (
                    <div key={category}>
                      <p className="text-xs text-muted-foreground mb-2 capitalize">{category}</p>
                      <div className="grid grid-cols-8 gap-1">
                        {emojis.map((emoji, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 text-lg hover:bg-blue-50"
                            onClick={() => handleEmojiClick(emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {/* Image Upload */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 p-0 text-blue-600 hover:bg-blue-50"
                  disabled={mediaFiles.length >= 4}
                  aria-label="Add photos"
                >
                  <Image className="w-4 h-4" />
                </Button>

                {/* Video Upload */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => videoInputRef.current?.click()}
                  className="w-9 h-9 p-0 text-purple-600 hover:bg-purple-50"
                  disabled={mediaFiles.length >= 4}
                  aria-label="Add video"
                >
                  <Video className="w-4 h-4" />
                </Button>

                {/* Emoji Picker */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-9 h-9 p-0 text-yellow-600 hover:bg-yellow-50"
                  aria-label="Add emoji"
                >
                  <Smile className="w-4 h-4" />
                </Button>

                {/* Location */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLocationInput(!showLocationInput)}
                  className="w-9 h-9 p-0 text-green-600 hover:bg-green-50"
                  aria-label="Add location"
                >
                  <MapPin className="w-4 h-4" />
                </Button>

                {/* Wedding-specific actions */}
                <div className="hidden sm:flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 text-pink-600 hover:bg-pink-50"
                    aria-label="Tag wedding vendors"
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 text-indigo-600 hover:bg-indigo-50"
                    aria-label="Add to timeline"
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 text-orange-600 hover:bg-orange-50"
                    aria-label="Wedding registry item"
                  >
                    <Gift className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Post Button */}
              <Button
                onClick={handlePost}
                disabled={(!content.trim() && mediaFiles.length === 0) || isOverLimit}
                className="gap-2 bg-wedding-gold hover:bg-wedding-gold/90 text-white"
                size="sm"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Post</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'image')}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'video')}
        />
      </CardContent>
    </Card>
  );
};

export default ComposerBar;