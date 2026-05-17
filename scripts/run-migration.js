import { readFileSync } from 'fs'

const PROJECT_REF = 'dhaqzqhnyqsmgsdkwluf'
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoYXF6cWhueXFzbWdzZGt3bHVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc0NTc4OCwiZXhwIjoyMDk0MzIxNzg4fQ.nxtuRFDH1e5rdrxiM9Hem0WE8bJ3VC8'

const sql = readFileSync('./database/migrations/001_complete_setup.sql', 'utf8')

async function runMigration() {
  console.log('🚀 Running migration on Supabase...')
  console.log(`📡 Project: ${PROJECT_REF}`)

  const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE,
      'Authorization': `Bearer ${SERVICE_ROLE}`,
      'Prefer': 'tx=rollback'
    },
    body: JSON.stringify({ query: sql })
  })

  const result = await response.json()

  if (!response.ok) {
    console.error('❌ Migration failed:')
    console.error(JSON.stringify(result, null, 2))
    process.exit(1)
  }

  console.log('✅ Migration completed successfully!')
  console.log('Results:', JSON.stringify(result, null, 2))
}

runMigration().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
