import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Users, Bell, Megaphone, Mail, Heart, Reply, Trash2, Filter, Search, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedMessage {
  id: string;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles: {
    first_name?: string;
    last_name?: string;
    email: string;
    display_name?: string;
  };
  message_likes: { id: string; user_id: string }[];
  is_announcement?: boolean;
  announcement_type?: 'general' | 'urgent' | 'reminder';
  target_audience?: 'all' | 'guests' | 'rsvp_confirmed';
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'reminder';
  target_audience: 'all' | 'guests' | 'rsvp_confirmed';
  created_at: string;
  is_active: boolean;
}

const EnhancedCommunicationCenter: React.FC = () => {
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'general' as const,
    target_audience: 'all' as const
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({
    lastUpdated: new Date(),
    totalMessages: 0,
    activeAnnouncements: 0,
    engagementRate: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    loadAnnouncements();
    setupRealTimeUpdates();
  }, []);

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel('communication-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          setRealTimeStats(prev => ({
            ...prev,
            lastUpdated: new Date()
          }));
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadMessages = async () => {
    try {
      const { data: messagesData, error: messagesError } = await (supabase as any)
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (messagesError) throw messagesError;

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email, display_name');

      if (profilesError) throw profilesError;

      const { data: likesData, error: likesError } = await (supabase as any)
        .from('message_likes')
        .select('*');

      if (likesError) throw likesError;

      // Combine the data
      const enhancedMessages: EnhancedMessage[] = (messagesData as any)?.map((message: any) => ({
        ...message,
        profiles: (profilesData as any)?.find((p: any) => p.user_id === message.user_id) || {
          first_name: '',
          last_name: '',
          email: 'unknown@email.com',
          display_name: ''
        },
        message_likes: (likesData as any)?.filter((like: any) => like.message_id === message.id) || []
      })) || [];

      setMessages(enhancedMessages);
      
      // Update stats
      setRealTimeStats(prev => ({
        ...prev,
        totalMessages: enhancedMessages.length,
        engagementRate: enhancedMessages.length > 0 
          ? Math.round((enhancedMessages.reduce((sum, m) => sum + (m.message_likes?.length || 0), 0) / enhancedMessages.length) * 100) / 100
          : 0
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadAnnouncements = () => {
    // Mock announcements for Sprint 4 - would be loaded from database
    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Wedding Day Schedule Update',
        content: 'The ceremony will now start at 3:30 PM instead of 3:00 PM. Please plan accordingly!',
        type: 'urgent',
        target_audience: 'all',
        created_at: new Date().toISOString(),
        is_active: true
      },
      {
        id: '2',
        title: 'RSVP Reminder',
        content: 'Don\'t forget to RSVP by March 15th. We\'re excited to celebrate with you!',
        type: 'reminder',
        target_audience: 'guests',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        is_active: true
      }
    ];
    setAnnouncements(mockAnnouncements);
    setRealTimeStats(prev => ({
      ...prev,
      activeAnnouncements: mockAnnouncements.filter(a => a.is_active).length
    }));
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${message.profiles.first_name} ${message.profiles.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' ||
      (filterType === 'public' && message.is_public) ||
      (filterType === 'private' && !message.is_public) ||
      (filterType === 'announcements' && message.is_announcement);
    
    return matchesSearch && matchesFilter;
  });

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await (supabase as any)
        .from('messages')
        .insert({
          content: newMessage,
          is_public: true,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your message has been posted to the community feed",
      });

      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const createAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;

    try {
      // Mock announcement creation - would integrate with database
      const announcement: Announcement = {
        id: Date.now().toString(),
        ...newAnnouncement,
        created_at: new Date().toISOString(),
        is_active: true
      };

      setAnnouncements(prev => [announcement, ...prev]);
      
      toast({
        title: "Announcement Created",
        description: `Announcement sent to ${newAnnouncement.target_audience === 'all' ? 'all users' : 'selected audience'}`,
      });

      setNewAnnouncement({
        title: '',
        content: '',
        type: 'general',
        target_audience: 'all'
      });
      setShowAnnouncementDialog(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive"
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
    const { error } = await (supabase as any)
      .from('messages')
      .delete()
      .eq('id', messageId);

      if (error) throw error;

      toast({
        title: "Message Deleted",
        description: "Message has been removed from the feed",
      });

      loadMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-glass-pink';
      case 'reminder': return 'bg-glass-blue';
      default: return 'bg-glass-green';
    }
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-card p-3 text-center">
          <MessageSquare className="w-4 h-4 mx-auto text-glass-blue mb-1" />
          <div className="text-sm font-semibold">{realTimeStats.totalMessages}</div>
          <div className="text-xs text-muted-foreground">Messages</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Megaphone className="w-4 h-4 mx-auto text-glass-purple mb-1" />
          <div className="text-sm font-semibold">{realTimeStats.activeAnnouncements}</div>
          <div className="text-xs text-muted-foreground">Active</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Heart className="w-4 h-4 mx-auto text-glass-pink mb-1" />
          <div className="text-sm font-semibold">{realTimeStats.engagementRate}</div>
          <div className="text-xs text-muted-foreground">Avg Likes</div>
        </div>
      </div>

      {/* Communication Tabs */}
      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
          <TabsTrigger value="announcements" className="text-xs">Announcements</TabsTrigger>
          <TabsTrigger value="compose" className="text-xs">Compose</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-3">
          {/* Search and Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-secondary border-0 pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="announcements">Announcements</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Messages List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredMessages.slice(0, 10).map((message) => (
              <div key={message.id} className="glass-card p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <MessageSquare className="w-4 h-4 flex-shrink-0 mt-1 text-glass-blue" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-wedding-navy">
                          {message.profiles.first_name && message.profiles.last_name
                            ? `${message.profiles.first_name} ${message.profiles.last_name}`
                            : message.profiles.email
                          }
                        </span>
                        <Badge variant={message.is_public ? 'outline' : 'secondary'} className="text-xs">
                          {message.is_public ? 'Public' : 'Private'}
                        </Badge>
                        {message.is_announcement && (
                          <Badge variant="default" className="text-xs">
                            Announcement
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {message.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(message.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {message.message_likes?.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                      <Reply className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteMessage(message.id)}
                      className="text-xs px-2 py-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredMessages.length > 10 && (
              <div className="text-center text-xs text-muted-foreground">
                Showing 10 of {filteredMessages.length} messages
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-3">
          {/* Announcements Actions */}
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-wedding-navy">Active Announcements</h4>
            <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="text-xs">
                  <Megaphone className="w-3 h-3 mr-1" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Announcement content"
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select 
                      value={newAnnouncement.type} 
                      onValueChange={(value: any) => setNewAnnouncement(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select 
                      value={newAnnouncement.target_audience} 
                      onValueChange={(value: any) => setNewAnnouncement(prev => ({ ...prev, target_audience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="guests">Guests Only</SelectItem>
                        <SelectItem value="rsvp_confirmed">RSVP Confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={createAnnouncement} className="flex-1">
                      Create Announcement
                    </Button>
                    <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Announcements List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="glass-card p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-sm font-medium text-wedding-navy">{announcement.title}</h5>
                      <Badge className={`text-xs ${getAnnouncementColor(announcement.type)}`}>
                        {announcement.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {announcement.target_audience}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {announcement.content}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(announcement.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compose" className="space-y-3">
          {/* Quick Message Composer */}
          <div className="glass-card p-4 space-y-3">
            <h4 className="text-sm font-medium text-wedding-navy">Send Message to Community</h4>
            <Textarea
              placeholder="What would you like to share with the wedding community?"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
              className="glass-secondary border-0"
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {newMessage.length}/500 characters
              </div>
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="glass-secondary border-0">
              <Mail className="w-4 h-4 mr-2" />
              Email All Guests
            </Button>
            <Button variant="outline" className="glass-secondary border-0">
              <Bell className="w-4 h-4 mr-2" />
              Send Push Notification
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Communication Summary */}
      <div className="glass-card p-3 space-y-2">
        <h4 className="text-sm font-medium text-wedding-navy">Communication Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="space-y-1">
            <div>Total Messages: {realTimeStats.totalMessages}</div>
            <div>Active Announcements: {realTimeStats.activeAnnouncements}</div>
            <div>Average Engagement: {realTimeStats.engagementRate} likes/message</div>
          </div>
          <div className="space-y-1">
            <div>Last Update: {realTimeStats.lastUpdated.toLocaleTimeString()}</div>
            <div>Community Health: Active</div>
            <div>Response Rate: High</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCommunicationCenter;