// Database Types
export interface Student {
  id: string;
  clerk_user_id: string;
  regno: string;
  name: string;
  dob: string;
  blood_group?: string;
  address?: string;
  phone_no?: string;
  parent_phone_no: string;
  email: string;
  year: number;
  department_id: string;
  class_id: string;
  is_dayscholar: boolean;
  password_changed: boolean;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Teacher {
  id: string;
  clerk_user_id: string;
  name?: string;
  email: string;
  dob: string;
  phone_no?: string;
  department_id: string;
  is_coordinator: boolean;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Class {
  id: string;
  department_id: string;
  name: string;
  year: number;
  section: string;
  coordinator_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hod_email: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface LeaveForm {
  id: string;
  student_id: string;
  from_date: string;
  to_date: string;
  num_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  coordinator_id?: string;
  rejection_reason?: string;
  reviewed_at?: string;
  approved_days?: number; // For partial approval
  approved_from_date?: string; // For partial approval
  approved_to_date?: string; // For partial approval
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface TeacherClass {
  id: string;
  teacher_id: string;
  class_id: string;
  is_coordinator: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  clerk_user_id: string;
  email: string;
  name?: string;
  department_id: string;
  created_at: string;
  is_active: boolean;
}

export interface OTPVerification {
  id: string;
  phone_no: string;
  otp_code: string;
  purpose: string;
  verified: boolean;
  expires_at: string;
  created_at: string;
}

// User Roles
export type UserRole = 'student' | 'teacher' | 'admin';

// Extended types with relations
export interface StudentWithDetails extends Student {
  department?: Department;
  class?: Class;
}

export interface TeacherWithDetails extends Teacher {
  department?: Department;
  classes?: Class[];
}

export interface LeaveFormWithDetails extends LeaveForm {
  student?: Student;
  coordinator?: Teacher;
  // Additional fields from the view
  student_name?: string;
  student_regno?: string;
  student_year?: number;
  class_id?: string;
  is_dayscholar?: boolean;
}
