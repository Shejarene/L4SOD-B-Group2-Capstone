import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://dhaqzqhnyqsmgsdkwluf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoYXF6cWhueXFzbWdzZGt3bHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NDU3ODgsImV4cCI6MjA5NDMyMTc4OH0.F-dB0OHDadKW92TR0WLJCdz3b6gweT4DZt62QEj2xo4'
)

async function check() {
  console.log('=== Exams table ===')
  const { data, error } = await supabase.from('Exams').select('*').limit(1)
  if (error) console.error('Error:', error.message)
  else if (data?.length) console.log('Columns:', Object.keys(data[0]).join(', '))
  else console.log('Table exists, empty')

  console.log('\n=== Classes table ===')
  const { data: c, error: ce } = await supabase.from('Classes').select('*').limit(1)
  if (ce) console.error('Error:', ce.message)
  else if (c?.length) console.log('Columns:', Object.keys(c[0]).join(', '))
  else console.log('Table exists, empty')

  console.log('\n=== Students table ===')
  const { data: s, error: se } = await supabase.from('Students').select('*').limit(1)
  if (se) console.error('Error:', se.message)
  else if (s?.length) console.log('Columns:', Object.keys(s[0]).join(', '))
  else console.log('Table exists, empty')

  console.log('\n=== Attendance table ===')
  const { data: a, error: ae } = await supabase.from('Attendance').select('*').limit(1)
  if (ae) console.error('Error:', ae.message)
  else if (a?.length) console.log('Columns:', Object.keys(a[0]).join(', '))
  else console.log('Table exists, empty')

  console.log('\n=== Users table ===')
  const { data: u, error: ue } = await supabase.from('Users').select('*').limit(1)
  if (ue) console.error('Error:', ue.message)
  else if (u?.length) console.log('Columns:', Object.keys(u[0]).join(', '))
  else console.log('Table exists, empty')
}

check()
