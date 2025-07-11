-- User Role Management SQL Commands
-- Use these commands in your Supabase SQL Editor to safely manage user roles

-- ========================================
-- 1. BACKUP CURRENT ROLES (RECOMMENDED)
-- ========================================
-- Create a backup table before making changes
CREATE TABLE IF NOT EXISTS user_roles_backup AS
SELECT 
    ur.*,
    p.email,
    current_timestamp as backup_created_at
FROM user_roles ur
JOIN profiles p ON ur.user_id = p.user_id;

-- View the backup
SELECT * FROM user_roles_backup ORDER BY backup_created_at DESC;

-- ========================================
-- 2. VIEW CURRENT USER ROLES
-- ========================================
-- See all users and their current roles
SELECT 
    p.email,
    p.first_name,
    p.last_name,
    p.display_name,
    ur.role,
    ur.created_at as role_assigned_at,
    p.user_id,
    ur.id as role_record_id
FROM profiles p
LEFT JOIN user_roles ur ON p.user_id = ur.user_id
ORDER BY p.email;

-- ========================================
-- 3. FIND SPECIFIC USER
-- ========================================
-- Find daniel.j.fleuren@gmail.com specifically
SELECT 
    p.email,
    p.user_id,
    ur.role,
    ur.id as role_record_id,
    ur.created_at
FROM profiles p
LEFT JOIN user_roles ur ON p.user_id = ur.user_id
WHERE p.email = 'daniel.j.fleuren@gmail.com';

-- ========================================
-- 4. CHANGE DANIEL TO GUEST ROLE (FOR TESTING)
-- ========================================
-- Safe method: Delete existing role and insert new one
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Get the user_id for daniel.j.fleuren@gmail.com
    SELECT user_id INTO target_user_id
    FROM profiles 
    WHERE email = 'daniel.j.fleuren@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        -- Delete existing role(s)
        DELETE FROM user_roles WHERE user_id = target_user_id;
        
        -- Insert new guest role
        INSERT INTO user_roles (user_id, role)
        VALUES (target_user_id, 'guest'::app_role);
        
        RAISE NOTICE 'Successfully changed daniel.j.fleuren@gmail.com to guest role';
    ELSE
        RAISE NOTICE 'User daniel.j.fleuren@gmail.com not found';
    END IF;
END $$;

-- ========================================
-- 5. VERIFY THE CHANGE
-- ========================================
-- Confirm the role change worked
SELECT 
    p.email,
    ur.role,
    ur.created_at as role_changed_at
FROM profiles p
JOIN user_roles ur ON p.user_id = ur.user_id
WHERE p.email = 'daniel.j.fleuren@gmail.com';

-- ========================================
-- 6. RESTORE DANIEL TO ADMIN ROLE (AFTER TESTING)
-- ========================================
-- Uncomment and run this section to restore admin role after testing
/*
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Get the user_id for daniel.j.fleuren@gmail.com
    SELECT user_id INTO target_user_id
    FROM profiles 
    WHERE email = 'daniel.j.fleuren@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        -- Delete existing role(s)
        DELETE FROM user_roles WHERE user_id = target_user_id;
        
        -- Insert admin role
        INSERT INTO user_roles (user_id, role)
        VALUES (target_user_id, 'admin'::app_role);
        
        RAISE NOTICE 'Successfully restored daniel.j.fleuren@gmail.com to admin role';
    ELSE
        RAISE NOTICE 'User daniel.j.fleuren@gmail.com not found';
    END IF;
END $$;
*/

-- ========================================
-- 7. ALTERNATIVE: UPSERT METHOD (if preferred)
-- ========================================
-- Alternative approach using upsert (may have constraint issues)
/*
WITH user_info AS (
    SELECT user_id FROM profiles WHERE email = 'daniel.j.fleuren@gmail.com'
)
INSERT INTO user_roles (user_id, role)
SELECT user_id, 'guest'::app_role FROM user_info
ON CONFLICT (user_id, role) 
DO UPDATE SET 
    role = 'guest'::app_role,
    created_at = NOW();
*/

-- ========================================
-- 8. CLEANUP BACKUP (OPTIONAL)
-- ========================================
-- Remove backup table when no longer needed
-- DROP TABLE IF EXISTS user_roles_backup;

-- ========================================
-- USAGE INSTRUCTIONS:
-- ========================================
-- 1. Run section 1 to create backup
-- 2. Run section 2 to see current roles
-- 3. Run section 3 to find daniel's current role
-- 4. Run section 4 to change daniel to guest role
-- 5. Run section 5 to verify the change
-- 6. Test your guest dashboard functionality
-- 7. Run section 6 to restore daniel to admin role
-- 8. Optionally run section 8 to cleanup backup table