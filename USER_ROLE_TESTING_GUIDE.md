# User Role Testing Guide

## Overview

This guide provides you with multiple tools to safely manage user roles in your Supabase database, specifically for testing the guest dashboard functionality by temporarily changing daniel.j.fleuren@gmail.com from 'admin' to 'guest' role.

## Database Structure

### User Roles Table
- **Table**: `user_roles`
- **Structure**:
  - `id`: Primary key (UUID)
  - `user_id`: Foreign key to profiles.user_id (UUID)
  - `role`: Enum ('guest', 'admin', 'couple')
  - `created_at`: Timestamp

### Available Roles
- `guest`: Standard user access
- `admin`: Full administrative access
- `couple`: Special couple privileges

## Current Users Status

Based on the latest data scan:

| Email | Name | Current Role | User ID |
|-------|------|-------------|---------|
| daniel.j.fleuren@gmail.com | Daniel Fleuren | **ADMIN** | 3c3a1bb8-c0f6-4865-b45d-04c79b1ea474 |
| kirsten.coupland@gmail.com | Kirsten Coupland | GUEST | 6796c03d-bf73-4aa0-9705-fc8417c28fe3 |
| lesleyait@hotmail.com | Lesley Sutton | GUEST | f897a72b-069b-4c79-91a9-72acceca4102 |
| nicky.fleuren07@gmail.com | Nicky Fleuren | GUEST | 7bbc3a12-284f-455e-ae94-b2f14cf81ad2 |

*Note: Several users have no assigned roles and should be assigned appropriate roles.*

## Testing Tools Available

### 1. Quick SQL Commands (RECOMMENDED)
**File**: `quick-role-change-commands.sql`

Use these commands directly in your **Supabase SQL Editor** for immediate role changes:

```sql
-- Change daniel.j.fleuren@gmail.com to guest role
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    SELECT user_id INTO target_user_id
    FROM profiles WHERE email = 'daniel.j.fleuren@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        DELETE FROM user_roles WHERE user_id = target_user_id;
        INSERT INTO user_roles (user_id, role)
        VALUES (target_user_id, 'guest'::app_role);
        RAISE NOTICE 'Successfully changed to GUEST role';
    END IF;
END $$;
```

### 2. Node.js Management Script
**File**: `manage-user-roles.js`

```bash
# List all users and roles
node manage-user-roles.js list

# Change user role (may be blocked by RLS policies)
node manage-user-roles.js change daniel.j.fleuren@gmail.com guest

# Create backup
node manage-user-roles.js backup
```

### 3. Web Interface Tool
**File**: `role-management-tool.html`

Open this HTML file in your browser for a visual interface to manage user roles.

### 4. Comprehensive SQL Commands
**File**: `user-role-management.sql`

Complete SQL commands with backup functionality and detailed instructions.

## Step-by-Step Testing Process

### Phase 1: Backup Current State
```sql
-- Create backup table
CREATE TABLE IF NOT EXISTS user_roles_backup AS
SELECT 
    ur.*,
    p.email,
    current_timestamp as backup_created_at
FROM user_roles ur
JOIN profiles p ON ur.user_id = p.user_id;
```

### Phase 2: Change to Guest Role
```sql
-- Execute in Supabase SQL Editor
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    SELECT user_id INTO target_user_id
    FROM profiles WHERE email = 'daniel.j.fleuren@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        DELETE FROM user_roles WHERE user_id = target_user_id;
        INSERT INTO user_roles (user_id, role)
        VALUES (target_user_id, 'guest'::app_role);
        RAISE NOTICE 'Successfully changed daniel.j.fleuren@gmail.com to GUEST role';
    END IF;
END $$;
```

### Phase 3: Test Guest Dashboard
1. Log out of the application
2. Log back in as daniel.j.fleuren@gmail.com
3. Verify you see the guest dashboard instead of admin dashboard
4. Test guest functionality thoroughly

### Phase 4: Restore Admin Role
```sql
-- Execute when testing is complete
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    SELECT user_id INTO target_user_id
    FROM profiles WHERE email = 'daniel.j.fleuren@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        DELETE FROM user_roles WHERE user_id = target_user_id;
        INSERT INTO user_roles (user_id, role)
        VALUES (target_user_id, 'admin'::app_role);
        RAISE NOTICE 'Successfully restored daniel.j.fleuren@gmail.com to ADMIN role';
    END IF;
END $$;
```

## Verification Commands

### Check Current Role
```sql
SELECT 
    p.email,
    ur.role,
    ur.created_at
FROM profiles p
LEFT JOIN user_roles ur ON p.user_id = ur.user_id
WHERE p.email = 'daniel.j.fleuren@gmail.com';
```

### View All User Roles
```sql
SELECT 
    p.email,
    p.first_name,
    p.last_name,
    ur.role,
    ur.created_at as role_assigned_at
FROM profiles p
LEFT JOIN user_roles ur ON p.user_id = ur.user_id
ORDER BY p.email;
```

## Security Notes

- **RLS Policies**: The database has Row Level Security policies that prevent non-admin users from modifying user roles
- **Backup Strategy**: Always create backups before making changes
- **Testing Environment**: These commands are designed for your development/staging environment
- **Admin Access**: Use Supabase SQL Editor for role changes as it bypasses RLS policies

## Troubleshooting

### Common Issues

1. **RLS Policy Violations**: Use Supabase SQL Editor instead of application code
2. **Role Not Found**: Ensure the user exists in the profiles table
3. **Permission Denied**: Make sure you're using admin credentials in Supabase

### Error Recovery

If something goes wrong, restore from backup:
```sql
-- Restore specific user from backup
INSERT INTO user_roles (user_id, role)
SELECT user_id, role FROM user_roles_backup 
WHERE email = 'daniel.j.fleuren@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

## Files Created

1. **quick-role-change-commands.sql** - Immediate SQL commands for role changes
2. **user-role-management.sql** - Comprehensive SQL with backup functionality  
3. **manage-user-roles.js** - Node.js script for role management
4. **role-management-tool.html** - Web interface for role management
5. **USER_ROLE_TESTING_GUIDE.md** - This guide

## Quick Reference

### Change to Guest (Copy & Paste)
```sql
DO $$DECLARE target_user_id uuid;BEGIN SELECT user_id INTO target_user_id FROM profiles WHERE email = 'daniel.j.fleuren@gmail.com';IF target_user_id IS NOT NULL THEN DELETE FROM user_roles WHERE user_id = target_user_id;INSERT INTO user_roles (user_id, role) VALUES (target_user_id, 'guest'::app_role);RAISE NOTICE 'Changed to GUEST role';END IF;END $$;
```

### Restore to Admin (Copy & Paste)
```sql
DO $$DECLARE target_user_id uuid;BEGIN SELECT user_id INTO target_user_id FROM profiles WHERE email = 'daniel.j.fleuren@gmail.com';IF target_user_id IS NOT NULL THEN DELETE FROM user_roles WHERE user_id = target_user_id;INSERT INTO user_roles (user_id, role) VALUES (target_user_id, 'admin'::app_role);RAISE NOTICE 'Restored to ADMIN role';END IF;END $$;
```

## Next Steps

1. **Immediate**: Use the quick SQL commands to change daniel.j.fleuren@gmail.com to guest role
2. **Test**: Verify guest dashboard functionality works as expected
3. **Restore**: Change back to admin role when testing is complete
4. **Cleanup**: Optionally remove backup tables when no longer needed

The safest and most reliable method is using the **Supabase SQL Editor** with the provided SQL commands. The Node.js and HTML tools are available for future use when you have proper service role keys configured.