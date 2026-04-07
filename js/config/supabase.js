import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://twbajwbumgktyqthhizd.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3YmFqd2J1bWdrdHlxdGhoaXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NzU5NzMsImV4cCI6MjA5MTA1MTk3M30.fiF-_hpnJgh737JqSiiuXF0bJt9xRkTqWATEplHfm-8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)