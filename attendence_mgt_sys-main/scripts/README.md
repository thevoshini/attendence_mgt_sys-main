# Bulk User Creation Scripts

## Overview

This directory contains scripts to bulk-create users in Clerk and add them to Supabase.

## Prerequisites

1. **Install Clerk Node SDK:**
   ```bash
   npm install @clerk/clerk-sdk-node
   ```

2. **Get your Clerk Secret Key:**
   - Go to: https://dashboard.clerk.com
   - Navigate to: Your Project → API Keys
   - Copy the "Secret Key" (starts with `sk_test_...`)

3. **Set Environment Variable:**
   ```bash
   export CLERK_SECRET_KEY="sk_test_your_secret_key_here"
   ```
   
   OR add to `.env.local`:
   ```
   CLERK_SECRET_KEY=sk_test_your_secret_key_here
   ```

## Usage

### Step 1: Create Users in Clerk

Run the script:

```bash
node scripts/create-clerk-users.js
```

**What it does:**
- Creates 3 teachers (teacher1@mailinator.com - teacher3@mailinator.com)
- Creates 10 students (student1@mailinator.com - student10@mailinator.com)
- Creates 1 admin (admin@mailinator.com)
- Passwords: `Teacher@123`, `Student@123`, `Admin@123`

**Output:**
```
✅ Created teacher1: user_2abc123... (teacher1@mailinator.com)
✅ Created teacher2: user_2def456... (teacher2@mailinator.com)
...
```

The script will also automatically generate a SQL file with all the Clerk User IDs.

### Step 2: Add Users to Supabase

After the script completes, you'll see a SQL script in the output AND saved to:
```
generated_supabase_inserts.sql
```

**To apply:**
1. Open Supabase Dashboard → SQL Editor
2. Copy the contents of `generated_supabase_inserts.sql`
3. Paste and click "Run"
4. Verify with the verification query at the end

### Step 3: Test Login

Try logging in with any of the created accounts:

**Teachers:**
- Email: `teacher1@mailinator.com`
- Password: `Teacher@123`
- Dashboard: `/teacher`

**Students:**
- Email: `student1@mailinator.com`
- Password: `Student@123`
- Dashboard: `/student`

**Admin:**
- Email: `admin@mailinator.com`
- Password: `Admin@123`
- Dashboard: `/admin`

## What Gets Created

### Teachers (3 total)
- `t1` - Teacher 1 - Coordinator of Class c1
- `t2` - Teacher 2 - Coordinator of Class c2  
- `t3` - Teacher 3 - Regular teacher

### Students (10 total)
- `s1-s5` - CSE 2nd Year A (Class c1)
  - Mix of day scholars and hostellers
- `s6-s10` - CSE 3rd Year A (Class c3)
  - Mix of day scholars and hostellers

### Admin (1 total)
- `a1` - System Administrator

## Troubleshooting

### Error: "CLERK_SECRET_KEY is not defined"
**Solution:** Set the environment variable before running the script

### Error: "Email address is already in use"
**Solution:** Users already exist in Clerk. You can either:
1. Delete them from Clerk dashboard and re-run
2. Skip the Clerk creation and just run the SQL with existing user IDs

### Error: "Foreign key constraint" in SQL
**Solution:** Make sure departments and classes exist:
```sql
-- Run this first in Supabase:
INSERT INTO departments (id, name, code, hod_email, is_active) VALUES
('d1', 'Computer Science & Engineering', 'CSE', 'hod@cse.edu', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO classes (id, department_id, name, year, section, is_active) VALUES
('c1', 'd1', 'CSE 2nd Year A', 2, 'A', true),
('c3', 'd1', 'CSE 3rd Year A', 3, 'A', true)
ON CONFLICT (id) DO NOTHING;
```

## Files

- `create-clerk-users.js` - Main script to create users in Clerk
- `generated_supabase_inserts.sql` - Auto-generated SQL (created after running script)
- `README.md` - This file

## Next Steps

After creating all users:
1. Test login with each role
2. Use seed_data.sql to add sample leave applications
3. Test the full workflow (student applies, teacher approves)

## Notes

- All passwords are set to role-based defaults for testing
- Emails use mailinator.com (temp email service) for testing
- Change passwords and emails for production use
- The script is idempotent - you can re-run it and it will skip existing users
