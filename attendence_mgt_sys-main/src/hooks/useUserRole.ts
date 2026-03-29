import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Student, Teacher } from '../types/database';

export type UserRole = 'student' | 'teacher' | 'hod' | 'admin' | null;

interface HOD {
    id: string;
    clerk_user_id: string;
    email: string;
    name: string;
    department_id: string;
    created_at: string;
    is_active: boolean;
    department?: any;
}

interface UserData {
    role: UserRole;
    student?: Student;
    teacher?: Teacher;
    hod?: HOD;
    department?: any;
    isLoading: boolean;
}

/**
 * Custom hook to get current user's role and data from Supabase
 * Integrates Clerk authentication with Supabase database
 */
export function useUserRole(): UserData {
    const { user, isLoaded } = useUser();
    const [userData, setUserData] = useState<UserData>({
        role: null,
        isLoading: true,
    });

    useEffect(() => {
        async function fetchUserData() {
            if (!isLoaded || !user) {
                console.log('[useUserRole] No user or not loaded yet');
                setUserData({ role: null, isLoading: false });
                return;
            }

            console.log('[useUserRole] Checking role for user:', user.id, user.primaryEmailAddress?.emailAddress);

            try {
                // Check if user is a student
                const { data: studentData, error: studentError } = await supabase
                    .from('students')
                    .select('*')
                    .eq('clerk_user_id', user.id)
                    .eq('is_active', true)
                    .single();

                if (studentError && studentError.code !== 'PGRST116') {
                    console.error('[useUserRole] Error checking student:', studentError);
                }

                if (studentData) {
                    console.log('[useUserRole] ✅ Found student:', studentData.name, studentData.regno);
                    setUserData({
                        role: 'student',
                        student: studentData,
                        isLoading: false,
                    });
                    return;
                }

                // Check if user is a teacher
                const { data: teacherData, error: teacherError } = await supabase
                    .from('teachers')
                    .select('*')
                    .eq('clerk_user_id', user.id)
                    .eq('is_active', true)
                    .single();

                if (teacherError && teacherError.code !== 'PGRST116') {
                    console.error('[useUserRole] Error checking teacher:', teacherError);
                }

                if (teacherData) {
                    console.log('[useUserRole] ✅ Found teacher:', teacherData.name, teacherData.email);
                    setUserData({
                        role: 'teacher',
                        teacher: teacherData,
                        isLoading: false,
                    });
                    return;
                }

                // Check if user is HOD
                const { data: hodData, error: hodError } = await supabase
                    .from('hod')
                    .select('*, department:departments(*)')
                    .eq('clerk_user_id', user.id)
                    .eq('is_active', true)
                    .single();

                if (hodError && hodError.code !== 'PGRST116') {
                    console.error('[useUserRole] Error checking HOD:', hodError);
                }

                if (hodData) {
                    console.log('[useUserRole] ✅ Found HOD:', hodData.name, hodData.email, 'Department:', hodData.department?.name);
                    setUserData({
                        role: 'hod',
                        hod: hodData,
                        department: hodData.department,
                        isLoading: false,
                    });
                    return;
                }

                // Check if user is admin
                const { data: adminData, error: adminError } = await supabase
                    .from('admin_users')
                    .select('*')
                    .eq('clerk_user_id', user.id)
                    .eq('is_active', true)
                    .single();

                if (adminError && adminError.code !== 'PGRST116') {
                    console.error('[useUserRole] Error checking admin:', adminError);
                }

                if (adminData) {
                    console.log('[useUserRole] ✅ Found admin:', adminData.name, adminData.email);
                    setUserData({
                        role: 'admin',
                        isLoading: false,
                    });
                    return;
                }

                // User exists in Clerk but not in database
                console.warn('[useUserRole] ⚠️ User authenticated in Clerk but not found in database');
                console.log('[useUserRole] Clerk User ID:', user.id);
                console.log('[useUserRole] Email:', user.primaryEmailAddress?.emailAddress);
                setUserData({ role: null, isLoading: false });
            } catch (error) {
                console.error('[useUserRole] Unexpected error:', error);
                setUserData({ role: null, isLoading: false });
            }
        }

        fetchUserData();
    }, [user, isLoaded]);

    return userData;
}
