import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { AdminStats, User, RSVP, Photo, DashboardData } from '@/components/dashboard/types';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalUsers: 0,
      totalRSVPs: 0,
      pendingPhotos: 0,
      totalMessages: 0,
      approvedPhotos: 0,
      activeUsers: 0
    },
    users: [],
    rsvps: [],
    photos: []
  });
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch users and roles separately (manual join)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          email,
          first_name,
          last_name,
          created_at
        `);

      const { data: userRolesData } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Fetch RSVPs
      const { data: rsvpsData } = await supabase
        .from('rsvps')
        .select('*');

      // Fetch photos
      const { data: photosData } = await supabase
        .from('photos')
        .select('*');

      // Fetch messages count
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Format users data with manual join
      const formattedUsers: User[] = profilesData?.map(profile => {
        const userRole = userRolesData?.find(role => role.user_id === profile.user_id);
        return {
          id: profile.user_id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          created_at: profile.created_at,
          role: (userRole ? userRole.role : 'guest') as 'guest' | 'admin' | 'couple'
        };
      }) || [];

      // Format RSVPs with profiles
      const formattedRSVPs: RSVP[] = rsvpsData?.map(rsvp => ({
        ...rsvp,
        status: rsvp.status as 'attending' | 'declined' | 'pending' | 'maybe',
        profiles: profilesData?.find(p => p.user_id === rsvp.user_id) || { 
          first_name: '', 
          last_name: '', 
          email: '' 
        }
      })) || [];
      
      // Format photos with profiles
      const formattedPhotos: Photo[] = photosData?.map(photo => ({
        ...photo,
        profiles: profilesData?.find(p => p.user_id === photo.user_id) || { 
          first_name: '', 
          last_name: '' 
        }
      })) || [];

      // Calculate stats
      const pendingPhotos = photosData?.filter(p => !p.is_approved).length || 0;
      const approvedPhotos = photosData?.filter(p => p.is_approved).length || 0;
      const totalRSVPs = rsvpsData?.reduce((sum, rsvp) => sum + (rsvp.guest_count || 1), 0) || 0;

      const stats: AdminStats = {
        totalUsers: profilesData?.length || 0,
        totalRSVPs,
        pendingPhotos,
        totalMessages: messagesCount || 0,
        approvedPhotos,
        activeUsers: profilesData?.filter(u => 
          new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0
      };

      setData({
        stats,
        users: formattedUsers,
        rsvps: formattedRSVPs,
        photos: formattedPhotos
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    ...data,
    loading,
    fetchDashboardData
  };
};