import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from '@/components/AdminDashboard';
import GlassCard from '@/components/GlassCard';
import { Users, Image, Calendar, Heart, Gift, MessageCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { userRole } = useAuth();

  // Show admin dashboard for admin users
  if (userRole?.role === 'admin') {
    return <AdminDashboard />;
  }
  const stats = [
    { label: 'RSVPs', value: '67', total: '85', icon: Users, color: 'text-glass-blue' },
    { label: 'Photos', value: '134', total: null, icon: Image, color: 'text-glass-green' },
    { label: 'Days Left', value: '42', total: null, icon: Calendar, color: 'text-glass-pink' },
    { label: 'Messages', value: '23', total: null, icon: MessageCircle, color: 'text-glass-purple' },
  ];

  const quickActions = [
    { title: 'View Guest List', icon: Users, description: 'Manage RSVPs and guest details' },
    { title: 'Photo Gallery', icon: Image, description: 'View and moderate wedding photos' },
    { title: 'Gift Registry', icon: Gift, description: 'Track gifts and thank you notes' },
    { title: 'Send Updates', icon: MessageCircle, description: 'Communicate with guests' },
  ];

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-wedding-navy flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-3 h-3 bg-white rounded-sm" />
            <div className="w-3 h-3 bg-white rounded-sm" />
            <div className="w-3 h-3 bg-white rounded-sm" />
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
        </div>
        <h1 className="wedding-heading text-wedding-navy mb-3">
          Wedding Dashboard
        </h1>
        <p className="wedding-body text-muted-foreground">
          Manage your wedding celebration
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => (
          <GlassCard 
            key={stat.label} 
            className="p-5 animate-fade-up" 
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              {stat.total && (
                <div className="text-xs text-muted-foreground">
                  of {stat.total}
                </div>
              )}
            </div>
            <div className="text-2xl font-light text-wedding-navy mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat.label}
            </div>
            {stat.total && (
              <div className="mt-2 w-full bg-border rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-glass-blue to-glass-purple h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${(parseInt(stat.value) / parseInt(stat.total)) * 100}%` }}
                />
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Recent Activity */}
      <GlassCard className="mb-8 p-6 animate-fade-up" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-lg font-semibold mb-4 text-wedding-navy flex items-center gap-2">
          <Heart className="w-5 h-5 text-glass-pink" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-glass bg-secondary/30">
            <div className="w-2 h-2 bg-glass-green rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium">Emma Johnson RSVPed</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-glass bg-secondary/30">
            <div className="w-2 h-2 bg-glass-blue rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium">3 new photos uploaded</p>
              <p className="text-xs text-muted-foreground">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-glass bg-secondary/30">
            <div className="w-2 h-2 bg-glass-purple rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium">Gift registry updated</p>
              <p className="text-xs text-muted-foreground">1 day ago</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-wedding-navy animate-fade-up" style={{ animationDelay: '0.6s' }}>
          Quick Actions
        </h2>
        {quickActions.map((action, index) => (
          <GlassCard 
            key={action.title}
            className="p-4 animate-fade-up cursor-pointer hover:bg-secondary/20" 
            style={{ animationDelay: `${0.7 + (index * 0.1)}s` }}
            variant="secondary"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-glass bg-wedding-navy/10 flex items-center justify-center">
                <action.icon className="w-5 h-5 text-wedding-navy" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-wedding-navy">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <div className="text-glass-blue">→</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;