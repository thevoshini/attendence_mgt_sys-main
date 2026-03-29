-- Add RLS policies for students to view departments, classes, and teachers
-- This allows the Academic Info component to work

-- Allow students to view departments
DROP POLICY IF EXISTS "Students can view departments" ON departments;
CREATE POLICY "Students can view departments"
ON departments
FOR SELECT
USING (true);

-- Allow students to view classes  
DROP POLICY IF EXISTS "Students can view classes" ON classes;
CREATE POLICY "Students can view classes"
ON classes
FOR SELECT
USING (true);

-- Allow students to view teachers
DROP POLICY IF EXISTS "Students can view teachers" ON teachers;
CREATE POLICY "Students can view teachers"
ON teachers
FOR SELECT
USING (true);

-- Allow students to view teacher_classes
DROP POLICY IF EXISTS "Students can view teacher_classes" ON teacher_classes;
CREATE POLICY "Students can view teacher_classes"
ON teacher_classes
FOR SELECT
USING (true);

-- Verify policies
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE tablename IN ('departments', 'classes', 'teachers', 'teacher_classes')
ORDER BY tablename, policyname;
