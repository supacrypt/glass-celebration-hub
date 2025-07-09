#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iwmfxcrzzwpmxomydmuq.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3bWZ4Y3J6endwbXhvbXlkbXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NjQ5NjEsImV4cCI6MjA2NzQ0MDk2MX0.0Nh_rE_1vKYxT68nwQ11esIkOz6OcDY3YdZCb-bucYc';

async function testSupabaseMCP() {
  console.log('🔌 Supabase MCP Server - Wedding App Connection');
  console.log('===============================================');
  console.log('Project:', SUPABASE_URL);
  console.log('Status: Connecting...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Test connection with guest data
    const { data: guests, error } = await supabase
      .from('guests')
      .select('guest_names, category, rsvp_status')
      .limit(5);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return;
    }
    
    console.log('✅ Status: Connected');
    console.log('📊 Database Summary:');
    
    // Get table counts
    const tables = ['guests', 'wedding_events', 'rsvps', 'profiles', 'app_settings', 'messages'];
    
    for (const table of tables) {
      try {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        console.log(`  ${table}: ${count || 0} records`);
      } catch (err) {
        console.log(`  ${table}: Error - ${err.message}`);
      }
    }
    
    console.log('\\n🎯 Sample Wedding Guests:');
    guests.forEach(guest => {
      console.log(`  - ${guest.guest_names} (${guest.category}): ${guest.rsvp_status}`);
    });
    
    console.log('\\n🚀 Supabase MCP Server Ready!');
    
  } catch (err) {
    console.log('❌ Connection error:', err.message);
  }
}

testSupabaseMCP();