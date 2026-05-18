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
    // First, try to ensure the auth user exists.
    let { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { role: u.role, firstName: u.firstName, lastName: u.lastName }
    });

    if (authError && !authError.message.includes('already been registered')) {
      // It's a real error, not an "already exists" error.
      console.error(`❌ Error creating auth user ${u.email}: ${authError.message}`);
      continue;
    }

    // At this point, the user exists in auth. Let's get their data.
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error(`❌ Could not list users: ${listError.message}`);
      continue;
    }
    const foundUser = users.find(user => user.email === u.email);

    if (!foundUser) {
      console.error(`❌ Could not find user ${u.email} in auth after creation attempt.`);
      continue;
    }

    // Now, check if the profile exists in the public Users table.
    const { data: userProfile, error: profileError } = await supabase
      .from('Users')
      .select('id')
      .eq('id', foundUser.id)
      .single();

    if (userProfile) {
      console.log(`⏭️  ${u.email} already has a profile.`);
      continue;
    }
    
    // Profile doesn't exist, so create it.
    console.log(`⏳ ${u.email} exists in auth, creating profile...`)
    const { error: dbError } = await supabase.from('Users').insert({
      id: foundUser.id,
      email: u.email,
      role: u.role,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      password: u.password,
    });

    if (dbError) {
      console.error(`   ❌ ${u.email} DB insert: ${dbError.message}`);
    } else {
      console.log(`   ✅ ${u.email} profile created`);
    }
  }

  console.log('\nDone! Login with:')
  console.log('  admin@school.com / admin123')
  console.log('  principal@school.com / admin123')
  console.log('  teacher@school.com / admin123')
}

seed()
