-- Migration: Add class/student/teacher targeting to exams
-- Run this in Supabase SQL Editor

ALTER TABLE exams ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES classes(id);
ALTER TABLE exams ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES students(id);
ALTER TABLE exams ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES teachers(id);
ALTER TABLE exams ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id);
