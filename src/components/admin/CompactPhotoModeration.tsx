import React, { useState } from 'react';
import { Check, X, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface CompactPhotoModerationProps {
  photos: Photo[];
  onRefresh: () => void;
}

const CompactPhotoModeration: React.FC<CompactPhotoModerationProps> = ({ photos, onRefresh }) => {
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { toast } = useToast();

  const pendingPhotos = photos.filter(photo => !photo.is_approved);
  const approvedPhotos = photos.filter(photo => photo.is_approved);

  const updatePhotoStatus = async (photoId: string, isApproved: boolean) => {
    setProcessing(photoId);
    try {
      const { error } = await supabase
        .from('photos')
        .update({ is_approved: isApproved })
        .eq('id', photoId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Photo ${isApproved ? 'approved' : 'rejected'}`,
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating photo status:', error);
      toast({
        title: "Error",
        description: "Failed to update photo status",
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  const PhotoList = ({ photos, title, isPending = false }: { photos: Photo[], title: string, isPending?: boolean }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-wedding-navy">{title}</h4>
        <Badge variant={isPending ? "destructive" : "secondary"}>
          {photos.length}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
        {photos.slice(0, 8).map((photo) => (
          <div key={photo.id} className="glass-card p-2 space-y-2">
            <div 
              className="aspect-square rounded-lg overflow-hidden cursor-pointer bg-muted"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img 
                src={photo.file_url} 
                alt={photo.title || 'Photo'}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                loading="lazy"
              />
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground truncate">
                {photo.profiles.first_name || 'Anonymous'}
              </div>
              
              {isPending && (
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updatePhotoStatus(photo.id, true)}
                    disabled={processing === photo.id}
                    className="flex-1 text-xs px-1 py-1 h-6"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updatePhotoStatus(photo.id, false)}
                    disabled={processing === photo.id}
                    className="flex-1 text-xs px-1 py-1 h-6"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {photos.length > 8 && (
        <div className="text-center text-xs text-muted-foreground">
          Showing 8 of {photos.length} photos
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {pendingPhotos.length > 0 && (
        <PhotoList photos={pendingPhotos} title="Pending Approval" isPending />
      )}
      
      <PhotoList photos={approvedPhotos} title="Approved Photos" />
      
      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="glass-popup max-w-lg w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="wedding-heading text-wedding-navy">
                  {selectedPhoto.title || 'Photo Preview'}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <img 
                src={selectedPhoto.file_url} 
                alt={selectedPhoto.title || 'Photo'}
                className="w-full rounded-lg"
              />
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  By: {selectedPhoto.profiles.first_name || 'Anonymous'}
                </span>
                <Badge variant={selectedPhoto.is_approved ? "secondary" : "destructive"}>
                  {selectedPhoto.is_approved ? 'Approved' : 'Pending'}
                </Badge>
              </div>
              
              {!selectedPhoto.is_approved && (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      updatePhotoStatus(selectedPhoto.id, true);
                      setSelectedPhoto(null);
                    }}
                    disabled={processing === selectedPhoto.id}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updatePhotoStatus(selectedPhoto.id, false);
                      setSelectedPhoto(null);
                    }}
                    disabled={processing === selectedPhoto.id}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactPhotoModeration;