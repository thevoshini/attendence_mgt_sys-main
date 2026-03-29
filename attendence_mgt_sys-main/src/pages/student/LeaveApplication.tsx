import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';
import { useOTP } from '../../hooks/useOTP';
import { useToast } from '../../hooks/useToast';
import { createLeaveForm, checkLeaveOverlap } from '../../lib/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

export default function LeaveApplication() {
    const navigate = useNavigate();
    const { student } = useUserRole();
    const { sent, loading: otpLoading, error: otpError, sendOTP, verifyOTP, reset } = useOTP();
    const toast = useToast();

    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        from_date: '',
        to_date: '',
        reason: '',
    });

    const [errors, setErrors] = useState({
        from_date: '',
        to_date: '',
        reason: '',
    });

    const calculateDays = (from: string, to: string): number => {
        if (!from || !to) return 0;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const diffTime = toDate.getTime() - fromDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both dates
        return diffDays > 0 ? diffDays : 0;
    };

    const numDays = calculateDays(formData.from_date, formData.to_date);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const validateForm = (): boolean => {
        const newErrors = {
            from_date: '',
            to_date: '',
            reason: '',
        };

        const today = new Date().toISOString().split('T')[0];

        if (!formData.from_date) {
            newErrors.from_date = 'Start date is required';
        } else if (formData.from_date < today) {
            newErrors.from_date = 'Start date cannot be in the past';
        }

        if (!formData.to_date) {
            newErrors.to_date = 'End date is required';
        } else if (formData.to_date < formData.from_date) {
            newErrors.to_date = 'End date must be after start date';
        }

        if (!formData.reason.trim()) {
            newErrors.reason = 'Reason is required';
        } else if (formData.reason.trim().length < 10) {
            newErrors.reason = 'Reason must be at least 10 characters';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSendOTP = async () => {
        if (!validateForm()) return;

        if (!student?.parent_phone_no) {
            toast.error('Parent phone number not found. Please update your profile first.');
            return;
        }

        // Check for leave overlaps
        if (!student?.id) return;

        try {
            const overlapCheck = await checkLeaveOverlap(
                student.id,
                formData.from_date,
                formData.to_date
            );

            if (overlapCheck.hasOverlap) {
                toast.error(overlapCheck.message || 'Leave dates conflict with existing leave');
                return;
            }
        } catch (error) {
            console.error('Error checking overlap:', error);
            toast.error('Failed to validate leave dates. Please try again.');
            return;
        }

        sendOTP(student.parent_phone_no);
        setShowOTPModal(true);
    };

    const handleVerifyAndSubmit = async () => {
        if (!student?.parent_phone_no || !student?.id) return;

        const success = await verifyOTP(student.parent_phone_no, otpCode);
        if (!success) return;

        setLoading(true);
        try {
            await createLeaveForm({
                student_id: student.id,
                from_date: formData.from_date,
                to_date: formData.to_date,
                num_days: numDays,
                reason: formData.reason,
                status: 'pending',
            });

            toast.success('Leave application submitted successfully!');
            navigate('/student/leave-history');
        } catch (error) {
            console.error('Error submitting leave:', error);
            toast.error('Failed to submit leave application. Please try again.');
        } finally {
            setLoading(false);
            setShowOTPModal(false);
            reset();
            setOtpCode('');
        }
    };

    if (!student) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1>Apply for Leave</h1>
                    <p className="text-muted">Submit a leave application with parent approval</p>
                </div>
            </div>

            <div style={{ maxWidth: '800px' }}>
                <Card>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSendOTP();
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                            {/* Alert Info */}
                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderRadius: 'var(--radius-md)',
                                color: 'rgb(59, 130, 246)',
                            }}>
                                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                    📝 Your leave application will be sent to your class coordinator for approval.
                                    Parent verification via OTP is required.
                                </p>
                            </div>

                            {/* Date Selection */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <div>
                                    <Input
                                        label="From Date"
                                        type="date"
                                        name="from_date"
                                        value={formData.from_date}
                                        onChange={handleChange}
                                        error={errors.from_date}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="To Date"
                                        type="date"
                                        name="to_date"
                                        value={formData.to_date}
                                        onChange={handleChange}
                                        error={errors.to_date}
                                        required
                                        min={formData.from_date || new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div>
                                    <label className="label">Number of Days</label>
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--color-bg-muted)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '42px',
                                        fontSize: 'var(--font-size-xl)',
                                        fontWeight: '700',
                                        color: 'var(--color-primary)',
                                    }}>
                                        {numDays}
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="label">Reason for Leave *</label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    className="input"
                                    rows={5}
                                    placeholder="Please provide a detailed reason for your leave application..."
                                    required
                                    style={{ resize: 'vertical' }}
                                />
                                {errors.reason && (
                                    <p style={{
                                        color: 'var(--color-danger)',
                                        fontSize: 'var(--font-size-sm)',
                                        marginTop: 'var(--spacing-xs)'
                                    }}>
                                        {errors.reason}
                                    </p>
                                )}
                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    fontSize: 'var(--font-size-sm)',
                                    marginTop: 'var(--spacing-xs)'
                                }}>
                                    Minimum 10 characters required
                                </p>
                            </div>

                            {/* Student Info Display */}
                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'var(--color-bg-muted)',
                                borderRadius: 'var(--radius-md)',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 'var(--spacing-md)',
                            }}>
                                <div>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                                        Student Name
                                    </p>
                                    <p style={{ margin: 0, fontWeight: '500' }}>{student.name}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                                        Registration Number
                                    </p>
                                    <p style={{ margin: 0, fontWeight: '500' }}>{student.regno}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                                        Year
                                    </p>
                                    <p style={{ margin: 0, fontWeight: '500' }}>Year {student.year}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                                        Parent Contact
                                    </p>
                                    <p style={{ margin: 0, fontWeight: '500' }}>{student.parent_phone_no}</p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => navigate('/student')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || numDays === 0}
                                >
                                    Proceed to Verify
                                </Button>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>

            {/* OTP Verification Modal */}
            <Modal
                isOpen={showOTPModal}
                onClose={() => {
                    setShowOTPModal(false);
                    reset();
                    setOtpCode('');
                }}
                title="Parent Verification Required"
            >
                <div style={{ padding: 'var(--spacing-md)' }}>
                    {!sent ? (
                        <div>
                            <p className="text-muted mb-lg">
                                An OTP will be sent to your parent's phone number for verification:
                            </p>
                            <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', marginBottom: 'var(--spacing-lg)' }}>
                                {student.parent_phone_no}
                            </p>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-warning)' }}>
                                Note: For demo purposes, use OTP code: <strong>123456</strong>
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-muted mb-lg">
                                Enter the 6-digit OTP sent to {student.parent_phone_no}
                            </p>

                            <Input
                                label="OTP Code"
                                type="text"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                autoFocus
                            />

                            {otpError && (
                                <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
                                    {otpError}
                                </p>
                            )}

                            <div style={{
                                marginTop: 'var(--spacing-lg)',
                                padding: 'var(--spacing-md)',
                                background: 'var(--color-bg-muted)',
                                borderRadius: 'var(--radius-md)',
                            }}>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                                    <strong>Leave Summary:</strong>
                                </p>
                                <p style={{ margin: '4px 0', fontSize: 'var(--font-size-sm)' }}>
                                    {formData.from_date} to {formData.to_date} ({numDays} day{numDays !== 1 ? 's' : ''})
                                </p>
                            </div>

                            <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                                <Button
                                    onClick={handleVerifyAndSubmit}
                                    disabled={otpLoading || otpCode.length !== 6 || loading}
                                    style={{ flex: 1 }}
                                >
                                    {loading ? 'Submitting...' : 'Verify & Submit'}
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => sendOTP(student.parent_phone_no!)}
                                    disabled={otpLoading || loading}
                                >
                                    Resend OTP
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
