import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentAcademicInfo, getLeaveFormsByStudentId } from '../../lib/api';
import { formatDate } from '../../utils/dateFormat';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

interface Student {
    id: string;
    name: string;
    regno: string;
    email: string;
    phone_no?: string;
    is_dayscholar: boolean;
    year: number;
    department?: {
        name: string;
        code: string;
    };
    class?: {
        name: string;
        year: number;
        section: string;
    };
}

interface LeaveForm {
    id: string;
    from_date: string;
    to_date: string;
    num_days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    rejection_reason?: string;
}

export default function StudentProfile() {
    const { studentId } = useParams<{ studentId: string }>();
    const [student, setStudent] = useState<Student | null>(null);
    const [leaves, setLeaves] = useState<LeaveForm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStudentData() {
            if (!studentId) return;

            try {
                const [studentData, leavesData] = await Promise.all([
                    getStudentAcademicInfo(studentId),
                    getLeaveFormsByStudentId(studentId)
                ]);

                setStudent(studentData);
                // Sort leaves by created_at descending (most recent first)
                const sortedLeaves = leavesData.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setLeaves(sortedLeaves);
            } catch (error) {
                console.error('Error fetching student data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStudentData();
    }, [studentId]);

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (!student) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <h3>Student Not Found</h3>
                    <p className="text-muted">Unable to load student information.</p>
                </div>
            </Card>
        );
    }

    const leaveStats = {
        total: leaves.length,
        approved: leaves.filter(l => l.status === 'approved').length,
        pending: leaves.filter(l => l.status === 'pending').length,
        rejected: leaves.filter(l => l.status === 'rejected').length,
    };

    return (
        <div className="animate-fade-in">
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <Link to="/hod/classes" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }}>
                        ← Back to Classes
                    </Link>
                    <h1 style={{ marginTop: 'var(--spacing-sm)' }}>{student.name}</h1>
                    <p className="text-muted">{student.regno}</p>
                </div>
            </div>

            {/* Student Info Card */}
            <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Student Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
                    <div>
                        <p className="text-muted" style={{ margin: '0 0 4px 0', fontSize: 'var(--font-size-sm)' }}>Email</p>
                        <p style={{ margin: 0 }}>📧 {student.email}</p>
                    </div>
                    {student.phone_no && (
                        <div>
                            <p className="text-muted" style={{ margin: '0 0 4px 0', fontSize: 'var(--font-size-sm)' }}>Phone</p>
                            <p style={{ margin: 0 }}>📱 {student.phone_no}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-muted" style={{ margin: '0 0 4px 0', fontSize: 'var(--font-size-sm)' }}>Year</p>
                        <p style={{ margin: 0 }}>📚 Year {student.year}</p>
                    </div>
                    <div>
                        <p className="text-muted" style={{ margin: '0 0 4px 0', fontSize: 'var(--font-size-sm)' }}>Type</p>
                        <Badge variant={student.is_dayscholar ? 'info' : 'success'}>
                            {student.is_dayscholar ? 'Day Scholar' : 'Hosteler'}
                        </Badge>
                    </div>
                    {student.department && (
                        <div>
                            <p className="text-muted" style={{ margin: '0 0 4px 0', fontSize: 'var(--font-size-sm)' }}>Department</p>
                            <p style={{ margin: 0 }}>{student.department.name}</p>
                        </div>
                    )}
                    {student.class && (
                        <div>
                            <p className="text-muted" style={{ margin: '0 0 4px 0', fontSize: 'var(--font-size-sm)' }}>Class</p>
                            <p style={{ margin: 0 }}>Year {student.class.year} - Section {student.class.section}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Leave Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-primary)' }}>{leaveStats.total}</div>
                        <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Total Leaves</div>
                    </div>
                </Card>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'rgb(34, 197, 94)' }}>{leaveStats.approved}</div>
                        <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Approved</div>
                    </div>
                </Card>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'rgb(251, 146, 60)' }}>{leaveStats.pending}</div>
                        <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Pending</div>
                    </div>
                </Card>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'rgb(239, 68, 68)' }}>{leaveStats.rejected}</div>
                        <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Rejected</div>
                    </div>
                </Card>
            </div>

            {/* Leave History */}
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Leave History</h2>
            {leaves.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📝</div>
                        <h3>No Leave Applications</h3>
                        <p className="text-muted">This student hasn't applied for any leaves yet.</p>
                    </div>
                </Card>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {leaves.map((leave) => (
                        <Card key={leave.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                                <div>
                                    <Badge variant={
                                        leave.status === 'approved' ? 'success' :
                                            leave.status === 'rejected' ? 'danger' : 'warning'
                                    }>
                                        {leave.status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                                    Applied: {formatDate(leave.created_at)}
                                </div>
                            </div>

                            <div style={{ marginTop: 'var(--spacing-md)' }}>
                                <p style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                    <strong>Period:</strong> {formatDate(leave.from_date)} to {formatDate(leave.to_date)} ({leave.num_days} {leave.num_days === 1 ? 'day' : 'days'})
                                </p>
                                <p style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-size-sm)' }}>
                                    <strong>Reason:</strong> {leave.reason}
                                </p>
                                {leave.status === 'rejected' && leave.rejection_reason && (
                                    <div style={{
                                        marginTop: 'var(--spacing-sm)',
                                        padding: 'var(--spacing-sm)',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                            <strong>Rejection Reason:</strong> {leave.rejection_reason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
