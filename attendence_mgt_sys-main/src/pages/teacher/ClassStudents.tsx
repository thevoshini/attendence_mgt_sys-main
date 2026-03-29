import { useState, useEffect } from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import { useToast } from '../../hooks/useToast';
import {
    getTeacherClasses,
    getStudentsByClassId,
    getLeaveFormsByStudentId,
    approveLeaveForm,
    rejectLeaveForm,
    isTeacherCoordinatorOfClass,
    isLeaveExpired
} from '../../lib/api';
import type { LeaveFormWithDetails } from '../../types/database';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { formatDate } from '../../utils/dateFormat';
import './ClassStudents.css';

interface Student {
    id: string;
    regno: string;
    name: string | null;
    email: string;
    phone_no: string | null;
    parent_phone_no: string | null;
    blood_group: string | null;
    address: string | null;
    year: number;
    is_dayscholar: boolean;
    pendingLeaveCount?: number;
}

export default function ClassStudents() {
    const { teacher } = useUserRole();
    const toast = useToast();
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<any | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [studentLeaves, setStudentLeaves] = useState<LeaveFormWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [loadingLeaves, setLoadingLeaves] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCoordinator, setIsCoordinator] = useState(false);

    // Rejection modal state
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [pendingLeaveId, setPendingLeaveId] = useState<string | null>(null);

    // Approval confirmation modal state
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Reset state when navigating to this route (e.g., clicking Classes in nav)
    useEffect(() => {
        // Listen for navigation to this exact route - this will reset the view
        // when clicking "Classes" in the nav bar
        const handleNavigation = () => {
            setSelectedClass(null);
            setSelectedStudent(null);
        };

        // Add custom event listener for nav clicks from header
        window.addEventListener('resetClassView', handleNavigation);

        return () => {
            window.removeEventListener('resetClassView', handleNavigation);
        };
    }, []);

    useEffect(() => {
        fetchClasses();
    }, [teacher]);

    async function fetchClasses() {
        if (!teacher?.id) {
            console.log('[ClassStudents] No teacher ID available yet');
            return;
        }

        console.log('[ClassStudents] Fetching classes for teacher:', teacher.id, teacher.name);

        try {
            const teacherClasses = await getTeacherClasses(teacher.id);
            console.log('[ClassStudents] Received classes:', teacherClasses);
            console.log('[ClassStudents] Number of classes:', teacherClasses?.length || 0);

            if (teacherClasses && teacherClasses.length > 0) {
                console.log('[ClassStudents] Class details:', teacherClasses.map(tc => ({
                    className: tc.classes?.name,
                    isCoordinator: tc.is_coordinator,
                    isActive: tc.is_active
                })));
            }

            setClasses(teacherClasses);
        } catch (error) {
            console.error('[ClassStudents] Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleClassClick(classData: any) {
        setSelectedClass(classData);
        setSelectedStudent(null);
        setLoadingStudents(true);

        try {
            if (!teacher?.id) return;

            // SECURITY: Verify teacher is actually assigned to this class
            const assignedClasses = await getTeacherClasses(teacher.id);
            const isAssigned = assignedClasses.some(
                tc => tc.classes.id === classData.classes.id
            );

            if (!isAssigned) {
                toast.error('Access Denied: You are not assigned to this class.');
                setSelectedClass(null);
                setLoadingStudents(false);
                return;
            }

            // Check if teacher is coordinator of this class (for leave approval permissions)
            const coordinatorStatus = await isTeacherCoordinatorOfClass(
                teacher.id,
                classData.classes.id
            );
            setIsCoordinator(coordinatorStatus);

            // Fetch student data for ALL teachers (both regular and coordinators)
            const classStudents = await getStudentsByClassId(classData.classes.id);

            // Get pending leave counts for each student
            const studentsWithCounts = await Promise.all(
                classStudents.map(async (student: any) => {
                    const leaves = await getLeaveFormsByStudentId(student.id);
                    const pendingCount = leaves.filter((l: any) => l.status === 'pending').length;
                    return {
                        ...student,
                        pendingLeaveCount: pendingCount
                    };
                })
            );

            setStudents(studentsWithCounts);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoadingStudents(false);
        }
    }

    // Filter students based on search query
    const filteredStudents = students.filter(student => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const name = (student.name || '').toLowerCase();
        const regno = student.regno.toLowerCase();
        return name.includes(query) || regno.includes(query);
    });

    async function handleStudentClick(student: Student) {
        setSelectedStudent(student);
        setLoadingLeaves(true);

        try {
            const leaves = await getLeaveFormsByStudentId(student.id);
            // Sort in descending order (most recent first)
            const sortedLeaves = leaves.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setStudentLeaves(sortedLeaves);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoadingLeaves(false);
        }
    }

    const handleApproveClick = (leaveId: string) => {
        // Only coordinators can approve/reject leaves
        if (!isCoordinator) {
            toast.error('Only class coordinators can approve or reject leave applications.');
            return;
        }

        setPendingLeaveId(leaveId);
        setShowApproveModal(true);
    };

    const handleApproveConfirm = async () => {
        if (!pendingLeaveId) return;

        setActionLoading(true);
        setShowApproveModal(false);

        try {
            await approveLeaveForm(pendingLeaveId, teacher?.id);
            toast.success('Leave approved successfully!');

            setPendingLeaveId(null);

            // Refresh student leaves if a student is selected
            if (selectedStudent) {
                await handleStudentClick(selectedStudent);
            }
            // Refresh class students to update pending leave counts
            if (selectedClass) {
                await handleClassClick(selectedClass);
            }
        } catch (error) {
            console.error('Error approving leave:', error);
            toast.error('Failed to approve leave. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectClick = (leaveId: string) => {
        // Only coordinators can approve/reject leaves
        if (!isCoordinator) {
            toast.error('Only class coordinators can approve or reject leave applications.');
            return;
        }

        setPendingLeaveId(leaveId);
        setShowRejectModal(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectionReason.trim()) {
            toast.warning('Please provide a rejection reason');
            return;
        }

        if (!pendingLeaveId) return;

        setActionLoading(true);
        try {
            await rejectLeaveForm(pendingLeaveId, rejectionReason, teacher?.id);
            toast.success('Leave rejected successfully!');

            setShowRejectModal(false);
            setRejectionReason('');
            setPendingLeaveId(null);

            // Refresh student leaves if a student is selected
            if (selectedStudent) {
                await handleStudentClick(selectedStudent);
            }
            // Refresh class students to update pending leave counts
            if (selectedClass) {
                await handleClassClick(selectedClass);
            }
        } catch (error) {
            console.error('Error rejecting leave:', error);
            toast.error('Failed to reject leave. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="class-students animate-fade-in">
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1>My Classes & Students</h1>
                    <p className="text-muted">Manage your classes and student information</p>
                </div>
            </div>

            {!selectedClass ? (
                // Class List View
                <div>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Your Classes ({classes.length})</h2>
                    {classes.length === 0 ? (
                        <Card>
                            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                                <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>📚</div>
                                <h3>No Classes Assigned</h3>
                                <p className="text-muted">You are not assigned to any classes yet.</p>
                            </div>
                        </Card>
                    ) : (
                        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                            {classes.map((classData) => (
                                <Card key={classData.id} className="clickable-card" onClick={() => handleClassClick(classData)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                                <h3 style={{ margin: 0 }}>{classData.classes.name}</h3>
                                                {classData.is_coordinator && (
                                                    <Badge variant="primary">Coordinator</Badge>
                                                )}
                                            </div>
                                            <p className="text-muted" style={{ margin: 0 }}>
                                                Year {classData.classes.year} • Section {classData.classes.section}
                                            </p>
                                        </div>
                                        <div style={{ fontSize: '2rem' }}>→</div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            ) : !selectedStudent ? (
                // Student List View
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                        <div>
                            <h2 style={{ margin: 0 }}>{selectedClass.classes.name}</h2>
                            <p className="text-muted">{students.length} students{filteredStudents.length !== students.length ? ` (${filteredStudents.length} shown)` : ''}</p>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <Input
                            label=""
                            type="text"
                            placeholder="🔍 Search by name or registration number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {loadingStudents ? (
                        <div className="flex-center" style={{ minHeight: '300px' }}>
                            <Spinner size="lg" />
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <Card>
                            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                                <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🔍</div>
                                <h3>No Students Found</h3>
                                <p className="text-muted">No students match your search query.</p>
                            </div>
                        </Card>
                    ) : (
                        <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                            {filteredStudents.map((student) => (
                                <Card key={student.id} className="clickable-card" onClick={() => handleStudentClick(student)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                                <h4 style={{ margin: 0 }}>{student.name || 'Unnamed Student'}</h4>
                                                {student.pendingLeaveCount! > 0 && (
                                                    <Badge variant="warning">
                                                        🔔 {student.pendingLeaveCount} pending
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '4px 0 0 0' }}>
                                                {student.regno} • {student.is_dayscholar ? 'Day Scholar' : 'Hosteller'}
                                            </p>
                                        </div>
                                        <div style={{ fontSize: '1.5rem' }}>→</div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                // Student Details View
                <div>
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <Button variant="secondary" onClick={() => setSelectedStudent(null)}>
                            ← Back to Students
                        </Button>
                    </div>

                    {/* Student Information */}
                    <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Student Information</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
                            <div>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>Name</p>
                                <p style={{ margin: 0, fontWeight: '600' }}>{selectedStudent.name}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>Registration No.</p>
                                <p style={{ margin: 0, fontWeight: '600' }}>{selectedStudent.regno}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>Email</p>
                                <p style={{ margin: 0 }}>{selectedStudent.email}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>Phone</p>
                                <p style={{ margin: 0 }}>{selectedStudent.phone_no || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>Parent Phone</p>
                                <p style={{ margin: 0 }}>{selectedStudent.parent_phone_no || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>Blood Group</p>
                                <p style={{ margin: 0 }}>{selectedStudent.blood_group || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>Type</p>
                                <p style={{ margin: 0 }}>{selectedStudent.is_dayscholar ? 'Day Scholar' : 'Hosteller'}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>Year</p>
                                <p style={{ margin: 0 }}>{selectedStudent.year}</p>
                            </div>
                        </div>
                        {selectedStudent.address && (
                            <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>Address</p>
                                <p style={{ margin: 0 }}>{selectedStudent.address}</p>
                            </div>
                        )}
                    </Card>

                    {/* Leave Applications */}
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Leave Applications</h2>
                    {loadingLeaves ? (
                        <div className="flex-center" style={{ minHeight: '200px' }}>
                            <Spinner />
                        </div>
                    ) : studentLeaves.length === 0 ? (
                        <Card>
                            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
                                <h3>No Leave Applications</h3>
                                <p className="text-muted">This student hasn't applied for any leaves yet.</p>
                            </div>
                        </Card>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {studentLeaves.map((leave) => (
                                <Card key={leave.id}>
                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px 0' }}>
                                                    {formatDate(leave.from_date)} - {formatDate(leave.to_date)}
                                                </h4>
                                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                                    {leave.num_days} day{leave.num_days !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <Badge variant={
                                                leave.status === 'approved' ? 'success' :
                                                    leave.status === 'rejected' ? 'danger' : 'warning'
                                            }>
                                                {leave.status.toUpperCase()}
                                            </Badge>
                                        </div>

                                        <p style={{ margin: 'var(--spacing-sm) 0' }}><strong>Reason:</strong> {leave.reason}</p>

                                        {leave.status === 'rejected' && leave.rejection_reason && (
                                            <div style={{
                                                marginTop: 'var(--spacing-sm)',
                                                padding: 'var(--spacing-sm)',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                borderLeft: '3px solid rgb(239, 68, 68)',
                                                borderRadius: 'var(--border-radius)'
                                            }}>
                                                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                                    <strong>Rejection Reason:</strong> {leave.rejection_reason}
                                                </p>
                                            </div>
                                        )}

                                        {leave.status === 'pending' && (
                                            <div style={{
                                                marginTop: 'var(--spacing-md)',
                                                display: 'flex',
                                                gap: 'var(--spacing-sm)'
                                            }}>
                                                <Button variant="success" onClick={() => handleApproveClick(leave.id)} style={{ flex: 1 }}>
                                                    ✅ Approve
                                                </Button>
                                                <Button variant="danger" onClick={() => handleRejectClick(leave.id)} style={{ flex: 1 }}>
                                                    ❌ Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Rejection Reason Modal */}
            {/* Approval Confirmation Modal */}
            <Modal
                isOpen={showApproveModal}
                onClose={() => {
                    setShowApproveModal(false);
                    setPendingLeaveId(null);
                }}
                title="Approve Leave"
            >
                <div style={{ padding: 'var(--spacing-md)' }}>
                    <p className="text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        Are you sure you want to approve this leave application?
                    </p>

                    <div style={{
                        marginTop: 'var(--spacing-lg)',
                        display: 'flex',
                        gap: 'var(--spacing-sm)'
                    }}>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowApproveModal(false);
                                setPendingLeaveId(null);
                            }}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleApproveConfirm}
                            disabled={actionLoading}
                            style={{ flex: 1 }}
                        >
                            {actionLoading ? 'Processing...' : 'Approve Leave'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Rejection Modal */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setPendingLeaveId(null);
                }}
                title="Reject Leave"
            >
                <div style={{ padding: 'var(--spacing-md)' }}>
                    <p className="text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        Provide a reason for rejecting this leave application
                    </p>

                    <label className="input-label">Rejection Reason</label>
                    <textarea
                        className="input"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter reason for rejection"
                        rows={3}
                        style={{ width: '100%', resize: 'vertical' }}
                    />

                    <div style={{
                        marginTop: 'var(--spacing-lg)',
                        display: 'flex',
                        gap: 'var(--spacing-sm)'
                    }}>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowRejectModal(false);
                                setRejectionReason('');
                                setPendingLeaveId(null);
                            }}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleRejectSubmit}
                            disabled={actionLoading || !rejectionReason.trim()}
                            style={{ flex: 1 }}
                        >
                            {actionLoading ? 'Processing...' : 'Reject Leave'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div >
    );
}
