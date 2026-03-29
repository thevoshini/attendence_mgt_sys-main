import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserRole } from '../../hooks/useUserRole';
import { getTeacherClasses, getPendingLeaveFormsForToday } from '../../lib/api';
import type { LeaveFormWithDetails } from '../../types/database';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import TeacherProfile from './TeacherProfile';
import LeaveApproval from './LeaveApproval';
import LeaveManagement from './LeaveManagement';
import ClassStudents from './ClassStudents';
import './TeacherDashboard.css';

function TeacherDashboardHome() {
    const { teacher } = useUserRole();
    const [classes, setClasses] = useState<any[]>([]);
    const [pendingLeaves, setPendingLeaves] = useState<LeaveFormWithDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!teacher?.id) {
                console.log('[TeacherDashboard] No teacher ID yet');
                return;
            }

            console.log('[TeacherDashboard] Fetching classes for teacher:', teacher.id, teacher.name);

            try {
                const teacherClasses = await getTeacherClasses(teacher.id);
                console.log('[TeacherDashboard] Fetched classes:', teacherClasses);
                setClasses(teacherClasses);

                // Get pending leaves for all classes
                if (teacherClasses.length > 0) {
                    const allPending = await Promise.all(
                        teacherClasses.map(tc =>
                            getPendingLeaveFormsForToday(tc.classes.id)
                        )
                    );
                    setPendingLeaves(allPending.flat());
                } else {
                    console.warn('[TeacherDashboard] No classes found for teacher');
                }
            } catch (error) {
                console.error('[TeacherDashboard] Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [teacher]);

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    // If teacher has no coordinator classes, show access denied
    if (classes.length === 0) {
        return (
            <div className="flex-center" style={{ minHeight: '400px', textAlign: 'center' }}>
                <div>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🚫</div>
                    <h2>Coordinator Access Required</h2>
                    <p className="text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        You are not assigned as a coordinator for any classes.
                        <br />
                        Only class coordinators can access the teacher portal.
                    </p>
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                        If you believe this is an error, please contact your HOD or administrator.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome, {teacher?.name}!</h1>
                    <p className="text-muted">Manage your classes and approve leave applications</p>
                </div>
            </div>

            <div className="stats-grid">
                <Card>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                            👥
                        </div>
                        <div>
                            <p className="stat-label">Classes as Coordinator</p>
                            <p className="stat-value" style={{ color: 'rgb(59, 130, 246)' }}>{classes.length}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(251, 146, 60, 0.1)' }}>
                            ⏳
                        </div>
                        <div>
                            <p className="stat-label">Pending Today</p>
                            <p className="stat-value" style={{ color: 'var(--color-warning)' }}>{pendingLeaves.length}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(147, 51, 234, 0.1)' }}>
                            {teacher?.is_coordinator ? '⭐' : '👨‍🏫'}
                        </div>
                        <div>
                            <p className="stat-label">Role</p>
                            <p className="stat-value" style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-lg)' }}>
                                {teacher?.is_coordinator ? 'Coordinator' : 'Teacher'}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-grid">
                    <Link to="/teacher/approvals" className="action-card">
                        <div className="action-icon">✅</div>
                        <h3>Leave Approvals</h3>
                        <p>Review and approve pending leave applications</p>
                        {pendingLeaves.length > 0 && (
                            <Badge variant="warning">{pendingLeaves.length} pending</Badge>
                        )}
                    </Link>

                    <Link to="/teacher/classes" className="action-card">
                        <div className="action-icon">📚</div>
                        <h3>My Classes</h3>
                        <p>View and manage your class students</p>
                    </Link>

                    <Link to="/teacher/profile" className="action-card">
                        <div className="action-icon">👤</div>
                        <h3>My Profile</h3>
                        <p>Update your personal information</p>
                    </Link>
                </div>
            </div>

            {/* Today's Pending Leaves */}
            {pendingLeaves.length > 0 && (
                <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Today's Pending Leaves</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {pendingLeaves.slice(0, 5).map(leave => (
                            <Card key={leave.id} className="leave-preview-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0' }}>{leave.student_name || 'Unknown Student'}</h4>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                            {leave.student_regno} • {leave.num_days} day{leave.num_days !== 1 ? 's' : ''}
                                        </p>
                                        <p style={{ margin: 'var(--spacing-sm) 0 0 0', fontSize: 'var(--font-size-sm)' }}>
                                            {leave.reason.substring(0, 100)}{leave.reason.length > 100 ? '...' : ''}
                                        </p>
                                    </div>
                                    <Link to="/teacher/approvals" className="btn btn-sm btn-primary">
                                        Review
                                    </Link>
                                </div>
                            </Card>
                        ))}
                        {pendingLeaves.length > 5 && (
                            <Link to="/teacher/approvals" style={{ textAlign: 'center', color: 'var(--color-primary)' }}>
                                View all {pendingLeaves.length} pending leaves →
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TeacherDashboard() {
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

    if (role !== 'teacher') {
        return (
            <div className="container flex-center" style={{ minHeight: '100vh', textAlign: 'center' }}>
                <div>
                    <h1>Access Denied</h1>
                    <p className="text-muted mb-lg">You don't have teacher access.</p>
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
        <div className="teacher-dashboard">
            <nav className="dashboard-nav">
                <div className="container">
                    <div className="nav-content">
                        <div className="nav-brand">
                            <h2>Teacher Portal</h2>
                        </div>
                        <div className="nav-links">
                            <Link to="/teacher">Dashboard</Link>
                            <Link to="/teacher/approvals">Approvals</Link>
                            <Link to="/teacher/manage-leaves">Manage Leaves</Link>
                            <Link to="/teacher/classes" onClick={() => window.dispatchEvent(new Event('resetClassView'))}>Classes</Link>
                            <Link to="/teacher/profile">Profile</Link>
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
                        <Route path="/" element={<TeacherDashboardHome />} />
                        <Route path="/profile" element={<TeacherProfile />} />
                        < Route path="/approvals" element={<LeaveApproval />} />
                        <Route path="/manage-leaves" element={<LeaveManagement />} />
                        <Route path="/classes" element={<ClassStudents />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
