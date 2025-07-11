import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Button } from '@/components/ui/button';
import AdminDashboardContent from '@/components/dashboard/AdminDashboardContent';
import SupabaseSecurityFix from '@/components/admin/SupabaseSecurityFix';

const AdminDashboard: React.FC = () => {
  const { userRole } = useAuth();
  const { stats, users, rsvps, photos, loading, fetchDashboardData } = useDashboardData();

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (userRole?.role !== 'admin') {
    return (
      <div className="min-h-screen px-5 pt-12 pb-6 flex items-center justify-center">
        <div className="glass-popup p-8 text-center max-w-md w-full">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
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
    <div className="min-h-screen px-5 pt-12 pb-24">
      {/* Header */}
      <div className="glass-card p-6 mb-6 animate-fade-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-wedding-navy flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="wedding-heading text-wedding-navy">
                Admin Dashboard
              </h1>
              <p className="wedding-body text-muted-foreground">
                Comprehensive wedding management control center
              </p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Security Fix Section */}
      <div className="mb-6">
        <SupabaseSecurityFix />
      </div>

      {/* Full Dashboard Content */}
      <div className="glass-card p-6 min-h-[600px]">
        <AdminDashboardContent
          stats={stats}
          users={users}
          rsvps={rsvps}
          photos={photos}
          onRefresh={fetchDashboardData}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;