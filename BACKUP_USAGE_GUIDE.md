# Wedding App Database Backup - Quick Usage Guide

## 🚀 Quick Start

### Run the Backup
```bash
# Method 1: Using npm (recommended)
npm run backup

# Method 2: Direct execution
node backup-database.cjs
```

### Find Your Backup
```bash
# Check the backups directory
ls -la backups/

# View the latest backup
ls -la backups/backup-*/ | tail -1
```

## 📊 What Gets Backed Up

### ✅ Core Data Successfully Backed Up
- **User Profiles**: 13 users
- **Wedding Guests**: 70 guests  
- **User Roles**: 8 roles
- **App Settings**: 34 settings
- **Gift Registry**: 5 items
- **Messages**: 5 public messages
- **Social Posts**: 2 posts
- **Venues**: 3 venues
- **Venue Images**: 3 images
- **Wedding Events**: 4 events
- **RSVP Responses**: 1 response
- **Post Comments**: 1 comment
- **Post Reactions**: 1 reaction

### 📈 Total Records Backed Up: 150

## 🎯 Backup Results Summary

The backup system successfully exported data from **32 database tables** with **100% success rate**:

| Table | Records | Status |
|-------|---------|---------|
| `app_settings` | 34 | ✅ |
| `profiles` | 13 | ✅ |
| `guests` | 70 | ✅ |
| `user_roles` | 8 | ✅ |
| `gift_registry` | 5 | ✅ |
| `messages` | 5 | ✅ |
| `social_posts` | 2 | ✅ |
| `venues` | 3 | ✅ |
| `venue_images` | 3 | ✅ |
| `wedding_events` | 4 | ✅ |
| `rsvps` | 1 | ✅ |
| `post_comments` | 1 | ✅ |
| `post_reactions` | 1 | ✅ |
| All other tables | 0 | ✅ |

## 📁 Backup Directory Structure

```
backups/
└── backup-2025-07-09T17-24-18-310Z/
    ├── backup-summary.json      # Machine-readable summary
    ├── backup-report.txt        # Human-readable report
    ├── app_settings.json        # 34 app settings
    ├── profiles.json            # 13 user profiles
    ├── guests.json              # 70 wedding guests
    ├── user_roles.json          # 8 user roles
    ├── gift_registry.json       # 5 gift items
    ├── messages.json            # 5 public messages
    ├── social_posts.json        # 2 social posts
    ├── venues.json              # 3 venues
    ├── venue_images.json        # 3 venue images
    ├── wedding_events.json      # 4 wedding events
    ├── rsvps.json               # 1 RSVP response
    ├── post_comments.json       # 1 post comment
    ├── post_reactions.json      # 1 post reaction
    └── [... 19 empty tables]    # Tables with 0 records
```

## ⚡ Performance Stats

- **Duration**: ~2 seconds
- **Success Rate**: 100%
- **Tables Processed**: 32/32
- **Total Records**: 150
- **No Errors**: All tables backed up successfully

## 🔐 Security Features

✅ **Read-Only Operations**: Only SELECT queries, no data modification
✅ **Safe Execution**: Cannot delete or modify existing data
✅ **Local Storage**: All backups stored locally on your machine
✅ **Secure Credentials**: Uses existing .env file
✅ **Error Handling**: Comprehensive error logging and reporting

## 📋 Common Use Cases

1. **Before Major Updates**: Backup before deploying new features
2. **Data Migration**: Export data for moving to new systems
3. **Development**: Create test data snapshots
4. **Compliance**: Regular data exports for auditing
5. **Disaster Recovery**: Complete data backup for restoration

## 🔧 Troubleshooting

### If backup fails:
1. Check `.env` file has correct Supabase credentials
2. Verify internet connection
3. Ensure write permissions in project directory
4. Check backup report for specific error details

### Backup successful but missing data:
- This is normal - many tables are empty in development
- Check `backup-report.txt` for exact record counts
- Verify specific tables in the JSON files

## 📈 Next Steps

1. **Schedule Regular Backups**: Set up daily/weekly backups
2. **Secure Storage**: Move backups to secure, encrypted storage
3. **Test Restoration**: Verify backup integrity by testing restoration
4. **Monitor Growth**: Track data growth over time
5. **Document Process**: Share backup procedures with team

## 🎉 Success Confirmation

If you see this output, your backup was successful:
```
✅ Successfully backed up 32/32 tables
📈 Total records backed up: 150
📁 Backup location: /path/to/backup-directory
🎉 Backup process completed successfully!
```

Your wedding app database has been completely backed up and is ready for use!

---

**For detailed information**, see `BACKUP_README.md`