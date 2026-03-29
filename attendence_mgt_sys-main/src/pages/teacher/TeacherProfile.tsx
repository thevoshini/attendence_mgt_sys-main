import { useState, useEffect } from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import { updateTeacher } from '../../lib/api';
import { useOTP } from '../../hooks/useOTP';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

export default function TeacherProfile() {
    const { teacher } = useUserRole();
    const { sent, sendOTP, verifyOTP, reset } = useOTP();

    const [isEditing, setIsEditing] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_no: '',
        dob: '',
    });
    const [pendingData, setPendingData] = useState<any>(null);

    useEffect(() => {
        if (teacher) {
            setFormData({
                name: teacher.name || '',
                email: teacher.email,
                phone_no: teacher.phone_no || '',
                dob: teacher.dob,
            });
        }
    }, [teacher]);

    const handleEdit = () => {
        setIsEditing(true);
        setSuccess('');
        setError('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (teacher) {
            setFormData({
                name: teacher.name || '',
                email: teacher.email,
                phone_no: teacher.phone_no || '',
                dob: teacher.dob,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!teacher?.phone_no) {
            setError('Please add a phone number first');
            return;
        }

        setPendingData(formData);
        const otpSent = await sendOTP(teacher.phone_no);

        if (otpSent) {
            setShowOTPModal(true);
            setError('');
        } else {
            setError('Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyAndUpdate = async () => {
        if (!teacher?.phone_no || !pendingData) return;

        setLoading(true);
        const verified = await verifyOTP(teacher.phone_no, otpCode);

        if (verified) {
            try {
                await updateTeacher(teacher.id, pendingData);
                setSuccess('Profile updated successfully!');
                setShowOTPModal(false);
                setIsEditing(false);
                setOtpCode('');
                reset();

                // Reload page to show updated data
                setTimeout(() => window.location.reload(), 1500);
            } catch (err) {
                setError('Failed to update profile. Please try again.');
            }
        } else {
            setError('Invalid OTP. Please try again.');
        }
        setLoading(false);
    };

    if (!teacher) {
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
                    <h1>My Profile</h1>
                    <p className="text-muted">View your personal information</p>
                </div>
            </div>



            <Card>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                        {/* Personal Information */}
                        <div>
                            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Personal Information</h3>
                            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                                <Input
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={true}
                                    required
                                />

                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    helperText="Email cannot be changed"
                                />

                                <Input
                                    label="Date of Birth"
                                    type="date"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    disabled={true}
                                    required
                                />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Contact Information</h3>
                            <Input
                                label="Phone Number"
                                type="tel"
                                value={formData.phone_no}
                                onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                                disabled={true}
                                placeholder="+919876543210"
                                required
                            />
                        </div>

                        {/* Role Information */}
                        <div>
                            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Role Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
                                <div>
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>
                                        Role
                                    </p>
                                    <p style={{ fontWeight: '600' }}>
                                        {teacher.is_coordinator ? '⭐ Coordinator' : '👨‍🏫 Teacher'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>
                                        Status
                                    </p>
                                    <p style={{ fontWeight: '600', color: 'rgb(34, 197, 94)' }}>
                                        ✓ Active
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>
                </form>
            </Card>


        </div>
    );
}
