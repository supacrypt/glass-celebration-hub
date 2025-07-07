import React, { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { Upload, Heart, Download, Share2, Filter, Grid, List } from 'lucide-react';

const Gallery: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');

  // Mock photo data
  const photos = [
    { id: 1, category: 'engagement', likes: 23, date: '2024-01-15', src: 'engagement-1' },
    { id: 2, category: 'venue', likes: 15, date: '2024-02-20', src: 'venue-1' },
    { id: 3, category: 'rings', likes: 31, date: '2024-03-10', src: 'rings-1' },
    { id: 4, category: 'engagement', likes: 18, date: '2024-01-22', src: 'engagement-2' },
    { id: 5, category: 'venue', likes: 27, date: '2024-02-25', src: 'venue-2' },
    { id: 6, category: 'preparation', likes: 12, date: '2024-04-01', src: 'prep-1' },
  ];

  const categories = [
    { id: 'all', label: 'All Photos', count: photos.length },
    { id: 'engagement', label: 'Engagement', count: photos.filter(p => p.category === 'engagement').length },
    { id: 'venue', label: 'Venue', count: photos.filter(p => p.category === 'venue').length },
    { id: 'rings', label: 'Rings', count: photos.filter(p => p.category === 'rings').length },
    { id: 'preparation', label: 'Preparation', count: photos.filter(p => p.category === 'preparation').length },
  ];

  const filteredPhotos = filter === 'all' ? photos : photos.filter(p => p.category === filter);

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
          <button className="px-6 py-3 bg-wedding-navy text-white rounded-glass hover:bg-wedding-navy-light transition-all hover:scale-105">
            Choose Photos
          </button>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.2s' }}
          variant="secondary"
        >
          <div className="text-2xl font-light text-wedding-navy mb-1">134</div>
          <div className="text-xs text-muted-foreground">Total Photos</div>
        </GlassCard>
        
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.25s' }}
          variant="secondary"
        >
          <div className="text-2xl font-light text-glass-pink mb-1">459</div>
          <div className="text-xs text-muted-foreground">Total Likes</div>
        </GlassCard>
        
        <GlassCard 
          className="p-4 text-center animate-fade-up" 
          style={{ animationDelay: '0.3s' }}
          variant="secondary"
        >
          <div className="text-2xl font-light text-glass-green mb-1">28</div>
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
      <div className={`gap-4 ${viewMode === 'grid' ? 'grid grid-cols-2' : 'space-y-4'}`}>
        {filteredPhotos.map((photo, index) => (
          <GlassCard 
            key={photo.id}
            className={`animate-fade-up overflow-hidden ${
              viewMode === 'grid' ? '' : 'flex gap-4 items-center p-4'
            }`}
            style={{ animationDelay: `${0.4 + (index * 0.1)}s` }}
            variant="secondary"
          >
            {viewMode === 'grid' ? (
              <>
                {/* Placeholder for photo */}
                <div className="aspect-square bg-gradient-to-br from-glass-blue/20 to-glass-purple/20 flex items-center justify-center">
                  <div className="text-6xl opacity-20">📸</div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-glass-pink hover:text-glass-pink/80 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{photo.likes}</span>
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(photo.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Placeholder for photo */}
                <div className="w-20 h-20 bg-gradient-to-br from-glass-blue/20 to-glass-purple/20 rounded-glass flex items-center justify-center flex-shrink-0">
                  <div className="text-2xl opacity-40">📸</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-wedding-navy capitalize">
                      {photo.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(photo.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-glass-pink hover:text-glass-pink/80 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{photo.likes}</span>
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