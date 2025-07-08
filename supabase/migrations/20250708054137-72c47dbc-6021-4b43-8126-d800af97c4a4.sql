-- Complete Supabase Backend Audit & Testing Query
-- This will show us the current state of all tables, RLS policies, and data

-- 1. Check all table structures and counts
SELECT 
  schemaname,
  tablename,
  tableowner,
  hasindexes,
  hasrules,
  hastriggers
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. Check RLS policies status
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Check storage buckets and policies
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets
ORDER BY name;

-- 4. Check data counts in all tables
SELECT 
  'profiles' as table_name, 
  COUNT(*) as record_count 
FROM profiles
UNION ALL
SELECT 
  'user_roles' as table_name, 
  COUNT(*) as record_count 
FROM user_roles
UNION ALL
SELECT 
  'wedding_events' as table_name, 
  COUNT(*) as record_count 
FROM wedding_events
UNION ALL
SELECT 
  'rsvps' as table_name, 
  COUNT(*) as record_count 
FROM rsvps
UNION ALL
SELECT 
  'photos' as table_name, 
  COUNT(*) as record_count 
FROM photos
UNION ALL
SELECT 
  'messages' as table_name, 
  COUNT(*) as record_count 
FROM messages
UNION ALL
SELECT 
  'gift_registry' as table_name, 
  COUNT(*) as record_count 
FROM gift_registry
UNION ALL
SELECT 
  'guests' as table_name, 
  COUNT(*) as record_count 
FROM guests
ORDER BY table_name;