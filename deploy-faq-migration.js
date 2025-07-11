import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iwmfxcrzzwpmxomydmuq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('Please set it in your .env file or provide it when running the script');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, 'supabase/migrations/20250711000000_faq_management_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Executing migration...');
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Skip comments
      if (statement.trim().startsWith('--')) {
        continue;
      }

      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`Error in statement ${i + 1}:`, error.message);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error(`Failed to execute statement ${i + 1}:`, err.message);
        errorCount++;
      }
    }

    console.log('\nMigration complete!');
    console.log(`Successful statements: ${successCount}`);
    console.log(`Failed statements: ${errorCount}`);

    if (errorCount === 0) {
      console.log('\n✅ All migration statements executed successfully!');
    } else {
      console.log('\n⚠️  Some statements failed. Please check the errors above.');
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();