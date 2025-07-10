import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminDashboardContent from '@/components/dashboard/AdminDashboardContent';
import AdminLoginModal from '@/components/admin/AdminLoginModal';

const ImprovedAdminDashboard: React.FC = () => {
  const { userRole } = useAuth();
  const { user: adminUser, signOut: adminSignOut } = useAdminAuth();
  const { stats, users, rsvps, photos, loading, fetchDashboardData } = useDashboardData();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Check if user has admin access
  const hasAdminAccess = userRole?.role === 'admin' || adminUser?.isAdmin;

  useEffect(() => {
    // Show login modal if no admin access
    if (!hasAdminAccess && !loading) {
      setShowLoginModal(true);
    }
  }, [hasAdminAccess, loading]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    fetchDashboardData(); // Refresh data after successful login
  };

  const handleSignOut = async () => {
    await adminSignOut();
    setShowLoginModal(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen px-5 pt-12 pb-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Access denied state
  if (!hasAdminAccess) {
    return (
      <>
        <div className="min-h-screen px-5 pt-12 pb-6 flex items-center justify-center">
          <Card className="glass-card max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-wedding-navy/10 rounded-full w-fit">
                <Shield className="h-8 w-8 text-wedding-navy" />
              </div>
              <CardTitle className="text-xl text-wedding-navy">
                Admin Access Required
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You need admin privileges to access the dashboard.
              </p>
              <div className="flex gap-3">
                <Link to="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
                <Button 
                  onClick={() => setShowLoginModal(true)}
                  className="flex-1 bg-wedding-navy hover:bg-wedding-navy/90"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <AdminLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // Admin dashboard content
  return (
    <div className="min-h-screen px-5 pt-12 pb-24">
      {/* Enhanced Header */}
      <div className="glass-card p-6 mb-6 animate-fade-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-wedding-navy flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-wedding-navy">Admin Dashboard</h1>
              <p className="text-wedding-gold">
                Welcome, {adminUser?.email || userRole?.role}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLoginModal(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Authentication</p>
                <p className="text-lg font-semibold text-green-600">Active</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="text-lg font-semibold text-wedding-navy">Admin</p>
              </div>
              <Settings className="h-8 w-8 text-wedding-navy" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-lg font-semibold text-wedding-gold">
                  {stats?.totalUsers || 0}
                </p>
              </div>
              <ArrowLeft className="h-8 w-8 text-wedding-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <AdminDashboardContent
        stats={stats}
        users={users}
        rsvps={rsvps}
        photos={photos}
        onRefresh={fetchDashboardData}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default ImprovedAdminDashboard;