# Database Setup Instructions

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `dckktthehiwrfjflydaq`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

## Step 2: Run the Database Schema

1. Open the file [`database_schema.sql`](file:///mnt/FLAME/attendence_mgt_sys/database_schema.sql)
2. Copy the entire SQL script
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl/Cmd + Enter)

The script will create:
- ✅ 8 database tables (departments, classes, students, teachers, etc.)
- ✅ All foreign key relationships
- ✅ Indexes for performance
- ✅ Triggers for automatic timestamp updates
- ✅ Row Level Security (RLS) policies
- ✅ Helpful views for queries

## Step 3: Verify Tables Were Created

After running the script, check the **Table Editor** in Supabase:
- You should see 8 new tables
- Check that the `departments` table exists
- Verify indexes were created

## Step 4: Insert Your Department Data

Run this SQL to create your department:

```sql
-- Insert your department
INSERT INTO departments (name, code, hod_email) VALUES
  ('Computer Science and Engineering', 'CSE', 'your_hod_email@example.com');

-- Verify it was created
SELECT * FROM departments;
```

Replace `'your_hod_email@example.com'` with the actual HOD email.

## Step 5: Test the Setup

Run these queries to verify everything works:

```sql
-- Check all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check views
SELECT viewname FROM pg_views WHERE schemaname = 'public';

-- Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

## What's Next?

Once the database is set up, we'll:
1. ✅ Create API functions to interact with the database
2. ✅ Build the student registration flow
3. ✅ Implement teacher/admin creation
4. ✅ Create leave application functionality
5. ✅ Build approval workflows

## Troubleshooting

**If you get an error:**
- Make sure you're in your correct Supabase project
- Check that tables don't already exist (drop them if needed)
- Ensure you have proper permissions

**To start fresh:**
```sql
-- Drop all tables (CAUTION: This deletes all data!)
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS otp_verifications CASCADE;
DROP TABLE IF EXISTS leave_forms CASCADE;
DROP TABLE IF EXISTS teacher_classes CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Then run the schema script again
```

## Need Help?

Let me know if you encounter any issues, and I'll help you resolve them!
