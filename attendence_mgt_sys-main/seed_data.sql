-- ========================================
-- SEED DATA FOR ATTENDANCE MANAGEMENT SYSTEM
-- ========================================
-- This script populates the database with sample data for testing
-- Run this in your Supabase SQL Editor after creating the schema

-- ========================================
-- 1. DEPARTMENTS
-- ========================================
INSERT INTO departments (id, name, code, hod_email) VALUES
('d1', 'Computer Science & Engineering', 'CSE', 'hod.cse@college.edu'),
('d2', 'Electronics & Communication', 'ECE', 'hod.ece@college.edu'),
('d3', 'Mechanical Engineering', 'ME', 'hod.me@college.edu')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 2. CLASSES
-- ========================================
INSERT INTO classes (id, department_id, name, year, section, coordinator_id) VALUES
('c1', 'd1', 'CSE 2nd Year A', 2, 'A', 't1'), -- Will link to teacher t1
('c2', 'd1', 'CSE 2nd Year B', 2, 'B', 't2'),
('c3', 'd1', 'CSE 3rd Year A', 3, 'A', 't1'),
('c4', 'd2', 'ECE 2nd Year A', 2, 'A', 't3')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 3. TEACHERS
-- ========================================
-- IMPORTANT: Replace 'user_xxx' with actual Clerk user IDs after creating accounts
-- You'll need to:
-- 1. Sign up 3 teacher accounts in Clerk
-- 2. Get their Clerk user IDs (starts with 'user_')
-- 3. Update these INSERT statements with the real IDs

INSERT INTO teachers (id, clerk_user_id, name, email, dob, phone_no, department_id, is_coordinator) VALUES
('t1', 'user_teacher1_REPLACE_ME', 'Dr. Rajesh Kumar', 'rajesh.kumar@college.edu', '1985-05-15', '+919876543210', 'd1', true),
('t2', 'user_teacher2_REPLACE_ME', 'Prof. Anita Shah', 'anita.shah@college.edu', '1988-08-22', '+919876543211', 'd1', true),
('t3', 'user_teacher3_REPLACE_ME', 'Dr. Suresh Reddy', 'suresh.reddy@college.edu', '1982-03-10', '+919876543212', 'd2', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 4. TEACHER-CLASS ASSIGNMENTS
-- ========================================
INSERT INTO teacher_classes (teacher_id, class_id, is_coordinator) VALUES
('t1', 'c1', true),
('t1', 'c3', true),
('t2', 'c2', true),
('t3', 'c4', true)
ON CONFLICT (teacher_id, class_id) DO NOTHING;

-- ========================================
-- 5. STUDENTS
-- ========================================
-- IMPORTANT: Replace 'user_xxx' with actual Clerk user IDs after creating accounts
-- For testing, create at least 2-3 student accounts in Clerk and update these

INSERT INTO students (id, clerk_user_id, regno, name, email, dob, blood_group, address, phone_no, parent_phone_no, year, department_id, class_id, is_dayscholar) VALUES
-- Students for CSE 2nd Year A (c1)
('s1', 'user_student1_REPLACE_ME', 'CS2024001', 'Amit Patel', 'amit.patel@student.edu', '2005-01-15', 'O+', '123 MG Road, Bangalore', '+919123456701', '+919123456801', 2, 'd1', 'c1', false),
('s2', 'user_student2_REPLACE_ME', 'CS2024002', 'Priya Sharma', 'priya.sharma@student.edu', '2005-03-22', 'A+', '456 Brigade Road, Bangalore', '+919123456702', '+919123456802', 2, 'd1', 'c1', true),
('s3', 'user_student3_REPLACE_ME', 'CS2024003', 'Rahul Verma', 'rahul.verma@student.edu', '2005-07-10', 'B+', '789 Indiranagar, Bangalore', '+919123456703', '+919123456803', 2, 'd1', 'c1', false),
('s4', 'user_student4_REPLACE_ME', 'CS2024004', 'Sneha Reddy', 'sneha.reddy@student.edu', '2005-09-18', 'AB+', '321 Koramangala, Bangalore', '+919123456704', '+919123456804', 2, 'd1', 'c1', true),

-- Students for CSE 2nd Year B (c2)
('s5', 'user_student5_REPLACE_ME', 'CS2024005', 'Karan Singh', 'karan.singh@student.edu', '2005-02-28', 'O-', '654 Whitefield, Bangalore', '+919123456705', '+919123456805', 2, 'd1', 'c2', false),
('s6', 'user_student6_REPLACE_ME', 'CS2024006', 'Anjali Nair', 'anjali.nair@student.edu', '2005-06-05', 'A-', '987 Jayanagar, Bangalore', '+919123456706', '+919123456806', 2, 'd1', 'c2', true),

-- Students for CSE 3rd Year A (c3)
('s7', 'user_student7_REPLACE_ME', 'CS2023001', 'Vikram Joshi', 'vikram.joshi@student.edu', '2004-04-12', 'B-', '111 HSR Layout, Bangalore', '+919123456707', '+919123456807', 3, 'd1', 'c3', false),
('s8', 'user_student8_REPLACE_ME', 'CS2023002', 'Divya Iyer', 'divya.iyer@student.edu', '2004-11-30', 'AB-', '222 BTM Layout, Bangalore', '+919123456708', '+919123456808', 3, 'd1', 'c3', true),

-- Students for ECE 2nd Year A (c4)
('s9', 'user_student9_REPLACE_ME', 'EC2024001', 'Arjun Menon', 'arjun.menon@student.edu', '2005-05-20', 'O+', '333 Electronic City, Bangalore', '+919123456709', '+919123456809', 2, 'd2', 'c4', false),
('s10', 'user_student10_REPLACE_ME', 'EC2024002', 'Meera Kapoor', 'meera.kapoor@student.edu', '2005-08-15', 'A+', '444 Silk Board, Bangalore', '+919123456710', '+919123456810', 2, 'd2', 'c4', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 6. ADMIN USERS
-- ========================================
-- IMPORTANT: Replace with actual Clerk user ID for admin account
INSERT INTO admin_users (id, clerk_user_id, email, name, department_id) VALUES
('a1', 'user_admin1_REPLACE_ME', 'admin@college.edu', 'System Administrator', 'd1')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 7. SAMPLE LEAVE FORMS
-- ========================================
-- Creating various leave applications with different statuses for testing

-- Pending leaves (awaiting approval)
INSERT INTO leave_forms (student_id, from_date, to_date, num_days, reason, status) VALUES
('s1', CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', 3, 'Family function to attend. Need to travel to hometown for cousin''s wedding ceremony.', 'pending'),
('s2', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 3, 'Medical appointment at city hospital. Doctor consultation scheduled for chronic condition follow-up.', 'pending'),
('s5', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', 2, 'Feeling unwell with fever and body ache. Need rest as advised by family doctor.', 'pending');

-- Approved leaves
INSERT INTO leave_forms (student_id, from_date, to_date, num_days, reason, status, coordinator_id, reviewed_at) VALUES
('s3', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '3 days', 3, 'Attended national level coding competition in Mumbai. Represented college at the event.', 'approved', 't1', CURRENT_DATE - INTERVAL '6 days'),
('s4', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '8 days', 3, 'Grandfather passed away. Had to attend funeral and last rites ceremony in native place.', 'approved', 't1', CURRENT_DATE - INTERVAL '11 days'),
('s6', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '2 days', 2, 'Sister''s wedding ceremony. Essential family event requiring my presence at home.', 'approved', 't2', CURRENT_DATE - INTERVAL '4 days');

-- Rejected leaves-- ========================================
-- SEED DATA FOR ATTENDANCE MANAGEMENT SYSTEM
-- ========================================
-- This script populates the database with sample data for testing
-- Run this in your Supabase SQL Editor after creating the schema

-- ========================================
-- 1. DEPARTMENTS
-- ========================================
INSERT INTO departments (id, name, code, hod_email) VALUES
('d1', 'Computer Science & Engineering', 'CSE', 'hod.cse@college.edu'),
('d2', 'Electronics & Communication', 'ECE', 'hod.ece@college.edu'),
('d3', 'Mechanical Engineering', 'ME', 'hod.me@college.edu')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 2. CLASSES
-- ========================================
INSERT INTO classes (id, department_id, name, year, section, coordinator_id) VALUES
('c1', 'd1', 'CSE 2nd Year A', 2, 'A', 't1'), -- Will link to teacher t1
('c2', 'd1', 'CSE 2nd Year B', 2, 'B', 't2'),
('c3', 'd1', 'CSE 3rd Year A', 3, 'A', 't1'),
('c4', 'd2', 'ECE 2nd Year A', 2, 'A', 't3')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 3. TEACHERS
-- ========================================
-- IMPORTANT: Replace 'user_xxx' with actual Clerk user IDs after creating accounts
-- You'll need to:
-- 1. Sign up 3 teacher accounts in Clerk
-- 2. Get their Clerk user IDs (starts with 'user_')
-- 3. Update these INSERT statements with the real IDs

INSERT INTO teachers (id, clerk_user_id, name, email, dob, phone_no, department_id, is_coordinator) VALUES
('t1', 'user_teacher1_REPLACE_ME', 'Dr. Rajesh Kumar', 'rajesh.kumar@college.edu', '1985-05-15', '+919876543210', 'd1', true),
('t2', 'user_teacher2_REPLACE_ME', 'Prof. Anita Shah', 'anita.shah@college.edu', '1988-08-22', '+919876543211', 'd1', true),
('t3', 'user_teacher3_REPLACE_ME', 'Dr. Suresh Reddy', 'suresh.reddy@college.edu', '1982-03-10', '+919876543212', 'd2', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 4. TEACHER-CLASS ASSIGNMENTS
-- ========================================
INSERT INTO teacher_classes (teacher_id, class_id, is_coordinator) VALUES
('t1', 'c1', true),
('t1', 'c3', true),
('t2', 'c2', true),
('t3', 'c4', true)
ON CONFLICT (teacher_id, class_id) DO NOTHING;

-- ========================================
-- 5. STUDENTS
-- ========================================
-- IMPORTANT: Replace 'user_xxx' with actual Clerk user IDs after creating accounts
-- For testing, create at least 2-3 student accounts in Clerk and update these

INSERT INTO students (id, clerk_user_id, regno, name, email, dob, blood_group, address, phone_no, parent_phone_no, year, department_id, class_id, is_dayscholar) VALUES
-- Students for CSE 2nd Year A (c1)
('s1', 'user_student1_REPLACE_ME', 'CS2024001', 'Amit Patel', 'amit.patel@student.edu', '2005-01-15', 'O+', '123 MG Road, Bangalore', '+919123456701', '+919123456801', 2, 'd1', 'c1', false),
('s2', 'user_student2_REPLACE_ME', 'CS2024002', 'Priya Sharma', 'priya.sharma@student.edu', '2005-03-22', 'A+', '456 Brigade Road, Bangalore', '+919123456702', '+919123456802', 2, 'd1', 'c1', true),
('s3', 'user_student3_REPLACE_ME', 'CS2024003', 'Rahul Verma', 'rahul.verma@student.edu', '2005-07-10', 'B+', '789 Indiranagar, Bangalore', '+919123456703', '+919123456803', 2, 'd1', 'c1', false),
('s4', 'user_student4_REPLACE_ME', 'CS2024004', 'Sneha Reddy', 'sneha.reddy@student.edu', '2005-09-18', 'AB+', '321 Koramangala, Bangalore', '+919123456704', '+919123456804', 2, 'd1', 'c1', true),

-- Students for CSE 2nd Year B (c2)
('s5', 'user_student5_REPLACE_ME', 'CS2024005', 'Karan Singh', 'karan.singh@student.edu', '2005-02-28', 'O-', '654 Whitefield, Bangalore', '+919123456705', '+919123456805', 2, 'd1', 'c2', false),
('s6', 'user_student6_REPLACE_ME', 'CS2024006', 'Anjali Nair', 'anjali.nair@student.edu', '2005-06-05', 'A-', '987 Jayanagar, Bangalore', '+919123456706', '+919123456806', 2, 'd1', 'c2', true),

-- Students for CSE 3rd Year A (c3)
('s7', 'user_student7_REPLACE_ME', 'CS2023001', 'Vikram Joshi', 'vikram.joshi@student.edu', '2004-04-12', 'B-', '111 HSR Layout, Bangalore', '+919123456707', '+919123456807', 3, 'd1', 'c3', false),
('s8', 'user_student8_REPLACE_ME', 'CS2023002', 'Divya Iyer', 'divya.iyer@student.edu', '2004-11-30', 'AB-', '222 BTM Layout, Bangalore', '+919123456708', '+919123456808', 3, 'd1', 'c3', true),

-- Students for ECE 2nd Year A (c4)
('s9', 'user_student9_REPLACE_ME', 'EC2024001', 'Arjun Menon', 'arjun.menon@student.edu', '2005-05-20', 'O+', '333 Electronic City, Bangalore', '+919123456709', '+919123456809', 2, 'd2', 'c4', false),
('s10', 'user_student10_REPLACE_ME', 'EC2024002', 'Meera Kapoor', 'meera.kapoor@student.edu', '2005-08-15', 'A+', '444 Silk Board, Bangalore', '+919123456710', '+919123456810', 2, 'd2', 'c4', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 6. ADMIN USERS
-- ========================================
-- IMPORTANT: Replace with actual Clerk user ID for admin account
INSERT INTO admin_users (id, clerk_user_id, email, name, department_id) VALUES
('a1', 'user_admin1_REPLACE_ME', 'admin@college.edu', 'System Administrator', 'd1')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 7. SAMPLE LEAVE FORMS
-- ========================================
-- Creating various leave applications with different statuses for testing

-- Pending leaves (awaiting approval)
INSERT INTO leave_forms (student_id, from_date, to_date, num_days, reason, status) VALUES
('s1', CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', 3, 'Family function to attend. Need to travel to hometown for cousin''s wedding ceremony.', 'pending'),
('s2', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 3, 'Medical appointment at city hospital. Doctor consultation scheduled for chronic condition follow-up.', 'pending'),
('s5', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', 2, 'Feeling unwell with fever and body ache. Need rest as advised by family doctor.', 'pending');

-- Approved leaves
INSERT INTO leave_forms (student_id, from_date, to_date, num_days, reason, status, coordinator_id, reviewed_at) VALUES
('s3', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '3 days', 3, 'Attended national level coding competition in Mumbai. Represented college at the event.', 'approved', 't1', CURRENT_DATE - INTERVAL '6 days'),
('s4', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '8 days', 3, 'Grandfather passed away. Had to attend funeral and last rites ceremony in native place.', 'approved', 't1', CURRENT_DATE - INTERVAL '11 days'),
('s6', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '2 days', 2, 'Sister''s wedding ceremony. Essential family event requiring my presence at home.', 'approved', 't2', CURRENT_DATE - INTERVAL '4 days');

-- Rejected leaves
INSERT INTO leave_forms (student_id, from_date, to_date, num_days, reason, status, coordinator_id, rejection_reason, reviewed_at) VALUES
('s7', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '5 days', 3, 'Want to go on a trip with friends to Goa for vacation and sightseeing.', 'rejected', 't1', 'Personal trips are not valid reasons for leave. Please refer to college leave policy which requires medical or family emergency reasons only.', CURRENT_DATE - INTERVAL '8 days'),
('s8', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE, 3, 'Feeling tired and want some rest from studies. Need a mental health break.', 'rejected', 't1', 'This period coincides with mid-term examinations. Leave cannot be granted during exam period except for medical emergencies with proper documentation.', CURRENT_DATE - INTERVAL '3 days');

-- More pending leaves for different dates (for comprehensive testing)
INSERT INTO leave_forms (student_id, from_date, to_date, num_days, reason, status) VALUES
('s9', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '7 days', 3, 'Participating in state level hackathon organized by IEEE. College approved participation.', 'pending'),
('s10', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '2 days', 1, 'Dental appointment for wisdom tooth extraction. Surgery scheduled at dental clinic.', 'pending');

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these to verify data was inserted correctly

-- Check departments
-- SELECT * FROM departments;

-- Check classes
-- SELECT * FROM classes;

-- Check teachers
-- SELECT * FROM teachers;

-- Check students
-- SELECT * FROM students ORDER BY class_id, regno;

-- Check leave forms with details
-- SELECT * FROM leave_forms_with_details ORDER BY created_at DESC;

-- Check pending leaves for today
-- SELECT * FROM leave_forms_with_details WHERE status = 'pending' AND from_date <= CURRENT_DATE AND to_date >= CURRENT_DATE;

-- ========================================
-- NOTES FOR SETUP
-- ========================================
/*
STEP-BY-STEP GUIDE TO USE THIS SEED DATA:

1. CREATE CLERK ACCOUNTS:
   - Sign up 3 teacher accounts in your Clerk dashboard
   - Sign up 5-10 student accounts
   - Sign up 1 admin account
   - Note down all their Clerk user IDs (start with 'user_...')

2. UPDATE THIS FILE:
   - Replace all 'user_teacher1_REPLACE_ME', 'user_student1_REPLACE_ME', etc. 
     with actual Clerk user IDs from step 1

3. RUN IN SUPABASE:
   - Open your Supabase project
   - Go to SQL Editor
   - Copy and paste this entire file
   - Click "Run" to execute

4. VERIFY DATA:
   - Uncomment and run the verification queries at the bottom
   - Check that all records were created

5. TEST THE APPLICATION:
   - Sign in with a student account → See dashboard with leave stats
   - Apply for leave → Should appear in pending list
   - Sign in with teacher account → See pending leaves to approve
   - Sign in with admin account → See system statistics

TROUBLESHOOTING:
- If you get "duplicate key" errors, data already exists (safe to ignore)
- If foreign key errors occur, check that parent records exist first
- Make sure you've run database_schema.sql before this seed data script
*/

-- ========================================
-- QUICK START FOR TESTING (SIMPLIFIED)
-- ========================================
-- If you just want to test quickly without Clerk integration:
-- 1. Comment out the clerk_user_id requirements in your schema
-- 2. Or use dummy values like 'test_user_1', 'test_user_2', etc.
-- 3. This is NOT recommended for production but OK for initial testing

INSERT INTO leave_forms (student_id, from_date, to_date, num_days, reason, status, coordinator_id, rejection_reason, reviewed_at) VALUES
('s7', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '5 days', 3, 'Want to go on a trip with friends to Goa for vacation and sightseeing.', 'rejected', 't1', 'Personal trips are not valid reasons for leave. Please refer to college leave policy which requires medical or family emergency reasons only.', CURRENT_DATE - INTERVAL '8 days'),
('s8', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE, 3, 'Feeling tired and want some rest from studies. Need a mental health break.', 'rejected', 't1', 'This period coincides with mid-term examinations. Leave cannot be granted during exam period except for medical emergencies with proper documentation.', CURRENT_DATE - INTERVAL '3 days');

-- More pending leaves for different dates (for comprehensive testing)
INSERT INTO leave_forms (student_id, from_date, to_date, num_days, reason, status) VALUES
('s9', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '7 days', 3, 'Participating in state level hackathon organized by IEEE. College approved participation.', 'pending'),
('s10', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '2 days', 1, 'Dental appointment for wisdom tooth extraction. Surgery scheduled at dental clinic.', 'pending');

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these to verify data was inserted correctly

-- Check departments
-- SELECT * FROM departments;

-- Check classes
-- SELECT * FROM classes;

-- Check teachers
-- SELECT * FROM teachers;

-- Check students
-- SELECT * FROM students ORDER BY class_id, regno;

-- Check leave forms with details
-- SELECT * FROM leave_forms_with_details ORDER BY created_at DESC;

-- Check pending leaves for today
-- SELECT * FROM leave_forms_with_details WHERE status = 'pending' AND from_date <= CURRENT_DATE AND to_date >= CURRENT_DATE;

-- ========================================
-- NOTES FOR SETUP
-- ========================================
/*
STEP-BY-STEP GUIDE TO USE THIS SEED DATA:

1. CREATE CLERK ACCOUNTS:
   - Sign up 3 teacher accounts in your Clerk dashboard
   - Sign up 5-10 student accounts
   - Sign up 1 admin account
   - Note down all their Clerk user IDs (start with 'user_...')

2. UPDATE THIS FILE:
   - Replace all 'user_teacher1_REPLACE_ME', 'user_student1_REPLACE_ME', etc. 
     with actual Clerk user IDs from step 1

3. RUN IN SUPABASE:
   - Open your Supabase project
   - Go to SQL Editor
   - Copy and paste this entire file
   - Click "Run" to execute

4. VERIFY DATA:
   - Uncomment and run the verification queries at the bottom
   - Check that all records were created

5. TEST THE APPLICATION:
   - Sign in with a student account → See dashboard with leave stats
   - Apply for leave → Should appear in pending list
   - Sign in with teacher account → See pending leaves to approve
   - Sign in with admin account → See system statistics

TROUBLESHOOTING:
- If you get "duplicate key" errors, data already exists (safe to ignore)
- If foreign key errors occur, check that parent records exist first
- Make sure you've run database_schema.sql before this seed data script
*/

-- ========================================
-- QUICK START FOR TESTING (SIMPLIFIED)
-- ========================================
-- If you just want to test quickly without Clerk integration:
-- 1. Comment out the clerk_user_id requirements in your schema
-- 2. Or use dummy values like 'test_user_1', 'test_user_2', etc.
-- 3. This is NOT recommended for production but OK for initial testing
