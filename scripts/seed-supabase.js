import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dhaqzqhnyqsmgsdkwluf.supabase.co'
const SUPABASE_SERVICE_ROLE = process.argv[2]

if (!SUPABASE_SERVICE_ROLE) {
  console.log('Usage: node seed-supabase.js <SERVICE_ROLE_KEY>')
  console.log('Get your key from: https://supabase.com/dashboard/project/dhaqzqhnyqsmgsdkwluf/settings/api')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

const adminUsers = [
  { email: 'admin@school.com', password: 'admin123', role: 'super_admin', firstName: 'Super', lastName: 'Admin', phone: '+250780000001' },
  { email: 'principal@school.com', password: 'admin123', role: 'principal', firstName: 'John', lastName: 'Principal', phone: '+250780000002' },
  { email: 'dos@school.com', password: 'admin123', role: 'dos', firstName: 'Jane', lastName: 'Director', phone: '+250780000003' },
  { email: 'teacher@school.com', password: 'admin123', role: 'teacher', firstName: 'Alice', lastName: 'Teacher', phone: '+250780000004' },
  { email: 'accountant@school.com', password: 'admin123', role: 'accountant', firstName: 'Bob', lastName: 'Accountant', phone: '+250780000005' },
  { email: 'discipline@school.com', password: 'admin123', role: 'discipline_master', firstName: 'Charlie', lastName: 'Discipline', phone: '+250780000006' },
]

async function seed() {
  console.log('Seeding Supabase with demo users...\n')

  for (const u of adminUsers) {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { role: u.role, firstName: u.firstName, lastName: u.lastName }
    })

    if (authError) {
      if (authError.message.includes('already exists')) {
        console.log(`⏭️  ${u.email} already exists in auth`)
        const { data: existingUsers } = await supabase.from('Users').select('id').eq('email', u.email)
        if (existingUsers && existingUsers.length > 0) {
          console.log(`   Profile exists in Users table`)
          continue
        }
        const { data: authUsers } = await supabase.auth.admin.listUsers()
        const found = authUsers?.users?.find(x => x.email === u.email)
        if (found) {
          const { error: dbError } = await supabase.from('Users').insert({
            id: found.id,
            email: u.email,
            role: u.role,
            firstName: u.firstName,
            lastName: u.lastName,
            phone: u.phone,
          })
          if (dbError) {
            console.error(`   ❌ Profile insert: ${dbError.message}`)
          } else {
            console.log(`   ✅ Created profile in Users table`)
          }
          continue
        }
        continue
      }
      console.error(`❌ ${u.email}: ${authError.message}`)
      continue
    }

    const userId = authUser.user.id

    const { error: dbError } = await supabase
      .from('Users')
      .insert({
        id: userId,
        email: u.email,
        role: u.role,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
      })

    if (dbError) {
      console.error(`❌ ${u.email} DB insert: ${dbError.message}`)
    } else {
      console.log(`✅ ${u.email} (${u.role}) created`)
    }
  }

  console.log('\nDone! Login with:')
  console.log('  admin@school.com / admin123')
  console.log('  principal@school.com / admin123')
  console.log('  teacher@school.com / admin123')
}

seed()
