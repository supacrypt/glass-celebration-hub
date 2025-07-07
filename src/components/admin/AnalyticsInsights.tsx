import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Eye, MessageCircle, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface AnalyticsData {
  userGrowth: number;
  photoEngagement: number;
  rsvpResponseRate: number;
  popularContent: Array<{
    type: 'photo' | 'message';
    id: string;
    engagement: number;
    title?: string;
  }>;
  activityTrends: Array<{
    date: string;
    users: number;
    photos: number;
    messages: number;
  }>;
}

const AnalyticsInsights: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userGrowth: 0,
    photoEngagement: 0,
    rsvpResponseRate: 0,
    popularContent: [],
    activityTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch user growth (last 7 days vs previous 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

      const { data: previousUsers } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', fourteenDaysAgo.toISOString())
        .lt('created_at', sevenDaysAgo.toISOString());

      const userGrowth = recentUsers?.length && previousUsers?.length 
        ? Math.round(((recentUsers.length - previousUsers.length) / previousUsers.length) * 100)
        : 0;

      // Fetch photo engagement
      const { data: photosWithLikes } = await supabase
        .from('photos')
        .select(`
          id,
          title,
          photo_likes (count)
        `);

      const totalPhotos = photosWithLikes?.length || 0;
      const totalLikes = photosWithLikes?.reduce((sum, photo) => 
        sum + (Array.isArray(photo.photo_likes) ? photo.photo_likes.length : 0), 0) || 0;
      const photoEngagement = totalPhotos > 0 ? Math.round((totalLikes / totalPhotos) * 100) / 100 : 0;

      // Fetch RSVP response rate
      const { data: allRsvps } = await supabase
        .from('rsvps')
        .select('status');

      const totalRsvps = allRsvps?.length || 0;
      const respondedRsvps = allRsvps?.filter(r => r.status !== 'pending').length || 0;
      const rsvpResponseRate = totalRsvps > 0 ? Math.round((respondedRsvps / totalRsvps) * 100) : 0;

      setAnalytics({
        userGrowth,
        photoEngagement,
        rsvpResponseRate,
        popularContent: [], // Would be implemented with more complex queries
        activityTrends: [] // Would be implemented with time-series data
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading analytics...</div>;
  }

  const insights = [
    {
      title: 'User Growth',
      value: `${analytics.userGrowth > 0 ? '+' : ''}${analytics.userGrowth}%`,
      description: 'Last 7 days vs previous',
      icon: TrendingUp,
      color: analytics.userGrowth > 0 ? 'glass-green' : 'glass-pink',
      trend: analytics.userGrowth > 0 ? 'up' : 'down'
    },
    {
      title: 'Photo Engagement',
      value: `${analytics.photoEngagement}`,
      description: 'Avg likes per photo',
      icon: Heart,
      color: 'glass-purple',
      trend: 'neutral'
    },
    {
      title: 'RSVP Response Rate',
      value: `${analytics.rsvpResponseRate}%`,
      description: 'Guests who responded',
      icon: Calendar,
      color: 'glass-blue',
      trend: 'neutral'
    }
  ];

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 text-${insight.color}`} />
                <Badge variant={insight.trend === 'up' ? 'default' : insight.trend === 'down' ? 'destructive' : 'secondary'}>
                  {insight.trend === 'up' ? '↗' : insight.trend === 'down' ? '↘' : '→'}
                </Badge>
              </div>
              <div>
                <div className="text-xl font-bold text-wedding-navy">
                  {insight.value}
                </div>
                <div className="text-sm font-medium text-wedding-navy">
                  {insight.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {insight.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Heatmap Placeholder */}
      <div className="glass-card p-4">
        <h4 className="text-sm font-medium text-wedding-navy mb-3">Activity Overview</h4>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 28 }, (_, i) => (
            <div
              key={i}
              className={`w-full aspect-square rounded ${
                Math.random() > 0.7 ? 'bg-glass-green/30' :
                Math.random() > 0.4 ? 'bg-glass-blue/20' :
                'bg-muted/20'
              }`}
              title={`Day ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>4 weeks ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="glass-card p-4">
        <h4 className="text-sm font-medium text-wedding-navy mb-3">Top Engagement</h4>
        <div className="space-y-2">
          {['Wedding Ceremony Photos', 'Reception Dance Floor', 'Couple Portraits'].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-glass-blue" />
                <span className="text-sm text-wedding-navy">{item}</span>
              </div>
              <Badge variant="secondary">{Math.floor(Math.random() * 50) + 10} views</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsInsights;