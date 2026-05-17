import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dhaqzqhnyqsmgsdkwluf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoYXF6cWhueXFzbWdzZGt3bHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NDU3ODgsImV4cCI6MjA5NDMyMTc4OH0.F-dB0OHDadKW92TR0WLJCdz3b6gweT4DZt62QEj2xo4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
