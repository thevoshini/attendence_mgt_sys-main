import { useState, useEffect } from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import { useOTP } from '../../hooks/useOTP';
import { updateStudent } from '../../lib/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

export default function StudentProfile() {
    const { student } = useUserRole();
    const { sent, loading: otpLoading, error: otpError, sendOTP, verifyOTP, reset } = useOTP();

    const [isEditing, setIsEditing] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_no: '',
        parent_phone_no: '',
        blood_group: '',
        address: '',
    });

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name || '',
                email: student.email || '',
                phone_no: student.phone_no || '',
                parent_phone_no: student.parent_phone_no || '',
                blood_group: student.blood_group || '',
                address: student.address || '',
            });
        }
    }, [student]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSendOTP = async () => {
        if (!student?.parent_phone_no) {
            alert('Parent phone number is required for verification');
            return;
        }
        await sendOTP(student.parent_phone_no, 'profile_update');
        setShowOTPModal(true);
    };

    const handleVerifyOTP = async () => {
        if (!student?.parent_phone_no) return;

        const success = await verifyOTP(student.parent_phone_no, otpCode);
        if (success) {
            setShowOTPModal(false);
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!student?.id) return;

        setLoading(true);
        try {
            await updateStudent(student.id, formData);
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
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
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1>My Profile</h1>
                    <p className="text-muted">View your personal information</p>
                </div>
            </div>



            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                {/* Personal Information */}
                <Card>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Personal Information</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div>
                            <label className="label">Registration Number</label>
                            <input
                                type="text"
                                value={student.regno}
                                disabled
                                className="input"
                                style={{ background: 'var(--color-bg-muted)', cursor: 'not-allowed' }}
                            />
                        </div>

                        <Input
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={true}
                        />

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={true}
                        />

                        <div>
                            <label className="label">Date of Birth</label>
                            <input
                                type="date"
                                value={student.dob || ''}
                                disabled
                                className="input"
                                style={{ background: 'var(--color-bg-muted)', cursor: 'not-allowed' }}
                            />
                        </div>

                        <Input
                            label="Blood Group"
                            name="blood_group"
                            value={formData.blood_group}
                            onChange={handleChange}
                            disabled={true}
                            placeholder="e.g., O+, A-, B+"
                        />
                    </div>
                </Card>

                {/* Contact & Academic Info */}
                <Card>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Contact & Academic Information</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <Input
                            label="Phone Number"
                            type="tel"
                            name="phone_no"
                            value={formData.phone_no}
                            onChange={handleChange}
                            disabled={true}
                            placeholder="+91 1234567890"
                        />

                        <Input
                            label="Parent Phone Number"
                            type="tel"
                            name="parent_phone_no"
                            value={formData.parent_phone_no}
                            onChange={handleChange}
                            disabled={true}
                            placeholder="+91 9876543210"
                        />

                        <div>
                            <label className="label">Year</label>
                            <input
                                type="text"
                                value={student.year ? `Year ${student.year}` : 'Not Set'}
                                disabled
                                className="input"
                                style={{ background: 'var(--color-bg-muted)', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div>
                            <label className="label">Residential Status</label>
                            <input
                                type="text"
                                value={student.is_dayscholar ? 'Day Scholar' : 'Hosteller'}
                                disabled
                                className="input"
                                style={{ background: 'var(--color-bg-muted)', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div>
                            <label className="label">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                disabled={true}
                                className="input"
                                rows={3}
                                style={{ resize: 'vertical' }}
                                placeholder="Enter your full address"
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
