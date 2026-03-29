-- ========================================
-- COMPLETE DATABASE SETUP - RUN THIS FIRST
-- ========================================
-- This file sets up everything needed for the attendance management system
-- Run this ENTIRE file in Supabase SQL Editor

-- ========================================
-- STEP 1: DEPARTMENTS (Required first)
-- ========================================
INSERT INTO departments (id, name, code, hod_email, is_active) VALUES
('d1', 'Computer Science & Engineering', 'CSE', 'hod.cse@college.edu', true),
('d2', 'Electronics & Communication', 'ECE', 'hod.ece@college.edu', true),
('d3', 'Mechanical Engineering', 'ME', 'hod.me@college.edu', true)
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- ========================================
-- STEP 2: CLASSES (Required before students/teachers)
-- ========================================
INSERT INTO classes (id, department_id, name, year, section, is_active) VALUES
('c1', 'd1', 'CSE 2nd Year A', 2, 'A', true),
('c2', 'd1', 'CSE 2nd Year B', 2, 'B', true),
('c3', 'd1', 'CSE 3rd Year A', 3, 'A', true),
('c4', 'd2', 'ECEE 2nd Year A', 2, 'A', true)
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- ========================================
-- STEP 3: TEACHERS
-- ========================================
INSERT INTO teachers (id, clerk_user_id, name, email, dob, phone_no, department_id, is_coordinator, is_active) VALUES
('t1', 'user_39ODCT21dMtmNF8QArXgPshdIkM', 'Teacher 1', 'teacher1@mailinator.com', '1985-01-15', '+919123456711', 'd1', true, true),
('t2', 'user_39ODChrUyVdL6EAWR8iTMs5vVeO', 'Teacher 2', 'teacher2@mailinator.com', '1985-01-15', '+919123456712', 'd1', true, true),
('t3', 'user_39ODCjshkt4Bu3tOT5ckUiXtwxo', 'Teacher 3', 'teacher3@mailinator.com', '1985-01-15', '+919123456713', 'd1', false, true)
ON CONFLICT (id) DO UPDATE SET 
  clerk_user_id = EXCLUDED.clerk_user_id,
  is_active = true;

-- ========================================
-- STEP 4: TEACHER-CLASS ASSIGNMENTS (CRITICAL!)
-- ========================================
-- This is what was missing! Teachers need to be assigned to classes
INSERT INTO teacher_classes (teacher_id, class_id, is_coordinator) VALUES
('t1', 'c1', true),  -- Teacher 1 coordinates class c1
('t1', 'c3', true),  -- Teacher 1 also coordinates class c3
('t2', 'c2', true),  -- Teacher 2 coordinates class c2
('t3', 'c1', false)  -- Teacher 3 assists in class c1
ON CONFLICT (teacher_id, class_id) DO UPDATE SET 
  is_coordinator = EXCLUDED.is_coordinator;

-- ========================================
-- STEP 5: STUDENTS
-- ========================================
INSERT INTO students (id, clerk_user_id, regno, name, email, dob, blood_group, address, phone_no, parent_phone_no, year, department_id, class_id, is_dayscholar, is_active) VALUES
-- Class c1 students (Teacher 1's class)
('s1', 'user_39ODCuK0X3yiSOdBWNiOUeiVdZm', 'CS2024001', 'Student 1', 'student1@mailinator.com', '2005-01-11', 'O+', '1 College Road, Bangalore', '+919123456811', '+919876543211', 2, 'd1', 'c1', false, true),
('s2', 'user_39ODCwseQ1g4a8gZJXXTnzrStJc', 'CS2024002', 'Student 2', 'student2@mailinator.com', '2005-01-12', 'O+', '2 College Road, Bangalore', '+919123456812', '+919876543212', 2, 'd1', 'c1', true, true),
('s3', 'user_39ODD6qv23yXLovAyX9z9ubzjBx', 'CS2024003', 'Student 3', 'student3@mailinator.com', '2005-01-13', 'O+', '3 College Road, Bangalore', '+919123456813', '+919876543213', 2, 'd1', 'c1', false, true),
('s4', 'user_39ODDDaAK4Ku1SwSR6s37bGaJdX', 'CS2024004', 'Student 4', 'student4@mailinator.com', '2005-01-14', 'O+', '4 College Road, Bangalore', '+919123456814', '+919876543214', 2, 'd1', 'c1', true, true),
('s5', 'user_39ODDALKsytFhjTyXTJttPF7SMh', 'CS2024005', 'Student 5', 'student5@mailinator.com', '2005-01-15', 'O+', '5 College Road, Bangalore', '+919123456815', '+919876543215', 2, 'd1', 'c1', false, true),
-- Class c3 students (Teacher 1's other class)
('s6', 'user_39ODDIInuRufHrfR95lqeSPv2Je', 'CS2024006', 'Student 6', 'student6@mailinator.com', '2005-01-16', 'O+', '6 College Road, Bangalore', '+919123456816', '+919876543216', 3, 'd1', 'c3', true, true),
('s7', 'user_39ODDX2aHqrdCohtiRPEUe9BLOn', 'CS2024007', 'Student 7', 'student7@mailinator.com', '2005-01-17', 'O+', '7 College Road, Bangalore', '+919123456817', '+919876543217', 3, 'd1', 'c3', false, true),
('s8', 'user_39ODDmFqk8yAeeAEGmmhQ3D0QlN', 'CS2024008', 'Student 8', 'student8@mailinator.com', '2005-01-18', 'O+', '8 College Road, Bangalore', '+919123456818', '+919876543218', 3, 'd1', 'c3', true, true),
('s9', 'user_39ODDwi8PEfwbnRneGOmeNgpCrx', 'CS2024009', 'Student 9', 'student9@mailinator.com', '2005-01-19', 'O+', '9 College Road, Bangalore', '+919123456819', '+919876543219', 3, 'd1', 'c3', false, true),
('s10', 'user_39ODF05TZeDnxfVAQItcAASKLqW', 'CS20240010', 'Student 10', 'student10@mailinator.com', '2005-01-20', 'O+', '10 College Road, Bangalore', '+919123456820', '+919876543220', 3, 'd1', 'c3', true, true)
ON CONFLICT (id) DO UPDATE SET
  clerk_user_id = EXCLUDED.clerk_user_id,
  is_active = true;

-- ========================================
-- STEP 6: ADMIN
-- ========================================
INSERT INTO admin_users (id, clerk_user_id, email, name, department_id, is_active) VALUES
('a1', 'user_39ODOGcbFc0vrbjHM6PsFgMaOvb', 'sanjaisk83@gmail.com', 'System Administrator', 'd1', true)
ON CONFLICT (id) DO UPDATE SET
  clerk_user_id = EXCLUDED.clerk_user_id,
  is_active = true;

-- ========================================
-- STEP 7: SAMPLE LEAVE FORMS (Optional - for testing)
-- ========================================
-- Pending leaves
INSERT INTO leave_forms (student_id, from_date, to_date, num_days, reason, status) VALUES
('s1', CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', 3, 'Family function - cousin wedding ceremony', 'pending'),
('s2', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 3, 'Medical appointment at city hospital', 'pending'),
('s6', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', 2, 'Feeling unwell with fever and body ache', 'pending')
ON CONFLICT DO NOTHING;

-- Approved leaves (for history)
INSERT INTO leave_forms (student_id, from_date, to_date, num_days, reason, status, coordinator_id, reviewed_at) VALUES
('s3', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '3 days', 3, 'Attended national coding competition', 'approved', 't1', CURRENT_DATE - INTERVAL '6 days'),
('s7', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '8 days', 3, 'Family emergency - grandfather hospitalized', 'approved', 't1', CURRENT_DATE - INTERVAL '11 days')
ON CONFLICT DO NOTHING;

-- Rejected leaves (for history)
INSERT INTO leave_forms (student_id, from_date, to_date, num_days, reason, status, coordinator_id, rejection_reason, reviewed_at) VALUES
('s4', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '5 days', 3, 'Planning trip with friends', 'rejected', 't1', 'Personal trips are not valid leave reasons', CURRENT_DATE - INTERVAL '8 days')
ON CONFLICT DO NOTHING;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these to verify everything was created correctly

-- Check all tables
SELECT 'Departments' as table_name, COUNT(*) as count FROM departments WHERE is_active = true
UNION ALL
SELECT 'Classes', COUNT(*) FROM classes WHERE is_active = true
UNION ALL
SELECT 'Teachers', COUNT(*) FROM teachers WHERE is_active = true
UNION ALL
SELECT 'Students', COUNT(*) FROM students WHERE is_active = true
UNION ALL
SELECT 'Admins', COUNT(*) FROM admin_users WHERE is_active = true
UNION ALL
SELECT 'Teacher-Class Links', COUNT(*) FROM teacher_classes
UNION ALL
SELECT 'Leave Forms', COUNT(*) FROM leave_forms;

-- Check teacher-class assignments (IMPORTANT!)
SELECT 
  t.name as teacher_name,
  t.email,
  c.name as class_name,
  tc.is_coordinator,
  (SELECT COUNT(*) FROM students WHERE class_id = c.id AND is_active = true) as student_count
FROM teacher_classes tc
JOIN teachers t ON t.id = tc.teacher_id
JOIN classes c ON c.id = tc.class_id
ORDER BY t.name, c.name;

-- Expected results:
-- Departments: 3
-- Classes: 4
-- Teachers: 3
-- Students: 10
-- Admins: 1
-- Teacher-Class Links: 4 (MUST show 4 rows!)
-- Leave Forms: 6

-- ========================================
-- TROUBLESHOOTING
-- ========================================
/*
IF TEACHER DASHBOARD SHOWS 0 CLASSES:
- Check the teacher-class assignments query above
- Should show 4 rows with Teacher 1, Teacher 2, and Teacher 3
- If empty, the teacher_classes INSERT failed

IF ADMIN CAN'T ACCESS PAGES:
- Make sure admin_users INSERT succeeded
- Check: SELECT * FROM admin_users WHERE clerk_user_id = 'user_39ODOGcbFc0vrbjHM6PsFgMaOvb';
- Should return 1 row

IF GETTING PERMISSION ERRORS:
- RLS policies might be blocking
- Check your Supabase RLS settings
*/
