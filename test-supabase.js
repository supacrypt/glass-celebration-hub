import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Check if we can connect
    console.log('1. Testing basic connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('app_settings')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.error('❌ Connection failed:', healthError.message);
      return;
    }
    
    console.log('✅ Connection successful');
    
    // Test 2: Check app_settings table structure
    console.log('2. Testing app_settings table...');
    const { data: settings, error: settingsError } = await supabase
      .from('app_settings')
      .select('*')
      .limit(5);
    
    if (settingsError) {
      console.error('❌ App settings query failed:', settingsError.message);
      return;
    }
    
    console.log('✅ App settings table accessible');
    console.log('Found settings:', settings?.length || 0);
    
    if (settings && settings.length > 0) {
      console.log('Sample settings:');
      settings.forEach(setting => {
        console.log(`  - ${setting.setting_key}: ${setting.setting_value?.substring(0, 50)}...`);
      });
    }
    
    // Test 3: Test insert/update
    console.log('3. Testing insert/update...');
    const testSetting = {
      setting_key: 'test_connection',
      setting_value: JSON.stringify({ test: true, timestamp: new Date().toISOString() })
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('app_settings')
      .upsert([testSetting])
      .select();
    
    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      return;
    }
    
    console.log('✅ Insert/update successful');
    
    // Test 4: Test read
    console.log('4. Testing read...');
    const { data: readData, error: readError } = await supabase
      .from('app_settings')
      .select('*')
      .eq('setting_key', 'test_connection')
      .single();
    
    if (readError) {
      console.error('❌ Read failed:', readError.message);
      return;
    }
    
    console.log('✅ Read successful');
    console.log('Read data:', readData);
    
    // Test 5: Cleanup
    console.log('5. Cleaning up...');
    const { error: deleteError } = await supabase
      .from('app_settings')
      .delete()
      .eq('setting_key', 'test_connection');
    
    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError.message);
      return;
    }
    
    console.log('✅ Cleanup successful');
    
    console.log('\n🎉 All tests passed! Supabase connection is working correctly.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testSupabaseConnection().catch(console.error);