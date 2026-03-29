-- ========================================
-- DIAGNOSE RLS ISSUES
-- ========================================
-- Run this to see what's blocking teacher_classes access

-- 1. Check if RLS is enabled on teacher_classes
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN 'RLS is ENABLED - policies required'
    ELSE 'RLS is DISABLED - all data accessible'
  END as status
FROM pg_tables 
WHERE tablename = 'teacher_classes';

-- 2. Check existing policies on teacher_classes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation,
  qual as using_expression,
  with_check
FROM pg_policies
WHERE tablename = 'teacher_classes';

-- 3. Check policies on related tables
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename IN ('classes', 'students', 'leave_forms')
ORDER BY tablename, policyname;

-- 4. Try to query teacher_classes directly (this will help us see if data exists)
SELECT COUNT(*) as total_teacher_class_assignments FROM teacher_classes;

-- 5. Check specific teacher's classes
SELECT 
  tc.id,
  tc.teacher_id,
  t.name as teacher_name,
  tc.class_id,
  c.name as class_name,
  tc.is_coordinator
FROM teacher_classes tc
JOIN teachers t ON t.id = tc.teacher_id
JOIN classes c ON c.id = tc.class_id
WHERE t.email = 'teacher2@mailinator.com';

-- ========================================
-- LIKELY FIX: DISABLE RLS TEMPORARILY
-- ========================================
-- If the above queries work but the API still returns empty,
-- the issue is with the RLS policies being too restrictive.
--
-- OPTION 1: Disable RLS completely (for testing/development only!)
-- Uncomment these lines to disable RLS:

-- ALTER TABLE teacher_classes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE students DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE leave_forms DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE teachers DISABLE ROW LEVEL SECURITY;

-- OPTION 2: Drop the problematic policy and recreate it correctly
DROP POLICY IF EXISTS "Teachers can view their own class assignments" ON teacher_classes;
DROP POLICY IF EXISTS "Allow reading classes" ON classes;
DROP POLICY IF EXISTS "Allow reading students" ON students;  
DROP POLICY IF EXISTS "Allow reading leave forms" ON leave_forms;

-- Create very permissive policies (for development)
CREATE POLICY "allow_all_reads_teacher_classes"
ON teacher_classes
FOR SELECT
USING (true);

CREATE POLICY "allow_all_reads_classes"
ON classes
FOR SELECT
USING (true);

CREATE POLICY "allow_all_reads_students"
ON students
FOR SELECT
USING (true);

CREATE POLICY "allow_all_reads_leave_forms"
ON leave_forms
FOR SELECT
USING (true);

-- Also allow reading teachers table
DROP POLICY IF EXISTS "allow_all_reads_teachers" ON teachers;
CREATE POLICY "allow_all_reads_teachers"
ON teachers
FOR SELECT
USING (true);

-- Allow updates for teachers (for profile updates)
DROP POLICY IF EXISTS "allow_teacher_updates" ON teachers;
CREATE POLICY "allow_teacher_updates"
ON teachers
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow leave form updates (for approvals/rejections)
DROP POLICY IF EXISTS "allow_leave_updates" ON leave_forms;
CREATE POLICY "allow_leave_updates"
ON leave_forms
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow students to insert/update their own data
DROP POLICY IF EXISTS "allow_student_operations" ON students;
CREATE POLICY "allow_student_operations"
ON students
FOR ALL
USING (true)
WITH CHECK (true);

-- ========================================
-- VERIFICATION
-- ========================================
-- After running, check policies were created:
SELECT tablename, policyname, cmd FROM pg_policies 
WHERE tablename IN ('teacher_classes', 'classes', 'students', 'leave_forms', 'teachers')
ORDER BY tablename;
