# 🚀 QUICK START - Add Sample Data

## Option 1: Full Setup with Clerk (Recommended)

### Step 1: Create Clerk Test Accounts
1. Go to https://dashboard.clerk.com → Your Project → Users
2. Create accounts:
   - **3 teachers**: teacher1@test.com, teacher2@test.com, teacher3@test.com
   - **5 students**: student1@test.com ... student5@test.com
   - **1 admin**: admin@test.com

3. **Get Clerk User IDs:**
   - Click each user → Copy their User ID (e.g., `user_2abc123...`)

### Step 2: Update seed_data.sql
```sql
-- Replace THIS:
'user_teacher1_REPLACE_ME'

-- With YOUR Clerk ID:
'user_2abc123xyz456'
```

### Step 3: Run in Supabase
1. Open Supabase → SQL Editor
2. Copy entire `seed_data.sql`
3. Paste and click "Run"
4. ✅ Should see: "Success. No rows returned"

---

## Option 2: Quick Test (No Clerk Setup)

If you just want to test quickly WITHOUT setting up Clerk accounts:

### Step 1: Modify seed_data.sql
Change all Clerk IDs to simple test values:

```sql
-- Teachers
('t1', 'test_teacher_1', 'Dr. Rajesh Kumar', ...),
('t2', 'test_teacher_2', 'Prof. Anita Shah', ...),
('t3', 'test_teacher_3', 'Dr. Suresh Reddy', ...),

-- Students  
('s1', 'test_student_1', 'CS2024001', 'Amit Patel', ...),
('s2', 'test_student_2', 'CS2024002', 'Priya Sharma', ...),
-- etc.
```

### Step 2: Run in Supabase
Same as Option 1, Step 3

### ⚠️ Limitation
You won't be able to sign in because there are no matching Clerk accounts. But you can:
- View the data in Supabase tables
- Test the database structure
- Verify queries work

---

## Verify Data

Run these queries in Supabase SQL Editor:

```sql
-- Check everything was created
SELECT 'Departments' as table_name, COUNT(*) as count FROM departments
UNION ALL
SELECT 'Classes', COUNT(*) FROM classes
UNION ALL  
SELECT 'Teachers', COUNT(*) FROM teachers
UNION ALL
SELECT 'Students', COUNT(*) FROM students
UNION ALL
SELECT 'Leave Forms', COUNT(*) FROM leave_forms;
```

Expected result:
```
Departments  | 3
Classes      | 4
Teachers     | 3
Students     | 10
Leave Forms  | 10
```

---

## Start Testing

Once data is loaded:

1. **Start the app**: `npm run dev`
2. **Go to**: http://localhost:5174
3. **Sign in** with one of your test accounts
4. **Test features**:
   - Student: Apply for leave, view history
   - Teacher: Approve/reject leaves
   - Admin: View statistics

**Demo OTP Code:** `123456` (for all verifications)

---

## Files Created

- `seed_data.sql` - Database seed script
- `TESTING_GUIDE.md` - Complete testing instructions
- `QUICK_START.md` - This file

✅ Everything is ready for testing!
