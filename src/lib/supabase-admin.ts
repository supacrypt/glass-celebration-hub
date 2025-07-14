import { createClient } from '@supabase/supabase-js';

// Create admin client for server-side operations
export const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);