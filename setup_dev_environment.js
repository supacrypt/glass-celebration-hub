#!/usr/bin/env node

/**
 * Development Environment Setup Script
 * 
 * This script sets up the development environment for the Nuptily wedding application
 * including storage buckets, RLS policies, and profile picture handling.
 * 
 * Usage: node setup_dev_environment.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - VITE_SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file.');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🚀 Setting up Development Environment for Nuptily\n');

/**
 * Storage bucket configurations
 */
const buckets = [
  {
    name: 'avatars',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    description: 'User profile pictures and avatars'
  },
  {
    name: 'social-media',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'],
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
    description: 'Social media posts, stories, and shared content'
  },
  {
    name: 'user-content',
    public: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    fileSizeLimit: 25 * 1024 * 1024, // 25MB
    description: 'User-specific content and documents'
  },
  {
    name: 'public-assets',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    description: 'Public website assets and images'
  }
];

/**
 * Create storage buckets
 */
async function createBuckets() {
  console.log('📦 Creating storage buckets...\n');
  
  for (const bucket of buckets) {
    try {
      const { error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        allowedMimeTypes: bucket.allowedMimeTypes,
        fileSizeLimit: bucket.fileSizeLimit
      });
      
      if (error && error.message !== 'Bucket already exists') {
        console.error(`❌ Error creating bucket ${bucket.name}:`, error.message);
      } else {
        console.log(`✅ Bucket '${bucket.name}' ${error ? 'already exists' : 'created successfully'}`);
        console.log(`   📝 ${bucket.description}`);
        console.log(`   🌐 Public: ${bucket.public ? 'Yes' : 'No'}`);
        console.log(`   📊 Size limit: ${Math.round(bucket.fileSizeLimit / 1024 / 1024)}MB`);
        console.log(`   🎨 Allowed types: ${bucket.allowedMimeTypes.join(', ')}\n`);
      }
    } catch (err) {
      console.error(`❌ Failed to create bucket ${bucket.name}:`, err.message);
    }
  }
}

/**
 * RLS Policy configurations
 */
const rlsPolicies = {
  'avatars': [
    {
      name: 'Anyone can view avatars',
      operation: 'SELECT',
      definition: 'true'
    },
    {
      name: 'Users can upload their own avatar',
      operation: 'INSERT', 
      definition: 'auth.uid()::text = (storage.foldername(name))[1]'
    },
    {
      name: 'Users can update their own avatar',
      operation: 'UPDATE',
      definition: 'auth.uid()::text = (storage.foldername(name))[1]'
    },
    {
      name: 'Users can delete their own avatar',
      operation: 'DELETE',
      definition: 'auth.uid()::text = (storage.foldername(name))[1]'
    }
  ],
  'social-media': [
    {
      name: 'Authenticated users can view social media',
      operation: 'SELECT',
      definition: 'auth.role() = \'authenticated\''
    },
    {
      name: 'Users can upload social media content',
      operation: 'INSERT',
      definition: 'auth.role() = \'authenticated\''
    },
    {
      name: 'Users can update their own social media',
      operation: 'UPDATE', 
      definition: 'auth.uid()::text = (storage.foldername(name))[2]'
    },
    {
      name: 'Users can delete their own social media',
      operation: 'DELETE',
      definition: 'auth.uid()::text = (storage.foldername(name))[2]'
    }
  ],
  'user-content': [
    {
      name: 'Users can view their own content',
      operation: 'SELECT',
      definition: 'auth.uid()::text = (storage.foldername(name))[1]'
    },
    {
      name: 'Users can upload their own content',
      operation: 'INSERT',
      definition: 'auth.uid()::text = (storage.foldername(name))[1]'
    },
    {
      name: 'Users can update their own content',
      operation: 'UPDATE',
      definition: 'auth.uid()::text = (storage.foldername(name))[1]'
    },
    {
      name: 'Users can delete their own content',
      operation: 'DELETE',
      definition: 'auth.uid()::text = (storage.foldername(name))[1]'
    }
  ],
  'public-assets': [
    {
      name: 'Anyone can view public assets',
      operation: 'SELECT',
      definition: 'true'
    },
    {
      name: 'Only admins can upload public assets',
      operation: 'INSERT',
      definition: '(auth.jwt() ->> \'role\'::text) = \'admin\'::text'
    },
    {
      name: 'Only admins can update public assets',
      operation: 'UPDATE',
      definition: '(auth.jwt() ->> \'role\'::text) = \'admin\'::text'
    },
    {
      name: 'Only admins can delete public assets',
      operation: 'DELETE',
      definition: '(auth.jwt() ->> \'role\'::text) = \'admin\'::text'
    }
  ]
};

/**
 * Display RLS policy setup instructions
 */
function showRLSPolicyInstructions() {
  console.log('🔒 RLS Policy Setup Instructions\n');
  console.log('⚠️  Storage RLS policies must be created manually in the Supabase Dashboard:');
  console.log('   1. Go to https://supabase.com/dashboard/project/[your-project]/storage/buckets');
  console.log('   2. Click on each bucket name');
  console.log('   3. Go to the "Policies" tab');
  console.log('   4. Click "Add Policy" and create the following policies:\n');
  
  for (const [bucket, policies] of Object.entries(rlsPolicies)) {
    console.log(`📁 Bucket: ${bucket}`);
    console.log('─'.repeat(50));
    
    policies.forEach((policy, index) => {
      console.log(`\n${index + 1}. Policy Name: ${policy.name}`);
      console.log(`   Operation: ${policy.operation}`);
      console.log(`   Policy Definition: ${policy.definition}`);
    });
    
    console.log('\n');
  }
}

/**
 * Create development database functions
 */
async function createDevelopmentFunctions() {
  console.log('⚙️  Creating development database functions...\n');
  
  // Function to generate avatar URLs
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
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: avatarUrlFunction });
    if (error) throw error;
    console.log('✅ Avatar URL function created successfully');
  } catch (err) {
    console.error('❌ Error creating avatar URL function:', err.message);
  }
  
  // Function to handle profile picture uploads
  const handleProfilePictureFunction = `
    CREATE OR REPLACE FUNCTION public.handle_profile_picture_upload()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Update the user's profile with the new avatar URL
      IF NEW.bucket_id = 'avatars' THEN
        UPDATE public.profiles 
        SET avatar_url = CONCAT('${SUPABASE_URL}/storage/v1/object/public/avatars/', NEW.name)
        WHERE id = (NEW.name::text SPLIT_PART('/', 1))::UUID;
      END IF;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: handleProfilePictureFunction });
    if (error) throw error;
    console.log('✅ Profile picture upload handler created successfully');
  } catch (err) {
    console.error('❌ Error creating profile picture upload handler:', err.message);
  }
}

/**
 * Create development configuration file
 */
function createDevConfig() {
  console.log('📋 Creating development configuration file...\n');
  
  const devConfig = {
    supabase: {
      url: SUPABASE_URL,
      buckets: buckets.map(b => b.name),
      storageUrl: `${SUPABASE_URL}/storage/v1/object/public/`
    },
    development: {
      enableDebugMode: true,
      enableMockData: false,
      enablePerformanceMonitor: true,
      enableStorageLogging: true
    },
    features: {
      videoCallging: true,
      realTimeChat: true,
      photoUploads: true,
      adminDashboard: true
    }
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'dev-config.json'),
    JSON.stringify(devConfig, null, 2)
  );
  
  console.log('✅ Development configuration saved to dev-config.json');
}

/**
 * Test storage functionality
 */
async function testStorage() {
  console.log('🧪 Testing storage functionality...\n');
  
  try {
    // List buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    
    console.log('📦 Available buckets:');
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
    console.log('');
    
    // Test avatar bucket specifically
    const { data: avatarFiles, error: avatarError } = await supabase.storage
      .from('avatars')
      .list();
    
    if (avatarError) {
      console.error('❌ Error accessing avatars bucket:', avatarError.message);
    } else {
      console.log(`✅ Avatars bucket accessible (${avatarFiles.length} files)`);
    }
    
  } catch (err) {
    console.error('❌ Storage test failed:', err.message);
  }
}

/**
 * Main setup function
 */
async function main() {
  try {
    await createBuckets();
    await createDevelopmentFunctions();
    showRLSPolicyInstructions();
    createDevConfig();
    await testStorage();
    
    console.log('🎉 Development environment setup completed!\n');
    console.log('📖 Next steps:');
    console.log('   1. Configure RLS policies in Supabase Dashboard (see instructions above)');
    console.log('   2. Test profile picture uploads in the application');
    console.log('   3. Check dev-config.json for development settings');
    console.log('\n💡 Pro tip: Use the Supabase Dashboard to monitor storage usage and debug issues');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
main();