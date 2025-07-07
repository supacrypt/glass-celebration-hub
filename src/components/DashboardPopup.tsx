import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Users, Image, Calendar, MessageSquare, BarChart3, CheckCircle, AlertTriangle, Activity, Gift, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminStatsComponent from '@/components/admin/AdminStats';
import UserManagement from '@/components/admin/UserManagement';
import PhotoModeration from '@/components/admin/PhotoModeration';
import RSVPManagement from '@/components/admin/RSVPManagement';
import AdminOverview from '@/components/admin/AdminOverview';
import GiftManagement from '@/components/admin/GiftManagement';

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

interface DashboardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'guest' | 'admin' | 'couple';
}

const DashboardPopup: React.FC<DashboardPopupProps> = ({ isOpen, onClose, userRole }) => {
  const [activeTab, setActiveTab] = useState('overview');
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
  const { toast } = useToast();
  const { userRole: authUserRole } = useAuth();

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'gifts', label: 'Gifts', icon: Gift },
    { id: 'rsvps', label: 'RSVPs', icon: Calendar },
  ];

  const guestTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'rsvps', label: 'RSVP', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const tabs = authUserRole?.role === 'admin' ? adminTabs : guestTabs;

  useEffect(() => {
    if (isOpen && authUserRole?.role === 'admin') {
      fetchAdminData();
    } else if (isOpen) {
      setLoading(false);
    }
  }, [isOpen, authUserRole]);

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
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Close modal on escape key
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

  // Access restriction check
  if (authUserRole?.role !== 'admin' && authUserRole?.role !== 'couple' && authUserRole?.role !== 'guest') {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] transition-opacity duration-300"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div 
            className="glass-popup p-8 text-center max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-4">You need proper privileges to access the dashboard.</p>
            <button
              onClick={onClose}
              className="glass-button px-4 py-2 text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Full-Screen Modal */}
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4">
        <div 
          className="glass-popup w-full h-full sm:w-[95vw] sm:h-[90vh] sm:max-w-7xl overflow-hidden flex flex-col animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-wedding-navy flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-wedding-navy">
                  {authUserRole?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {authUserRole?.role === 'admin' ? 'Comprehensive wedding management' : 'Your wedding dashboard'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="glass-button w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && (
            <div className="flex-1 overflow-hidden">
              {authUserRole?.role === 'admin' ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="flex-shrink-0 px-4 sm:px-6 pt-4">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="users">Users</TabsTrigger>
                      <TabsTrigger value="photos">Photos</TabsTrigger>
                      <TabsTrigger value="gifts">Gifts</TabsTrigger>
                      <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                    <TabsContent value="overview" className="space-y-6 mt-0">
                      <AdminStatsComponent stats={stats} />
                      <AdminOverview stats={stats} />
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4 mt-0">
                      <UserManagement users={users} onRefresh={fetchAdminData} />
                    </TabsContent>

                    <TabsContent value="photos" className="space-y-4 mt-0">
                      <PhotoModeration photos={photos} onRefresh={fetchAdminData} />
                    </TabsContent>

                    <TabsContent value="gifts" className="space-y-4 mt-0">
                      <GiftManagement />
                    </TabsContent>

                    <TabsContent value="rsvps" className="space-y-4 mt-0">
                      <RSVPManagement rsvps={rsvps} />
                    </TabsContent>
                  </div>
                </Tabs>
              ) : (
                // Guest Dashboard - Simple version
                <div className="p-4 sm:p-6 h-full overflow-y-auto">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-wedding-navy mb-2">Welcome to Your Dashboard</h3>
                      <p className="text-muted-foreground">Access your wedding information and features</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="glass-card p-4 text-center">
                        <Calendar className="w-8 h-8 mx-auto mb-2 text-glass-blue" />
                        <div className="text-lg font-semibold text-wedding-navy">42</div>
                        <div className="text-xs text-muted-foreground">Days Left</div>
                      </div>
                      <div className="glass-card p-4 text-center">
                        <Users className="w-8 h-8 mx-auto mb-2 text-glass-green" />
                        <div className="text-lg font-semibold text-wedding-navy">67/85</div>
                        <div className="text-xs text-muted-foreground">RSVPs</div>
                      </div>
                      <div className="glass-card p-4 text-center">
                        <Image className="w-8 h-8 mx-auto mb-2 text-glass-purple" />
                        <div className="text-lg font-semibold text-wedding-navy">134</div>
                        <div className="text-xs text-muted-foreground">Photos</div>
                      </div>
                      <div className="glass-card p-4 text-center">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-glass-pink" />
                        <div className="text-lg font-semibold text-wedding-navy">23</div>
                        <div className="text-xs text-muted-foreground">Messages</div>
                      </div>
                    </div>

                    <div className="glass-card p-4">
                      <h3 className="text-base font-semibold text-wedding-navy mb-3">Quick Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={onClose}
                          className="glass-button p-3 text-left hover:scale-105 transition-transform"
                        >
                          <Calendar className="w-5 h-5 mb-2 text-glass-blue" />
                          <div className="font-medium">Update RSVP</div>
                          <div className="text-xs text-muted-foreground">Confirm your attendance</div>
                        </button>
                        <button
                          onClick={onClose}
                          className="glass-button p-3 text-left hover:scale-105 transition-transform"
                        >
                          <Image className="w-5 h-5 mb-2 text-glass-green" />
                          <div className="font-medium">View Gallery</div>
                          <div className="text-xs text-muted-foreground">Browse wedding photos</div>
                        </button>
                        <button
                          onClick={onClose}
                          className="glass-button p-3 text-left hover:scale-105 transition-transform"
                        >
                          <Gift className="w-5 h-5 mb-2 text-glass-purple" />
                          <div className="font-medium">Gift Registry</div>
                          <div className="text-xs text-muted-foreground">View gift options</div>
                        </button>
                        <button
                          onClick={onClose}
                          className="glass-button p-3 text-left hover:scale-105 transition-transform"
                        >
                          <MessageSquare className="w-5 h-5 mb-2 text-glass-pink" />
                          <div className="font-medium">Send Message</div>
                          <div className="text-xs text-muted-foreground">Connect with others</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPopup;