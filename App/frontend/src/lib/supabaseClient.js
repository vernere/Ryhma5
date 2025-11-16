import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check if we're in a test environment
const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test' || import.meta.env.MODE === 'test';

if ((!supabaseUrl || !supabaseAnonKey) && import.meta.env.NODE_ENV === 'production') {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env');
}

// Use dummy values for tests if environment variables are not set
const testUrl = 'https://test.supabase.co';
const testKey = 'test-anon-key';

export const supabase = createClient(
  supabaseUrl || (isTest ? testUrl : ''),
  supabaseAnonKey || (isTest ? testKey : '')
);
