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
    <div className="min-h-screen" style={{ padding: '40px 20px', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        
        {/* Page Header */}
        <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
          <h1 className="text-[36px] font-semibold text-[#2d3f51] mb-3 tracking-tight animate-fade-up">
            Photo Gallery
          </h1>
          <p className="text-lg text-[#7a736b] font-normal">
            Capture and share your favorite wedding moments
          </p>
        </div>

        {/* Upload Section */}
        <div className="glass-card p-12 mb-10 text-center transition-all duration-300 hover:translate-y-[-3px] animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-[25px] flex items-center justify-center text-[36px] text-white relative overflow-hidden"
            style={{
              boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3), 8px 8px 20px rgba(163, 155, 146, 0.2)'
            }}>
            📤
          </div>
          <h2 className="text-2xl font-semibold text-[#2d3f51] mb-3">Upload Photos</h2>
          <p className="text-base text-[#7a736b] mb-6">
            Share your favorite moments from the celebration
          </p>
          <div className="relative inline-block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button className="bg-[#2d3f51] text-white border-none px-9 py-4 rounded-[25px] font-semibold text-[15px] cursor-pointer inline-flex items-center gap-3 transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden"
              style={{
                boxShadow: '0 8px 20px rgba(45, 63, 81, 0.3), 5px 5px 15px rgba(163, 155, 146, 0.2)'
              }}>
              📷 Choose Photos
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          <div className="glass-card p-8 text-center cursor-pointer transition-all duration-300 hover:translate-y-[-5px] hover:scale-[1.02] animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-[42px] font-bold mb-2 leading-none bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">{photos.length}</div>
            <div className="text-sm text-[#7a736b] font-medium">Total Photos</div>
          </div>
          
          <div className="glass-card p-8 text-center cursor-pointer transition-all duration-300 hover:translate-y-[-5px] hover:scale-[1.02] animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-[42px] font-bold mb-2 leading-none bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              {photos.reduce((total, photo) => total + (photo.photo_likes?.length || 0), 0)}
            </div>
            <div className="text-sm text-[#7a736b] font-medium">Total Likes</div>
          </div>
          
          <div className="glass-card p-8 text-center cursor-pointer transition-all duration-300 hover:translate-y-[-5px] hover:scale-[1.02] animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="text-[42px] font-bold mb-2 leading-none bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              {new Set(photos.map(photo => photo.user_id)).size}
            </div>
            <div className="text-sm text-[#7a736b] font-medium">Contributors</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass-card p-5 mb-8 flex items-center justify-between animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] px-5 py-3 rounded-[20px] border-none text-[15px] text-[#2d3f51] font-medium cursor-pointer transition-all duration-300 inline-flex items-center gap-3"
            style={{
              boxShadow: 'inset 2px 2px 4px rgba(163, 155, 146, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.7)'
            }}>
            🔽 All Photos ({photos.length})
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setViewMode('grid')}
              className={`w-10 h-10 rounded-[12px] flex items-center justify-center border-none text-xl cursor-pointer transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white' 
                  : 'bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#7a736b] hover:translate-y-[-2px]'
              }`}
              style={{
                boxShadow: viewMode === 'grid' 
                  ? '0 4px 10px rgba(102, 126, 234, 0.3), 3px 3px 8px rgba(163, 155, 146, 0.2)'
                  : '3px 3px 6px rgba(163, 155, 146, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.7)'
              }}>
              ⬛
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`w-10 h-10 rounded-[12px] flex items-center justify-center border-none text-xl cursor-pointer transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white' 
                  : 'bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#7a736b] hover:translate-y-[-2px]'
              }`}
              style={{
                boxShadow: viewMode === 'list' 
                  ? '0 4px 10px rgba(102, 126, 234, 0.3), 3px 3px 8px rgba(163, 155, 146, 0.2)'
                  : '3px 3px 6px rgba(163, 155, 146, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.7)'
              }}>
              ☰
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3f51] mx-auto"></div>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="glass-card py-20 px-10 text-center mb-8 animate-fade-up" style={{ animationDelay: '0.7s' }}>
            <span className="text-[64px] text-[#667eea] mb-5 block animate-bounce">📷</span>
            <p className="text-lg text-[#7a736b]">
              {filter === 'all' ? 'No photos yet. Be the first to share!' : 'No photos found in this category.'}
            </p>
          </div>
        ) : (
          <div className={`mb-10 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}`}>
            {filteredPhotos.map((photo, index) => (
              <div 
                key={photo.id}
                className={`glass-card overflow-hidden cursor-pointer transition-all duration-300 animate-fade-up ${
                  viewMode === 'grid' ? 'hover:scale-[1.03] hover:translate-y-[-5px]' : 'flex gap-4 items-center p-4'
                }`}
                style={{ 
                  animationDelay: `${0.8 + (index * 0.1)}s`,
                  ...(viewMode === 'grid' ? { aspectRatio: '1' } : {})
                }}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Photo */}
                    <div className="w-full h-3/4 bg-gradient-to-br from-glass-blue/20 to-glass-purple/20 flex items-center justify-center overflow-hidden">
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
                    <div className="p-4 h-1/4 flex flex-col justify-between">
                      {photo.title && (
                        <h3 className="font-medium text-[#2d3f51] mb-2 text-sm">{photo.title}</h3>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 text-[#EC4899] hover:text-[#EC4899]/80 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{photo.photo_likes?.length || 0}</span>
                          </button>
                          <button className="text-[#7a736b] hover:text-[#2d3f51] transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-[#7a736b] hover:text-[#2d3f51] transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs text-[#7a736b]">
                          {new Date(photo.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Photo */}
                    <div className="w-20 h-20 bg-gradient-to-br from-glass-blue/20 to-glass-purple/20 rounded-[20px] flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                        <span className="text-sm font-medium text-[#2d3f51]">
                          {photo.title || 'Wedding Photo'}
                        </span>
                        <span className="text-xs text-[#7a736b]">
                          {new Date(photo.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-[#EC4899] hover:text-[#EC4899]/80 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{photo.photo_likes?.length || 0}</span>
                        </button>
                        <button className="text-[#7a736b] hover:text-[#2d3f51] transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-[#7a736b] hover:text-[#2d3f51] transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-10 animate-fade-up" style={{ animationDelay: '0.8s' }}>
          <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] border-none px-9 py-4 rounded-[25px] font-semibold text-[15px] text-[#5a5651] cursor-pointer transition-all duration-300 hover:translate-y-[-3px] relative overflow-hidden"
            style={{
              boxShadow: '8px 8px 16px rgba(163, 155, 146, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.7)'
            }}>
            Load More Photos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;