#!/usr/bin/env node

/**
 * Production Environment Setup Script
 * 
 * This script sets up the production environment for the Nuptily wedding application
 * including storage buckets, RLS policies, and production-specific configurations.
 * 
 * Usage: node setup_production_environment.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🚀 Setting up Production Environment for Nuptily\n');

/**
 * Production storage bucket configurations
 */
const productionBuckets = [
  {
    name: 'avatars',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 5 * 1024 * 1024, // 5MB for production
    description: 'User profile pictures and avatars'
  },
  {
    name: 'social-media',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
    fileSizeLimit: 25 * 1024 * 1024, // 25MB for production
    description: 'Social media posts and stories'
  },
  {
    name: 'user-content',
    public: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    fileSizeLimit: 10 * 1024 * 1024, // 10MB for production
    description: 'User-specific content and documents'
  },
  {
    name: 'public-assets',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    fileSizeLimit: 2 * 1024 * 1024, // 2MB for production
    description: 'Public website assets and images'
  }
];

/**
 * Create production storage buckets
 */
async function createProductionBuckets() {
  console.log('📦 Creating production storage buckets...\n');
  
  for (const bucket of productionBuckets) {
    try {
      const { error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        allowedMimeTypes: bucket.allowedMimeTypes,
        fileSizeLimit: bucket.fileSizeLimit
      });
      
      if (error && error.message !== 'Bucket already exists') {
        console.error(`❌ Error creating bucket ${bucket.name}:`, error.message);
      } else {
        console.log(`✅ Production bucket '${bucket.name}' ready`);
        console.log(`   📝 ${bucket.description}`);
        console.log(`   🌐 Public: ${bucket.public ? 'Yes' : 'No'}`);
        console.log(`   📊 Size limit: ${Math.round(bucket.fileSizeLimit / 1024 / 1024)}MB`);
        console.log(`   🎨 Allowed types: ${bucket.allowedMimeTypes.join(', ')}\n`);
      }
    } catch (err) {
      console.error(`❌ Failed to create bucket ${bucket.name}:`, err.message);
      process.exit(1);
    }
  }
}

/**
 * Create production database functions
 */
async function createProductionFunctions() {
  console.log('⚙️  Creating production database functions...\n');
  
  // Production-optimized avatar URL function
  const avatarUrlFunction = `
    CREATE OR REPLACE FUNCTION public.get_avatar_url(user_id UUID)
    RETURNS TEXT AS $$
    BEGIN
      RETURN CASE 
        WHEN EXISTS (
          SELECT 1 FROM storage.objects 
          WHERE bucket_id = 'avatars' 
          AND name LIKE user_id::text || '/%'
        ) THEN (
          SELECT CONCAT('${SUPABASE_URL}/storage/v1/object/public/avatars/', name)
          FROM storage.objects 
          WHERE bucket_id = 'avatars' 
          AND name LIKE user_id::text || '/%'
          ORDER BY created_at DESC
          LIMIT 1
        )
        ELSE NULL
      END;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;
  
  // Production profile picture handler with optimization
  const handleProfilePictureFunction = `
    CREATE OR REPLACE FUNCTION public.handle_profile_picture_upload()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.bucket_id = 'avatars' THEN
        -- Update user profile with optimized avatar URL
        UPDATE public.profiles 
        SET 
          avatar_url = CONCAT('${SUPABASE_URL}/storage/v1/object/public/avatars/', NEW.name),
          updated_at = NOW()
        WHERE id = (NEW.name::text SPLIT_PART('/', 1))::UUID;
        
        -- Log avatar update for analytics
        INSERT INTO public.user_activity_log (user_id, action, metadata)
        VALUES (
          (NEW.name::text SPLIT_PART('/', 1))::UUID,
          'avatar_updated',
          jsonb_build_object('file_size', NEW.metadata->>'size', 'mime_type', NEW.metadata->>'mimetype')
        );
      END IF;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;
  
  // Create or update the functions
  try {
    await supabase.rpc('exec_sql', { sql: avatarUrlFunction });
    console.log('✅ Production avatar URL function created');
    
    await supabase.rpc('exec_sql', { sql: handleProfilePictureFunction });
    console.log('✅ Production profile picture handler created');
    
  } catch (err) {
    console.error('❌ Error creating production functions:', err.message);
  }
}

/**
 * Setup production RLS policies
 */
async function setupProductionRLS() {
  console.log('🔒 Setting up production RLS policies...\n');
  
  const policies = [
    // Avatar bucket policies
    {
      bucket: 'avatars',
      name: 'avatar_public_read',
      operation: 'SELECT',
      definition: 'true'
    },
    {
      bucket: 'avatars',
      name: 'avatar_user_upload',
      operation: 'INSERT',
      definition: 'auth.uid()::text = (storage.foldername(name))[1]'
    },
    {
      bucket: 'avatars',
      name: 'avatar_user_update',
      operation: 'UPDATE',
      definition: 'auth.uid()::text = (storage.foldername(name))[1]'
    },
    {
      bucket: 'avatars',
      name: 'avatar_user_delete',
      operation: 'DELETE',
      definition: 'auth.uid()::text = (storage.foldername(name))[1]'
    }
  ];
  
  console.log('📋 RLS policies configured for production buckets');
  console.log('⚠️  These must be created manually in Supabase Dashboard');
  console.log('   Go to: Storage > [bucket] > Policies > Add Policy\n');
  
  policies.forEach(policy => {
    console.log(`Bucket: ${policy.bucket} | ${policy.name}`);
    console.log(`Operation: ${policy.operation}`);
    console.log(`Definition: ${policy.definition}\n`);
  });
}

/**
 * Test production environment
 */
async function testProductionEnvironment() {
  console.log('🧪 Testing production environment...\n');
  
  try {
    // Test database connection
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError.message);
    } else {
      console.log('✅ Database connection successful');
    }
    
    // Test storage buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error('❌ Storage access failed:', bucketError.message);
    } else {
      console.log(`✅ Storage access successful (${buckets.length} buckets)`);
    }
    
    // Test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Auth service failed:', authError.message);
    } else {
      console.log('✅ Auth service operational');
    }
    
  } catch (err) {
    console.error('❌ Production environment test failed:', err.message);
  }
}

/**
 * Setup production monitoring
 */
async function setupProductionMonitoring() {
  console.log('📊 Setting up production monitoring...\n');
  
  // Create monitoring tables
  const monitoringTables = `
    -- User activity logging
    CREATE TABLE IF NOT EXISTS public.user_activity_log (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id),
      action TEXT NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Performance metrics
    CREATE TABLE IF NOT EXISTS public.performance_metrics (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      metric_name TEXT NOT NULL,
      metric_value NUMERIC NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Error logging
    CREATE TABLE IF NOT EXISTS public.error_logs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      error_message TEXT NOT NULL,
      error_stack TEXT,
      user_id UUID REFERENCES auth.users(id),
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  try {
    await supabase.rpc('exec_sql', { sql: monitoringTables });
    console.log('✅ Production monitoring tables created');
  } catch (err) {
    console.error('❌ Error creating monitoring tables:', err.message);
  }
}

/**
 * Main production setup function
 */
async function main() {
  try {
    console.log('🏭 PRODUCTION ENVIRONMENT SETUP');
    console.log('================================\n');
    
    await createProductionBuckets();
    await createProductionFunctions();
    await setupProductionRLS();
    await setupProductionMonitoring();
    await testProductionEnvironment();
    
    console.log('🎉 Production environment setup completed!\n');
    console.log('📖 Next steps:');
    console.log('   1. Configure RLS policies in Supabase Dashboard');
    console.log('   2. Set up monitoring and alerting');
    console.log('   3. Configure CDN if using external assets');
    console.log('   4. Test the application thoroughly');
    console.log('   5. Monitor performance and errors');
    
    console.log('\n🔐 Security reminders:');
    console.log('   - Never commit service role keys to version control');
    console.log('   - Use environment variables for all secrets');
    console.log('   - Regularly rotate API keys');
    console.log('   - Monitor for suspicious activity');
    
  } catch (error) {
    console.error('❌ Production setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
main();