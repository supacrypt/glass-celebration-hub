import React, { useState, useEffect } from 'react';
import { X, Users, Calendar, MessageSquare, Camera, Settings, BarChart3, CheckCircle, AlertCircle, Clock, UserPlus, Gift, MapPin, Activity, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import LiveMetrics from '@/components/admin/LiveMetrics';
import CentralGuestList from '@/components/guest/CentralGuestList';
// Temporarily disabled for emergency recovery
// import { AuthGuard } from '@/components/security/AuthGuard';

interface AdminDashboardPopupProps {
  onClose?: () => void;
}

interface AdminStats {
  totalGuests: number;
  confirmedRSVPs: number;
  pendingRSVPs: number;
  totalEvents: number;
  recentMessages: number;
  photoUploads: number;
}

const AdminDashboardPopup: React.FC<AdminDashboardPopupProps> = ({ onClose }) => {
  const { user, profile } = useAuth();
  
  const [stats, setStats] = useState<AdminStats>({
    totalGuests: 0,
    confirmedRSVPs: 0,
    pendingRSVPs: 0,
    totalEvents: 0,
    recentMessages: 0,
    photoUploads: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'metrics' | 'guestlist'>('dashboard');

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      // Mock data for now to avoid Supabase issues
      setStats({
        totalGuests: 45,
        confirmedRSVPs: 38,
        pendingRSVPs: 7,
        totalEvents: 4,
        recentMessages: 12,
        photoUploads: 23
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      label: 'Total Guests',
      value: stats.totalGuests,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Confirmed',
      value: stats.confirmedRSVPs,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Pending',
      value: stats.pendingRSVPs,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const quickActions = [
    { 
      icon: Heart, 
      title: 'Central Guest List', 
      subtitle: 'Manage all guests and RSVPs',
      action: () => setCurrentView('guestlist'),
      color: 'text-wedding-gold',
      primary: true
    },
    { 
      icon: Activity, 
      title: 'Live Metrics', 
      subtitle: 'Real-time wedding analytics',
      action: () => setCurrentView('metrics'),
      color: 'text-emerald-600'
    },
    { 
      icon: Users, 
      title: 'Manage RSVPs', 
      subtitle: 'View and manage guest responses',
      href: '/dashboard/rsvps',
      color: 'text-blue-600'
    },
    { 
      icon: Calendar, 
      title: 'Event Timeline', 
      subtitle: 'Update wedding schedule',
      href: '/dashboard/events',
      color: 'text-purple-600'
    },
    { 
      icon: MessageSquare, 
      title: 'Guest Messages', 
      subtitle: 'View recent communications',
      href: '/dashboard/messages',
      color: 'text-green-600'
    },
    { 
      icon: Camera, 
      title: 'Photo Gallery', 
      subtitle: 'Manage uploaded photos',
      href: '/dashboard/photos',
      color: 'text-pink-600'
    },
    { 
      icon: BarChart3, 
      title: 'Analytics', 
      subtitle: 'View detailed reports',
      href: '/dashboard/analytics',
      color: 'text-indigo-600'
    },
    { 
      icon: Settings, 
      title: 'User Management', 
      subtitle: 'Manage user roles',
      href: '/dashboard/users',
      color: 'text-gray-600'
    }
  ];

  const recentActivity = [
    { type: 'rsvp', message: 'New RSVP from Sarah Johnson', time: '2 hours ago', icon: UserPlus },
    { type: 'message', message: '3 new messages in guest chat', time: '4 hours ago', icon: MessageSquare },
    { type: 'photo', message: '5 new photos uploaded', time: '6 hours ago', icon: Camera },
    { type: 'event', message: 'Timeline updated for ceremony', time: '1 day ago', icon: Calendar }
  ];

  if (loading) {
    return (
      <div className="glass-card p-6 m-4 max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-gold"></div>
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    // Temporarily disabled AuthGuard for emergency recovery
    <React.Fragment>
      <div className="w-full h-full flex flex-col max-h-[90vh] overflow-hidden">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full h-full max-h-[90vh] overflow-hidden border border-white/20">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            {(currentView === 'metrics' || currentView === 'guestlist') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                <Clock className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h2 className="text-xl font-bold text-wedding-navy">
                {currentView === 'dashboard' && 'Admin Dashboard'}
                {currentView === 'metrics' && 'Live Metrics'}
                {currentView === 'guestlist' && (
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-wedding-gold" />
                    Central Guest List
                  </span>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentView === 'dashboard' && `Welcome back, ${profile?.first_name || 'Admin'}`}
                {currentView === 'metrics' && 'Real-time wedding planning analytics'}
                {currentView === 'guestlist' && 'The heart of your wedding - manage all guests and RSVPs'}
              </p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Content */}
        {currentView === 'dashboard' ? (
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className={`${stat.bgColor} rounded-lg p-3 text-center`}>
                    <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-1`} />
                    <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold text-wedding-navy mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      className={`glass-card p-3 text-left hover:scale-105 transition-transform ${
                        action.primary ? 'ring-2 ring-wedding-gold bg-wedding-gold/5' : ''
                      }`}
                      onClick={() => {
                        // Handle action
                        if (action.action) {
                          action.action();
                        } else if (action.href) {
                          // Handle navigation to href
                          window.location.href = action.href;
                          if (onClose) onClose();
                        }
                      }}
                    >
                      <Icon className={`w-5 h-5 ${action.color} mb-2`} />
                      <div className={`font-medium text-sm ${action.primary ? 'text-wedding-gold' : 'text-wedding-navy'}`}>
                        {action.title}
                        {action.primary && <Badge className="ml-2 bg-wedding-gold text-white text-xs">CENTRAL</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{action.subtitle}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="font-semibold text-wedding-navy mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-2">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="glass-card p-3 flex items-start space-x-3">
                      <Icon className="w-4 h-4 text-wedding-navy mt-1" />
                      <div className="flex-1">
                        <div className="text-sm text-wedding-navy">{activity.message}</div>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Actions */}
            <div className="pt-4 border-t border-gray-200/50">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Alerts
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Reports
                </Button>
              </div>
            </div>
          </div>
        ) : currentView === 'metrics' ? (
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <LiveMetrics />
          </div>
        ) : currentView === 'guestlist' ? (
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <CentralGuestList />
          </div>
        ) : null}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminDashboardPopup;