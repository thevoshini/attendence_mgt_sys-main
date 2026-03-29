import { useState, useEffect } from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import { getLeaveFormsByStudentId } from '../../lib/api';
import type { LeaveFormWithDetails } from '../../types/database';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import './LeaveHistory.css';

export default function LeaveHistory() {
    const { student } = useUserRole();
    const [leaveForms, setLeaveForms] = useState<LeaveFormWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    useEffect(() => {
        async function fetchLeaveHistory() {
            if (!student?.id) return;

            try {
                const data = await getLeaveFormsByStudentId(student.id);
                setLeaveForms(data);
            } catch (error) {
                console.error('Error fetching leave history:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaveHistory();
    }, [student]);

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    const filteredForms = filter === 'all'
        ? leaveForms
        : leaveForms.filter(form => form.status === filter);

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            case 'pending': return 'warning';
            default: return 'info';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="animate-fade-in">
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1>Leave History</h1>
                    <p className="text-muted">View all your leave applications and their status</p>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="filter-buttons">
                <button
                    className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('all')}
                >
                    All ({leaveForms.length})
                </button>
                <button
                    className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({leaveForms.filter(f => f.status === 'pending').length})
                </button>
                <button
                    className={filter === 'approved' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('approved')}
                >
                    Approved ({leaveForms.filter(f => f.status === 'approved').length})
                </button>
                <button
                    className={filter === 'rejected' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('rejected')}
                >
                    Rejected ({leaveForms.filter(f => f.status === 'rejected').length})
                </button>
            </div>

            {/* Leave Forms List */}
            {filteredForms.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>📋</div>
                        <h3>No Leave Applications</h3>
                        <p className="text-muted">
                            {filter === 'all'
                                ? "You haven't submitted any leave applications yet."
                                : `No ${filter} leave applications found.`}
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="leave-list">
                    {filteredForms.map((leave) => (
                        <Card key={leave.id} className="leave-card">
                            <div className="leave-card-header">
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                        <h3 style={{ margin: 0 }}>
                                            {formatDate(leave.from_date)} - {formatDate(leave.to_date)}
                                        </h3>
                                        <Badge variant={getStatusBadgeVariant(leave.status)}>
                                            {leave.status}
                                        </Badge>
                                    </div>
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                        {leave.num_days} day{leave.num_days !== 1 ? 's' : ''} •
                                        Submitted on {formatDate(leave.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="leave-card-body">
                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: '0 0 4px 0' }}>
                                        Reason:
                                    </p>
                                    <p style={{ margin: 0 }}>{leave.reason}</p>
                                </div>

                                {leave.status === 'rejected' && leave.rejection_reason && (
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: 'var(--radius-md)',
                                    }}>
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: '0 0 4px 0' }}>
                                            Rejection Reason:
                                        </p>
                                        <p style={{ margin: 0, color: 'var(--color-danger)' }}>
                                            {leave.rejection_reason}
                                        </p>
                                    </div>
                                )}

                                {leave.status === 'approved' && (
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                    }}>
                                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                                        <div>
                                            <p style={{ margin: 0, color: 'rgb(34, 197, 94)', fontWeight: '500' }}>
                                                Approved
                                            </p>
                                            {leave.reviewed_at && (
                                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                                                    Reviewed on {formatDate(leave.reviewed_at)}
                                                </p>
                                            )}
                                        </div>
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
