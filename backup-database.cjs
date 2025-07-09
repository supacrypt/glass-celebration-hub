#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Create backup directory with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(process.cwd(), 'backups', `backup-${timestamp}`);

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Define all tables to backup
const tables = [
  'app_settings',
  'chat_members',
  'chat_messages',
  'conversation_settings',
  'dietary_requirements',
  'direct_chats',
  'gallery_photos',
  'gift_registry',
  'guests',
  'message_likes',
  'message_reactions',
  'message_replies',
  'message_reports',
  'messages',
  'photo_comments',
  'photo_likes',
  'photos',
  'poll_notifications',
  'poll_options',
  'poll_votes',
  'polls',
  'post_comments',
  'post_reactions',
  'profiles',
  'rsvps',
  'social_posts',
  'stories',
  'user_blocks',
  'user_roles',
  'venue_images',
  'venues',
  'wedding_events'
];

const stats = {
  totalTables: tables.length,
  processedTables: 0,
  totalRecords: 0,
  errors: [],
  startTime: new Date(),
  endTime: null
};

// Logger function
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const symbols = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  
  console.log(`[${timestamp}] ${symbols[level]} ${message}`);
}

// Function to backup a single table
async function backupTable(tableName) {
  try {
    log(`Starting backup of table: ${tableName}`);
    
    // Fetch all data from the table
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) {
      throw new Error(`Failed to fetch data from ${tableName}: ${error.message}`);
    }
    
    const recordCount = data?.length || 0;
    log(`Fetched ${recordCount} records from ${tableName}`);
    
    // Create backup file
    const backupFile = path.join(backupDir, `${tableName}.json`);
    const backupData = {
      table: tableName,
      timestamp: new Date().toISOString(),
      recordCount,
      data: data || []
    };
    
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    log(`Backup saved to: ${backupFile}`, 'success');
    
    stats.totalRecords += recordCount;
    stats.processedTables++;
    
  } catch (error) {
    const errorMessage = `Error backing up table ${tableName}: ${error.message}`;
    log(errorMessage, 'error');
    stats.errors.push(errorMessage);
  }
}

// Function to create backup summary
function createBackupSummary() {
  stats.endTime = new Date();
  const duration = stats.endTime.getTime() - stats.startTime.getTime();
  
  const summary = {
    backupInfo: {
      timestamp: stats.startTime.toISOString(),
      duration: `${Math.round(duration / 1000)}s`,
      backupDirectory: backupDir
    },
    statistics: {
      totalTables: stats.totalTables,
      processedTables: stats.processedTables,
      totalRecords: stats.totalRecords,
      successRate: `${Math.round((stats.processedTables / stats.totalTables) * 100)}%`
    },
    errors: stats.errors,
    tableBreakdown: {}
  };
  
  // Add individual table record counts
  tables.forEach(table => {
    try {
      const tableFile = path.join(backupDir, `${table}.json`);
      if (fs.existsSync(tableFile)) {
        const tableData = JSON.parse(fs.readFileSync(tableFile, 'utf8'));
        summary.tableBreakdown[table] = tableData.recordCount;
      }
    } catch (error) {
      log(`Warning: Could not read backup file for ${table}`, 'warning');
    }
  });
  
  // Save summary
  const summaryFile = path.join(backupDir, 'backup-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  
  // Create human-readable report
  const reportFile = path.join(backupDir, 'backup-report.txt');
  const report = `
Wedding App Database Backup Report
================================

Backup Date: ${stats.startTime.toISOString()}
Duration: ${Math.round(duration / 1000)} seconds
Backup Directory: ${backupDir}

SUMMARY:
- Total Tables: ${stats.totalTables}
- Successfully Backed Up: ${stats.processedTables}
- Total Records: ${stats.totalRecords}
- Success Rate: ${Math.round((stats.processedTables / stats.totalTables) * 100)}%

TABLE BREAKDOWN:
${Object.entries(summary.tableBreakdown).map(([table, count]) => `- ${table}: ${count} records`).join('\n')}

${stats.errors.length > 0 ? `\nERRORS:\n${stats.errors.map(err => `- ${err}`).join('\n')}` : '\nNo errors encountered during backup.'}

BACKUP FILES:
${tables.map(table => `- ${table}.json`).join('\n')}
- backup-summary.json
- backup-report.txt

This backup is read-only and contains all user data from the wedding app database.
Use these files for data recovery, migration, or analysis purposes.
`;
  
  fs.writeFileSync(reportFile, report);
  log(`Backup summary saved to: ${summaryFile}`, 'success');
  log(`Backup report saved to: ${reportFile}`, 'success');
}

// Main backup function
async function runBackup() {
  log('🚀 Starting Wedding App Database Backup');
  log(`Backup directory: ${backupDir}`);
  log(`Total tables to backup: ${tables.length}`);
  
  // Test database connection
  try {
    log('Testing database connection...');
    const { data, error } = await supabase.from('app_settings').select('count').limit(1);
    if (error) throw error;
    log('Database connection successful', 'success');
  } catch (error) {
    log('Failed to connect to database', 'error');
    log(error.message, 'error');
    process.exit(1);
  }
  
  // Backup each table
  for (const table of tables) {
    await backupTable(table);
    
    // Show progress
    const progress = Math.round((stats.processedTables / stats.totalTables) * 100);
    log(`Progress: ${progress}% (${stats.processedTables}/${stats.totalTables} tables)`);
  }
  
  // Create backup summary
  createBackupSummary();
  
  // Final report
  log('📊 BACKUP COMPLETE!', 'success');
  log(`✅ Successfully backed up ${stats.processedTables}/${stats.totalTables} tables`);
  log(`📈 Total records backed up: ${stats.totalRecords}`);
  log(`📁 Backup location: ${backupDir}`);
  
  if (stats.errors.length > 0) {
    log(`⚠️ ${stats.errors.length} errors encountered - check backup-report.txt for details`, 'warning');
  }
  
  log('🎉 Backup process completed successfully!');
}

// Run the backup
runBackup().catch(error => {
  log('Fatal error during backup:', 'error');
  console.error(error);
  process.exit(1);
});