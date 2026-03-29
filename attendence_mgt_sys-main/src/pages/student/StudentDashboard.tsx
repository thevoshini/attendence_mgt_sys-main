import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';
import { getAllLeaveFormsStats } from '../../lib/api';
import Spinner from '../../components/ui/Spinner';
import Card from '../../components/ui/Card';
import AcademicInfo from '../../components/student/AcademicInfo';
import StudentProfile from './StudentProfile';
import LeaveApplication from './LeaveApplication';
import LeaveHistory from './LeaveHistory';
import './StudentDashboard.css';

function StudentDashboardHome() {
    const { student } = useUserRole();
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            if (student?.id) {
                try {
                    const data = await getAllLeaveFormsStats(student.id);
                    setStats(data);
                } catch (error) {
                    console.error('Error fetching stats:', error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchStats();
    }, [student]);

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
                    <h1>Welcome, {student?.name}!</h1>
                    <p className="text-muted">Manage your leave applications and profile</p>
                </div>
            </div>

            <div className="stats-grid">
                <Card>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(147, 51, 234, 0.1)' }}>
                            📊
                        </div>
                        <div>
                            <p className="stat-label">Total Leaves</p>
                            <p className="stat-value" style={{ color: 'var(--color-primary)' }}>{stats.total}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(251, 146, 60, 0.1)' }}>
                            ⏳
                        </div>
                        <div>
                            <p className="stat-label">Pending</p>
                            <p className="stat-value" style={{ color: 'var(--color-warning)' }}>{stats.pending}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                            ✅
                        </div>
                        <div>
                            <p className="stat-label">Approved</p>
                            <p className="stat-value" style={{ color: 'var(--color-success)' }}>{stats.approved}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                            ❌
                        </div>
                        <div>
                            <p className="stat-label">Rejected</p>
                            <p className="stat-value" style={{ color: 'var(--color-danger)' }}>{stats.rejected}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Academic Information */}
            {student?.id && (
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <AcademicInfo studentId={student.id} />
                </div>
            )}

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-grid">
                    <Link to="/student/apply-leave" className="action-card">
                        <div className="action-icon">📝</div>
                        <h3>Apply for Leave</h3>
                        <p>Submit a new leave application</p>
                    </Link>

                    <Link to="/student/leave-history" className="action-card">
                        <div className="action-icon">📅</div>
                        <h3>Leave History</h3>
                        <p>View all your leave applications</p>
                    </Link>

                    <Link to="/student/profile" className="action-card">
                        <div className="action-icon">👤</div>
                        <h3>My Profile</h3>
                        <p>Update your personal information</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function StudentDashboard() {
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

    // If not a student, redirect
    if (role !== 'student') {
        return (
            <div className="container flex-center" style={{ minHeight: '100vh', textAlign: 'center' }}>
                <div>
                    <h1>Access Denied</h1>
                    <p className="text-muted mb-lg">You don't have student access.</p>
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
        <div className="student-dashboard">
            <nav className="dashboard-nav">
                <div className="container">
                    <div className="nav-content">
                        <div className="nav-brand">
                            <h2>Student Portal</h2>
                        </div>
                        <div className="nav-links">
                            <Link to="/student">Dashboard</Link>
                            <Link to="/student/apply-leave">Apply Leave</Link>
                            <Link to="/student/leave-history">History</Link>
                            <Link to="/student/profile">Profile</Link>
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
                        <Route path="/" element={<StudentDashboardHome />} />
                        <Route path="/profile" element={<StudentProfile />} />
                        <Route path="/apply-leave" element={<LeaveApplication />} />
                        <Route path="/leave-history" element={<LeaveHistory />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
