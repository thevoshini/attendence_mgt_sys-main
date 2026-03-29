# Testing Guide - Attendance Management System

## 🚀 Quick Start Guide for Testing

This guide will help you set up sample data and test all features of the application.

---

## Step 1: Prepare Clerk Accounts

### Option A: Using Real Clerk Accounts (Recommended)

1. **Open Clerk Dashboard** at https://dashboard.clerk.com
2. **Navigate to your project** → Users section
3. **Create test accounts:**
   - **3 Teacher Accounts** (use emails like teacher1@test.com, teacher2@test.com, etc.)
   - **5-10 Student Accounts** (use emails like student1@test.com, student2@test.com, etc.)
   - **1 Admin Account** (admin@test.com)

4. **Note down Clerk User IDs:**
   - Click on each user in Clerk dashboard
   - Copy their User ID (starts with `user_...`)
   - Save them in a text file for the next step

### Option B: Quick Test Without Clerk (For Development Only)

Skip Clerk setup and use placeholder IDs - **not recommended for production testing**.

---

## Step 2: Update Seed Data

1. **Open the file:** `seed_data.sql`

2. **Replace placeholder IDs** with actual Clerk user IDs:

```sql
-- BEFORE:
('t1', 'user_teacher1_REPLACE_ME', 'Dr. Rajesh Kumar', ...)

-- AFTER (with your actual Clerk ID):
('t1', 'user_2abc123xyz456def', 'Dr. Rajesh Kumar', ...)
```

3. **Update for ALL entries:**
   - Replace `user_teacher1_REPLACE_ME` → Actual teacher 1 Clerk ID
   - Replace `user_teacher2_REPLACE_ME` → Actual teacher 2 Clerk ID
   - Replace `user_student1_REPLACE_ME` → Actual student 1 Clerk ID
   - And so on...

---

## Step 3: Run Seed Data in Supabase

1. **Open Supabase Dashboard** → Your Project
2. **Go to SQL Editor** (left sidebar)
3. **Create New Query**
4. **Copy the entire contents** of `seed_data.sql`
5. **Paste into the editor**
6. **Click "Run"** or press F5

### Expected Result:
```
Success. No rows returned
```

### If you see errors:
- **"duplicate key"** → Data already exists (safe to ignore)
- **"foreign key violation"** → Make sure you ran `database_schema.sql` first
- **"null value"** → Check that all required fields are filled

---

## Step 4: Verify Data Was Inserted

Run these queries in Supabase SQL Editor to verify:

```sql
-- Check departments
SELECT * FROM departments;
-- Should return: 3 departments (CSE, ECE, ME)

-- Check teachers
SELECT * FROM teachers;
-- Should return: 3 teachers

-- Check students
SELECT * FROM students;
-- Should return: 10 students

-- Check classes
SELECT * FROM classes;
-- Should return: 4 classes

-- Check leave forms
SELECT * FROM leave_forms;
-- Should return: ~10 leave applications (pending, approved, rejected)
```

---

## Step 5: Test Application Features

### 🎓 Testing as a STUDENT

1. **Sign In:**
   - Go to http://localhost:5174
   - Click "Sign In"
   - Use one of your student test accounts (e.g., student1@test.com)

2. **Test Dashboard:**
   - ✅ Should see leave statistics (Total, Pending, Approved, Rejected)
   - ✅ Should see navigation cards

3. **Test Profile Management:**
   - Click "My Profile"
   - ✅ View student details
   - Click "Edit Profile"
   - Change some information (e.g., phone number)
   - ✅ OTP modal should appear
   - Enter demo OTP: `123456`
   - ✅ Profile should update successfully

4. **Test Leave Application:**
   - Click "Apply Leave"
   - Fill in the form:
     - **From Date:** Tomorrow
     - **To Date:** Day after tomorrow
     - **Reason:** "Family function" (at least 20 characters)
   - ✅ Should see calculated days
   - Click "Submit Application"
   - ✅ OTP modal appears
   - Enter: `123456`
   - ✅ Should show success message
   - ✅ Should redirect to Leave History

5. **Test Leave History:**
   - Click "Leave History"
   - ✅ Should see your submitted leave applications
   - Test filters:
     - Click "Pending" → See only pending leaves
     - Click "Approved" → See only approved leaves
     - Click "Rejected" → See only rejected leaves
   - ✅ Should see rejection reasons for rejected leaves

---

### 👨‍🏫 Testing as a TEACHER

1. **Sign Out** from student account

2. **Sign In as Teacher:**
   - Use one of your teacher test accounts (e.g., teacher1@test.com)

3. **Test Teacher Dashboard:**
   - ✅ Should see class statistics
   - ✅ Should see pending leave count
   - ✅ Should see "Today's Pending Leaves" section

4. **Test Leave Approvals:**
   - Click "Leave Approvals" or "Approvals" in nav
   - ✅ Should see list of pending leave applications
   - Each card shows:
     - Student name and regno
     - Leave duration and days
     - Reason
     - Action buttons

5. **Test Approving a Leave:**
   - Click "✅ Approve" on any pending leave
   - ✅ OTP modal appears
   - Enter: `123456`
   - ✅ Should show success message
   - ✅ Leave should disappear from pending list

6. **Test Rejecting a Leave:**
   - Click "❌ Reject" on any pending leave
   - ✅ Rejection reason modal appears
   - Enter a reason: "Not a valid reason for leave"
   - Click "Proceed to Verify"
   - ✅ OTP modal appears
   - Enter: `123456`
   - ✅ Should show success message
   - ✅ Leave should disappear from pending list

7. **Verify Changes:**
   - Sign out
   - Sign back in as the student whose leave you approved/rejected
   - Go to Leave History
   - ✅ Should see updated status
   - ✅ If rejected, should see rejection reason

---

### 👨‍💼 Testing as an ADMIN

1. **Sign In as Admin:**
   - Use your admin test account (e.g., admin@test.com)

2. **Test Admin Dashboard:**
   - ✅ Should see system statistics:
     - Total Students
     - Total Teachers
     - Total Leaves
     - Pending Leaves
   - ✅ Should see management cards
   - ✅ Should see system information section

3. **Test Navigation:**
   - ✅ All nav links should be clickable
   - ✅ Placeholder pages should load (Students, Teachers, Classes)

---

## 🎯 Complete Test Checklist

### Student Module ✅
- [ ] Dashboard loads with statistics
- [ ] Profile view shows correct data
- [ ] Profile edit with OTP works
- [ ] Leave application form validates dates
- [ ] Leave application calculates days correctly
- [ ] Leave submission with OTP works
- [ ] Leave history displays all applications
- [ ] Status filters work (All, Pending, Approved, Rejected)
- [ ] Rejection reasons display correctly

### Teacher Module ✅
- [ ] Dashboard shows class statistics
- [ ] Pending leaves list loads
- [ ] Leave approval with OTP works
- [ ] Leave rejection with reason works
- [ ] OTP verification functions correctly
- [ ] List refreshes after approval/rejection

### Admin Module ✅
- [ ] Dashboard shows system statistics
- [ ] All navigation links work
- [ ] System information displays

### General ✅
- [ ] Authentication flow works
- [ ] Role-based routing works
- [ ] Protected routes prevent unauthorized access
- [ ] UI is responsive
- [ ] Dark theme displays correctly
- [ ] No console errors

---

## 🐛 Common Issues and Solutions

### Issue: "No statistics showing" on student dashboard
**Solution:** Make sure the student account's Clerk user ID matches a student record in the database.

### Issue: "Access Denied" when navigating
**Solution:** Ensure the logged-in user's role matches the route (student → /student, teacher → /teacher, admin → /admin)

### Issue: Leave approval not working
**Solution:** 
1. Check teacher is assigned to the student's class in `teacher_classes` table
2. Verify teacher's phone_no is set in the database

### Issue: OTP not working
**Solution:** For demo purposes, always use `123456` as the OTP code. The OTP hook simulates verification.

### Issue: Leave history showing zero applications
**Solution:** 
1. Check the `student_id` in leave_forms matches your logged-in student's ID
2. Run: `SELECT * FROM leave_forms WHERE student_id = 'your_student_id'` in Supabase

---

## 📊 Test Data Summary

After running seed_data.sql, you'll have:

- **3 Departments** (CSE, ECE, ME)
- **4 Classes** (2nd & 3rd year sections)
- **3 Teachers** (all coordinators)
- **10 Students** (mix of day scholars and hostellers)
- **~10 Leave Forms** (pending, approved, rejected)

### Sample Student Credentials (use corresponding Clerk accounts):
- CS2024001 - Amit Patel (CSE 2nd Year A)
- CS2024002 - Priya Sharma (CSE 2nd Year A)
- CS2024003 - Rahul Verma (CSE 2nd Year A)
- CS2024004 - Sneha Reddy (CSE 2nd Year A)
- CS2024005 - Karan Singh (CSE 2nd Year B)

### Sample Teacher Credentials:
- Dr. Rajesh Kumar (CSE Coordinator - Classes c1, c3)
- Prof. Anita Shah (CSE Coordinator - Class c2)
- Dr. Suresh Reddy (ECE Coordinator - Class c4)

---

## 🎬 Demo Workflow

**Complete End-to-End Test:**

1. **Student applies for leave**
   - Sign in as student (Amit Patel)
   - Apply for leave (tomorrow for 2 days)
   - Submit with OTP

2. **Teacher reviews and approves**
   - Sign out, sign in as teacher (Dr. Rajesh Kumar)
   - Go to Leave Approvals
   - See Amit's leave request
   - Approve with OTP

3. **Student sees approval**
   - Sign out, sign in as student (Amit)
   - Go to Leave History
   - See approved status

4. **Admin monitors system**
   - Sign in as admin
   - See total leave statistics increased

---

## 📝 Additional Notes

- **OTP Code:** Always use `123456` for demo/testing
- **Parent Phone:** Used for student profile updates
- **Teacher Phone:** Used for leave approvals
- **Minimum Leave Days:** 1 day
- **Reason Length:** Minimum 20 characters

---

## ✅ Success Criteria

Your testing is successful when:
1. All three roles (Student, Teacher, Admin) can sign in
2. Students can apply for and view leave history
3. Teachers can approve/reject leaves
4. All OTP verifications work
5. Data persists across sessions
6. No console errors or warnings

Happy Testing! 🎉
