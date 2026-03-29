-- Add your admin account to the database
-- Run this in Supabase SQL Editor

-- Step 1: Make sure departments exist
INSERT INTO departments (id, name, code, hod_email, is_active) VALUES
('d1', 'Computer Science & Engineering', 'CSE', 'hod@college.edu', true)
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- Step 2: Add your admin account
INSERT INTO admin_users (
  id, 
  clerk_user_id, 
  email, 
  name, 
  department_id, 
  is_active
) VALUES (
  'admin_sanjay',                              -- Unique admin ID
  'user_39CmVKHpx14Cn0L68GmN7E3mmed',         -- Your Clerk User ID
  'sanjaisk83@gmail.com',                      -- Your email (must match Clerk)
  'Sanjay Kumar',                              -- Your name
  'd1',                                        -- CSE department
  true                                         -- Active account
)
ON CONFLICT (clerk_user_id) 
DO UPDATE SET 
  is_active = true,
  email = EXCLUDED.email;

-- Step 3: Verify it was created
SELECT * FROM admin_users WHERE clerk_user_id = 'user_39CmVKHpx14Cn0L68GmN7E3mmed';
