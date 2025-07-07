import React, { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { Upload, Heart, Download, Share2, Filter, Grid, List, Camera } from 'lucide-react';
import { usePhotos } from '@/hooks/useWeddingData';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Gallery: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');
  const { photos, loading, uploadPhoto } = usePhotos();
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = [
    { id: 'all', label: 'All Photos', count: photos.length },
    { id: 'ceremony', label: 'Ceremony', count: photos.filter(p => p.title?.toLowerCase().includes('ceremony')).length },
    { id: 'reception', label: 'Reception', count: photos.filter(p => p.title?.toLowerCase().includes('reception')).length },
    { id: 'portraits', label: 'Portraits', count: photos.filter(p => p.title?.toLowerCase().includes('portrait')).length },
    { id: 'candid', label: 'Candid', count: photos.filter(p => p.title?.toLowerCase().includes('candid')).length },
  ];

  const filteredPhotos = filter === 'all' ? photos : photos.filter(p => 
    p.title?.toLowerCase().includes(filter) || p.description?.toLowerCase().includes(filter)
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Upload started",
      description: "Your photo is being uploaded...",
    });

    // Upload the photo
    const result = await uploadPhoto(file, 'Wedding Photo', 'Shared from gallery');
    
    if (result.success) {
      toast({
        title: "Upload complete",
        description: "Your photo has been shared successfully!",
      });
    } else {
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    }

    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up">
        <h1 className="wedding-heading text-wedding-navy mb-3">
          Photo Gallery
        </h1>
        <p className="wedding-body text-muted-foreground">
          Capture and share your favorite wedding moments
        </p>
      </div>

      {/* Upload Section */}
      <GlassCard className="mb-8 p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-glass-lg bg-glass-blue/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-glass-blue" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-wedding-navy">Upload Photos</h3>
          <p className="text-muted-foreground mb-4">
            Share your favorite moments from the celebration
          </p>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button className="bg-wedding-navy hover:bg-wedding-navy-light">
              <Camera className="w-4 h-4 mr-2" />
              Choose Photos
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.2s' }}
          variant="secondary"
        >
          <div className="text-2xl font-light text-wedding-navy mb-1">{photos.length}</div>
          <div className="text-xs text-muted-foreground">Total Photos</div>
        </GlassCard>
        
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.25s' }}
          variant="secondary"
        >
          <div className="text-2xl font-light text-glass-pink mb-1">
            {photos.reduce((total, photo) => total + (photo.photo_likes?.length || 0), 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Likes</div>
        </GlassCard>
        
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.3s' }}
          variant="secondary"
        >
          <div className="text-2xl font-light text-glass-green mb-1">
            {new Set(photos.map(photo => photo.user_id)).size}
          </div>
          <div className="text-xs text-muted-foreground">Contributors</div>
        </GlassCard>
      </div>

      {/* Filter & View Controls */}
      <GlassCard className="mb-6 p-4 animate-fade-up" style={{ animationDelay: '0.35s' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium text-wedding-navy"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({cat.count})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-glass transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-wedding-navy text-white' 
                  : 'bg-secondary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-glass transition-colors ${
                viewMode === 'list' 
                  ? 'bg-wedding-navy text-white' 
                  : 'bg-secondary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Photo Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy mx-auto"></div>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <GlassCard className="p-8 text-center" variant="secondary">
          <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {filter === 'all' ? 'No photos yet. Be the first to share!' : 'No photos found in this category.'}
          </p>
        </GlassCard>
      ) : (
        <div className={`gap-4 ${viewMode === 'grid' ? 'grid grid-cols-2' : 'space-y-4'}`}>
          {filteredPhotos.map((photo, index) => (
            <GlassCard 
              key={photo.id}
              className={`animate-fade-up overflow-hidden glass-card ${
                viewMode === 'grid' ? '' : 'flex gap-4 items-center p-4'
              }`}
              style={{ animationDelay: `${0.4 + (index * 0.1)}s` }}
              variant="secondary"
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Photo */}
                  <div className="aspect-square bg-gradient-to-br from-glass-blue/20 to-glass-purple/20 flex items-center justify-center overflow-hidden">
                    {photo.file_url ? (
                      <img 
                        src={photo.file_url} 
                        alt={photo.title || 'Wedding photo'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl opacity-20">📸</div>
                    )}
                  </div>
                  <div className="p-4">
                    {photo.title && (
                      <h3 className="font-medium text-wedding-navy mb-2 text-sm">{photo.title}</h3>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 text-glass-pink hover:text-glass-pink/80 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{photo.photo_likes?.length || 0}</span>
                        </button>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(photo.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Photo */}
                  <div className="w-20 h-20 bg-gradient-to-br from-glass-blue/20 to-glass-purple/20 rounded-glass flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {photo.file_url ? (
                      <img 
                        src={photo.file_url} 
                        alt={photo.title || 'Wedding photo'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-2xl opacity-40">📸</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-wedding-navy">
                        {photo.title || 'Wedding Photo'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(photo.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-glass-pink hover:text-glass-pink/80 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{photo.photo_likes?.length || 0}</span>
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="px-8 py-3 glass-secondary rounded-glass-lg text-wedding-navy font-medium hover:scale-105 transition-all">
          Load More Photos
        </button>
      </div>
    </div>
  );
};

export default Gallery;