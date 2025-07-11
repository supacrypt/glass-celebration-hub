import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import GlassCard from '@/components/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import AdminStatsComponent from '@/components/admin/AdminStats';
import UserManagement from '@/components/admin/UserManagement';
import PhotoModeration from '@/components/admin/PhotoModeration';
import RSVPManagement from '@/components/admin/RSVPManagement';
import AdminOverview from '@/components/admin/AdminOverview';
import ContentManagementSystem from '@/components/admin/ContentManagementSystem';

const AdminDashboard: React.FC = () => {
  const { userRole } = useAuth();
  const { stats, users, rsvps, photos, loading, fetchDashboardData } = useDashboardData();
  const [activeTab, setActiveTab] = useState('overview');

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


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
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdminOverview stats={stats} />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <ContentManagementSystem />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement users={users} onRefresh={fetchDashboardData} />
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <PhotoModeration photos={photos} onRefresh={fetchDashboardData} />
        </TabsContent>

        {/* Gifts tab removed - now managed in consolidated admin dashboard */}

        <TabsContent value="rsvps" className="space-y-4">
          <RSVPManagement rsvps={rsvps} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;