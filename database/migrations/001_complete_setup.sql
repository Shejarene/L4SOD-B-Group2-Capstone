-- ============================================
-- L4SOD School Management - Complete DB Setup
-- Run ALL of this in Supabase SQL Editor
-- ============================================

-- 1. Create all tables
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level TEXT,
  capacity INTEGER DEFAULT 40,
  class_teacher_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  employee_id TEXT UNIQUE,
  specialization TEXT,
  qualifications TEXT,
  hire_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE classes ADD COLUMN IF NOT EXISTS class_teacher_id UUID REFERENCES teachers(id);

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  admission_number TEXT UNIQUE,
  class_id UUID REFERENCES classes(id),
  section_id UUID,
  parent_id UUID REFERENCES users(id),
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  medical_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  class_id UUID REFERENCES classes(id),
  teacher_id UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  term INTEGER,
  academic_year TEXT,
  max_score INTEGER DEFAULT 100,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  subject_id UUID REFERENCES subjects(id),
  exam_id UUID REFERENCES exams(id),
  class_id UUID REFERENCES classes(id),
  score NUMERIC,
  grade TEXT,
  status TEXT DEFAULT 'draft',
  entered_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  class_id UUID REFERENCES classes(id),
  section_id UUID,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  remark TEXT,
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_id UUID REFERENCES classes(id),
  amount NUMERIC NOT NULL,
  term INTEGER,
  academic_year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  fee_structure_id UUID REFERENCES fee_structures(id),
  amount NUMERIC NOT NULL,
  paid_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_id UUID REFERENCES fees(id),
  student_id UUID REFERENCES students(id),
  amount NUMERIC NOT NULL,
  payment_method TEXT,
  reference TEXT,
  paid_by UUID REFERENCES users(id),
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discipline_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  type TEXT,
  description TEXT NOT NULL,
  action_taken TEXT,
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id),
  subject_id UUID REFERENCES subjects(id),
  teacher_id UUID REFERENCES teachers(id),
  day_of_week TEXT,
  start_time TIME,
  end_time TIME,
  room TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  audience TEXT DEFAULT 'all',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  location TEXT NOT NULL,
  date_lost DATE NOT NULL,
  contact_info TEXT,
  status TEXT DEFAULT 'pending',
  reporter_id UUID REFERENCES users(id),
  admin_remark TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Invites table (for access requests and admin invites)
-- ============================================

CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  expires_at TIMESTAMPTZ,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  reason TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discipline_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- ============================================

DROP POLICY IF EXISTS "users_read_own" ON users;
CREATE POLICY "users_read_own" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "authenticated_read_students" ON students;
CREATE POLICY "authenticated_read_students" ON students FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_students" ON students;
CREATE POLICY "authenticated_insert_students" ON students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_students" ON students;
CREATE POLICY "authenticated_update_students" ON students FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_students" ON students;
CREATE POLICY "authenticated_delete_students" ON students FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_teachers" ON teachers;
CREATE POLICY "authenticated_read_teachers" ON teachers FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_teachers" ON teachers;
CREATE POLICY "authenticated_insert_teachers" ON teachers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_teachers" ON teachers;
CREATE POLICY "authenticated_update_teachers" ON teachers FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_teachers" ON teachers;
CREATE POLICY "authenticated_delete_teachers" ON teachers FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_classes" ON classes;
CREATE POLICY "authenticated_read_classes" ON classes FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_classes" ON classes;
CREATE POLICY "authenticated_insert_classes" ON classes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_classes" ON classes;
CREATE POLICY "authenticated_update_classes" ON classes FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_classes" ON classes;
CREATE POLICY "authenticated_delete_classes" ON classes FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_subjects" ON subjects;
CREATE POLICY "authenticated_read_subjects" ON subjects FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_subjects" ON subjects;
CREATE POLICY "authenticated_insert_subjects" ON subjects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_subjects" ON subjects;
CREATE POLICY "authenticated_update_subjects" ON subjects FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_subjects" ON subjects;
CREATE POLICY "authenticated_delete_subjects" ON subjects FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_exams" ON exams;
CREATE POLICY "authenticated_read_exams" ON exams FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_exams" ON exams;
CREATE POLICY "authenticated_insert_exams" ON exams FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_exams" ON exams;
CREATE POLICY "authenticated_update_exams" ON exams FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_exams" ON exams;
CREATE POLICY "authenticated_delete_exams" ON exams FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_marks" ON marks;
CREATE POLICY "authenticated_read_marks" ON marks FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_marks" ON marks;
CREATE POLICY "authenticated_insert_marks" ON marks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_marks" ON marks;
CREATE POLICY "authenticated_update_marks" ON marks FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_marks" ON marks;
CREATE POLICY "authenticated_delete_marks" ON marks FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_attendance" ON attendance;
CREATE POLICY "authenticated_read_attendance" ON attendance FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_attendance" ON attendance;
CREATE POLICY "authenticated_insert_attendance" ON attendance FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_attendance" ON attendance;
CREATE POLICY "authenticated_update_attendance" ON attendance FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_attendance" ON attendance;
CREATE POLICY "authenticated_delete_attendance" ON attendance FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_fees" ON fees;
CREATE POLICY "authenticated_read_fees" ON fees FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_fees" ON fees;
CREATE POLICY "authenticated_insert_fees" ON fees FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_fees" ON fees;
CREATE POLICY "authenticated_update_fees" ON fees FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_fees" ON fees;
CREATE POLICY "authenticated_delete_fees" ON fees FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_fee_structures" ON fee_structures;
CREATE POLICY "authenticated_read_fee_structures" ON fee_structures FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_fee_structures" ON fee_structures;
CREATE POLICY "authenticated_insert_fee_structures" ON fee_structures FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_fee_structures" ON fee_structures;
CREATE POLICY "authenticated_update_fee_structures" ON fee_structures FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_fee_structures" ON fee_structures;
CREATE POLICY "authenticated_delete_fee_structures" ON fee_structures FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_payments" ON payments;
CREATE POLICY "authenticated_read_payments" ON payments FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_payments" ON payments;
CREATE POLICY "authenticated_insert_payments" ON payments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_payments" ON payments;
CREATE POLICY "authenticated_update_payments" ON payments FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_payments" ON payments;
CREATE POLICY "authenticated_delete_payments" ON payments FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_discipline" ON discipline_records;
CREATE POLICY "authenticated_read_discipline" ON discipline_records FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_discipline" ON discipline_records;
CREATE POLICY "authenticated_insert_discipline" ON discipline_records FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_discipline" ON discipline_records;
CREATE POLICY "authenticated_update_discipline" ON discipline_records FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_discipline" ON discipline_records;
CREATE POLICY "authenticated_delete_discipline" ON discipline_records FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_timetable" ON timetable;
CREATE POLICY "authenticated_read_timetable" ON timetable FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_timetable" ON timetable;
CREATE POLICY "authenticated_insert_timetable" ON timetable FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_timetable" ON timetable;
CREATE POLICY "authenticated_update_timetable" ON timetable FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_timetable" ON timetable;
CREATE POLICY "authenticated_delete_timetable" ON timetable FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_messages" ON messages;
CREATE POLICY "authenticated_read_messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_messages" ON messages;
CREATE POLICY "authenticated_insert_messages" ON messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_messages" ON messages;
CREATE POLICY "authenticated_update_messages" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_messages" ON messages;
CREATE POLICY "authenticated_delete_messages" ON messages FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_announcements" ON announcements;
CREATE POLICY "authenticated_read_announcements" ON announcements FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_announcements" ON announcements;
CREATE POLICY "authenticated_insert_announcements" ON announcements FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_announcements" ON announcements;
CREATE POLICY "authenticated_update_announcements" ON announcements FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_announcements" ON announcements;
CREATE POLICY "authenticated_delete_announcements" ON announcements FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_read_lost_items" ON lost_items;
CREATE POLICY "authenticated_read_lost_items" ON lost_items FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_lost_items" ON lost_items;
CREATE POLICY "authenticated_insert_lost_items" ON lost_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_lost_items" ON lost_items;
CREATE POLICY "authenticated_update_lost_items" ON lost_items FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_lost_items" ON lost_items;
CREATE POLICY "authenticated_delete_lost_items" ON lost_items FOR DELETE USING (auth.role() = 'authenticated');

-- Invites policies
DROP POLICY IF EXISTS "authenticated_read_invites" ON invites;
CREATE POLICY "authenticated_read_invites" ON invites FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_insert_invites" ON invites;
CREATE POLICY "authenticated_insert_invites" ON invites FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_update_invites" ON invites;
CREATE POLICY "authenticated_update_invites" ON invites FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated_delete_invites" ON invites;
CREATE POLICY "authenticated_delete_invites" ON invites FOR DELETE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "anyone_can_request_access" ON invites;
CREATE POLICY "anyone_can_request_access" ON invites FOR INSERT WITH CHECK (true);

-- 5. Enable Realtime for invites table (CRITICAL for notifications)
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE invites;

-- 6. RPC Functions (SECURITY DEFINER to bypass RLS)
-- ============================================

CREATE OR REPLACE FUNCTION create_access_request(
  p_email TEXT,
  p_role TEXT,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO invites (email, role, first_name, last_name, phone, reason, status, token)
  VALUES (p_email, p_role, p_first_name, p_last_name, p_phone, p_reason, 'pending', gen_random_uuid()::text)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_all_invites()
RETURNS TABLE (
  id UUID, email TEXT, role TEXT, token TEXT, status TEXT,
  expires_at TIMESTAMPTZ, first_name TEXT, last_name TEXT,
  phone TEXT, reason TEXT, created_by UUID, created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT i.id, i.email, i.role, i.token, i.status, i.expires_at,
         i.first_name, i.last_name, i.phone, i.reason, i.created_by, i.created_at
  FROM invites i
  ORDER BY i.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION get_pending_requests()
RETURNS TABLE (
  id UUID, email TEXT, role TEXT, token TEXT, status TEXT,
  expires_at TIMESTAMPTZ, first_name TEXT, last_name TEXT,
  phone TEXT, reason TEXT, created_by UUID, created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT i.id, i.email, i.role, i.token, i.status, i.expires_at,
         i.first_name, i.last_name, i.phone, i.reason, i.created_by, i.created_at
  FROM invites i
  WHERE i.status = 'pending' AND i.reason IS NOT NULL
  ORDER BY i.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION create_admin_invite(
  p_email TEXT,
  p_role TEXT,
  p_token TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO invites (email, role, token, status)
  VALUES (p_email, p_role, p_token, 'pending')
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION approve_access_request(
  p_request_id UUID,
  p_new_token TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE invites
  SET status = 'approved', token = p_new_token
  WHERE id = p_request_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION reject_access_request(
  p_request_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE invites
  SET status = 'rejected'
  WHERE id = p_request_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION verify_invite_token(p_token TEXT)
RETURNS TABLE (
  id UUID, email TEXT, role TEXT, status TEXT,
  expires_at TIMESTAMPTZ, first_name TEXT, last_name TEXT, phone TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT i.id, i.email, i.role, i.status, i.expires_at,
         i.first_name, i.last_name, i.phone
  FROM invites i
  WHERE i.token = p_token AND i.status = 'pending';
END;
$$;

CREATE OR REPLACE FUNCTION accept_invite(p_token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE invites
  SET status = 'accepted'
  WHERE token = p_token AND status = 'pending';
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION delete_invite(p_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM invites WHERE id = p_id;
  RETURN FOUND;
END;
$$;
