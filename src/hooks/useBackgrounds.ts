import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BackgroundImage {
  name: string;
  publicUrl: string;
  size?: number;
  lastModified?: string;
}

export const useBackgrounds = () => {
  const [backgrounds, setBackgrounds] = useState<BackgroundImage[]>([]);
  const [activeBackground, setActiveBackground] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Fetch all background images from storage
  const fetchBackgrounds = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.storage
        .from('backgrounds')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        throw error;
      }

      const backgroundImages: BackgroundImage[] = data.map(file => ({
        name: file.name,
        publicUrl: supabase.storage.from('backgrounds').getPublicUrl(file.name).data.publicUrl,
        size: file.metadata?.size,
        lastModified: file.created_at
      }));

      setBackgrounds(backgroundImages);
    } catch (error: any) {
      console.error('Error fetching backgrounds:', error);
      toast({
        title: "Error",
        description: "Failed to fetch background images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch active background setting
  const fetchActiveBackground = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'active_background')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setActiveBackground(data?.setting_value || '');
    } catch (error: any) {
      console.error('Error fetching active background:', error);
    }
  };

  // Update active background
  const updateActiveBackground = async (backgroundName: string) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          setting_key: 'active_background',
          setting_value: backgroundName
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        throw error;
      }

      setActiveBackground(backgroundName);
      
      toast({
        title: "Background Updated",
        description: "The active background has been changed successfully",
      });

      // Trigger a custom event to update the global background
      window.dispatchEvent(new CustomEvent('backgroundChanged', { 
        detail: { backgroundName } 
      }));

    } catch (error: any) {
      console.error('Error updating active background:', error);
      toast({
        title: "Error",
        description: "Failed to update active background",
        variant: "destructive"
      });
    }
  };

  // Upload new background image
  const uploadBackground = async (file: File) => {
    try {
      setUploading(true);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `background-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('backgrounds')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const publicUrl = supabase.storage.from('backgrounds').getPublicUrl(fileName).data.publicUrl;
      
      // Add to local state
      const newBackground: BackgroundImage = {
        name: fileName,
        publicUrl,
        size: file.size,
        lastModified: new Date().toISOString()
      };

      setBackgrounds(prev => [newBackground, ...prev]);

      toast({
        title: "Upload Successful",
        description: "Background image uploaded successfully",
      });

      return { success: true, data: newBackground };

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload background image",
        variant: "destructive"
      });

      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  // Delete background image
  const deleteBackground = async (backgroundName: string) => {
    try {
      const { error } = await supabase.storage
        .from('backgrounds')
        .remove([backgroundName]);

      if (error) {
        throw error;
      }

      // Remove from local state
      setBackgrounds(prev => prev.filter(bg => bg.name !== backgroundName));

      // If this was the active background, clear it
      if (activeBackground === backgroundName) {
        await updateActiveBackground('');
      }

      toast({
        title: "Background Deleted",
        description: "Background image deleted successfully",
      });

    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete background image",
        variant: "destructive"
      });
    }
  };

  // Get active background URL
  const getActiveBackgroundUrl = () => {
    if (!activeBackground) return '';
    return supabase.storage.from('backgrounds').getPublicUrl(activeBackground).data.publicUrl;
  };

  useEffect(() => {
    fetchBackgrounds();
    fetchActiveBackground();
  }, []);

  return {
    backgrounds,
    activeBackground,
    loading,
    uploading,
    fetchBackgrounds,
    updateActiveBackground,
    uploadBackground,
    deleteBackground,
    getActiveBackgroundUrl
  };
};