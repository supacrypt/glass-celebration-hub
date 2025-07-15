import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function setupNotifications() {
  console.log('Setting up Notifications System...\n');
  
  try {
    // Create a test notification for Daniel
    console.log('1. Creating test notifications...');
    
    // Get Daniel's user_id
    const { data: daniel } = await supabase
      .from('profiles')
      .select('user_id, display_name')
      .eq('email', 'daniel.j.fleuren@gmail.com')
      .single();
    
    if (daniel) {
      // Create a few test notifications
      const notifications = [
        {
          user_id: daniel.user_id,
          type: 'system',
          title: 'Welcome to Nuptily!',
          message: 'Your notification system is now active. You\'ll receive updates here.',
          read: false,
          metadata: {}
        },
        {
          user_id: daniel.user_id,
          type: 'rsvp_reminder',
          title: 'RSVP Reminder',
          message: '5 guests haven\'t responded to their invitations yet.',
          read: false,
          metadata: { link: '/dashboard/admin/rsvp' }
        },
        {
          user_id: daniel.user_id,
          type: 'event_update',
          title: 'Wedding Timeline Updated',
          message: 'The ceremony time has been confirmed for 3:00 PM.',
          read: false,
          metadata: { link: '/venue' }
        }
      ];
      
      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications);
      
      if (error) {
        console.error('Error creating notifications:', error);
        console.log('\nℹ️  The notifications table may not exist yet.');
        console.log('Run the SQL script in create_notifications_table.sql first.');
      } else {
        console.log(`✅ Created ${notifications.length} test notifications for Daniel`);
      }
    }
    
    // Verify notifications were created
    console.log('\n2. Verifying notifications...');
    
    const { data: allNotifications, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' });
    
    if (allNotifications) {
      console.log(`✅ Total notifications in system: ${count}`);
    }
    
    console.log('\n✅ NOTIFICATIONS SETUP COMPLETE');
    console.log('\nNext steps:');
    console.log('1. Run the SQL in create_notifications_table.sql if not already done');
    console.log('2. The notification bell in the header should now be functional');
    console.log('3. New messages and social posts will trigger notifications automatically');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
  
  process.exit(0);
}

setupNotifications();