import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserRole } from '../../hooks/useUserRole';
import {
    getTeachersByHODDepartment,
    getStudentsByHODDepartment,
    getClassesByHODDepartment,
    getAllLeaveFormsStats
} from '../../lib/api';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import './HODDashboard.css';

function HODDashboardHome() {
    const { hod, department } = useUserRole();
    const [stats, setStats] = useState({
        totalTeachers: 0,
        totalStudents: 0,
        totalClasses: 0,
        pendingLeaves: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            if (!hod || !department) return;

            try {
                const [teachers, students, classes] = await Promise.all([
                    getTeachersByHODDepartment(department.id),
                    getStudentsByHODDepartment(department.id),
                    getClassesByHODDepartment(department.id),
                ]);

                // Get leave stats from all department students
                const allLeaveStats = await Promise.all(
                    students.map((s: any) => getAllLeaveFormsStats(s.id))
                );

                const totalPending = allLeaveStats.reduce((sum: number, stat: any) => sum + stat.pending, 0);

                setStats({
                    totalTeachers: teachers.length,
                    totalStudents: students.length,
                    totalClasses: classes.length,
                    pendingLeaves: totalPending,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [hod, department]);

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1>HOD Dashboard</h1>
                    <p className="text-muted">
                        {department?.name} Department Overview
                    </p>
                </div>
            </div>

            <div className="stats-grid">
                <Card>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(147, 51, 234, 0.1)' }}>
                            👨‍🏫
                        </div>
                        <div>
                            <p className="stat-label">Total Teachers</p>
                            <p className="stat-value" style={{ color: 'var(--color-primary)' }}>{stats.totalTeachers}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                            👨‍🎓
                        </div>
                        <div>
                            <p className="stat-label">Total Students</p>
                            <p className="stat-value" style={{ color: 'rgb(59, 130, 246)' }}>{stats.totalStudents}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                            📚
                        </div>
                        <div>
                            <p className="stat-label">Total Classes</p>
                            <p className="stat-value" style={{ color: 'rgb(34, 197, 94)' }}>{stats.totalClasses}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(251, 146, 60, 0.1)' }}>
                            ⏳
                        </div>
                        <div>
                            <p className="stat-label">Pending Leaves</p>
                            <p className="stat-value" style={{ color: 'var(--color-warning)' }}>{stats.pendingLeaves}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="quick-actions">
                <h2>Department Management</h2>
                <div className="action-grid">
                    <Link to="/hod/teachers" className="action-card">
                        <div className="action-icon">👨‍🏫</div>
                        <h3>Teachers</h3>
                        <p>View all teachers and their assigned classes</p>
                    </Link>

                    <Link to="/hod/classes" className="action-card">
                        <div className="action-icon">📚</div>
                        <h3>Classes</h3>
                        <p>View all classes and students</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Import actual pages
import Teachers from './Teachers';
import TeacherDetails from './TeacherDetails';
import Classes from './Classes';
import ClassDetails from './ClassDetails';
import StudentProfile from './StudentProfile';

export default function HODDashboard() {
    const { user } = useUser();
    const { role, hod, department, isLoading } = useUserRole();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (role !== 'hod') {
        return (
            <div className="container flex-center" style={{ minHeight: '100vh', textAlign: 'center' }}>
                <div>
                    <h1>Access Denied</h1>
                    <p className="text-muted mb-lg">You don't have HOD access.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/')}
                        style={{
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            border: 'none',
                            padding: '12px 32px',
                            fontSize: '16px',
                            fontWeight: '600',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                        }}
                    >
                        🏠 Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="hod-dashboard">
            <nav className="dashboard-nav">
                <div className="container">
                    <div className="nav-content">
                        <div className="nav-brand">
                            <h2>HOD Portal</h2>
                            <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginLeft: 'var(--spacing-sm)' }}>
                                {department?.name}
                            </span>
                        </div>
                        <div className="nav-links">
                            <Link to="/hod">Dashboard</Link>
                            <Link to="/hod/teachers">Teachers</Link>
                            <Link to="/hod/classes">Classes</Link>
                        </div>
                        <div className="nav-user">
                            <span>{user?.firstName || hod?.name}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="dashboard-main">
                <div className="container">
                    <Routes>
                        <Route path="/" element={<HODDashboardHome />} />
                        <Route path="/teachers" element={<Teachers />} />
                        <Route path="/teachers/:teacherId" element={<TeacherDetails />} />
                        <Route path="/classes" element={<Classes />} />
                        <Route path="/classes/:classId" element={<ClassDetails />} />
                        <Route path="/students/:studentId" element={<StudentProfile />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
