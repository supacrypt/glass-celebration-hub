// Environment configuration and validation
export const getEnvironmentConfig = () => {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  };
};

export const getSupabaseUrl = () => {
  return import.meta.env.VITE_SUPABASE_URL || '';
};

export const getSupabaseAnonKey = () => {
  return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
};

export const validateEnvironment = () => {
  const config = getEnvironmentConfig();
  
  if (!config.supabaseUrl) {
    console.warn('Missing VITE_SUPABASE_URL environment variable');
  }
  
  if (!config.supabaseAnonKey) {
    console.warn('Missing VITE_SUPABASE_ANON_KEY environment variable');
  }
  
  return config;
};

export default getEnvironmentConfig();