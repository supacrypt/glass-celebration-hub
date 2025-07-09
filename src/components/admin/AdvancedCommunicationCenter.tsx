import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Bell, Users, Megaphone, Calendar, Target, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'announcement' | 'reminder' | 'update' | 'alert';
  title: string;
  content: string;
  recipients: 'all' | 'rsvp_pending' | 'attending' | 'admins' | 'custom';
  customRecipients?: string[];
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledFor?: Date;
  readCount: number;
  totalRecipients: number;
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  variables: string[];
}

const AdvancedCommunicationCenter: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [newMessage, setNewMessage] = useState<Partial<Message>>({
    type: 'announcement',
    recipients: 'all',
    status: 'draft'
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    fetchTemplates();
  }, []);

  const fetchMessages = () => {
    // Simulate message data - in real app, this would come from database
    const mockMessages: Message[] = [
      {
        id: '1',
        type: 'announcement',
        title: 'Wedding Schedule Update',
        content: 'Please note the ceremony will now start at 4:30 PM instead of 4:00 PM due to venue requirements.',
        recipients: 'attending',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'sent',
        readCount: 67,
        totalRecipients: 89
      },
      {
        id: '2',
        type: 'reminder',
        title: 'RSVP Deadline Reminder',
        content: 'This is a friendly reminder that RSVPs are due by January 15th. Please confirm your attendance.',
        recipients: 'rsvp_pending',
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
        readCount: 0,
        totalRecipients: 23
      },
      {
        id: '3',
        type: 'update',
        title: 'Photo Gallery Now Available',
        content: 'We\'ve added engagement photos to the gallery. Check them out and share your favorites!',
        recipients: 'all',
        status: 'draft',
        readCount: 0,
        totalRecipients: 156
      }
    ];
    
    setMessages(mockMessages);
  };

  const fetchTemplates = () => {
    // Simulate template data
    const mockTemplates: NotificationTemplate[] = [
      {
        id: '1',
        name: 'RSVP Reminder',
        subject: 'RSVP Reminder for {{COUPLE_NAMES}} Wedding',
        content: 'Dear {{GUEST_NAME}},\n\nThis is a friendly reminder to RSVP for our wedding by {{RSVP_DEADLINE}}.\n\nLooking forward to celebrating with you!\n\n{{COUPLE_NAMES}}',
        type: 'reminder',
        variables: ['GUEST_NAME', 'COUPLE_NAMES', 'RSVP_DEADLINE']
      },
      {
        id: '2',
        name: 'Wedding Update',
        subject: 'Important Update - {{COUPLE_NAMES}} Wedding',
        content: 'Hello {{GUEST_NAME}},\n\nWe have an important update regarding our wedding:\n\n{{UPDATE_CONTENT}}\n\nThank you for your understanding.\n\n{{COUPLE_NAMES}}',
        type: 'update',
        variables: ['GUEST_NAME', 'COUPLE_NAMES', 'UPDATE_CONTENT']
      },
      {
        id: '3',
        name: 'Thank You Message',
        subject: 'Thank You - {{COUPLE_NAMES}}',
        content: 'Dear {{GUEST_NAME}},\n\nThank you so much for {{THANK_YOU_REASON}}. Your presence and support mean the world to us.\n\nWith love,\n{{COUPLE_NAMES}}',
        type: 'announcement',
        variables: ['GUEST_NAME', 'COUPLE_NAMES', 'THANK_YOU_REASON']
      }
    ];
    
    setTemplates(mockTemplates);
  };

  const sendMessage = async () => {
    if (!newMessage.title || !newMessage.content) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for the message",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      // Simulate sending - in real app, this would be an API call
      const message: Message = {
        id: Date.now().toString(),
        type: newMessage.type as Message['type'],
        title: newMessage.title,
        content: newMessage.content,
        recipients: newMessage.recipients as Message['recipients'],
        customRecipients: newMessage.customRecipients,
        sentAt: new Date(),
        status: 'sent',
        readCount: 0,
        totalRecipients: getRecipientCount(newMessage.recipients as Message['recipients'])
      };

      setMessages(prev => [message, ...prev]);
      setNewMessage({
        type: 'announcement',
        recipients: 'all',
        status: 'draft'
      });

      toast({
        title: "Message Sent",
        description: `Message sent to ${message.totalRecipients} recipients`,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const scheduleMessage = async () => {
    if (!newMessage.title || !newMessage.content || !newMessage.scheduledFor) {
      toast({
        title: "Missing Information",
        description: "Please provide title, content, and schedule time",
        variant: "destructive"
      });
      return;
    }

    const message: Message = {
      id: Date.now().toString(),
      type: newMessage.type as Message['type'],
      title: newMessage.title,
      content: newMessage.content,
      recipients: newMessage.recipients as Message['recipients'],
      status: 'scheduled',
      scheduledFor: newMessage.scheduledFor,
      readCount: 0,
      totalRecipients: getRecipientCount(newMessage.recipients as Message['recipients'])
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage({
      type: 'announcement',
      recipients: 'all',
      status: 'draft'
    });

    toast({
      title: "Message Scheduled",
      description: `Message scheduled for ${message.scheduledFor.toLocaleString()}`,
    });
  };

  const getRecipientCount = (recipients: string): number => {
    switch (recipients) {
      case 'all':
        return 156;
      case 'attending':
        return 89;
      case 'rsvp_pending':
        return 23;
      case 'admins':
        return 3;
      default:
        return 0;
    }
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setNewMessage(prev => ({
        ...prev,
        title: template.subject,
        content: template.content,
        type: template.type as Message['type']
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-glass-green bg-green-500/10';
      case 'scheduled':
        return 'text-glass-blue bg-blue-500/10';
      case 'draft':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Megaphone className="w-4 h-4" />;
      case 'reminder':
        return <Bell className="w-4 h-4" />;
      case 'update':
        return <MessageSquare className="w-4 h-4" />;
      case 'alert':
        return <Target className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto" style={{ maxHeight: '580px' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-wedding-navy" />
          <h3 className="font-semibold text-wedding-navy">Communication Center</h3>
        </div>
      </div>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">
            <Send className="w-3 h-3 mr-1" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="sent">
            <Eye className="w-3 h-3 mr-1" />
            Sent Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-3">
          {/* Template Selection */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTemplate} onValueChange={(value) => {
                setSelectedTemplate(value);
                loadTemplate(value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template to get started" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Message Composition */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">New Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Select 
                  value={newMessage.type} 
                  onValueChange={(value) => setNewMessage(prev => ({ ...prev, type: value as Message['type'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={newMessage.recipients} 
                  onValueChange={(value) => setNewMessage(prev => ({ ...prev, recipients: value as Message['recipients'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Guests (156)</SelectItem>
                    <SelectItem value="attending">Attending (89)</SelectItem>
                    <SelectItem value="rsvp_pending">RSVP Pending (23)</SelectItem>
                    <SelectItem value="admins">Admins (3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input
                placeholder="Message title..."
                value={newMessage.title || ''}
                onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
              />

              <Textarea
                placeholder="Message content..."
                value={newMessage.content || ''}
                onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
              />

              <div className="flex items-center gap-2">
                <Switch
                  checked={newMessage.status === 'scheduled'}
                  onCheckedChange={(checked) => setNewMessage(prev => ({ 
                    ...prev, 
                    status: checked ? 'scheduled' : 'draft',
                    scheduledFor: checked ? new Date(Date.now() + 60 * 60 * 1000) : undefined
                  }))}
                />
                <span className="text-sm">Schedule for later</span>
              </div>

              {newMessage.status === 'scheduled' && (
                <Input
                  type="datetime-local"
                  value={newMessage.scheduledFor?.toISOString().slice(0, 16)}
                  onChange={(e) => setNewMessage(prev => ({ 
                    ...prev, 
                    scheduledFor: new Date(e.target.value) 
                  }))}
                />
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={newMessage.status === 'scheduled' ? scheduleMessage : sendMessage}
                  disabled={isSending}
                  className="flex-1"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border border-current border-t-transparent mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      {newMessage.status === 'scheduled' ? <Calendar className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                      {newMessage.status === 'scheduled' ? 'Schedule' : 'Send Now'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="space-y-3">
          <div className="space-y-2">
            {messages.map((message) => (
              <Card key={message.id} className="glass-card">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(message.type)}
                      <span className="text-sm font-medium">{message.title}</span>
                      <Badge className={`text-xs ${getStatusColor(message.status)}`}>
                        {message.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {message.sentAt ? message.sentAt.toLocaleString() : 
                       message.scheduledFor ? `Scheduled: ${message.scheduledFor.toLocaleString()}` : 'Draft'}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {message.content}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {message.totalRecipients} recipients
                      </div>
                      {message.status === 'sent' && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {message.readCount} read ({Math.round((message.readCount / message.totalRecipients) * 100)}%)
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {message.recipients.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedCommunicationCenter;