import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Bug, 
  Lightbulb,
  TrendingUp,
  Users,
  Heart,
  Filter,
  Send,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface FeedbackItem {
  id: string;
  type: 'feature_request' | 'bug_report' | 'general' | 'rating';
  title: string;
  message: string;
  rating?: number;
  user_name: string;
  user_email: string;
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  created_at: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  featureRequests: number;
  bugReports: number;
  satisfactionScore: number;
}

export const UserFeedbackSystem: React.FC = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState<FeedbackStats>({
    totalFeedback: 0,
    averageRating: 0,
    featureRequests: 0,
    bugReports: 0,
    satisfactionScore: 0
  });
  const [newFeedback, setNewFeedback] = useState({
    type: 'general' as 'feature_request' | 'bug_report' | 'general' | 'rating',
    title: '',
    message: '',
    rating: 5,
    category: 'general'
  });
  const [filter, setFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadFeedbackData();
  }, [filter]);

  const loadFeedbackData = () => {
    // Simulate feedback data
    const mockFeedback: FeedbackItem[] = [
      {
        id: '1',
        type: 'feature_request',
        title: 'Photo Slideshow Feature',
        message: 'It would be great to have an automatic slideshow of wedding photos',
        user_name: 'Sarah Johnson',
        user_email: 'sarah@example.com',
        status: 'pending',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        priority: 'medium',
        category: 'photos'
      },
      {
        id: '2',
        type: 'rating',
        title: 'Overall Experience',
        message: 'Love the app! So easy to RSVP and share photos',
        rating: 5,
        user_name: 'Mike Chen',
        user_email: 'mike@example.com',
        status: 'reviewed',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        priority: 'low',
        category: 'general'
      },
      {
        id: '3',
        type: 'bug_report',
        title: 'Photo Upload Issue',
        message: 'Sometimes photos take a long time to upload on mobile',
        user_name: 'Emily Davis',
        user_email: 'emily@example.com',
        status: 'reviewed',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        priority: 'high',
        category: 'photos'
      },
      {
        id: '4',
        type: 'general',
        title: 'Thank you!',
        message: 'This app made our wedding planning so much easier. Thank you!',
        user_name: 'Alex & Jordan',
        user_email: 'couple@example.com',
        status: 'reviewed',
        created_at: new Date(Date.now() - 345600000).toISOString(),
        priority: 'low',
        category: 'general'
      }
    ];

    const filteredFeedback = filter === 'all' 
      ? mockFeedback 
      : mockFeedback.filter(item => item.type === filter);

    setFeedbackItems(filteredFeedback);

    // Calculate stats
    const totalFeedback = mockFeedback.length;
    const ratings = mockFeedback.filter(item => item.rating).map(item => item.rating!);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;
    const featureRequests = mockFeedback.filter(item => item.type === 'feature_request').length;
    const bugReports = mockFeedback.filter(item => item.type === 'bug_report').length;
    const satisfactionScore = averageRating * 20; // Convert 5-star to percentage

    setStats({
      totalFeedback,
      averageRating: Number(averageRating.toFixed(1)),
      featureRequests,
      bugReports,
      satisfactionScore: Number(satisfactionScore.toFixed(1))
    });
  };

  const handleSubmitFeedback = async () => {
    if (!newFeedback.title.trim() || !newFeedback.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, this would save to the database
      const feedbackItem: FeedbackItem = {
        id: Date.now().toString(),
        type: newFeedback.type,
        title: newFeedback.title,
        message: newFeedback.message,
        rating: newFeedback.type === 'rating' ? newFeedback.rating : undefined,
        user_name: user?.email?.split('@')[0] || 'Anonymous',
        user_email: user?.email || 'anonymous@example.com',
        status: 'pending',
        created_at: new Date().toISOString(),
        priority: 'medium',
        category: newFeedback.category
      };

      setFeedbackItems(prev => [feedbackItem, ...prev]);
      setNewFeedback({
        type: 'general' as 'feature_request' | 'bug_report' | 'general' | 'rating',
        title: '',
        message: '',
        rating: 5,
        category: 'general'
      });

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll review it soon.",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature_request': return <Lightbulb className="w-4 h-4" />;
      case 'bug_report': return <Bug className="w-4 h-4" />;
      case 'rating': return <Star className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-wedding-navy flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            User Feedback System
          </h2>
          <p className="text-muted-foreground">Collect and manage user feedback for continuous improvement</p>
        </div>
      </div>

      {/* Feedback Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Feedback</p>
                <p className="text-2xl font-bold">{stats.totalFeedback}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                  <div className="flex">
                    {renderStars(Math.round(stats.averageRating))}
                  </div>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Feature Requests</p>
                <p className="text-2xl font-bold">{stats.featureRequests}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                <p className="text-2xl font-bold">{stats.satisfactionScore}%</p>
              </div>
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Management */}
      <Tabs defaultValue="submit" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
          <TabsTrigger value="manage">Manage Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Submit New Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="feedback-type">Feedback Type</Label>
                  <select
                    id="feedback-type"
                    className="w-full p-2 border rounded-md"
                    value={newFeedback.type}
                    onChange={(e) => setNewFeedback(prev => ({ 
                      ...prev, 
                      type: e.target.value as any 
                    }))}
                  >
                    <option value="general">General Feedback</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="bug_report">Bug Report</option>
                    <option value="rating">Rating & Review</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="feedback-category">Category</Label>
                  <select
                    id="feedback-category"
                    className="w-full p-2 border rounded-md"
                    value={newFeedback.category}
                    onChange={(e) => setNewFeedback(prev => ({ 
                      ...prev, 
                      category: e.target.value 
                    }))}
                  >
                    <option value="general">General</option>
                    <option value="photos">Photos</option>
                    <option value="rsvp">RSVP</option>
                    <option value="messaging">Messaging</option>
                    <option value="navigation">Navigation</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
              </div>

              {newFeedback.type === 'rating' && (
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center space-x-1 mt-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 cursor-pointer ${
                          i < newFeedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        onClick={() => setNewFeedback(prev => ({ 
                          ...prev, 
                          rating: i + 1 
                        }))}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="feedback-title">Title</Label>
                <Input
                  id="feedback-title"
                  placeholder="Brief summary of your feedback"
                  value={newFeedback.title}
                  onChange={(e) => setNewFeedback(prev => ({ 
                    ...prev, 
                    title: e.target.value 
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="feedback-message">Message</Label>
                <Textarea
                  id="feedback-message"
                  placeholder="Detailed description of your feedback"
                  value={newFeedback.message}
                  onChange={(e) => setNewFeedback(prev => ({ 
                    ...prev, 
                    message: e.target.value 
                  }))}
                  rows={4}
                />
              </div>

              <Button onClick={handleSubmitFeedback} disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Feedback Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <select
                    className="p-2 border rounded-md"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Feedback</option>
                    <option value="feature_request">Feature Requests</option>
                    <option value="bug_report">Bug Reports</option>
                    <option value="rating">Ratings</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackItems.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg glass-card">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(item.type)}
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        {item.rating && (
                          <div className="flex">
                            {renderStars(item.rating)}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{item.message}</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{item.user_name} • {item.category}</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};