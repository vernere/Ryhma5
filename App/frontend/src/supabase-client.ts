import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://paewgclmqocmykxvvoyz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZXdnY2xtcW9jbXlreHZ2b3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTIxNjUsImV4cCI6MjA3MjM4ODE2NX0.g1NfKrU33bo4RUiJ7oNU4RTVxyhOlbWcMM6z7MexLe0'

export const supabase = createClient(supabaseUrl, supabaseKey)