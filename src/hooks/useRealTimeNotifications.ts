import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface NotificationData {
  id: string;
  type: 'photo' | 'message' | 'rsvp' | 'gift';
  title: string;
  message: string;
  timestamp: string;
  user_name?: string;
}

export const useRealTimeNotifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription for photos
    const photosChannel = supabase
      .channel('photos-notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'photos' },
        async (payload) => {
          if (payload.new.user_id !== user.id) {
            // Get user profile for display name
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name, display_name')
              .eq('user_id', payload.new.user_id)
              .single();

            const userName = profile?.display_name || 
                           `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 
                           'Someone';

            const notification: NotificationData = {
              id: payload.new.id,
              type: 'photo',
              title: 'New Photo!',
              message: `${userName} shared a new photo`,
              timestamp: new Date().toISOString(),
              user_name: userName
            };

            setNotifications(prev => [notification, ...prev.slice(0, 9)]);
            
            toast({
              title: notification.title,
              description: notification.message,
            });
          }
        }
      )
      .subscribe();

    // Set up real-time subscription for messages
    const messagesChannel = supabase
      .channel('messages-notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          if (payload.new.user_id !== user.id && payload.new.is_public) {
            // Get user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name, display_name')
              .eq('user_id', payload.new.user_id)
              .single();

            const userName = profile?.display_name || 
                           `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 
                           'Someone';

            const notification: NotificationData = {
              id: payload.new.id,
              type: 'message',
              title: 'New Message!',
              message: `${userName} posted a message`,
              timestamp: new Date().toISOString(),
              user_name: userName
            };

            setNotifications(prev => [notification, ...prev.slice(0, 9)]);
            
            // Don't show toast for messages to avoid spam
          }
        }
      )
      .subscribe();

    // Set up real-time subscription for RSVPs
    const rsvpsChannel = supabase
      .channel('rsvps-notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'rsvps' },
        async (payload) => {
          if (payload.new.user_id !== user.id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name, display_name')
              .eq('user_id', payload.new.user_id)
              .single();

            const userName = profile?.display_name || 
                           `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 
                           'Someone';

            const notification: NotificationData = {
              id: payload.new.id,
              type: 'rsvp',
              title: 'New RSVP!',
              message: `${userName} responded to the wedding invitation`,
              timestamp: new Date().toISOString(),
              user_name: userName
            };

            setNotifications(prev => [notification, ...prev.slice(0, 9)]);
          }
        }
      )
      .subscribe();

    // Set up real-time subscription for gift purchases
    const giftsChannel = supabase
      .channel('gifts-notifications')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'gift_registry' },
        async (payload) => {
          if (payload.new.is_purchased && !payload.old.is_purchased) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name, display_name')
              .eq('user_id', payload.new.purchased_by)
              .single();

            const userName = profile?.display_name || 
                           `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 
                           'Someone';

            const notification: NotificationData = {
              id: payload.new.id,
              type: 'gift',
              title: 'Gift Purchased!',
              message: `${userName} purchased ${payload.new.title}`,
              timestamp: new Date().toISOString(),
              user_name: userName
            };

            setNotifications(prev => [notification, ...prev.slice(0, 9)]);
            
            toast({
              title: notification.title,
              description: notification.message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(photosChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(rsvpsChannel);
      supabase.removeChannel(giftsChannel);
    };
  }, [user, toast]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return {
    notifications,
    clearNotifications,
    markAsRead
  };
};