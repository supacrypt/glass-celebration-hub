import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, CheckCircle, XCircle, Eye, Calendar, User } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Photo {
  id: string;
  title: string | null;
  description: string | null;
  file_url: string;
  created_at: string;
  is_approved: boolean | null;
  user_id: string;
  profiles?: {
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
  };
}

const AdminPhotos: React.FC = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select(`
          *,
          profiles (
            display_name,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos((data as any) || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const updatePhotoStatus = async (photoId: string, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from('photos')
        .update({ is_approved: isApproved })
        .eq('id', photoId);

      if (error) throw error;

      toast.success(isApproved ? 'Photo approved' : 'Photo rejected');
      fetchPhotos();
    } catch (error) {
      console.error('Error updating photo status:', error);
      toast.error('Failed to update photo status');
    }
  };

  const filteredPhotos = photos.filter(photo => {
    switch (filter) {
      case 'pending':
        return photo.is_approved === null;
      case 'approved':
        return photo.is_approved === true;
      case 'rejected':
        return photo.is_approved === false;
      default:
        return true;
    }
  });

  const stats = [
    { 
      label: 'Total Photos', 
      value: photos.length, 
      icon: Image,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Pending Review', 
      value: photos.filter(p => p.is_approved === null).length, 
      icon: Eye,
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      label: 'Approved', 
      value: photos.filter(p => p.is_approved === true).length, 
      icon: CheckCircle,
      color: 'from-green-500 to-green-600'
    },
    { 
      label: 'Rejected', 
      value: photos.filter(p => p.is_approved === false).length, 
      icon: XCircle,
      color: 'from-red-500 to-red-600'
    },
  ];

  const getStatusBadge = (isApproved: boolean | null) => {
    if (isApproved === null) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>;
    } else if (isApproved) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Approved</span>;
    } else {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Rejected</span>;
    }
  };

  const getUserName = (photo: Photo) => {
    const profile = photo.profiles;
    if (profile?.display_name) return profile.display_name;
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return 'Unknown User';
  };

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#7a736b]" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#2d3f51]">Photo Moderation</h1>
          <p className="text-sm text-[#7a736b]">Review and manage photo uploads</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={index} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-semibold text-[#2d3f51]">{stat.value}</div>
                  <div className="text-xs text-[#7a736b]">{stat.label}</div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <GlassCard className="p-4 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                filter === filterOption
                  ? 'bg-[#2d3f51] text-white'
                  : 'bg-white/20 text-[#7a736b] hover:bg-white/30'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Photos Grid */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-[#2d3f51] mb-4">
          Photos ({filteredPhotos.length})
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3f51] mx-auto"></div>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-8 text-[#7a736b]">
            No photos found for the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="bg-white/20 rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={photo.file_url}
                    alt={photo.title || 'Photo'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(photo.is_approved)}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#7a736b]" />
                    <span className="text-sm text-[#7a736b]">{getUserName(photo)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-[#7a736b]" />
                    <span className="text-sm text-[#7a736b]">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {photo.title && (
                    <h3 className="font-medium text-[#2d3f51] mb-1">{photo.title}</h3>
                  )}
                  
                  {photo.description && (
                    <p className="text-sm text-[#7a736b] mb-3 line-clamp-2">{photo.description}</p>
                  )}

                  {photo.is_approved === null && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updatePhotoStatus(photo.id, true)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => updatePhotoStatus(photo.id, false)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AdminPhotos;