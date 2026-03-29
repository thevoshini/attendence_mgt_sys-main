import { useState, useEffect } from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import { useToast } from '../../hooks/useToast';
import { getLeaveFormsForTeacherClasses, approveLeaveForm, rejectLeaveForm, isLeaveExpired } from '../../lib/api';
import type { LeaveFormWithDetails } from '../../types/database';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import './LeaveApproval.css';

export default function LeaveApproval() {
    const { teacher } = useUserRole();
    const toast = useToast();

    const [leaves, setLeaves] = useState<LeaveFormWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLeave, setSelectedLeave] = useState<LeaveFormWithDetails | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPendingLeaves();
    }, [teacher]);

    async function fetchPendingLeaves() {
        if (!teacher?.id) return;

        try {
            // Use new secure function that filters by teacher's assigned classes
            const pendingLeaves = await getLeaveFormsForTeacherClasses(teacher.id, 'pending');
            setLeaves(pendingLeaves);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleApproveClick = async (leave: LeaveFormWithDetails) => {
        // Only coordinators can approve leaves
        if (!teacher?.is_coordinator) {
            toast.error('Only class coordinators can approve leave applications.');
            return;
        }

        if (!window.confirm(`Approve leave for ${leave.student_name}?`)) return;

        setProcessing(true);
        try {
            await approveLeaveForm(leave.id, teacher?.id);
            toast.success('Leave application approved successfully!');
            await fetchPendingLeaves();
        } catch (error) {
            console.error('Error approving leave:', error);
            toast.error('Failed to approve leave. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleRejectClick = (leave: LeaveFormWithDetails) => {
        setSelectedLeave(leave);
        setShowRejectModal(true);
    };

    const handleRejectSubmit = async () => {
        // Only coordinators can reject leaves
        if (!teacher?.is_coordinator) {
            toast.error('Only class coordinators can reject leave applications.');
            return;
        }

        if (!rejectionReason.trim()) {
            toast.warning('Please provide a reason for rejection');
            return;
        }

        if (!selectedLeave) return;

        setProcessing(true);
        try {
            await rejectLeaveForm(selectedLeave.id, rejectionReason, teacher?.id);
            toast.success('Leave application rejected.');
            await fetchPendingLeaves();
            setShowRejectModal(false);
            setSelectedLeave(null);
            setRejectionReason('');
        } catch (error) {
            console.error('Error rejecting leave:', error);
            toast.error('Failed to reject leave. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    // Only coordinators can access leave approvals
    if (!teacher?.is_coordinator) {
        return (
            <div className="flex-center" style={{ minHeight: '400px', textAlign: 'center' }}>
                <div>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🚫</div>
                    <h2>Coordinator Access Required</h2>
                    <p className="text-muted">
                        Only class coordinators can approve or reject leave applications.
                    </p>
                </div>
            </div>
        );
    }

    // Separate active and expired leaves
    const activePendingLeaves = leaves.filter(leave => !isLeaveExpired(leave));
    const expiredLeaves = leaves.filter(leave => isLeaveExpired(leave));

    // Filter leaves based on search query (only active leaves)
    const filteredLeaves = activePendingLeaves.filter(leave => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const name = (leave.student_name || '').toLowerCase();
        const regno = (leave.student_regno || '').toLowerCase();
        return name.includes(query) || regno.includes(query);
    });

    return (
        <div className="animate-fade-in">
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1>Leave Approvals</h1>
                    <p className="text-muted">Review and approve all pending leave applications</p>
                </div>
                <div style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    background: filteredLeaves.length > 0 ? 'rgba(251, 146, 60, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    border: `1px solid ${filteredLeaves.length > 0 ? 'rgba(251, 146, 60, 0.3)' : 'rgba(34, 197, 94, 0.3)'} `,
                    borderRadius: 'var(--radius-md)',
                }}>
                    {leaves.length} Pending{filteredLeaves.length !== leaves.length ? ` (${filteredLeaves.length} shown)` : ''}
                </div>
            </div>

            {/* Search Input */}
            {leaves.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <Input
                        label=""
                        type="text"
                        placeholder="🔍 Search by student name or registration number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            )}

            {filteredLeaves.length === 0 && leaves.length > 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🔍</div>
                        <h3>No Leaves Found</h3>
                        <p className="text-muted">
                            No pending leave applications match your search.
                        </p>
                    </div>
                </Card>
            ) : leaves.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>✅</div>
                        <h3>All Caught Up!</h3>
                        <p className="text-muted">
                            No pending leave applications to review at the moment.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="leave-approval-list">
                    {filteredLeaves.map((leave) => (
                        <Card key={leave.id} className="leave-approval-card">
                            <div className="leave-approval-header">
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0' }}>
                                        {leave.student_name || 'Unknown Student'}
                                    </h3>
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                        {leave.student_regno} • Year {leave.student_year}
                                    </p>
                                </div>
                                <Badge variant="warning">Pending</Badge>
                            </div>

                            <div className="leave-approval-body">
                                <div className="info-row">
                                    <div className="info-item">
                                        <span className="info-label">Duration</span>
                                        <span className="info-value">
                                            {formatDate(leave.from_date)} - {formatDate(leave.to_date)}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Days</span>
                                        <span className="info-value">{leave.num_days}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Submitted</span>
                                        <span className="info-value">{formatDate(leave.created_at)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Type</span>
                                        <span className="info-value">
                                            {leave.is_dayscholar ? 'Day Scholar' : 'Hosteller'}
                                        </span>
                                    </div>
                                </div>

                                <div className="reason-section">
                                    <span className="info-label">Reason:</span>
                                    <p style={{ margin: 'var(--spacing-xs) 0 0 0', lineHeight: '1.6' }}>
                                        {leave.reason}
                                    </p>
                                </div>

                                <div className="action-buttons">
                                    <Button
                                        variant="danger"
                                        onClick={() => handleRejectClick(leave)}
                                    >
                                        ❌ Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleApproveClick(leave)}
                                    >
                                        ✅ Approve
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Rejection Reason Modal */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedLeave(null);
                }}
                title="Reject Leave Application"
            >
                <div style={{ padding: 'var(--spacing-md)' }}>
                    <p className="text-muted mb-lg">
                        Please provide a reason for rejecting this leave application.
                    </p>

                    {selectedLeave && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--color-bg-muted)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-lg)',
                        }}>
                            <p style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 4px 0' }}>
                                <strong>{selectedLeave.student_name}</strong> - {selectedLeave.num_days} day(s)
                            </p>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                                {formatDate(selectedLeave.from_date)} to {formatDate(selectedLeave.to_date)}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="label">Rejection Reason *</label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="input"
                            rows={4}
                            placeholder="Provide a clear reason for rejection..."
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowRejectModal(false);
                                setRejectionReason('');
                            }}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleRejectSubmit}
                            disabled={!rejectionReason.trim() || processing}
                            style={{ flex: 1 }}
                        >
                            {processing ? 'Rejecting...' : 'Reject Leave'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
