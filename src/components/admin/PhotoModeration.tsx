import React from 'react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Image, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Photo {
  id: string;
  title?: string;
  file_url: string;
  is_approved: boolean;
  created_at: string;
  profiles: {
    first_name?: string;
    last_name?: string;
  };
}

interface PhotoModerationProps {
  photos: Photo[];
  onRefresh: () => void;
}

const PhotoModeration: React.FC<PhotoModerationProps> = ({ photos, onRefresh }) => {
  const { toast } = useToast();
  const pendingPhotos = photos.filter(p => !p.is_approved);

  const handlePhotoApproval = async (photoId: string, approved: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('photos')
        .update({ is_approved: approved })
        .eq('id', photoId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Photo ${approved ? 'approved' : 'rejected'} successfully`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error updating photo:', error);
      toast({
        title: "Error",
        description: "Failed to update photo status",
        variant: "destructive"
      });
    }
  };

  return (
    <GlassCard className="p-4">
      <h3 className="font-semibold mb-4 text-wedding-navy">Pending Photo Approvals</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingPhotos.map((photo) => (
          <div key={photo.id} className="rounded-glass bg-secondary/30 p-4">
            <img 
              src={photo.file_url} 
              alt={photo.title || 'Wedding photo'} 
              className="w-full h-48 object-cover rounded-glass mb-3"
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  By {photo.profiles?.first_name} {photo.profiles?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(photo.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePhotoApproval(photo.id, false)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePhotoApproval(photo.id, true)}
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {pendingPhotos.length === 0 && (
        <div className="text-center py-8">
          <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No photos pending approval</p>
        </div>
      )}
    </GlassCard>
  );
};

export default PhotoModeration;