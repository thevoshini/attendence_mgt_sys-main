# Troubleshooting Access Issues

## Problem: Logged in but can't access any pages

If you're experiencing access issues where all pages (student, teacher, admin) are showing blank or "Access Denied", follow these steps:

---

## Step 1: Verify You're Actually Signed In

1. **Open the app**: http://localhost:5174
2. **Open Browser Console**: Press F12 or Right-click → Inspect → Console
3. **Check Sign-In State**:
   - Look for `[useUserRole]` log messages
   - You should see your Clerk User ID and email

**If you DON'T see these logs:**
- You're NOT actually signed in
- Click "Sign In" button and complete authentication
- Try signing out and back in

---

## Step 2: Check Console Logs for Role Detection

After signing in, the console should show:

### ✅ Successful Role Detection:
```
[useUserRole] Checking role for user: user_2abc123... admin@test.com
[useUserRole] ✅ Found admin: System Administrator admin@test.com
```

OR

```
[useUserRole] ✅ Found student: John Doe CS2024001
```

### ⚠️ Problem - User Not in Database:
```
[useUserRole] ⚠️ User authenticated in Clerk but not found in database
[useUserRole] Clerk User ID: user_2abc123xyz456
[useUserRole] Email: admin@test.com
```

**This means:** You're signed into Clerk but your record doesn't exist in Supabase!

---

## Step 3: Fix "User Not Found in Database"

If you see the warning above, you need to add your user to the database:

### For Admin Users:

1. **Copy your Clerk User ID** from the console logs
2. **Open Supabase** → SQL Editor
3. **Run this query** (replace with your actual values):

```sql
INSERT INTO admin_users (id, clerk_user_id, email, name, department_id, is_active)
VALUES (
  'a1',                          -- Admin ID
  'user_2abc123xyz456',          -- YOUR Clerk User ID from console
  'admin@test.com',              -- Email (must match Clerk email)
  'System Administrator',
  'd1',                          -- Department ID (make sure it exists)
  true
);
```

4. **Refresh the page** in your browser
5. **Check console again** - should now show "✅ Found admin"

### For Student Users:

```sql
INSERT INTO students (
  id, clerk_user_id, regno, name, email, dob, 
  parent_phone_no, year, department_id, class_id, 
  is_dayscholar, is_active
)
VALUES (
  's1',                          -- Student ID
  'user_YOUR_CLERK_ID',          -- YOUR Clerk User ID from console
  'CS2024001',                   -- Registration number
  'Test Student',
  'student@test.com',           -- Email (must match Clerk email)
  '2005-01-15',
  '+919123456789',
  2,
  'd1',                          -- Department ID
  'c1',                          -- Class ID (make sure it exists)
  false,
  true
);
```

### For Teacher Users:

```sql
INSERT INTO teachers (
  id, clerk_user_id, name, email, dob, phone_no,
  department_id, is_coordinator, is_active
)
VALUES (
  't1',                          -- Teacher ID
  'user_YOUR_CLERK_ID',          -- YOUR Clerk User ID from console
  'Test Teacher',
  'teacher@test.com',           -- Email (must match Clerk email)
  '1985-05-15',
  '+919876543210',
  'd1',                          -- Department ID
  true,
  true
);

-- Also assign teacher to a class:
INSERT INTO teacher_classes (teacher_id, class_id, is_coordinator)
VALUES ('t1', 'c1', true);
```

---

## Step 4: Verify the Fix

1. **Refresh the page** (F5)
2. **Check console logs** - should show "✅ Found [role]"
3. **You should now see the appropriate dashboard**

---

## Common Issues & Solutions

### Issue: "Error checking [student/teacher/admin]"

**Check Supabase Connection:**
1. Verify `.env.local` has correct Supabase URL and key
2. Test connection in console:
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

### Issue: Email mismatch

**Symptom:** Query runs but no data found

**Solution:** Make sure the email in Clerk EXACTLY matches the email in your database:
```sql
-- Check what's in database:
SELECT * FROM admin_users WHERE email = 'admin@test.com';

-- Check Clerk console logs for actual email being used
```

### Issue: is_active is false

**Symptom:** User found but still can't access

**Solution:**
```sql
-- Fix inactive users:
UPDATE admin_users SET is_active = true WHERE clerk_user_id = 'user_YOUR_ID';
UPDATE students SET is_active = true WHERE clerk_user_id = 'user_YOUR_ID';
UPDATE teachers SET is_active = true WHERE clerk_user_id = 'user_YOUR_ID';
```

### Issue: Department or Class doesn't exist

**Symptom:** Foreign key constraint error when inserting

**Solution:** Create the department/class first:
```sql
-- Check existing departments:
SELECT * FROM departments;

-- If empty, add them:
INSERT INTO departments (id, name, code, hod_email, is_active) VALUES
('d1', 'Computer Science & Engineering', 'CSE', 'hod@college.edu', true);

-- Check existing classes:
SELECT * FROM classes;

-- If empty, add one:
INSERT INTO classes (id, department_id, name, year, section, coordinator_id, is_active) VALUES
('c1', 'd1', 'CSE 2nd Year A', 2, 'A', NULL, true);
```

---

## Quick Debugging Checklist

1. [ ] Browser console open (F12)
2. [ ] Signed into Clerk (check top-right for user info)
3. [ ] See `[useUserRole]` log messages
4. [ ] Clerk User ID matches database record
5. [ ] Email in Clerk matches email in database
6. [ ] `is_active = true` in database
7. [ ] Department exists (for students/teachers)
8. [ ] Class exists (for students)
9. [ ] Page refreshed after adding database record

---

## Still Having Issues?

### Get Your Current State:

Open browser console and run:

```javascript
// Get Clerk user info
console.log('Clerk User:', window.Clerk?.user);

// Test Supabase connection
const { createClient } = await import('./src/lib/supabase.ts');
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Check if you exist in database
const userId = window.Clerk?.user?.id;
console.log('Checking user:', userId);

const { data: studentData } = await supabase
  .from('students')
  .select('*')
  .eq('clerk_user_id', userId);
console.log('Student record:', studentData);

const { data: teacherData } = await supabase
  .from('teachers')
  .select('*')
  .eq('clerk_user_id', userId);
console.log('Teacher record:', teacherData);

const { data: adminData } = await supabase
  .from('admin_users')
  .select('*')
  .eq('clerk_user_id', userId);
console.log('Admin record:', adminData);
```

This will show exactly what's in your database and help identify the issue!

---

## The Most Common Fix

**90% of the time, the issue is:**

1. You created a Clerk account
2. But forgot to add it to the Supabase database
3. **Solution:** Add the INSERT statement with your Clerk User ID!

Remember: **Clerk handles authentication** (login), **Supabase holds your role data** (student/teacher/admin). Both must match!
