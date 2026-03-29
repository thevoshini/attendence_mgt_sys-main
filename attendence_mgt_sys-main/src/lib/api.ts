import { supabase } from './supabase';
import type {
    Student,
    Teacher,
    Class,
    LeaveForm,
    StudentWithDetails,
    TeacherWithDetails,
    LeaveFormWithDetails
} from '../types/database';

// ==========================================
// DEPARTMENT API
// ==========================================

export async function getDepartments() {
    const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('name');

    if (error) throw error;
    return data;
}

export async function getDepartmentById(id: string) {
    const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return data;
}

// ==========================================
// STUDENT API
// ==========================================

export async function getStudentByRegNo(regno: string) {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('regno', regno.toUpperCase())
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return data as Student;
}

export async function getStudentByClerkId(clerkUserId: string) {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return data as Student;
}

export async function getStudentById(id: string) {
    const { data, error } = await supabase
        .from('students_with_details')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as StudentWithDetails;
}

export async function createStudent(student: Partial<Student>) {
    const { data, error } = await supabase
        .from('students')
        .insert([{
            ...student,
            regno: student.regno?.toUpperCase()
        }])
        .select()
        .single();

    if (error) throw error;
    return data as Student;
}

export async function updateStudent(id: string, updates: Partial<Student>) {
    const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Student;
}

export async function deleteStudent(id: string) {
    // Soft delete
    const { data, error } = await supabase
        .from('students')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getStudentsByClassId(classId: string) {
    const { data, error } = await supabase
        .from('students_with_details')
        .select('*')
        .eq('class_id', classId)
        .order('name');

    if (error) throw error;
    return data as StudentWithDetails[];
}

export async function getAllStudents() {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('is_active', true)
        .order('name');

    if (error) throw error;
    return data as Student[];
}

// ==========================================
// TEACHER API
// ==========================================

export async function getTeacherByEmail(email: string) {
    const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return data as Teacher;
}

export async function getTeacherByClerkId(clerkUserId: string) {
    const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return data as Teacher;
}

export async function getTeacherById(id: string) {
    const { data, error } = await supabase
        .from('teachers_with_classes')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as TeacherWithDetails;
}

export async function createTeacher(teacher: Partial<Teacher>) {
    const { data, error } = await supabase
        .from('teachers')
        .insert([{
            ...teacher,
            email: teacher.email?.toLowerCase()
        }])
        .select()
        .single();

    if (error) throw error;
    return data as Teacher;
}

export async function updateTeacher(id: string, updates: Partial<Teacher>) {
    const { data, error } = await supabase
        .from('teachers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Teacher;
}

export async function deleteTeacher(id: string) {
    // Soft delete
    const { data, error } = await supabase
        .from('teachers')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getTeachersByDepartment(departmentId: string) {
    const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('department_id', departmentId)
        .eq('is_active', true)
        .order('name');

    if (error) throw error;
    return data as Teacher[];
}

export async function getAllTeachers() {
    const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('is_active', true)
        .order('name');

    if (error) throw error;
    return data as Teacher[];
}

// ==========================================
// CLASS API
// ==========================================

export async function getClasses() {
    const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('is_active', true)
        .order('year')
        .order('section');

    if (error) throw error;
    return data as Class[];
}

export async function getClassById(id: string) {
    const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return data as Class;
}

export async function getClassesByDepartment(departmentId: string) {
    const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('department_id', departmentId)
        .eq('is_active', true)
        .order('year')
        .order('section');

    if (error) throw error;
    return data as Class[];
}

export async function createClass(classData: Partial<Class>) {
    const { data, error } = await supabase
        .from('classes')
        .insert([classData])
        .select()
        .single();

    if (error) throw error;
    return data as Class;
}

// ==========================================
// LEAVE FORM API
// ==========================================

export async function getLeaveFormsByStudentId(studentId: string) {
    const { data, error } = await supabase
        .from('leave_forms_with_details')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as LeaveFormWithDetails[];
}

export async function getLeaveFormsByClassId(classId: string, date?: string) {
    let query = supabase
        .from('leave_forms_with_details')
        .select('*')
        .eq('class_id', classId);

    if (date) {
        query = query
            .lte('from_date', date)
            .gte('to_date', date);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as LeaveFormWithDetails[];
}

export async function getPendingLeaveFormsForToday(classId: string) {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('leave_forms_with_details')
        .select('*')
        .eq('class_id', classId)
        .eq('status', 'pending')
        .lte('from_date', today)
        .gte('to_date', today)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as LeaveFormWithDetails[];
}

export async function getAllPendingLeaveForms(classId: string) {
    const { data, error } = await supabase
        .from('leave_forms_with_details')
        .select('*')
        .eq('class_id', classId)
        .eq('status', 'pending')
        .order('created_at', { ascending: true }); // Ascending order (oldest first)

    if (error) throw error;
    return data as LeaveFormWithDetails[];
}

export async function createLeaveForm(leaveData: Partial<LeaveForm>) {
    const { data, error } = await supabase
        .from('leave_forms')
        .insert([leaveData])
        .select()
        .single();

    if (error) throw error;
    return data as LeaveForm;
}

export async function updateLeaveFormStatus(
    id: string,
    status: 'approved' | 'rejected',
    coordinatorId: string | null,
    rejectionReason?: string
) {
    const { data, error } = await supabase
        .from('leave_forms')
        .update({
            status,
            coordinator_id: coordinatorId || null, // Use null instead of empty string
            rejection_reason: rejectionReason || null,
            reviewed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as LeaveForm;
}

export async function getAllLeaveFormsStats(studentId: string) {
    const { data, error } = await supabase
        .from('leave_forms')
        .select('status')
        .eq('student_id', studentId)
        .eq('is_active', true);

    if (error) throw error;

    const stats = {
        total: data.length,
        pending: data.filter(l => l.status === 'pending').length,
        approved: data.filter(l => l.status === 'approved').length,
        rejected: data.filter(l => l.status === 'rejected').length,
    };

    return stats;
}

// Helper functions for approval/rejection
export async function approveLeaveForm(id: string, coordinatorId?: string) {
    return updateLeaveFormStatus(id, 'approved', coordinatorId || null, undefined);
}

export async function rejectLeaveForm(id: string, reason: string, coordinatorId?: string) {
    return updateLeaveFormStatus(id, 'rejected', coordinatorId || null, reason);
}

/**
 * Check if a leave has expired (end date has passed and still pending)
 * @param leave - Leave form to check
 * @returns true if leave is expired, false otherwise
 */
export function isLeaveExpired(leave: LeaveFormWithDetails | LeaveForm): boolean {
    // Only pending leaves can be expired
    if (leave.status !== 'pending') return false;

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get end date at midnight
    const endDate = new Date(leave.to_date);
    endDate.setHours(0, 0, 0, 0);

    // Leave is expired if end date is before today
    return endDate < today;
}

// ==========================================
// HOD API
// ==========================================

export async function getHODByClerkId(clerkUserId: string) {
    const { data, error } = await supabase
        .from('hod')
        .select('*, department:departments(*)')
        .eq('clerk_user_id', clerkUserId)
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return data;
}

export async function getTeachersByHODDepartment(departmentId: string) {
    const { data, error } = await supabase
        .from('teachers')
        .select('*, department:departments(*)')
        .eq('department_id', departmentId)
        .eq('is_active', true)
        .order('name');

    if (error) throw error;
    return data;
}

export async function getStudentsByHODDepartment(departmentId: string) {
    const { data, error } = await supabase
        .from('students')
        .select('*, class:classes(*), department:departments(*)')
        .eq('department_id', departmentId)
        .eq('is_active', true)
        .order('name');

    if (error) throw error;
    return data;
}

export async function getClassesByHODDepartment(departmentId: string) {
    const { data, error } = await supabase
        .from('classes')
        .select('*, department:departments(*)')
        .eq('department_id', departmentId)
        .eq('is_active', true)
        .order('year')
        .order('section');

    if (error) throw error;
    return data;
}

export async function getClassesByTeacherId(teacherId: string) {
    const { data, error } = await supabase
        .from('teacher_classes')
        .select(`
            *,
            class:classes(
                id,
                name,
                year,
                section,
                department:departments(*)
            )
        `)
        .eq('teacher_id', teacherId)
        .eq('is_coordinator', true);  // Only coordinator classes

    if (error) throw error;
    return data;
}

// ==========================================
// TEACHER-CLASS ASSIGNMENTS
// ==========================================

export async function assignTeacherToClass(teacherId: string, classId: string, isCoordinator = false) {
    const { data, error } = await supabase
        .from('teacher_classes')
        .insert([{
            teacher_id: teacherId,
            class_id: classId,
            is_coordinator: isCoordinator
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getTeacherClasses(teacherId: string) {
    console.log('[API] getTeacherClasses called with teacherId:', teacherId);

    const { data, error } = await supabase
        .from('teacher_classes')
        .select(`
      *,
      classes (*)
    `)
        .eq('teacher_id', teacherId);

    if (error) {
        console.error('[API] getTeacherClasses error:', error);
        throw error;
    }

    console.log('[API] getTeacherClasses result:', data);
    return data || [];
}

// ==========================================
// STUDENT ACADEMIC INFO
// ==========================================

export async function getStudentAcademicInfo(studentId: string) {
    // Get student with class and department
    const { data: student, error: studentError } = await supabase
        .from('students')
        .select(`
            *,
            department:departments(id, name, code, hod_email),
            class:classes(
                id,
                name,
                year,
                section,
                coordinator:teachers(id, name, email, phone_no)
            )
        `)
        .eq('id', studentId)
        .single();

    if (studentError) throw studentError;

    // Get all coordinators for the student's class (from teacher_classes)
    const { data: coordinators, error: coordError } = await supabase
        .from('teacher_classes')
        .select(`
            is_coordinator,
            teacher:teachers(id, name, email, phone_no)
        `)
        .eq('class_id', student.class.id)
        .eq('is_coordinator', true);

    if (coordError) throw coordError;

    return {
        ...student,
        coordinators: coordinators || []
    };
}

// ==========================================
// ADVANCED LEAVE MANAGEMENT
// ==========================================

// Get leave forms for a specific month
export async function getLeaveFormsByMonth(
    classId: string,
    year: number,
    month: number, // 1-12
    status?: 'pending' | 'approved' | 'rejected'
) {
    // Calculate first and last day of the month
    const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const lastDay = new Date(year, month, 0).toISOString().split('T')[0];

    let query = supabase
        .from('leave_forms_with_details')
        .select('*')
        .eq('class_id', classId)
        // Include leaves that overlap with this month
        .or(`and(from_date.lte.${lastDay},to_date.gte.${firstDay})`);

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;
    return data as LeaveFormWithDetails[];
}

// Modify leave status (with date validation)
export async function modifyLeaveStatus(
    id: string,
    newStatus: 'approved' | 'rejected',
    teacherId: string,
    rejectionReason?: string
) {
    // First get the leave to check end date
    const { data: leave, error: fetchError } = await supabase
        .from('leave_forms')
        .select('to_date')
        .eq('id', id)
        .single();

    if (fetchError) throw fetchError;

    // Check if leave end date has passed
    const today = new Date().toISOString().split('T')[0];
    if (leave.to_date < today) {
        throw new Error('Cannot modify leave status after end date has passed');
    }

    // Update the status
    return updateLeaveFormStatus(id, newStatus, teacherId, rejectionReason);
}

// Approve leave with partial days (different from requested)
export async function approveLeavePartial(
    id: string,
    teacherId: string,
    approvedDays: number,
    approvedFromDate: string,
    approvedToDate: string
) {
    const { data, error } = await supabase
        .from('leave_forms')
        .update({
            status: 'approved',
            coordinator_id: teacherId,
            approved_days: approvedDays,
            approved_from_date: approvedFromDate,
            approved_to_date: approvedToDate,
            reviewed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as LeaveForm;
}

// Get all leaves for a teacher's classes in a month
export async function getTeacherLeavesByMonth(
    teacherId: string,
    year: number,
    month: number,
    status?: 'pending' | 'approved' | 'rejected'
) {
    // Get teacher's classes
    const teacherClasses = await getTeacherClasses(teacherId);

    if (teacherClasses.length === 0) return [];


    // Get leaves for all classes
    const allLeaves = await Promise.all(
        teacherClasses.map(tc =>
            getLeaveFormsByMonth(tc.classes.id, year, month, status)
        )
    );

    return allLeaves.flat();
}

/**
 * Check for leave date overlaps 
 * Returns conflict information if overlapping leave exists
 */
export async function checkLeaveOverlap(
    studentId: string,
    fromDate: string,
    toDate: string,
    excludeId?: string
): Promise<{
    hasOverlap: boolean;
    message?: string;
    conflictingLeave?: LeaveFormWithDetails;
}> {
    try {
        // Query all leaves for the student (exclude current leave if editing)
        let query = supabase
            .from('leave_forms')
            .select('*')
            .eq('student_id', studentId)
            .eq('is_active', true);

        if (excludeId) {
            query = query.neq('id', excludeId);
        }

        const { data: leaves, error } = await query;

        if (error) throw error;
        if (!leaves || leaves.length === 0) return { hasOverlap: false };

        const newFrom = new Date(fromDate);
        const newTo = new Date(toDate);

        // Check for overlaps
        for (const leave of leaves) {
            const existingFrom = new Date(leave.from_date);
            const existingTo = new Date(leave.to_date);

            // Check if dates overlap
            const hasOverlap = (newFrom <= existingTo && newTo >= existingFrom);

            if (hasOverlap) {
                // For pending/approved leaves - strict no overlap
                if (leave.status === 'pending' || leave.status === 'approved') {
                    return {
                        hasOverlap: true,
                        message: `Cannot apply: You already have a ${leave.status} leave from ${new Date(leave.from_date).toLocaleDateString()} to ${new Date(leave.to_date).toLocaleDateString()}`,
                        conflictingLeave: leave as LeaveFormWithDetails
                    };
                }

                // For rejected leaves - only block exact same date range
                if (leave.status === 'rejected') {
                    const exactSameDates =
                        leave.from_date === fromDate &&
                        leave.to_date === toDate;

                    if (exactSameDates) {
                        return {
                            hasOverlap: true,
                            message: `Cannot reapply for the exact same dates (${new Date(leave.from_date).toLocaleDateString()} to ${new Date(leave.to_date).toLocaleDateString()}) that were previously rejected. Please choose different dates.`,
                            conflictingLeave: leave as LeaveFormWithDetails
                        };
                    }
                }
            }
        }

        return { hasOverlap: false };
    } catch (error) {
        console.error('Error checking leave overlap:', error);
        throw error;
    }
}

// ==========================================
// TEACHER ACCESS CONTROL (SECURITY)
// ==========================================

/**
 * Check if a teacher is the coordinator of a specific class
 */
export async function isTeacherCoordinatorOfClass(
    teacherId: string,
    classId: string
): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('teacher_classes')
            .select('is_coordinator')
            .eq('teacher_id', teacherId)
            .eq('class_id', classId)
            .single();

        if (error) {
            // If no record found, teacher is not assigned to this class
            if (error.code === 'PGRST116') return false;
            throw error;
        }

        return data?.is_coordinator || false;
    } catch (error) {
        console.error('Error checking coordinator status:', error);
        return false;
    }
}

/**
 * Get all class IDs that a teacher is assigned to
 */
export async function getTeacherAssignedClassIds(teacherId: string): Promise<string[]> {
    try {
        const { data, error } = await supabase
            .from('teacher_classes')
            .select('class_id')
            .eq('teacher_id', teacherId);

        if (error) throw error;
        return data?.map(tc => tc.class_id) || [];
    } catch (error) {
        console.error('Error getting teacher assigned classes:', error);
        return [];
    }
}

/**
 * Get leave forms for only the classes a teacher is assigned to
 * Filtered by teacher's assigned classes for security
 */
export async function getLeaveFormsForTeacherClasses(
    teacherId: string,
    status?: 'pending' | 'approved' | 'rejected'
): Promise<LeaveFormWithDetails[]> {
    try {
        // First get all class IDs the teacher is assigned to
        const classIds = await getTeacherAssignedClassIds(teacherId);

        if (classIds.length === 0) {
            return [];
        }

        // Build query
        let query = supabase
            .from('leave_forms')
            .select(`
                *,
                students!inner (
                    id,
                    regno,
                    name,
                    class_id,
                    classes!inner (
                        id,
                        name
                    )
                )
            `)
            .eq('is_active', true)
            .in('students.class_id', classIds);

        if (status) {
            query = query.eq('status', status);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        // Transform the data to match LeaveFormWithDetails
        return (data || []).map((leave: any) => ({
            ...leave,
            student_name: leave.students.name,
            student_regno: leave.students.regno,
            class_name: leave.students.classes.name,
        }));
    } catch (error) {
        console.error('Error getting leave forms for teacher classes:', error);
        throw error;
    }
}
