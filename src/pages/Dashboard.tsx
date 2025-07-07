import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { 
  Users, Image, Calendar, MessageSquare, BarChart3, CheckCircle, 
  AlertTriangle, Activity, Heart, Gift, ArrowRight 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'rsvps', label: 'RSVPs', icon: Calendar },
  ];

  const guestTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'rsvps', label: 'RSVP', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const tabs = userRole?.role === 'admin' ? adminTabs : guestTabs;

  const adminStats = [
    { label: 'Total Users', value: '156', icon: CheckCircle, color: 'text-blue-600' },
    { label: 'Total RSVPs', value: '89', icon: Calendar, color: 'text-pink-600' },
    { label: 'Pending Photos', value: '12', icon: AlertTriangle, color: 'text-orange-600' },
    { label: 'Total Messages', value: '342', icon: MessageSquare, color: 'text-purple-600' },
    { label: 'Approved Photos', value: '234', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Active Users', value: '45', icon: Activity, color: 'text-indigo-600' },
  ];

  const guestStats = [
    { label: 'RSVPs', value: '67', total: '85', icon: Users, color: 'text-blue-600' },
    { label: 'Photos', value: '134', icon: Image, color: 'text-green-600' },
    { label: 'Days Left', value: '42', icon: Calendar, color: 'text-pink-600' },
    { label: 'Messages', value: '23', icon: MessageSquare, color: 'text-purple-600' },
  ];

  const quickActions = [
    { title: 'View Guest List', icon: Users, description: 'Manage RSVPs and guest details', path: '/rsvp' },
    { title: 'Photo Gallery', icon: Image, description: 'View and moderate wedding photos', path: '/gallery' },
    { title: 'Gift Registry', icon: Gift, description: 'Track gifts and thank you notes', path: '/gallery' },
    { title: 'Send Updates', icon: MessageSquare, description: 'Communicate with guests', path: '/social' },
  ];

  const recentActivity = [
    { icon: '📸', text: 'New photo uploaded by John Doe', time: '2 min ago' },
    { icon: '✅', text: 'Sarah Smith confirmed RSVP', time: '15 min ago' },
    { icon: '👤', text: 'New user registration: Mike Johnson', time: '1 hour ago' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className={`grid gap-4 ${userRole?.role === 'admin' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2'}`}>
              {(userRole?.role === 'admin' ? adminStats : guestStats).map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <GlassCard key={index} className="p-4" variant="secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-primary">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                        {'total' in stat && stat.total && typeof stat.total === 'string' && (
                          <div className="mt-1 w-full bg-border rounded-full h-1">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-700"
                              style={{ width: `${(parseInt(stat.value) / parseInt(stat.total)) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            {/* Recent Activity for guests or Quick Actions for admin */}
            {userRole?.role === 'admin' ? (
              <GlassCard className="p-6">
                <h3 className="text-base font-semibold text-primary mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <span className="text-base">{activity.icon}</span>
                      <span className="flex-1 text-foreground text-sm">{activity.text}</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-primary">Quick Actions</h2>
                {quickActions.map((action, index) => (
                  <GlassCard 
                    key={action.title}
                    className="p-4 cursor-pointer hover:bg-secondary/20 transition-colors" 
                    onClick={() => handleNavigate(action.path)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <action.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-primary">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-accent" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        );

      case 'users':
        return (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-primary">User Management</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassCard 
                className="p-4 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleNavigate('/dashboard/users')}
              >
                <div className="text-sm font-medium text-foreground text-center">View All Users</div>
              </GlassCard>
              <GlassCard 
                className="p-4 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="text-sm font-medium text-foreground text-center">Manage Roles</div>
              </GlassCard>
            </div>
            <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-xl">
              Manage user roles (guest, admin, couple), track user activity, and handle account management functions.
            </div>
          </div>
        );

      case 'photos':
        return (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-primary">
              {userRole?.role === 'admin' ? 'Photo Moderation' : 'Photo Gallery'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userRole?.role === 'admin' ? (
                <>
                  <GlassCard className="p-4 bg-red-500/20 cursor-pointer hover:scale-105 transition-transform animate-pulse">
                    <div className="text-sm font-medium text-red-700 text-center">Review Pending (12)</div>
                  </GlassCard>
                  <GlassCard 
                    className="p-4 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleNavigate('/dashboard/photos')}
                  >
                    <div className="text-sm font-medium text-foreground text-center">Approved Photos</div>
                  </GlassCard>
                </>
              ) : (
                <>
                  <GlassCard 
                    className="p-4 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleNavigate('/gallery')}
                  >
                    <div className="text-sm font-medium text-foreground text-center">View Gallery</div>
                  </GlassCard>
                  <GlassCard className="p-4 cursor-pointer hover:scale-105 transition-transform">
                    <div className="text-sm font-medium text-foreground text-center">Upload Photos</div>
                  </GlassCard>
                </>
              )}
            </div>
            <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-xl">
              {userRole?.role === 'admin' 
                ? 'Review and moderate photo uploads, manage gallery content, and track photo statistics.'
                : 'View wedding photos and upload your own memories to share with everyone.'
              }
            </div>
          </div>
        );

      case 'rsvps':
        return (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-primary">
              {userRole?.role === 'admin' ? 'RSVP Management' : 'RSVP Status'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userRole?.role === 'admin' ? (
                <>
                  <GlassCard className="p-4 cursor-pointer hover:scale-105 transition-transform">
                    <div className="text-sm font-medium text-foreground text-center">View All RSVPs</div>
                  </GlassCard>
                  <GlassCard className="p-4 cursor-pointer hover:scale-105 transition-transform">
                    <div className="text-sm font-medium text-foreground text-center">Export Guest Data</div>
                  </GlassCard>
                </>
              ) : (
                <>
                  <GlassCard 
                    className="p-4 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleNavigate('/rsvp')}
                  >
                    <div className="text-sm font-medium text-foreground text-center">Update RSVP</div>
                  </GlassCard>
                  <GlassCard className="p-4 cursor-pointer hover:scale-105 transition-transform">
                    <div className="text-sm font-medium text-foreground text-center">View Status</div>
                  </GlassCard>
                </>
              )}
            </div>
            <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-xl">
              {userRole?.role === 'admin'
                ? 'View RSVP responses, manage guest lists, track attendance numbers, and handle guest count management.'
                : 'Update your RSVP status and view event details for the wedding celebration.'
              }
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-primary">Messages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassCard 
                className="p-4 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleNavigate('/social')}
              >
                <div className="text-sm font-medium text-foreground text-center">View Messages</div>
              </GlassCard>
              <GlassCard 
                className="p-4 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleNavigate('/social')}
              >
                <div className="text-sm font-medium text-foreground text-center">Send Message</div>
              </GlassCard>
            </div>
            <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-xl">
              Connect with other wedding guests, share memories, and stay updated with wedding announcements.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-6 pb-24">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
            <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
            <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
            <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
          </div>
        </div>
        <h1 className="wedding-heading text-primary mb-3">
          {userRole?.role === 'admin' ? 'Admin Dashboard' : 'Wedding Dashboard'}
        </h1>
        <p className="wedding-body text-muted-foreground">
          {userRole?.role === 'admin' ? 'Manage your wedding platform' : 'Manage your wedding celebration'}
        </p>
      </div>

      {/* Desktop and Tablet Navigation */}
      <div className="hidden sm:flex justify-center mb-8">
        <GlassCard className="p-1">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all relative rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden mb-6">
        <GlassCard className="p-1">
          <div className="grid grid-cols-2 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 p-3 text-xs font-medium transition-all rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-up">
        <GlassCard className="p-6">
          {renderTabContent()}
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;