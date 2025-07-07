import React, { useState } from 'react';
import { Send, Users, Bell, MessageSquare, Mail, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CommunicationCenter: React.FC = () => {
  const [messageForm, setMessageForm] = useState({
    subject: '',
    content: '',
    audience: 'all',
    channels: {
      email: true,
      push: false,
      sms: false
    },
    scheduled: false,
    scheduledTime: ''
  });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const audiences = [
    { value: 'all', label: 'All Guests', count: '150' },
    { value: 'attending', label: 'Attending Only', count: '128' },
    { value: 'pending', label: 'Pending RSVPs', count: '22' },
    { value: 'admins', label: 'Admin Users', count: '3' },
  ];

  const templates = [
    { id: 'welcome', name: 'Welcome Message', subject: 'Welcome to our wedding!' },
    { id: 'reminder', name: 'RSVP Reminder', subject: 'Please confirm your attendance' },
    { id: 'update', name: 'Event Update', subject: 'Important wedding update' },
    { id: 'thanks', name: 'Thank You', subject: 'Thank you for celebrating with us' },
  ];

  const handleSendMessage = async () => {
    if (!messageForm.subject || !messageForm.content) {
      toast({
        title: "Error",
        description: "Please fill in subject and message content",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      // In a real implementation, this would send to a message queue or notification service
      // For now, we'll just create a record in the messages table
      const { error } = await supabase
        .from('messages')
        .insert([{
          content: `${messageForm.subject}\n\n${messageForm.content}`,
          is_public: true,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Message sent to ${audiences.find(a => a.value === messageForm.audience)?.label}`,
      });

      // Reset form
      setMessageForm({
        subject: '',
        content: '',
        audience: 'all',
        channels: { email: true, push: false, sms: false },
        scheduled: false,
        scheduledTime: ''
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const loadTemplate = (template: typeof templates[0]) => {
    setMessageForm(prev => ({
      ...prev,
      subject: template.subject,
      content: getTemplateContent(template.id)
    }));
  };

  const getTemplateContent = (templateId: string) => {
    switch (templateId) {
      case 'welcome':
        return 'Welcome to our wedding celebration app! We\'re so excited to share this special day with you.';
      case 'reminder':
        return 'This is a friendly reminder to please confirm your attendance for our wedding. We need to finalize our headcount.';
      case 'update':
        return 'We have an important update regarding our wedding. Please check the latest information in the app.';
      case 'thanks':
        return 'Thank you so much for being part of our special day. Your presence means the world to us!';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto" style={{ maxHeight: '580px' }}>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="glass-card p-3 text-center">
          <Users className="w-4 h-4 mx-auto text-glass-blue mb-1" />
          <div className="text-sm font-semibold">150</div>
          <div className="text-xs text-muted-foreground">Total Users</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Mail className="w-4 h-4 mx-auto text-glass-green mb-1" />
          <div className="text-sm font-semibold">24</div>
          <div className="text-xs text-muted-foreground">Sent Today</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Bell className="w-4 h-4 mx-auto text-glass-purple mb-1" />
          <div className="text-sm font-semibold">92%</div>
          <div className="text-xs text-muted-foreground">Open Rate</div>
        </div>
        <div className="glass-card p-3 text-center">
          <MessageSquare className="w-4 h-4 mx-auto text-glass-pink mb-1" />
          <div className="text-sm font-semibold">12</div>
          <div className="text-xs text-muted-foreground">Replies</div>
        </div>
      </div>

      {/* Message Composer */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-wedding-navy">Send Message</h4>
          <Select>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Use template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem 
                  key={template.id} 
                  value={template.id}
                  onClick={() => loadTemplate(template)}
                >
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Audience Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-wedding-navy">Audience</label>
          <Select value={messageForm.audience} onValueChange={(value) => 
            setMessageForm(prev => ({ ...prev, audience: value }))
          }>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {audiences.map((audience) => (
                <SelectItem key={audience.value} value={audience.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{audience.label}</span>
                    <Badge variant="secondary" className="ml-2">
                      {audience.count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Channels */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-wedding-navy">Channels</label>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={messageForm.channels.email}
                onCheckedChange={(checked) => 
                  setMessageForm(prev => ({ 
                    ...prev, 
                    channels: { ...prev.channels, email: checked }
                  }))
                }
              />
              <Mail className="w-4 h-4 text-glass-blue" />
              <span className="text-xs">Email</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={messageForm.channels.push}
                onCheckedChange={(checked) => 
                  setMessageForm(prev => ({ 
                    ...prev, 
                    channels: { ...prev.channels, push: checked }
                  }))
                }
              />
              <Bell className="w-4 h-4 text-glass-purple" />
              <span className="text-xs">Push</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={messageForm.channels.sms}
                onCheckedChange={(checked) => 
                  setMessageForm(prev => ({ 
                    ...prev, 
                    channels: { ...prev.channels, sms: checked }
                  }))
                }
              />
              <Smartphone className="w-4 h-4 text-glass-green" />
              <span className="text-xs">SMS</span>
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-wedding-navy">Subject</label>
          <Input
            placeholder="Message subject"
            value={messageForm.subject}
            onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
            className="text-sm"
          />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-wedding-navy">Message</label>
          <Textarea
            placeholder="Write your message here..."
            value={messageForm.content}
            onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
            className="text-sm min-h-20"
          />
        </div>

        {/* Send Button */}
        <Button 
          onClick={handleSendMessage}
          disabled={sending}
          className="w-full"
        >
          {sending ? (
            <div className="w-4 h-4 animate-spin rounded-full border border-current border-t-transparent mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Send Message
        </Button>
      </div>

      {/* Recent Messages */}
      <div className="glass-card p-4">
        <h4 className="text-sm font-medium text-wedding-navy mb-3">Recent Messages</h4>
        <div className="space-y-2">
          {[
            { subject: 'Welcome to our wedding!', sent: '2 hours ago', audience: 'All Guests', status: 'delivered' },
            { subject: 'RSVP Reminder', sent: '1 day ago', audience: 'Pending RSVPs', status: 'delivered' },
            { subject: 'Event Update', sent: '3 days ago', audience: 'Attending Only', status: 'delivered' },
          ].map((message, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-wedding-navy truncate">
                  {message.subject}
                </div>
                <div className="text-xs text-muted-foreground">
                  {message.audience} • {message.sent}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {message.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;