import React, { useState, useEffect } from 'react';
import { X, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompactStats from '@/components/admin/CompactStats';
import CompactUserManagement from '@/components/admin/CompactUserManagement';
import CompactPhotoModeration from '@/components/admin/CompactPhotoModeration';
import CompactRSVPManagement from '@/components/admin/CompactRSVPManagement';
import CompactGiftManagement from '@/components/admin/CompactGiftManagement';
import CompactSystemSettings from '@/components/admin/CompactSystemSettings';

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
    { id: 'stats', label: 'Stats' },
    { id: 'users', label: 'Users' },
    { id: 'photos', label: 'Photos' },
    { id: 'gifts', label: 'Gifts' },
    { id: 'rsvps', label: 'RSVPs' },
    { id: 'settings', label: 'Settings' },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

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
      {/* Invisible Backdrop */}
      <div 
        className="fixed inset-0 z-[100] transition-all duration-300 ease-out"
        onClick={onClose}
      />
      
      {/* Compact Dashboard Modal - Positioned close to bottom navigation */}
      <div className="fixed left-1/2 transform -translate-x-1/2 z-[110]" style={{ bottom: 'calc(30px + 80px + 15px)' }}>
        <div 
          className="glass-popup animate-scale-in"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 'min(90vw, 450px)',
            maxHeight: 'min(60vh, 400px)',
            minHeight: '300px'
          }}
        >
          {/* Compact Header */}
          <div className="flex items-center justify-between p-4 border-b border-glass-border/50">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-wedding-navy" />
              <h2 className="text-lg font-semibold text-wedding-navy">
                {authUserRole?.role === 'admin' ? 'Admin Control' : 'Dashboard'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="glass-button w-8 h-8 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Compact Content */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-navy" />
              </div>
            ) : authUserRole?.role === 'admin' ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                {/* Compact Tab Navigation */}
                <div className="px-4 pt-2">
                  <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 glass-secondary h-8">
                    {adminTabs.map((tab) => (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id} 
                        className="text-xs px-2"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Tab Content with Scroll */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                  <TabsContent value="stats" className="mt-0">
                    <CompactStats stats={stats} />
                  </TabsContent>

                  <TabsContent value="users" className="mt-0">
                    <CompactUserManagement users={users} onRefresh={fetchAdminData} />
                  </TabsContent>

                  <TabsContent value="photos" className="mt-0">
                    <CompactPhotoModeration photos={photos} onRefresh={fetchAdminData} />
                  </TabsContent>

                  <TabsContent value="gifts" className="mt-0">
                    <CompactGiftManagement />
                  </TabsContent>

                  <TabsContent value="rsvps" className="mt-0">
                    <CompactRSVPManagement rsvps={rsvps} />
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0">
                    <CompactSystemSettings />
                  </TabsContent>
                </div>
              </Tabs>
            ) : (
              // Guest Compact Dashboard
              <div className="p-4 space-y-4 h-full overflow-y-auto">
                <CompactStats stats={stats} />
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onClose}
                    className="glass-card p-3 text-center space-y-1 hover:scale-105 transition-transform"
                  >
                    <div className="text-sm font-medium text-wedding-navy">RSVP</div>
                    <div className="text-xs text-muted-foreground">Update status</div>
                  </button>
                  <button
                    onClick={onClose}
                    className="glass-card p-3 text-center space-y-1 hover:scale-105 transition-transform"
                  >
                    <div className="text-sm font-medium text-wedding-navy">Gallery</div>
                    <div className="text-xs text-muted-foreground">View photos</div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPopup;