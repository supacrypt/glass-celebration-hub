import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function setupMigration() {
  console.log('🚀 Setting up storage migration...\n');
  
  try {
    // Step 1: Create migration tracking table
    console.log('1️⃣ Creating migration tracking table...');
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS storage_migration_map (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          old_bucket VARCHAR(100) NOT NULL,
          old_path TEXT NOT NULL,
          new_bucket VARCHAR(100) NOT NULL,
          new_path TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          error_message TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          completed_at TIMESTAMPTZ,
          UNIQUE(old_bucket, old_path)
        );
      `
    }).single();
    
    if (tableError) {
      console.log('⚠️  Could not create table via RPC, trying direct approach...');
    }
    
    // Step 2: Get existing files from media_library
    console.log('\n2️⃣ Fetching existing files from media_library...');
    const { data: files, error: filesError } = await supabase
      .from('media_library')
      .select('*')
      .not('storage_bucket', 'is', null)
      .not('storage_path', 'is', null);
    
    if (filesError) {
      console.error('Error fetching files:', filesError);
      return;
    }
    
    console.log(`Found ${files?.length || 0} files to migrate`);
    
    // Step 3: Create migration mappings
    console.log('\n3️⃣ Creating migration mappings...');
    const mappings = files?.map(file => {
      let newBucket = 'public-assets';
      let newPath = file.storage_path;
      
      // Determine new bucket
      if (['user-profiles', 'user-social-media', 'user-videos', 'user-audio', 'user-documents'].includes(file.storage_bucket)) {
        newBucket = 'user-content';
      } else if (['admin-uploads', 'custom-fonts', 'svg-icons'].includes(file.storage_bucket)) {
        newBucket = 'admin-assets';
      }
      
      // Determine new path
      switch (file.storage_bucket) {
        case 'venue-ben-ean':
          newPath = `venues/deee0f2e-6b57-469c-aac3-fd7c7ee9ef68/hero/${file.storage_path}`;
          break;
        case 'venue-pub':
          newPath = `venues/dac9fa6a-6c86-4b3b-b1cc-12f99c0eade7/hero/${file.storage_path}`;
          break;
        case 'venue-beach':
          newPath = `venues/b3e0b587-46ea-4bf1-9ce1-9455ff61a9bf/hero/${file.storage_path}`;
          break;
        case 'backgrounds':
          if (file.storage_path.match(/\.(mp4|mov|webm)$/i)) {
            newPath = `hero/videos/${file.storage_path}`;
          } else if (file.storage_path.toLowerCase().includes('logo')) {
            newPath = `branding/logos/${file.storage_path}`;
          } else {
            newPath = `hero/images/${file.storage_path}`;
          }
          break;
        case 'couple-gallery':
          newPath = `gallery/couple/${file.storage_path}`;
          break;
        case 'user-profiles':
          newPath = `profiles/${file.storage_path}`;
          break;
        case 'user-social-media':
          newPath = `social/${file.storage_path}`;
          break;
        case 'custom-fonts':
          newPath = `fonts/${file.storage_path}`;
          break;
        case 'svg-icons':
          newPath = `icons/${file.storage_path}`;
          break;
      }
      
      return {
        old_bucket: file.storage_bucket,
        old_path: file.storage_path,
        new_bucket: newBucket,
        new_path: newPath
      };
    }) || [];
    
    // Step 4: Insert mappings
    if (mappings.length > 0) {
      console.log(`\n4️⃣ Inserting ${mappings.length} migration mappings...`);
      
      // Insert in batches of 100
      const batchSize = 100;
      for (let i = 0; i < mappings.length; i += batchSize) {
        const batch = mappings.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from('storage_migration_map')
          .upsert(batch, { onConflict: 'old_bucket,old_path' });
        
        if (insertError) {
          console.error('Error inserting batch:', insertError);
        } else {
          console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(mappings.length / batchSize)}`);
        }
      }
    }
    
    // Step 5: Update media_library with new paths
    console.log('\n5️⃣ Updating media_library with migration plan...');
    for (const mapping of mappings) {
      await supabase
        .from('media_library')
        .update({
          new_bucket: mapping.new_bucket,
          new_path: mapping.new_path,
          migration_status: 'mapped'
        })
        .eq('storage_bucket', mapping.old_bucket)
        .eq('storage_path', mapping.old_path);
    }
    
    // Step 6: Show migration summary
    console.log('\n6️⃣ Migration Summary:');
    const summary = mappings.reduce((acc, m) => {
      const key = `${m.old_bucket} → ${m.new_bucket}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(summary).forEach(([key, count]) => {
      console.log(`  ${key}: ${count} files`);
    });
    
    console.log('\n✅ Migration setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: node setup_bucket_policies.js');
    console.log('2. Create RLS policies in Supabase Dashboard');
    console.log('3. Run: node safe_file_migration.js');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupMigration();