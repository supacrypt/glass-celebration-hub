import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// This script helps you understand what RLS policies to create in Supabase Dashboard
// Since we can't create RLS policies on storage.objects via SQL, you need to:
// 1. Go to Supabase Dashboard > Storage
// 2. Click on each bucket
// 3. Click "Policies" 
// 4. Add these policies manually

const bucketPolicies = {
  'public-assets': {
    description: 'Public read access, admin write access',
    policies: [
      {
        name: 'Give users access to public files',
        operation: 'SELECT',
        definition: 'true', // Anyone can read
      },
      {
        name: 'Give admins ability to upload',
        operation: 'INSERT',
        definition: `(auth.jwt() ->> 'role'::text) = 'admin'::text`,
      },
      {
        name: 'Give admins ability to update', 
        operation: 'UPDATE',
        definition: `(auth.jwt() ->> 'role'::text) = 'admin'::text`,
      },
      {
        name: 'Give admins ability to delete',
        operation: 'DELETE', 
        definition: `(auth.jwt() ->> 'role'::text) = 'admin'::text`,
      }
    ]
  },
  'user-content': {
    description: 'Users manage their own content, social content is readable by all authenticated',
    policies: [
      {
        name: 'Users can view their own files',
        operation: 'SELECT',
        definition: `auth.uid()::text = (storage.foldername(name))[2] OR (storage.foldername(name))[1] = 'social'`,
      },
      {
        name: 'Users can upload their own files',
        operation: 'INSERT',
        definition: `auth.uid()::text = (storage.foldername(name))[2]`,
      },
      {
        name: 'Users can update their own files',
        operation: 'UPDATE',
        definition: `auth.uid()::text = (storage.foldername(name))[2]`,
      },
      {
        name: 'Users can delete their own files',
        operation: 'DELETE',
        definition: `auth.uid()::text = (storage.foldername(name))[2]`,
      }
    ]
  },
  'admin-assets': {
    description: 'Admin only access',
    policies: [
      {
        name: 'Only admins can view',
        operation: 'SELECT',
        definition: `(auth.jwt() ->> 'role'::text) = 'admin'::text`,
      },
      {
        name: 'Only admins can upload',
        operation: 'INSERT',
        definition: `(auth.jwt() ->> 'role'::text) = 'admin'::text`,
      },
      {
        name: 'Only admins can update',
        operation: 'UPDATE', 
        definition: `(auth.jwt() ->> 'role'::text) = 'admin'::text`,
      },
      {
        name: 'Only admins can delete',
        operation: 'DELETE',
        definition: `(auth.jwt() ->> 'role'::text) = 'admin'::text`,
      }
    ]
  }
};

console.log('📋 RLS Policies to Create in Supabase Dashboard:\n');

for (const [bucket, config] of Object.entries(bucketPolicies)) {
  console.log(`\n🪣 Bucket: ${bucket}`);
  console.log(`📝 Description: ${config.description}\n`);
  
  config.policies.forEach((policy, index) => {
    console.log(`  ${index + 1}. ${policy.name}`);
    console.log(`     Operation: ${policy.operation}`);
    console.log(`     Definition: ${policy.definition}`);
    console.log('');
  });
}

console.log('\n✅ After creating these policies, run the file migration script.');

// Also check if buckets were created
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function checkBuckets() {
  console.log('\n🔍 Checking if buckets exist...\n');
  
  const buckets = ['public-assets', 'user-content', 'admin-assets'];
  
  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase.storage.from(bucket).list('', { limit: 1 });
      
      if (error) {
        console.log(`❌ ${bucket}: Not found or no access`);
      } else {
        console.log(`✅ ${bucket}: Exists and accessible`);
      }
    } catch (err) {
      console.log(`❌ ${bucket}: Error - ${err.message}`);
    }
  }
}

checkBuckets();