import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Image, 
  Calendar, 
  MessageSquare, 
  Shield, 
  TrendingUp,
  Eye,
  Check,
  X,
  Search,
  Filter,
  Download,
  Send,
  Settings,
  Activity,
  BarChart3,
  Clock,
  MapPin,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [searchTerm, setSearchTerm] = useState('');
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
          user_roles!inner (role)
        `);

      // Fetch RSVPs with user profiles  
      const { data: rsvpsData } = await supabase
        .from('rsvps')
        .select(`
          *,
          profiles!inner (first_name, last_name, email)
        `);

      // Fetch photos with user profiles
      const { data: photosData } = await supabase
        .from('photos')
        .select(`
          *,
          profiles!inner (first_name, last_name)
        `);

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
          role: (user.user_roles?.[0]?.role || 'guest') as 'guest' | 'admin' | 'couple'
        }));
        setUsers(formattedUsers);
      }

      if (rsvpsData) setRSVPs(rsvpsData);
      if (photosData) setPhotos(photosData);

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

  const handlePhotoApproval = async (photoId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('photos')
        .update({ is_approved: approved })
        .eq('id', photoId);

      if (error) throw error;

      setPhotos(prev => prev.map(photo => 
        photo.id === photoId ? { ...photo, is_approved: approved } : photo
      ));

      toast({
        title: "Success",
        description: `Photo ${approved ? 'approved' : 'rejected'} successfully`,
      });

      // Refresh stats
      fetchAdminData();
    } catch (error) {
      console.error('Error updating photo:', error);
      toast({
        title: "Error",
        description: "Failed to update photo status",
        variant: "destructive"
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'guest' | 'admin' | 'couple') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
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

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingPhotos = photos.filter(p => !p.is_approved);

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-glass-blue' },
          { label: 'Total RSVPs', value: stats.totalRSVPs, icon: Calendar, color: 'text-glass-green' },
          { label: 'Pending Photos', value: stats.pendingPhotos, icon: Clock, color: 'text-glass-pink' },
          { label: 'Approved Photos', value: stats.approvedPhotos, icon: Check, color: 'text-glass-purple' },
          { label: 'Messages', value: stats.totalMessages, icon: MessageSquare, color: 'text-glass-blue' },
          { label: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'text-glass-green' },
        ].map((stat, index) => (
          <GlassCard 
            key={stat.label}
            className="p-4 animate-fade-up" 
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-light text-wedding-navy mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat.label}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-wedding-navy flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-glass bg-secondary/30">
                <div className="w-2 h-2 bg-glass-green rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{stats.totalUsers} users registered</p>
                  <p className="text-xs text-muted-foreground">Total platform users</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-glass bg-secondary/30">
                <div className="w-2 h-2 bg-glass-blue rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{stats.pendingPhotos} photos pending approval</p>
                  <p className="text-xs text-muted-foreground">Require moderation</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-glass bg-secondary/30">
                <div className="w-2 h-2 bg-glass-purple rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{stats.totalRSVPs} total RSVPs received</p>
                  <p className="text-xs text-muted-foreground">Guest confirmations</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <GlassCard className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-glass bg-secondary/30">
                  <div className="flex-1">
                    <div className="font-medium text-wedding-navy">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'guest' : 'admin')}
                    >
                      {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-4 text-wedding-navy">Pending Photo Approvals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPhotos.map((photo) => (
                <div key={photo.id} className="rounded-glass bg-secondary/30 p-4">
                  <img 
                    src={photo.file_url} 
                    alt={photo.title || 'Wedding photo'} 
                    className="w-full h-48 object-cover rounded-glass mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        By {photo.profiles?.first_name} {photo.profiles?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(photo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePhotoApproval(photo.id, false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handlePhotoApproval(photo.id, true)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {pendingPhotos.length === 0 && (
              <div className="text-center py-8">
                <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No photos pending approval</p>
              </div>
            )}
          </GlassCard>
        </TabsContent>

        <TabsContent value="rsvps" className="space-y-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-4 text-wedding-navy">RSVP Management</h3>
            <div className="space-y-3">
              {rsvps.map((rsvp) => (
                <div key={rsvp.id} className="flex items-center justify-between p-3 rounded-glass bg-secondary/30">
                  <div className="flex-1">
                    <div className="font-medium text-wedding-navy">
                      {rsvp.profiles?.first_name} {rsvp.profiles?.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">{rsvp.profiles?.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {rsvp.guest_count} guest{rsvp.guest_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rsvp.status === 'attending' ? 'default' : 'secondary'}>
                      {rsvp.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {new Date(rsvp.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {rsvps.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No RSVPs received yet</p>
              </div>
            )}
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;