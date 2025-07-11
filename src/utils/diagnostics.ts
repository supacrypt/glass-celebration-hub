// Diagnostic utilities for debugging database issues
import { supabase } from '@/integrations/supabase/client';

export const runDatabaseDiagnostics = async () => {
  console.log('🔍 Running database diagnostics...');
  
  try {
    // Test 1: Check if we can connect to the database
    console.log('📡 Testing database connection...');
    const { data: events, error: eventsError } = await supabase
      .from('wedding_events')
      .select('*')
      .order('event_date', { ascending: true });
    
    if (eventsError) {
      console.error('❌ Failed to fetch wedding events:', eventsError);
      return { success: false, error: eventsError };
    }
    
    console.log('✅ Database connection successful');
    console.log(`✅ Found ${events?.length || 0} wedding events:`, events);
    
    // Test 2: Check current user authentication
    console.log('👤 Checking user authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Authentication error:', authError);
      return { success: false, error: authError };
    }
    
    console.log('✅ User authenticated:', user ? `${user.email} (${user.id})` : 'No user');
    
    // Test 3: Check user profile and role (if user exists)
    if (user) {
      console.log('📝 Checking user profile...');
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);
      
      if (profileError) {
        console.error('❌ Failed to fetch user profile:', profileError);
        // Don't fail the whole diagnostic for profile errors
      } else {
        const profile = profiles && profiles.length > 0 ? profiles[0] : null;
        console.log('✅ User profile:', profile);
        console.log(`📊 Found ${profiles?.length || 0} profile(s) for user`);
      }
      
      // Test 4: Check user role
      console.log('🔐 Checking user role...');
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);
      
      if (roleError) {
        console.error('❌ Failed to fetch user role:', roleError);
        // Don't fail the whole diagnostic for role errors
      } else {
        const userRole = userRoles && userRoles.length > 0 ? userRoles[0] : null;
        console.log('✅ User role:', userRole);
        console.log(`📊 Found ${userRoles?.length || 0} role(s) for user`);
      }
      
      // Test 5: Check existing RSVPs
      console.log('📋 Checking existing RSVPs...');
      const { data: rsvps, error: rsvpError } = await supabase
        .from('rsvps')
        .select('*')
        .eq('user_id', user.id);
      
      if (rsvpError) {
        console.error('❌ Failed to fetch RSVPs:', rsvpError);
        // Don't fail the whole diagnostic for RSVP errors
      } else {
        console.log(`✅ Found ${rsvps?.length || 0} existing RSVPs:`, rsvps);
      }
    }
    
    return { success: true, events, user };
    
  } catch (error) {
    console.error('❌ Diagnostic failed with exception:', error);
    return { success: false, error };
  }
};

// Test RSVP submission specifically
export const testRSVPSubmission = async (eventId: string, status: 'attending' | 'not_attending' | 'maybe' = 'attending') => {
  console.log('🧪 Testing RSVP submission...');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('❌ No authenticated user for RSVP test');
      return { success: false, error: 'No authenticated user' };
    }
    
    const testRSVP = {
      event_id: eventId,
      user_id: user.id,
      status: status,
      guest_count: 1,
      dietary_restrictions: 'Test dietary restrictions',
      message: 'Test RSVP message'
    };
    
    console.log('📝 Submitting test RSVP:', testRSVP);
    
    // First delete any existing RSVP to avoid conflicts
    console.log('🗑️ Removing any existing test RSVP...');
    await supabase
      .from('rsvps')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId);
    
    console.log('📝 Creating fresh test RSVP...');
    // Insert new RSVP
    const result = await supabase
      .from('rsvps')
      .insert(testRSVP)
      .select();
    
    if (result.error) {
      console.error('❌ RSVP submission failed:', result.error);
      return { success: false, error: result.error };
    }
    
    console.log('✅ RSVP submitted successfully:', result.data);
    return { success: true, data: result.data };
    
  } catch (error) {
    console.error('❌ RSVP test failed with exception:', error);
    return { success: false, error };
  }
};