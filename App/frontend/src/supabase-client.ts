import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'Add url here'
const supabaseKey = 'Add key here'

export const supabase = createClient(supabaseUrl, supabaseKey)