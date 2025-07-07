import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import GlassCard from '@/components/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminStatsComponent from '@/components/admin/AdminStats';
import UserManagement from '@/components/admin/UserManagement';
import PhotoModeration from '@/components/admin/PhotoModeration';
import RSVPManagement from '@/components/admin/RSVPManagement';
import AdminOverview from '@/components/admin/AdminOverview';
import GiftManagement from '@/components/admin/GiftManagement';
import BackgroundManager from '@/components/admin/BackgroundManager';

interface AdminStats {
  totalUsers: number;
  totalRSVPs: number;
  pendingPhotos: number;
  totalMessages: number;
  approvedPhotos: number;
  activeUsers: number;
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  role: 'guest' | 'admin' | 'couple';
}

interface RSVP {
  id: string;
  user_id: string;
  event_id: string;
  status: string;
  guest_count: number;
  created_at: string;
  profiles: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

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

const AdminDashboard: React.FC = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalRSVPs: 0,
    pendingPhotos: 0,
    totalMessages: 0,
    approvedPhotos: 0,
    activeUsers: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (userRole?.role === 'admin') {
      fetchAdminData();
    }
  }, [userRole]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch users with roles
      const { data: usersData } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          email,
          first_name,
          last_name,
          created_at,
          user_roles (role)
        `);

      // Fetch RSVPs with user profiles  
      const { data: rsvpsData } = await supabase
        .from('rsvps')
        .select('*');

      // Fetch photos with user profiles
      const { data: photosData } = await supabase
        .from('photos')
        .select('*');

      // Fetch all profiles for joining
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email');

      // Fetch messages count
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      if (usersData) {
        const formattedUsers = usersData.map(user => ({
          id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          created_at: user.created_at,
          role: (Array.isArray(user.user_roles) && user.user_roles.length > 0 
            ? user.user_roles[0].role 
            : 'guest') as 'guest' | 'admin' | 'couple'
        }));
        setUsers(formattedUsers);
      }

      if (rsvpsData && profilesData) {
        const rsvpsWithProfiles = rsvpsData.map(rsvp => ({
          ...rsvp,
          profiles: profilesData.find(p => p.user_id === rsvp.user_id) || { first_name: '', last_name: '', email: '' }
        }));
        setRSVPs(rsvpsWithProfiles);
      }
      
      if (photosData && profilesData) {
        const photosWithProfiles = photosData.map(photo => ({
          ...photo,
          profiles: profilesData.find(p => p.user_id === photo.user_id) || { first_name: '', last_name: '' }
        }));
        setPhotos(photosWithProfiles);
      }

      // Calculate stats
      const pendingPhotos = photosData?.filter(p => !p.is_approved).length || 0;
      const approvedPhotos = photosData?.filter(p => p.is_approved).length || 0;
      const totalRSVPs = rsvpsData?.reduce((sum, rsvp) => sum + (rsvp.guest_count || 1), 0) || 0;

      setStats({
        totalUsers: usersData?.length || 0,
        totalRSVPs,
        pendingPhotos,
        totalMessages: messagesCount || 0,
        approvedPhotos,
        activeUsers: usersData?.filter(u => 
          new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };


  if (userRole?.role !== 'admin') {
    return (
      <div className="min-h-screen px-5 pt-12 pb-6 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </GlassCard>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen px-5 pt-12 pb-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-wedding-navy flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="wedding-heading text-wedding-navy mb-3">
          Admin Dashboard
        </h1>
        <p className="wedding-body text-muted-foreground">
          Comprehensive wedding management control center
        </p>
      </div>

      {/* Stats Overview */}
      <AdminStatsComponent stats={stats} />

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="gifts">Gifts</TabsTrigger>
          <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
          <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdminOverview stats={stats} />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement users={users} onRefresh={fetchAdminData} />
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <PhotoModeration photos={photos} onRefresh={fetchAdminData} />
        </TabsContent>

        <TabsContent value="gifts" className="space-y-4">
          <GiftManagement />
        </TabsContent>

        <TabsContent value="backgrounds" className="space-y-4">
          <BackgroundManager />
        </TabsContent>

        <TabsContent value="rsvps" className="space-y-4">
          <RSVPManagement rsvps={rsvps} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;