-- Run this in Supabase SQL Editor to create demo users and seed data

-- Create a function to create auth users (requires service_role privileges)
-- For simplicity, we'll use direct auth.signup via the dashboard or this approach:

-- First, enable email confirmations off (Settings -> Auth -> Email Auth -> Disable "Confirm email")

-- Create demo users using Supabase's built-in function
-- Note: You need to run this with service_role key or use the SQL editor as admin

-- Insert demo users into the users table (these will be linked to auth users after signup)
-- For now, use this approach: create users via Supabase Auth UI, then run this SQL:

-- Demo users data (run AFTER creating auth users via dashboard or API)
INSERT INTO users (id, email, role, first_name, last_name, phone)
VALUES 
  (gen_random_uuid(), 'admin@school.com', 'super_admin', 'Super', 'Admin', '+250780000001'),
  (gen_random_uuid(), 'principal@school.com', 'principal', 'John', 'Principal', '+250780000002'),
  (gen_random_uuid(), 'dos@school.com', 'dos', 'Jane', 'Director', '+250780000003'),
  (gen_random_uuid(), 'teacher@school.com', 'teacher', 'Alice', 'Teacher', '+250780000004'),
  (gen_random_uuid(), 'accountant@school.com', 'accountant', 'Bob', 'Accountant', '+250780000005'),
  (gen_random_uuid(), 'discipline@school.com', 'discipline_master', 'Charlie', 'Discipline', '+250780000006')
ON CONFLICT (email) DO NOTHING;

-- Seed classes
INSERT INTO classes (id, name, level, capacity)
VALUES 
  (gen_random_uuid(), 'Form 1A', 'O-Level', 40),
  (gen_random_uuid(), 'Form 1B', 'O-Level', 40),
  (gen_random_uuid(), 'Form 2A', 'O-Level', 40),
  (gen_random_uuid(), 'Form 3A', 'O-Level', 40),
  (gen_random_uuid(), 'Form 4A', 'O-Level', 40),
  (gen_random_uuid(), 'Form 5A', 'A-Level', 35),
  (gen_random_uuid(), 'Form 6A', 'A-Level', 35)
ON CONFLICT DO NOTHING;

-- Seed subjects
INSERT INTO subjects (id, name, code)
VALUES 
  (gen_random_uuid(), 'Mathematics', 'MATH'),
  (gen_random_uuid(), 'English', 'ENG'),
  (gen_random_uuid(), 'Physics', 'PHY'),
  (gen_random_uuid(), 'Chemistry', 'CHEM'),
  (gen_random_uuid(), 'Biology', 'BIO'),
  (gen_random_uuid(), 'History', 'HIST'),
  (gen_random_uuid(), 'Geography', 'GEO'),
  (gen_random_uuid(), 'Computer Science', 'CS'),
  (gen_random_uuid(), 'French', 'FREN'),
  (gen_random_uuid(), 'Kinyarwanda', 'KINY')
ON CONFLICT (code) DO NOTHING;

-- Seed exams
INSERT INTO exams (id, name, term, academic_year, max_score)
VALUES 
  (gen_random_uuid(), 'Term 1 Exam', 1, '2025', 100),
  (gen_random_uuid(), 'Term 2 Exam', 2, '2025', 100),
  (gen_random_uuid(), 'Term 3 Exam', 3, '2025', 100),
  (gen_random_uuid(), 'Mid-Term', 2, '2025', 50)
ON CONFLICT DO NOTHING;
