-- Attendance Management System Database Schema
-- Run this in your Supabase SQL Editor

-- ====================================
-- 1. DEPARTMENTS TABLE
-- ====================================
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  hod_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- ====================================
-- 2. CLASSES TABLE
-- ====================================
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
  section TEXT,
  coordinator_id UUID, -- Will reference teachers(id), added after teachers table
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(department_id, year, section)
);

-- ====================================
-- 3. STUDENTS TABLE
-- ====================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE,
  regno TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  blood_group TEXT,
  address TEXT,
  phone_no TEXT,
  parent_phone_no TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  year INTEGER CHECK (year >= 1 AND year <= 4),
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  is_dayscholar BOOLEAN DEFAULT TRUE,
  password_changed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- ====================================
-- 4. TEACHERS TABLE
-- ====================================
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  dob DATE NOT NULL,
  phone_no TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  is_coordinator BOOLEAN DEFAULT FALSE,
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Add foreign key to classes table for coordinator
ALTER TABLE classes
ADD CONSTRAINT fk_coordinator
FOREIGN KEY (coordinator_id) REFERENCES teachers(id) ON DELETE SET NULL;

-- ====================================
-- 5. TEACHER_CLASSES TABLE (Many-to-Many)
-- ====================================
CREATE TABLE teacher_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  is_coordinator BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(teacher_id, class_id)
);

-- ====================================
-- 6. LEAVE_FORMS TABLE
-- ====================================
CREATE TABLE leave_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  num_days INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  coordinator_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- ====================================
-- 7. OTP_VERIFICATIONS TABLE
-- ====================================
CREATE TABLE otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_no TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  purpose TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================
-- 8. ADMIN_USERS TABLE
-- ====================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- ====================================
-- INDEXES for Performance
-- ====================================
CREATE INDEX idx_students_regno ON students(regno);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_clerk_id ON students(clerk_user_id);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_active ON students(is_active);

CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_teachers_clerk_id ON teachers(clerk_user_id);
CREATE INDEX idx_teachers_department ON teachers(department_id);
CREATE INDEX idx_teachers_active ON teachers(is_active);

CREATE INDEX idx_leave_forms_student ON leave_forms(student_id);
CREATE INDEX idx_leave_forms_status ON leave_forms(status);
CREATE INDEX idx_leave_forms_date ON leave_forms(from_date, to_date);
CREATE INDEX idx_leave_forms_created ON leave_forms(created_at);

CREATE INDEX idx_otp_phone ON otp_verifications(phone_no);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);

-- ====================================
-- TRIGGERS for updated_at timestamps
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_forms_updated_at BEFORE UPDATE ON leave_forms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================

-- Enable RLS on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users to read/write
-- We'll refine these policies later based on roles

-- Departments - Public read, admin write
CREATE POLICY "Allow public read access on departments"
  ON departments FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Allow authenticated users to insert departments"
  ON departments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Students - Own data access
CREATE POLICY "Students can view their own data"
  ON students FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Allow authenticated insert on students"
  ON students FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Students can update their own data"
  ON students FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Teachers - Department access
CREATE POLICY "Teachers can view active teachers"
  ON teachers FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Allow authenticated insert on teachers"
  ON teachers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Leave Forms - Student own access
CREATE POLICY "Students can view their own leave forms"
  ON leave_forms FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Students can create leave forms"
  ON leave_forms FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Teachers can update leave forms"
  ON leave_forms FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Classes - Public read
CREATE POLICY "Allow read access on classes"
  ON classes FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Allow authenticated insert on classes"
  ON classes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Teacher Classes - All authenticated
CREATE POLICY "Allow read access on teacher_classes"
  ON teacher_classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert on teacher_classes"
  ON teacher_classes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- OTP - Temporary access
CREATE POLICY "Allow authenticated access on otp_verifications"
  ON otp_verifications FOR ALL
  TO authenticated
  USING (true);

-- Admin Users - Restricted
CREATE POLICY "Allow read access on admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- ====================================
-- SAMPLE DATA (Optional - for testing)
-- ====================================

-- Insert a sample department
INSERT INTO departments (name, code, hod_email) VALUES
  ('Computer Science and Engineering', 'CSE', 'hod.cse@example.com');

-- Get the department ID for further insertions
-- You can run this after creating your actual department

-- ====================================
-- VIEWS for Convenience
-- ====================================

-- View for students with department and class details
CREATE OR REPLACE VIEW students_with_details AS
SELECT 
  s.*,
  d.name as department_name,
  d.code as department_code,
  c.name as class_name,
  c.section as class_section
FROM students s
LEFT JOIN departments d ON s.department_id = d.id
LEFT JOIN classes c ON s.class_id = c.id
WHERE s.is_active = TRUE;

-- View for leave forms with student and coordinator details  
CREATE OR REPLACE VIEW leave_forms_with_details AS
SELECT 
  lf.*,
  s.name as student_name,
  s.regno as student_regno,
  s.email as student_email,
  s.class_id,
  t.name as coordinator_name,
  t.email as coordinator_email
FROM leave_forms lf
LEFT JOIN students s ON lf.student_id = s.id
LEFT JOIN teachers t ON lf.coordinator_id = t.id
WHERE lf.is_active = TRUE;

-- View for teachers with their assigned classes
CREATE OR REPLACE VIEW teachers_with_classes AS
SELECT 
  t.*,
  d.name as department_name,
  json_agg(
    json_build_object(
      'class_id', c.id,
      'class_name', c.name,
      'year', c.year,
      'section', c.section,
      'is_coordinator', tc.is_coordinator
    )
  ) FILTER (WHERE c.id IS NOT NULL) as classes
FROM teachers t
LEFT JOIN departments d ON t.department_id = d.id
LEFT JOIN teacher_classes tc ON t.id = tc.teacher_id
LEFT JOIN classes c ON tc.class_id = c.id
WHERE t.is_active = TRUE
GROUP BY t.id, d.name;

-- ====================================
-- COMPLETION MESSAGE
-- ====================================
-- Database schema created successfully!
-- Next steps:
-- 1. Insert your department data
-- 2. Create initial admin users
-- 3. Configure Clerk roles and metadata
-- 4. Test CRUD operations
