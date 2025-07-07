import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminStatsComponent from '@/components/admin/AdminStats';
import UserManagement from '@/components/admin/UserManagement';
import PhotoModeration from '@/components/admin/PhotoModeration';
import RSVPManagement from '@/components/admin/RSVPManagement';
import AdminOverview from '@/components/admin/AdminOverview';
import GiftManagement from '@/components/admin/GiftManagement';
import BackgroundManager from '@/components/admin/BackgroundManager';
import EventManagement from '@/components/admin/EventManagement';
import SettingsManager from '@/components/admin/SettingsManager';

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

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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

  useEffect(() => {
    if (isOpen && userRole?.role === 'admin') {
      fetchAdminData();
    }
  }, [isOpen, userRole]);

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

  // Handle keyboard escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Access control
  if (userRole?.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative glass-popup p-8 text-center max-w-md mx-4">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground mb-4">You need admin privileges to access this dashboard.</p>
          <button
            onClick={onClose}
            className="glass-button px-4 py-2 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative glass-popup p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-[95vw] h-[90vh] max-w-7xl mx-4 glass-popup overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-wedding-warm/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-wedding-navy flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-wedding-navy">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Comprehensive wedding management control center
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="glass-button w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted/50"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-wedding-warm/20">
          <AdminStatsComponent stats={stats} />
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mx-6 mt-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="gifts">Gifts</TabsTrigger>
              <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
              <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="overview" className="mt-0">
                <AdminOverview stats={stats} />
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <EventManagement />
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <UserManagement users={users} onRefresh={fetchAdminData} />
              </TabsContent>

              <TabsContent value="photos" className="mt-0">
                <PhotoModeration photos={photos} onRefresh={fetchAdminData} />
              </TabsContent>

              <TabsContent value="gifts" className="mt-0">
                <GiftManagement />
              </TabsContent>

              <TabsContent value="backgrounds" className="mt-0">
                <BackgroundManager />
              </TabsContent>

              <TabsContent value="rsvps" className="mt-0">
                <RSVPManagement rsvps={rsvps} />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <SettingsManager />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardModal;