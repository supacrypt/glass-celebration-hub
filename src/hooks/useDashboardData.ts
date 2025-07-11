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
      
      // Fetch users with roles
      const { data: usersData } = await (supabase as any)
        .from('profiles')
        .select(`
          id,
          user_id,
          email,
          first_name,
          last_name,
          created_at
        `);

      // Fetch RSVPs
      const { data: rsvpsData } = await (supabase as any)
        .from('rsvps')
        .select('*');

      // Fetch photos
      const { data: photosData } = await (supabase as any)
        .from('photos')
        .select('*');

      // Fetch all profiles for joining
      const { data: profilesData } = await (supabase as any)
        .from('profiles')
        .select('user_id, first_name, last_name, email');

      // Fetch messages count
      const { count: messagesCount } = await (supabase as any)
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Fetch user roles separately
      const { data: userRolesData } = await (supabase as any)
        .from('user_roles')
        .select('user_id, role');

      // Format users data
      const formattedUsers: User[] = usersData?.map(user => ({
        id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
        role: (userRolesData?.find(ur => ur.user_id === user.user_id)?.role || 'guest') as 'guest' | 'admin' | 'couple'
      })) || [];

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
        totalUsers: usersData?.length || 0,
        totalRSVPs,
        pendingPhotos,
        totalMessages: messagesCount || 0,
        approvedPhotos,
        activeUsers: usersData?.filter(u => 
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