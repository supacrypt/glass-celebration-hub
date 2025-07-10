import React, { useState, useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Upload, 
  Image, 
  Video, 
  Youtube, 
  Trash2, 
  Check, 
  Settings, 
  Grid3X3,
  List,
  Eye,
  Download
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { supabase } from '@/integrations/supabase/client';

interface MediaItem {
  name: string;
  url: string;
  type: 'image' | 'video';
  size?: number;
  lastModified?: string;
}

const UnifiedMediaManager: React.FC = () => {
  const { settings, loading, updateSetting } = useAppSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'browse' | 'upload' | 'settings'>('browse');
  const { toast } = useToast();

  // Load media from Supabase storage
  const loadMediaItems = async () => {
    try {
      const { data: backgroundFiles } = await supabase.storage
        .from('backgrounds')
        .list('', { limit: 100 });

      const { data: photoFiles } = await supabase.storage
        .from('wedding-photos')
        .list('', { limit: 100 });

      const items: MediaItem[] = [];

      if (backgroundFiles) {
        backgroundFiles.forEach(file => {
          if (file.name && !file.name.includes('.emptyFolderPlaceholder')) {
            const { data } = supabase.storage.from('backgrounds').getPublicUrl(file.name);
            items.push({
              name: file.name,
              url: data.publicUrl,
              type: file.name.toLowerCase().includes('.mp4') || file.name.toLowerCase().includes('.mov') ? 'video' : 'image',
              size: file.metadata?.size,
              lastModified: file.updated_at
            });
          }
        });
      }

      if (photoFiles) {
        photoFiles.forEach(file => {
          if (file.name && !file.name.includes('.emptyFolderPlaceholder')) {
            const { data } = supabase.storage.from('wedding-photos').getPublicUrl(file.name);
            items.push({
              name: file.name,
              url: data.publicUrl,
              type: file.name.toLowerCase().includes('.mp4') || file.name.toLowerCase().includes('.mov') ? 'video' : 'image',
              size: file.metadata?.size,
              lastModified: file.updated_at
            });
          }
        });
      }

      setMediaItems(items);
    } catch (error) {
      console.error('Error loading media:', error);
      toast({
        title: "Error",
        description: "Failed to load media items",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadMediaItems();
  }, []);

  const handleSave = async (key: string, value: string) => {
    setIsSaving(true);
    try {
      await updateSetting(key as keyof typeof settings, value);
      toast({
        title: "Setting Updated",
        description: "Background setting saved successfully!",
      });
    } catch (error) {
      console.error('Error saving setting:', error);
      toast({
        title: "Error",
        description: "Failed to save setting",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const bucket = file.type.startsWith('video/') ? 'backgrounds' : 'backgrounds';
        
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) throw uploadError;
      }

      toast({
        title: "Upload Successful",
        description: `${files.length} file(s) uploaded successfully!`,
      });

      // Reload media items
      await loadMediaItems();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const setAsBackground = async (mediaUrl: string, type: 'image' | 'video') => {
    try {
      await handleSave('hero_background_url', mediaUrl);
      await handleSave('hero_background_type', type);
      setSelectedMedia(mediaUrl);
      
      toast({
        title: "Background Set",
        description: `${type === 'video' ? 'Video' : 'Image'} set as hero background!`,
      });
    } catch (error) {
      console.error('Error setting background:', error);
    }
  };

  const deleteMedia = async (mediaItem: MediaItem) => {
    try {
      const fileName = mediaItem.name;
      const bucket = mediaItem.url.includes('backgrounds') ? 'backgrounds' : 'wedding-photos';
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) throw error;

      toast({
        title: "Media Deleted",
        description: "Media item deleted successfully!",
      });

      await loadMediaItems();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete media",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2" />
          <span>Loading media manager...</span>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Image className="w-6 h-6 text-wedding-navy" />
        <div>
          <h2 className="text-2xl font-bold text-wedding-navy">Media & Background Manager</h2>
          <p className="text-muted-foreground">Unified interface for all background and video management</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'browse' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('browse')}
          className="rounded-b-none"
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          Browse Media ({mediaItems.length})
        </Button>
        <Button
          variant={activeTab === 'upload' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('upload')}
          className="rounded-b-none"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload New
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('settings')}
          className="rounded-b-none"
        >
          <Settings className="w-4 h-4 mr-2" />
          Video Settings
        </Button>
      </div>

      {/* Browse Media Tab */}
      {activeTab === 'browse' && (
        <GlassCard className="p-6">
          <div className="space-y-4">
            {/* View Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Label>Background Type:</Label>
                <select
                  className="px-3 py-2 border rounded-md"
                  value={settings.hero_background_type || 'image'}
                  onChange={(e) => handleSave('hero_background_type', e.target.value)}
                >
                  <option value="image">Image Background</option>
                  <option value="video">Video Background</option>
                  <option value="youtube">YouTube Video</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Current Background Display */}
            <div className="p-4 bg-muted rounded-lg">
              <Label className="text-sm font-medium mb-2 block">Current Background:</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                  {settings.hero_background_type === 'video' ? (
                    <video
                      src={settings.hero_background_url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                    />
                  ) : (
                    <img
                      src={settings.hero_background_url}
                      alt="Current background"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400';
                      }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Type: {settings.hero_background_type}
                  </p>
                  <p className="text-xs text-muted-foreground break-all">
                    {settings.hero_background_url?.substring(0, 60)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Media Grid/List */}
            {mediaItems.length > 0 ? (
              <div className={`${viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                : 'space-y-2'
              }`}>
                {mediaItems.map((item, index) => (
                  <div
                    key={index}
                    className={`${viewMode === 'grid' 
                      ? 'relative group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow' 
                      : 'flex items-center gap-4 p-3 border rounded-lg'
                    } ${selectedMedia === item.url ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {/* Media Preview */}
                    <div className={`${viewMode === 'grid' ? 'aspect-video' : 'w-16 h-16 flex-shrink-0'} bg-gray-200 overflow-hidden`}>
                      {item.type === 'video' ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>

                    {/* Media Info */}
                    <div className={`${viewMode === 'grid' ? 'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3' : 'flex-1'}`}>
                      <div className={`${viewMode === 'grid' ? 'text-white' : ''}`}>
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs opacity-75">
                          {item.type} • {item.size ? `${Math.round(item.size / 1024)}KB` : 'Unknown size'}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className={`${viewMode === 'grid' ? 'flex gap-2 mt-2' : 'flex gap-2'}`}>
                        <Button
                          size="sm"
                          onClick={() => setAsBackground(item.url, item.type)}
                          className={`${viewMode === 'grid' ? 'text-xs' : ''}`}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Set as Background
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMedia(item)}
                          className={`${viewMode === 'grid' ? 'text-xs' : ''}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No media files found</p>
                <p className="text-sm text-muted-foreground">Upload some images or videos to get started</p>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <GlassCard className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload New Media</h3>
              <p className="text-muted-foreground">Upload images and videos for backgrounds</p>
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium">Choose files to upload</span>
                <p className="text-muted-foreground mt-2">Supports images and videos (JPG, PNG, MP4, MOV)</p>
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              {isUploading && (
                <div className="mt-4">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                </div>
              )}
            </div>

            {/* YouTube URL */}
            <div className="space-y-2">
              <Label>YouTube Video URL</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={settings.hero_background_type === 'youtube' ? settings.hero_background_url : ''}
                  onChange={(e) => {
                    handleSave('hero_background_url', e.target.value);
                    if (e.target.value) {
                      handleSave('hero_background_type', 'youtube');
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    handleSave('hero_background_type', 'youtube');
                    toast({
                      title: "YouTube Set",
                      description: "YouTube video set as background!",
                    });
                  }}
                  disabled={isSaving}
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  Set YouTube
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Video Settings Tab */}
      {activeTab === 'settings' && (
        <GlassCard className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Video & Background Settings</h3>
              <p className="text-muted-foreground">Configure video playback and background options</p>
            </div>

            {/* Video Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Video Autoplay</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.hero_video_autoplay || 'true'}
                  onChange={(e) => handleSave('hero_video_autoplay', e.target.value)}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Video Audio</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.hero_video_muted || 'true'}
                  onChange={(e) => handleSave('hero_video_muted', e.target.value)}
                >
                  <option value="true">Muted</option>
                  <option value="false">With Sound</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Video Loop</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.hero_video_loop || 'true'}
                  onChange={(e) => handleSave('hero_video_loop', e.target.value)}
                >
                  <option value="true">Loop</option>
                  <option value="false">Play Once</option>
                </select>
              </div>
            </div>

            {/* Overlay Settings */}
            <div className="space-y-2">
              <Label>Overlay Opacity (0.0 - 1.0)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.hero_overlay_opacity || '0.7'}
                  onChange={(e) => handleSave('hero_overlay_opacity', e.target.value)}
                />
                <Button
                  onClick={() => toast({ title: "Overlay Updated", description: "Overlay opacity updated!" })}
                  disabled={isSaving}
                  variant="outline"
                  size="sm"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Main Video Background URL */}
            <div className="space-y-2">
              <Label>Video Background URL (Supabase Storage)</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://iwmfxcrzzwpmxomydmuq.supabase.co/storage/v1/object/public/backgrounds/your-video.mp4"
                  value={settings.hero_background_url || ''}
                  onChange={(e) => handleSave('hero_background_url', e.target.value)}
                />
                <Button
                  onClick={async () => {
                    // Set background type to video when URL is set
                    await handleSave('hero_background_type', 'video');
                    toast({ 
                      title: "Video Background Set", 
                      description: "Native video background configured! Check homepage.",
                      duration: 5000
                    });
                  }}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Video className="w-4 h-4 mr-1" />
                  Set Video
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use your Supabase storage URL for native video playback (better performance than YouTube)
              </p>
            </div>

            {/* Responsive Video Settings */}
            <div className="space-y-4 p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-green-600" />
                <Label className="font-semibold text-green-800">Responsive Video Settings</Label>
              </div>
              
              <p className="text-sm text-green-700 bg-green-100 p-3 rounded-md">
                ✅ <strong>Single Responsive Video:</strong> This video will automatically work on desktop, tablet, and mobile devices with optimized performance for each screen size.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Video Performance</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={settings.hero_video_performance || 'auto'}
                    onChange={(e) => handleSave('hero_video_performance', e.target.value)}
                  >
                    <option value="auto">Auto (Recommended)</option>
                    <option value="optimized">Mobile Optimized</option>
                    <option value="high">High Quality</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Cross-Device Compatibility</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={settings.hero_video_compatibility || 'enhanced'}
                    onChange={(e) => handleSave('hero_video_compatibility', e.target.value)}
                  >
                    <option value="enhanced">Enhanced (Recommended)</option>
                    <option value="standard">Standard</option>
                    <option value="basic">Basic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Test Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={() => {
                  toast({
                    title: "Settings Applied",
                    description: "All video settings have been applied. Check the homepage to see changes!",
                    duration: 5000
                  });
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Apply Settings & Preview
              </Button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default UnifiedMediaManager;