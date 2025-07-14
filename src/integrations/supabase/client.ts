// Secure Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { getSupabaseUrl, getSupabaseAnonKey } from '@/config/environment';
import { logger } from '@/utils/logger';

// Get configuration from environment
const SUPABASE_URL = getSupabaseUrl();
const SUPABASE_PUBLISHABLE_KEY = getSupabaseAnonKey();

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  const error = 'Missing Supabase configuration. Check environment variables.';
  logger.error(error, {}, 'SUPABASE_CONFIG');
  throw new Error(error);
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// SECURITY NOTE: Admin client should NEVER be used in client-side code in production
// This is only for development/testing purposes
// In production, admin operations should go through secure API endpoints
export const supabaseAdmin = (() => {
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    logger.warn('Service role key not available - admin client disabled', {}, 'SUPABASE_ADMIN');
    return null;
  }

  if (import.meta.env.PROD) {
    logger.error('Admin client should not be used in production', {}, 'SECURITY_VIOLATION');
    return null;
  }

  return createClient<Database>(
    SUPABASE_URL, 
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
})();