import { useState, useEffect } from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import {
    getTeacherLeavesByMonth,
    modifyLeaveStatus,
    approveLeavePartial
} from '../../lib/api';
import type { LeaveFormWithDetails } from '../../types/database';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';
import './LeaveManagement.css';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function LeaveManagement() {
    const { teacher } = useUserRole();
    const [leaves, setLeaves] = useState<LeaveFormWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
    const [searchQuery, setSearchQuery] = useState('');

    // Month/Year state
    const currentDate = new Date();
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1); // 1-12

    // Modal states
    const [selectedLeave, setSelectedLeave] = useState<LeaveFormWithDetails | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showPartialModal, setShowPartialModal] = useState(false);
    const [newStatus, setNewStatus] = useState<'approved' | 'rejected'>('approved');
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    // Partial approval state
    const [partialDays, setPartialDays] = useState('');
    const [partialFromDate, setPartialFromDate] = useState('');
    const [partialToDate, setPartialToDate] = useState('');

    useEffect(() => {
        fetchLeaves();
    }, [teacher, selectedYear, selectedMonth, statusFilter]);

    async function fetchLeaves() {
        if (!teacher?.id) return;

        setLoading(true);
        try {
            const status = statusFilter === 'all' ? undefined : statusFilter;
            const data = await getTeacherLeavesByMonth(
                teacher.id,
                selectedYear,
                selectedMonth,
                status
            );
            setLeaves(data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = (leave: LeaveFormWithDetails, status: 'approved' | 'rejected') => {
        setSelectedLeave(leave);
        setNewStatus(status);
        setShowStatusModal(true);
    };

    const handlePartialApproval = (leave: LeaveFormWithDetails) => {
        setSelectedLeave(leave);
        setPartialDays(leave.num_days.toString());
        setPartialFromDate(leave.from_date);
        setPartialToDate(leave.to_date);
        setShowPartialModal(true);
    };

    const submitStatusChange = async () => {
        if (!selectedLeave || !teacher?.id) return;

        setProcessing(true);
        try {
            await modifyLeaveStatus(
                selectedLeave.id,
                newStatus,
                teacher.id,
                newStatus === 'rejected' ? rejectionReason : undefined
            );
            alert(`Leave ${newStatus} successfully!`);
            await fetchLeaves();
            setShowStatusModal(false);
            setSelectedLeave(null);
            setRejectionReason('');
        } catch (error: any) {
            console.error('Error changing status:', error);
            alert(error.message || 'Failed to change status. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const submitPartialApproval = async () => {
        if (!selectedLeave || !teacher?.id) return;

        const days = parseInt(partialDays);
        if (isNaN(days) || days <= 0 || days > selectedLeave.num_days) {
            alert(`Please enter a valid number of days (1-${selectedLeave.num_days})`);
            return;
        }

        setProcessing(true);
        try {
            await approveLeavePartial(
                selectedLeave.id,
                teacher.id,
                days,
                partialFromDate,
                partialToDate
            );
            alert(`Leave approved for ${days} day(s)!`);
            await fetchLeaves();
            setShowPartialModal(false);
            setSelectedLeave(null);
        } catch (error: any) {
            console.error('Error approving partial leave:', error);
            alert(error.message || 'Failed to approve leave. Please try again.');
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

    const isBeforeEndDate = (toDate: string) => {
        const today = new Date().toISOString().split('T')[0];
        return toDate >= today;
    };

    const getMonthName = (month: number) => {
        return new Date(selectedYear, month - 1).toLocaleString('en-US', { month: 'long' });
    };

    // Filter leaves based on search query
    const searchFilteredLeaves = leaves.filter(leave => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const name = (leave.student_name || '').toLowerCase();
        const regno = (leave.student_regno || '').toLowerCase();
        return name.includes(query) || regno.includes(query);
    });

    const filteredLeaves = searchFilteredLeaves;

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1>Leave Management</h1>
                    <p className="text-muted">Manage and track student leave applications</p>
                </div>
            </div>

            {/* Filters */}
            <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap', alignItems: 'end' }}>
                    {/* Month Selector */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label className="label">Month</label>
                        <select
                            className="input"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                <option key={m} value={m}>
                                    {new Date(2024, m - 1).toLocaleString('en-US', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Year Selector */}
                    <div style={{ flex: '1', minWidth: '150px' }}>
                        <label className="label">Year</label>
                        <select
                            className="input"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i).map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Tabs */}
                    <div style={{ flex: '2', minWidth: '300px' }}>
                        <label className="label">Status</label>
                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                            <Button
                                onClick={() => setStatusFilter('pending')}
                                variant={statusFilter === 'pending' ? 'primary' : 'secondary'}
                                style={{ flex: 1 }}
                            >
                                Pending
                            </Button>
                            <Button
                                onClick={() => setStatusFilter('approved')}
                                variant={statusFilter === 'approved' ? 'primary' : 'secondary'}
                                style={{ flex: 1 }}
                            >
                                Approved
                            </Button>
                            <Button
                                onClick={() => setStatusFilter('rejected')}
                                variant={statusFilter === 'rejected' ? 'primary' : 'secondary'}
                                style={{ flex: 1 }}
                            >
                                Rejected
                            </Button>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-sm)', background: 'var(--color-bg-muted)', borderRadius: 'var(--radius-sm)' }}>
                    Showing <strong>{filteredLeaves.length}</strong> {statusFilter === 'all' ? 'total ' : statusFilter + ' '}
                    leave{filteredLeaves.length !== 1 ? 's' : ''} for <strong>{getMonthName(selectedMonth)} {selectedYear}</strong>
                    {leaves.length !== filteredLeaves.length && ` (filtered from ${leaves.length} total)`}
                </div>
            </Card>

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

            {/* Leaves List */}
            {filteredLeaves.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>📭</div>
                        <h3>No Leaves Found</h3>
                        <p className="text-muted">
                            No {statusFilter !== 'all' ? statusFilter + ' ' : ''}leave applications for this month.
                        </p>
                    </div>
                </Card>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                    {filteredLeaves.map((leave) => {
                        const canModify = isBeforeEndDate(leave.to_date);
                        const hasPartialApproval = leave.approved_days && leave.approved_days !== leave.num_days;

                        return (
                            <Card key={leave.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0' }}>
                                            {leave.student_name || 'Unknown Student'}
                                        </h3>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                            {leave.student_regno} • Year {leave.student_year}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            leave.status === 'approved' ? 'success' :
                                                leave.status === 'rejected' ? 'danger' : 'warning'
                                        }
                                    >
                                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                    </Badge>
                                </div>

                                <div style={{ display: 'grid', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-muted">Duration:</span>
                                        <span>{formatDate(leave.from_date)} - {formatDate(leave.to_date)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-muted">Requested Days:</span>
                                        <strong>{leave.num_days}</strong>
                                    </div>
                                    {hasPartialApproval && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)' }}>
                                            <span>Approved Days:</span>
                                            <strong>{leave.approved_days}</strong>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-muted">Submitted:</span>
                                        <span>{formatDate(leave.created_at)}</span>
                                    </div>
                                </div>

                                <div style={{ padding: 'var(--spacing-sm)', background: 'var(--color-bg-muted)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-md)' }}>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                                        Reason:
                                    </div>
                                    <div>{leave.reason}</div>
                                </div>

                                {leave.status === 'rejected' && leave.rejection_reason && (
                                    <div style={{ padding: 'var(--spacing-sm)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-md)' }}>
                                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)', marginBottom: 'var(--spacing-xs)' }}>
                                            Rejection Reason:
                                        </div>
                                        <div>{leave.rejection_reason}</div>
                                    </div>
                                )}

                                {/* Actions */}
                                {canModify && (
                                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                                        {leave.status !== 'approved' && (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleStatusChange(leave, 'approved')}
                                                    style={{ flex: 1 }}
                                                >
                                                    ✅ Approve
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handlePartialApproval(leave)}
                                                    style={{ flex: 1 }}
                                                >
                                                    📝 Partial Approval
                                                </Button>
                                            </>
                                        )}
                                        {leave.status !== 'rejected' && (
                                            <Button
                                                variant="danger"
                                                onClick={() => handleStatusChange(leave, 'rejected')}
                                                style={{ flex: 1 }}
                                            >
                                                ❌ Reject
                                            </Button>
                                        )}
                                        {leave.status === 'approved' && (
                                            <Badge variant="info">Cannot modify after approval</Badge>
                                        )}
                                        {leave.status === 'rejected' && (
                                            <Badge variant="info">Can re-approve if needed</Badge>
                                        )}
                                    </div>
                                )}

                                {!canModify && (
                                    <div style={{ padding: 'var(--spacing-sm)', background: 'var(--color-bg-muted)', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                                        🔒 Cannot modify - Leave period has ended
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Status Change Modal */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => {
                    setShowStatusModal(false);
                    setSelectedLeave(null);
                    setRejectionReason('');
                }}
                title={`${newStatus === 'approved' ? 'Approve' : 'Reject'} Leave`}
            >
                <div style={{ padding: 'var(--spacing-md)' }}>
                    {selectedLeave && (
                        <div style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--color-bg-muted)', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ margin: '0 0 4px 0' }}>
                                <strong>{selectedLeave.student_name}</strong> - {selectedLeave.num_days} day(s)
                            </p>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                                {formatDate(selectedLeave.from_date)} to {formatDate(selectedLeave.to_date)}
                            </p>
                        </div>
                    )}

                    {newStatus === 'rejected' && (
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
                    )}

                    <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowStatusModal(false);
                                setRejectionReason('');
                            }}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={newStatus === 'approved' ? 'primary' : 'danger'}
                            onClick={submitStatusChange}
                            disabled={processing || (newStatus === 'rejected' && !rejectionReason.trim())}
                            style={{ flex: 1 }}
                        >
                            {processing ? 'Processing...' : newStatus === 'approved' ? 'Approve' : 'Reject'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Partial Approval Modal */}
            <Modal
                isOpen={showPartialModal}
                onClose={() => {
                    setShowPartialModal(false);
                    setSelectedLeave(null);
                }}
                title="Partial Approval"
            >
                <div style={{ padding: 'var(--spacing-md)' }}>
                    {selectedLeave && (
                        <>
                            <div style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--color-bg-muted)', borderRadius: 'var(--radius-md)' }}>
                                <p style={{ margin: '0 0 4px 0' }}>
                                    <strong>{selectedLeave.student_name}</strong>
                                </p>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                                    Requested: {selectedLeave.num_days} day(s) ({formatDate(selectedLeave.from_date)} - {formatDate(selectedLeave.to_date)})
                                </p>
                            </div>

                            <Input
                                label="Approved Days *"
                                type="number"
                                value={partialDays}
                                onChange={(e) => setPartialDays(e.target.value)}
                                placeholder={`1 - ${selectedLeave.num_days}`}
                                min="1"
                                max={selectedLeave.num_days}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                                <Input
                                    label="From Date"
                                    type="date"
                                    value={partialFromDate}
                                    onChange={(e) => setPartialFromDate(e.target.value)}
                                    min={selectedLeave.from_date}
                                    max={selectedLeave.to_date}
                                />
                                <Input
                                    label="To Date"
                                    type="date"
                                    value={partialToDate}
                                    onChange={(e) => setPartialToDate(e.target.value)}
                                    min={partialFromDate || selectedLeave.from_date}
                                    max={selectedLeave.to_date}
                                />
                            </div>

                            <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowPartialModal(false)}
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={submitPartialApproval}
                                    disabled={processing || !partialDays || !partialFromDate || !partialToDate}
                                    style={{ flex: 1 }}
                                >
                                    {processing ? 'Processing...' : 'Approve'}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}
