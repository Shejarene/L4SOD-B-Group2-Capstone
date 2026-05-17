-- ============================================
-- L4SOD School Management - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================
-- NOTE: Your Supabase project already has tables created.
-- This file documents the expected schema.

-- Users table (PascalCase)
-- Columns: id, email, password, firstName, lastName, phone, role, isActive, profilePicture, lastLogin, refreshToken, createdAt, updatedAt

-- LoginRequests table (for access requests)
-- Columns: id, firstName, lastName, email, phone, requestedRole, reason, status, adminRemark, reviewedBy, reviewedAt, createdAt, updatedAt

-- Invites table (for invite links)
-- Columns: id, token, role, email, used, usedBy, usedAt, expiresAt, createdBy, createdAt, updatedAt

-- Other tables: Students, Teachers, Classes, Subjects, Marks, Attendance, FeeStructures, FeePayments, DisciplinaryRecords, Timetables, Messages, Announcements, LostItems

-- To enable realtime for LoginRequests (for admin notifications):
ALTER PUBLICATION supabase_realtime ADD TABLE "LoginRequests";
ALTER PUBLICATION supabase_realtime ADD TABLE "Invites";
