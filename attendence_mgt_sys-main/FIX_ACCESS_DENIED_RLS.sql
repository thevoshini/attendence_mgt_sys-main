-- ============================================================
-- FIX: RLS POLICIES - Allow anon role to SELECT data
-- ============================================================
-- Run this in Supabase SQL Editor → Run
-- Each block is wrapped safely so it won't error on missing tables.
-- ============================================================

-- STUDENTS
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Students can view their own data" ON students';
    EXECUTE '
      CREATE POLICY "Allow anon read on students"
        ON students FOR SELECT
        TO anon, authenticated
        USING (is_active = TRUE)
    ';
    RAISE NOTICE 'students: RLS policy updated';
  ELSE
    RAISE NOTICE 'students: table not found, skipped';
  END IF;
END $$;

-- TEACHERS
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'teachers') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Teachers can view active teachers" ON teachers';
    EXECUTE '
      CREATE POLICY "Allow anon read on teachers"
        ON teachers FOR SELECT
        TO anon, authenticated
        USING (is_active = TRUE)
    ';
    RAISE NOTICE 'teachers: RLS policy updated';
  ELSE
    RAISE NOTICE 'teachers: table not found, skipped';
  END IF;
END $$;

-- CLASSES
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'classes') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow read access on classes" ON classes';
    EXECUTE '
      CREATE POLICY "Allow anon read on classes"
        ON classes FOR SELECT
        TO anon, authenticated
        USING (is_active = TRUE)
    ';
    RAISE NOTICE 'classes: RLS policy updated';
  ELSE
    RAISE NOTICE 'classes: table not found, skipped';
  END IF;
END $$;

-- DEPARTMENTS
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'departments') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow public read access on departments" ON departments';
    EXECUTE '
      CREATE POLICY "Allow anon read on departments"
        ON departments FOR SELECT
        TO anon, authenticated
        USING (is_active = TRUE)
    ';
    RAISE NOTICE 'departments: RLS policy updated';
  ELSE
    RAISE NOTICE 'departments: table not found, skipped';
  END IF;
END $$;

-- LEAVE_FORMS
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'leave_forms') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Students can view their own leave forms" ON leave_forms';
    EXECUTE '
      CREATE POLICY "Allow anon read on leave_forms"
        ON leave_forms FOR SELECT
        TO anon, authenticated
        USING (is_active = TRUE)
    ';
    RAISE NOTICE 'leave_forms: RLS policy updated';
  ELSE
    RAISE NOTICE 'leave_forms: table not found, skipped';
  END IF;
END $$;

-- TEACHER_CLASSES
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'teacher_classes') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow read access on teacher_classes" ON teacher_classes';
    EXECUTE '
      CREATE POLICY "Allow anon read on teacher_classes"
        ON teacher_classes FOR SELECT
        TO anon, authenticated
        USING (true)
    ';
    RAISE NOTICE 'teacher_classes: RLS policy updated';
  ELSE
    RAISE NOTICE 'teacher_classes: table not found, skipped';
  END IF;
END $$;

-- ADMIN_USERS
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_users') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow read access on admin_users" ON admin_users';
    EXECUTE '
      CREATE POLICY "Allow anon read on admin_users"
        ON admin_users FOR SELECT
        TO anon, authenticated
        USING (is_active = TRUE)
    ';
    RAISE NOTICE 'admin_users: RLS policy updated';
  ELSE
    RAISE NOTICE 'admin_users: table not found, skipped';
  END IF;
END $$;

-- HOD
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'hod') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow read access on hod" ON hod';
    EXECUTE '
      CREATE POLICY "Allow anon read on hod"
        ON hod FOR SELECT
        TO anon, authenticated
        USING (is_active = TRUE)
    ';
    RAISE NOTICE 'hod: RLS policy updated';
  ELSE
    RAISE NOTICE 'hod: table not found, skipped';
  END IF;
END $$;

-- ============================================================
-- VERIFY: Check students are visible and active
-- ============================================================
SELECT id, name, regno, clerk_user_id, is_active
FROM students
WHERE is_active = TRUE
ORDER BY id;
