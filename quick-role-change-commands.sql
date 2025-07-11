-- Quick Role Change Commands for daniel.j.fleuren@gmail.com
-- Use these in your Supabase SQL Editor for immediate testing

-- ========================================
-- 1. CURRENT STATUS CHECK
-- ========================================
-- Check current role for daniel.j.fleuren@gmail.com
SELECT 
    p.email,
    ur.role,
    ur.created_at,
    p.user_id
FROM profiles p
LEFT JOIN user_roles ur ON p.user_id = ur.user_id
WHERE p.email = 'daniel.j.fleuren@gmail.com';

-- ========================================
-- 2. CHANGE TO GUEST ROLE (FOR TESTING)
-- ========================================
-- Execute this to change daniel to guest role for testing guest dashboard
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
        
        RAISE NOTICE 'Successfully changed daniel.j.fleuren@gmail.com to GUEST role';
    ELSE
        RAISE NOTICE 'User daniel.j.fleuren@gmail.com not found';
    END IF;
END $$;

-- ========================================
-- 3. VERIFY THE CHANGE
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
-- 4. RESTORE TO ADMIN ROLE (AFTER TESTING)
-- ========================================
-- Execute this to restore daniel to admin role after testing
-- UNCOMMENT THE BLOCK BELOW WHEN YOU WANT TO RESTORE ADMIN ACCESS
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
        
        RAISE NOTICE 'Successfully restored daniel.j.fleuren@gmail.com to ADMIN role';
    ELSE
        RAISE NOTICE 'User daniel.j.fleuren@gmail.com not found';
    END IF;
END $$;
*/

-- ========================================
-- INSTRUCTIONS:
-- ========================================
-- 1. Run section 1 to check current status
-- 2. Run section 2 to change to guest role
-- 3. Run section 3 to verify the change
-- 4. Test your guest dashboard functionality
-- 5. Uncomment and run section 4 to restore admin role