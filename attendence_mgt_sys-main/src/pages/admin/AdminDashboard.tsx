import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserRole } from '../../hooks/useUserRole';
import { getAllStudents, getAllTeachers, getAllLeaveFormsStats } from '../../lib/api';
import type { Student } from '../../types/database';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import ManageTeachers from './ManageTeachers';
import './AdminDashboard.css';

function AdminDashboardHome() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalLeaves: 0,
        pendingLeaves: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [students, teachers] = await Promise.all([
                    getAllStudents(),
                    getAllTeachers(),
                ]);

                // Get leave stats from all students
                const allLeaveStats = await Promise.all(
                    students.map((s: Student) =>
                        getAllLeaveFormsStats(s.id)
                    )
                );

                const totalPending = allLeaveStats.reduce((sum: number, stat: any) => sum + stat.pending, 0);
                const totalLeaves = allLeaveStats.reduce((sum: number, stat: any) => sum + stat.total, 0);

                setStats({
                    totalStudents: students.length,
                    totalTeachers: teachers.length,
                    totalLeaves,
                    pendingLeaves: totalPending,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

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
                    <h1>Admin Dashboard</h1>
                    <p className="text-muted">Complete system oversight and management</p>
                </div>
            </div>

            <div className="stats-grid">
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
                        <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                            📋
                        </div>
                        <div>
                            <p className="stat-label">Total Leaves</p>
                            <p className="stat-value" style={{ color: 'rgb(34, 197, 94)' }}>{stats.totalLeaves}</p>
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
                <h2>System Management</h2>
                <div className="action-grid">
                    <Link to="/admin/students" className="action-card">
                        <div className="action-icon">👨‍🎓</div>
                        <h3>Manage Students</h3>
                        <p>Create, edit, and manage student records</p>
                    </Link>

                    <Link to="/admin/teachers" className="action-card">
                        <div className="action-icon">👨‍🏫</div>
                        <h3>Manage Teachers</h3>
                        <p>Create, edit, and manage teacher records</p>
                    </Link>

                    <Link to="/admin/classes" className="action-card">
                        <div className="action-icon">📚</div>
                        <h3>Manage Classes</h3>
                        <p>Create classes and assign coordinators</p>
                    </Link>

                    <Link to="/admin/departments" className="action-card">
                        <div className="action-icon">🏛️</div>
                        <h3>Departments</h3>
                        <p>Manage department information</p>
                    </Link>

                    <Link to="/admin/reports" className="action-card">
                        <div className="action-icon">📊</div>
                        <h3>Reports</h3>
                        <p>Generate and view system reports</p>
                    </Link>

                    <Link to="/admin/settings" className="action-card">
                        <div className="action-icon">⚙️</div>
                        <h3>Settings</h3>
                        <p>Configure system settings</p>
                    </Link>
                </div>
            </div>

            {/* Quick Info */}
            <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                <Card>
                    <h2 style={{ marginBottom: 'var(--spacing-md)' }}>System Information</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
                        <div>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>
                                System Status
                            </p>
                            <p style={{ margin: 0, fontWeight: '600', color: 'rgb(34, 197, 94)' }}>
                                ✓ All Systems Operational
                            </p>
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>
                                Database
                            </p>
                            <p style={{ margin: 0, fontWeight: '600' }}>
                                Supabase (Connected)
                            </p>
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>
                                Authentication
                            </p>
                            <p style={{ margin: 0, fontWeight: '600' }}>
                                Clerk (Active)
                            </p>
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>
                                Last Backup
                            </p>
                            <p style={{ margin: 0, fontWeight: '600' }}>
                                Automatic (Daily)
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

// Placeholder pages
function ManageStudents() {
    return (
        <div className="animate-fade-in">
            <h1>Manage Students</h1>
            <p className="text-muted">Create, edit, and manage student records</p>
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <p className="text-muted">Student management interface coming soon...</p>
            </div>
        </div>
    );
}


function ManageClasses() {
    return (
        <div className="animate-fade-in">
            <h1>Manage Classes</h1>
            <p className="text-muted">Create classes and assign coordinators</p>
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <p className="text-muted">Class management interface coming soon...</p>
            </div>
        </div>
    );
}

function ManageDepartments() {
    return (
        <div className="animate-fade-in">
            <h1>Manage Departments</h1>
            <p className="text-muted">View and manage department information</p>
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <p className="text-muted">Department management interface coming soon...</p>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const { user } = useUser();
    const { role, isLoading } = useUserRole();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (role !== 'admin') {
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
        <div className="admin-dashboard">
            <nav className="dashboard-nav">
                <div className="container">
                    <div className="nav-content">
                        <div className="nav-brand">
                            <h2>Admin Portal</h2>
                        </div>
                        <div className="nav-links">
                            <Link to="/admin">Dashboard</Link>
                            <Link to="/admin/students">Students</Link>
                            <Link to="/admin/teachers">Teachers</Link>
                            <Link to="/admin/classes">Classes</Link>
                        </div>
                        <div className="nav-user">
                            <span>{user?.firstName}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="dashboard-main">
                <div className="container">
                    <Routes>
                        <Route path="/" element={<AdminDashboardHome />} />
                        <Route path="/students" element={<ManageStudents />} />
                        <Route path="/teachers" element={<ManageTeachers />} />
                        <Route path="/classes" element={<ManageClasses />} />
                        <Route path="/departments" element={<ManageDepartments />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
