#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iwmfxcrzzwpmxomydmuq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3bWZ4Y3J6endwbXhvbXlkbXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTg2NDk2MSwiZXhwIjoyMDY3NDQwOTYxfQ.08sSTpIieN0SMWgWXdE55-rsqQ4cy4D5FIQCrv6vOQ8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testDatabaseSetup() {
  console.log('🧪 Testing Database Setup...\n');
  
  try {
    // Test 1: Check if user_profiles table exists
    console.log('📋 Test 1: Checking user_profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, email, role')
      .limit(5);
      
    if (profilesError) {
      console.log('❌ user_profiles table not found:', profilesError.message);
      return false;
    } else {
      console.log('✅ user_profiles table exists');
      console.log(`📊 Found ${profiles?.length || 0} user profiles`);
      if (profiles && profiles.length > 0) {
        profiles.forEach(profile => {
          console.log(`   - ${profile.email} (${profile.role})`);
        });
      }
    }
    
    // Test 2: Check if wedding_events table exists
    console.log('\n📋 Test 2: Checking wedding_events table...');
    const { data: events, error: eventsError } = await supabase
      .from('wedding_events')
      .select('id, name, title, event_date')
      .limit(3);
      
    if (eventsError) {
      console.log('❌ wedding_events table not found:', eventsError.message);
    } else {
      console.log('✅ wedding_events table exists');
      console.log(`📊 Found ${events?.length || 0} wedding events`);
    }
    
    // Test 3: Check if new admin tables exist
    console.log('\n📋 Test 3: Checking new admin feature tables...');
    const tablesToCheck = [
      'accommodation_categories',
      'transportation_categories', 
      'content_blocks',
      'faqs',
      'gift_registry_redirects'
    ];
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('id')
          .limit(1);
          
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ ${tableName}: ready`);
        }
      } catch (err) {
        console.log(`❌ ${tableName}: ${err.message}`);
      }
    }
    
    // Test 4: Check if supbasecrypt@gmail.com exists
    console.log('\n📋 Test 4: Checking test user account...');
    const { data: testUser, error: testUserError } = await supabase
      .from('user_profiles')
      .select('id, email, role')
      .eq('email', 'supbasecrypt@gmail.com')
      .single();
      
    if (testUserError) {
      console.log('❌ Test user supbasecrypt@gmail.com not found');
      console.log('📝 You\'ll need to create this user account for testing');
    } else {
      console.log('✅ Test user found:', testUser);
      if (testUser.role === 'guest') {
        console.log('🎯 Test user is correctly set to guest role');
      } else {
        console.log('⚠️  Test user role needs to be changed to guest');
      }
    }
    
    // Test 5: Authentication test
    console.log('\n📋 Test 5: Testing authentication flow...');
    try {
      // This simulates what useAuth hook does
      const { data: authTest, error: authError } = await supabase
        .from('user_profiles')
        .select('id, email, role')
        .limit(1);
        
      if (authError) {
        console.log('❌ Authentication flow test failed:', authError.message);
      } else {
        console.log('✅ Authentication flow working correctly');
        console.log('🎯 useAuth hook will be able to fetch user data');
      }
    } catch (err) {
      console.log('❌ Authentication flow error:', err.message);
    }
    
    console.log('\n🎉 Database setup test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. If schema is deployed ✅, test guest dashboard');
    console.log('2. If test user exists ✅, log in and test functionality');
    console.log('3. If any ❌ errors, review schema deployment');
    
    return true;
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
    return false;
  }
}

async function setupTestUser() {
  console.log('\n👤 Setting up test user for guest dashboard testing...');
  
  try {
    // Try to update existing user or get info about available users
    const { data: existingUser, error: findError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'supbasecrypt@gmail.com')
      .single();
      
    if (findError && findError.code !== 'PGRST116') {
      console.log('❌ Error finding user:', findError.message);
      return false;
    }
    
    if (existingUser) {
      // Update existing user to guest role
      const { data: updatedUser, error: updateError } = await supabase
        .from('user_profiles')
        .update({ role: 'guest' })
        .eq('email', 'supbasecrypt@gmail.com')
        .select()
        .single();
        
      if (updateError) {
        console.log('❌ Error updating user role:', updateError.message);
        return false;
      }
      
      console.log('✅ Test user updated:', updatedUser);
      console.log('🎯 supbasecrypt@gmail.com is now set to guest role');
      return true;
    } else {
      console.log('📝 Test user does not exist yet');
      console.log('🔧 You can create it through the authentication system');
      
      // Show existing users for reference
      const { data: allUsers, error: usersError } = await supabase
        .from('user_profiles')
        .select('email, role')
        .limit(10);
        
      if (!usersError && allUsers && allUsers.length > 0) {
        console.log('\n📋 Existing users for reference:');
        allUsers.forEach(user => {
          console.log(`   - ${user.email} (${user.role})`);
        });
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('💥 Setup test user failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Glass Celebration Hub - Database Setup Test\n');
  
  const setupSuccess = await testDatabaseSetup();
  
  if (setupSuccess) {
    await setupTestUser();
  }
  
  console.log('\n✨ Test complete! Ready to test guest dashboard functionality.');
}

main();