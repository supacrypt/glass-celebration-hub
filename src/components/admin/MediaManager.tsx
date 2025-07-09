import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Eye, Video, Image } from 'lucide-react';

interface MediaFile {
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  created_at: string;
}

const MediaManager: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMediaFiles();
  }, []);

  const loadMediaFiles = async () => {
    try {
      // List files from the backgrounds bucket
      const { data: files, error } = await supabase.storage
        .from('backgrounds')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading media files:', error);
        toast({
          title: "Error",
          description: "Failed to load media files",
          variant: "destructive"
        });
        return;
      }

      const mediaList: MediaFile[] = [];
      
      for (const file of files || []) {
        const { data } = supabase.storage
          .from('backgrounds')
          .getPublicUrl(file.name);
        
        const isVideo = file.name.toLowerCase().includes('.mp4') || 
                       file.name.toLowerCase().includes('.webm') ||
                       file.name.toLowerCase().includes('.mov');
        
        mediaList.push({
          name: file.name,
          url: data.publicUrl,
          type: isVideo ? 'video' : 'image',
          size: file.metadata?.size || 0,
          created_at: file.created_at || ''
        });
      }

      setMediaFiles(mediaList);
    } catch (error) {
      console.error('Error in loadMediaFiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload JPG, PNG, WebP, MP4, or WebM files only",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 50MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('backgrounds')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully`,
      });

      // Reload media files
      await loadMediaFiles();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const deleteFile = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('backgrounds')
        .remove([fileName]);

      if (error) {
        throw error;
      }

      toast({
        title: "File Deleted",
        description: `${fileName} has been deleted successfully`,
      });

      // Reload media files
      await loadMediaFiles();

    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const setAsHeroBackground = async (fileName: string, type: 'image' | 'video') => {
    try {
      const { data } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(fileName);

      // Update app settings
      const { error: updateError } = await supabase
        .from('app_settings')
        .upsert([
          { setting_key: 'hero_background_type', setting_value: type },
          { setting_key: 'hero_background_url', setting_value: data.publicUrl }
        ], { onConflict: 'setting_key' });

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Hero Background Updated",
        description: `${fileName} is now the hero background`,
      });

    } catch (error: any) {
      console.error('Update hero background error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update hero background",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Media Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Media Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload hero background images or videos
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  JPG, PNG, WebP, MP4, WebM up to 50MB
                </span>
              </label>
              <Input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept="image/*,video/*"
                onChange={uploadFile}
                disabled={uploading}
              />
            </div>
            <Button
              className="mt-4"
              disabled={uploading}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaFiles.map((file) => (
            <Card key={file.name} className="overflow-hidden">
              <div className="aspect-video relative bg-gray-100">
                {file.type === 'video' ? (
                  <video
                    src={file.url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 left-2">
                  {file.type === 'video' ? (
                    <Video className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                  ) : (
                    <Image className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                  )}
                </div>
              </div>
              <CardContent className="p-3 space-y-2">
                <div className="text-sm font-medium truncate" title={file.name}>
                  {file.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => setAsHeroBackground(file.name, file.type)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Set as Hero
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteFile(file.name)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mediaFiles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No media files found. Upload some images or videos to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaManager;