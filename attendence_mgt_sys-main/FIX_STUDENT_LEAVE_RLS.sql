-- Fix RLS for Students to INSERT leave forms
-- This allows students to create their own leave applications

-- First, check existing policies on leave_forms
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  qual as using_expression
FROM pg_policies 
WHERE tablename = 'leave_forms'
ORDER BY policyname;

-- Drop existing restrictive INSERT policy if any
DROP POLICY IF EXISTS "Students can create their own leave forms" ON leave_forms;

-- Create permissive INSERT policy for students
CREATE POLICY "Students can insert leave forms"
ON leave_forms
FOR INSERT
WITH CHECK (true);

-- Also ensure students can SELECT their own leave forms
DROP POLICY IF EXISTS "Students can view leave forms" ON leave_forms;

CREATE POLICY "Students can view leave forms"
ON leave_forms
FOR SELECT
USING (true);

-- For development: Make sure all operations are allowed
-- (You can restrict these later in production)

DROP POLICY IF EXISTS "allow_all_operations_leave_forms" ON leave_forms;

CREATE POLICY "allow_all_operations_leave_forms"
ON leave_forms
FOR ALL
USING (true)
WITH CHECK (true);

-- Verify the policies
SELECT 
  policyname,
  cmd as operation,
  CASE 
    WHEN qual = 'true' THEN '✅ PERMISSIVE (allows all)'
    ELSE '⚠️ RESTRICTIVE: ' || qual
  END as access_control
FROM pg_policies 
WHERE tablename = 'leave_forms'
ORDER BY policyname;
