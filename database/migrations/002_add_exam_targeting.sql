-- Migration: Add class/student/teacher targeting to Exams
-- Run this in Supabase SQL Editor

ALTER TABLE "Exams" ADD COLUMN IF NOT EXISTS "classId" UUID REFERENCES "Classes"(id);
ALTER TABLE "Exams" ADD COLUMN IF NOT EXISTS "studentId" UUID REFERENCES "Students"(id);
ALTER TABLE "Exams" ADD COLUMN IF NOT EXISTS "teacherId" UUID REFERENCES "Teachers"(id);
ALTER TABLE "Exams" ADD COLUMN IF NOT EXISTS "createdBy" UUID REFERENCES "Users"(id);
