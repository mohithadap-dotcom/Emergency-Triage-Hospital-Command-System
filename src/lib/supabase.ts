import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const env = (import.meta as any).env || {};
const supabaseUrl = typeof window !== 'undefined' 
  ? (env.VITE_SUPABASE_URL || 'https://your-project.supabase.co')
  : (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://your-project.supabase.co');

const supabaseAnonKey = typeof window !== 'undefined'
  ? (env.VITE_SUPABASE_ANON_KEY || 'anon-key-placeholder')
  : (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'anon-key-placeholder');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Admin client for server-side elevated actions if SERVICE_ROLE_KEY is provided
export const getSupabaseAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
