# Admin Login & Teacher Management Guide

## 🔐 How to Login as Admin

### Step 1: Create Admin Account in Clerk

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com
2. **Navigate to**: Your Project → Users
3. **Click**: "+ Create user"
4. **Fill in details:**
   - **Email**: admin@test.com (or your preferred email)
   - **Password**: Set a secure password
5. **Click**: "Create"
6. **Copy the User ID**: It starts with `user_...` (e.g., `user_2abc123xyz456`)

### Step 2: Add Admin Record to Database

1. **Open Supabase**: Go to your project SQL Editor
2. **Run this query** (replace with your Clerk User ID):

```sql
INSERT INTO admin_users (id, clerk_user_id, email, name, department_id)
VALUES (
  'a1',
  'user_YOUR_CLERK_ID_HERE',  -- Replace with actual Clerk ID
  'admin@test.com',            -- Must match Clerk email
  'System Administrator',
  'd1'                         -- CSE department (or use your dept ID)
)
ON CONFLICT (id) DO NOTHING;
```

3. **Verify** it was created:
```sql
SELECT * FROM admin_users;
```

### Step 3: Login to Application

1. **Go to**: http://localhost:5174
2. **Click**: "Sign In"  
3. **Enter**: Your admin email and password
4. **You'll be redirected to**: `/admin` dashboard

---

## 👨‍🏫 How to Add Teachers as Admin

Once logged in as admin, you have **TWO methods** to add teachers:

### Method 1: Using the Admin UI (Recommended) ✨

1. **Navigate to Teachers**:
   - From admin dashboard, click "Manage Teachers" card
   - OR click "Teachers" in the top navigation

2. **Click "+ Add Teacher" button**

3. **Fill in the form:**

   **Required Fields:**
   - **Full Name**: e.g., "Dr. Rajesh Kumar"
   - **Email**: e.g., "rajesh.kumar@college.edu"
   - **Date of Birth**: Select from calendar
   - **Department**: Choose from dropdown (CSE, ECE, ME, etc.)
   - **Clerk User ID**: Get this from Clerk (see below)

   **Optional Fields:**
   - **Phone Number**: e.g., "+919876543210"
   - **Is Coordinator**: Check if this teacher will coordinate a class

4. **Get Clerk User ID:**
   - Before adding the teacher in your app, first create their account in Clerk
   - Go to Clerk Dashboard → Users → Create user
   - Create account with teacher's email
   - Copy their Clerk User ID (starts with `user_...`)
   - Paste it into the "Clerk User ID" field in your form

5. **Click "Add Teacher"**

6. **Success!** Teacher is now in the system

---

### Method 2: Direct SQL Insert (For bulk import)

If you need to add multiple teachers quickly:

```sql
-- First, create their Clerk accounts, then run this:

INSERT INTO teachers (id, clerk_user_id, name, email, dob, phone_no, department_id, is_coordinator) VALUES
('t1', 'user_CLERK_ID_1', 'Dr. Rajesh Kumar', 'rajesh@college.edu', '1985-05-15', '+919876543210', 'd1', true),
('t2', 'user_CLERK_ID_2', 'Prof. Anita Shah', 'anita@college.edu', '1988-08-22', '+919876543211', 'd1', true),
('t3', 'user_CLERK_ID_3', 'Dr. Suresh Reddy', 'suresh@college.edu', '1982-03-10', '+919876543212', 'd2', true)
ON CONFLICT (id) DO NOTHING;
```

---

## 📋 Complete Workflow: Admin Adds a Teacher

### Scenario: Adding "Dr. John Doe" as a CSE Teacher

**Step 1: Create Clerk Account**
1. Clerk Dashboard → Users → Create user
2. Email: john.doe@college.edu
3. Password: (teacher will change this later)
4. Copy User ID: `user_2xyz789abc123`

**Step 2: Add via Admin UI**
1. Login as admin (admin@test.com)
2. Go to `/admin/teachers`
3. Click "+ Add Teacher"
4. Fill form:
   ```
   Name: Dr. John Doe
   Email: john.doe@college.edu
   DOB: 1990-06-15
   Phone: +919123456789
   Department: Computer Science & Engineering
   Clerk User ID: user_2xyz789abc123
   Is Coordinator: ✓ (checked)
   ```
5. Click "Add Teacher"

**Step 3: Assign to Classes** (Optional, do this after adding)
```sql
-- Assign Dr. John Doe as coordinator of CSE 2nd Year A
INSERT INTO teacher_classes (teacher_id, class_id, is_coordinator)
VALUES ('t_ID_OF_JOHN', 'c1', true);
```

**Step 4: Teacher can now login!**
- Email: john.doe@college.edu
- They'll see their teacher dashboard
- They can approve/reject leaves for their assigned classes

---

## ✏️ Editing Teachers

1. **Go to Manage Teachers** page
2. **Find the teacher** you want to edit
3. **Click "✏️ Edit"** button
4. **Modify fields** (Note: You cannot change email/Clerk ID)
5. **Click "Update Teacher"**

---

## 🗑️ Deactivating Teachers

1. **Go to Manage Teachers** page
2. **Find the teacher** to deactivate
3. **Click "🗑️ Deactivate"**
4. **Confirm** the action
5. Teacher is now marked as inactive (soft delete)

**Note:** Deactivation doesn't delete data, just sets `is_active = false`

---

## 🎯 Quick Reference

### Required Before Adding Teacher:
1. ✅ Department exists in database
2. ✅ Clerk account created for teacher
3. ✅ Clerk User ID copied

### Teacher Form Fields:
- ✅ **Name** (required)
- ✅ **Email** (required, must match Clerk)
- ✅ **DOB** (required)
- ✅ **Department** (required)
- ✅ **Clerk User ID** (required for new teachers)
- ⏩ Phone (optional)
- ⏩ Is Coordinator (checkbox)

### After Adding Teacher:
- They can **login immediately**
- Assign them to **classes** via SQL or future UI
- They'll see **assigned class leaves** in their dashboard

---

## 🐛 Troubleshooting

### "Failed to save teacher"
**Possible causes:**
1. **Duplicate email**: Another teacher has same email
2. **Invalid Clerk User ID**: Check the ID is correct
3. **Department doesn't exist**: Create department first
4. **Missing required fields**: Fill all fields marked with *

### Teacher can't see any leaves
**Solution:**
- Make sure teacher is assigned to a class:
```sql
SELECT * FROM teacher_classes WHERE teacher_id = 'teacher_id_here';
```
- If empty, assign them:
```sql
INSERT INTO teacher_classes (teacher_id, class_id, is_coordinator)
VALUES ('teacher_id', 'class_id', true);
```

### Teacher can't login
**Solution:**
1. Verify Clerk account exists with correct email
2. Verify teacher record in database has matching clerk_user_id
3. Check teacher is_active = true

---

## 📊 View All Teachers

As admin, the **Manage Teachers** page shows:
- ✅ Teacher name
- ✅ Email address
- ✅ Phone number
- ✅ Department
- ✅ DOB
- ✅ Coordinator badge (if applicable)
- ✅ Profile completion status
- ✅ Edit and Deactivate buttons

---

## ✅ Success Checklist

After adding a teacher, verify:
- [ ] Teacher appears in Manage Teachers list
- [ ] Teacher can login with their Clerk credentials
- [ ] Teacher sees their dashboard
- [ ] (If coordinator) Teacher sees pending leaves for assigned classes
- [ ] Teacher profile shows correct department

**All set!** You can now manage teachers as an admin! 🎉
