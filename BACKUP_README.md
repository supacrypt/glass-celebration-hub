# Wedding App Database Backup System

## Overview

This backup system provides a comprehensive, safe, and automated way to export all user data from the wedding app's Supabase database. The backup is **read-only** and will not modify or delete any existing data.

## Features

- ✅ **Complete Data Export**: Backs up all 33 database tables
- ✅ **Safe Operation**: Read-only operations, no data modification
- ✅ **Timestamped Backups**: Each backup includes ISO timestamp
- ✅ **Progress Tracking**: Real-time progress updates and logging
- ✅ **Error Handling**: Graceful error handling with detailed reporting
- ✅ **Comprehensive Reports**: JSON summary and human-readable reports
- ✅ **Record Counting**: Detailed breakdown of records per table

## Quick Start

### 1. Run the Backup

```bash
# Using npm
npm run backup

# Or run directly with Node
node backup-database.js
```

### 2. Find Your Backup

Backups are stored in the `backups/` directory with the following structure:
```
backups/
└── backup-2025-01-09T12-34-56-789Z/
    ├── backup-summary.json      # Machine-readable summary
    ├── backup-report.txt        # Human-readable report
    ├── app_settings.json        # 34 app settings
    ├── profiles.json            # 13 user profiles
    ├── user_roles.json          # 8 user roles
    ├── guests.json              # 70 wedding guests
    ├── rsvps.json               # RSVP responses
    ├── messages.json            # Public messages
    ├── chat_messages.json       # Private chat messages
    ├── photos.json              # Photo uploads
    ├── social_posts.json        # Social media posts
    ├── venues.json              # Venue information
    ├── wedding_events.json      # Wedding events
    └── [... all other tables]
```

## Data Tables Backed Up

The backup system exports data from all 33 tables:

### Core User Data
- `profiles` - User profiles (13 users)
- `user_roles` - User roles (8 roles)
- `guests` - Wedding guests (70 guests)
- `app_settings` - App settings (34 settings)

### Communication & Social
- `messages` - Public messages
- `chat_messages` - Private chat messages
- `direct_chats` - Chat conversations
- `chat_members` - Chat participants
- `social_posts` - Social media posts
- `post_comments` - Post comments
- `post_reactions` - Post reactions

### Wedding Data
- `rsvps` - RSVP responses
- `wedding_events` - Wedding events
- `venues` - Venue information
- `venue_images` - Venue photos
- `dietary_requirements` - Dietary restrictions

### Media & Photos
- `photos` - Photo uploads
- `gallery_photos` - Gallery images
- `photo_comments` - Photo comments
- `photo_likes` - Photo likes
- `stories` - Story posts

### Polls & Engagement
- `polls` - Poll questions
- `poll_options` - Poll choices
- `poll_votes` - Poll responses
- `poll_notifications` - Poll notifications

### Moderation & Security
- `message_reports` - Message reports
- `user_blocks` - Blocked users
- `conversation_settings` - Chat settings

### Gift Registry
- `gift_registry` - Gift registry items

## Backup File Format

Each table is backed up as a JSON file with the following structure:

```json
{
  "table": "profiles",
  "timestamp": "2025-01-09T12:34:56.789Z",
  "recordCount": 13,
  "data": [
    {
      "id": "uuid-here",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2025-01-01T00:00:00.000Z",
      ...
    }
  ]
}
```

## Sample Output

```
[2025-01-09T12:34:56.789Z] 🚀 Starting Wedding App Database Backup
[2025-01-09T12:34:56.790Z] 📁 Backup directory: /path/to/backups/backup-2025-01-09T12-34-56-789Z
[2025-01-09T12:34:56.791Z] 📊 Total tables to backup: 33
[2025-01-09T12:34:56.792Z] ✅ Database connection successful
[2025-01-09T12:34:56.800Z] ℹ️ Starting backup of table: app_settings
[2025-01-09T12:34:56.850Z] ℹ️ Fetched 34 records from app_settings
[2025-01-09T12:34:56.851Z] ✅ Backup saved to: app_settings.json
[2025-01-09T12:34:56.852Z] ℹ️ Progress: 3% (1/33 tables)
...
[2025-01-09T12:35:30.123Z] 📊 BACKUP COMPLETE!
[2025-01-09T12:35:30.124Z] ✅ Successfully backed up 33/33 tables
[2025-01-09T12:35:30.125Z] 📈 Total records backed up: 1,247
[2025-01-09T12:35:30.126Z] 📁 Backup location: /path/to/backups/backup-2025-01-09T12-34-56-789Z
[2025-01-09T12:35:30.127Z] 🎉 Backup process completed successfully!
```

## Requirements

- Node.js (v14 or higher)
- Valid Supabase credentials in `.env` file
- Internet connection to access Supabase

## Environment Variables

The backup script reads credentials from your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Security Notes

- ✅ **Read-Only Operations**: The script only performs SELECT queries
- ✅ **No Data Modification**: Cannot insert, update, or delete data
- ✅ **Local Storage**: All backups are stored locally
- ✅ **Secure Credentials**: Uses existing environment variables
- ⚠️ **Sensitive Data**: Backup files contain user data - handle securely

## Error Handling

The backup system includes comprehensive error handling:

- **Connection Errors**: Tests database connection before starting
- **Table Errors**: Continues backup even if individual tables fail
- **File System Errors**: Handles permission and disk space issues
- **Detailed Logging**: All errors are logged with timestamps
- **Summary Reports**: Errors are documented in backup reports

## Backup Reports

Each backup generates two reports:

### 1. backup-summary.json (Machine-readable)
```json
{
  "backupInfo": {
    "timestamp": "2025-01-09T12:34:56.789Z",
    "duration": "34s",
    "backupDirectory": "/path/to/backup"
  },
  "statistics": {
    "totalTables": 33,
    "processedTables": 33,
    "totalRecords": 1247,
    "successRate": "100%"
  },
  "errors": [],
  "tableBreakdown": {
    "profiles": 13,
    "guests": 70,
    "app_settings": 34,
    ...
  }
}
```

### 2. backup-report.txt (Human-readable)
A detailed text report with all backup information, perfect for documentation and review.

## Troubleshooting

### Common Issues

1. **"Missing Supabase credentials"**
   - Ensure `.env` file exists and contains valid credentials
   - Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

2. **"Failed to connect to database"**
   - Verify internet connection
   - Check if Supabase project is active
   - Confirm credentials are correct

3. **"Permission denied"**
   - Ensure write permissions to project directory
   - Check if `backups/` directory can be created

4. **"Table backup failed"**
   - Individual table failures don't stop the entire backup
   - Check error details in backup-report.txt

## Best Practices

1. **Regular Backups**: Run backups regularly (daily/weekly)
2. **Secure Storage**: Keep backup files in secure locations
3. **Version Control**: Don't commit backup files to Git
4. **Monitoring**: Review backup reports for errors
5. **Testing**: Periodically test backup integrity

## File Structure

```
project/
├── backup-database.js         # Main backup script
├── backup-database.ts         # TypeScript version
├── BACKUP_README.md          # This documentation
├── package.json              # Updated with backup script
├── .env                      # Supabase credentials
└── backups/                  # Generated backup directory
    └── backup-YYYY-MM-DDTHH-MM-SS-SSSZ/
        ├── backup-summary.json
        ├── backup-report.txt
        └── [table-name].json (x33 files)
```

## Support

For issues or questions about the backup system:
1. Check the backup-report.txt for error details
2. Verify environment variables are set correctly
3. Ensure database connection is working
4. Review the backup summary for detailed statistics

---

**Note**: This backup system is designed for data export and migration purposes. It provides a complete snapshot of your wedding app database at the time of backup.